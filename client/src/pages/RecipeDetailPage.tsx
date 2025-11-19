import { useRoute } from 'wouter';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Star, Heart, DollarSign, Clock, ChefHat } from 'lucide-react';
import { useState } from 'react';
import { format } from 'date-fns';
import type { Recipe, Review } from '@shared/schema';

export default function RecipeDetailPage() {
  const [, params] = useRoute('/recipes/:id');
  const { user } = useAuth();
  const { toast } = useToast();
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState('');

  const { data: recipe, isLoading } = useQuery<Recipe>({
    queryKey: ['/api/recipes', params?.id],
  });

  const { data: reviews } = useQuery<Review[]>({
    queryKey: ['/api/reviews', params?.id],
  });

  const { data: savedRecipes } = useQuery<{ recipeId: string }[]>({
    queryKey: ['/api/saved-recipes', user?.id],
    enabled: !!user,
  });

  const isSaved = savedRecipes?.some((sr) => sr.recipeId === params?.id);

  const handleSave = async () => {
    if (!user) {
      toast({
        title: 'Login required',
        description: 'Please sign in to save recipes',
        variant: 'destructive',
      });
      return;
    }

    try {
      if (isSaved) {
        const response = await fetch(`/api/saved-recipes/${user.id}/${params?.id}`, {
          method: 'DELETE',
        });
        if (!response.ok) throw new Error('Failed to unsave recipe');
        toast({
          title: 'Recipe removed',
          description: 'Removed from your collection',
        });
      } else {
        const response = await fetch('/api/saved-recipes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user.id, recipeId: params?.id }),
        });
        if (!response.ok) throw new Error('Failed to save recipe');
        toast({
          title: 'Recipe saved!',
          description: 'Added to your collection',
        });
      }
      window.location.reload();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update saved recipes',
        variant: 'destructive',
      });
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({
        title: 'Login required',
        description: 'Please sign in to leave a review',
        variant: 'destructive',
      });
      return;
    }

    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          recipeId: params?.id,
          rating,
          text: reviewText,
          userName: user.user_metadata?.name || user.email || 'Anonymous',
        }),
      });

      if (!response.ok) throw new Error('Failed to submit review');

      toast({
        title: 'Review submitted!',
        description: 'Thank you for your feedback',
      });
      setReviewText('');
      setRating(5);
      window.location.reload();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to submit review',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-6">
          <Skeleton className="w-full h-96 mb-8" />
          <Skeleton className="h-8 w-3/4 mb-4" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-full mb-2" />
        </div>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="min-h-screen bg-background pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-2xl font-bold mb-4">Recipe not found</h1>
          <p className="text-muted-foreground">The recipe you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  const averageRating = recipe.rating || 0;

  return (
    <div className="min-h-screen bg-background pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-6">
        {/* Hero Image */}
        <div className="relative w-full h-96 md:h-[500px] rounded-xl overflow-hidden mb-8">
          <img
            src={recipe.imageUrl}
            alt={recipe.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          
          {/* Floating Info */}
          <div className="absolute bottom-6 left-6 right-6">
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge className="bg-primary/90 backdrop-blur-sm text-primary-foreground">
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
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-white mb-4">
              {recipe.title}
            </h1>
            <div className="flex items-center gap-6 text-white">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                <span className="font-semibold">{averageRating.toFixed(1)}</span>
                <span className="text-white/80">({reviews?.length || 0} reviews)</span>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                <span className="font-semibold">${recipe.price.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Description & Actions */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
            <p className="text-lg text-muted-foreground flex-1">
              {recipe.description}
            </p>
            <Button
              size="lg"
              variant={isSaved ? 'default' : 'outline'}
              onClick={handleSave}
              className="gap-2"
              data-testid="button-save-recipe"
            >
              <Heart className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
              {isSaved ? 'Saved' : 'Save Recipe'}
            </Button>
          </div>
        </div>

        {/* Ingredients & Steps */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Ingredients */}
          <div className="lg:col-span-1">
            <Card className="p-6">
              <h2 className="font-serif text-2xl font-bold mb-4 flex items-center gap-2">
                <ChefHat className="w-6 h-6 text-primary" />
                Ingredients
              </h2>
              <ul className="space-y-3">
                {recipe.ingredients.map((ingredient, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-2 text-sm"
                    data-testid={`ingredient-${index}`}
                  >
                    <span className="text-primary mt-1">•</span>
                    <span>{ingredient}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>

          {/* Steps */}
          <div className="lg:col-span-2">
            <h2 className="font-serif text-2xl font-bold mb-4 flex items-center gap-2">
              <Clock className="w-6 h-6 text-primary" />
              Instructions
            </h2>
            <div className="space-y-4">
              {recipe.steps.map((step, index) => (
                <Card key={index} className="p-6 hover-elevate" data-testid={`step-${index}`}>
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                      {index + 1}
                    </div>
                    <p className="flex-1 text-sm leading-relaxed pt-2">{step}</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="border-t pt-12">
          <h2 className="font-serif text-3xl font-bold mb-8">Reviews</h2>

          {/* Submit Review */}
          {user && (
            <Card className="p-6 mb-8">
              <h3 className="font-semibold mb-4">Leave a Review</h3>
              <form onSubmit={handleSubmitReview} className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Rating</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        data-testid={`rating-star-${star}`}
                      >
                        <Star
                          className={`w-6 h-6 cursor-pointer transition-colors ${
                            star <= rating
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-muted-foreground'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Your Review</label>
                  <Textarea
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    placeholder="Share your experience with this recipe..."
                    rows={4}
                    required
                    data-testid="textarea-review"
                  />
                </div>
                <Button type="submit" data-testid="button-submit-review">
                  Submit Review
                </Button>
              </form>
            </Card>
          )}

          {/* Reviews List */}
          <div className="space-y-4">
            {reviews && reviews.length > 0 ? (
              reviews.map((review) => (
                <Card key={review.id} className="p-6" data-testid={`review-${review.id}`}>
                  <div className="flex items-start gap-4">
                    <Avatar>
                      <AvatarFallback>
                        {review.userName.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="font-semibold">{review.userName}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < review.rating
                                      ? 'fill-yellow-400 text-yellow-400'
                                      : 'text-muted-foreground'
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {review.createdAt && format(new Date(review.createdAt), 'MMM d, yyyy')}
                            </span>
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">{review.text}</p>
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <p className="text-center text-muted-foreground py-8">
                No reviews yet. Be the first to review this recipe!
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
