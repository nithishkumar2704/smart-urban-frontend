// Booking Page JavaScript
// Handles calendar, time slots, and booking confirmation

let selectedDate = null;
let selectedTime = null;
let selectedService = 'pipe-repair';
let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();

const servicePrices = {
    'pipe-repair': { rate: 50, name: 'Pipe Repair & Replacement' },
    'leak-detection': { rate: 60, name: 'Leak Detection & Fixing' },
    'drain-cleaning': { rate: 45, name: 'Drain Cleaning' },
    'water-heater': { rate: 80, name: 'Water Heater Installation' }
};

// Google Maps Autocomplete Removed - Using standard text input for free version
// In a full production app, you could use OpenStreetMap Nominatim or similar free APIs

document.addEventListener('DOMContentLoaded', () => {
    initializeCalendar();
    initializeServiceSelection();
    initializeTimeSlots();
    initializeBookingConfirmation();
});

// ===================================
// CALENDAR FUNCTIONALITY
// ===================================

function initializeCalendar() {
    generateCalendar(currentMonth, currentYear);

    // Navigation buttons
    document.querySelector('.prev-month').addEventListener('click', () => {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        generateCalendar(currentMonth, currentYear);
    });

    document.querySelector('.next-month').addEventListener('click', () => {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        generateCalendar(currentMonth, currentYear);
    });
}

function generateCalendar(month, year) {
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];

    // Update header
    document.getElementById('calendar-month').textContent = `${monthNames[month]} ${year}`;

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = new Date();

    const calendarDays = document.getElementById('calendar-days');
    calendarDays.innerHTML = '';
    calendarDays.style.gridColumn = '1 / -1';
    calendarDays.style.display = 'grid';
    calendarDays.style.gridTemplateColumns = 'repeat(7, 1fr)';
    calendarDays.style.gap = '8px';

    // Add empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
        const emptyDay = document.createElement('div');
        emptyDay.className = 'calendar-day other-month';
        calendarDays.appendChild(emptyDay);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day';
        dayElement.textContent = day;

        const currentDate = new Date(year, month, day);
        const isPast = currentDate < new Date(today.getFullYear(), today.getMonth(), today.getDate());

        // Mark today
        if (currentDate.toDateString() === today.toDateString()) {
            dayElement.classList.add('today');
        }

        // Disable past dates
        if (isPast) {
            dayElement.classList.add('disabled');
        } else {
            dayElement.addEventListener('click', () => selectDate(year, month, day, dayElement));
        }

        calendarDays.appendChild(dayElement);
    }
}

function selectDate(year, month, day, element) {
    // Remove previous selection
    document.querySelectorAll('.calendar-day').forEach(el => el.classList.remove('selected'));

    // Add selection to clicked day
    element.classList.add('selected');

    // Store selected date
    selectedDate = new Date(year, month, day);

    // Update summary
    updateBookingSummary();
}

// ===================================
// SERVICE SELECTION
// ===================================

function initializeServiceSelection() {
    const serviceOptions = document.querySelectorAll('input[name="service"]');

    serviceOptions.forEach(option => {
        option.addEventListener('change', (e) => {
            selectedService = e.target.value;
            updateBookingSummary();
        });
    });
}

// ===================================
// TIME SLOT SELECTION
// ===================================

function initializeTimeSlots() {
    const timeSlots = document.querySelectorAll('.time-slot:not(:disabled)');

    timeSlots.forEach(slot => {
        slot.addEventListener('click', function () {
            // Remove previous selection
            timeSlots.forEach(s => s.classList.remove('selected'));

            // Add selection to clicked slot
            this.classList.add('selected');

            // Store selected time
            selectedTime = this.textContent;

            // Update summary
            updateBookingSummary();
        });
    });
}

// ===================================
// BOOKING SUMMARY UPDATE
// ===================================

function updateBookingSummary() {
    // Update service
    const serviceInfo = servicePrices[selectedService];
    document.getElementById('summary-service').textContent = serviceInfo.name;
    document.getElementById('summary-rate').textContent = `$${serviceInfo.rate}/hr`;

    // Update total
    const minTotal = serviceInfo.rate;
    const maxTotal = serviceInfo.rate * 2;
    document.getElementById('summary-total').textContent = `$${minTotal} - $${maxTotal}`;

    // Update date
    if (selectedDate) {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        document.getElementById('summary-date').textContent = selectedDate.toLocaleDateString('en-US', options);
    }

    // Update time
    if (selectedTime) {
        document.getElementById('summary-time').textContent = selectedTime;
    }

    // Enable/disable confirm button
    const confirmBtn = document.getElementById('confirm-booking');
    if (selectedDate && selectedTime) {
        confirmBtn.disabled = false;
    } else {
        confirmBtn.disabled = true;
    }
}

// ===================================
// BOOKING CONFIRMATION
// ===================================

function initializeBookingConfirmation() {
    const confirmBtn = document.getElementById('confirm-booking');

    confirmBtn.addEventListener('click', () => {
        if (!selectedDate || !selectedTime) {
            alert('Please select both date and time');
            return;
        }

        const address = document.getElementById('address').value;
        const phone = document.getElementById('phone').value;
        const notes = document.getElementById('notes').value;

        if (!address || !phone) {
            alert('Please fill in address and phone number');
            return;
        }

        // Create booking object
        const booking = {
            service: servicePrices[selectedService].name,
            date: selectedDate.toLocaleDateString('en-US'),
            time: selectedTime,
            address: address,
            phone: phone,
            notes: notes,
            provider: "Mike's Plumbing Services",
            rate: servicePrices[selectedService].rate
        };

        console.log('Booking confirmed:', booking);

        // Show confirmation modal
        showConfirmationModal(booking);
    });
}

function showConfirmationModal(booking) {
    const modal = document.createElement('div');
    modal.className = 'confirmation-modal-overlay';
    modal.innerHTML = `
        <div class="confirmation-modal">
            <div class="confirmation-icon">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
            </div>
            <h2>Booking Confirmed!</h2>
            <p class="confirmation-message">Your service has been successfully booked.</p>
            
            <div class="confirmation-details">
                <div class="detail-row">
                    <span class="detail-label">Service:</span>
                    <span class="detail-value">${booking.service}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Date:</span>
                    <span class="detail-value">${booking.date}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Time:</span>
                    <span class="detail-value">${booking.time}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Provider:</span>
                    <span class="detail-value">${booking.provider}</span>
                </div>
            </div>
            
            <p class="confirmation-note">A confirmation email has been sent to your registered email address.</p>
            
            <div class="confirmation-actions">
                <button class="view-bookings-btn">View My Bookings</button>
                <button class="back-home-btn">Back to Home</button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';

    // Add modal styles
    addConfirmationModalStyles();

    // Button actions
    modal.querySelector('.view-bookings-btn').addEventListener('click', () => {
        console.log('Navigating to bookings page...');
        // window.location.href = 'my-bookings.html';
    });

    modal.querySelector('.back-home-btn').addEventListener('click', () => {
        console.log('Navigating to dashboard...');
        window.location.href = 'dashboard.html';
    });
}

function addConfirmationModalStyles() {
    if (document.getElementById('confirmation-modal-styles')) return;

    const style = document.createElement('style');
    style.id = 'confirmation-modal-styles';
    style.textContent = `
        .confirmation-modal-overlay {
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
        
        .confirmation-modal {
            background: white;
            border-radius: 24px;
            padding: 48px;
            max-width: 500px;
            width: 90%;
            text-align: center;
            animation: slideUp 0.4s ease;
        }
        
        @keyframes slideUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .confirmation-icon {
            width: 80px;
            height: 80px;
            background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 24px;
        }
        
        .confirmation-icon svg {
            color: white;
        }
        
        .confirmation-modal h2 {
            font-size: 2rem;
            font-weight: 700;
            color: #0f172a;
            margin-bottom: 12px;
        }
        
        .confirmation-message {
            font-size: 1.1rem;
            color: #64748b;
            margin-bottom: 32px;
        }
        
        .confirmation-details {
            background: #f8fafc;
            border-radius: 16px;
            padding: 24px;
            margin-bottom: 24px;
            text-align: left;
        }
        
        .detail-row {
            display: flex;
            justify-content: space-between;
            padding: 12px 0;
            border-bottom: 1px solid #e2e8f0;
        }
        
        .detail-row:last-child {
            border-bottom: none;
        }
        
        .detail-label {
            font-size: 0.9rem;
            color: #64748b;
            font-weight: 500;
        }
        
        .detail-value {
            font-size: 0.9rem;
            color: #0f172a;
            font-weight: 600;
        }
        
        .confirmation-note {
            font-size: 0.9rem;
            color: #64748b;
            margin-bottom: 32px;
        }
        
        .confirmation-actions {
            display: flex;
            gap: 12px;
        }
        
        .view-bookings-btn,
        .back-home-btn {
            flex: 1;
            padding: 14px 24px;
            border-radius: 12px;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .view-bookings-btn {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border: none;
            color: white;
        }
        
        .view-bookings-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
        }
        
        .back-home-btn {
            background: white;
            border: 2px solid #e2e8f0;
            color: #475569;
        }
        
        .back-home-btn:hover {
            background: #f8fafc;
            border-color: #cbd5e1;
        }
    `;
    document.head.appendChild(style);
}

// ===================================
// FORM VALIDATION
// ===================================

// Real-time validation for phone number
const phoneInput = document.getElementById('phone');
if (phoneInput) {
    phoneInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 0) {
            value = value.match(/(\d{0,3})(\d{0,3})(\d{0,4})/);
            e.target.value = !value[2] ? value[1] : '(' + value[1] + ') ' + value[2] + (value[3] ? '-' + value[3] : '');
        }
    });
}

// Initialize with default service
updateBookingSummary();
