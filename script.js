// DOM Elements
const registrationForm = document.getElementById('registrationForm');
const fullNameInput = document.getElementById('fullName');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const confirmPasswordInput = document.getElementById('confirmPassword');
const termsCheckbox = document.getElementById('terms');
const togglePasswordBtn = document.getElementById('togglePassword');
const submitBtn = document.getElementById('submitBtn');
const strengthFill = document.getElementById('strengthFill');
const strengthText = document.getElementById('strengthText');
const notification = document.getElementById('notification');
const notificationMessage = document.getElementById('notificationMessage');

// Error elements
const nameError = document.getElementById('nameError');
const emailError = document.getElementById('emailError');
const passwordError = document.getElementById('passwordError');
const confirmPasswordError = document.getElementById('confirmPasswordError');
const termsError = document.getElementById('termsError');

// Backend API URL
const API_BASE_URL = 'http://localhost:3000/api';

// Password strength levels
const strengthLevels = [
    { text: 'Very Weak', color: '#ff4757', width: '20%' },
    { text: 'Weak', color: '#ff6348', width: '40%' },
    { text: 'Fair', color: '#ffa502', width: '60%' },
    { text: 'Good', color: '#2ed573', width: '80%' },
    { text: 'Strong', color: '#1e90ff', width: '100%' }
];

// Toggle password visibility
togglePasswordBtn.addEventListener('click', function() {
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
    this.innerHTML = type === 'password' ? '<i class="fas fa-eye"></i>' : '<i class="fas fa-eye-slash"></i>';
});

// Real-time password strength checker
passwordInput.addEventListener('input', function() {
    const password = this.value;
    const strength = calculatePasswordStrength(password);
    
    strengthFill.style.width = strengthLevels[strength].width;
    strengthFill.style.backgroundColor = strengthLevels[strength].color;
    strengthText.textContent = strengthLevels[strength].text;
    strengthText.style.color = strengthLevels[strength].color;
});

// Calculate password strength
function calculatePasswordStrength(password) {
    let score = 0;
    
    // Length check
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    
    // Complexity checks
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    
    // Cap at 4 (0-4 index for strengthLevels)
    return Math.min(score, 4);
}

// Form validation functions
function validateName() {
    const name = fullNameInput.value.trim();
    if (name.length < 2) {
        nameError.textContent = 'Name must be at least 2 characters long';
        fullNameInput.style.borderColor = '#ff4757';
        return false;
    }
    
    if (!/^[a-zA-Z\s]+$/.test(name)) {
        nameError.textContent = 'Name can only contain letters and spaces';
        fullNameInput.style.borderColor = '#ff4757';
        return false;
    }
    
    nameError.textContent = '';
    fullNameInput.style.borderColor = '#2ed573';
    return true;
}

function validateEmail() {
    const email = emailInput.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!emailRegex.test(email)) {
        emailError.textContent = 'Please enter a valid email address';
        emailInput.style.borderColor = '#ff4757';
        return false;
    }
    
    emailError.textContent = '';
    emailInput.style.borderColor = '#2ed573';
    return true;
}

function validatePassword() {
    const password = passwordInput.value;
    
    if (password.length < 8) {
        passwordError.textContent = 'Password must be at least 8 characters long';
        passwordInput.style.borderColor = '#ff4757';
        return false;
    }
    
    if (!/[A-Z]/.test(password)) {
        passwordError.textContent = 'Password must contain at least one uppercase letter';
        passwordInput.style.borderColor = '#ff4757';
        return false;
    }
    
    if (!/[0-9]/.test(password)) {
        passwordError.textContent = 'Password must contain at least one number';
        passwordInput.style.borderColor = '#ff4757';
        return false;
    }
    
    passwordError.textContent = '';
    passwordInput.style.borderColor = '#2ed573';
    return true;
}

function validateConfirmPassword() {
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;
    
    if (password !== confirmPassword) {
        confirmPasswordError.textContent = 'Passwords do not match';
        confirmPasswordInput.style.borderColor = '#ff4757';
        return false;
    }
    
    confirmPasswordError.textContent = '';
    confirmPasswordInput.style.borderColor = '#2ed573';
    return true;
}

function validateTerms() {
    if (!termsCheckbox.checked) {
        termsError.textContent = 'You must agree to the terms and conditions';
        return false;
    }
    
    termsError.textContent = '';
    return true;
}

// Real-time validation
fullNameInput.addEventListener('blur', validateName);
fullNameInput.addEventListener('input', function() {
    if (this.value.trim().length > 1) {
        nameError.textContent = '';
        this.style.borderColor = '#e0e0e0';
    }
});

emailInput.addEventListener('blur', validateEmail);
emailInput.addEventListener('input', function() {
    if (this.value.trim().length > 0) {
        emailError.textContent = '';
        this.style.borderColor = '#e0e0e0';
    }
});

passwordInput.addEventListener('blur', validatePassword);
passwordInput.addEventListener('input', function() {
    if (this.value.length > 0) {
        passwordError.textContent = '';
        this.style.borderColor = '#e0e0e0';
    }
});

confirmPasswordInput.addEventListener('blur', validateConfirmPassword);
confirmPasswordInput.addEventListener('input', function() {
    if (this.value.length > 0) {
        confirmPasswordError.textContent = '';
        this.style.borderColor = '#e0e0e0';
    }
});

termsCheckbox.addEventListener('change', function() {
    if (this.checked) {
        termsError.textContent = '';
    }
});

// Show notification
function showNotification(message, isSuccess = true) {
    notificationMessage.textContent = message;
    notification.style.backgroundColor = isSuccess ? '#2ed573' : '#ff4757';
    notification.style.display = 'flex';
    
    setTimeout(() => {
        notification.style.display = 'none';
    }, 5000);
}

// Check backend health
async function checkBackendHealth() {
    try {
        const response = await fetch(`${API_BASE_URL}/health`);
        if (response.ok) {
            console.log('Backend is running');
            return true;
        }
    } catch (error) {
        console.warn('Backend is not running. Using simulated registration.');
        return false;
    }
    return false;
}

// Form submission
registrationForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // Validate all fields
    const isNameValid = validateName();
    const isEmailValid = validateEmail();
    const isPasswordValid = validatePassword();
    const isConfirmPasswordValid = validateConfirmPassword();
    const isTermsValid = validateTerms();
    
    if (!isNameValid || !isEmailValid || !isPasswordValid || !isConfirmPasswordValid || !isTermsValid) {
        showNotification('Please fix the errors in the form', false);
        return;
    }
    
    // Disable submit button and show loading state
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    submitBtn.disabled = true;
    
    // Prepare form data
    const formData = {
        fullName: fullNameInput.value.trim(),
        email: emailInput.value.trim(),
        password: passwordInput.value
    };
    
    try {
        // Check if backend is available
        const backendAvailable = await checkBackendHealth();
        
        if (backendAvailable) {
            // Send data to real backend
            const response = await fetch(`${API_BASE_URL}/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });
            
            const result = await response.json();
            
            if (response.ok && result.success) {
                showNotification(`Registration successful! Welcome, ${formData.fullName}!`);
                
                // Reset form
                registrationForm.reset();
                strengthFill.style.width = '0%';
                strengthText.textContent = 'Password strength';
                strengthText.style.color = '#636e72';
                
                // Reset border colors
                const inputs = [fullNameInput, emailInput, passwordInput, confirmPasswordInput];
                inputs.forEach(input => {
                    input.style.borderColor = '#e0e0e0';
                });
            } else {
                showNotification(result.message || 'Registration failed', false);
            }
        } else {
            // Fallback to simulated registration if backend is not available
            await new Promise(resolve => setTimeout(resolve, 1500));
            showNotification(`Registration successful! Welcome, ${formData.fullName}! (Simulated)`);
            
            // Reset form
            registrationForm.reset();
            strengthFill.style.width = '0%';
            strengthText.textContent = 'Password strength';
            strengthText.style.color = '#636e72';
            
            // Reset border colors
            const inputs = [fullNameInput, emailInput, passwordInput, confirmPasswordInput];
            inputs.forEach(input => {
                input.style.borderColor = '#e0e0e0';
            });
        }
    } catch (error) {
        console.error('Registration error:', error);
        showNotification('Registration failed. Please try again later.', false);
    } finally {
        // Re-enable submit button
        submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Create Account';
        submitBtn.disabled = false;
    }
});

// Social login buttons
document.querySelectorAll('.social-btn').forEach(button => {
    button.addEventListener('click', function() {
        const platform = this.classList.contains('google') ? 'Google' :
                        this.classList.contains('github') ? 'GitHub' : 'Twitter';
        
        showNotification(`${platform} login would be implemented in a real application`, false);
    });
});

// Initialize with some example validation
document.addEventListener('DOMContentLoaded', function() {
    // Add focus effects
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.style.borderColor = '#6a11cb';
            this.style.boxShadow = '0 0 0 3px rgba(106, 17, 203, 0.1)';
        });
        
        input.addEventListener('blur', function() {
            this.style.boxShadow = 'none';
        });
    });
    
    // Check backend health on load
    checkBackendHealth().then(isRunning => {
        if (isRunning) {
            console.log('Backend API is available at', API_BASE_URL);
        } else {
            console.log('Running in simulation mode. Start the backend with: node server.js');
        }
    });
});