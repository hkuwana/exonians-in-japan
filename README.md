# Exonians in Japan

A simple static website for Phillips Exeter Academy alumni living in or visiting Japan.

## Tech Stack

- **HTML/CSS**: Plain HTML with Tailwind CSS + DaisyUI (via CDN - no build step)
- **Database**: Supabase (for member signups)
- **Hosting**: Any static host (Vercel, Netlify, GitHub Pages, etc.)

## Quick Start

1. Clone this repo
2. Set up Supabase (see below)
3. Update `app.js` with your Supabase credentials
4. Deploy to your preferred host

## Supabase Setup

### 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a free account
2. Create a new project
3. Wait for the project to be ready

### 2. Create the Members Table

Go to the SQL Editor in your Supabase dashboard and run:

```sql
-- Create members table
CREATE TABLE members (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    class_year TEXT,
    phone TEXT,
    occupation TEXT,
    contact_for_events BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE members ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts (for the signup form)
CREATE POLICY "Allow anonymous inserts" ON members
    FOR INSERT
    WITH CHECK (true);

-- Only allow authenticated users to read (you can view in Supabase dashboard)
CREATE POLICY "Allow authenticated reads" ON members
    FOR SELECT
    USING (auth.role() = 'authenticated');
```

### 3. Get Your Credentials

1. Go to Project Settings > API
2. Copy the **Project URL** (e.g., `https://abc123.supabase.co`)
3. Copy the **anon/public** key

### 4. Update app.js

Open `app.js` and replace the placeholder values:

```javascript
const SUPABASE_URL = 'https://your-project.supabase.co';
const SUPABASE_ANON_KEY = 'your-anon-key-here';
```

## Deployment

### Option 1: GitHub Pages (Free)

1. Push this repo to GitHub
2. Go to Settings > Pages
3. Select "Deploy from a branch" and choose `main`
4. Your site will be at `https://username.github.io/repo-name`

### Option 2: Vercel (Free)

1. Push to GitHub
2. Go to [vercel.com](https://vercel.com) and import the repo
3. Deploy (no configuration needed for static sites)
4. Add your custom domain in Vercel settings

### Option 3: Netlify (Free)

1. Push to GitHub
2. Go to [netlify.com](https://netlify.com) and import the repo
3. Deploy
4. Add your custom domain

## Custom Domain

After deploying, you can add a custom domain (e.g., `exoniansinjapan.com`):

1. Purchase a domain from any registrar (Namecheap, Google Domains, etc.)
2. Add the domain in your hosting provider's settings
3. Update DNS records as instructed by your host

## Customization

### Update Content

- **Events**: Edit the events section in `index.html`
- **Updates**: Add new `<article>` blocks in `updates.html`
- **Photos**: Replace placeholder divs with actual `<img>` tags
- **Stats**: Update the numbers in the About section

### Update Links

Replace these placeholders in `index.html`:
- WhatsApp link: `https://chat.whatsapp.com/YOUR_INVITE_LINK`
- Instagram: `@exoniansinjapan` (update if different)

### Add Alumni Spotlights

In `index.html`, find the spotlights section and add new cards:

```html
<div class="card bg-base-100 shadow-xl">
    <figure class="px-4 pt-4">
        <img src="path/to/photo.jpg" alt="Name" class="rounded-xl w-full h-48 object-cover">
    </figure>
    <div class="card-body">
        <h3 class="card-title">Alumni Name</h3>
        <p class="text-exeter-crimson text-sm">Class of 2015</p>
        <p class="text-gray-600">Short bio about what they do in Japan...</p>
    </div>
</div>
```

## Viewing Signups

To view member signups:

1. Go to your Supabase dashboard
2. Click on "Table Editor"
3. Select the `members` table
4. You can export as CSV for email lists

## File Structure

```
├── index.html      # Main landing page
├── updates.html    # Alumni updates/blog page
├── app.js          # JavaScript (Supabase form handling)
└── README.md       # This file
```

## Questions?

Contact Hiro at hiro@trykaiwa.com
