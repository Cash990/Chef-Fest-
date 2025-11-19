import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, Users, UtensilsCrossed, MessageSquare } from 'lucide-react';
import { useLocation } from 'wouter';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import type { Recipe, User, Review } from '@shared/schema';

const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'csdpat10FOOL';

export default function AdminPage() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [showRecipeDialog, setShowRecipeDialog] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);

  const [recipeFormData, setRecipeFormData] = useState({
    title: '',
    description: '',
    imageUrl: '',
    ingredients: '',
    steps: '',
    price: '',
    category: 'Main Course',
    isVegetarian: false,
    isTrending: false,
    isRecommended: false,
  });

  const { data: recipes } = useQuery<Recipe[]>({
    queryKey: ['/api/recipes'],
    enabled: isAuthenticated,
  });

  const { data: users } = useQuery<User[]>({
    queryKey: ['/api/users'],
    enabled: isAuthenticated,
  });

  const { data: allReviews } = useQuery<Review[]>({
    queryKey: ['/api/all-reviews'],
    enabled: isAuthenticated,
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      loginData.username === ADMIN_USERNAME &&
      loginData.password === ADMIN_PASSWORD
    ) {
      setIsAuthenticated(true);
      toast({
        title: 'Welcome Admin',
        description: 'You have successfully logged in to the admin panel',
      });
    } else {
      toast({
        title: 'Login failed',
        description: 'Invalid username or password',
        variant: 'destructive',
      });
    }
  };

  const handleAddRecipe = () => {
    setEditingRecipe(null);
    setRecipeFormData({
      title: '',
      description: '',
      imageUrl: '',
      ingredients: '',
      steps: '',
      price: '',
      category: 'Main Course',
      isVegetarian: false,
      isTrending: false,
      isRecommended: false,
    });
    setShowRecipeDialog(true);
  };

  const handleEditRecipe = (recipe: Recipe) => {
    setEditingRecipe(recipe);
    setRecipeFormData({
      title: recipe.title,
      description: recipe.description,
      imageUrl: recipe.imageUrl,
      ingredients: recipe.ingredients.join('\n'),
      steps: recipe.steps.join('\n'),
      price: recipe.price.toString(),
      category: recipe.category,
      isVegetarian: recipe.isVegetarian === 1,
      isTrending: recipe.isTrending === 1,
      isRecommended: recipe.isRecommended === 1,
    });
    setShowRecipeDialog(true);
  };

  const handleSaveRecipe = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const recipeData = {
        title: recipeFormData.title,
        description: recipeFormData.description,
        imageUrl: recipeFormData.imageUrl,
        ingredients: recipeFormData.ingredients.split('\n').filter(i => i.trim()),
        steps: recipeFormData.steps.split('\n').filter(s => s.trim()),
        price: parseFloat(recipeFormData.price),
        category: recipeFormData.category,
        isVegetarian: recipeFormData.isVegetarian ? 1 : 0,
        isTrending: recipeFormData.isTrending ? 1 : 0,
        isRecommended: recipeFormData.isRecommended ? 1 : 0,
      };

      const url = editingRecipe ? `/api/recipes/${editingRecipe.id}` : '/api/recipes';
      const method = editingRecipe ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(recipeData),
      });

      if (!response.ok) throw new Error('Failed to save recipe');

      toast({
        title: editingRecipe ? 'Recipe updated' : 'Recipe added',
        description: 'Recipe has been saved successfully',
      });
      setShowRecipeDialog(false);
      window.location.reload();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save recipe',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteRecipe = async (recipeId: string) => {
    try {
      const response = await fetch(`/api/recipes/${recipeId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete recipe');

      toast({
        title: 'Recipe deleted',
        description: 'Recipe has been removed',
      });
      window.location.reload();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete recipe',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete user');

      toast({
        title: 'User deleted',
        description: 'User account has been removed',
      });
      window.location.reload();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete user',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    try {
      const response = await fetch(`/api/reviews/${reviewId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete review');

      toast({
        title: 'Review deleted',
        description: 'Spam review has been removed',
      });
      window.location.reload();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete review',
        variant: 'destructive',
      });
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-6">
        <Card className="w-full max-w-md p-8">
          <div className="text-center mb-8">
            <h1 className="font-serif text-3xl font-bold mb-2">Admin Panel</h1>
            <p className="text-muted-foreground">Sign in to manage Chef Fest</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={loginData.username}
                onChange={(e) =>
                  setLoginData({ ...loginData, username: e.target.value })
                }
                required
                data-testid="input-admin-username"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={loginData.password}
                onChange={(e) =>
                  setLoginData({ ...loginData, password: e.target.value })
                }
                required
                data-testid="input-admin-password"
              />
            </div>
            <Button type="submit" className="w-full" data-testid="button-admin-login">
              Sign In
            </Button>
          </form>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">Admin Panel</h1>
            <p className="text-lg text-muted-foreground">
              Manage recipes, users, and reviews
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => {
              setIsAuthenticated(false);
              setLocation('/');
            }}
            data-testid="button-admin-logout"
          >
            Logout
          </Button>
        </div>

        <Tabs defaultValue="recipes" className="w-full">
          <TabsList className="mb-8">
            <TabsTrigger value="recipes" className="gap-2" data-testid="tab-recipes">
              <UtensilsCrossed className="w-4 h-4" />
              Recipes ({recipes?.length || 0})
            </TabsTrigger>
            <TabsTrigger value="users" className="gap-2" data-testid="tab-users">
              <Users className="w-4 h-4" />
              Users ({users?.length || 0})
            </TabsTrigger>
            <TabsTrigger value="reviews" className="gap-2" data-testid="tab-reviews">
              <MessageSquare className="w-4 h-4" />
              Reviews ({allReviews?.length || 0})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="recipes">
            <div className="mb-6">
              <Button onClick={handleAddRecipe} className="gap-2" data-testid="button-add-recipe">
                <Plus className="w-4 h-4" />
                Add New Recipe
              </Button>
            </div>

            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Tags</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recipes?.map((recipe) => (
                    <TableRow key={recipe.id} data-testid={`recipe-row-${recipe.id}`}>
                      <TableCell className="font-medium">{recipe.title}</TableCell>
                      <TableCell>{recipe.category}</TableCell>
                      <TableCell>${recipe.price.toFixed(2)}</TableCell>
                      <TableCell>{recipe.rating?.toFixed(1) || '0.0'}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          {recipe.isVegetarian === 1 && (
                            <Badge variant="secondary" className="text-xs">V</Badge>
                          )}
                          {recipe.isTrending === 1 && (
                            <Badge variant="secondary" className="text-xs">T</Badge>
                          )}
                          {recipe.isRecommended === 1 && (
                            <Badge variant="secondary" className="text-xs">R</Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEditRecipe(recipe)}
                            data-testid={`button-edit-recipe-${recipe.id}`}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDeleteRecipe(recipe.id)}
                            data-testid={`button-delete-recipe-${recipe.id}`}
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          <TabsContent value="users">
            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users?.map((user) => (
                    <TableRow key={user.id} data-testid={`user-row-${user.id}`}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        {user.createdAt && new Date(user.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteUser(user.id)}
                          data-testid={`button-delete-user-${user.id}`}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          <TabsContent value="reviews">
            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Recipe</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Comment</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {allReviews?.map((review) => {
                    const recipe = recipes?.find((r) => r.id === review.recipeId);
                    return (
                      <TableRow key={review.id} data-testid={`review-row-${review.id}`}>
                        <TableCell className="font-medium">{review.userName}</TableCell>
                        <TableCell>{recipe?.title || 'Unknown'}</TableCell>
                        <TableCell>{review.rating}/5</TableCell>
                        <TableCell className="max-w-xs truncate">{review.text}</TableCell>
                        <TableCell>
                          {review.createdAt && new Date(review.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDeleteReview(review.id)}
                            data-testid={`button-delete-review-${review.id}`}
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Add/Edit Recipe Dialog */}
      <Dialog open={showRecipeDialog} onOpenChange={setShowRecipeDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingRecipe ? 'Edit Recipe' : 'Add New Recipe'}
            </DialogTitle>
            <DialogDescription>
              Fill in the details below to {editingRecipe ? 'update' : 'create'} a recipe
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveRecipe} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={recipeFormData.title}
                  onChange={(e) =>
                    setRecipeFormData({ ...recipeFormData, title: e.target.value })
                  }
                  required
                  data-testid="input-recipe-title"
                />
              </div>

              <div className="col-span-2 space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={recipeFormData.description}
                  onChange={(e) =>
                    setRecipeFormData({ ...recipeFormData, description: e.target.value })
                  }
                  required
                  rows={3}
                  data-testid="textarea-recipe-description"
                />
              </div>

              <div className="col-span-2 space-y-2">
                <Label htmlFor="imageUrl">Image URL</Label>
                <Input
                  id="imageUrl"
                  value={recipeFormData.imageUrl}
                  onChange={(e) =>
                    setRecipeFormData({ ...recipeFormData, imageUrl: e.target.value })
                  }
                  required
                  data-testid="input-recipe-image-url"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  value={recipeFormData.category}
                  onChange={(e) =>
                    setRecipeFormData({ ...recipeFormData, category: e.target.value })
                  }
                  required
                  data-testid="input-recipe-category"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Price ($)</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={recipeFormData.price}
                  onChange={(e) =>
                    setRecipeFormData({ ...recipeFormData, price: e.target.value })
                  }
                  required
                  data-testid="input-recipe-price"
                />
              </div>

              <div className="col-span-2 space-y-2">
                <Label htmlFor="ingredients">Ingredients (one per line)</Label>
                <Textarea
                  id="ingredients"
                  value={recipeFormData.ingredients}
                  onChange={(e) =>
                    setRecipeFormData({ ...recipeFormData, ingredients: e.target.value })
                  }
                  required
                  rows={5}
                  data-testid="textarea-recipe-ingredients"
                />
              </div>

              <div className="col-span-2 space-y-2">
                <Label htmlFor="steps">Steps (one per line)</Label>
                <Textarea
                  id="steps"
                  value={recipeFormData.steps}
                  onChange={(e) =>
                    setRecipeFormData({ ...recipeFormData, steps: e.target.value })
                  }
                  required
                  rows={5}
                  data-testid="textarea-recipe-steps"
                />
              </div>

              <div className="col-span-2 space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="vegetarian">Vegetarian</Label>
                  <Switch
                    id="vegetarian"
                    checked={recipeFormData.isVegetarian}
                    onCheckedChange={(checked) =>
                      setRecipeFormData({ ...recipeFormData, isVegetarian: checked })
                    }
                    data-testid="switch-vegetarian"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="trending">Trending</Label>
                  <Switch
                    id="trending"
                    checked={recipeFormData.isTrending}
                    onCheckedChange={(checked) =>
                      setRecipeFormData({ ...recipeFormData, isTrending: checked })
                    }
                    data-testid="switch-trending"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="recommended">Recommended</Label>
                  <Switch
                    id="recommended"
                    checked={recipeFormData.isRecommended}
                    onCheckedChange={(checked) =>
                      setRecipeFormData({ ...recipeFormData, isRecommended: checked })
                    }
                    data-testid="switch-recommended"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowRecipeDialog(false)}
                data-testid="button-cancel-recipe"
              >
                Cancel
              </Button>
              <Button type="submit" data-testid="button-save-recipe">
                {editingRecipe ? 'Update' : 'Create'} Recipe
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
