import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';

interface FiltersType {
  priceRange: [number, number];
  categories: string[];
  amenities: string[];
}

interface ProductFiltersProps {
  onFiltersChange: (filters: FiltersType) => void;
}

const ProductFilters = ({ onFiltersChange }: ProductFiltersProps) => {
  const [filters, setFilters] = useState<FiltersType>({
    priceRange: [50, 500],
    categories: [],
    amenities: []
  });

  const categories = ['farmhouse', 'hotel', 'apartment', 'villa', 'resort'];
  const amenities = ['WiFi', 'Pool', 'Parking', 'Pet-friendly', 'Kitchen', 'Gym'];

  const handleCategoryChange = (category: string, checked: boolean) => {
    const newCategories = checked 
      ? [...filters.categories, category]
      : filters.categories.filter(c => c !== category);
    
    const newFilters = { ...filters, categories: newCategories };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Price Range */}
          <div>
            <Label className="text-base font-medium">Price Range</Label>
            <div className="mt-3">
              <Slider
                defaultValue={filters.priceRange}
                max={1000}
                min={0}
                step={10}
                className="w-full"
                onValueChange={(value) => {
                  const newFilters = { ...filters, priceRange: value as [number, number] };
                  setFilters(newFilters);
                  onFiltersChange(newFilters);
                }}
              />
              <div className="flex justify-between text-sm text-muted-foreground mt-2">
                <span>${filters.priceRange[0]}</span>
                <span>${filters.priceRange[1]}</span>
              </div>
            </div>
          </div>

          {/* Categories */}
          <div>
            <Label className="text-base font-medium">Property Type</Label>
            <div className="mt-3 space-y-3">
              {categories.map((category) => (
                <div key={category} className="flex items-center space-x-2">
                  <Checkbox
                    id={category}
                    checked={filters.categories.includes(category)}
                    onCheckedChange={(checked) => 
                      handleCategoryChange(category, checked as boolean)
                    }
                  />
                  <Label htmlFor={category} className="capitalize cursor-pointer">
                    {category}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Amenities */}
          <div>
            <Label className="text-base font-medium">Amenities</Label>
            <div className="mt-3 space-y-3">
              {amenities.map((amenity) => (
                <div key={amenity} className="flex items-center space-x-2">
                  <Checkbox id={amenity} />
                  <Label htmlFor={amenity} className="cursor-pointer">
                    {amenity}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductFilters;