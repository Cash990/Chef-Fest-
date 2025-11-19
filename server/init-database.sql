-- Chef Fest Database Schema
-- Run this in your Supabase SQL Editor to set up the database

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Recipes table
CREATE TABLE IF NOT EXISTS recipes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT NOT NULL,
  ingredients TEXT[] NOT NULL,
  steps TEXT[] NOT NULL,
  price REAL NOT NULL,
  category TEXT NOT NULL,
  rating REAL DEFAULT 0,
  is_vegetarian INTEGER DEFAULT 0,
  is_trending INTEGER DEFAULT 0,
  is_recommended INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Saved recipes table (many-to-many relationship)
CREATE TABLE IF NOT EXISTS saved_recipes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  recipe_id UUID NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, recipe_id)
);

-- Reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  recipe_id UUID NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  text TEXT NOT NULL,
  user_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_saved_recipes_user ON saved_recipes(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_recipes_recipe ON saved_recipes(recipe_id);
CREATE INDEX IF NOT EXISTS idx_reviews_recipe ON reviews(recipe_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user ON reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_recipes_category ON recipes(category);
CREATE INDEX IF NOT EXISTS idx_recipes_rating ON recipes(rating DESC);

-- Insert sample recipes
-- Note: Update these image URLs with your generated images after running the app
INSERT INTO recipes (title, description, image_url, ingredients, steps, price, category, rating, is_vegetarian, is_trending, is_recommended) VALUES
(
  'Gourmet Burger Deluxe',
  'A mouthwatering gourmet burger with premium beef, aged cheddar, crispy bacon, and our secret sauce on a toasted brioche bun.',
  'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800',
  ARRAY[
    '8 oz premium ground beef',
    'Aged cheddar cheese',
    '3 strips crispy bacon',
    'Fresh lettuce and tomato',
    'Brioche bun',
    'Secret burger sauce',
    'Pickles',
    'Caramelized onions'
  ],
  ARRAY[
    'Season the beef patty with salt and pepper',
    'Grill the patty for 4-5 minutes per side for medium-rare',
    'Add cheese in the last minute of cooking',
    'Toast the brioche bun on the grill',
    'Spread sauce on both buns',
    'Layer lettuce, tomato, patty with cheese, bacon, onions, and pickles',
    'Serve immediately with crispy fries'
  ],
  18.99,
  'Main Course',
  4.8,
  0,
  1,
  1
),
(
  'Creamy Pasta Carbonara',
  'Classic Italian pasta carbonara with crispy pancetta, farm-fresh eggs, and aged Parmigiano-Reggiano cheese.',
  '/api/placeholder/pasta',
  ARRAY[
    '400g spaghetti',
    '200g pancetta or guanciale',
    '4 large egg yolks',
    '100g Parmigiano-Reggiano',
    'Black pepper',
    'Salt',
    'Fresh parsley for garnish'
  ],
  ARRAY[
    'Cook pasta in salted boiling water until al dente',
    'Meanwhile, crisp the pancetta in a large pan',
    'Whisk egg yolks with grated Parmigiano-Reggiano',
    'Reserve 1 cup pasta water before draining',
    'Add hot pasta to the pan with pancetta',
    'Remove from heat and quickly stir in egg mixture',
    'Add pasta water to create a silky sauce',
    'Season with black pepper and serve with more cheese'
  ],
  16.50,
  'Main Course',
  4.9,
  0,
  1,
  1
),
(
  'Buddha Bowl Supreme',
  'A vibrant, nutritious bowl packed with quinoa, roasted vegetables, chickpeas, avocado, and tahini dressing.',
  '/api/placeholder/bowl',
  ARRAY[
    '1 cup quinoa',
    '1 can chickpeas',
    '1 sweet potato, cubed',
    '1 cup broccoli florets',
    '1 avocado',
    'Mixed greens',
    '¼ cup tahini',
    'Lemon juice',
    'Garlic',
    'Olive oil',
    'Sesame seeds'
  ],
  ARRAY[
    'Cook quinoa according to package instructions',
    'Roast chickpeas and sweet potato with olive oil at 400°F for 25 minutes',
    'Steam broccoli until tender-crisp',
    'Make tahini dressing with tahini, lemon juice, garlic, and water',
    'Arrange quinoa, roasted vegetables, chickpeas, and greens in a bowl',
    'Top with sliced avocado and drizzle with tahini dressing',
    'Garnish with sesame seeds'
  ],
  14.99,
  'Salad',
  4.7,
  1,
  0,
  1
),
(
  'Grilled Salmon with Asparagus',
  'Perfectly grilled Atlantic salmon with roasted asparagus, lemon butter sauce, and fresh herbs.',
  '/api/placeholder/salmon',
  ARRAY[
    '6 oz salmon fillet',
    '1 bunch asparagus',
    'Fresh lemon',
    '2 tbsp butter',
    'Fresh dill',
    'Garlic cloves',
    'Olive oil',
    'Salt and pepper'
  ],
  ARRAY[
    'Preheat grill to medium-high heat',
    'Season salmon with salt, pepper, and olive oil',
    'Trim asparagus and toss with olive oil, salt, and pepper',
    'Grill salmon skin-side down for 4-5 minutes',
    'Flip and grill for another 3-4 minutes',
    'Grill asparagus for 5-6 minutes, turning occasionally',
    'Make lemon butter sauce with butter, lemon juice, and dill',
    'Serve salmon and asparagus with lemon butter sauce'
  ],
  24.99,
  'Main Course',
  4.9,
  0,
  0,
  1
),
(
  'Chocolate Lava Cake',
  'Decadent molten chocolate cake with a gooey center, served with vanilla ice cream and fresh berries.',
  '/api/placeholder/dessert',
  ARRAY[
    '100g dark chocolate',
    '100g butter',
    '2 eggs',
    '2 egg yolks',
    '¼ cup sugar',
    '2 tbsp flour',
    'Vanilla ice cream',
    'Fresh berries',
    'Powdered sugar',
    'Fresh mint'
  ],
  ARRAY[
    'Preheat oven to 425°F',
    'Butter and flour four ramekins',
    'Melt chocolate and butter together',
    'Whisk eggs, egg yolks, and sugar until thick',
    'Fold in melted chocolate mixture',
    'Gently fold in flour',
    'Divide batter among ramekins',
    'Bake for 12-14 minutes until edges are set but center is soft',
    'Let cool for 1 minute, then invert onto plates',
    'Serve immediately with ice cream and berries'
  ],
  12.99,
  'Dessert',
  5.0,
  1,
  1,
  1
),
(
  'Caesar Salad',
  'Crisp romaine lettuce with homemade Caesar dressing, garlic croutons, and shaved Parmesan.',
  '/api/placeholder/salad',
  ARRAY[
    '2 heads romaine lettuce',
    '1 cup garlic croutons',
    '½ cup Parmesan cheese',
    '3 anchovy fillets',
    '2 garlic cloves',
    '1 egg yolk',
    '2 tbsp lemon juice',
    '1 tsp Dijon mustard',
    '½ cup olive oil',
    'Black pepper'
  ],
  ARRAY[
    'Wash and chop romaine lettuce into bite-sized pieces',
    'Make dressing by blending anchovies, garlic, egg yolk, lemon juice, and mustard',
    'Slowly drizzle in olive oil while blending',
    'Season dressing with black pepper',
    'Toss lettuce with dressing',
    'Top with croutons and shaved Parmesan',
    'Serve immediately'
  ],
  11.99,
  'Salad',
  4.6,
  0,
  0,
  0
);

-- Note: In production, you would replace '/api/placeholder/...' with actual image URLs
-- The application will use the generated images from the frontend
