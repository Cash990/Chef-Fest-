import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, X, Filter } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface RecipeFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  category: string;
  onCategoryChange: (category: string) => void;
  priceRange: string;
  onPriceRangeChange: (range: string) => void;
  filters: {
    vegetarian: boolean;
    trending: boolean;
    recommended: boolean;
    topRated: boolean;
  };
  onFilterToggle: (filter: keyof RecipeFiltersProps['filters']) => void;
  onClearAll: () => void;
}

export function RecipeFilters({
  searchQuery,
  onSearchChange,
  category,
  onCategoryChange,
  priceRange,
  onPriceRangeChange,
  filters,
  onFilterToggle,
  onClearAll,
}: RecipeFiltersProps) {
  const [showFilters, setShowFilters] = useState(false);

  const categories = ['All', 'Appetizer', 'Main Course', 'Dessert', 'Salad', 'Soup', 'Beverage'];
  const priceRanges = ['All', 'Under $10', '$10-$20', '$20-$30', 'Over $30'];

  const activeFiltersCount = Object.values(filters).filter(Boolean).length +
    (category !== 'All' ? 1 : 0) +
    (priceRange !== 'All' ? 1 : 0);

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search recipes, ingredients..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
            data-testid="input-search-recipes"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2"
              data-testid="button-clear-search"
            >
              <X className="w-4 h-4 text-muted-foreground hover:text-foreground" />
            </button>
          )}
        </div>
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2"
          data-testid="button-toggle-filters"
        >
          <Filter className="w-4 h-4" />
          Filters
          {activeFiltersCount > 0 && (
            <Badge variant="default" className="ml-1">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>
      </div>

      {/* Filters Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="bg-card border rounded-lg p-6 space-y-6">
              {/* Category & Price */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Category</label>
                  <Select value={category} onValueChange={onCategoryChange}>
                    <SelectTrigger data-testid="select-category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Price Range</label>
                  <Select value={priceRange} onValueChange={onPriceRangeChange}>
                    <SelectTrigger data-testid="select-price-range">
                      <SelectValue placeholder="Select price range" />
                    </SelectTrigger>
                    <SelectContent>
                      {priceRanges.map((range) => (
                        <SelectItem key={range} value={range}>
                          {range}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Filter Tags */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Quick Filters</label>
                <div className="flex flex-wrap gap-2">
                  <Badge
                    variant={filters.vegetarian ? 'default' : 'outline'}
                    className="cursor-pointer hover-elevate active-elevate-2"
                    onClick={() => onFilterToggle('vegetarian')}
                    data-testid="filter-vegetarian"
                  >
                    Vegetarian
                  </Badge>
                  <Badge
                    variant={filters.trending ? 'default' : 'outline'}
                    className="cursor-pointer hover-elevate active-elevate-2"
                    onClick={() => onFilterToggle('trending')}
                    data-testid="filter-trending"
                  >
                    Trending
                  </Badge>
                  <Badge
                    variant={filters.recommended ? 'default' : 'outline'}
                    className="cursor-pointer hover-elevate active-elevate-2"
                    onClick={() => onFilterToggle('recommended')}
                    data-testid="filter-recommended"
                  >
                    Recommended
                  </Badge>
                  <Badge
                    variant={filters.topRated ? 'default' : 'outline'}
                    className="cursor-pointer hover-elevate active-elevate-2"
                    onClick={() => onFilterToggle('topRated')}
                    data-testid="filter-top-rated"
                  >
                    Top Rated
                  </Badge>
                </div>
              </div>

              {/* Clear All */}
              {activeFiltersCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClearAll}
                  className="w-full"
                  data-testid="button-clear-filters"
                >
                  <X className="w-4 h-4 mr-2" />
                  Clear All Filters
                </Button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
