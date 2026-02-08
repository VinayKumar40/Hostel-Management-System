// ==========================================
// API.JS - API UTILITY FUNCTIONS
// ==========================================

const API_URL = 'http://localhost:5000/api';

class APIClient {
    constructor(baseURL = API_URL) {
        this.baseURL = baseURL;
        this.token = localStorage.getItem('token') || null;
    }

    /**
     * Get auth token
     */
    getToken() {
        return localStorage.getItem('token');
    }

    /**
     * Set auth token
     */
    setToken(token) {
        this.token = token;
        if (token) {
            localStorage.setItem('token', token);
        } else {
            localStorage.removeItem('token');
        }
    }

    /**
     * Make API request
     */
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers,
        };

        // Add token to headers if available
        if (this.token) {
            headers.Authorization = `Bearer ${this.token}`;
        }

        try {
            const response = await fetch(url, {
                ...options,
                headers,
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || `HTTP ${response.status}`);
            }

            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    /**
     * GET request
     */
    get(endpoint) {
        return this.request(endpoint, { method: 'GET' });
    }

    /**
     * POST request
     */
    post(endpoint, body) {
        return this.request(endpoint, {
            method: 'POST',
            body: JSON.stringify(body),
        });
    }

    /**
     * PUT request
     */
    put(endpoint, body) {
        return this.request(endpoint, {
            method: 'PUT',
            body: JSON.stringify(body),
        });
    }

    /**
     * DELETE request
     */
    delete(endpoint) {
        return this.request(endpoint, { method: 'DELETE' });
    }

    // ==========================================
    // AUTH ENDPOINTS
    // ==========================================

    registerUser(data) {
        return this.post('/auth/register', data);
    }

    loginUser(data) {
        return this.post('/auth/login', data);
    }

    getCurrentUser() {
        return this.get('/auth/me');
    }

    logoutUser() {
        return this.post('/auth/logout', {});
    }

    // ==========================================
    // HOSTEL ENDPOINTS
    // ==========================================

    createHostel(data) {
        return this.post('/hostel', data);
    }

    getAllHostels() {
        return this.get('/hostel');
    }

    getHostelById(id) {
        return this.get(`/hostel/${id}`);
    }

    updateHostel(id, data) {
        return this.put(`/hostel/${id}`, data);
    }

    deleteHostel(id) {
        return this.delete(`/hostel/${id}`);
    }

    // ==========================================
    // USER ENDPOINTS
    // ==========================================

    getAllUsers() {
        return this.get('/users');
    }

    getUserById(id) {
        return this.get(`/users/${id}`);
    }

    getCurrentUserProfile() {
        return this.get('/users/profile/me');
    }

    updateUser(id, data) {
        return this.put(`/users/${id}`, data);
    }

    deleteUser(id) {
        return this.delete(`/users/${id}`);
    }

    updateProfile(data) {
        const userId = this.decodeToken()?.id;
        if (!userId) throw new Error('User not authenticated');
        return this.updateUser(userId, data);
    }

    // ==========================================
    // REPORT ENDPOINTS
    // ==========================================

    createReport(data) {
        return this.post('/reports', data);
    }

    getAllReports() {
        return this.get('/reports');
    }

    getReportById(id) {
        return this.get(`/reports/${id}`);
    }

    deleteReport(id) {
        return this.delete(`/reports/${id}`);
    }

    getDashboardStats() {
        return this.get('/reports/dashboard/stats');
    }

    // ==========================================
    // SETTINGS ENDPOINTS
    // ==========================================

    getAllSettings() {
        return this.get('/settings');
    }

    getSettingByKey(key) {
        return this.get(`/settings/${key}`);
    }

    updateSetting(key, data) {
        return this.put(`/settings/${key}`, data);
    }

    deleteSetting(key) {
        return this.delete(`/settings/${key}`);
    }

    // ==========================================
    // UTILITY METHODS
    // ==========================================

    /**
     * Decode JWT token
     */
    decodeToken() {
        const token = this.getToken();
        if (!token) return null;

        try {
            const payload = token.split('.')[1];
            const decoded = JSON.parse(atob(payload));
            return decoded;
        } catch (error) {
            console.error('Token decode error:', error);
            return null;
        }
    }

    /**
     * Check if user is authenticated
     */
    isAuthenticated() {
        return !!this.getToken();
    }

    /**
     * Get user role
     */
    getUserRole() {
        const decoded = this.decodeToken();
        return decoded?.role || null;
    }

    /**
     * Check if user is admin
     */
    isAdmin() {
        return this.getUserRole() === 'admin';
    }

    /**
     * Clear authentication
     */
    clearAuth() {
        this.setToken(null);
    }
}

// Create global API client instance
const api = new APIClient();
