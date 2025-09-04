
// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import {
//   GoogleMap,
//   Marker,
//   InfoWindow,
//   Circle,
//   useJsApiLoader,
// } from "@react-google-maps/api";
// import { Button } from "@/components/ui/button";

// interface Property {
//   _id: string;
//   name: string;
//   city: string;
//   address: string;
//   latitude: string;
//   longitude: string;
//   minPrice: number;
//   images: string[];
// }

// const MapsView = () => {
//   const navigate = useNavigate();
//   const [properties, setProperties] = useState<Property[]>([]);
//   const [center, setCenter] = useState<{ lat: number; lng: number } | null>(null);
//   const [radius, setRadius] = useState<number>(10);
//   const [activeProperty, setActiveProperty] = useState<Property | null>(null);
//   const [showList, setShowList] = useState<boolean>(false);

//   // ✅ Load Google Maps API
//   const { isLoaded } = useJsApiLoader({
//     googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
//   });

//   // ✅ Get device location
//   useEffect(() => {
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         (pos) => {
//           setCenter({ lat: pos.coords.latitude, lng: pos.coords.longitude });
//         },
//         () => setCenter({ lat: 17.385044, lng: 78.486671 }) // fallback Hyderabad
//       );
//     } else {
//       setCenter({ lat: 17.385044, lng: 78.486671 });
//     }

//     window.scrollTo({
//       top: 0,
//       behavior: "smooth", // smooth scroll, optional
//     });

//   }, []);

//   // ✅ Fetch properties
//   useEffect(() => {
//     axios
//       .get<Property[]>(`${import.meta.env.VITE_API_URL}/api/properties/getall`)
//       .then((res) => setProperties(res.data))
//       .catch((err) => console.error("Error fetching properties:", err));
//   }, []);

//   // ✅ Haversine distance
//   const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
//     const R = 6371;
//     const dLat = ((lat2 - lat1) * Math.PI) / 180;
//     const dLon = ((lon2 - lon1) * Math.PI) / 180;
//     const a =
//       Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//       Math.cos((lat1 * Math.PI) / 180) *
//         Math.cos((lat2 * Math.PI) / 180) *
//         Math.sin(dLon / 2) *
//         Math.sin(dLon / 2);
//     return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//   };

//   // ✅ Filter by radius
//   const filteredProperties = properties.filter((p) => {
//     const lat = parseFloat(p.latitude);
//     const lng = parseFloat(p.longitude);
//     if (!lat || !lng || !center) return false;
//     return getDistance(center.lat, center.lng, lat, lng) <= radius;
//   });

//   return (
//     <div className="w-full h-screen relative">
//       {/* Radius & Toggle Buttons */}
//       <div className="absolute top-4 left-4 z-10 bg-white shadow-md rounded-lg p-2 flex space-x-2">
//         {[2, 5, 8, 10, 20, 50, 100].map((r) => (
//           <Button
//             key={r}
//             size="sm"
//             variant={radius === r ? "default" : "outline"}
//             onClick={() => setRadius(r)}
//           >
//             {r} km
//           </Button>
//         ))}
//         <Button size="sm" variant="secondary" onClick={() => setShowList(!showList)}>
//           {showList ? "Hide List" : "Show All in Range"}
//         </Button>
//       </div>

//       {/* Google Map */}
//       {isLoaded && center && (
//         <GoogleMap
//           center={center}
//           zoom={12}
//           mapContainerClassName="w-full h-full"
//           onClick={(e) =>
//             e.latLng && setCenter({ lat: e.latLng.lat(), lng: e.latLng.lng() })
//           }
//         >
//           {/* Draw Circle */}
//           <Circle
//             center={center}
//             radius={radius * 1000}
//             options={{
//               fillColor: "#3b82f6",
//               fillOpacity: 0.1,
//               strokeColor: "#3b82f6",
//               strokeOpacity: 0.6,
//             }}
//           />

//           {/* Property Markers */}
//           {filteredProperties.map((property) => {
//             const lat = parseFloat(property.latitude);
//             const lng = parseFloat(property.longitude);
//             if (!lat || !lng) return null;

//             return (
//               <Marker
//                 key={property._id}
//                 position={{ lat, lng }}
//                 icon={{
//                   url: "https://maps.google.com/mapfiles/kml/shapes/homegardenbusiness.png",
//                   scaledSize: new window.google.maps.Size(32, 32),
//                 }}
//                 onMouseOver={() => setActiveProperty(property)}
//                 onClick={() => setActiveProperty(property)}
//               />
//             );
//           })}

//           {/* Active Property InfoWindow */}
//           {activeProperty && (
//             <InfoWindow
//               position={{
//                 lat: parseFloat(activeProperty.latitude),
//                 lng: parseFloat(activeProperty.longitude),
//               }}
//               onCloseClick={() => setActiveProperty(null)}
//             >
//               <div className="p-2 w-52">
//                 <img
//                   src={activeProperty.images?.[0] || "/placeholder.jpg"}
//                   alt={activeProperty.name}
//                   className="w-full h-24 object-cover rounded-md mb-2"
//                 />
//                 <h3 className="text-sm font-bold">{activeProperty.name}</h3>
//                 <p className="text-xs text-gray-600">{activeProperty.city}</p>
//                 <p className="text-sm font-semibold mt-1">
//                   ₹{activeProperty.minPrice}/night
//                 </p>
//                 <Button
//                   size="sm"
//                   className="w-full mt-2"
//                   onClick={() => navigate(`/property/${activeProperty._id}`)}
//                 >
//                   View
//                 </Button>
//               </div>
//             </InfoWindow>
//           )}
//         </GoogleMap>
//       )}

//       {/* List of All in Range */}
//       {showList && (
//         <div className="absolute bottom-0 left-0 right-0 bg-white max-h-60 overflow-y-auto shadow-lg p-4 z-20">
//           <h3 className="text-lg font-semibold mb-2">Properties in {radius} km</h3>
//           <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
//             {filteredProperties.map((p) => (
//               <div
//                 key={p._id}
//                 className="border rounded-lg p-2 cursor-pointer hover:shadow"
//                 onClick={() => navigate(`/property/${p._id}`)}
//               >
//                 <img
//                   src={p.images?.[0] || "/placeholder.jpg"}
//                   alt={p.name}
//                   className="w-full h-20 object-cover rounded mb-1"
//                 />
//                 <p className="text-sm font-bold truncate">{p.name}</p>
//                 <p className="text-xs text-gray-500">₹{p.minPrice}/night</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default MapsView;


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
  const [showList, setShowList] = useState<boolean>(false);

  // ✅ Load Google Maps API
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

    window.scrollTo({
      top: 0,
      behavior: "smooth", // smooth scroll, optional
    });
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
    <div className="w-full h-screen relative">
      {/* Radius & Toggle Buttons */}
      {/* Radius & Toggle Buttons */}
      <div className="absolute top-4 left-0 right-0 z-10 px-4">
        <div className="bg-white shadow-md rounded-lg p-2 flex space-x-2 overflow-x-auto no-scrollbar">
          {[2, 5, 8, 10, 20, 50, 100].map((r) => (
            <Button
              key={r}
              size="sm"
              variant={radius === r ? "default" : "outline"}
              className="flex-shrink-0"
              onClick={() => setRadius(r)}
            >
              {r} km
            </Button>
          ))}
          <Button
            size="sm"
            variant="secondary"
            className="flex-shrink-0"
            onClick={() => setShowList(!showList)}
          >
            {showList ? "Hide List" : "Show All in Range"}
          </Button>
        </div>
      </div>

      {/* Google Map */}
      {isLoaded && center && (
        <GoogleMap
          center={center}
          zoom={12}
          mapContainerClassName="w-full h-full"
          onClick={(e) =>
            e.latLng && setCenter({ lat: e.latLng.lat(), lng: e.latLng.lng() })
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

          {/* Property Markers */}
          {filteredProperties.map((property) => {
            const lat = parseFloat(property.latitude);
            const lng = parseFloat(property.longitude);
            if (!lat || !lng) return null;

            return (
              <Marker
                key={property._id}
                position={{ lat, lng }}
                icon={{
                  url: "https://maps.google.com/mapfiles/kml/shapes/homegardenbusiness.png",
                  scaledSize: new window.google.maps.Size(32, 32),
                }}
                onMouseOver={() => setActiveProperty(property)}
                onClick={() => setActiveProperty(property)}
              />
            );
          })}

          {/* Active Property InfoWindow */}
          {activeProperty && (
            <InfoWindow
              position={{
                lat: parseFloat(activeProperty.latitude),
                lng: parseFloat(activeProperty.longitude),
              }}
              onCloseClick={() => setActiveProperty(null)}
            >
              <div className="p-2 w-52">
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

      {/* List of All in Range */}
      {showList && (
        <div className="absolute bottom-0 left-0 right-0 bg-white max-h-60 overflow-y-auto shadow-lg p-4 z-20">
          <h3 className="text-lg font-semibold mb-2">
            Properties in {radius} km
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {filteredProperties.map((p) => (
              <div
                key={p._id}
                className="border rounded-lg p-2 cursor-pointer hover:shadow"
                onClick={() => navigate(`/property/${p._id}`)}
              >
                <img
                  src={p.images?.[0] || "/placeholder.jpg"}
                  alt={p.name}
                  className="w-full h-20 object-cover rounded mb-1"
                />
                <p className="text-sm font-bold truncate">{p.name}</p>
                <p className="text-xs text-gray-500">₹{p.minPrice}/night</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MapsView;

