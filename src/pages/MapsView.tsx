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
import { Menu, Target, X } from "lucide-react"; // toggle icons
import SEO from "@/components/SEO";

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
  const [isRadiusActive, setIsRadiusActive] = useState(true);
  const [activeProperty, setActiveProperty] = useState<Property | null>(null);
  const [showList, setShowList] = useState(false);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setCenter({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        },
        () => setCenter({ lat: 17.385044, lng: 78.486671 }) // fallback
      );
    } else {
      setCenter({ lat: 17.385044, lng: 78.486671 });
    }
  }, []);

  useEffect(() => {
    axios
      .get<Property[]>(`${import.meta.env.VITE_API_URL}/api/properties/getall`)
      .then((res) => setProperties(res.data))
      .catch((err) => console.error(err));
  }, []);

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
      Math.sin(dLat / 2) ** 2 +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  };

  const filteredProperties = properties.filter((p) => {
    if (!isRadiusActive) return true;
    const lat = parseFloat(p.latitude);
    const lng = parseFloat(p.longitude);
    if (!lat || !lng || !center) return false;
    return getDistance(center.lat, center.lng, lat, lng) <= radius;
  });

  return (
    <div className="w-full h-screen flex flex-col md:flex-row">
      {/* Map */}
      <div className="flex-1 h-2/3 md:h-full relative">
        {/* Radius + View All */}
        <div className="absolute top-4 left-4 right-4 md:left-4 md:right-auto bg-white shadow-md rounded-lg p-3 z-10 w-auto md:w-48 flex flex-col md:flex-col gap-2">
          <p className="text-sm font-semibold mb-2">Radius: {radius} km</p>

          {/* Slider and Button in one row */}
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <Slider
                defaultValue={[10]}
                min={1}
                max={100}
                step={1}
                value={[radius]}
                onValueChange={(val) => {
                  setRadius(val[0]);
                  setIsRadiusActive(true); // reactivate radius filter
                }}
              />
            </div>
            <Button
              size="sm"
              variant={isRadiusActive ? "outline" : "default"}
              className="whitespace-nowrap text-xs flex-shrink-0"
              onClick={() => setIsRadiusActive(false)}
            >
              View All
            </Button>
          </div>
        </div>

        {/* Mobile toggle */}
        <Button
          className="absolute top-4 right-4 z-20 md:hidden p-2"
          variant="outline"
          size="icon"
          onClick={() => setShowList((prev) => !prev)}
        >
          {showList ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>

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
            {isRadiusActive && (
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
            )}

            <Marker
              position={center}
              icon={{
                url: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
                scaledSize: new window.google.maps.Size(42, 42),
              }}
            />

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
                    onClick={() => window.open(`/property/${activeProperty._id}`, "_blank")}
                  >
                    View
                  </Button>
                </div>
              </InfoWindow>
            )}
          </GoogleMap>
        )}
      </div>

      {/* Drawer / Sidebar */}
      <div
        className={`bg-gray-50 border-t md:border-l p-4 w-full md:w-1/3 h-1/2 md:h-full overflow-y-auto fixed bottom-0 left-0 md:static z-30 transition-transform duration-300 ${
          showList ? "translate-y-0" : "translate-y-full md:translate-y-0"
        } rounded-t-lg md:rounded-none`}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">
            Properties {isRadiusActive ? `in ${radius} km` : "(All)"}
          </h3>
          <Button
            size="sm"
            variant="outline"
            onClick={() => navigate("/products")}
          >
            View Grid
          </Button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-1 gap-4">
          {filteredProperties.map((p) => (
            <div
              key={p._id}
              className="bg-white border rounded-xl p-3 shadow-sm hover:shadow-md transition cursor-pointer"
              onClick={() => window.open(`/property/${p._id}`, "_blank")}
            >
              <img
                src={p.images?.[0] || "/placeholder.jpg"}
                alt={p.name}
                className="w-full h-24 sm:h-28 object-cover rounded-lg mb-2"
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

      <SEO
        title="All Properties for Rent in Hyderabad in maps view | BookAnytime"
        description="View all available properties for rent in Hyderabad. Farmhouses, villas, and luxury stays with instant booking on BookAnytime."
        keywords="Hyderabad rental properties in map view, BookAnytime Hyderabad in map view, villas for rent Hyderabad in map view, farmhouses Hyderabad in map view, rental maps, bookanytime maps, bookanytime rental maps"
        url={`${import.meta.env.VITE_URL}/maps`}
      />
    </div>
  );
};

export default MapsView;
