
import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
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
  capacity: {
    adults: number;
    bedrooms: number;
  };
  whatsappNumber?: string;
  instagram?: string;
  rating?: number;
  isWishlisted?: boolean;
  wishlistName?: string;
};

type Filters = {
  categories: string[];
  locations: string[];
  amenities: string[];
  priceRange: [number, number];
};

const Products = () => {
  const [searchParams] = useSearchParams();
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [sortBy, setSortBy] = useState<string>("popular");
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilters, setActiveFilters] = useState<Filters>({
    categories: [],
    locations: [],
    amenities: [],
    priceRange: [0, 1000000],
  });
  const userId = JSON.parse(localStorage.getItem("user"))?.id;

  const categoryFromUrl = searchParams.get("category");

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth", // smooth scroll, optional
    });
  }, []);

  // Fetch properties & ratings
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        const response = await axios.get<Property[]>(
          "http://localhost:3000/api/properties/getall"
        );
        const props = response.data;

        // Fetch ratings
        const propsWithRatings = await Promise.all(
          props.map(async (property) => {
            try {
              const ratingRes = await axios.get<{ rating?: number }>(
                `${import.meta.env.VITE_API_URL}/api/ratings/${property._id}`
              );
              return { ...property, rating: ratingRes.data?.rating ?? 0 };
            } catch {
              return { ...property, rating: 0 };
            }
          })
        );

        // Wishlist
        let wishlistedIds: string[] = [];
        let wishlistMap: Record<string, string[]> = {};
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

        const finalProps = propsWithRatings.map((p) => ({
          ...p,
          isWishlisted: wishlistedIds.includes(p._id),
          wishlistName: wishlistMap[p._id] ? wishlistMap[p._id][0] : "",
        }));

        setProperties(finalProps);
        setError(null);
      } catch (err) {
        console.error(err);
        setError("Failed to load properties. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [userId]);

  // Extract unique filters
  const filterOptions = useMemo(() => {
    const categories = Array.from(new Set(properties.map((p) => p.category)));
    const locations = Array.from(new Set(properties.map((p) => p.city)));
    const amenities = Array.from(
      new Set(properties.flatMap((p) => p.amenities))
    );

    const minPrice = Math.min(...properties.map((p) => p.minPrice));
    const maxPrice = Math.max(...properties.map((p) => p.maxPrice));

    return { categories, locations, amenities, minPrice, maxPrice };
  }, [properties]);

  // Apply filters
  useEffect(() => {
    let filtered = [...properties];

    // URL category preselect
    if (categoryFromUrl) {
      filtered = filtered.filter((p) => p.category === categoryFromUrl);
    }

    if (activeFilters.categories.length) {
      filtered = filtered.filter((p) =>
        activeFilters.categories.includes(p.category)
      );
    }

    if (activeFilters.locations.length) {
      filtered = filtered.filter((p) =>
        activeFilters.locations.includes(p.city)
      );
    }

    if (activeFilters.amenities.length) {
      filtered = filtered.filter((p) =>
        activeFilters.amenities.every((a) => p.amenities.includes(a))
      );
    }

    filtered = filtered.filter(
      (p) =>
        p.minPrice >= activeFilters.priceRange[0] &&
        p.maxPrice <= activeFilters.priceRange[1]
    );

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
  }, [properties, activeFilters, sortBy, categoryFromUrl]);

  // Auto-check URL category
  useEffect(() => {
    if (categoryFromUrl && filterOptions.categories.includes(categoryFromUrl)) {
      setActiveFilters((prev) => ({
        ...prev,
        categories: [categoryFromUrl],
      }));
    }
  }, [categoryFromUrl, filterOptions.categories]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
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
              onFiltersChange={setActiveFilters}
            />
          </div>
        </div>

        {/* Main */}
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
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

            <div className="mt-4 sm:mt-0">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Sort by..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popular">Most Popular</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {loading && (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground">
                Loading properties...
              </p>
            </div>
          )}
          {error && (
            <div className="text-center py-12">
              <p className="text-lg text-red-500">{error}</p>
            </div>
          )}

          {!loading && !error && (
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
        url="https://bookanytime.in/products"
      />
    </div>
  );
};

export default Products;
