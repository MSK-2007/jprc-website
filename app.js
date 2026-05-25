/**
 * JPRC // JP Nagar Run Club
 * Core Interactions & System Mechanics
 */

document.addEventListener('DOMContentLoaded', () => {
    initScrollReveal();
    initCountdown();
    initFloatingNav();
    initMobileDrawer();
    initCaptureForm();
    initGallery();
});

/**
 * 1. Intersection Observer for Scroll Reveal Animations
 */
function initScrollReveal() {
    const revealElements = document.querySelectorAll('.scroll-reveal');
    
    const observerOptions = {
        root: null, // viewport
        rootMargin: '0px',
        threshold: 0.1 // trigger when 10% of element is visible
    };
    
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                // Optional: stop observing once revealed
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    revealElements.forEach(element => {
        revealObserver.observe(element);
    });
}

/**
 * 2. Next Sunday Deviation Countdown Timer (05:30 AM IST)
 */
function initCountdown() {
    const hoursEl = document.getElementById('timer-hours');
    const minutesEl = document.getElementById('timer-minutes');
    const secondsEl = document.getElementById('timer-seconds');
    
    if (!hoursEl || !minutesEl || !secondsEl) return;

    function getNextSundayTarget() {
        const now = new Date();
        
        // Calculate date of next Sunday
        const nextSunday = new Date(now);
        const dayOfWeek = now.getDay(); // 0 = Sunday, 1 = Monday...
        
        // Calculate days to add to get to next Sunday
        let daysToAdd = 7 - dayOfWeek;
        if (dayOfWeek === 0) {
            // It is Sunday today. Check if 05:30 AM has already passed
            const currentHour = now.getHours();
            const currentMinute = now.getMinutes();
            if (currentHour > 6 || (currentHour === 6 && currentMinute >= 0)) {
                daysToAdd = 7; // Target next Sunday
            } else {
                daysToAdd = 0; // Target today
            }
        }
        
        nextSunday.setDate(now.getDate() + daysToAdd);
        nextSunday.setHours(6, 0, 0, 0); // 06:00:00.000 AM
        
        return nextSunday;
    }

    function updateTimer() {
        const targetTime = getNextSundayTarget();
        const currentTime = new Date();
        const difference = targetTime.getTime() - currentTime.getTime();
        
        if (difference <= 0) {
            // Re-fetch target if we just passed it
            setTimeout(updateTimer, 1000);
            return;
        }
        
        const totalSeconds = Math.floor(difference / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        
        // Format with leading zeroes
        hoursEl.textContent = String(hours).padStart(2, '0');
        minutesEl.textContent = String(minutes).padStart(2, '0');
        secondsEl.textContent = String(seconds).padStart(2, '0');
    }

    // Initial trigger and interval set
    updateTimer();
    setInterval(updateTimer, 1000);
}

/**
 * 3. Scroll-triggered Floating Navigation (Visible after scrolling past hero)
 */
function initFloatingNav() {
    const floatingNav = document.getElementById('floating-nav');
    const heroSection = document.getElementById('about');
    
    if (!floatingNav || !heroSection) return;

    function handleScroll() {
        const heroHeight = heroSection.offsetHeight;
        const scrollPosition = window.scrollY;
        
        // If scrolled past 60% of hero height, reveal floating nav
        if (scrollPosition > (heroHeight * 0.6)) {
            floatingNav.classList.add('visible');
        } else {
            floatingNav.classList.remove('visible');
        }
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Check initial position
    handleScroll();
}

/**
 * 4. Mobile Drawer Toggle
 */
function initMobileDrawer() {
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const closeBtn = document.querySelector('.close-drawer-btn');
    const drawer = document.querySelector('.mobile-drawer');
    const drawerLinks = document.querySelectorAll('.drawer-link');
    const drawerJoinBtn = document.querySelector('.drawer-join-btn');

    if (!menuBtn || !drawer) return;

    function openDrawer() {
        drawer.classList.add('active');
        document.body.style.overflow = 'hidden'; // Lock background scroll
    }

    function closeDrawer() {
        drawer.classList.remove('active');
        document.body.style.overflow = ''; // Unlock background scroll
    }

    menuBtn.addEventListener('click', openDrawer);
    if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
    
    drawerLinks.forEach(link => {
        link.addEventListener('click', closeDrawer);
    });

    if (drawerJoinBtn) {
        drawerJoinBtn.addEventListener('click', closeDrawer);
    }
}

/**
 * 5. Beta Capture Form Optimization & Validation
 */
function initCaptureForm() {
    const form = document.getElementById('beta-form');
    const feedback = document.getElementById('form-feedback');
    
    if (!form || !feedback) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const emailInput = document.getElementById('user-email');
        const email = emailInput ? emailInput.value.trim() : '';
        const submitBtn = form.querySelector('button');
        
        if (!email) return;

        // Visual loading state
        submitBtn.style.pointerEvents = 'none';
        submitBtn.style.opacity = '0.5';
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<span class="mono-label">REGISTERING...</span>';
        
        feedback.style.display = 'block';
        feedback.style.color = 'rgba(255, 255, 255, 0.4)';
        feedback.textContent = '> Saving your spot and a chai... ☕ Almost done!';

        // Simulate secure database transaction
        setTimeout(() => {
            // Mock success
            submitBtn.style.pointerEvents = '';
            submitBtn.style.opacity = '';
            submitBtn.innerHTML = originalBtnText;
            
            feedback.style.color = '#e2e8f0';
            feedback.textContent = `> REGISTERED! [${email.toUpperCase()}] — See you Sunday at 6 AM at Puttenahalli Lake! We'll save you a chai ☕`;
            
            // Clear input
            if (emailInput) emailInput.value = '';
            
            // Hide feedback after a few seconds
            setTimeout(() => {
                feedback.style.fadeOut = 'slow';
                // Reset feedback display
                setTimeout(() => {
                    if (feedback.textContent.includes('See you Sunday')) {
                        feedback.style.display = 'none';
                        feedback.textContent = '';
                    }
                }, 1000);
            }, 6000);

        }, 1500);
    });
}

/**
 * 6. Gallery Lightbox
 */
function initGallery() {
    // Create lightbox DOM
    const lightbox = document.createElement('div');
    lightbox.className = 'gallery-lightbox';
    lightbox.innerHTML = `
        <button class="lightbox-close" id="lightbox-close">CLOSE // ESC</button>
        <img class="lightbox-img" id="lightbox-img" src="" alt="Gallery photo">
    `;
    document.body.appendChild(lightbox);

    const lightboxImg = document.getElementById('lightbox-img');

    // Attach click to each gallery item
    document.querySelectorAll('.gallery-item').forEach(item => {
        item.addEventListener('click', () => {
            const img = item.querySelector('.gallery-img');
            if (!img) return;
            // Use full-size Drive URL instead of thumbnail
            const thumb = img.src;
            const fullUrl = thumb.replace(/&sz=w\d+/, '&sz=w1600');
            lightboxImg.src = fullUrl;
            lightbox.classList.add('open');
            document.body.style.overflow = 'hidden';
        });
    });

    // Close on button
    document.getElementById('lightbox-close').addEventListener('click', closeLightbox);

    // Close on backdrop click
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });

    // Close on Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeLightbox();
    });

    function closeLightbox() {
        lightbox.classList.remove('open');
        document.body.style.overflow = '';
        setTimeout(() => { lightboxImg.src = ''; }, 300);
    }
}

