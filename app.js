// ===================================
// Exonians in Japan - JavaScript
// ===================================

// Supabase Configuration
// -----------------------
// Configuration is loaded from window.CONFIG which is set by:
// - Production: /api/config.js (Vercel serverless function reading from env vars)
// - Development: /config.js (local file, gitignored)
//
// Note: The anon key is safe to expose in client-side code - it only allows
//       operations permitted by your Row Level Security policies.

// Initialize Supabase client when CONFIG is available
// Use var instead of let to avoid "already declared" errors if script loads twice
var supabase = null;

function initSupabase() {
    // Support both new publishable key and legacy anon key
    const apiKey = window.CONFIG?.SUPABASE_PUBLISHABLE_KEY || window.CONFIG?.SUPABASE_ANON_KEY;
    if (window.CONFIG && window.CONFIG.SUPABASE_URL && apiKey) {
        if (window.CONFIG.SUPABASE_URL !== 'YOUR_SUPABASE_URL') {
            supabase = window.supabase.createClient(
                window.CONFIG.SUPABASE_URL,
                apiKey
            );
        }
    }
}

// Try to initialize immediately, or wait for config to load
if (window.CONFIG) {
    initSupabase();
} else {
    // Wait for config to be loaded
    setTimeout(initSupabase, 100);
}

// Form handling
document.addEventListener('DOMContentLoaded', function () {
    const signupForm = document.getElementById('signup-form');
    const formMessage = document.getElementById('form-message');

    if (signupForm) {
        signupForm.addEventListener('submit', async function (e) {
            e.preventDefault();

            // Get form data
            const formData = new FormData(signupForm);
            const data = {
                email: formData.get('email'),
                created_at: new Date().toISOString()
            };

            // Show loading state
            const submitButton = signupForm.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            submitButton.textContent = 'Submitting...';
            submitButton.disabled = true;

            try {
                if (supabase) {
                    // Insert into Supabase
                    const { error } = await supabase
                        .from('members')
                        .insert([data]);

                    if (error) {
                        // Check for duplicate email
                        if (error.code === '23505') {
                            showMessage('You\'re already signed up! We\'ll be in touch.', 'info');
                        } else {
                            throw error;
                        }
                    } else {
                        showMessage('Welcome to the community! We\'ll be in touch.', 'success');
                        signupForm.reset();
                    }
                } else {
                    // Supabase not configured - just show success for demo
                    console.log('Form data (Supabase not configured):', data);
                    showMessage('Thanks for your interest! (Note: Database not configured yet)', 'success');
                    signupForm.reset();
                }
            } catch (error) {
                console.error('Error submitting form:', error);
                showMessage('Something went wrong. Please try again or email hiro@trykaiwa.com directly.', 'error');
            } finally {
                submitButton.textContent = originalText;
                submitButton.disabled = false;
            }
        });
    }

    function showMessage(text, type) {
        const messageText = document.getElementById('form-message-text');
        const messageIcon = document.getElementById('form-message-icon');
        const closeButton = document.getElementById('form-message-close');

        // Set the message text
        messageText.textContent = text;

        // Remove all previous styling classes
        formMessage.classList.remove(
            'hidden',
            'bg-green-500/20', 'border-green-500', 'text-green-300',
            'bg-red-500/20', 'border-red-500', 'text-red-300',
            'bg-blue-500/20', 'border-blue-500', 'text-blue-300'
        );

        // Icons for different message types
        const icons = {
            success: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>',
            error: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>',
            info: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>'
        };

        // Apply styling based on message type
        switch (type) {
            case 'success':
                formMessage.classList.add('bg-green-500/20', 'border', 'border-green-500', 'text-green-300');
                messageIcon.innerHTML = icons.success;
                break;
            case 'error':
                formMessage.classList.add('bg-red-500/20', 'border', 'border-red-500', 'text-red-300');
                messageIcon.innerHTML = icons.error;
                break;
            case 'info':
                formMessage.classList.add('bg-blue-500/20', 'border', 'border-blue-500', 'text-blue-300');
                messageIcon.innerHTML = icons.info;
                break;
        }

        // Add close button functionality
        closeButton.onclick = function() {
            formMessage.classList.add('hidden');
        };

        // Auto-hide after 8 seconds for success/info messages
        if (type === 'success' || type === 'info') {
            setTimeout(function() {
                formMessage.classList.add('hidden');
            }, 8000);
        }
    }

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;

            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const navHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Navbar background on scroll
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', function () {
            if (window.scrollY > 50) {
                navbar.classList.add('shadow-md');
            } else {
                navbar.classList.remove('shadow-md');
            }
        });
    }
});
