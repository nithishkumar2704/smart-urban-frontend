// Service Detail Page JavaScript
// Handles gallery, reviews, and booking interactions

document.addEventListener('DOMContentLoaded', () => {
    loadServiceDetails(); // Load details from API
    initializeGallery();
    initializeReviews();
    initializeBooking();
    initializeContactActions();
});

async function loadServiceDetails() {
    // Get service ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const serviceId = urlParams.get('id');

    if (!serviceId) {
        console.log('No service ID provided');
        return;
    }

    try {
        const response = await fetch(`${CONFIG.API_BASE_URL}/services/${serviceId}`);
        if (!response.ok) throw new Error('Failed to fetch service details');

        const service = await response.json();

        // Update Page Title
        document.title = `${service.name} - Smart Urban Service Locator`;

        // Update Hero Section
        const heroTitle = document.querySelector('.hero-text h1');
        const heroSubtitle = document.querySelector('.hero-text p');
        if (heroTitle) heroTitle.textContent = service.name;
        if (heroSubtitle) heroSubtitle.textContent = service.category;

        // Update Overview
        const descriptionP = document.querySelector('.overview-card p');
        if (descriptionP) descriptionP.textContent = service.description;

        // Update Price
        const priceValue = document.querySelector('.price-value');
        if (priceValue) priceValue.textContent = `$${service.pricePerHour}/hr`;

        // Update Provider Info
        if (service.providerId) {
            const providerName = document.querySelector('.provider-info h3');
            if (providerName) providerName.textContent = service.providerId.businessName;

            const providerRating = document.querySelector('.provider-rating span');
            if (providerRating && service.providerId.rating) {
                providerRating.textContent = `⭐ ${service.providerId.rating.average.toFixed(1)} (${service.providerId.rating.count} reviews)`;
            }
        }

    } catch (error) {
        console.error('Error loading service details:', error);
    }
}

// ===================================
// PHOTO GALLERY
// ===================================

function initializeGallery() {
    const mainPhoto = document.querySelector('.main-photo');
    const thumbnails = document.querySelectorAll('.thumbnail:not(.more-photos)');
    const expandBtn = document.querySelector('.gallery-expand');

    // Thumbnail click to change main photo
    thumbnails.forEach(thumbnail => {
        thumbnail.addEventListener('click', () => {
            const bgImage = thumbnail.style.backgroundImage;
            if (mainPhoto && bgImage) {
                mainPhoto.style.backgroundImage = bgImage;
            }
        });
    });

    // Expand gallery (lightbox)
    if (expandBtn) {
        expandBtn.addEventListener('click', () => {
            openLightbox();
        });
    }

    // Main photo click to expand
    if (mainPhoto) {
        mainPhoto.addEventListener('click', () => {
            openLightbox();
        });
    }
}

function openLightbox() {
    // Create lightbox overlay
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox-overlay';
    lightbox.innerHTML = `
        <div class="lightbox-content">
            <button class="lightbox-close">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            </button>
            <div class="lightbox-image" style="background-image: ${document.querySelector('.main-photo').style.backgroundImage}"></div>
            <button class="lightbox-prev">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
            </button>
            <button class="lightbox-next">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
            </button>
        </div>
    `;

    document.body.appendChild(lightbox);
    document.body.style.overflow = 'hidden';

    // Add lightbox styles dynamically
    addLightboxStyles();

    // Close lightbox
    const closeBtn = lightbox.querySelector('.lightbox-close');
    closeBtn.addEventListener('click', closeLightbox);

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // Keyboard navigation
    document.addEventListener('keydown', handleLightboxKeyboard);
}

function closeLightbox() {
    const lightbox = document.querySelector('.lightbox-overlay');
    if (lightbox) {
        lightbox.remove();
        document.body.style.overflow = '';
        document.removeEventListener('keydown', handleLightboxKeyboard);
    }
}

function handleLightboxKeyboard(e) {
    if (e.key === 'Escape') {
        closeLightbox();
    }
}

function addLightboxStyles() {
    if (document.getElementById('lightbox-styles')) return;

    const style = document.createElement('style');
    style.id = 'lightbox-styles';
    style.textContent = `
        .lightbox-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.95);
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
            animation: fadeIn 0.3s ease;
        }

        .lightbox-content {
            position: relative;
            width: 90%;
            max-width: 1200px;
            height: 80vh;
        }

        .lightbox-image {
            width: 100%;
            height: 100%;
            background-size: contain;
            background-position: center;
            background-repeat: no-repeat;
        }

        .lightbox-close {
            position: absolute;
            top: -60px;
            right: 0;
            background: rgba(255, 255, 255, 0.1);
            border: none;
            color: white;
            width: 48px;
            height: 48px;
            border-radius: 50%;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
        }

        .lightbox-close:hover {
            background: rgba(255, 255, 255, 0.2);
        }

        .lightbox-prev,
        .lightbox-next {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            background: rgba(255, 255, 255, 0.1);
            border: none;
            color: white;
            width: 48px;
            height: 48px;
            border-radius: 50%;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
        }

        .lightbox-prev {
            left: 20px;
        }

        .lightbox-next {
            right: 20px;
        }

        .lightbox-prev:hover,
        .lightbox-next:hover {
            background: rgba(255, 255, 255, 0.2);
        }
    `;
    document.head.appendChild(style);
}

// ===================================
// REVIEWS
// ===================================

function initializeReviews() {
    const writeReviewBtn = document.querySelector('.write-review-btn');
    const helpfulBtns = document.querySelectorAll('.helpful-btn');
    const loadMoreBtn = document.querySelector('.load-more-btn');

    // Write review
    if (writeReviewBtn) {
        writeReviewBtn.addEventListener('click', () => {
            openReviewModal();
        });
    }

    // Helpful buttons
    helpfulBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            const currentCount = parseInt(this.textContent.match(/\d+/)[0]);
            this.innerHTML = `
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2">
                    <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
                </svg>
                Helpful (${currentCount + 1})
            `;
            this.style.color = '#667eea';
            this.style.borderColor = '#667eea';
            this.disabled = true;
        });
    });

    // Load more reviews
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', () => {
            console.log('Loading more reviews...');
            // TODO: Load more reviews from API
            loadMoreBtn.textContent = 'Loading...';
            setTimeout(() => {
                loadMoreBtn.textContent = 'Load More Reviews';
            }, 1000);
        });
    }
}

function openReviewModal() {
    // Create review modal
    const modal = document.createElement('div');
    modal.className = 'review-modal-overlay';
    modal.innerHTML = `
        <div class="review-modal">
            <div class="modal-header">
                <h3>Write a Review</h3>
                <button class="modal-close">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
            </div>
            <div class="modal-body">
                <div class="rating-input">
                    <label>Your Rating</label>
                    <div class="star-rating">
                        <span class="star" data-rating="1">☆</span>
                        <span class="star" data-rating="2">☆</span>
                        <span class="star" data-rating="3">☆</span>
                        <span class="star" data-rating="4">☆</span>
                        <span class="star" data-rating="5">☆</span>
                    </div>
                </div>
                <div class="review-input">
                    <label>Your Review</label>
                    <textarea placeholder="Share your experience..." rows="5"></textarea>
                </div>
            </div>
            <div class="modal-footer">
                <button class="cancel-btn">Cancel</button>
                <button class="submit-btn">Submit Review</button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';

    // Add modal styles
    addReviewModalStyles();

    // Star rating interaction
    const stars = modal.querySelectorAll('.star');
    let selectedRating = 0;

    stars.forEach(star => {
        star.addEventListener('click', function () {
            selectedRating = parseInt(this.dataset.rating);
            updateStarDisplay(stars, selectedRating);
        });

        star.addEventListener('mouseenter', function () {
            const rating = parseInt(this.dataset.rating);
            updateStarDisplay(stars, rating);
        });
    });

    modal.querySelector('.star-rating').addEventListener('mouseleave', () => {
        updateStarDisplay(stars, selectedRating);
    });

    // Close modal
    const closeBtn = modal.querySelector('.modal-close');
    const cancelBtn = modal.querySelector('.cancel-btn');

    closeBtn.addEventListener('click', () => closeReviewModal(modal));
    cancelBtn.addEventListener('click', () => closeReviewModal(modal));

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeReviewModal(modal);
        }
    });

    // Submit review
    const submitBtn = modal.querySelector('.submit-btn');
    submitBtn.addEventListener('click', () => {
        const reviewText = modal.querySelector('textarea').value;
        if (selectedRating === 0) {
            alert('Please select a rating');
            return;
        }
        if (!reviewText.trim()) {
            alert('Please write a review');
            return;
        }
        console.log('Submitting review:', { rating: selectedRating, text: reviewText });
        // TODO: Submit review to API
        closeReviewModal(modal);
    });
}

function updateStarDisplay(stars, rating) {
    stars.forEach((star, index) => {
        if (index < rating) {
            star.textContent = '★';
            star.style.color = '#f59e0b';
        } else {
            star.textContent = '☆';
            star.style.color = '#cbd5e1';
        }
    });
}

function closeReviewModal(modal) {
    modal.remove();
    document.body.style.overflow = '';
}

function addReviewModalStyles() {
    if (document.getElementById('review-modal-styles')) return;

    const style = document.createElement('style');
    style.id = 'review-modal-styles';
    style.textContent = `
        .review-modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
            animation: fadeIn 0.3s ease;
        }

        .review-modal {
            background: white;
            border-radius: 20px;
            width: 90%;
            max-width: 600px;
            max-height: 90vh;
            overflow: auto;
        }

        .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 24px;
            border-bottom: 2px solid #f1f5f9;
        }

        .modal-header h3 {
            font-size: 1.5rem;
            font-weight: 700;
            color: #0f172a;
        }

        .modal-close {
            background: none;
            border: none;
            color: #94a3b8;
            cursor: pointer;
            padding: 4px;
            transition: color 0.3s ease;
        }

        .modal-close:hover {
            color: #475569;
        }

        .modal-body {
            padding: 24px;
        }

        .rating-input,
        .review-input {
            margin-bottom: 24px;
        }

        .rating-input label,
        .review-input label {
            display: block;
            font-size: 0.95rem;
            font-weight: 600;
            color: #0f172a;
            margin-bottom: 12px;
        }

        .star-rating {
            display: flex;
            gap: 8px;
        }

        .star {
            font-size: 2rem;
            cursor: pointer;
            transition: all 0.2s ease;
            color: #cbd5e1;
        }

        .star:hover {
            transform: scale(1.2);
        }

        .review-input textarea {
            width: 100%;
            padding: 12px;
            border: 2px solid #e2e8f0;
            border-radius: 12px;
            font-family: 'Inter', sans-serif;
            font-size: 0.95rem;
            resize: vertical;
            transition: border-color 0.3s ease;
        }

        .review-input textarea:focus {
            outline: none;
            border-color: #667eea;
        }

        .modal-footer {
            display: flex;
            justify-content: flex-end;
            gap: 12px;
            padding: 24px;
            border-top: 2px solid #f1f5f9;
        }

        .cancel-btn,
        .submit-btn {
            padding: 12px 24px;
            border-radius: 10px;
            font-size: 0.95rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .cancel-btn {
            background: white;
            border: 2px solid #e2e8f0;
            color: #475569;
        }

        .cancel-btn:hover {
            background: #f8fafc;
        }

        .submit-btn {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border: none;
            color: white;
        }

        .submit-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
        }
    `;
    document.head.appendChild(style);
}

// ===================================
// BOOKING
// ===================================

function initializeBooking() {
    const bookNowBtns = document.querySelectorAll('.book-now-btn, .primary-btn');

    bookNowBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // TODO: Navigate to booking page
            console.log('Opening booking page...');
            // window.location.href = 'booking.html?provider=mikes-plumbing';
        });
    });
}

// ===================================
// CONTACT ACTIONS
// ===================================

function initializeContactActions() {
    const callBtn = document.querySelector('.secondary-btn:nth-child(2)');
    const messageBtn = document.querySelector('.secondary-btn:nth-child(3)');

    if (callBtn) {
        callBtn.addEventListener('click', () => {
            const phone = document.querySelector('.contact-value')?.textContent;
            console.log('Calling:', phone);
            // window.location.href = `tel:${phone}`;
        });
    }

    if (messageBtn) {
        messageBtn.addEventListener('click', () => {
            console.log('Opening message dialog...');
            // TODO: Open messaging interface
        });
    }
}

// ===================================
// SMOOTH SCROLL TO SECTIONS
// ===================================

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
