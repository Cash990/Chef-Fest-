import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { RecipeCard } from '@/components/RecipeCard';
import { RecipeFilters } from '@/components/RecipeFilters';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import type { Recipe } from '@shared/schema';

export default function RecipesPage() {
  const { user } = useAuth();
  const { toast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [priceRange, setPriceRange] = useState('All');
  const [filters, setFilters] = useState({
    vegetarian: false,
    trending: false,
    recommended: false,
    topRated: false,
  });

  const { data: recipes, isLoading } = useQuery<Recipe[]>({
    queryKey: ['/api/recipes'],
  });

  const { data: savedRecipes } = useQuery<{ recipeId: string }[]>({
    queryKey: ['/api/saved-recipes', user?.id],
    enabled: !!user,
  });

  const savedRecipeIds = new Set(savedRecipes?.map((sr) => sr.recipeId) || []);

  const handleFilterToggle = (filter: keyof typeof filters) => {
    setFilters((prev) => ({ ...prev, [filter]: !prev[filter] }));
  };

  const handleClearAll = () => {
    setSearchQuery('');
    setCategory('All');
    setPriceRange('All');
    setFilters({
      vegetarian: false,
      trending: false,
      recommended: false,
      topRated: false,
    });
  };

  const handleSave = async (recipeId: string) => {
    if (!user) {
      toast({
        title: 'Login required',
        description: 'Please sign in to save recipes',
        variant: 'destructive',
      });
      return;
    }

    try {
      const isSaved = savedRecipeIds.has(recipeId);
      
      if (isSaved) {
        // Unsave
        const response = await fetch(`/api/saved-recipes/${user.id}/${recipeId}`, {
          method: 'DELETE',
        });
        if (!response.ok) throw new Error('Failed to unsave recipe');
        
        toast({
          title: 'Recipe removed',
          description: 'Removed from your collection',
        });
      } else {
        // Save
        const response = await fetch('/api/saved-recipes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user.id, recipeId }),
        });
        if (!response.ok) throw new Error('Failed to save recipe');
        
        toast({
          title: 'Recipe saved!',
          description: 'Added to your collection',
        });
      }
      
      // Invalidate query to refresh saved recipes
      window.location.reload();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update saved recipes',
        variant: 'destructive',
      });
    }
  };

  const filteredRecipes = recipes?.filter((recipe) => {
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesTitle = recipe.title.toLowerCase().includes(query);
      const matchesDescription = recipe.description.toLowerCase().includes(query);
      const matchesIngredients = recipe.ingredients.some((ing) =>
        ing.toLowerCase().includes(query)
      );
      if (!matchesTitle && !matchesDescription && !matchesIngredients) {
        return false;
      }
    }

    // Category filter
    if (category !== 'All' && recipe.category !== category) {
      return false;
    }

    // Price range filter
    if (priceRange !== 'All') {
      const price = recipe.price;
      if (priceRange === 'Under $10' && price >= 10) return false;
      if (priceRange === '$10-$20' && (price < 10 || price >= 20)) return false;
      if (priceRange === '$20-$30' && (price < 20 || price >= 30)) return false;
      if (priceRange === 'Over $30' && price < 30) return false;
    }

    // Quick filters
    if (filters.vegetarian && recipe.isVegetarian !== 1) return false;
    if (filters.trending && recipe.isTrending !== 1) return false;
    if (filters.recommended && recipe.isRecommended !== 1) return false;
    if (filters.topRated && (recipe.rating || 0) < 4.5) return false;

    return true;
  }) || [];

  return (
    <div className="min-h-screen bg-background pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">
            Explore Our Recipes
          </h1>
          <p className="text-lg text-muted-foreground">
            Discover delicious dishes crafted by our expert chefs
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8">
          <RecipeFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            category={category}
            onCategoryChange={setCategory}
            priceRange={priceRange}
            onPriceRangeChange={setPriceRange}
            filters={filters}
            onFilterToggle={handleFilterToggle}
            onClearAll={handleClearAll}
          />
        </div>

        {/* Results Count */}
        {!isLoading && (
          <div className="mb-6">
            <p className="text-sm text-muted-foreground">
              {filteredRecipes.length} {filteredRecipes.length === 1 ? 'recipe' : 'recipes'} found
            </p>
          </div>
        )}

        {/* Recipe Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="aspect-[4/3] w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : filteredRecipes.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-xl text-muted-foreground mb-4">No recipes found</p>
            <p className="text-sm text-muted-foreground">
              Try adjusting your filters or search query
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRecipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                onSave={handleSave}
                isSaved={savedRecipeIds.has(recipe.id)}
                canSave={!!user}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
