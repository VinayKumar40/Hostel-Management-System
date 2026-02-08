// ==========================================
// DASHBOARD.JS - DASHBOARD LOGIC
// ==========================================

/**
 * Load Dashboard
 */
async function loadDashboard() {
    try {
        const response = await fetch('pages/dashboard.html');
        const html = await response.text();
        document.getElementById('dashboardPage').innerHTML = html;

        setTimeout(() => {
            const user = api.decodeToken();
            if (user?.role === 'admin') {
                loadAdminDashboard();
            } else {
                loadUserDashboard();
            }
        }, 100);
    } catch (error) {
        console.error('Error loading dashboard:', error);
        showError('Failed to load dashboard');
    }
}

/**
 * Load Admin Dashboard
 */
async function loadAdminDashboard() {
    try {
        // Show admin dashboard section
        show('adminDashboard');
        hide('userDashboard');

        // Fetch statistics
        const stats = await api.getDashboardStats();

        if (stats.success) {
            document.getElementById('totalHostels').textContent = stats.data.totalHostels;
            document.getElementById('totalRooms').textContent = stats.data.totalRooms;
            document.getElementById('totalAvailableRooms').textContent = stats.data.totalAvailableRooms;
            document.getElementById('occupancyRate').textContent = stats.data.occupancyRate + '%';
        }
    } catch (error) {
        console.error('Error loading admin dashboard:', error);
        showError('Failed to load dashboard statistics');
    }
}

/**
 * Load User Dashboard
 */
async function loadUserDashboard() {
    try {
        // Show user dashboard section
        hide('adminDashboard');
        show('userDashboard');

        // Get current user
        const decoded = api.decodeToken();
        const userGreeting = document.getElementById('userGreeting');
        if (userGreeting) {
            userGreeting.textContent = decoded?.name || 'Guest';
        }
    } catch (error) {
        console.error('Error loading user dashboard:', error);
        showError('Failed to load dashboard');
    }
}
