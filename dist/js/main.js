// Main JavaScript - Handles intro sequence and interactions

// Animation sequence timing (in milliseconds) - Professional fast timing
const TIMING = {
    GLOBE_ROTATION: 2000,      // Globe rotates for 2 seconds
    TEXT_APPEAR: 2000,         // Text appears at 2 seconds
    TEXT_VISIBLE: 1500,        // Text stays for 1.5 seconds
    GLOBE_FADE: 3500,          // Globe fades at 3.5 seconds
    TEXT_FADE: 4000,           // Text fades at 4 seconds
    LOGIN_APPEAR: 4500         // Login selection appears at 4.5 seconds
};

// Check if user has seen intro before
// Temporarily disabled for testing - uncomment to enable skip for returning users
// const hasSeenIntro = localStorage.getItem('hasSeenIntro');
const hasSeenIntro = null; // Force intro to always play

function startIntroSequence() {
    const globeContainer = document.getElementById('globe-container');
    const introText = document.getElementById('intro-text');
    const loginSelection = document.getElementById('login-selection');
    const introSection = document.getElementById('intro-section');

    // Step 1: Show text after globe rotation
    setTimeout(() => {
        introText.classList.remove('hidden');
        introText.classList.add('show');
    }, TIMING.TEXT_APPEAR);

    // Step 2: Fade out globe with zoom effect
    setTimeout(() => {
        globeContainer.classList.add('fade-out');
        // Add zoom animation to camera if globe is still active
        if (typeof camera !== 'undefined' && camera) {
            animateGlobeZoom();
        }
    }, TIMING.GLOBE_FADE);

    // Step 3: Fade out text
    setTimeout(() => {
        introText.classList.add('fade-out');
    }, TIMING.TEXT_FADE);

    // Step 4: Show login selection
    setTimeout(() => {
        introSection.style.display = 'none';
        loginSelection.classList.remove('hidden');
        loginSelection.classList.add('show');

        // Save that user has seen intro (disabled for testing)
        // localStorage.setItem('hasSeenIntro', 'true');

        // Stop globe animation to save resources
        if (typeof stopGlobe === 'function') {
            stopGlobe();
        }
    }, TIMING.LOGIN_APPEAR);
}

function skipToLogin() {
    const introSection = document.getElementById('intro-section');
    const loginSelection = document.getElementById('login-selection');

    introSection.style.display = 'none';
    loginSelection.classList.remove('hidden');
    loginSelection.classList.add('show');

    if (typeof stopGlobe === 'function') {
        stopGlobe();
    }
}

// Add 3D tilt effect to cards on mouse move
function add3DTiltEffect() {
    const cards = document.querySelectorAll('.login-card');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;

            card.style.transform = `translateY(-12px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Check if URL has #login-selection hash (user clicked back button)
    const urlHash = window.location.hash;

    if (urlHash === '#login-selection') {
        // Skip intro and go directly to login selection
        skipToLogin();
    } else if (hasSeenIntro === 'true') {
        // Skip intro for returning users
        skipToLogin();
    } else {
        // Start intro sequence for new users
        startIntroSequence();
    }

    // Add 3D tilt effects to cards
    setTimeout(() => {
        add3DTiltEffect();
    }, TIMING.LOGIN_APPEAR + 100);

    // Optional: Add skip button (uncomment if needed)
    // addSkipButton();
});

// Optional: Add skip intro button
function addSkipButton() {
    const introSection = document.getElementById('intro-section');

    const skipButton = document.createElement('button');
    skipButton.textContent = 'Skip Intro';
    skipButton.style.cssText = `
        position: absolute;
        bottom: 30px;
        right: 30px;
        padding: 12px 24px;
        background: rgba(255, 255, 255, 0.2);
        border: 2px solid rgba(255, 255, 255, 0.5);
        border-radius: 8px;
        color: white;
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
        z-index: 10;
        backdrop-filter: blur(10px);
        transition: all 0.3s ease;
    `;

    skipButton.addEventListener('mouseenter', () => {
        skipButton.style.background = 'rgba(255, 255, 255, 0.3)';
        skipButton.style.transform = 'scale(1.05)';
    });

    skipButton.addEventListener('mouseleave', () => {
        skipButton.style.background = 'rgba(255, 255, 255, 0.2)';
        skipButton.style.transform = 'scale(1)';
    });

    skipButton.addEventListener('click', skipToLogin);

    introSection.appendChild(skipButton);
}

// Animate globe zoom effect
function animateGlobeZoom() {
    if (typeof camera === 'undefined' || !camera) return;

    const startZ = camera.position.z;
    const endZ = 0.5; // Zoom closer to Earth
    const duration = 800; // Match fade-out duration
    const startTime = Date.now();

    function zoom() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Easing function for smooth zoom
        const easeProgress = 1 - Math.pow(1 - progress, 3);

        camera.position.z = startZ + (endZ - startZ) * easeProgress;

        if (progress < 1) {
            requestAnimationFrame(zoom);
        }
    }

    zoom();
}

// Smooth scroll for any internal links
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
