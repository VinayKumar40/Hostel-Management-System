// ==========================================
// SETTINGS.JS - SETTINGS MANAGEMENT LOGIC
// ==========================================

/**
 * Load Settings Page
 */
async function loadSettingsPage() {
    try {
        const response = await fetch('pages/settings.html');
        const html = await response.text();
        document.getElementById('settingsPage').innerHTML = html;

        setTimeout(() => {
            // Setup event listeners
            const settingsForm = document.getElementById('settingsForm');
            if (settingsForm) {
                settingsForm.addEventListener('submit', handleSettingsFormSubmit);
            }

            loadSettings();
            checkSystemStatus();
        }, 100);
    } catch (error) {
        console.error('Error loading settings page:', error);
        showError('Failed to load settings page');
    }
}

/**
 * Load Settings
 */
async function loadSettings() {
    try {
        const response = await api.getAllSettings();

        if (response.success && response.data) {
            const settings = response.data;

            // Set form values from settings
            settings.forEach(setting => {
                const element = document.getElementById(setting.settingKey);
                if (element) {
                    if (element.type === 'checkbox') {
                        element.checked = setting.settingValue === true || setting.settingValue === 'true';
                    } else {
                        element.value = setting.settingValue;
                    }
                }
            });
        }
    } catch (error) {
        console.error('Error loading settings:', error);
    }
}

/**
 * Handle Settings Form Submit
 */
async function handleSettingsFormSubmit(event) {
    event.preventDefault();

    const settings = [
        {
            key: 'siteName',
            value: document.getElementById('siteName').value,
        },
        {
            key: 'defaultCurrency',
            value: document.getElementById('defaultCurrency').value,
        },
        {
            key: 'maxUsers',
            value: parseInt(document.getElementById('maxUsers').value),
        },
        {
            key: 'maintenanceMode',
            value: document.getElementById('maintenanceMode').checked,
        },
    ];

    try {
        let successCount = 0;
        for (const setting of settings) {
            if (setting.value) {
                const response = await api.updateSetting(setting.key, {
                    settingValue: setting.value,
                });
                if (response.success) {
                    successCount++;
                }
            }
        }

        if (successCount > 0) {
            showToast(`${successCount} setting(s) updated successfully!`, 'success');
            const messageDiv = document.getElementById('settingsMessage');
            if (messageDiv) {
                messageDiv.textContent = 'Settings saved successfully!';
                show('settingsMessage');
                setTimeout(() => hide('settingsMessage'), 3000);
            }
        }
    } catch (error) {
        showError(error.message || 'Failed to update settings');
    }
}

/**
 * Check System Status
 */
async function checkSystemStatus() {
    try {
        // Check API status
        const apiResponse = await fetch(`${API_URL.replace('/api', '')}/api/health`);
        if (apiResponse.ok) {
            const apiStatus = document.getElementById('apiStatus');
            if (apiStatus) {
                apiStatus.innerHTML = '<span style="color: green;">✓ Online</span>';
            }
        }
    } catch (error) {
        const apiStatus = document.getElementById('apiStatus');
        if (apiStatus) {
            apiStatus.innerHTML = '<span style="color: red;">✗ Offline</span>';
        }
    }

    // Check Database status
    try {
        const response = await api.getAllHostels();
        if (response.success) {
            const dbStatus = document.getElementById('dbStatus');
            if (dbStatus) {
                dbStatus.innerHTML = '<span style="color: green;">✓ Connected</span>';
            }
        }
    } catch (error) {
        const dbStatus = document.getElementById('dbStatus');
        if (dbStatus) {
            dbStatus.innerHTML = '<span style="color: red;">✗ Disconnected</span>';
        }
    }
}
