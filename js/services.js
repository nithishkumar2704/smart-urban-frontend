// Service Listing Page JavaScript
// Handles filters, sorting, view toggle, and interactions

document.addEventListener('DOMContentLoaded', () => {
    initializeFilters();
    initializeSorting();
    initializeViewToggle();
    initializePagination();
    initializeProviderCards();
});

// ===================================
// FILTER FUNCTIONALITY
// ===================================

function initializeFilters() {
    // Price range filters
    const priceMin = document.getElementById('price-min');
    const priceMax = document.getElementById('price-max');
    const rangeMin = document.getElementById('range-min');
    const rangeMax = document.getElementById('range-max');

    if (priceMin && priceMax && rangeMin && rangeMax) {
        // Sync text inputs with range sliders
        rangeMin.addEventListener('input', () => {
            priceMin.value = rangeMin.value;
            applyFilters();
        });

        rangeMax.addEventListener('input', () => {
            priceMax.value = rangeMax.value;
            applyFilters();
        });

        priceMin.addEventListener('input', () => {
            rangeMin.value = priceMin.value;
            applyFilters();
        });

        priceMax.addEventListener('input', () => {
            rangeMax.value = priceMax.value;
            applyFilters();
        });
    }

    // Rating filters
    const ratingCheckboxes = document.querySelectorAll('input[name="rating"]');
    ratingCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', applyFilters);
    });

    // Distance filters
    const distanceRadios = document.querySelectorAll('input[name="distance"]');
    distanceRadios.forEach(radio => {
        radio.addEventListener('change', applyFilters);
    });

    // Availability filters
    const availabilityCheckboxes = document.querySelectorAll('input[name="availability"]');
    availabilityCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', applyFilters);
    });

    // Verified filter
    const verifiedCheckbox = document.querySelector('input[name="verified"]');
    if (verifiedCheckbox) {
        verifiedCheckbox.addEventListener('change', applyFilters);
    }

    // Clear all filters
    const clearFiltersBtn = document.querySelector('.clear-filters');
    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', clearAllFilters);
    }
}

function applyFilters() {
    // Get all filter values
    const filters = {
        priceMin: document.getElementById('price-min')?.value || 0,
        priceMax: document.getElementById('price-max')?.value || 200,
        ratings: Array.from(document.querySelectorAll('input[name="rating"]:checked')).map(cb => cb.value),
        distance: document.querySelector('input[name="distance"]:checked')?.value || 5,
        availability: Array.from(document.querySelectorAll('input[name="availability"]:checked')).map(cb => cb.value),
        verified: document.querySelector('input[name="verified"]')?.checked || false
    };

    console.log('Applying filters:', filters);

    // TODO: Filter provider cards based on criteria
    // This would typically make an API call to fetch filtered results
    filterProviderCards(filters);
}

function filterProviderCards(filters) {
    const cards = document.querySelectorAll('.provider-card');
    let visibleCount = 0;

    cards.forEach(card => {
        // For demo purposes, show all cards
        // In production, this would filter based on actual data
        card.style.display = '';
        visibleCount++;
    });

    // Update results count
    updateResultsCount(visibleCount);
}

function clearAllFilters() {
    // Reset price inputs
    document.getElementById('price-min').value = '';
    document.getElementById('price-max').value = '';
    document.getElementById('range-min').value = 0;
    document.getElementById('range-max').value = 200;

    // Uncheck all checkboxes
    document.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);

    // Reset distance to default (5 km)
    const defaultDistance = document.querySelector('input[name="distance"][value="5"]');
    if (defaultDistance) defaultDistance.checked = true;

    // Reapply filters (which will show all)
    applyFilters();
}

function updateResultsCount(count) {
    const resultsCount = document.querySelector('.results-count');
    if (resultsCount) {
        resultsCount.innerHTML = `Showing <strong>${count} results</strong>`;
    }
}

// ===================================
// SORTING FUNCTIONALITY
// ===================================

function initializeSorting() {
    const sortSelect = document.getElementById('sort-select');
    if (sortSelect) {
        sortSelect.addEventListener('change', (e) => {
            sortProviders(e.target.value);
        });
    }
}

function sortProviders(sortBy) {
    console.log('Sorting by:', sortBy);

    const grid = document.getElementById('services-grid');
    const cards = Array.from(grid.querySelectorAll('.provider-card'));

    // Sort cards based on criteria
    cards.sort((a, b) => {
        switch (sortBy) {
            case 'rating':
                return getRating(b) - getRating(a);
            case 'price-low':
                return getPrice(a) - getPrice(b);
            case 'price-high':
                return getPrice(b) - getPrice(a);
            case 'distance':
                return getDistance(a) - getDistance(b);
            default:
                return 0; // Recommended (default order)
        }
    });

    // Re-append cards in sorted order
    cards.forEach(card => grid.appendChild(card));
}

function getRating(card) {
    const ratingText = card.querySelector('.rating-stars')?.textContent;
    return parseFloat(ratingText?.replace('⭐', '').trim()) || 0;
}

function getPrice(card) {
    const priceText = card.querySelector('.price-value')?.textContent;
    return parseFloat(priceText?.replace(/[^0-9.]/g, '')) || 0;
}

function getDistance(card) {
    const distanceText = card.querySelector('.meta-item')?.textContent;
    return parseFloat(distanceText?.replace(/[^0-9.]/g, '')) || 0;
}

// ===================================
// VIEW TOGGLE (Grid/Map)
// ===================================

function initializeViewToggle() {
    const viewBtns = document.querySelectorAll('.view-btn');
    const servicesGrid = document.getElementById('services-grid');
    const mapView = document.getElementById('map-view');

    viewBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const view = btn.dataset.view;

            // Update active state
            viewBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Toggle views
            if (view === 'map') {
                servicesGrid.style.display = 'none';
                mapView.classList.remove('hidden');
                initializeMap(); // Call Leaflet initialization directly
            } else {
                servicesGrid.style.display = 'grid';
                mapView.classList.add('hidden');
            }
        });
    });
}

let map;
let markers = [];

// Initialize Map when view is toggled
function initializeMap() {
    console.log('Initializing OpenStreetMap with Leaflet...');

    // Default location (New York City)
    const defaultLocation = [40.7128, -74.0060]; // Leaflet uses [lat, lng]

    const mapElement = document.getElementById('google-map');
    if (!mapElement) return;

    // Clear placeholder
    mapElement.innerHTML = '';

    // Create Leaflet map
    // We need to ensure the container has a height before creating the map
    mapElement.style.height = '100%';
    mapElement.style.width = '100%';
    mapElement.style.minHeight = '500px';

    if (map) {
        map.remove(); // Clean up existing map instance
    }

    map = L.map('google-map').setView(defaultLocation, 13);

    // Add OpenStreetMap Tile Layer (Free)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Add markers for providers
    addProviderMarkers();

    // Try to get user's location
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const userLat = position.coords.latitude;
                const userLng = position.coords.longitude;

                map.setView([userLat, userLng], 13);

                // Add user marker (Blue Circle)
                L.circleMarker([userLat, userLng], {
                    radius: 10,
                    fillColor: "#4F46E5",
                    color: "#fff",
                    weight: 2,
                    opacity: 1,
                    fillOpacity: 0.8
                }).addTo(map).bindPopup("You are here").openPopup();
            },
            () => {
                console.log("Geolocation permission denied or failed.");
            }
        );
    }

    // Fix for map not rendering correctly directly after display:none
    setTimeout(() => {
        map.invalidateSize();
    }, 100);
}

function addProviderMarkers() {
    // Mock provider locations around default center
    const providers = [
        { name: "Mike's Plumbing", lat: 40.7128, lng: -74.0060 },
        { name: "QuickFix Plumbing", lat: 40.7200, lng: -74.0100 },
        { name: "Pro Plumbing", lat: 40.7050, lng: -74.0000 },
        { name: "Reliable Plumbers", lat: 40.7300, lng: -73.9900 },
        { name: "Expert Drain", lat: 40.7150, lng: -74.0200 },
        { name: "AllDay Plumbing", lat: 40.7250, lng: -73.9800 }
    ];

    providers.forEach(provider => {
        const marker = L.marker([provider.lat, provider.lng]).addTo(map);

        const popupContent = `
            <div style="padding: 5px; text-align: center;">
                <h3 style="margin: 0 0 5px; font-size: 16px; color: #1e293b;">${provider.name}</h3>
                <span style="background: #dcfce7; color: #166534; padding: 2px 6px; border-radius: 4px; font-size: 12px; font-weight: 500;">Verified Provider</span>
            </div>
        `;

        marker.bindPopup(popupContent);
        markers.push(marker);
    });
}

// ===================================
// PAGINATION
// ===================================

function initializePagination() {
    const pageNumbers = document.querySelectorAll('.page-number');
    const prevBtn = document.querySelector('.page-btn:first-child');
    const nextBtn = document.querySelector('.page-btn:last-child');

    pageNumbers.forEach(btn => {
        btn.addEventListener('click', () => {
            const pageNum = btn.textContent;
            goToPage(parseInt(pageNum));

            // Update active state
            pageNumbers.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            const currentPage = getCurrentPage();
            if (currentPage > 1) {
                goToPage(currentPage - 1);
            }
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            const currentPage = getCurrentPage();
            const totalPages = getTotalPages();
            if (currentPage < totalPages) {
                goToPage(currentPage + 1);
            }
        });
    }
}

function getCurrentPage() {
    const activePage = document.querySelector('.page-number.active');
    return parseInt(activePage?.textContent) || 1;
}

function getTotalPages() {
    const pageNumbers = document.querySelectorAll('.page-number');
    const lastPage = pageNumbers[pageNumbers.length - 1];
    return parseInt(lastPage?.textContent) || 1;
}

function goToPage(pageNum) {
    console.log('Going to page:', pageNum);

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // TODO: Load new page data from API
    // This would fetch the next set of providers
}

// ===================================
// PROVIDER CARD INTERACTIONS
// ===================================

async function initializeProviderCards() {
    const grid = document.getElementById('services-grid');
    if (!grid) return;

    // Show loading state
    grid.innerHTML = '<div class="loading-spinner" style="grid-column: 1/-1; text-align: center; padding: 40px;">Loading services...</div>';

    try {
        const response = await fetch(`${CONFIG.API_BASE_URL}/services`);
        if (!response.ok) throw new Error('Failed to fetch services');

        const services = await response.json();

        // Clear grid
        grid.innerHTML = '';

        if (services.length === 0) {
            grid.innerHTML = '<div class="no-results" style="grid-column: 1/-1; text-align: center; padding: 40px;">No services found matching your criteria.</div>';
            updateResultsCount(0);
            return;
        }

        services.forEach(service => {
            const card = createProviderCard(service);
            grid.appendChild(card);
        });

        updateResultsCount(services.length);

        // Initialize map with real data
        if (typeof updateMapMarkers === 'function') {
            updateMapMarkers(services);
        }

    } catch (error) {
        console.error('Error fetching services:', error);
        grid.innerHTML = '<div class="error-message" style="grid-column: 1/-1; text-align: center; color: red; padding: 40px;">Failed to load services. Please try again later.</div>';
    }
}

function createProviderCard(service) {
    const card = document.createElement('div');
    card.className = 'provider-card';

    // Default image if none provided
    const bgImage = service.providerId && service.providerId.userId && service.providerId.userId.profilePicture
        ? service.providerId.userId.profilePicture
        : 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=600&h=400&fit=crop';

    const providerName = service.providerId ? service.providerId.businessName : 'Unknown Provider';
    const rating = service.providerId && service.providerId.rating ? service.providerId.rating.average : 0;
    const reviewCount = service.providerId && service.providerId.rating ? service.providerId.rating.count : 0;
    const hourlyRate = service.pricePerHour || 0;

    card.innerHTML = `
        <div class="provider-image" style="background-image: url('${bgImage}');">
            <div class="verified-badge">✓ Verified</div>
        </div>
        <div class="provider-content">
            <div class="provider-header">
                <h3 class="provider-name">${service.name}</h3>
                <div class="provider-rating">
                    <span class="rating-stars">⭐ ${rating.toFixed(1)}</span>
                    <span class="rating-count">(${reviewCount})</span>
                </div>
            </div>
            <p class="provider-specialty">${providerName}</p>
            <div class="provider-meta">
                <span class="meta-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                        <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                    ${service.providerId?.location?.city || 'Nearby'}
                </span>
                <span class="meta-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                    ${service.estimatedDuration || '1h'}
                </span>
            </div>
            <div class="provider-footer">
                <div class="provider-price">
                    <span class="price-label">Price</span>
                    <span class="price-value">$${hourlyRate}/hr</span>
                </div>
                <button class="view-details-btn" onclick="viewProviderDetails('${service._id}')">View Details</button>
            </div>
        </div>
    `;

    // Add click event
    card.addEventListener('click', () => viewProviderDetails(service._id));

    return card;
}

function viewProviderDetails(serviceId) {
    console.log('Viewing details for:', serviceId);
    window.location.href = `service-detail.html?id=${serviceId}`;
}

// ===================================
// SEARCH FUNCTIONALITY
// ===================================

const searchInput = document.querySelector('.header-search .search-input');
if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        searchProviders(e.target.value);
    });
}

function searchProviders(query) {
    if (query.length < 2) {
        // Show all cards if query is too short
        document.querySelectorAll('.provider-card').forEach(card => {
            card.style.display = '';
        });
        return;
    }

    const cards = document.querySelectorAll('.provider-card');
    let visibleCount = 0;

    cards.forEach(card => {
        const name = card.querySelector('.provider-name')?.textContent.toLowerCase();
        const specialty = card.querySelector('.provider-specialty')?.textContent.toLowerCase();
        const searchQuery = query.toLowerCase();

        if (name.includes(searchQuery) || specialty.includes(searchQuery)) {
            card.style.display = '';
            visibleCount++;
        } else {
            card.style.display = 'none';
        }
    });

    updateResultsCount(visibleCount);
}

// ===================================
// MOBILE FILTER TOGGLE
// ===================================

// For mobile: Add toggle button for filters
if (window.innerWidth <= 768) {
    addMobileFilterToggle();
}

function addMobileFilterToggle() {
    const filtersSidebar = document.querySelector('.filters-sidebar');
    const sortBar = document.querySelector('.sort-bar');

    if (filtersSidebar && sortBar) {
        const toggleBtn = document.createElement('button');
        toggleBtn.className = 'mobile-filter-toggle';
        toggleBtn.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="4" y1="21" x2="4" y2="14"></line>
                <line x1="4" y1="10" x2="4" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12" y2="3"></line>
                <line x1="20" y1="21" x2="20" y2="16"></line>
                <line x1="20" y1="12" x2="20" y2="3"></line>
                <line x1="1" y1="14" x2="7" y2="14"></line>
                <line x1="9" y1="8" x2="15" y2="8"></line>
                <line x1="17" y1="16" x2="23" y2="16"></line>
            </svg>
            Filters
        `;

        sortBar.insertBefore(toggleBtn, sortBar.firstChild);

        toggleBtn.addEventListener('click', () => {
            filtersSidebar.classList.toggle('mobile-open');
        });
    }
}
