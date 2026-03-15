// Load navbar on all pages
fetch("navbar.html")
.then(response => response.text())
.then(data => {
    const navbarContainer = document.getElementById("navbar");
    if (navbarContainer) {
        navbarContainer.innerHTML = data;
    }
});
/**
 * KEPKOF Electronics - Main JavaScript
 * Optimized for performance, accessibility, and mobile responsiveness
 */

// Configuration
const CONFIG = {
    animationDuration: 300,
    toastDuration: 3000,
    countdownHours: 24,
    stats: {
        happyCustomers: 5000,
        productsSold: 15000,
        yearsExperience: 5
    }
};

// State management
const state = {
    cart: [],
    isMenuOpen: false,
    countdownInterval: null
};

// Utility functions
const utils = {
    /**
     * Debounce function for performance
     */
    debounce: (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    /**
     * Throttle function for scroll events
     */
    throttle: (func, limit) => {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    /**
     * Format number with commas
     */
    formatNumber: (num) => num.toLocaleString(),

    /**
     * Check if element is in viewport
     */
    isInViewport: (element, threshold = 0.5) => {
        const rect = element.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) * threshold &&
            rect.bottom >= 0
        );
    }
};

// DOM Elements cache
const elements = {};

/**
 * Initialize application
 */
document.addEventListener('DOMContentLoaded', () => {
    cacheElements();
    initMobileMenu();
    initSmoothScroll();
    initActiveNav();
    initCart();
    initCountdown();
    initStatsCounter();
    initNewsletterForm();
    initModal();
    initAccessibility();
    initHeroSlider();
    
    // Global event listeners
    window.addEventListener('resize', utils.debounce(handleResize, 250));
    window.addEventListener('scroll', utils.throttle(handleScroll, 100));
    document.addEventListener('keydown', handleKeydown);
});

/**
 * Cache DOM elements for performance
 */
function cacheElements() {
    const ids = [
        'mobileMenu', 'mobileNav', 'navLinks', 'cartBtn', 'cartCount',
        'cartModal', 'cartItems', 'closeModal', 'checkoutBtn', 'toast',
        'toastMessage', 'countdown', 'hours', 'minutes', 'seconds',
        'newsletterForm', 'emailInput', 'formMessage', 'about',
        'happyCustomers', 'productsSold', 'yearsExperience',
        'saleBtn', 'newsletterBtn'
    ];
    
    ids.forEach(id => {
        elements[id] = document.getElementById(id);
    });
    
    elements.mobileLinks = document.querySelectorAll('.mobile-link');
    elements.navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    elements.sections = document.querySelectorAll('section[id]');
}

/**
 * Mobile Menu Toggle with accessibility
 */
function initMobileMenu() {
    if (!elements.mobileMenu || !elements.mobileNav) return;
    
    elements.mobileMenu.addEventListener('click', toggleMobileMenu);
    
    // Close menu when clicking links
    elements.mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            closeMobileMenu();
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (state.isMenuOpen && 
            !elements.mobileNav.contains(e.target) && 
            !elements.mobileMenu.contains(e.target)) {
            closeMobileMenu();
        }
    });
}

function toggleMobileMenu() {
    state.isMenuOpen = !state.isMenuOpen;
    elements.mobileNav.classList.toggle('active', state.isMenuOpen);
    elements.mobileMenu.setAttribute('aria-expanded', state.isMenuOpen);
    elements.mobileNav.setAttribute('aria-hidden', !state.isMenuOpen);
    
    const icon = elements.mobileMenu.querySelector('i');
    if (icon) {
        icon.className = state.isMenuOpen ? 'fas fa-times' : 'fas fa-bars';
    }
    
    // Prevent body scroll when menu is open
    document.body.style.overflow = state.isMenuOpen ? 'hidden' : '';
}

function closeMobileMenu() {
    if (!state.isMenuOpen) return;
    state.isMenuOpen = false;
    elements.mobileNav.classList.remove('active');
    elements.mobileMenu.setAttribute('aria-expanded', 'false');
    elements.mobileNav.setAttribute('aria-hidden', 'true');
    
    const icon = elements.mobileMenu.querySelector('i');
    if (icon) icon.className = 'fas fa-bars';
    
    document.body.style.overflow = '';
}

/**
 * Smooth scroll for navigation links
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href === '#') return;
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const offsetTop = target.offsetTop - 70; // Account for sticky header
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                // Update URL without jumping
                history.pushState(null, '', href);
            }
        });
    });
}

/**
 * Active navigation highlighting
 */
function initActiveNav() {
    if (!elements.sections.length) return;
    
    const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -80% 0px',
        threshold: 0
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                updateActiveNav(id);
            }
        });
    }, observerOptions);
    
    elements.sections.forEach(section => observer.observe(section));
}

function updateActiveNav(activeId) {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${activeId}`) {
            link.classList.add('active');
        }
    });
}

/**
 * Shopping Cart functionality
 */
function initCart() {
    updateCartUI();
    
    if (elements.cartBtn) {
        elements.cartBtn.addEventListener('click', openCart);
    }
    
    if (elements.checkoutBtn) {
        elements.checkoutBtn.addEventListener('click', handleCheckout);
    }
    
    // Global add to cart function
    window.addToCart = (productName, price) => {
        const item = { name: productName, price, id: Date.now() };
        state.cart.push(item);
        updateCartUI();
        showToast(`${productName} added to cart!`);
        animateCartButton();
    };
}

function updateCartUI() {
    if (elements.cartCount) {
        elements.cartCount.textContent = state.cart.length;
        elements.cartCount.setAttribute('aria-label', `${state.cart.length} items in cart`);
    }
}

function animateCartButton() {
    if (!elements.cartBtn) return;
    elements.cartBtn.style.transform = 'scale(1.1)';
    setTimeout(() => {
        elements.cartBtn.style.transform = '';
    }, 200);
}

function openCart() {
    if (!elements.cartModal) return;
    
    renderCartItems();
    elements.cartModal.classList.add('active');
    elements.cartModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    
    // Focus management for accessibility
    setTimeout(() => {
        const closeBtn = elements.cartModal.querySelector('.close-modal');
        if (closeBtn) closeBtn.focus();
    }, 100);
}

function closeCart() {
    if (!elements.cartModal) return;
    elements.cartModal.classList.remove('active');
    elements.cartModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    
    // Return focus to cart button
    if (elements.cartBtn) elements.cartBtn.focus();
}

function renderCartItems() {
    if (!elements.cartItems) return;
    
    if (state.cart.length === 0) {
        elements.cartItems.innerHTML = `
            <div class="empty-cart" style="text-align: center; padding: 2rem; color: var(--text-muted);">
                <i class="fas fa-shopping-cart" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.3;"></i>
                <p>Your cart is empty</p>
            </div>
        `;
        return;
    }
    
    const total = state.cart.reduce((sum, item) => {
        const priceNum = parseInt(item.price.replace(/[^0-9]/g, ''));
        return sum + (isNaN(priceNum) ? 0 : priceNum);
    }, 0);
    
    const itemsHtml = state.cart.map((item, index) => `
        <div class="cart-item" style="
            display: flex; 
            justify-content: space-between; 
            align-items: center; 
            padding: 1rem; 
            border-bottom: 1px solid var(--border);
            animation: slideIn 0.3s ease ${index * 0.05}s both;
        ">
            <div>
                <div style="font-weight: 600; color: var(--text-primary);">${item.name}</div>
                <div style="font-size: 0.875rem; color: var(--text-muted);">${item.price}</div>
            </div>
            <button onclick="removeFromCart(${index})" style="
                color: var(--accent); 
                padding: 0.5rem; 
                border-radius: 50%;
                transition: background 0.2s;
            " onmouseover="this.style.background='rgba(239,68,68,0.1)'" 
            onmouseout="this.style.background='transparent'"
            aria-label="Remove ${item.name}">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `).join('');
    
    elements.cartItems.innerHTML = `
        <div style="margin-bottom: 1rem;">
            ${itemsHtml}
        </div>
        <div style="
            display: flex; 
            justify-content: space-between; 
            padding: 1rem; 
            background: var(--bg-light);
            border-radius: 12px;
            font-size: 1.125rem;
            font-weight: 700;
        ">
            <span>Total:</span>
            <span style="color: var(--primary);">KSh ${utils.formatNumber(total)}</span>
        </div>
    `;
}

window.removeFromCart = (index) => {
    state.cart.splice(index, 1);
    updateCartUI();
    renderCartItems();
    showToast('Item removed from cart');
};

function handleCheckout() {
    if (state.cart.length === 0) {
        showToast('Your cart is empty!');
        return;
    }
    alert('Thank you for shopping with KEPKOF! Please enter pin when prompted.');
    state.cart = [];
    updateCartUI();
    closeCart();
    showToast('Order placed successfully!');
}

/**
 * Countdown Timer
 */
function initCountdown() {
    if (!elements.hours || !elements.minutes || !elements.seconds) return;
    
    const endTime = new Date();
    endTime.setHours(endTime.getHours() + CONFIG.countdownHours);
    
    function update() {
        const now = new Date().getTime();
        const distance = endTime - now;
        
        if (distance < 0) {
            clearInterval(state.countdownInterval);
            updateDisplay(0, 0, 0);
            handleCountdownEnd();
            return;
        }
        
        const hours = Math.floor(distance / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        updateDisplay(hours, minutes, seconds);
    }
    
    function updateDisplay(h, m, s) {
        elements.hours.textContent = h.toString().padStart(2, '0');
        elements.minutes.textContent = m.toString().padStart(2, '0');
        elements.seconds.textContent = s.toString().padStart(2, '0');
    }
    
    function handleCountdownEnd() {
        const saleText = document.querySelector('.sale-content p');
        if (saleText) {
            saleText.textContent = 'Sale has ended. Check back for new deals!';
        }
        if (elements.saleBtn) {
            elements.saleBtn.disabled = true;
            elements.saleBtn.textContent = 'Sale Ended';
        }
    }
    
    update();
    state.countdownInterval = setInterval(update, 1000);
}

/**
 * Stats Counter Animation
 */
function initStatsCounter() {
    if (!elements.about) return;
    
    let animated = false;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !animated) {
                animated = true;
                animateStats();
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    observer.observe(elements.about);
}

function animateStats() {
    const stats = [
        { element: elements.happyCustomers, target: CONFIG.stats.happyCustomers },
        { element: elements.productsSold, target: CONFIG.stats.productsSold },
        { element: elements.yearsExperience, target: CONFIG.stats.yearsExperience }
    ];
    
    stats.forEach(({ element, target }) => {
        if (!element) return;
        
        const duration = 2000;
        const steps = 60;
        const increment = target / steps;
        let current = 0;
        let step = 0;
        
        const timer = setInterval(() => {
            step++;
            current = Math.min(Math.floor(increment * step), target);
            element.textContent = utils.formatNumber(current);
            
            if (step >= steps) {
                element.textContent = utils.formatNumber(target);
                clearInterval(timer);
            }
        }, duration / steps);
    });
}

/**
 * Newsletter Form
 */
function initNewsletterForm() {
    if (!elements.newsletterForm) return;
    
    elements.newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const email = elements.emailInput?.value.trim();
        
        if (!isValidEmail(email)) {
            showFormError('Please enter a valid email address');
            return;
        }
        
        // Simulate API call
        simulateSubscribe(email);
    });
    
    // Real-time validation
    elements.emailInput?.addEventListener('input', () => {
        elements.emailInput.classList.remove('error');
        showFormMessage('');
    });
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function simulateSubscribe(email) {
    const submitBtn = elements.newsletterForm.querySelector('button[type="submit"]');
    const originalText = submitBtn?.textContent;
    
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Subscribing...';
    }
    
    setTimeout(() => {
        showFormSuccess('Thanks for subscribing! Check your inbox for deals.');
        elements.newsletterForm.reset();
        
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
        
        showToast('Successfully subscribed!');
    }, 1000);
}

function showFormError(message) {
    elements.emailInput?.classList.add('error');
    showFormMessage(message, 'error');
}

function showFormSuccess(message) {
    elements.emailInput?.classList.remove('error');
    showFormMessage(message, 'success');
}

function showFormMessage(message, type) {
    if (!elements.formMessage) return;
    elements.formMessage.textContent = message;
    elements.formMessage.className = `form-message ${type || ''}`;
    
    if (message) {
        setTimeout(() => {
            elements.formMessage.textContent = '';
            elements.formMessage.className = 'form-message';
        }, 5000);
    }
}

/**
 * Modal Management
 */
function initModal() {
    if (!elements.closeModal) return;
    
    elements.closeModal.addEventListener('click', closeCart);
    
    // Close on backdrop click
    elements.cartModal?.addEventListener('click', (e) => {
        if (e.target === elements.cartModal) {
            closeCart();
        }
    });
}

/**
 * Toast Notification
 */
function showToast(message) {
    if (!elements.toast || !elements.toastMessage) return;
    
    elements.toastMessage.textContent = message;
    elements.toast.classList.add('show');
    
    // Clear existing timeout if any
    if (elements.toast.timeout) {
        clearTimeout(elements.toast.timeout);
    }
    
    elements.toast.timeout = setTimeout(() => {
        elements.toast.classList.remove('show');
    }, CONFIG.toastDuration);
}

/**
 * Accessibility Improvements
 */
function initAccessibility() {
    // Manage focus for modal
    document.addEventListener('focusin', (e) => {
        if (state.isMenuOpen && !elements.mobileNav.contains(e.target) && !elements.mobileMenu.contains(e.target)) {
            e.preventDefault();
            elements.mobileLinks[0]?.focus();
        }
    });
}


function initHeroSlider() {
    const slider = document.getElementById('heroSlider');
    const slides = slider ? Array.from(slider.querySelectorAll('.hero-slide')) : [];
    const title = document.getElementById('heroSliderTitle');
    const dots = Array.from(document.querySelectorAll('.hero-dot'));

    if (!slider || slides.length <= 1) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const delay = prefersReducedMotion ? 4000 : 2000;
    let currentIndex = 0;
    let sliderInterval = null;

    function updateMeta(activeIndex) {
        const activeLabel = slides[activeIndex].dataset.label || `Slide ${activeIndex + 1}`;

        if (title) {
            title.textContent = activeLabel;
        }

        dots.forEach((dot, index) => {
            const isActive = index === activeIndex;
            dot.classList.toggle('is-active', isActive);
            dot.setAttribute('aria-current', isActive ? 'true' : 'false');
            dot.setAttribute('aria-pressed', isActive ? 'true' : 'false');
        });
    }

    function renderSlides(nextIndex) {
        slides.forEach((slide, index) => {
            slide.classList.remove('is-active', 'is-prev', 'is-next');

            if (index === nextIndex) {
                slide.classList.add('is-active');
                slide.setAttribute('aria-hidden', 'false');
            } else if (index === currentIndex) {
                slide.classList.add('is-prev');
                slide.setAttribute('aria-hidden', 'true');
            } else {
                slide.classList.add('is-next');
                slide.setAttribute('aria-hidden', 'true');
            }
        });

        currentIndex = nextIndex;
        updateMeta(currentIndex);
    }

    function showNextSlide() {
        const nextIndex = (currentIndex + 1) % slides.length;
        renderSlides(nextIndex);
    }

    function showPreviousSlide() {
        const previousIndex = (currentIndex - 1 + slides.length) % slides.length;
        renderSlides(previousIndex);
    }

    function stopAutoSlide() {
        if (sliderInterval) {
            clearInterval(sliderInterval);
            sliderInterval = null;
        }
    }

    function startAutoSlide() {
        if (prefersReducedMotion) return;

        stopAutoSlide();
        sliderInterval = setInterval(showNextSlide, delay);
    }

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            renderSlides(index);
            startAutoSlide();
        });
    });

    slider.addEventListener('mouseenter', stopAutoSlide);
    slider.addEventListener('mouseleave', startAutoSlide);
    slider.addEventListener('focusin', stopAutoSlide);
    slider.addEventListener('focusout', (event) => {
        if (!slider.contains(event.relatedTarget)) {
            startAutoSlide();
        }
    });

    slider.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowRight') {
            event.preventDefault();
            showNextSlide();
            startAutoSlide();
        }

        if (event.key === 'ArrowLeft') {
            event.preventDefault();
            showPreviousSlide();
            startAutoSlide();
        }
    });

    renderSlides(0);
    startAutoSlide();
}
/**
 * Event Handlers
 */
function handleResize() {
    // Close mobile menu on resize to desktop
    if (window.innerWidth > 1024 && state.isMenuOpen) {
        closeMobileMenu();
    }
}

function handleScroll() {
    // Add scroll-based effects here if needed
}

function handleKeydown(e) {
    // ESC to close modals/menus
    if (e.key === 'Escape') {
        if (elements.cartModal?.classList.contains('active')) {
            closeCart();
        }
        if (state.isMenuOpen) {
            closeMobileMenu();
        }
    }
}

/**
 * Global helper functions
 */
window.scrollToProducts = () => {
    const productsSection = document.getElementById('products');
    if (productsSection) {
        const offset = productsSection.offsetTop - 70;
        window.scrollTo({ top: offset, behavior: 'smooth' });
    }
};

// Button event listeners
document.addEventListener('DOMContentLoaded', () => {
    // Sale button
    elements.saleBtn?.addEventListener('click', () => {
        showToast('Flash sale products loaded!');
        scrollToProducts();
    });
    
    // Newsletter button in hero
    elements.newsletterBtn?.addEventListener('click', () => {
        const contactSection = document.getElementById('contact');
        if (contactSection) {
            const offset = contactSection.offsetTop - 70;
            window.scrollTo({ top: offset, behavior: 'smooth' });
        }
    });
});

