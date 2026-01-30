// Configuration file for Exonians in Japan
// Copy this file to config.js and fill in your actual values
// config.js is gitignored to keep credentials secure

window.CONFIG = {
    // Supabase Configuration
    // Get these from your Supabase project: Settings > API Keys
    SUPABASE_URL: 'https://your-project-id.supabase.co',
    SUPABASE_PUBLISHABLE_KEY: 'sb_publishable_your-key-here',  // Replaces legacy anon key

    // PostHog Analytics
    // Get these from your PostHog project: Settings > Project API Key
    POSTHOG_KEY: 'phc_your-posthog-key-here',
    POSTHOG_HOST: 'https://us.i.posthog.com'
};
