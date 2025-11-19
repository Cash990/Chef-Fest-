# Chef Fest Design Guidelines

## Design Approach

**Selected Approach:** Premium Food Experience - Reference-based design inspired by high-end restaurant websites (The Aviary, Eleven Madison Park) combined with modern food platform patterns (Uber Eats, Resy) for functional pages.

**Key Principles:**
- Visual storytelling through stunning food photography
- Create appetite appeal through imagery and typography
- Balance premium aesthetic with functional usability
- Ensure food imagery dominates the visual hierarchy

## Typography

**Font Families:**
- Headlines: Playfair Display (serif, elegant) or Cormorant Garamond for premium feel
- Body/UI: Inter or Work Sans (clean, modern sans-serif)
- Accent: Optional script font (Dancing Script) for special callouts

**Hierarchy:**
- Hero Headlines: 4xl to 6xl (responsive)
- Section Headers: 3xl to 4xl
- Recipe Titles: 2xl to 3xl
- Body Text: base to lg
- UI Elements: sm to base

## Layout System

**Spacing Units:** Tailwind units of 4, 6, 8, 12, 16, 20, and 24
- Component padding: p-6 to p-8
- Section spacing: py-16 to py-24 (desktop), py-12 to py-16 (mobile)
- Card gaps: gap-6 to gap-8
- Content max-width: max-w-7xl with px-6 to px-8

## Core Components

### Homepage
**Full-Screen Hero Slideshow:**
- Automated rotating slideshow of 4-5 stunning food images
- Full viewport height (min-h-screen)
- Centered overlay content with blurred background container
- Hero text: Restaurant name in display font, tagline, primary CTA buttons
- Smooth fade transitions between slides (5-6 second intervals)
- Navigation overlay: Logo left, menu links right (sticky on scroll)

### Recipes Grid
- Masonry/card grid layout: grid-cols-1 md:grid-cols-2 lg:grid-cols-3
- Recipe cards: Elevated with shadow, rounded corners (rounded-xl)
- Card structure: Large food image (aspect-ratio-4/3), title overlay on image bottom with gradient backdrop, price badge top-right, rating stars, quick actions (save heart icon)
- Hover: Lift effect (scale-105, increased shadow)

### Recipe Detail Page
- Large hero image spanning full width
- Two-column layout below: Left (ingredients list, styled as cards), Right (step-by-step instructions numbered)
- Reviews section: User avatars, star ratings, comment cards with subtle borders

### User Dashboard
- Sidebar navigation: Profile section top, menu items vertically stacked
- Main content area: Grid of saved recipes with remove option, profile edit form with avatar upload preview

### Admin Panel
- Clean table views for data management
- Action buttons: Edit (blue), Delete (red), Add New (green)
- Form modals for adding/editing recipes with image upload preview

### Contact Page
- Split layout: Form left (max-w-md), contact details + social links right
- Social icons: Large, colorful, with hover lift effect
- Map integration or restaurant image as background element

### Authentication Modal
- Centered modal with backdrop blur
- Three clear options: Create Account, Login, Continue as Guest
- Google login button prominently displayed with brand colors

## Animations & Motion

**Use Framer Motion for:**
- Slideshow transitions (smooth fade)
- Recipe card entrance (stagger animation on scroll)
- Modal slide-in from bottom
- Page transitions (subtle fade)
- Save/unsave heart icon animation (scale + color change)

**Subtle Effects:**
- Hover lifts on cards (translateY(-4px))
- Button hover states (slight scale, shadow increase)
- Smooth scroll behavior throughout

**Avoid:** Excessive spinning, bouncing, or distracting parallax effects

## Images

**Hero Slideshow Images (5 images):**
1. Close-up of signature dish with artistic plating
2. Chef preparing food in kitchen (action shot)
3. Beautifully set dining table with multiple dishes
4. Dessert showcase with dramatic lighting
5. Restaurant interior or outdoor dining ambiance

**Recipe Images:** High-quality food photography for each recipe, consistent lighting and styling

**Profile Avatars:** Circular, consistent sizing (w-12 h-12 for lists, w-24 h-24 for profiles)

**Admin Panel:** Placeholder images for new recipes with upload preview

## Color Strategy (To be defined in implementation)
Food-themed palette focusing on:
- Warm, appetizing tones
- High contrast for readability
- Premium feel without being overly dark

## Accessibility
- ARIA labels on all interactive elements
- Keyboard navigation support throughout
- Focus states visible on all form inputs and buttons
- Alt text on all food imagery describing the dish
- Color contrast ratios meeting WCAG AA standards minimum

## Mobile Responsiveness
- Single column layouts on mobile
- Hamburger menu for navigation
- Touch-friendly button sizes (min 44px)
- Slideshow optimized for mobile (faster transitions, lower resolution images)
- Sticky bottom CTA bar on mobile for key actions