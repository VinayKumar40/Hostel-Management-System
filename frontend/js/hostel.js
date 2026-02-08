// ==========================================
// HOSTEL.JS - HOSTEL MANAGEMENT LOGIC
// ==========================================

let currentHostelId = null;
let hostels = [];

/**
 * Load Hostels Page
 */
async function loadHostelsPage() {
    try {
        const response = await fetch('pages/hostel-list.html');
        const html = await response.text();
        document.getElementById('hostelsPage').innerHTML = html;

        setTimeout(() => {
            // Show add button only for admins
            if (api.isAdmin()) {
                show('addHostelBtn');
            }

            // Setup event listeners
            const hostelForm = document.getElementById('hostelFormElement');
            if (hostelForm) {
                hostelForm.addEventListener('submit', handleHostelFormSubmit);
            }

            loadHostels();
        }, 100);
    } catch (error) {
        console.error('Error loading hostels page:', error);
        showError('Failed to load hostels page');
    }
}

/**
 * Load Hostels List
 */
async function loadHostels() {
    try {
        const response = await api.getAllHostels();

        if (response.success) {
            hostels = response.data;
            displayHostels(hostels);
        }
    } catch (error) {
        console.error('Error loading hostels:', error);
        showError('Failed to load hostels');
    }
}

/**
 * Display Hostels
 */
function displayHostels(hostelList) {
    const hostelsList = document.getElementById('hostelsList');
    const noHostels = document.getElementById('noHostels');

    if (!hostelsList) return;

    if (hostelList.length === 0) {
        hostelsList.innerHTML = '';
        show('noHostels');
        return;
    }

    hide('noHostels');
    hostelsList.innerHTML = hostelList.map(hostel => `
        <div class="hostel-card">
            <div class="hostel-card-header">
                <h3>${escapeHtml(hostel.hostelName)}</h3>
                <p>₹${hostel.costPerBed}/bed</p>
            </div>
            <div class="hostel-card-body">
                <p><strong>📍 Location:</strong> ${escapeHtml(hostel.city)}, ${escapeHtml(hostel.state)}</p>
                <p><strong>🏢 Address:</strong> ${escapeHtml(hostel.address)}</p>
                <p><strong>📮 Pincode:</strong> ${escapeHtml(hostel.pincode)}</p>
                <p><strong>🚪 Rooms:</strong> ${hostel.availableRooms}/${hostel.totalRooms} available</p>
                ${hostel.facilities && hostel.facilities.length > 0 ? `
                    <p><strong>✨ Facilities:</strong> ${hostel.facilities.join(', ')}</p>
                ` : ''}
                ${hostel.description ? `<p><strong>📝 Description:</strong> ${escapeHtml(hostel.description)}</p>` : ''}
            </div>
            <div class="hostel-card-footer">
                <button class="btn btn-primary" onclick="viewHostelDetails('${hostel._id}')">View</button>
                ${api.isAdmin() ? `
                    <button class="btn btn-warning" onclick="editHostel('${hostel._id}')">Edit</button>
                    <button class="btn btn-danger" onclick="deleteHostelConfirm('${hostel._id}')">Delete</button>
                ` : ''}
            </div>
        </div>
    `).join('');
}

/**
 * Filter Hostels by Search
 */
function filterHostels() {
    const searchInput = document.getElementById('searchHostel');
    if (!searchInput) return;

    const searchTerm = searchInput.value.toLowerCase();
    const filtered = hostels.filter(hostel =>
        hostel.hostelName.toLowerCase().includes(searchTerm) ||
        hostel.city.toLowerCase().includes(searchTerm) ||
        hostel.address.toLowerCase().includes(searchTerm)
    );

    displayHostels(filtered);
}

/**
 * Load Hostel Form
 */
function loadHostelForm(hostelId = null) {
    currentHostelId = hostelId;
    const form = document.getElementById('hostelForm');

    if (!form) return;

    if (hostelId) {
        // Edit mode
        const hostel = hostels.find(h => h._id === hostelId);
        if (hostel) {
            document.getElementById('formTitle').textContent = 'Edit Hostel';
            document.getElementById('hostelName').value = hostel.hostelName;
            document.getElementById('address').value = hostel.address;
            document.getElementById('city').value = hostel.city;
            document.getElementById('state').value = hostel.state;
            document.getElementById('pincode').value = hostel.pincode;
            document.getElementById('totalRooms').value = hostel.totalRooms;
            document.getElementById('availableRooms').value = hostel.availableRooms;
            document.getElementById('costPerBed').value = hostel.costPerBed;
            document.getElementById('description').value = hostel.description || '';
            document.getElementById('facilities').value = hostel.facilities?.join(', ') || '';
        }
    } else {
        // Create mode
        document.getElementById('formTitle').textContent = 'Add New Hostel';
        document.getElementById('hostelFormElement').reset();
    }

    show('hostelForm');
}

/**
 * Cancel Hostel Form
 */
function cancelHostelForm() {
    currentHostelId = null;
    hide('hostelForm');
    document.getElementById('hostelFormElement').reset();
}

/**
 * Handle Hostel Form Submit
 */
async function handleHostelFormSubmit(event) {
    event.preventDefault();

    const formData = {
        hostelName: document.getElementById('hostelName').value,
        address: document.getElementById('address').value,
        city: document.getElementById('city').value,
        state: document.getElementById('state').value,
        pincode: document.getElementById('pincode').value,
        totalRooms: parseInt(document.getElementById('totalRooms').value),
        availableRooms: parseInt(document.getElementById('availableRooms').value) || parseInt(document.getElementById('totalRooms').value),
        costPerBed: parseFloat(document.getElementById('costPerBed').value),
        description: document.getElementById('description').value,
        facilities: document.getElementById('facilities').value.split(',').map(f => f.trim()).filter(f => f),
    };

    try {
        let response;
        if (currentHostelId) {
            response = await api.updateHostel(currentHostelId, formData);
        } else {
            response = await api.createHostel(formData);
        }

        if (response.success) {
            showToast(
                currentHostelId ? 'Hostel updated successfully!' : 'Hostel created successfully!',
                'success'
            );
            cancelHostelForm();
            loadHostels();
        }
    } catch (error) {
        showError(error.message || 'Failed to save hostel', 'formError');
    }
}

/**
 * View Hostel Details
 */
function viewHostelDetails(hostelId) {
    const hostel = hostels.find(h => h._id === hostelId);
    if (!hostel) return;

    const details = `
        <h3>${escapeHtml(hostel.hostelName)}</h3>
        <p><strong>Address:</strong> ${escapeHtml(hostel.address)}, ${escapeHtml(hostel.city)}, ${escapeHtml(hostel.state)} - ${escapeHtml(hostel.pincode)}</p>
        <p><strong>Rooms:</strong> ${hostel.availableRooms}/${hostel.totalRooms} available</p>
        <p><strong>Cost Per Bed:</strong> ₹${hostel.costPerBed}</p>
        ${hostel.facilities && hostel.facilities.length > 0 ? `<p><strong>Facilities:</strong> ${hostel.facilities.join(', ')}</p>` : ''}
        ${hostel.description ? `<p><strong>Description:</strong> ${escapeHtml(hostel.description)}</p>` : ''}
        ${hostel.createdBy ? `<p><strong>Created By:</strong> ${escapeHtml(hostel.createdBy.name)}</p>` : ''}
    `;

    showModal('Hostel Details', details);
}

/**
 * Edit Hostel
 */
function editHostel(hostelId) {
    if (!api.isAdmin()) {
        showError('Only admins can edit hostels');
        return;
    }
    loadHostelForm(hostelId);
}

/**
 * Delete Hostel Confirmation
 */
function deleteHostelConfirm(hostelId) {
    if (!api.isAdmin()) {
        showError('Only admins can delete hostels');
        return;
    }

    if (confirm('Are you sure you want to delete this hostel? This action cannot be undone.')) {
        deleteHostel(hostelId);
    }
}

/**
 * Delete Hostel
 */
async function deleteHostel(hostelId) {
    try {
        const response = await api.deleteHostel(hostelId);

        if (response.success) {
            showToast('Hostel deleted successfully!', 'success');
            loadHostels();
        }
    } catch (error) {
        showError(error.message || 'Failed to delete hostel');
    }
}

/**
 * Load Browse Hostels Page - For users to discover nearby hostels
 */
async function loadBrowseHostelsPage() {
    try {
        const response = await fetch('pages/browse-hostels.html');
        const html = await response.text();
        document.getElementById('browseHostelsPage').innerHTML = html;

        setTimeout(() => {
            loadBrowseHostels();
            setupBrowseFilters();
        }, 100);
    } catch (error) {
        console.error('Error loading browse hostels page:', error);
        showError('Failed to load browse hostels page');
    }
}

/**
 * Load and Display Browse Hostels with Ratings
 */
async function loadBrowseHostels() {
    try {
        const response = await api.getAllHostels();

        if (response.success) {
            const hostelsWithRatings = response.data.map(hostel => ({
                ...hostel,
                rating: generateMockRating(hostel._id),
                reviewCount: Math.floor(Math.random() * 150) + 10,
                reviews: generateMockReviews(hostel._id)
            }));
            
            displayBrowseHostels(hostelsWithRatings);
        }
    } catch (error) {
        console.error('Error loading browse hostels:', error);
        showError('Failed to load hostels');
    }
}

/**
 * Generate Mock Rating (persistent per hostel)
 */
function generateMockRating(hostelId) {
    // Use hostel ID to generate consistent rating each time
    const seed = hostelId.charCodeAt(0) + hostelId.charCodeAt(hostelId.length - 1);
    const ratings = [3.5, 3.8, 4.0, 4.2, 4.5, 4.1, 3.9, 4.3, 4.4, 3.7];
    return ratings[seed % ratings.length];
}

/**
 * Generate Mock Reviews
 */
function generateMockReviews(hostelId) {
    const reviewTemplates = [
        { name: 'John', text: 'Great hostel, clean rooms and friendly staff!', rating: 5 },
        { name: 'Sarah', text: 'Good location, nice common areas', rating: 4 },
        { name: 'Mike', text: 'Affordable and comfortable', rating: 4 },
        { name: 'Emma', text: 'Amazing experience, would stay again!', rating: 5 },
        { name: 'Alex', text: 'Good value for money', rating: 4 },
        { name: 'Lisa', text: 'Clean and well-maintained', rating: 4 },
        { name: 'Tom', text: 'Excellent hospitality', rating: 5 },
        { name: 'Nina', text: 'Very comfortable stay', rating: 4 },
    ];
    
    const num = hostelId.charCodeAt(0) % 3 + 2; // 2-3 reviews per hostel
    return reviewTemplates.slice(0, num);
}

/**
 * Display Browse Hostels
 */
function displayBrowseHostels(hostelList) {
    const browseHostelsList = document.getElementById('browseHostelsList');
    
    if (!browseHostelsList) return;

    if (hostelList.length === 0) {
        browseHostelsList.innerHTML = '<p class="no-data">No hostels available in your area</p>';
        return;
    }

    browseHostelsList.innerHTML = hostelList.map(hostel => `
        <div class="hostel-browse-card">
            <div class="hostel-browse-header">
                <div class="hostel-info">
                    <h3>${escapeHtml(hostel.hostelName)}</h3>
                    <p class="hostel-location">📍 ${escapeHtml(hostel.city)}, ${escapeHtml(hostel.state)}</p>
                </div>
                <div class="hostel-rating">
                    <div class="stars">${generateStarRating(hostel.rating)}</div>
                    <p class="rating-value">${hostel.rating.toFixed(1)} ⭐</p>
                    <p class="review-count">${hostel.reviewCount} reviews</p>
                </div>
            </div>

            <div class="hostel-browse-body">
                <div class="hostel-details">
                    <p><strong>💰 Price:</strong> ₹${hostel.costPerBed}/bed</p>
                    <p><strong>🚪 Availability:</strong> ${hostel.availableRooms} rooms available</p>
                    ${hostel.facilities && hostel.facilities.length > 0 ? `
                        <p><strong>✨ Amenities:</strong> ${hostel.facilities.slice(0, 3).join(', ')}${hostel.facilities.length > 3 ? '...' : ''}</p>
                    ` : ''}
                </div>

                <div class="hostel-reviews">
                    <h4>Recent Reviews</h4>
                    ${hostel.reviews.map(review => `
                        <div class="review-item">
                            <p class="review-author"><strong>${escapeHtml(review.name)}</strong> <span class="review-stars">${'⭐'.repeat(review.rating)}</span></p>
                            <p class="review-text">"${escapeHtml(review.text)}"</p>
                        </div>
                    `).join('')}
                </div>
            </div>

            <div class="hostel-browse-footer">
                <button class="btn btn-primary" onclick="viewHostelDetails('${hostel._id}')">View Details</button>
                <button class="btn btn-secondary" onclick="showContactInfo('${escapeHtml(hostel.hostelName)}', '${escapeHtml(hostel.address)}')">Contact</button>
            </div>
        </div>
    `).join('');
}

/**
 * Generate Star Rating Display
 */
function generateStarRating(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    let stars = '⭐'.repeat(fullStars);
    if (hasHalfStar) stars += '✨';
    return stars;
}

/**
 * Setup Browse Filters
 */
function setupBrowseFilters() {
    const filterInput = document.getElementById('browseFilterInput');
    const sortSelect = document.getElementById('browseSortSelect');

    if (filterInput) {
        filterInput.addEventListener('input', (e) => {
            filterBrowseHostels(e.target.value);
        });
    }

    if (sortSelect) {
        sortSelect.addEventListener('change', (e) => {
            sortBrowseHostels(e.target.value);
        });
    }
}

/**
 * Filter Browse Hostels
 */
function filterBrowseHostels(searchTerm) {
    const cards = document.querySelectorAll('.hostel-browse-card');
    const term = searchTerm.toLowerCase();

    cards.forEach(card => {
        const hostelName = card.querySelector('h3')?.textContent?.toLowerCase() || '';
        const location = card.querySelector('.hostel-location')?.textContent?.toLowerCase() || '';
        
        if (hostelName.includes(term) || location.includes(term)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

/**
 * Sort Browse Hostels
 */
function sortBrowseHostels(sortBy) {
    const container = document.getElementById('browseHostelsList');
    if (!container) return;

    const cards = Array.from(document.querySelectorAll('.hostel-browse-card'));
    
    cards.sort((a, b) => {
        if (sortBy === 'rating-high') {
            const ratingA = parseFloat(a.querySelector('.rating-value')?.textContent || 0);
            const ratingB = parseFloat(b.querySelector('.rating-value')?.textContent || 0);
            return ratingB - ratingA;
        } else if (sortBy === 'rating-low') {
            const ratingA = parseFloat(a.querySelector('.rating-value')?.textContent || 0);
            const ratingB = parseFloat(b.querySelector('.rating-value')?.textContent || 0);
            return ratingA - ratingB;
        } else if (sortBy === 'price-low') {
            const priceA = parseInt(a.querySelector('.hostel-details p')?.textContent?.match(/₹(\d+)/)?.[1] || 0);
            const priceB = parseInt(b.querySelector('.hostel-details p')?.textContent?.match(/₹(\d+)/)?.[1] || 0);
            return priceA - priceB;
        }
        return 0;
    });

    cards.forEach(card => container.appendChild(card));
}

/**
 * Show Contact Information
 */
function showContactInfo(hostelName, address) {
    showModal('Contact Information', `
        <div style="text-align: left; line-height: 1.8;">
            <p><strong>Hostel:</strong> ${hostelName}</p>
            <p><strong>Address:</strong> ${address}</p>
            <p><strong>Phone:</strong> +91 XXXXXXXXXX (Coming soon)</p>
            <p><strong>Email:</strong> info@hostel.com (Coming soon)</p>
            <p style="margin-top: 20px; color: #666; font-size: 14px;">Contact details will be displayed after booking confirmation</p>
        </div>
    `);
}

