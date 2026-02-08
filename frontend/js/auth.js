// ==========================================
// AUTH.JS - AUTHENTICATION LOGIC
// ==========================================

/**
 * Handle Login
 */
async function handleLogin(event) {
    event.preventDefault();

    const email = document.getElementById('loginEmail')?.value;
    const password = document.getElementById('loginPassword')?.value;

    if (!email || !password) {
        showError('Please fill all fields');
        return;
    }

    try {
        showLoading(true, 'loginLoading');

        const response = await api.loginUser({ email, password });

        if (response.success) {
            api.setToken(response.token);
            showToast('Login successful!', 'success');
            setTimeout(() => {
                navigateTo('dashboard');
            }, 1000);
        }
    } catch (error) {
        showError(error.message || 'Login failed', 'loginError');
    } finally {
        showLoading(false, 'loginLoading');
    }
}

/**
 * Handle Registration
 */
async function handleRegister(event) {
    event.preventDefault();

    const name = document.getElementById('registerName')?.value;
    const email = document.getElementById('registerEmail')?.value;
    const password = document.getElementById('registerPassword')?.value;
    const confirmPassword = document.getElementById('registerConfirmPassword')?.value;

    if (!name || !email || !password || !confirmPassword) {
        showError('Please fill all fields');
        return;
    }

    if (password !== confirmPassword) {
        showError('Passwords do not match');
        return;
    }

    if (password.length < 6) {
        showError('Password must be at least 6 characters');
        return;
    }

    try {
        showLoading(true, 'registerLoading');

        const response = await api.registerUser({
            name,
            email,
            password,
            confirmPassword,
        });

        if (response.success) {
            api.setToken(response.token);
            showToast('Registration successful!', 'success');
            setTimeout(() => {
                navigateTo('dashboard');
            }, 1000);
        }
    } catch (error) {
        showError(error.message || 'Registration failed', 'registerError');
    } finally {
        showLoading(false, 'registerLoading');
    }
}

/**
 * Handle Logout
 */
async function handleLogout() {
    try {
        await api.logoutUser();
    } catch (error) {
        console.error('Logout error:', error);
    } finally {
        api.clearAuth();
        localStorage.removeItem('currentUser');
        showToast('You have been logged out', 'success');
        setTimeout(() => {
            window.location.href = '/index.html';
        }, 1000);
    }
}

/**
 * Check if user is authenticated
 */
function isAuthenticated() {
    return api.isAuthenticated();
}

/**
 * Get current user
 */
function getCurrentUser() {
    return JSON.parse(localStorage.getItem('currentUser') || '{}');
}

/**
 * Set current user
 */
function setCurrentUser(user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
}

/**
 * Load authentication forms
 */
async function loadAuthPages() {
    try {
        // Load login page
        const loginResponse = await fetch('pages/login.html');
        const loginHTML = await loginResponse.text();
        document.getElementById('loginPage').innerHTML = loginHTML;

        // Load register page
        const registerResponse = await fetch('pages/register.html');
        const registerHTML = await registerResponse.text();
        document.getElementById('registerPage').innerHTML = registerHTML;

        // Setup event listeners
        setTimeout(() => {
            const loginForm = document.getElementById('loginForm');
            const registerForm = document.getElementById('registerForm');

            if (loginForm) {
                loginForm.addEventListener('submit', handleLogin);
            }
            if (registerForm) {
                registerForm.addEventListener('submit', handleRegister);
            }
        }, 100);

        navigateToLogin();
    } catch (error) {
        console.error('Error loading auth pages:', error);
    }
}

/**
 * Navigate to login page
 */
function navigateToLogin() {
    hideAllPages();
    show('auth-container');
    show('loginPage');
    hide('registerPage');
}

/**
 * Navigate to register page
 */
function navigateToRegister() {
    hideAllPages();
    show('auth-container');
    show('registerPage');
    hide('loginPage');
}

/**
 * Change Password
 */
async function changePassword() {
    // This would typically open a modal with a form
    showToast('Feature coming soon!', 'warning');
}

/**
 * Delete Account
 */
function deleteAccount() {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
        showToast('Account deletion in progress...', 'warning');
        // Implementation would go here
    }
}
