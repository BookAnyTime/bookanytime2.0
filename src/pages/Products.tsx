// import { useState, useEffect, useMemo, useRef } from "react";
// import { useSearchParams, useNavigate } from "react-router-dom";
// import axios from "axios";
// import PropertyCard from "@/components/PropertyCard";
// import ProductFilters from "@/pages/ProductFilters";
// import { Button } from "@/components/ui/button";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { MapPin } from "lucide-react";
// import SEO from "@/components/SEO";

// type Property = {
//   _id: string;
//   name: string;
//   category: string;
//   description: string;
//   house_rules: string;
//   minPrice: number;
//   maxPrice: number;
//   city: string;
//   address: string;
//   latitude: string;
//   longitude: string;
//   popularity: number;
//   images: string[];
//   amenities: string[];
//   capacity: { adults: number; bedrooms: number };
//   rating?: number;
//   isWishlisted?: boolean;
//   wishlistName?: string;
// };

// type Filters = {
//   categories: string[];
//   locations: string[];
//   amenities: string[];
//   priceRange: [number, number];
//   radius?: number;
//   userLocation?: { lat: number; lng: number };
//   capacity?: { adults: number; bedrooms: number };
// };

// // Haversine distance
// function getDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
//   const toRad = (val: number) => (val * Math.PI) / 180;
//   const R = 6371;
//   const dLat = toRad(lat2 - lat1);
//   const dLon = toRad(lon2 - lon1);
//   const a =
//     Math.sin(dLat / 2) ** 2 +
//     Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
//   return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
// }

// const Products = () => {
//   const [searchParams] = useSearchParams();
//   const [properties, setProperties] = useState<Property[]>([]);
//   const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
//   const [sortBy, setSortBy] = useState<string>("popular");
//   const [showFilters, setShowFilters] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [activeFilters, setActiveFilters] = useState<Filters>({
//     categories: [],
//     locations: [],
//     amenities: [],
//     priceRange: [0, 1000000],
//     capacity: { adults: 0, bedrooms: 0 },
//     radius: 0,
//     userLocation: null,
//   });

//   const [radiusTouched, setRadiusTouched] = useState(false);

//   const userId = JSON.parse(localStorage.getItem("user") || "{}")?.id;
//   const [categoryFromUrl, setcategoryFromUrl] = useState(
//     searchParams.get("category")
//   );
//   const initialCategoryApplied = useRef(false);
//   const navigate = useNavigate();

//   // Fetch properties
//   useEffect(() => {
//     const fetchProperties = async () => {
//       try {
//          setLoading(true);
//         const response = await axios.get<Property[]>(
//            `${import.meta.env.VITE_API_URL}/api/properties/getall`
//         );
//         const props = response.data;

//         // Fetch ratings
//         const propsWithRatings = await Promise.all(
//           props.map(async (property) => {
//             try {
//               const ratingRes = await axios.get<{ rating?: number }[]>(
//                 `${import.meta.env.VITE_API_URL}/api/ratings/${property._id}`
//               );

//               const ratings = ratingRes.data;
//               const avgRating =
//                 ratings.length > 0
//                 ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
//                 : 5;

//               const roundedRating = Math.round(avgRating * 10) / 10;

//               return { ...property, rating: roundedRating };
//             } catch {
//               return { ...property, rating: 0 };
//             }
//           })
//         );

//         // Wishlist
//         const wishlistedIds: string[] = [];
//         const wishlistMap: Record<string, string[]> = {};
//         if (userId) {
//           try {
//             const wishlistRes = await axios.get(
//               `${import.meta.env.VITE_API_URL}/api/wishlist/${userId}`
//             );
//             const rawWishlists = Array.isArray(wishlistRes.data)
//               ? wishlistRes.data
//               : [];
//             rawWishlists.forEach((wl: any) => {
//               wl.properties.forEach((propId: string) => {
//                 wishlistedIds.push(propId);
//                 if (!wishlistMap[propId]) {
//                   wishlistMap[propId] = [];
//                 }
//                 wishlistMap[propId].push(wl.name);
//               });
//             });
//           } catch (err) {
//             console.error("Failed to fetch wishlist", err);
//           }
//         }

//         const finalProps = propsWithRatings.map((p) => ({
//           ...p,
//           isWishlisted: wishlistedIds.includes(p._id),
//           wishlistName: wishlistMap[p._id] ? wishlistMap[p._id][0] : "",
//         }));

//         setProperties(finalProps);
//         setcategoryFromUrl(searchParams.get("category"))

//       } catch (err) {
//         console.error(err);
//         setError("Failed to load properties. Please try again later.");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchProperties();
//   }, [userId]);

//   useEffect(() => {
//   if (properties.length > 0) {
//     const maxPropertyPrice = Math.max(...properties.map((p) => p.maxPrice), 1000000);
//     setActiveFilters((prev) => ({
//       ...prev,
//       priceRange: [0, maxPropertyPrice],
//     }));
//   }
// }, [properties]);

//   // Extract filters
//   const filterOptions = useMemo(() => {
//     const categories = Array.from(new Set(properties.map((p) => p.category)));
//     const locations = Array.from(new Set(properties.map((p) => p.city)));
//     const amenities = Array.from(
//       new Set(properties.flatMap((p) => p.amenities))
//     );
//     const minPrice = Math.min(...properties.map((p) => p.minPrice), 0);
//     const maxPrice = Math.max(...properties.map((p) => p.maxPrice), 1000000);
//     const maxCapacity = properties.reduce(
//       (acc, p) => ({
//         adults: Math.max(acc.adults, p.capacity.adults),
//         bedrooms: Math.max(acc.bedrooms, p.capacity.bedrooms),
//       }),
//       { adults: 0, bedrooms: 0 }
//     );
//     const maxRadius = 50;
//     return {
//       categories,
//       locations,
//       amenities,
//       minPrice,
//       maxPrice,
//       maxCapacity,
//       maxRadius,
//     };
//   }, [properties]);

//   // Apply URL category once
//   useEffect(() => {
//     if (
//       !initialCategoryApplied.current &&
//       categoryFromUrl &&
//       filterOptions.categories.includes(categoryFromUrl)
//     ) {
//       setActiveFilters((prev) => ({ ...prev, categories: [categoryFromUrl] }));
//       initialCategoryApplied.current = true;
//     }
//   }, [categoryFromUrl, filterOptions.categories]);

//   // Apply filters
//   useEffect(() => {
//     let filtered = [...properties];

//     // Category, locations, amenities
//     if (activeFilters.categories.length)
//       filtered = filtered.filter((p) =>
//         activeFilters.categories.includes(p.category)
//       );
//     if (activeFilters.locations?.length)
//       filtered = filtered.filter((p) =>
//         activeFilters.locations.includes(p.city)
//       );
//     if (activeFilters.amenities?.length)
//       filtered = filtered.filter((p) =>
//         activeFilters.amenities.every((a) => p.amenities.includes(a))
//       );

//     // Price
//     filtered = filtered.filter(
//       (p) =>
//         p.minPrice >= activeFilters.priceRange[0] &&
//         p.maxPrice <= activeFilters.priceRange[1]
//     );

//     // Capacity
//     if (activeFilters.capacity) {
//       const { adults, bedrooms } = activeFilters.capacity;
//       filtered = filtered.filter(
//         (p) =>
//           p.capacity.adults >= adults && p.capacity.bedrooms >= bedrooms
//       );
//     }

//     // Radius filter only if touched
//     if (
//       radiusTouched &&
//       activeFilters.userLocation &&
//       activeFilters.radius &&
//       activeFilters.radius > 0
//     ) {
//       const { lat, lng } = activeFilters.userLocation;
//       filtered = filtered.filter((p) => {
//         if (!p.latitude || !p.longitude) return false;
//         const dist = getDistance(
//           lat,
//           lng,
//           parseFloat(p.latitude),
//           parseFloat(p.longitude)
//         );
//         return dist <= activeFilters.radius!;
//       });
//     }

//     // Sorting
//     switch (sortBy) {
//       case "price-low":
//         filtered.sort((a, b) => a.minPrice - b.minPrice);
//         break;
//       case "price-high":
//         filtered.sort((a, b) => b.maxPrice - a.maxPrice);
//         break;
//       case "rating":
//         filtered.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
//         break;
//       case "popular":
//       default:
//         filtered.sort((a, b) => b.popularity - a.popularity);
//         break;
//     }

//     setFilteredProperties(filtered);
//   }, [properties, activeFilters, sortBy, radiusTouched]);

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <div className="flex flex-col lg:flex-row gap-8">
//         {/* Filters */}
//         <div className="lg:w-80">
//           <div className="lg:hidden mb-4">
//             <Button
//               variant="outline"
//               onClick={() => setShowFilters(!showFilters)}
//               className="w-full"
//             >
//               {showFilters ? "Hide Filters" : "Show Filters"}
//             </Button>
//           </div>
//           <div className={`${showFilters ? "block" : "hidden"} lg:block`}>
//             <ProductFilters
//               filterOptions={filterOptions}
//               activeFilters={activeFilters}
//               onFiltersChange={(filters) => {
//                 setActiveFilters(filters);
//                 setcategoryFromUrl("");
//                 setRadiusTouched(true);
//               }}
//             />
//           </div>
//         </div>

//         {/* Properties + Controls */}
//         <div className="flex-1">
//           <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
//             <div>
//               <h1 className="text-3xl font-bold text-foreground mb-2">
//                 {categoryFromUrl
//                   ? `${categoryFromUrl.charAt(0).toUpperCase() +
//                       categoryFromUrl.slice(1)}s`
//                   : "All Properties"}
//               </h1>
//               <p className="text-muted-foreground">
//                 {filteredProperties.length} properties found
//               </p>
//             </div>

//             {/* Controls: Sort + Map */}
//             <div className="flex gap-3 items-center">
//               <Select value={sortBy} onValueChange={(val) => setSortBy(val)}>
//                 <SelectTrigger className="w-[160px]">
//                   <SelectValue placeholder="Sort by" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="popular">Most Popular</SelectItem>
//                   <SelectItem value="price-low">Price: Low to High</SelectItem>
//                   <SelectItem value="price-high">Price: High to Low</SelectItem>
//                   <SelectItem value="rating">Highest Rated</SelectItem>
//                 </SelectContent>
//               </Select>

//               <Button
//                 variant="secondary"
//                 className="flex items-center gap-2"
//                 onClick={() =>
//                   navigate("/maps", { state: { properties: filteredProperties } })
//                   // window.open("/maps", "_blank")
//                 }
//               >
//                 <MapPin className="w-4 h-4" />
//                 View in Map
//               </Button>
//             </div>
//           </div>

//           {/* Properties Grid */}
//           {loading && (
//             <p className="text-center py-12 text-lg text-muted-foreground">
//               Loading properties...
//             </p>
//           )}
//           {error && (
//             <p className="text-center py-12 text-lg text-red-500">{error}</p>
//           )}

//           {!loading && !error && filteredProperties.length > 0 && (
//             <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
//               {filteredProperties.map((property) => (
//                 <PropertyCard key={property._id} property={property} />
//               ))}
//             </div>
//           )}

//           {!loading && !error && filteredProperties.length === 0 && (
//             <div className="text-center py-12">
//               <p className="text-lg text-muted-foreground">
//                 No properties match your criteria.
//               </p>
//               <p className="text-muted-foreground">Try adjusting your filters.</p>
//             </div>
//           )}
//         </div>
//       </div>

//       <SEO
//         title="All Properties for Rent in Hyderabad | BookAnytime"
//         description="View all available properties for rent in Hyderabad. Farmhouses, villas, and luxury stays with instant booking on BookAnytime."
//         keywords="Hyderabad rental properties, BookAnytime Hyderabad, villas for rent Hyderabad, farmhouses Hyderabad"
//         url={`${import.meta.env.VITE_URL}/product`}
//       />
//     </div>
//   );
// };

// export default Products;

import { useState, useEffect, useMemo, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import PropertyCard from "@/components/PropertyCard";
import ProductFilters from "@/pages/ProductFilters";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MapPin } from "lucide-react";
import SEO from "@/components/SEO";

type Property = {
  _id: string;
  name: string;
  category: string;
  description: string;
  house_rules: string;
  minPrice: number;
  maxPrice: number;
  city: string;
  address: string;
  latitude: string;
  longitude: string;
  popularity: number;
  images: string[];
  amenities: string[];
  capacity: { adults: number; bedrooms: number };
  rating?: number;
  isWishlisted?: boolean;
  wishlistName?: string;
  offers?: string[]; // ✅ Added offers array
};

type Offer = {
  _id: string;
  name: string;
  category: string;
  properties: Array<{
    _id: string;
    name: string;
  }>;
  image: string[];
  startDate: string;
  endDate: string;
};

type Filters = {
  categories: string[];
  locations: string[];
  amenities: string[];
  offers: string[]; // ✅ Added offers filter
  priceRange: [number, number];
  radius?: number;
  userLocation?: { lat: number; lng: number };
  capacity?: { adults: number; bedrooms: number };
};

// Haversine distance
function getDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const toRad = (val: number) => (val * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

const Products = () => {
  const [searchParams] = useSearchParams();
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]); // ✅ Added offers state
  const [sortBy, setSortBy] = useState<string>("popular");
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilters, setActiveFilters] = useState<Filters>({
    categories: [],
    locations: [],
    amenities: [],
    offers: [], // ✅ Added offers to initial state
    priceRange: [0, 1000000],
    capacity: { adults: 0, bedrooms: 0 },
    radius: 0,
    userLocation: null,
  });

  const [radiusTouched, setRadiusTouched] = useState(false);

  const userId = JSON.parse(localStorage.getItem("user") || "{}")?.id;
  const [categoryFromUrl, setcategoryFromUrl] = useState(
    searchParams.get("category")
  );
  const initialCategoryApplied = useRef(false);
  const navigate = useNavigate();

  // ✅ Function to get active offers for a property
  const getActiveOffersForProperty = (
    propertyId: string,
    propertyCategory: string,
    availableOffers: Offer[]
  ): string[] => {
    const currentDate = new Date();
    console.log(
      `Checking offers for property ${propertyId} with category ${propertyCategory}`
    );

    const activeOffers = availableOffers
      .filter((offer) => {
        const startDate = new Date(offer.startDate);
        const endDate = new Date(offer.endDate);
        const isActive = currentDate >= startDate && currentDate <= endDate;
        const hasProperty = offer.properties.some(
          (prop) => prop._id === propertyId
        );
        const categoryMatches = offer.category === propertyCategory;

        console.log(
          `Offer ${offer.name}: active=${isActive}, hasProperty=${hasProperty}, categoryMatches=${categoryMatches}`
        );

        return isActive && hasProperty && categoryMatches;
      })
      .map((offer) => `${offer.name} - ${offer.category}`); // ✅ Combine offer name and category

    console.log(`Active offers for property ${propertyId}:`, activeOffers);
    return activeOffers;
  };

  // Fetch properties and offers together
  useEffect(() => {
    const fetchPropertiesAndOffers = async () => {
      try {
        setLoading(true);

        // ✅ Fetch both properties and offers simultaneously
        const [propertiesResult, offersResult] = await Promise.allSettled([
          axios.get<Property[]>(
            `${import.meta.env.VITE_API_URL}/api/properties/getall`
          ),
          axios.get<Offer[]>(
            `${import.meta.env.VITE_API_URL}/api/offers/active`
          ),
        ]);

        // properties
        let properties: Property[] = [];
        if (propertiesResult.status === "fulfilled") {
          properties = propertiesResult.value.data;
        } else {
          console.error("Failed to fetch properties:", propertiesResult.reason);
        }

        // offers
        let offers: Offer[] = [];
        if (offersResult.status === "fulfilled") {
          offers = offersResult.value.data;
        } else {
          console.error("Failed to fetch offers:", offersResult.reason);
        }

        const props = properties;
        const fetchedOffers = offers;

        console.log("Fetched offers:", fetchedOffers);
        setOffers(fetchedOffers);

        // Fetch ratings
        const propsWithRatings = await Promise.all(
          props.map(async (property) => {
            try {
              const ratingRes = await axios.get<{ rating?: number }[]>(
                `${import.meta.env.VITE_API_URL}/api/ratings/${property._id}`
              );

              const ratings = ratingRes.data;
              const avgRating =
                ratings.length > 0
                  ? ratings.reduce((sum, r) => sum + r.rating, 0) /
                    ratings.length
                  : 5;

              const roundedRating = Math.round(avgRating * 10) / 10;

              return { ...property, rating: roundedRating };
            } catch {
              return { ...property, rating: 0 };
            }
          })
        );

        // Wishlist
        const wishlistedIds: string[] = [];
        const wishlistMap: Record<string, string[]> = {};
        if (userId) {
          try {
            const wishlistRes = await axios.get(
              `${import.meta.env.VITE_API_URL}/api/wishlist/${userId}`
            );
            const rawWishlists = Array.isArray(wishlistRes.data)
              ? wishlistRes.data
              : [];
            rawWishlists.forEach((wl: any) => {
              wl.properties.forEach((propId: string) => {
                wishlistedIds.push(propId);
                if (!wishlistMap[propId]) {
                  wishlistMap[propId] = [];
                }
                wishlistMap[propId].push(wl.name);
              });
            });
          } catch (err) {
            console.error("Failed to fetch wishlist", err);
          }
        }

        // ✅ Add offers to each property using the fetched offers
        const finalProps = propsWithRatings.map((p) => {
          const propertyOffers = getActiveOffersForProperty(
            p._id,
            p.category,
            fetchedOffers
          );
          console.log(
            `Property ${p.name} (${p.category}) offers:`,
            propertyOffers
          );

          return {
            ...p,
            isWishlisted: wishlistedIds.includes(p._id),
            wishlistName: wishlistMap[p._id] ? wishlistMap[p._id][0] : "",
            offers: propertyOffers, // ✅ Add offers array
          };
        });

        console.log("Final properties with offers:", finalProps);
        setProperties(finalProps);
        setcategoryFromUrl(searchParams.get("category"));
      } catch (err) {
        console.error(err);
        setError("Failed to load properties. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchPropertiesAndOffers();
  }, [userId]); // ✅ Removed offers dependency since we fetch them together

  useEffect(() => {
    if (properties.length > 0) {
      const maxPropertyPrice = Math.max(
        ...properties.map((p) => p.maxPrice),
        1000000
      );
      setActiveFilters((prev) => ({
        ...prev,
        priceRange: [0, maxPropertyPrice],
      }));
    }
  }, [properties]);

  // Extract filters
  const filterOptions = useMemo(() => {
    const categories = Array.from(new Set(properties.map((p) => p.category)));
    const locations = Array.from(new Set(properties.map((p) => p.city)));
    const amenities = Array.from(
      new Set(properties.flatMap((p) => p.amenities))
    );
    // ✅ Extract unique offer names with category from active offers
    const offerNames = Array.from(
      new Set(
        offers
          .filter((offer) => {
            const startDate = new Date(offer.startDate);
            const endDate = new Date(offer.endDate);
            const currentDate = new Date();
            return currentDate >= startDate && currentDate <= endDate;
          })
          .map((offer) => `${offer.name} - ${offer.category}`)
      )
    );
    console.log("Available offer filter options:", offerNames);
    const minPrice = Math.min(...properties.map((p) => p.minPrice), 0);
    const maxPrice = Math.max(...properties.map((p) => p.maxPrice), 1000000);
    const maxCapacity = properties.reduce(
      (acc, p) => ({
        adults: Math.max(acc.adults, p.capacity.adults),
        bedrooms: Math.max(acc.bedrooms, p.capacity.bedrooms),
      }),
      { adults: 0, bedrooms: 0 }
    );
    const maxRadius = 50;
    return {
      categories,
      locations,
      amenities,
      offers: offerNames, // ✅ Added offers to filter options
      minPrice,
      maxPrice,
      maxCapacity,
      maxRadius,
    };
  }, [properties, offers]); // ✅ Added offers as dependency

  // Apply URL category once
  useEffect(() => {
    if (
      !initialCategoryApplied.current &&
      categoryFromUrl &&
      filterOptions.categories.includes(categoryFromUrl)
    ) {
      setActiveFilters((prev) => ({ ...prev, categories: [categoryFromUrl] }));
      initialCategoryApplied.current = true;
    }
  }, [categoryFromUrl, filterOptions.categories]);

  // Apply filters
  useEffect(() => {
    let filtered = [...properties];

    // Category, locations, amenities
    if (activeFilters.categories.length)
      filtered = filtered.filter((p) =>
        activeFilters.categories.includes(p.category)
      );
    if (activeFilters.locations?.length)
      filtered = filtered.filter((p) =>
        activeFilters.locations.includes(p.city)
      );
    if (activeFilters.amenities?.length)
      filtered = filtered.filter((p) =>
        activeFilters.amenities.every((a) => p.amenities.includes(a))
      );

    // ✅ Offers filter
    if (activeFilters.offers?.length) {
      filtered = filtered.filter((p) =>
        activeFilters.offers.some((selectedOffer) =>
          p.offers?.includes(selectedOffer)
        )
      );
    }

    // Price
    filtered = filtered.filter(
      (p) =>
        p.minPrice >= activeFilters.priceRange[0] &&
        p.maxPrice <= activeFilters.priceRange[1]
    );

    // Capacity
    if (activeFilters.capacity) {
      const { adults, bedrooms } = activeFilters.capacity;
      filtered = filtered.filter(
        (p) => p.capacity.adults >= adults && p.capacity.bedrooms >= bedrooms
      );
    }

    // Radius filter only if touched
    if (
      radiusTouched &&
      activeFilters.userLocation &&
      activeFilters.radius &&
      activeFilters.radius > 0
    ) {
      const { lat, lng } = activeFilters.userLocation;
      filtered = filtered.filter((p) => {
        if (!p.latitude || !p.longitude) return false;
        const dist = getDistance(
          lat,
          lng,
          parseFloat(p.latitude),
          parseFloat(p.longitude)
        );
        return dist <= activeFilters.radius!;
      });
    }

    // Sorting
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.minPrice - b.minPrice);
        break;
      case "price-high":
        filtered.sort((a, b) => b.maxPrice - a.maxPrice);
        break;
      case "rating":
        filtered.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
        break;
      case "popular":
      default:
        filtered.sort((a, b) => b.popularity - a.popularity);
        break;
    }

    setFilteredProperties(filtered);
  }, [properties, activeFilters, sortBy, radiusTouched]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters */}
        <div className="lg:w-80">
          <div className="lg:hidden mb-4">
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="w-full"
            >
              {showFilters ? "Hide Filters" : "Show Filters"}
            </Button>
          </div>
          <div className={`${showFilters ? "block" : "hidden"} lg:block`}>
            <ProductFilters
              filterOptions={filterOptions}
              activeFilters={activeFilters}
              onFiltersChange={(filters) => {
                setActiveFilters(filters);
                setcategoryFromUrl("");
                setRadiusTouched(true);
              }}
            />
          </div>
        </div>

        {/* Properties + Controls */}
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                {categoryFromUrl
                  ? `${
                      categoryFromUrl.charAt(0).toUpperCase() +
                      categoryFromUrl.slice(1)
                    }s`
                  : "All Properties"}
              </h1>
              <p className="text-muted-foreground">
                {filteredProperties.length} properties found
              </p>
            </div>

            {/* Controls: Sort + Map */}
            <div className="flex gap-3 items-center">
              <Select value={sortBy} onValueChange={(val) => setSortBy(val)}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popular">Most Popular</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="secondary"
                className="flex items-center gap-2"
                onClick={
                  () =>
                    navigate("/maps", {
                      state: { properties: filteredProperties },
                    })
                  // window.open("/maps", "_blank")
                }
              >
                <MapPin className="w-4 h-4" />
                View in Map
              </Button>
            </div>
          </div>

          {/* Properties Grid */}
          {loading && (
            <p className="text-center py-12 text-lg text-muted-foreground">
              Loading properties...
            </p>
          )}
          {error && (
            <p className="text-center py-12 text-lg text-red-500">{error}</p>
          )}

          {!loading && !error && filteredProperties.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProperties.map((property) => (
                <PropertyCard key={property._id} property={property} />
              ))}
            </div>
          )}

          {!loading && !error && filteredProperties.length === 0 && (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground">
                No properties match your criteria.
              </p>
              <p className="text-muted-foreground">
                Try adjusting your filters.
              </p>
            </div>
          )}
        </div>
      </div>

      <SEO
        title="All Properties for Rent in Hyderabad | BookAnytime"
        description="View all available properties for rent in Hyderabad. Farmhouses, villas, and luxury stays with instant booking on BookAnytime."
        keywords="Hyderabad rental properties, BookAnytime Hyderabad, villas for rent Hyderabad, farmhouses Hyderabad"
        url={`${import.meta.env.VITE_URL}/product`}
      />
    </div>
  );
};

export default Products;
