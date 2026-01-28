// ===================================
// Exonians in Japan - JavaScript
// ===================================

// Supabase Configuration
// Replace these with your actual Supabase project credentials
const SUPABASE_URL = 'YOUR_SUPABASE_URL'; // e.g., 'https://abc123.supabase.co'
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';

// Initialize Supabase client (only if credentials are configured)
let supabase = null;
if (SUPABASE_URL !== 'YOUR_SUPABASE_URL' && SUPABASE_ANON_KEY !== 'YOUR_SUPABASE_ANON_KEY') {
    supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

// Form handling
document.addEventListener('DOMContentLoaded', function() {
    const signupForm = document.getElementById('signup-form');
    const formMessage = document.getElementById('form-message');

    if (signupForm) {
        signupForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            // Get form data
            const formData = new FormData(signupForm);
            const data = {
                name: formData.get('name'),
                email: formData.get('email'),
                class_year: formData.get('class_year') || null,
                phone: formData.get('phone') || null,
                occupation: formData.get('occupation') || null,
                contact_for_events: formData.get('contact_for_events') === 'on',
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
        formMessage.textContent = text;
        formMessage.classList.remove('hidden', 'text-green-400', 'text-red-400', 'text-blue-400');

        switch (type) {
            case 'success':
                formMessage.classList.add('text-green-400');
                break;
            case 'error':
                formMessage.classList.add('text-red-400');
                break;
            case 'info':
                formMessage.classList.add('text-blue-400');
                break;
        }
    }

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
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
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                navbar.classList.add('shadow-md');
            } else {
                navbar.classList.remove('shadow-md');
            }
        });
    }
});
