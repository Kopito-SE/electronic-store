// Director Data - In a real application, this might come from an API
const directorsData = [
    {
        id: 1,
        name: "COLYNS KIPLANGAT",
        title: "Chief Executive Officer",
        expertise: "Strategic Planning & Business Development",
        image: "../images/chiefexecutive.jpg",
        profileUrl: "colyns.html",
        description: "5+ years of experience in electronics industry"
    },
    {
        id: 2,
        name: "ODHIAMBO SETH",
        title: "Chief Operating Officer",
        expertise: "Operations & Supply Chain Management",
        image: "../images/chiefoperating.jpg",
        profileUrl: "directors/odhiambo.html",
        description: "Expert in global supply chain optimization"
    },
    {
        id: 3,
        name: "PRESTON KIPROTICH",
        title: "Chief Financial Officer",
        expertise: "Financial Strategy & Investment",
        image: "https://via.placeholder.com/400x400?text=Michael+Chen",
        profileUrl: "directors/preston.html",
        description: "Former investment banker with Electronic focus"
    },
    {
        id: 4,
        name: "FIDEL CASTRO OTIENO",
        title: "Chief Marketing Officer",
        expertise: "Brand Strategy & Digital Marketing",
        image: "https://via.placeholder.com/400x400?text=Emily+Rodriguez",
        profileUrl: "directors/castro.html",
        description: "Award-winning marketing strategist"
    },
    {
        id: 5,
        name: "KEVIN KIPTOO",
        title: "Chief Technology Officer",
        expertise: "Innovation & Product Development",
        image: "https://via.placeholder.com/400x400?text=David+Kim",
        profileUrl: "directors/kevin.html",
        description: "Former tech startup founder with AI expertise"
    },
        
    {
        id: 6,
        name: "EUGENE KHATETE",
        title: "Chief Marketing Officer",
        expertise: "Talent Development & Corporate Culture",
        image: "https://via.placeholder.com/400x400?text=Emily+Rodriguez",
        profileUrl: "directors/eugene.html",
        description: "Expert in building high-performance teams"
    }

];

// Function to create director cards
function createDirectorCards() {
    const gridContainer = document.getElementById('directorsGrid');
    
    if (!gridContainer) return;
    
    directorsData.forEach(director => {
        const card = document.createElement('div');
        card.className = 'director-card';
        
        card.innerHTML = `
            <div class="card-image">
                <img src="${director.image}" alt="${director.name}">
            </div>
            <div class="card-content">
                <h3>${director.name}</h3>
                <div class="director-title">${director.title}</div>
                <div class="director-expertise">${director.expertise}</div>
                <p style="color: #666; margin-bottom: 1rem; font-style: italic;">"${director.description}"</p>
                <button class="view-profile-btn" onclick="navigateToProfile('${director.profileUrl}')">
                    View Full Profile
                </button>
            </div>
        `;
        
        gridContainer.appendChild(card);
    });
}

// Navigation function for profile pages
function navigateToProfile(url) {
    window.location.href = url;
}

// Mobile menu toggle
function initializeMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
                navLinks.classList.remove('active');
            }
        });
    }
}

// Smooth scroll for anchor links
function initializeSmoothScroll() {
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
}

// Lazy loading images
function initializeLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Page load animation
function initializePageAnimations() {
    const cards = document.querySelectorAll('.director-card');
    cards.forEach((card, index) => {
        card.style.animation = `fadeInUp 0.5s ease forwards ${index * 0.1}s`;
    });
}

// Add animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .director-card {
        opacity: 0;
    }
`;
document.head.appendChild(style);

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    createDirectorCards();
    initializeMobileMenu();
    initializeSmoothScroll();
    initializeLazyLoading();
    initializePageAnimations();
    
    // Add active class to current nav item
    const currentPage = window.location.pathname.split('/').pop();
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });
});

// Optional: Add search/filter functionality
function filterDirectors(searchTerm) {
    const filteredDirectors = directorsData.filter(director => 
        director.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        director.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        director.expertise.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    updateDirectorsGrid(filteredDirectors);
}

function updateDirectorsGrid(directors) {
    const gridContainer = document.getElementById('directorsGrid');
    if (!gridContainer) return;
    
    gridContainer.innerHTML = '';
    
    if (directors.length === 0) {
        gridContainer.innerHTML = '<p style="text-align: center; grid-column: 1/-1;">No directors found</p>';
        return;
    }
    
    directors.forEach(director => {
        const card = document.createElement('div');
        card.className = 'director-card';
        
        card.innerHTML = `
            <div class="card-image">
                <img src="${director.image}" alt="${director.name}">
            </div>
            <div class="card-content">
                <h3>${director.name}</h3>
                <div class="director-title">${director.title}</div>
                <div class="director-expertise">${director.expertise}</div>
                <button class="view-profile-btn" onclick="navigateToProfile('${director.profileUrl}')">
                    View Full Profile
                </button>
            </div>
        `;
        
        gridContainer.appendChild(card);
    });
}

// Export functions if using modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        directorsData,
        createDirectorCards,
        filterDirectors
    };
}