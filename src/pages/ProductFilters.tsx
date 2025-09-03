

import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";

type Filters = {
  categories: string[];
  locations: string[];
  amenities: string[];
  priceRange: [number, number];
};

type FilterOptions = {
  categories: string[];
  locations: string[];
  amenities: string[];
  minPrice: number;
  maxPrice: number;
};

type Props = {
  filterOptions: FilterOptions;
  activeFilters: Filters;
  onFiltersChange: (filters: Filters) => void;
};

const ProductFilters = ({ filterOptions, activeFilters, onFiltersChange }: Props) => {
  const [price, setPrice] = useState<[number, number]>(activeFilters.priceRange);

  const toggleFilter = (type: keyof Filters, value: string) => {
    const current = activeFilters[type];
    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];

    onFiltersChange({
      ...activeFilters,
      [type]: updated,
    });
  };

  const handlePriceChange = (newPrice: [number, number]) => {
    setPrice(newPrice);
    onFiltersChange({
      ...activeFilters,
      priceRange: newPrice,
    });
  };

  return (
    <div className="space-y-8 p-6 bg-white dark:bg-gray-900 rounded-xl shadow-md">
      {/* Categories */}
      <h3 className="font-semibold text-gray-700 dark:text-gray-200 mb-3 text-lg">Filters</h3>
      <div>
        <h3 className="font-semibold text-gray-700 dark:text-gray-200 mb-3 text-lg">Categories</h3>
        <div className="space-y-2">
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
      </div>

      {/* Locations */}
      <div>
        <h3 className="font-semibold text-gray-700 dark:text-gray-200 mb-3 text-lg">Locations</h3>
        <div className="space-y-2">
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
      </div>

      {/* Amenities */}
      <div>
        <h3 className="font-semibold text-gray-700 dark:text-gray-200 mb-3 text-lg">Amenities</h3>
        <div className="space-y-2">
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
      </div>

      {/* Price */}
      <div>
        <h3 className="font-semibold text-gray-700 dark:text-gray-200 mb-3 text-lg">Price Range</h3>
        <div className="px-2">
          <Slider
            defaultValue={[filterOptions.minPrice, filterOptions.maxPrice]}
            value={price}
            min={filterOptions.minPrice}
            max={filterOptions.maxPrice}
            step={1000}
            onValueChange={(val) => handlePriceChange([val[0], val[1]])}
            className="accent-indigo-600 dark:accent-indigo-400"
          />
        </div>
        <div className="flex justify-between text-sm mt-2 text-gray-700 dark:text-gray-300">
          <span>₹{price[0]}</span>
          <span>₹{price[1]}</span>
        </div>
      </div>
    </div>
  );
};

export default ProductFilters;
