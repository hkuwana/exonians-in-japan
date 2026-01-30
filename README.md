# Exonians in Japan

A simple website for Phillips Exeter Academy alumni living in or visiting Japan.

**Live site**: [exonianjapan.com](https://exonianjapan.com)

---

## For Non-Technical Users: Setup Guide

This is a simple static website - no coding experience required! Just follow these steps.

### What You'll Need

- A free [Supabase](https://supabase.com) account (for storing email signups)
- A free [Vercel](https://vercel.com) account (for hosting the website)
- A [GitHub](https://github.com) account (for storing the code)

### Step 1: Fork This Repository

1. Click the **Fork** button at the top right of this GitHub page
2. This creates your own copy of the website

### Step 2: Set Up Supabase (Database)

Supabase stores the email addresses from people who sign up.

#### Create a Project

1. Go to [supabase.com](https://supabase.com) and sign up (it's free)
2. Click **New Project**
3. Give it a name (e.g., "exonians-japan")
4. Set a database password (save this somewhere safe, but you won't need it for this setup)
5. Choose a region close to Japan (e.g., Singapore or Tokyo)
6. Click **Create Project** and wait ~2 minutes

#### Create the Signups Table

1. In your Supabase project, click **SQL Editor** in the left sidebar
2. Click **New Query**
3. Copy and paste this entire block:

```sql
-- Create members table for email signups
CREATE TABLE members (
    id BIGSERIAL PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable security
ALTER TABLE members ENABLE ROW LEVEL SECURITY;

-- Allow the signup form to add emails
CREATE POLICY "Allow anonymous inserts" ON members
    FOR INSERT
    WITH CHECK (true);
```

4. Click **Run** (or press Cmd+Enter / Ctrl+Enter)
5. You should see "Success" - your table is ready!

#### Get Your API Keys

1. Click **Settings** (gear icon) in the left sidebar
2. Click **API Keys**
3. You'll need two things:
   - **Project URL**: Copy this (looks like `https://abcd1234.supabase.co`)
   - **Publishable Key**: Copy the key that starts with `sb_publishable_...`

### Step 3: Configure the Website

1. In your forked GitHub repo, find the file `config.example.js`
2. Create a new file called `config.js` (click Add File > Create new file)
3. Copy this and fill in your values:

```javascript
window.CONFIG = {
    // Paste your Supabase Project URL here
    SUPABASE_URL: 'https://your-project-id.supabase.co',

    // Paste your Publishable Key here
    SUPABASE_PUBLISHABLE_KEY: 'sb_publishable_your-key-here',

    // PostHog Analytics (optional - leave as-is to disable)
    POSTHOG_KEY: '',
    POSTHOG_HOST: 'https://us.i.posthog.com'
};
```

4. Click **Commit changes**

### Step 4: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and sign up with GitHub
2. Click **Add New Project**
3. Find your forked repository and click **Import**
4. Click **Deploy** (no settings needed to change)
5. Wait ~1 minute - your site is live!

### Step 5: Add Your Custom Domain (Optional)

1. In Vercel, go to your project's **Settings**
2. Click **Domains**
3. Add your domain (e.g., `exonianjapan.com`)
4. Follow Vercel's instructions to update your domain's DNS settings

---

## Viewing Email Signups

To see who has signed up:

1. Go to your [Supabase dashboard](https://supabase.com/dashboard)
2. Open your project
3. Click **Table Editor** in the left sidebar
4. Click on the **members** table
5. You'll see all the email addresses!

**To export as a spreadsheet:**
- Click the **Export** button and choose CSV

---

## Customizing the Website

### Update Events

Edit `index.html` and find the events section. Each event looks like:

```html
<div class="card">
    <h3>Event Name</h3>
    <p>Date and details...</p>
</div>
```

### Update Links

In `index.html`, search for and replace:
- WhatsApp link: `https://chat.whatsapp.com/YOUR_INVITE_LINK`
- Instagram handle: `@exoniansinjapan`

### Add Photos

Replace the placeholder image divs with actual images:

```html
<img src="your-image-url.jpg" alt="Description" class="rounded-xl">
```

---

## File Structure

```
├── index.html          # Main page (English)
├── ja.html             # Japanese version
├── updates.html        # News/updates page
├── cilley.html         # Easter egg page
├── 404.html            # "Page not found" page
├── app.js              # Handles the signup form
├── config.js           # Your Supabase keys (you create this)
├── config.example.js   # Template for config.js
├── favicon.svg         # Browser tab icon
├── vercel.json         # Hosting settings
├── robots.txt          # Search engine settings
├── sitemap.xml         # Helps Google find pages
└── README.md           # This file
```

---

## Troubleshooting

### "Supabase not configured" message

- Make sure you created `config.js` (not just edited `config.example.js`)
- Check that your Supabase URL and key are correct
- The URL should start with `https://` and end with `.supabase.co`

### Signups not appearing in Supabase

- Check that you ran the SQL to create the table
- Make sure Row Level Security (RLS) policy was created
- Check browser console for errors (Right-click > Inspect > Console tab)

### Site not updating after changes

- Vercel automatically redeploys when you push to GitHub
- Wait 1-2 minutes after making changes
- Try clearing your browser cache (Cmd+Shift+R or Ctrl+Shift+R)

---

## Analytics (Optional)

To track visitor statistics with PostHog:

1. Create a free account at [posthog.com](https://posthog.com)
2. Get your Project API Key from Settings
3. Add it to your `config.js`:

```javascript
POSTHOG_KEY: 'phc_your-key-here',
```

---

## Questions?

Contact Hiro at hiro@trykaiwa.com

GitHub: [@hkuwana](https://github.com/hkuwana)
