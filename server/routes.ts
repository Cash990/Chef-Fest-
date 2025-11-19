import type { Express } from "express";
import { createServer, type Server } from "http";
import { supabaseAdmin, supabaseConfig } from "./supabase";
import nodemailer from "nodemailer";
import { insertRecipeSchema, insertReviewSchema, contactFormSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Middleware to inject Supabase config into HTML
  app.use((req, res, next) => {
    const originalSend = res.send;
    res.send = function (data: any) {
      if (typeof data === 'string' && data.includes('</head>')) {
        data = data.replace(
          '</head>',
          `<script>
            window.SUPABASE_URL = '${supabaseConfig.url}';
            window.SUPABASE_ANON_KEY = '${supabaseConfig.anonKey}';
          </script></head>`
        );
      }
      return originalSend.call(this, data);
    };
    next();
  });

  // Helper to get user from auth header
  const getUserFromAuth = async (authHeader?: string) => {
    if (!authHeader?.startsWith('Bearer ')) return null;
    const token = authHeader.substring(7);
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);
    if (error || !user) return null;
    return user;
  };

  // ===== AUTH & USER ROUTES =====

  // Create/sync user profile after signup
  app.post('/api/users', async (req, res) => {
    try {
      const { id, email, name } = req.body;
      
      const { data, error } = await supabaseAdmin
        .from('users')
        .upsert({ id, email, name })
        .select()
        .single();

      if (error) throw error;
      res.json(data);
    } catch (error: any) {
      console.error('Error creating user:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Get all users (admin only - will add check later)
  app.get('/api/users', async (req, res) => {
    try {
      const { data, error } = await supabaseAdmin
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      res.json(data || []);
    } catch (error: any) {
      console.error('Error fetching users:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Delete user (admin only)
  app.delete('/api/users/:id', async (req, res) => {
    try {
      const { error } = await supabaseAdmin
        .from('users')
        .delete()
        .eq('id', req.params.id);

      if (error) throw error;
      res.json({ success: true });
    } catch (error: any) {
      console.error('Error deleting user:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Update user profile
  app.patch('/api/users/:id', async (req, res) => {
    try {
      const { name, avatarUrl } = req.body;
      
      const { data, error } = await supabaseAdmin
        .from('users')
        .update({ name, avatar_url: avatarUrl })
        .eq('id', req.params.id)
        .select()
        .single();

      if (error) throw error;
      res.json(data);
    } catch (error: any) {
      console.error('Error updating user:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // ===== RECIPE ROUTES =====

  // Get all recipes
  app.get('/api/recipes', async (req, res) => {
    try {
      const { data, error } = await supabaseAdmin
        .from('recipes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      res.json(data || []);
    } catch (error: any) {
      console.error('Error fetching recipes:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Get single recipe
  app.get('/api/recipes/:id', async (req, res) => {
    try {
      const { data, error } = await supabaseAdmin
        .from('recipes')
        .select('*')
        .eq('id', req.params.id)
        .single();

      if (error) throw error;
      res.json(data);
    } catch (error: any) {
      console.error('Error fetching recipe:', error);
      res.status(404).json({ error: 'Recipe not found' });
    }
  });

  // Create recipe (admin only)
  app.post('/api/recipes', async (req, res) => {
    try {
      const recipeData = insertRecipeSchema.parse(req.body);
      
      const { data, error } = await supabaseAdmin
        .from('recipes')
        .insert({
          title: recipeData.title,
          description: recipeData.description,
          image_url: recipeData.imageUrl,
          ingredients: recipeData.ingredients,
          steps: recipeData.steps,
          price: recipeData.price,
          category: recipeData.category,
          is_vegetarian: recipeData.isVegetarian,
          is_trending: recipeData.isTrending,
          is_recommended: recipeData.isRecommended,
        })
        .select()
        .single();

      if (error) throw error;
      res.json(data);
    } catch (error: any) {
      console.error('Error creating recipe:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Update recipe (admin only)
  app.patch('/api/recipes/:id', async (req, res) => {
    try {
      const recipeData = insertRecipeSchema.partial().parse(req.body);
      
      const updateData: any = {};
      if (recipeData.title) updateData.title = recipeData.title;
      if (recipeData.description) updateData.description = recipeData.description;
      if (recipeData.imageUrl) updateData.image_url = recipeData.imageUrl;
      if (recipeData.ingredients) updateData.ingredients = recipeData.ingredients;
      if (recipeData.steps) updateData.steps = recipeData.steps;
      if (recipeData.price !== undefined) updateData.price = recipeData.price;
      if (recipeData.category) updateData.category = recipeData.category;
      if (recipeData.isVegetarian !== undefined) updateData.is_vegetarian = recipeData.isVegetarian;
      if (recipeData.isTrending !== undefined) updateData.is_trending = recipeData.isTrending;
      if (recipeData.isRecommended !== undefined) updateData.is_recommended = recipeData.isRecommended;

      const { data, error } = await supabaseAdmin
        .from('recipes')
        .update(updateData)
        .eq('id', req.params.id)
        .select()
        .single();

      if (error) throw error;
      res.json(data);
    } catch (error: any) {
      console.error('Error updating recipe:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Delete recipe (admin only)
  app.delete('/api/recipes/:id', async (req, res) => {
    try {
      const { error } = await supabaseAdmin
        .from('recipes')
        .delete()
        .eq('id', req.params.id);

      if (error) throw error;
      res.json({ success: true });
    } catch (error: any) {
      console.error('Error deleting recipe:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // ===== SAVED RECIPES ROUTES =====

  // Get saved recipes for a user
  app.get('/api/saved-recipes/:userId', async (req, res) => {
    try {
      const { data, error } = await supabaseAdmin
        .from('saved_recipes')
        .select('recipe_id')
        .eq('user_id', req.params.userId);

      if (error) throw error;
      res.json(data?.map(item => ({ recipeId: item.recipe_id })) || []);
    } catch (error: any) {
      console.error('Error fetching saved recipes:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Save a recipe
  app.post('/api/saved-recipes', async (req, res) => {
    try {
      const { userId, recipeId } = req.body;

      const { data, error } = await supabaseAdmin
        .from('saved_recipes')
        .insert({ user_id: userId, recipe_id: recipeId })
        .select()
        .single();

      if (error) throw error;
      res.json(data);
    } catch (error: any) {
      console.error('Error saving recipe:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Unsave a recipe
  app.delete('/api/saved-recipes/:userId/:recipeId', async (req, res) => {
    try {
      const { error } = await supabaseAdmin
        .from('saved_recipes')
        .delete()
        .eq('user_id', req.params.userId)
        .eq('recipe_id', req.params.recipeId);

      if (error) throw error;
      res.json({ success: true });
    } catch (error: any) {
      console.error('Error unsaving recipe:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // ===== REVIEWS ROUTES =====

  // Get reviews for a recipe
  app.get('/api/reviews/:recipeId', async (req, res) => {
    try {
      const { data, error } = await supabaseAdmin
        .from('reviews')
        .select('*')
        .eq('recipe_id', req.params.recipeId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // After getting reviews, update recipe rating
      if (data && data.length > 0) {
        const avgRating = data.reduce((sum, review) => sum + review.rating, 0) / data.length;
        await supabaseAdmin
          .from('recipes')
          .update({ rating: avgRating })
          .eq('id', req.params.recipeId);
      }

      res.json(data || []);
    } catch (error: any) {
      console.error('Error fetching reviews:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Get all reviews (admin only)
  app.get('/api/all-reviews', async (req, res) => {
    try {
      const { data, error } = await supabaseAdmin
        .from('reviews')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      res.json(data || []);
    } catch (error: any) {
      console.error('Error fetching all reviews:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Create review
  app.post('/api/reviews', async (req, res) => {
    try {
      const reviewData = insertReviewSchema.parse(req.body);

      const { data, error } = await supabaseAdmin
        .from('reviews')
        .insert({
          user_id: reviewData.userId,
          recipe_id: reviewData.recipeId,
          rating: reviewData.rating,
          text: reviewData.text,
          user_name: reviewData.userName,
        })
        .select()
        .single();

      if (error) throw error;

      // Update recipe rating
      const { data: reviews } = await supabaseAdmin
        .from('reviews')
        .select('rating')
        .eq('recipe_id', reviewData.recipeId);

      if (reviews && reviews.length > 0) {
        const avgRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
        await supabaseAdmin
          .from('recipes')
          .update({ rating: avgRating })
          .eq('id', reviewData.recipeId);
      }

      res.json(data);
    } catch (error: any) {
      console.error('Error creating review:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Delete review (admin only)
  app.delete('/api/reviews/:id', async (req, res) => {
    try {
      // Get review to find recipe_id before deleting
      const { data: review } = await supabaseAdmin
        .from('reviews')
        .select('recipe_id')
        .eq('id', req.params.id)
        .single();

      const { error } = await supabaseAdmin
        .from('reviews')
        .delete()
        .eq('id', req.params.id);

      if (error) throw error;

      // Update recipe rating after deletion
      if (review) {
        const { data: reviews } = await supabaseAdmin
          .from('reviews')
          .select('rating')
          .eq('recipe_id', review.recipe_id);

        if (reviews && reviews.length > 0) {
          const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
          await supabaseAdmin
            .from('recipes')
            .update({ rating: avgRating })
            .eq('id', review.recipe_id);
        } else {
          await supabaseAdmin
            .from('recipes')
            .update({ rating: 0 })
            .eq('id', review.recipe_id);
        }
      }

      res.json({ success: true });
    } catch (error: any) {
      console.error('Error deleting review:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // ===== CONTACT FORM ROUTE =====

  app.post('/api/contact', async (req, res) => {
    try {
      const formData = contactFormSchema.parse(req.body);

      // Configure nodemailer
      const transporter = nodemailer.createTransporter({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER || 'your-email@gmail.com',
          pass: process.env.EMAIL_PASSWORD || 'your-app-password',
        },
      });

      // Send email
      await transporter.sendMail({
        from: formData.email,
        to: 'calvinselassie1@gmail.com',
        subject: `Chef Fest Contact: ${formData.name}`,
        text: `
Name: ${formData.name}
Email: ${formData.email}

Message:
${formData.message}
        `,
        html: `
<h2>New Contact Form Submission</h2>
<p><strong>Name:</strong> ${formData.name}</p>
<p><strong>Email:</strong> ${formData.email}</p>
<p><strong>Message:</strong></p>
<p>${formData.message.replace(/\n/g, '<br>')}</p>
        `,
      });

      res.json({ success: true });
    } catch (error: any) {
      console.error('Error sending contact email:', error);
      res.status(500).json({ error: 'Failed to send message' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
