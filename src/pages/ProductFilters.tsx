import { useState, useEffect } from "react";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronDown, ChevronUp } from "lucide-react";
import "./Filter.css";
type Filters = {
  categories: string[];
  locations: string[];
  amenities: string[];
  priceRange: [number, number];
  radius: number;
  userLocation: { lat: number; lng: number } | null;
  capacity: { adults: number; bedrooms: number };
};

type FilterOptions = {
  categories: string[];
  locations: string[];
  amenities: string[];
  minPrice: number;
  maxPrice: number;
  maxRadius: number;
  maxCapacity: { adults: number; bedrooms: number };
};

type Props = {
  filterOptions: FilterOptions;
  activeFilters: Filters;
  onFiltersChange: (filters: Filters) => void;
};

const ProductFilters = ({
  filterOptions,
  activeFilters,
  onFiltersChange,
}: Props) => {
  const [price, setPrice] = useState<[number, number]>(
    activeFilters.priceRange
  );
  const [radius, setRadius] = useState(activeFilters.radius);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(
    activeFilters.userLocation
  );
  const [radiusTouched, setRadiusTouched] = useState(false);

  // Fold states
  const [openCategories, setOpenCategories] = useState(true);
  const [openLocations, setOpenLocations] = useState(true);
  const [openAmenities, setOpenAmenities] = useState(true);
  const [openPrice, setOpenPrice] = useState(true);
  const [openRadius, setOpenRadius] = useState(true);
  const [openCapacity, setOpenCapacity] = useState(true);

  useEffect(() => {
    if (!location && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setLocation(coords);
        onFiltersChange((prev) => ({ ...prev, userLocation: coords }));
      });
    }
  }, [location]);

  const toggleFilter = (
    type: "categories" | "locations" | "amenities",
    value: string
  ) => {
    onFiltersChange((prev) => {
      const current = prev[type];
      const updated = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      return { ...prev, [type]: updated };
    });
  };

  const handlePriceChange = (newPrice: [number, number]) => {
    setPrice(newPrice);
    onFiltersChange((prev) => ({ ...prev, priceRange: newPrice }));
  };

  const handleRadiusChange = (val: number) => {
    setRadius(val);
    setRadiusTouched(true);
    onFiltersChange((prev) => ({ ...prev, radius: val }));
  };

  const changeCapacity = (type: "adults" | "bedrooms", delta: number) => {
    onFiltersChange((prev) => {
      const currentCapacity = prev.capacity ?? { adults: 0, bedrooms: 0 };
      const maxCapacity = filterOptions.maxCapacity[type];
      const newValue = Math.min(
        maxCapacity,
        Math.max(0, currentCapacity[type] + delta)
      );
      return { ...prev, capacity: { ...currentCapacity, [type]: newValue } };
    });
  };

  const clearFilters = () => {
    onFiltersChange({
      categories: [],
      locations: [],
      amenities: [],
      priceRange: [filterOptions.minPrice, filterOptions.maxPrice],
      radius: 0,
      userLocation: location,
      capacity: { adults: 0, bedrooms: 0 },
    });
    setPrice([filterOptions.minPrice, filterOptions.maxPrice]);
    setRadius(0);
  };

  return (
    <div className="space-y-6 p-6 bg-white dark:bg-gray-900 rounded-xl shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-gray-700 dark:text-gray-200 text-lg">
          Filters
        </h3>
        <button
          className="text-sm text-red-500 hover:underline"
          onClick={clearFilters}
        >
          Clear Filters
        </button>
      </div>

      {/* Categories */}
      <div className="border p-3 rounded-md">
        <div
          className="flex justify-between items-center cursor-pointer"
          onClick={() => setOpenCategories(!openCategories)}
        >
          <h3 className="font-semibold text-gray-700 dark:text-gray-200 text-lg">
            Categories
          </h3>
          {openCategories ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </div>
        {openCategories && (
          <div className="mt-3 space-y-2">
            {filterOptions.categories.map((c) => (
              <div
                key={c}
                className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              >
                <Checkbox
                  checked={activeFilters.categories.includes(c)}
                  onCheckedChange={() => toggleFilter("categories", c)}
                />
                <label className="text-gray-700 dark:text-gray-200">{c}</label>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Price */}
      <div className="border p-3 rounded-md">
        <div
          className="flex justify-between items-center cursor-pointer"
          onClick={() => setOpenPrice(!openPrice)}
        >
          <h3 className="font-semibold text-gray-700 dark:text-gray-200 text-lg">
            Price Range
          </h3>
          {openPrice ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </div>
        {openPrice && (
          <div className="mt-3 space-y-2">
            <Slider
              value={price}
              min={filterOptions.minPrice}
              max={filterOptions.maxPrice}
              step={1000}
              onValueChange={(val) => handlePriceChange([val[0], val[1]])}
            />

            <div className="flex space-x-4 pt-2 justify-evenly">
              <input
                type="number"
                value={price[0]}
                min={filterOptions.minPrice}
                max={price[1]} // prevent min > max
                onChange={(e) =>
                  handlePriceChange([Number(e.target.value), price[1]])
                }
                className="w-20 p-1 border rounded text-sm text-gray-700 dark:text-gray-300"
              />
              <span className="mx-1">-</span>
              <input
                type="number"
                value={price[1]}
                min={price[0]} // prevent max < min
                max={filterOptions.maxPrice}
                onChange={(e) =>
                  handlePriceChange([price[0], Number(e.target.value)])
                }
                className="w-20 p-1 border rounded text-sm text-gray-700 dark:text-gray-300"
              />
            </div>

            {/* <div className="flex justify-between text-xs text-gray-400 dark:text-gray-500 mt-1">
              <span>₹{filterOptions.minPrice}</span>
              <span>₹{filterOptions.maxPrice}</span>
            </div> */}
          </div>
        )}
      </div>

      {/* Radius */}
      {/* <div className="border p-3 rounded-md">
        <div
          className="flex justify-between items-center cursor-pointer"
          onClick={() => setOpenRadius(!openRadius)}
        >
          <h3 className="font-semibold text-gray-700 dark:text-gray-200 text-lg">
            Radius (km)
          </h3>
          {openRadius ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </div>
        {openRadius && (
          <div className="mt-3">
            <Slider
              value={[radius]}
              min={0}
              max={filterOptions.maxRadius}
              step={1}
              onValueChange={(val) => handleRadiusChange(val[0])}
            />
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
              {radius} km
            </p>
          </div>
        )}
      </div> */}

      {/* Capacity */}
      <div className="border p-3 rounded-md">
        <div
          className="flex justify-between items-center cursor-pointer"
          onClick={() => setOpenCapacity(!openCapacity)}
        >
          <h3 className="font-semibold text-gray-700 dark:text-gray-200 text-lg">
            Capacity
          </h3>
          {openCapacity ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </div>
        {openCapacity && (
          <div className="mt-3 space-y-3">
            {["adults", "bedrooms"].map((type) => (
              <div key={type}>
                <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                  {type === "adults" ? "guests" : "sleeps"}
                </label>
                <div className="flex items-center space-x-2">
                  {/* Decrement */}
                  <button
                    type="button"
                    className="px-2 py-1 border rounded"
                    onClick={() => {
                      const current = activeFilters.capacity ?? {
                        adults: 0,
                        bedrooms: 0,
                      };
                      const newValue = Math.max(
                        0,
                        current[type as "adults" | "bedrooms"] - 1
                      );
                      onFiltersChange({
                        ...activeFilters,
                        capacity: {
                          ...current,
                          [type]: newValue,
                        },
                      });
                    }}
                  >
                    -
                  </button>

                  {/* Input */}
                  <input
                    type="number"
                    className="px-2 py-1 border rounded w-12 text-center"
                    value={
                      activeFilters.capacity?.[type as "adults" | "bedrooms"] ??
                      0
                    }
                    onChange={(e) => {
                      const value = Number(e.target.value);
                      const current = activeFilters.capacity ?? {
                        adults: 0,
                        bedrooms: 0,
                      };
                      let maxValue =
                        type === "adults"
                          ? 15 // limit guests to 15
                          : filterOptions.maxCapacity[type as "bedrooms"];
                      onFiltersChange({
                        ...activeFilters,
                        capacity: {
                          ...current,
                          [type]: Math.min(Math.max(0, value), maxValue),
                        },
                      });
                    }}
                  />

                  {/* Increment */}
                  <button
                    type="button"
                    className="px-2 py-1 border rounded"
                    onClick={() => {
                      const current = activeFilters.capacity ?? {
                        adults: 0,
                        bedrooms: 0,
                      };
                      let maxValue =
                        type === "adults"
                          ? 15
                          : filterOptions.maxCapacity[type as "bedrooms"];
                      const newValue =
                        current[type as "adults" | "bedrooms"] + 1;
                      onFiltersChange({
                        ...activeFilters,
                        capacity: {
                          ...current,
                          [type]: Math.min(newValue, maxValue),
                        },
                      });
                    }}
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Locations */}
      <div className="border p-3 rounded-md">
        <div
          className="flex justify-between items-center cursor-pointer"
          onClick={() => setOpenLocations(!openLocations)}
        >
          <h3 className="font-semibold text-gray-700 dark:text-gray-200 text-lg">
            Locations
          </h3>
          {openLocations ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </div>
        {openLocations && (
          <div className="mt-3 space-y-2">
            {filterOptions.locations.map((l) => (
              <div
                key={l}
                className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              >
                <Checkbox
                  checked={activeFilters.locations.includes(l)}
                  onCheckedChange={() => toggleFilter("locations", l)}
                />
                <label className="text-gray-700 dark:text-gray-200">{l}</label>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Amenities */}
      <div className="border p-3 rounded-md">
        <div
          className="flex justify-between items-center cursor-pointer"
          onClick={() => setOpenAmenities(!openAmenities)}
        >
          <h3 className="font-semibold text-gray-700 dark:text-gray-200 text-lg">
            Amenities
          </h3>
          {openAmenities ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </div>
        {openAmenities && (
          <div className="mt-3 space-y-2">
            {filterOptions.amenities.map((a) => (
              <div
                key={a}
                className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              >
                <Checkbox
                  checked={activeFilters.amenities.includes(a)}
                  onCheckedChange={() => toggleFilter("amenities", a)}
                />
                <label className="text-gray-700 dark:text-gray-200">{a}</label>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductFilters;
