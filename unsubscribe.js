// Unsubscribe form handler
(function() {
    'use strict';

    // Get form and message elements
    const form = document.getElementById('unsubscribe-form');
    const submitButton = document.getElementById('submit-button');
    const emailInput = document.getElementById('email-input');
    const messageContainer = document.getElementById('message-container');
    const messageAlert = document.getElementById('message-alert');
    const messageText = document.getElementById('message-text');

    // Original button text
    const originalButtonText = submitButton.textContent;

    /**
     * Display a message to the user
     * @param {string} message - The message to display
     * @param {string} type - The type of message (success, error, info, warning)
     */
    function showMessage(message, type = 'info') {
        messageText.textContent = message;
        messageContainer.classList.remove('hidden');

        // Remove existing alert classes
        messageAlert.classList.remove('alert-success', 'alert-error', 'alert-info', 'alert-warning');

        // Add appropriate class based on type
        switch (type) {
            case 'success':
                messageAlert.classList.add('alert-success');
                break;
            case 'error':
                messageAlert.classList.add('alert-error');
                break;
            case 'warning':
                messageAlert.classList.add('alert-warning');
                break;
            default:
                messageAlert.classList.add('alert-info');
        }

        // Update SVG icon based on type
        const svg = messageAlert.querySelector('svg');
        if (type === 'success') {
            svg.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />';
        } else if (type === 'error') {
            svg.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />';
        } else if (type === 'warning') {
            svg.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />';
        } else {
            svg.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />';
        }

        // Scroll to message
        messageContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    /**
     * Hide the message
     */
    function hideMessage() {
        messageContainer.classList.add('hidden');
    }

    /**
     * Set loading state for the button
     * @param {boolean} isLoading - Whether the form is in loading state
     */
    function setLoadingState(isLoading) {
        if (isLoading) {
            submitButton.disabled = true;
            submitButton.innerHTML = '<span class="loading loading-spinner"></span> Processing...';
            emailInput.disabled = true;
        } else {
            submitButton.disabled = false;
            submitButton.textContent = originalButtonText;
            emailInput.disabled = false;
        }
    }

    /**
     * Validate email format
     * @param {string} email - Email to validate
     * @returns {boolean} - Whether email is valid
     */
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    /**
     * Handle form submission
     * @param {Event} event - The form submit event
     */
    async function handleSubmit(event) {
        event.preventDefault();
        hideMessage();

        const email = emailInput.value.trim();

        // Validate email
        if (!email) {
            showMessage('Please enter your email address.', 'error');
            return;
        }

        if (!isValidEmail(email)) {
            showMessage('Please enter a valid email address.', 'error');
            return;
        }

        // Set loading state
        setLoadingState(true);

        try {
            // Send unsubscribe request to API
            const response = await fetch('/api/unsubscribe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            // Handle different response statuses
            if (response.ok) {
                if (data.success) {
                    if (data.alreadyUnsubscribed) {
                        showMessage('You are already unsubscribed from our newsletter.', 'info');
                    } else {
                        showMessage('You have been successfully unsubscribed. We\'re sorry to see you go!', 'success');
                        // Clear the form
                        form.reset();
                    }
                } else {
                    showMessage(data.error || 'An error occurred. Please try again.', 'error');
                }
            } else if (response.status === 404) {
                showMessage('This email address is not in our system. You may have already been removed or never subscribed.', 'warning');
            } else if (response.status === 400) {
                showMessage(data.error || 'Invalid email address.', 'error');
            } else {
                showMessage('Something went wrong. Please try again or contact us at hiro@trykaiwa.com.', 'error');
            }
        } catch (error) {
            console.error('Unsubscribe error:', error);
            showMessage('Network error. Please check your connection and try again.', 'error');
        } finally {
            setLoadingState(false);
        }
    }

    // Add form submit handler
    if (form) {
        form.addEventListener('submit', handleSubmit);
    }

    // Auto-populate email from URL parameter if present
    const urlParams = new URLSearchParams(window.location.search);
    const emailParam = urlParams.get('email');
    if (emailParam && isValidEmail(emailParam)) {
        emailInput.value = emailParam;
    }

})();
