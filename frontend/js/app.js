// ==========================================
// APP.JS - MAIN APPLICATION LOGIC
// ==========================================

/**
 * Initialize Application
 */
function initializeApp() {
    // Check authentication
    if (!isAuthenticated()) {
        loadAuthPages();
        return;
    }

    // Setup main application
    setupNavigation();
    updateNavigation();
    navigateTo('dashboard');
}

/**
 * Setup Navigation
 */
function setupNavigation() {
    // Setup nav links
    document.getElementById('dashboardLink').addEventListener('click', (e) => {
        e.preventDefault();
        navigateTo('dashboard');
    });

    document.getElementById('hostelsLink').addEventListener('click', (e) => {
        e.preventDefault();
        navigateTo('hostels');
    });

    document.getElementById('browseLink').addEventListener('click', (e) => {
        e.preventDefault();
        navigateTo('browse');
    });

    document.getElementById('reportsLink').addEventListener('click', (e) => {
        e.preventDefault();
        navigateTo('reports');
    });

    document.getElementById('settingsLink').addEventListener('click', (e) => {
        e.preventDefault();
        navigateTo('settings');
    });

    document.getElementById('profileLink').addEventListener('click', (e) => {
        e.preventDefault();
        navigateTo('profile');
    });

    document.getElementById('logoutBtn').addEventListener('click', () => {
        handleLogout();
    });
}

/**
 * Update Navigation Based on Role
 */
function updateNavigation() {
    const isAdmin = api.isAdmin();

    if (isAdmin) {
        show('reportsNavItem');
        show('settingsNavItem');
    } else {
        hide('reportsNavItem');
        hide('settingsNavItem');
    }
}

/**
 * Navigate to Page
 */
async function navigateTo(page) {
    hideAllPages();

    switch (page) {
        case 'dashboard':
            show('navbar');
            show('dashboardPage');
            await loadDashboard();
            break;

        case 'hostels':
            show('navbar');
            show('hostelsPage');
            await loadHostelsPage();
            break;

        case 'browse':
            show('navbar');
            show('browseHostelsPage');
            await loadBrowseHostelsPage();
            break;

        case 'reports':
            if (!api.isAdmin()) {
                showError('You do not have permission to access reports');
                navigateTo('dashboard');
                return;
            }
            show('navbar');
            show('reportsPage');
            await loadReportsPage();
            break;

        case 'settings':
            if (!api.isAdmin()) {
                showError('You do not have permission to access settings');
                navigateTo('dashboard');
                return;
            }
            show('navbar');
            show('settingsPage');
            await loadSettingsPage();
            break;

        case 'profile':
            show('navbar');
            show('profilePage');
            await loadProfilePage();
            break;

        default:
            navigateTo('dashboard');
    }
}

/**
 * Hide All Pages
 */
function hideAllPages() {
    hide('dashboardPage');
    hide('hostelsPage');
    hide('browseHostelsPage');
    hide('reportsPage');
    hide('settingsPage');
    hide('profilePage');
    hide('auth-container');
    hide('navbar');
}

/**
 * Load Profile Page
 */
async function loadProfilePage() {
    try {
        const response = await fetch('pages/profile.html');
        const html = await response.text();
        document.getElementById('profilePage').innerHTML = html;

        setTimeout(() => {
            const profileForm = document.getElementById('profileForm');
            if (profileForm) {
                profileForm.addEventListener('submit', handleProfileUpdate);
            }

            loadUserProfile();
        }, 100);
    } catch (error) {
        console.error('Error loading profile page:', error);
        showError('Failed to load profile page');
    }
}

/**
 * Load User Profile
 */
async function loadUserProfile() {
    try {
        const decoded = api.decodeToken();
        const user = await api.getUserById(decoded.id);

        if (user.success) {
            const userData = user.data;

            // Display profile information
            const profileName = document.getElementById('profileName');
            const profileRole = document.getElementById('profileRole');
            const profileNameField = document.getElementById('profileNameField');
            const profileEmailField = document.getElementById('profileEmailField');
            const profilePhone = document.getElementById('profilePhone');
            const profileAddress = document.getElementById('profileAddress');

            if (profileName) profileName.textContent = userData.name;
            if (profileRole) {
                profileRole.textContent = userData.role.charAt(0).toUpperCase() + userData.role.slice(1);
                profileRole.className = `role-badge ${userData.role}`;
            }
            if (profileNameField) profileNameField.value = userData.name;
            if (profileEmailField) profileEmailField.value = userData.email;
            if (profilePhone) profilePhone.value = userData.phone || '';
            if (profileAddress) profileAddress.value = userData.address || '';
        }
    } catch (error) {
        console.error('Error loading user profile:', error);
        showError('Failed to load profile');
    }
}

/**
 * Handle Profile Update
 */
async function handleProfileUpdate(event) {
    event.preventDefault();

    const updateData = {
        name: document.getElementById('profileNameField').value,
        phone: document.getElementById('profilePhone').value,
        address: document.getElementById('profileAddress').value,
    };

    try {
        const decoded = api.decodeToken();
        const response = await api.updateUser(decoded.id, updateData);

        if (response.success) {
            showToast('Profile updated successfully!', 'success');
            loadUserProfile();
        }
    } catch (error) {
        const profileError = document.getElementById('profileError');
        if (profileError) {
            profileError.textContent = error.message || 'Failed to update profile';
            show('profileError');
        }
        showError(error.message || 'Failed to update profile');
    }
}

/**
 * Reset Profile Form
 */
function resetProfileForm() {
    loadUserProfile();
}

/**
 * Show/Hide Utilities
 */
function show(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.style.display = 'block';
    }
}

function hide(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.style.display = 'none';
    }
}

/**
 * Show Toast Notification
 */
function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    if (toast) {
        toast.textContent = message;
        toast.className = `toast show ${type}`;

        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
}

/**
 * Show Error Box
 */
function showError(message, elementId = null) {
    if (elementId) {
        const element = document.getElementById(elementId);
        if (element) {
            element.textContent = message;
            element.style.display = 'block';
        }
    }
    showToast(message, 'error');
}

/**
 * Show Loading
 */
function showLoading(isLoading, elementId) {
    if (elementId) {
        const element = document.getElementById(elementId);
        if (element) {
            element.style.display = isLoading ? 'block' : 'none';
        }
    }
}

/**
 * Show Modal
 */
function showModal(title, content) {
    const modal = document.getElementById('modal');
    const modalBody = document.getElementById('modalBody');

    if (modal && modalBody) {
        modalBody.innerHTML = `<h2>${title}</h2><div>${content}</div>`;
        modal.style.display = 'flex';

        const closeBtn = document.querySelector('.modal-close');
        if (closeBtn) {
            closeBtn.onclick = () => {
                modal.style.display = 'none';
            };
        }

        window.onclick = (event) => {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        };
    }
}

/**
 * Escape HTML Special Characters
 */
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;',
    };
    return text.replace(/[&<>"']/g, (m) => map[m]);
}

/**
 * Format Date
 */
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

/**
 * Load all required pages on startup
 */
async function loadAllPages() {
    try {
        // Load main pages
        const pages = ['dashboard', 'hostel-list', 'reports', 'settings', 'profile'];

        for (const page of pages) {
            try {
                const response = await fetch(`pages/${page}.html`);
                const html = await response.text();

                const pageId = page === 'hostel-list' ? 'hostelsPage' : page + 'Page';
                const element = document.getElementById(pageId);
                if (element) {
                    element.innerHTML = html;
                }
            } catch (error) {
                console.warn(`Failed to preload ${page}:`, error);
            }
        }
    } catch (error) {
        console.warn('Could not preload all pages:', error);
    }
}

/**
 * Application Startup
 */
document.addEventListener('DOMContentLoaded', () => {
    // Show navbar only for authenticated users
    if (isAuthenticated()) {
        document.getElementById('navbar').style.display = 'block';
    }

    // Initialize app
    initializeApp();
});

// Handle page unload
window.addEventListener('beforeunload', () => {
    // Could save state if needed
});

// Handle token expiration
setInterval(() => {
    if (isAuthenticated()) {
        const decoded = api.decodeToken();
        if (decoded && decoded.exp) {
            const expiryTime = decoded.exp * 1000; // Convert to ms
            const currentTime = Date.now();
            const timeLeft = expiryTime - currentTime;

            // If less than 1 minute left, show warning
            if (timeLeft < 60000 && timeLeft > 0) {
                showToast('Your session is expiring soon. Please refresh or re-login.', 'warning');
            }

            // If expired
            if (timeLeft <= 0) {
                showToast('Your session has expired. Please login again.', 'error');
                handleLogout();
            }
        }
    }
}, 30000); // Check every 30 seconds
