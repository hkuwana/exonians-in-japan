# Exonians in Japan

A simple static website for Phillips Exeter Academy alumni living in or visiting Japan.

**Live site**: [exonianjapan.com](https://exonianjapan.com)

## Tech Stack

- **HTML/CSS**: Plain HTML with Tailwind CSS + DaisyUI (via CDN - no build step)
- **Database**: Supabase (for member signups)
- **Analytics**: PostHog (optional)
- **Hosting**: Vercel (recommended) or any static host

## Quick Start

1. Clone this repo
2. Set up Supabase (see below)
3. Update `app.js` with your Supabase credentials
4. (Optional) Set up PostHog analytics
5. Deploy to Vercel

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
    dorm TEXT,
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

## PostHog Analytics (Optional)

1. Create a free account at [posthog.com](https://posthog.com)
2. Get your project API key
3. In `index.html`, find the PostHog script and uncomment/update:

```javascript
posthog.init('YOUR_POSTHOG_KEY', {api_host: 'https://app.posthog.com'})
```

## Deployment (Vercel)

1. Push to GitHub
2. Go to [vercel.com](https://vercel.com) and import the repo
3. Deploy (uses `vercel.json` config automatically)
4. Add your custom domain in Vercel settings

The included `vercel.json` provides:
- Clean URLs (no .html extensions)
- Security headers
- Route rewrites for `/cilley`, `/updates`, `/ja`

## Open Graph Image

To create a social sharing preview image:

1. See `gemini-og-image-prompt.md` for AI image generation prompts
2. Save as `og-image.png` in the root directory
3. The meta tags are already configured to use it

## File Structure

```
├── index.html              # Main landing page (English)
├── ja.html                 # Japanese version
├── updates.html            # Alumni updates/blog page
├── cilley.html             # Easter egg page
├── 404.html                # Custom 404 page
├── app.js                  # JavaScript (Supabase form handling)
├── favicon.svg             # Site favicon
├── vercel.json             # Vercel deployment config
├── robots.txt              # Search engine directives
├── sitemap.xml             # Sitemap for SEO
├── gemini-og-image-prompt.md  # Prompts for generating OG image
├── .env.example            # Environment variables template
├── .gitignore              # Git ignore rules
└── README.md               # This file
```

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

### Dorm Stats Query

Fun query to see signup breakdown by dorm:

```sql
SELECT dorm, COUNT(*) as count
FROM members
WHERE dorm IS NOT NULL
GROUP BY dorm
ORDER BY count DESC;
```

## Easter Eggs

- `/cilley` - A special page for Cilley dorm pride
- Footer has a subtle link for Wentworth folks

## Questions?

Contact Hiro at hiro@trykaiwa.com

GitHub: [@hkuwana](https://github.com/hkuwana)
