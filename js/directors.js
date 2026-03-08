/**
 * KEPKOF Directors Page - Optimized JavaScript
 * Features: Performance, accessibility, mobile responsiveness
 */

// ============================================
// CONFIGURATION
// ============================================
const CONFIG = {
    animationDelay: 100,
    statsDuration: 2000,
    toastDuration: 3000,
    searchDebounce: 300
};

// ============================================
// DATA
// ============================================
const directorsData = [
    {
        id: 1,
        name: "Colyns Kiplangat",
        title: "Chief Executive Officer",
        expertise: "Strategic Planning & Business Development",
        image: "images/chiefexecutive.jpg",
        profileUrl: "directors/colyns.html",
        description: "5+ years of experience in electronics industry leadership"
    },
    {
        id: 2,
        name: "Odhiambo Seth",
        title: "Chief Operating Officer",
        expertise: "Operations & Supply Chain Management",
        image: "images/chiefoperating.jpg",
        profileUrl: "directors/odhiambo.html",
        description: "Expert in global supply chain optimization"
    },
    {
        id: 3,
        name: "Preston Kiprotich",
        title: "Chief Financial Officer",
        expertise: "Financial Strategy & Investment",
        image: "images/chieffinancial.jpg",
        profileUrl: "directors/preston.html",
        description: "Former investment banker with electronics focus"
    },
    {
        id: 4,
        name: "Fidel Castro Otieno",
        title: "Chief Marketing Officer",
        expertise: "Brand Strategy & Digital Marketing",
        image: "images/chiefmarketing.jpg",
        profileUrl: "directors/castro.html",
        description: "Award-winning marketing strategist"
    },
    {
        id: 5,
        name: "Kevin Kiptoo",
        title: "Chief Technology Officer",
        expertise: "Innovation & Product Development",
        image: "images/chieftechnology.jpg",
        profileUrl: "directors/kevin.html",
        description: "Former tech startup founder with AI expertise"
    },
    {
        id: 6,
        name: "Eugene Khatete",
        title: "Chief Information Systems Officer",
        expertise: "IT Infrastructure & Digital Transformation",
        image: "images/chiefinformation.jpg",
        profileUrl: "directors/eugene.html",
        description: "Expert in building high-performance tech teams"
    }
];

// ============================================
// STATE MANAGEMENT
// ============================================
const state = {
    isMenuOpen: false,
    searchTerm: '',
    filteredDirectors: [...directorsData]
};

// ============================================
// DOM ELEMENTS CACHE
// ============================================
const elements = {};

function cacheElements() {
    const ids = [
        'directorsGrid', 'hamburger', 'directorSearch',
        'noResults', 'toast', 'toastMessage'
    ];
    
    ids.forEach(id => {
        elements[id] = document.getElementById(id);
    });
    
    elements.navMenu = document.getElementById('navLinks');
    elements.statNumbers = document.querySelectorAll('.stat-number');
    elements.navLinks = document.querySelectorAll('.nav-links a');
}

// ============================================
// UTILITY FUNCTIONS
// ============================================
const utils = {
    debounce: (func, wait) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    },

    formatNumber: (num) => num.toLocaleString(),

    sanitizeHTML: (str) => {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }
};

// ============================================
// DIRECTOR CARDS
// ============================================
function createDirectorCard(director, index) {
    const card = document.createElement('article');
    card.className = 'director-card';
    card.style.animationDelay = `${index * CONFIG.animationDelay}ms`;
    card.setAttribute('role', 'listitem');
    
    const safeName = utils.sanitizeHTML(director.name);
    const safeTitle = utils.sanitizeHTML(director.title);
    const safeExpertise = utils.sanitizeHTML(director.expertise);
    const safeDescription = utils.sanitizeHTML(director.description);
    
    card.innerHTML = `
        <div class="card-image">
            <img src="${director.image}" 
                 alt="Portrait of ${safeName}, ${safeTitle}" 
                 loading="lazy"
                 onerror="this.src='images/directors.jpg'">
        </div>
        <div class="card-content">
            <h3>${safeName}</h3>
            <div class="director-title">${safeTitle}</div>
            <div class="director-expertise">${safeExpertise}</div>
            <p class="director-description">"${safeDescription}"</p>
            <button class="view-profile-btn" onclick="navigateToProfile('${director.profileUrl}')" type="button">
                View Full Profile
            </button>
        </div>
    `;
    
    // Add click handler to entire card for better UX
    card.addEventListener('click', (e) => {
        if (!e.target.closest('button')) {
            navigateToProfile(director.profileUrl);
        }
    });
    
    // Keyboard accessibility
    card.setAttribute('tabindex', '0');
    card.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            navigateToProfile(director.profileUrl);
        }
    });
    
    return card;
}

function renderDirectors(directors) {
    const grid = elements.directorsGrid;
    if (!grid) return;
    
    grid.innerHTML = '';
    
    if (directors.length === 0) {
        showNoResults(true);
        return;
    }
    
    showNoResults(false);
    
    directors.forEach((director, index) => {
        grid.appendChild(createDirectorCard(director, index));
    });
}

function showNoResults(show) {
    if (elements.noResults) {
        elements.noResults.hidden = !show;
    }
    if (elements.directorsGrid) {
        elements.directorsGrid.style.display = show ? 'none' : 'grid';
    }
}

// ============================================
// NAVIGATION
// ============================================
function navigateToProfile(url) {
    // Show loading toast
    showToast('Loading profile...');
    
    // Small delay for UX
    setTimeout(() => {
        window.location.href = url;
    }, 300);
}

// ============================================
// MOBILE MENU
// ============================================
function initMobileMenu() {
    if (!elements.hamburger || !elements.navMenu) return;
    
    elements.hamburger.addEventListener('click', toggleMobileMenu);
    
    // Close on link click
    elements.navLinks.forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });
    
    // Close on outside click
    document.addEventListener('click', (e) => {
        if (state.isMenuOpen && 
            !elements.hamburger.contains(e.target) && 
            !elements.navMenu.contains(e.target)) {
            closeMobileMenu();
        }
    });
    
    // Close on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && state.isMenuOpen) {
            closeMobileMenu();
        }
    });
}

function toggleMobileMenu() {
    state.isMenuOpen = !state.isMenuOpen;
    elements.navMenu.classList.toggle('active', state.isMenuOpen);
    elements.hamburger.setAttribute('aria-expanded', state.isMenuOpen);
    
    const icon = elements.hamburger.querySelector('i');
    if (icon) {
        icon.className = state.isMenuOpen ? 'fas fa-times' : 'fas fa-bars';
    }
    
    document.body.style.overflow = state.isMenuOpen ? 'hidden' : '';
}

function closeMobileMenu() {
    if (!state.isMenuOpen) return;
    state.isMenuOpen = false;
    elements.navMenu.classList.remove('active');
    elements.hamburger.setAttribute('aria-expanded', 'false');
    
    const icon = elements.hamburger.querySelector('i');
    if (icon) icon.className = 'fas fa-bars';
    
    document.body.style.overflow = '';
}

// ============================================
// SEARCH/FILTER
// ============================================
function initSearch() {
    if (!elements.directorSearch) return;
    
    const debouncedSearch = utils.debounce((searchTerm) => {
        performSearch(searchTerm);
    }, CONFIG.searchDebounce);
    
    elements.directorSearch.addEventListener('input', (e) => {
        debouncedSearch(e.target.value.trim());
    });
    
    // Clear search on escape
    elements.directorSearch.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            elements.directorSearch.value = '';
            performSearch('');
            elements.directorSearch.blur();
        }
    });
}

function performSearch(searchTerm) {
    state.searchTerm = searchTerm.toLowerCase();
    
    if (!state.searchTerm) {
        state.filteredDirectors = [...directorsData];
    } else {
        state.filteredDirectors = directorsData.filter(director => 
            director.name.toLowerCase().includes(state.searchTerm) ||
            director.title.toLowerCase().includes(state.searchTerm) ||
            director.expertise.toLowerCase().includes(state.searchTerm)
        );
    }
    
    renderDirectors(state.filteredDirectors);
    
    // Announce results to screen readers
    announceSearchResults(state.filteredDirectors.length);
}

function announceSearchResults(count) {
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', 'polite');
    announcement.className = 'visually-hidden';
    announcement.textContent = count === 0 
        ? 'No directors found matching your search.' 
        : `Found ${count} director${count !== 1 ? 's' : ''}.`;
    
    document.body.appendChild(announcement);
    setTimeout(() => announcement.remove(), 1000);
}

// ============================================
// STATS COUNTER
// ============================================
function initStatsCounter() {
    if (!elements.statNumbers.length) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateStats();
                observer.disconnect();
            }
        });
    }, { threshold: 0.5 });
    
    const statsSection = document.querySelector('.stats');
    if (statsSection) observer.observe(statsSection);
}

function animateStats() {
    elements.statNumbers.forEach(stat => {
        const target = parseInt(stat.dataset.target);
        const suffix = stat.textContent.includes('+') ? '+' : '';
        const duration = CONFIG.statsDuration;
        const steps = 60;
        const increment = target / steps;
        let current = 0;
        let step = 0;
        
        const timer = setInterval(() => {
            step++;
            current = Math.min(Math.floor(increment * step), target);
            stat.textContent = current + suffix;
            
            if (step >= steps) {
                stat.textContent = target + suffix;
                clearInterval(timer);
            }
        }, duration / steps);
    });
}

// ============================================
// TOAST NOTIFICATIONS
// ============================================
function showToast(message, type = 'info') {
    if (!elements.toast || !elements.toastMessage) return;
    
    elements.toastMessage.textContent = message;
    elements.toast.classList.add('show');
    
    // Update icon based on type
    const icon = elements.toast.querySelector('i');
    if (icon) {
        icon.className = type === 'error' ? 'fas fa-exclamation-circle' : 'fas fa-info-circle';
    }
    
    clearTimeout(elements.toast.timeout);
    elements.toast.timeout = setTimeout(() => {
        elements.toast.classList.remove('show');
    }, CONFIG.toastDuration);
}

// ============================================
// ACTIVE NAVIGATION
// ============================================
function setActiveNav() {
    const currentPage = window.location.pathname.split('/').pop() || 'directors.html';
    
    elements.navLinks?.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
            link.setAttribute('aria-current', 'page');
        } else {
            link.classList.remove('active');
            link.removeAttribute('aria-current');
        }
    });
}

// ============================================
// SMOOTH SCROLL
// ============================================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                const offset = target.offsetTop - 80;
                window.scrollTo({
                    top: offset,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ============================================
// IMAGE LAZY LOADING FALLBACK
// ============================================
function initLazyLoading() {
    if ('loading' in HTMLImageElement.prototype) {
        // Browser supports native lazy loading
        return;
    }
    
    // Fallback for older browsers
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                observer.unobserve(img);
            }
        });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ============================================
// INITIALIZATION
// ============================================
function init() {
    cacheElements();
    renderDirectors(directorsData);
    initMobileMenu();
    initSearch();
    initStatsCounter();
    initSmoothScroll();
    initLazyLoading();
    setActiveNav();
    
    // Handle resize
    window.addEventListener('resize', utils.debounce(() => {
        if (window.innerWidth > 1024 && state.isMenuOpen) {
            closeMobileMenu();
        }
    }, 250));
}

// Start when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// Expose necessary functions globally
window.navigateToProfile = navigateToProfile;


