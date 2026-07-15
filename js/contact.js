/**
 * LeadForge Digital - Contact Form JavaScript
 * Handles multi-step form, validation, and submission
 */

let currentStep = 1;
const totalSteps = 3;

// Form step navigation
function nextStep() {
    if (validateStep(currentStep)) {
        if (currentStep < totalSteps) {
            document.getElementById(`step${currentStep}`).classList.remove('active');
            currentStep++;
            document.getElementById(`step${currentStep}`).classList.add('active');
            updateProgressIndicator();
        }
    }
}

function prevStep() {
    if (currentStep > 1) {
        document.getElementById(`step${currentStep}`).classList.remove('active');
        currentStep--;
        document.getElementById(`step${currentStep}`).classList.add('active');
        updateProgressIndicator();
    }
}

// Validate current step
function validateStep(step) {
    let isValid = true;
    const stepElement = document.getElementById(`step${step}`);
    
    // Clear previous errors
    stepElement.querySelectorAll('.error-message').forEach(error => {
        error.textContent = '';
    });

    // Step 1 validation
    if (step === 1) {
        const name = document.getElementById('name');
        const email = document.getElementById('email');
        const phone = document.getElementById('phone');

        if (!name.value.trim()) {
            showError('nameError', 'Name is required');
            isValid = false;
        }

        if (!email.value.trim()) {
            showError('emailError', 'Email is required');
            isValid = false;
        } else if (!isValidEmail(email.value)) {
            showError('emailError', 'Please enter a valid email address');
            isValid = false;
        }

        if (!phone.value.trim()) {
            showError('phoneError', 'Phone number is required');
            isValid = false;
        }
    }

    // Step 2 validation
    if (step === 2) {
        const service = document.getElementById('service');
        const industry = document.getElementById('industry');

        if (!service.value) {
            showError('serviceError', 'Please select a service');
            isValid = false;
        }

        if (!industry.value) {
            showError('industryError', 'Please select your industry');
            isValid = false;
        }
    }

    // Step 3 validation
    if (step === 3) {
        const message = document.getElementById('message');
        const popiaConsent = document.getElementById('popia-consent');

        if (!message.value.trim()) {
            showError('messageError', 'Please tell us about your project');
            isValid = false;
        }

        if (!popiaConsent.checked) {
            showError('popiaError', 'POPIA consent is required');
            isValid = false;
        }
    }

    return isValid;
}

// Show error message
function showError(errorId, message) {
    const errorElement = document.getElementById(errorId);
    if (errorElement) {
        errorElement.textContent = message;
    }
}

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Update progress indicator (if you add one)
function updateProgressIndicator() {
    // Optional: Add progress bar or step indicators if needed in future
}

// EmailJS Configuration
const EMAILJS_SERVICE_ID = 'service_x5v3inb';
const EMAILJS_TEMPLATE_ID = 'template_0afp3r8';
const EMAILJS_PUBLIC_KEY = 'FFqgZVVhZPJjaoTME';

// Initialize EmailJS
(function() {
    if (typeof emailjs !== 'undefined') {
        emailjs.init(EMAILJS_PUBLIC_KEY);
    }
})();

// Form submission
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validate final step
            if (validateStep(3)) {
                // Get form data
                const formData = new FormData(contactForm);
                const data = Object.fromEntries(formData);
                
                // Show loading state
                const submitButton = contactForm.querySelector('button[type="submit"]');
                const originalButtonText = submitButton.textContent;
                submitButton.disabled = true;
                submitButton.textContent = 'Sending...';
                
                // Prepare email template parameters
                const templateParams = {
                    from_name: data.name,
                    from_email: data.email,
                    phone: data.phone,
                    business: data.business || 'Not provided',
                    service: data.service || 'Not specified',
                    industry: data.industry || 'Not specified',
                    timeline: data.timeline || 'Not specified',
                    budget: data.budget || 'Not specified',
                    message: data.message,
                    marketing_consent: data['marketing-consent'] ? 'Yes' : 'No',
                    to_email: 'leadforgedigital2026@gmail.com'
                };
                
                // Send email via EmailJS
                if (typeof emailjs !== 'undefined' && EMAILJS_PUBLIC_KEY !== 'YOUR_PUBLIC_KEY') {
                    emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams)
                        .then(function(response) {
                            // Show success message
                            showSuccessMessage();
                            
                            // Reset form
                            contactForm.reset();
                            currentStep = 1;
                            document.getElementById('step1').classList.add('active');
                            document.getElementById('step2').classList.remove('active');
                            document.getElementById('step3').classList.remove('active');
                        })
                        .catch(function(error) {
                            // Show error message
                            showErrorMessage('Sorry, there was an error sending your message. Please try again or contact us directly.');
                            
                            // Re-enable submit button
                            submitButton.disabled = false;
                            submitButton.textContent = originalButtonText;
                        });
                } else {
                    // Fallback if EmailJS is not configured - should not happen in production
                    showErrorMessage('Form submission is not configured. Please contact us directly.');
                    
                    // Re-enable submit button
                    submitButton.disabled = false;
                    submitButton.textContent = originalButtonText;
                    
                    // Reset form
                    contactForm.reset();
                    currentStep = 1;
                    document.getElementById('step1').classList.add('active');
                    document.getElementById('step2').classList.remove('active');
                    document.getElementById('step3').classList.remove('active');
                }
            }
        });
    }
});

// Show success message
function showSuccessMessage() {
    document.querySelectorAll('.form-step').forEach(step => {
        step.classList.remove('active');
    });
    
    const successMessage = document.getElementById('formSuccess');
    if (successMessage) {
        successMessage.style.display = 'block';
        successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

// Show error message
function showErrorMessage(message) {
    // Create or update error message
    let errorDiv = document.getElementById('formError');
    if (!errorDiv) {
        errorDiv = document.createElement('div');
        errorDiv.id = 'formError';
        errorDiv.className = 'form-error';
        errorDiv.style.cssText = 'background-color: #fee; border: 1px solid #fcc; color: #c33; padding: 1rem; border-radius: 0.5rem; margin-top: 1rem;';
        const form = document.getElementById('contactForm');
        form.insertBefore(errorDiv, form.firstChild);
    }
    errorDiv.textContent = message;
    errorDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
    
    // Remove error after 5 seconds
    setTimeout(() => {
        if (errorDiv) {
            errorDiv.remove();
        }
    }, 5000);
}
