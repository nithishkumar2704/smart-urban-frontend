// Admin Dashboard JavaScript
// Handles user management, provider verification, and admin actions

document.addEventListener('DOMContentLoaded', () => {
    initializeTableActions();
    initializeVerificationActions();
    initializeFilters();
    initializeAdminActions();
    animateStats();
});

// ===================================
// TABLE ACTIONS
// ===================================

function initializeTableActions() {
    // View buttons
    const viewBtns = document.querySelectorAll('.table-action-btn[title="View"]');
    viewBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            const row = this.closest('tr');
            const userName = row.querySelector('.user-cell span').textContent;
            const email = row.cells[1].textContent;
            const role = row.querySelector('.role-badge').textContent;

            showUserDetailsModal(userName, email, role);
        });
    });

    // Edit buttons
    const editBtns = document.querySelectorAll('.table-action-btn[title="Edit"]');
    editBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            const row = this.closest('tr');
            const userName = row.querySelector('.user-cell span').textContent;

            showNotification(`Opening editor for ${userName}...`, 'info');
            console.log('Edit user:', userName);
        });
    });

    // Delete buttons
    const deleteBtns = document.querySelectorAll('.table-action-btn.delete');
    deleteBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            const row = this.closest('tr');
            const userName = row.querySelector('.user-cell span').textContent;

            if (confirm(`Are you sure you want to delete ${userName}?`)) {
                // Animate row removal
                row.style.transition = 'all 0.4s ease';
                row.style.opacity = '0';
                row.style.transform = 'translateX(-20px)';

                setTimeout(() => {
                    row.remove();
                    showNotification(`${userName} deleted successfully`, 'success');
                }, 400);
            }
        });
    });
}

function showUserDetailsModal(userName, email, role) {
    const modal = document.createElement('div');
    modal.className = 'user-details-modal-overlay';
    modal.innerHTML = `
        <div class="user-details-modal">
            <div class="modal-header">
                <h3>User Details</h3>
                <button class="modal-close">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
            </div>
            <div class="modal-body">
                <div class="detail-section">
                    <h4>Name</h4>
                    <p>${userName}</p>
                </div>
                <div class="detail-section">
                    <h4>Email</h4>
                    <p>${email}</p>
                </div>
                <div class="detail-section">
                    <h4>Role</h4>
                    <p>${role}</p>
                </div>
                <div class="detail-section">
                    <h4>Total Bookings</h4>
                    <p>24 bookings</p>
                </div>
                <div class="detail-section">
                    <h4>Member Since</h4>
                    <p>January 15, 2026</p>
                </div>
            </div>
            <div class="modal-footer">
                <button class="modal-btn primary">Send Message</button>
                <button class="modal-btn secondary">Close</button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';

    addUserDetailsModalStyles();

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

function addUserDetailsModalStyles() {
    if (document.getElementById('user-details-modal-styles')) return;

    const style = document.createElement('style');
    style.id = 'user-details-modal-styles';
    style.textContent = `
        .user-details-modal-overlay {
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
        
        .user-details-modal {
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
// VERIFICATION ACTIONS
// ===================================

function initializeVerificationActions() {
    // Approve buttons
    const approveBtns = document.querySelectorAll('.verify-btn.approve');
    approveBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            const item = this.closest('.verification-item');
            const providerName = item.querySelector('h4').textContent;

            if (confirm(`Approve ${providerName} as a service provider?`)) {
                // Animate item removal
                item.style.transition = 'all 0.4s ease';
                item.style.opacity = '0';
                item.style.transform = 'translateX(20px)';

                setTimeout(() => {
                    item.remove();
                    showNotification(`${providerName} approved successfully!`, 'success');
                    updatePendingBadge();
                }, 400);
            }
        });
    });

    // Reject buttons
    const rejectBtns = document.querySelectorAll('.verify-btn.reject');
    rejectBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            const item = this.closest('.verification-item');
            const providerName = item.querySelector('h4').textContent;

            if (confirm(`Reject ${providerName}'s application?`)) {
                // Animate item removal
                item.style.transition = 'all 0.4s ease';
                item.style.opacity = '0';
                item.style.transform = 'translateX(-20px)';

                setTimeout(() => {
                    item.remove();
                    showNotification(`${providerName}'s application rejected`, 'info');
                    updatePendingBadge();
                }, 400);
            }
        });
    });
}

function updatePendingBadge() {
    const badge = document.querySelector('.section-badge');
    const verificationList = document.querySelector('.verification-list');
    const count = verificationList.children.length;

    if (badge) {
        badge.textContent = `${count} pending`;

        if (count === 0) {
            verificationList.innerHTML = `
                <div style="text-align: center; padding: 40px; color: #64748b;">
                    <p>No pending verifications</p>
                </div>
            `;
        }
    }
}

// ===================================
// FILTERS
// ===================================

function initializeFilters() {
    const filterSelect = document.querySelector('.filter-select');

    if (filterSelect) {
        filterSelect.addEventListener('change', function () {
            const filterValue = this.value;
            console.log('Filtering by:', filterValue);
            showNotification(`Filtering users: ${filterValue}`, 'info');

            // In a real app, this would filter the table rows
        });
    }

    const periodSelect = document.querySelector('.period-select');

    if (periodSelect) {
        periodSelect.addEventListener('change', function () {
            const period = this.value;
            console.log('Chart period changed to:', period);

            // Animate chart update
            const chart = document.querySelector('.revenue-chart svg');
            if (chart) {
                chart.style.opacity = '0.5';
                setTimeout(() => {
                    chart.style.opacity = '1';
                    showNotification(`Chart updated: ${period}`, 'success');
                }, 500);
            }
        });
    }
}

// ===================================
// ADMIN ACTIONS
// ===================================

function initializeAdminActions() {
    const adminActionBtns = document.querySelectorAll('.admin-action-btn');

    adminActionBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            const actionText = this.textContent.trim();
            console.log('Admin action:', actionText);
            showNotification(`${actionText}...`, 'info');
        });
    });
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
            const match = text.match(/[\d,]+/);
            if (match) {
                const targetValue = parseInt(match[0].replace(/,/g, ''));
                const prefix = text.substring(0, text.indexOf(match[0]));
                const suffix = text.substring(text.indexOf(match[0]) + match[0].length);

                animateValue(stat, 0, targetValue, 1500, prefix, suffix);
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

        // Format number with commas
        const displayValue = Math.floor(current).toLocaleString();

        element.textContent = prefix + displayValue + suffix;

        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            element.textContent = prefix + end.toLocaleString() + suffix;
        }
    }

    requestAnimationFrame(update);
}

// ===================================
// SEARCH FUNCTIONALITY
// ===================================

const searchInput = document.querySelector('.search-input');
if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const tableRows = document.querySelectorAll('.data-table tbody tr');

        tableRows.forEach(row => {
            const userName = row.querySelector('.user-cell span').textContent.toLowerCase();
            const email = row.cells[1].textContent.toLowerCase();

            if (userName.includes(searchTerm) || email.includes(searchTerm)) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    });
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
// AUTO-REFRESH ACTIVITY FEED
// ===================================

// Simulate real-time activity updates
setInterval(() => {
    const activityFeed = document.querySelector('.activity-feed');
    if (activityFeed && activityFeed.children.length > 0) {
        // Update time stamps
        const timeStamps = activityFeed.querySelectorAll('.activity-time');
        // In a real app, this would update based on actual time elapsed
    }
}, 60000); // Every minute
