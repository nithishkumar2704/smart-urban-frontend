// Login Form Handler
// Handles form validation and submission for all login pages

document.addEventListener('DOMContentLoaded', () => {
    // Get all login forms
    const forms = document.querySelectorAll('.login-form');

    forms.forEach(form => {
        form.addEventListener('submit', handleLogin);
    });
});

async function handleLogin(e) {
    e.preventDefault();

    const form = e.target;
    const submitBtn = form.querySelector('.submit-btn');
    const email = form.querySelector('input[name="email"]').value;
    const password = form.querySelector('input[name="password"]').value;
    const remember = form.querySelector('input[name="remember"]')?.checked || false;

    // Get role from form ID
    const role = form.id.replace('LoginForm', '').toLowerCase();

    // Validate inputs
    if (!validateEmail(email)) {
        showMessage(form, 'Please enter a valid email address', 'error');
        return;
    }

    if (password.length < 6) {
        showMessage(form, 'Password must be at least 6 characters', 'error');
        return;
    }

    // Show loading state
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;

    // Simulate API call (replace with actual backend call)
    try {
        const result = await mockLogin(email, password, role);

        if (result.success) {
            // Save login state
            if (remember) {
                localStorage.setItem('userEmail', email);
            }
            localStorage.setItem('userRole', role);
            localStorage.setItem('isLoggedIn', 'true');

            showMessage(form, 'Login successful! Redirecting...', 'success');

            // Redirect after 1 second
            setTimeout(() => {
                redirectToDashboard(role);
            }, 1000);
        } else {
            showMessage(form, result.message || 'Invalid credentials', 'error');
        }
    } catch (error) {
        showMessage(form, 'An error occurred. Please try again.', 'error');
        console.error('Login error:', error);
    } finally {
        // Remove loading state
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
    }
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function showMessage(form, message, type) {
    // Remove existing message
    const existingMessage = form.querySelector('.form-message');
    if (existingMessage) {
        existingMessage.remove();
    }

    // Create new message
    const messageDiv = document.createElement('div');
    messageDiv.className = `form-message ${type}`;
    messageDiv.textContent = message;

    // Insert before submit button
    const submitBtn = form.querySelector('.submit-btn');
    form.insertBefore(messageDiv, submitBtn);

    // Auto-remove error messages after 5 seconds
    if (type === 'error') {
        setTimeout(() => {
            messageDiv.remove();
        }, 5000);
    }
}

// Real API login function
async function mockLogin(email, password, role) {
    try {
        const response = await fetch(`${CONFIG.API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            // Store token and user data
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data));
            return { success: true };
        } else {
            return { success: false, message: data.message || 'Login failed' };
        }
    } catch (error) {
        console.error('Login API error:', error);
        return { success: false, message: 'Network error. Please try again.' };
    }
}

function redirectToDashboard(role) {
    // Redirect to appropriate dashboard
    const dashboards = {
        'serviceprovider': 'services.html',
        'admin': 'services.html',
        'user': 'services.html'
    };

    window.location.href = dashboards[role] || 'services.html';
}

// Auto-fill email if remembered
window.addEventListener('DOMContentLoaded', () => {
    const savedEmail = localStorage.getItem('userEmail');
    if (savedEmail) {
        const emailInput = document.querySelector('input[name="email"]');
        if (emailInput) {
            emailInput.value = savedEmail;
            const rememberCheckbox = document.querySelector('input[name="remember"]');
            if (rememberCheckbox) {
                rememberCheckbox.checked = true;
            }
        }
    }
});

// Real-time validation feedback
document.addEventListener('DOMContentLoaded', () => {
    const emailInputs = document.querySelectorAll('input[type="email"]');
    const passwordInputs = document.querySelectorAll('input[type="password"]');

    emailInputs.forEach(input => {
        input.addEventListener('blur', () => {
            if (input.value && !validateEmail(input.value)) {
                input.style.borderColor = 'var(--admin-color)';
            } else {
                input.style.borderColor = '';
            }
        });

        input.addEventListener('input', () => {
            input.style.borderColor = '';
        });
    });

    passwordInputs.forEach(input => {
        input.addEventListener('blur', () => {
            if (input.value && input.value.length < 6) {
                input.style.borderColor = 'var(--admin-color)';
            } else {
                input.style.borderColor = '';
            }
        });

        input.addEventListener('input', () => {
            input.style.borderColor = '';
        });
    });
});
