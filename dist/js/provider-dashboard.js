// Service Provider Dashboard JavaScript
// Handles booking management, stats updates, and dashboard interactions

document.addEventListener('DOMContentLoaded', () => {
    initializeBookingActions();
    initializeQuickActions();
    initializeChartPeriodSelector();
    animateStats();
});

// ===================================
// BOOKING MANAGEMENT
// ===================================

function initializeBookingActions() {
    // Accept buttons
    const acceptBtns = document.querySelectorAll('.accept-btn');
    acceptBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            const bookingCard = this.closest('.booking-card');
            const customerName = bookingCard.querySelector('.customer-name').textContent;

            if (confirm(`Accept booking from ${customerName}?`)) {
                // Update status
                const statusBadge = bookingCard.querySelector('.booking-status');
                statusBadge.textContent = 'Confirmed';
                statusBadge.classList.remove('pending');
                statusBadge.classList.add('confirmed');

                // Hide action buttons
                const actionsDiv = bookingCard.querySelector('.booking-actions');
                actionsDiv.innerHTML = '<span style="color: #10b981; font-weight: 600;">✓ Booking Confirmed</span>';

                // Show success notification
                showNotification('Booking accepted successfully!', 'success');

                // Update stats
                updateBookingStats(1);

                console.log('Booking accepted:', customerName);
            }
        });
    });

    // Decline buttons
    const declineBtns = document.querySelectorAll('.decline-btn');
    declineBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            const bookingCard = this.closest('.booking-card');
            const customerName = bookingCard.querySelector('.customer-name').textContent;

            if (confirm(`Decline booking from ${customerName}?`)) {
                // Animate card removal
                bookingCard.style.transition = 'all 0.4s ease';
                bookingCard.style.opacity = '0';
                bookingCard.style.transform = 'translateX(-20px)';

                setTimeout(() => {
                    bookingCard.remove();

                    // Check if list is empty
                    const bookingsList = document.querySelector('.bookings-list');
                    if (bookingsList.children.length === 0) {
                        bookingsList.innerHTML = `
                            <div style="text-align: center; padding: 40px; color: #64748b;">
                                <p>No pending bookings</p>
                            </div>
                        `;
                    }
                }, 400);

                showNotification('Booking declined', 'info');
                console.log('Booking declined:', customerName);
            }
        });
    });

    // Details buttons
    const detailsBtns = document.querySelectorAll('.details-btn');
    detailsBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            const bookingCard = this.closest('.booking-card');
            const customerName = bookingCard.querySelector('.customer-name').textContent;
            const service = bookingCard.querySelector('.booking-service').textContent;

            showBookingDetailsModal(customerName, service);
        });
    });
}

function showBookingDetailsModal(customerName, service) {
    const modal = document.createElement('div');
    modal.className = 'booking-details-modal-overlay';
    modal.innerHTML = `
        <div class="booking-details-modal">
            <div class="modal-header">
                <h3>Booking Details</h3>
                <button class="modal-close">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
            </div>
            <div class="modal-body">
                <div class="detail-section">
                    <h4>Customer</h4>
                    <p>${customerName}</p>
                </div>
                <div class="detail-section">
                    <h4>Service</h4>
                    <p>${service}</p>
                </div>
                <div class="detail-section">
                    <h4>Contact</h4>
                    <p>Phone: (555) 123-4567</p>
                    <p>Email: customer@example.com</p>
                </div>
                <div class="detail-section">
                    <h4>Notes</h4>
                    <p>Kitchen sink is leaking. Need urgent repair.</p>
                </div>
            </div>
            <div class="modal-footer">
                <button class="modal-btn primary">Contact Customer</button>
                <button class="modal-btn secondary">Close</button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';

    addBookingDetailsModalStyles();

    // Close handlers
    const closeBtn = modal.querySelector('.modal-close');
    const secondaryBtn = modal.querySelector('.secondary');

    closeBtn.addEventListener('click', () => closeModal(modal));
    secondaryBtn.addEventListener('click', () => closeModal(modal));

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal(modal);
        }
    });
}

function closeModal(modal) {
    modal.remove();
    document.body.style.overflow = '';
}

function addBookingDetailsModalStyles() {
    if (document.getElementById('booking-details-modal-styles')) return;

    const style = document.createElement('style');
    style.id = 'booking-details-modal-styles';
    style.textContent = `
        .booking-details-modal-overlay {
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
        
        .booking-details-modal {
            background: white;
            border-radius: 20px;
            width: 90%;
            max-width: 500px;
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
        }
        
        .modal-body {
            padding: 24px;
        }
        
        .detail-section {
            margin-bottom: 20px;
        }
        
        .detail-section h4 {
            font-size: 0.9rem;
            font-weight: 600;
            color: #64748b;
            margin-bottom: 8px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        .detail-section p {
            font-size: 1rem;
            color: #0f172a;
            margin-bottom: 4px;
        }
        
        .modal-footer {
            display: flex;
            gap: 12px;
            padding: 24px;
            border-top: 2px solid #f1f5f9;
        }
        
        .modal-btn {
            flex: 1;
            padding: 12px 24px;
            border-radius: 10px;
            font-size: 0.95rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .modal-btn.primary {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border: none;
            color: white;
        }
        
        .modal-btn.secondary {
            background: white;
            border: 2px solid #e2e8f0;
            color: #475569;
        }
    `;
    document.head.appendChild(style);
}

// ===================================
// QUICK ACTIONS
// ===================================

function initializeQuickActions() {
    const quickActionBtns = document.querySelectorAll('.quick-action-btn');

    quickActionBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            const actionText = this.textContent.trim();
            console.log('Quick action clicked:', actionText);
            showNotification(`Opening ${actionText}...`, 'info');
        });
    });

    // Profile edit button
    const profileEditBtn = document.querySelector('.profile-edit-btn');
    if (profileEditBtn) {
        profileEditBtn.addEventListener('click', () => {
            console.log('Opening profile editor...');
            showNotification('Opening profile editor...', 'info');
        });
    }

    // Add availability button
    const addAvailabilityBtn = document.querySelector('.add-availability-btn');
    if (addAvailabilityBtn) {
        addAvailabilityBtn.addEventListener('click', () => {
            console.log('Adding availability...');
            showNotification('Opening availability manager...', 'info');
        });
    }
}

// ===================================
// CHART PERIOD SELECTOR
// ===================================

function initializeChartPeriodSelector() {
    const periodSelect = document.querySelector('.period-select');

    if (periodSelect) {
        periodSelect.addEventListener('change', function () {
            const period = this.value;
            console.log('Chart period changed to:', period);

            // Animate chart update
            const chartPlaceholder = document.querySelector('.chart-placeholder');
            chartPlaceholder.style.opacity = '0.5';

            setTimeout(() => {
                chartPlaceholder.style.opacity = '1';
                showNotification(`Chart updated to ${period}`, 'success');
            }, 500);
        });
    }
}

// ===================================
// STATS ANIMATION
// ===================================

function animateStats() {
    const statValues = document.querySelectorAll('.stat-value');

    statValues.forEach(stat => {
        const text = stat.textContent;
        const hasNumber = /\d/.test(text);

        if (hasNumber) {
            // Extract number
            const match = text.match(/[\d.]+/);
            if (match) {
                const targetValue = parseFloat(match[0]);
                const prefix = text.substring(0, text.indexOf(match[0]));
                const suffix = text.substring(text.indexOf(match[0]) + match[0].length);

                animateValue(stat, 0, targetValue, 1000, prefix, suffix);
            }
        }
    });
}

function animateValue(element, start, end, duration, prefix = '', suffix = '') {
    const startTime = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Easing function
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const current = start + (end - start) * easeOutQuart;

        // Format number
        let displayValue;
        if (end % 1 === 0) {
            displayValue = Math.floor(current);
        } else {
            displayValue = current.toFixed(1);
        }

        element.textContent = prefix + displayValue + suffix;

        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            element.textContent = prefix + end + suffix;
        }
    }

    requestAnimationFrame(update);
}

function updateBookingStats(change) {
    const bookingStatValue = document.querySelector('.stat-card .stat-value');
    if (bookingStatValue) {
        const currentValue = parseInt(bookingStatValue.textContent);
        bookingStatValue.textContent = currentValue + change;
    }
}

// ===================================
// NOTIFICATIONS
// ===================================

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;

    document.body.appendChild(notification);

    addNotificationStyles();

    // Trigger animation
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);

    // Remove after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

function addNotificationStyles() {
    if (document.getElementById('notification-styles')) return;

    const style = document.createElement('style');
    style.id = 'notification-styles';
    style.textContent = `
        .notification {
            position: fixed;
            top: 100px;
            right: 24px;
            padding: 16px 24px;
            background: white;
            border-radius: 12px;
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
            font-size: 0.95rem;
            font-weight: 600;
            z-index: 10001;
            transform: translateX(400px);
            transition: transform 0.3s ease;
        }
        
        .notification.show {
            transform: translateX(0);
        }
        
        .notification-success {
            border-left: 4px solid #10b981;
            color: #10b981;
        }
        
        .notification-info {
            border-left: 4px solid #3b82f6;
            color: #3b82f6;
        }
        
        .notification-warning {
            border-left: 4px solid #f59e0b;
            color: #f59e0b;
        }
        
        .notification-error {
            border-left: 4px solid #ef4444;
            color: #ef4444;
        }
    `;
    document.head.appendChild(style);
}

// ===================================
// SEARCH FUNCTIONALITY
// ===================================

const searchInput = document.querySelector('.search-input');
if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const bookingCards = document.querySelectorAll('.booking-card');

        bookingCards.forEach(card => {
            const customerName = card.querySelector('.customer-name').textContent.toLowerCase();
            const service = card.querySelector('.booking-service').textContent.toLowerCase();

            if (customerName.includes(searchTerm) || service.includes(searchTerm)) {
                card.style.display = '';
            } else {
                card.style.display = 'none';
            }
        });
    });
}
