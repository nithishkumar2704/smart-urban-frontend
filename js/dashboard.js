// Dashboard JavaScript - Handles interactions and dynamic features

// Initialize dashboard
document.addEventListener('DOMContentLoaded', () => {
    initializeCategoryCards();
    initializeServiceCards();
    initializeLocationDetection();
    initializeSearch();
});

// Category card interactions
function initializeCategoryCards() {
    const categoryCards = document.querySelectorAll('.category-card');

    categoryCards.forEach(card => {
        card.addEventListener('click', () => {
            const category = card.dataset.category;
            navigateToCategory(category);
        });
    });
}

// Service card interactions
function initializeServiceCards() {
    const serviceCards = document.querySelectorAll('.service-card');

    serviceCards.forEach(card => {
        card.addEventListener('click', () => {
            // Navigate to service detail page
            console.log('Service clicked');
            // TODO: Implement service detail navigation
        });
    });
}

// Location detection
function initializeLocationDetection() {
    const detectBtn = document.querySelector('.detect-location-btn');
    const locationInput = document.querySelector('.location-input');

    if (detectBtn) {
        detectBtn.addEventListener('click', () => {
            detectLocation(locationInput);
        });
    }
}

function detectLocation(input) {
    if ('geolocation' in navigator) {
        // Show loading state
        input.value = 'Detecting location...';
        input.disabled = true;

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;

                // Use reverse geocoding to get address (would need API)
                // For now, just show coordinates
                input.value = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
                input.disabled = false;

                // TODO: Implement reverse geocoding with Google Maps API
                console.log('Location detected:', latitude, longitude);
            },
            (error) => {
                input.value = '';
                input.disabled = false;
                alert('Unable to detect location. Please enter manually.');
                console.error('Geolocation error:', error);
            }
        );
    } else {
        alert('Geolocation is not supported by your browser');
    }
}

// Search functionality
function initializeSearch() {
    const searchInput = document.querySelector('.search-input');
    const headerSearchInput = document.querySelector('.header-search .search-input');

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            handleSearch(e.target.value);
        });
    }

    if (headerSearchInput) {
        headerSearchInput.addEventListener('input', (e) => {
            handleSearch(e.target.value);
        });
    }
}

function handleSearch(query) {
    if (query.length < 2) return;

    // TODO: Implement search functionality
    console.log('Searching for:', query);

    // Filter categories and services based on query
    filterCategories(query);
}

function filterCategories(query) {
    const categoryCards = document.querySelectorAll('.category-card');
    const lowerQuery = query.toLowerCase();

    categoryCards.forEach(card => {
        const categoryName = card.querySelector('.category-name').textContent.toLowerCase();

        if (categoryName.includes(lowerQuery)) {
            card.style.display = '';
        } else {
            card.style.display = 'none';
        }
    });
}

// Navigate to category page
function navigateToCategory(category) {
    // TODO: Implement navigation to category listing page
    console.log('Navigating to category:', category);
    // window.location.href = `services.html?category=${category}`;
}

// User profile dropdown (for future implementation)
function initializeUserMenu() {
    const userProfile = document.querySelector('.user-profile');

    if (userProfile) {
        userProfile.addEventListener('click', () => {
            // TODO: Show dropdown menu
            console.log('User menu clicked');
        });
    }
}

// Notification handling (for future implementation)
function initializeNotifications() {
    const notificationBtn = document.querySelector('.notification-btn');

    if (notificationBtn) {
        notificationBtn.addEventListener('click', () => {
            // TODO: Show notifications panel
            console.log('Notifications clicked');
        });
    }
}

// Add smooth scroll behavior
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});
