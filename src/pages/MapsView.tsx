import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  GoogleMap,
  Marker,
  InfoWindow,
  Circle,
  useJsApiLoader,
} from "@react-google-maps/api";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";

interface Property {
  _id: string;
  name: string;
  city: string;
  address: string;
  latitude: string;
  longitude: string;
  minPrice: number;
  images: string[];
}

const MapsView = () => {
  const navigate = useNavigate();
  const [properties, setProperties] = useState<Property[]>([]);
  const [center, setCenter] = useState<{ lat: number; lng: number } | null>(
    null
  );
  const [radius, setRadius] = useState<number>(10);
  const [activeProperty, setActiveProperty] = useState<Property | null>(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  // ✅ Get device location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setCenter({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        },
        () => setCenter({ lat: 17.385044, lng: 78.486671 }) // fallback Hyderabad
      );
    } else {
      setCenter({ lat: 17.385044, lng: 78.486671 });
    }
  }, []);

  // ✅ Fetch properties
  useEffect(() => {
    axios
      .get<Property[]>(`${import.meta.env.VITE_API_URL}/api/properties/getall`)
      .then((res) => setProperties(res.data))
      .catch((err) => console.error("Error fetching properties:", err));
  }, []);

  // ✅ Haversine distance
  const getDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ) => {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  };

  // ✅ Filter by radius
  const filteredProperties = properties.filter((p) => {
    const lat = parseFloat(p.latitude);
    const lng = parseFloat(p.longitude);
    if (!lat || !lng || !center) return false;
    return getDistance(center.lat, center.lng, lat, lng) <= radius;
  });

  return (
    <div className="w-full h-screen flex">
      {/* Left: Map */}
      <div className="w-2/3 h-full relative">
        {/* Radius Slider */}
        <div className="absolute top-4 left-4 bg-white shadow-md rounded-lg p-3 z-10 w-48">
          <p className="text-sm font-semibold mb-2">Radius: {radius} km</p>
          <Slider
            defaultValue={[10]}
            min={1}
            max={100}
            step={1}
            value={[radius]}
            onValueChange={(val) => setRadius(val[0])}
          />
        </div>

        {isLoaded && center && (
          <GoogleMap
            center={center}
            zoom={12}
            mapContainerClassName="w-full h-full"
            onClick={(e) =>
              e.latLng &&
              setCenter({ lat: e.latLng.lat(), lng: e.latLng.lng() })
            }
          >
            {/* Draw Circle */}
            <Circle
              center={center}
              radius={radius * 1000}
              options={{
                fillColor: "#3b82f6",
                fillOpacity: 0.1,
                strokeColor: "#3b82f6",
                strokeOpacity: 0.6,
              }}
            />

            {/* Center Marker */}
            <Marker
              position={center}
              icon={{
                url: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
                scaledSize: new window.google.maps.Size(42, 42),
              }}
            />

            {/* Property Markers */}
            {filteredProperties.map((property) => {
              const lat = parseFloat(property.latitude);
              const lng = parseFloat(property.longitude);
              if (!lat || !lng) return null;

              return (
                <Marker
                  key={property._id}
                  position={{ lat, lng }}
                  label={{
                    text: `₹${property.minPrice}`,
                    fontSize: "12px",
                    fontWeight: "bold",
                    color: "#000",
                  }}
                  icon={{
                    url: "https://maps.google.com/mapfiles/ms/icons/black-dot.png",
                    scaledSize: new window.google.maps.Size(12, 12),
                  }}
                  onMouseOver={() => setActiveProperty(property)}
                  onClick={() => setActiveProperty(property)}
                />
              );
            })}

            {/* Hover Info */}
            {activeProperty && (
              <InfoWindow
                position={{
                  lat: parseFloat(activeProperty.latitude),
                  lng: parseFloat(activeProperty.longitude),
                }}
                onCloseClick={() => setActiveProperty(null)}
              >
                <div className="p-2 w-56">
                  <img
                    src={activeProperty.images?.[0] || "/placeholder.jpg"}
                    alt={activeProperty.name}
                    className="w-full h-24 object-cover rounded-md mb-2"
                  />
                  <h3 className="text-sm font-bold">{activeProperty.name}</h3>
                  <p className="text-xs text-gray-600">{activeProperty.city}</p>
                  <p className="text-sm font-semibold mt-1">
                    ₹{activeProperty.minPrice}/night
                  </p>
                  <Button
                    size="sm"
                    className="w-full mt-2"
                    onClick={() => navigate(`/property/${activeProperty._id}`)}
                  >
                    View
                  </Button>
                </div>
              </InfoWindow>
            )}
          </GoogleMap>
        )}
      </div>

      {/* Right: Property List */}
      <div className="w-1/3 h-full overflow-y-auto border-l bg-gray-50 p-4">
        {/* Header with toggle */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">
            Properties in {radius} km
          </h3>
          <Button
            size="sm"
            variant="outline"
            onClick={() =>
              // navigate("/products")
              window.open("/products", "_blank")
            }
          >
            view in Grid
          </Button>
        </div>

        {/* Property Cards */}
        <div
          className={"grid grid-cols-2 gap-4"}
        >
          {filteredProperties.map((p) => (
            <div
              key={p._id}
              className="bg-white border rounded-xl p-3 shadow-sm hover:shadow-md transition cursor-pointer"
              onClick={() => navigate(`/property/${p._id}`)}
            >
              <img
                src={p.images?.[0] || "/placeholder.jpg"}
                alt={p.name}
                className="w-full h-28 object-cover rounded-lg mb-2"
              />
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-bold truncate">{p.name}</p>
                  <p className="text-xs text-gray-500">{p.city}</p>
                </div>
                <span className="text-sm font-semibold text-blue-600">
                  ₹{p.minPrice}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MapsView;
