import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, Heart, DollarSign } from 'lucide-react';
import { Link } from 'wouter';
import { useState } from 'react';
import type { Recipe } from '@shared/schema';

interface RecipeCardProps {
  recipe: Recipe;
  onSave?: (recipeId: string) => void;
  isSaved?: boolean;
  canSave?: boolean;
}

export function RecipeCard({ recipe, onSave, isSaved = false, canSave = true }: RecipeCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const handleSaveClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onSave) {
      onSave(recipe.id);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Link href={`/recipes/${recipe.id}`}>
        <Card className="overflow-hidden cursor-pointer group hover-elevate active-elevate-2 h-full">
          <div className="relative aspect-[4/3] overflow-hidden">
            <img
              src={recipe.imageUrl}
              alt={recipe.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            
            {/* Price Badge */}
            <div className="absolute top-3 right-3">
              <Badge className="bg-primary/90 backdrop-blur-sm text-primary-foreground font-semibold flex items-center gap-1">
                <DollarSign className="w-3 h-3" />
                {recipe.price.toFixed(2)}
              </Badge>
            </div>

            {/* Category & Tags */}
            <div className="absolute top-3 left-3 flex flex-wrap gap-2">
              <Badge variant="secondary" className="bg-secondary/90 backdrop-blur-sm">
                {recipe.category}
              </Badge>
              {recipe.isVegetarian === 1 && (
                <Badge className="bg-green-500/90 backdrop-blur-sm text-white">
                  Vegetarian
                </Badge>
              )}
              {recipe.isTrending === 1 && (
                <Badge className="bg-orange-500/90 backdrop-blur-sm text-white">
                  Trending
                </Badge>
              )}
            </div>

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

            {/* Title on Image */}
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <h3 className="font-serif text-xl md:text-2xl font-bold text-white mb-1 line-clamp-2">
                {recipe.title}
              </h3>
              <div className="flex items-center gap-1 text-white/90">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium">
                  {recipe.rating ? recipe.rating.toFixed(1) : '0.0'}
                </span>
              </div>
            </div>
          </div>

          <div className="p-4">
            <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
              {recipe.description}
            </p>

            <div className="flex items-center justify-between gap-2">
              <div className="text-xs text-muted-foreground">
                {recipe.ingredients.length} ingredients
              </div>
              
              {canSave && (
                <Button
                  size="sm"
                  variant={isSaved ? 'default' : 'outline'}
                  onClick={handleSaveClick}
                  className={`transition-all ${isHovered ? 'scale-110' : ''}`}
                  data-testid={`button-save-recipe-${recipe.id}`}
                >
                  <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
                </Button>
              )}
            </div>
          </div>
        </Card>
      </Link>
    </motion.div>
  );
}
