import { createClient } from '@supabase/supabase-js';

// Vercel serverless function to handle unsubscribe requests
export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { email } = req.body;

    // Validate email
    if (!email || typeof email !== 'string') {
      return res.status(400).json({
        error: 'Email is required',
        success: false
      });
    }

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        error: 'Invalid email format',
        success: false
      });
    }

    // Initialize Supabase client
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_PUBLISHABLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      console.error('Supabase credentials not configured');
      return res.status(500).json({
        error: 'Server configuration error',
        success: false
      });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // First check if the email exists in the database
    const { data: existingMember, error: fetchError } = await supabase
      .from('members')
      .select('id, email, unsubscribed')
      .eq('email', email.toLowerCase().trim())
      .single();

    if (fetchError || !existingMember) {
      return res.status(404).json({
        error: 'Email not found in our system',
        success: false
      });
    }

    // Check if already unsubscribed
    if (existingMember.unsubscribed) {
      return res.status(200).json({
        success: true,
        message: 'You are already unsubscribed',
        alreadyUnsubscribed: true
      });
    }

    // Update the member to mark as unsubscribed
    const { error: updateError } = await supabase
      .from('members')
      .update({
        unsubscribed: true,
        unsubscribed_at: new Date().toISOString()
      })
      .eq('email', email.toLowerCase().trim());

    if (updateError) {
      console.error('Supabase update error:', updateError);
      return res.status(500).json({
        error: 'Failed to unsubscribe. Please try again.',
        success: false
      });
    }

    // Success response
    return res.status(200).json({
      success: true,
      message: 'You have been successfully unsubscribed'
    });

  } catch (error) {
    console.error('Unsubscribe error:', error);
    return res.status(500).json({
      error: 'An unexpected error occurred',
      success: false
    });
  }
}
