import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RecipeCard } from '@/components/RecipeCard';
import { useToast } from '@/hooks/use-toast';
import { User, Heart, Trash2, Save } from 'lucide-react';
import { useLocation } from 'wouter';
import type { Recipe } from '@shared/schema';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export default function DashboardPage() {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const [profileData, setProfileData] = useState({
    name: user?.user_metadata?.name || '',
    email: user?.email || '',
  });

  const { data: savedRecipeIds } = useQuery<{ recipeId: string }[]>({
    queryKey: ['/api/saved-recipes', user?.id],
    enabled: !!user,
  });

  const { data: allRecipes } = useQuery<Recipe[]>({
    queryKey: ['/api/recipes'],
  });

  const savedRecipes = allRecipes?.filter((recipe) =>
    savedRecipeIds?.some((sr) => sr.recipeId === recipe.id)
  ) || [];

  if (!user) {
    setLocation('/');
    return null;
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/users/${user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: profileData.name,
        }),
      });

      if (!response.ok) throw new Error('Failed to update profile');

      toast({
        title: 'Profile updated',
        description: 'Your profile has been updated successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update profile',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const response = await fetch(`/api/users/${user.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete account');

      toast({
        title: 'Account deleted',
        description: 'Your account has been deleted successfully',
      });
      await signOut();
      setLocation('/');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete account',
        variant: 'destructive',
      });
    }
  };

  const handleRemoveSaved = async (recipeId: string) => {
    try {
      const response = await fetch(`/api/saved-recipes/${user.id}/${recipeId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to remove recipe');

      toast({
        title: 'Recipe removed',
        description: 'Removed from your saved recipes',
      });
      window.location.reload();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to remove recipe',
        variant: 'destructive',
      });
    }
  };

  const userInitials = profileData.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);

  return (
    <div className="min-h-screen bg-background pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-8">
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">My Dashboard</h1>
          <p className="text-lg text-muted-foreground">
            Manage your profile and saved recipes
          </p>
        </div>

        <Tabs defaultValue="saved" className="w-full">
          <TabsList className="mb-8">
            <TabsTrigger value="saved" className="gap-2" data-testid="tab-saved-recipes">
              <Heart className="w-4 h-4" />
              Saved Recipes
            </TabsTrigger>
            <TabsTrigger value="profile" className="gap-2" data-testid="tab-profile">
              <User className="w-4 h-4" />
              Profile
            </TabsTrigger>
          </TabsList>

          <TabsContent value="saved">
            {savedRecipes.length === 0 ? (
              <Card className="p-12 text-center">
                <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No saved recipes yet</h3>
                <p className="text-muted-foreground mb-6">
                  Start exploring and save your favorite recipes
                </p>
                <Button onClick={() => setLocation('/recipes')} data-testid="button-explore-recipes">
                  Explore Recipes
                </Button>
              </Card>
            ) : (
              <div>
                <p className="text-sm text-muted-foreground mb-6">
                  {savedRecipes.length} {savedRecipes.length === 1 ? 'recipe' : 'recipes'} saved
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {savedRecipes.map((recipe) => (
                    <RecipeCard
                      key={recipe.id}
                      recipe={recipe}
                      onSave={handleRemoveSaved}
                      isSaved={true}
                      canSave={true}
                    />
                  ))}
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="profile">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Profile Info Card */}
              <Card className="p-6 lg:col-span-1 h-fit">
                <div className="text-center">
                  <Avatar className="w-24 h-24 mx-auto mb-4">
                    <AvatarFallback className="text-2xl">
                      {userInitials}
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="font-semibold text-lg mb-1">{profileData.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{profileData.email}</p>
                  <div className="pt-4 border-t space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Saved Recipes</span>
                      <span className="font-semibold">{savedRecipes.length}</span>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Edit Profile Form */}
              <Card className="p-6 lg:col-span-2">
                <h3 className="font-semibold text-lg mb-6">Edit Profile</h3>
                <form onSubmit={handleUpdateProfile} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={profileData.name}
                      onChange={(e) =>
                        setProfileData({ ...profileData, name: e.target.value })
                      }
                      data-testid="input-profile-name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileData.email}
                      disabled
                      className="bg-muted"
                      data-testid="input-profile-email"
                    />
                    <p className="text-xs text-muted-foreground">
                      Email cannot be changed
                    </p>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button type="submit" className="gap-2" data-testid="button-save-profile">
                      <Save className="w-4 h-4" />
                      Save Changes
                    </Button>
                  </div>
                </form>

                {/* Danger Zone */}
                <div className="mt-12 pt-8 border-t">
                  <h4 className="font-semibold text-lg mb-2 text-destructive">Danger Zone</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Once you delete your account, there is no going back. Please be certain.
                  </p>
                  <Button
                    variant="destructive"
                    onClick={() => setShowDeleteDialog(true)}
                    className="gap-2"
                    data-testid="button-delete-account"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete Account
                  </Button>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Delete Account Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your account and remove
              all your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="button-cancel-delete">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAccount}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              data-testid="button-confirm-delete"
            >
              Delete Account
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
