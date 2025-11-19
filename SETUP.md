# Chef Fest Setup Guide

## Supabase Database Setup

### 1. Create Supabase Project
1. Go to [https://supabase.com](https://supabase.com) and create a new project
2. Wait for the project to finish provisioning

### 2. Run Database Schema
1. In your Supabase project, go to **SQL Editor**
2. Copy the entire contents of `server/init-database.sql`
3. Paste and run the SQL script to create all tables and indexes

### 3. Update Recipe Image URLs
After running the schema, you'll need to update the recipe image URLs with the actual generated images:

1. Go to the **Table Editor** in Supabase
2. Select the `recipes` table
3. Update each recipe's `image_url` field with the corresponding image path:
   - Gourmet Burger: Use burger image path
   - Pasta Carbonara: Use pasta image path  
   - Buddha Bowl: Use bowl image path
   - Grilled Salmon: Use salmon image path
   - Chocolate Lava Cake: Use dessert image path
   - Caesar Salad: Use salad image path (or any appropriate image)

### 4. Configure Environment Variables

In Replit Secrets (or `.env` file), set the following:

```
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_KEY=your_supabase_service_role_key (optional, will fallback to anon key)
EMAIL_USER=your_gmail_address (optional, for contact form)
EMAIL_PASSWORD=your_gmail_app_password (optional, for contact form)
SESSION_SECRET=your_random_session_secret
```

### 5. Enable Google OAuth (Optional)

For Google login to work:

1. Go to **Authentication** > **Providers** in Supabase
2. Enable **Google** provider
3. Add your OAuth credentials from Google Cloud Console
4. Add `http://localhost:5000` and your production URL to authorized redirect URLs

## Local Development

```bash
npm install
npm run dev
```

The app will be available at `http://localhost:5000`

## Deployment to Netlify

1. Connect your GitHub repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist/public`
4. Add environment variables in Netlify dashboard:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_KEY`
   - `EMAIL_USER`
   - `EMAIL_PASSWORD`
   - `SESSION_SECRET`

## Admin Access

**Admin Panel:** Navigate to `/admin`

**Credentials:**
- Username: `admin`
- Password: `csdpat10FOOL`

## Features

- ✅ User authentication (email/password + Google OAuth)
- ✅ Browse and search recipes
- ✅ Save favorite recipes
- ✅ Leave reviews and ratings
- ✅ User dashboard
- ✅ Admin panel for recipe/user/review management
- ✅ Contact form with email integration
- ✅ Fully responsive design
- ✅ Beautiful animations and transitions
- ✅ SEO optimized

## Tech Stack

- **Frontend:** React, TailwindCSS, Framer Motion, shadcn/ui
- **Backend:** Express.js, Node.js
- **Database:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth
- **Email:** Nodemailer
- **Deployment:** Netlify
