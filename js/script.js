// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initMobileMenu();
    initSmoothScroll();
    initActiveNav();
    initProducts();
    initCart();
    initCountdown();
    initStatsCounter();
    initNewsletterForm();
    initCategoryCards();
    initModal();
});

// Mobile Menu Toggle
function initMobileMenu() {
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileNav = document.getElementById('mobileNav');
    
    if (mobileMenu) {
        mobileMenu.addEventListener('click', function() {
            mobileNav.classList.toggle('active');
            
            // Change icon based on menu state
            const icon = this.querySelector('i');
            if (mobileNav.classList.contains('active')) {
                icon.className = 'fas fa-times';
            } else {
                icon.className = 'fas fa-bars';
            }
        });
    }
    
    // Close mobile menu when clicking a link
    const mobileLinks = document.querySelectorAll('.mobile-link');
    mobileLinks.forEach(link => {
        link.addEventListener('click', function() {
            mobileNav.classList.remove('active');
            const menuIcon = document.querySelector('#mobileMenu i');
            if (menuIcon) {
                menuIcon.className = 'fas fa-bars';
            }
        });
    });
}

// Smooth Scroll for navigation links
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Active navigation link based on scroll position
function initActiveNav() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    window.addEventListener('scroll', function() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

// Load products dynamically
function initProducts() {
    const products = [
        { name: 'iPhone 16 Pro', price: 'ksh 168,000', image: 'images/3.jpg' }, // Fixed: removed space after .jpg
        { name: 'Samsung 65" 4K TV', price: 'ksh 139,999', image: 'images/4.jpg' },
        { name: 'MacBook Pro 14"', price: 'ksh 135,395', image: 'images/5.jpg' },
        { name: 'Oraimo Airbuds 4', price: 'ksh 2,900', image: 'images/6.jpg' }
    ];
    
    const showcaseGrid = document.getElementById('showcaseGrid');
    if (showcaseGrid) {
        showcaseGrid.innerHTML = products.map(product => `
            <div class="showcase-item" onclick="addToCart('${product.name}', '${product.price}')">
                <img src="${product.image}" alt="${product.name}" class="product-image" loading="lazy">
                <h3>${product.name}</h3>
                <p>${product.price}</p>
            </div>
        `).join('');
    }
}

// Shopping Cart functionality
let cartCount = 0;
const cartItems = [];

function initCart() {
    // Update cart count display
    updateCartCount();
    
    // Cart button click
    const cartBtn = document.getElementById('cartBtn');
    if (cartBtn) {
        cartBtn.addEventListener('click', showCart);
    }
    
    // Checkout button - UPDATED: Changed KCKOF to KEPKOF
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            alert('Thank you for shopping with KEPKOF! Please enter pin when prompted .');
            closeModal();
        });
    }
}

// Add to cart function (global for onclick)
window.addToCart = function(productName, price) {
    cartCount++;
    cartItems.push({ name: productName, price: price });
    
    // Update cart count
    updateCartCount();
    
    // Show toast notification
    showToast(`${productName} added to cart!`);
    
    // Animate cart button
    const cartBtn = document.getElementById('cartBtn');
    if (cartBtn) {
        cartBtn.style.transform = 'scale(1.1)';
        setTimeout(() => {
            cartBtn.style.transform = 'scale(1)';
        }, 200);
    }
};

function updateCartCount() {
    const cartCountElement = document.getElementById('cartCount');
    if (cartCountElement) {
        cartCountElement.textContent = cartCount;
    }
}

function showCart() {
    const modal = document.getElementById('cartModal');
    const cartItemsContainer = document.getElementById('cartItems');
    
    if (cartItems.length === 0) {
        cartItemsContainer.innerHTML = '<p style="text-align: center; color: #64748b;">Your cart is empty</p>';
    } else {
        let total = 0;
        const itemsHtml = cartItems.map((item, index) => {
            const priceNum = parseInt(item.price.replace(/[^0-9]/g, ''));
            total += priceNum;
            return `
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; padding-bottom: 1rem; border-bottom: 1px solid #e2e8f0;">
                    <span>${item.name}</span>
                    <span style="font-weight: 600; color: #2563eb;">${item.price}</span>
                </div>
            `;
        }).join('');
        
        cartItemsContainer.innerHTML = itemsHtml + `
            <div style="display: flex; justify-content: space-between; margin-top: 1rem; padding-top: 1rem; font-weight: 700;">
                <span>Total:</span>
                <span>$${total.toLocaleString()}</span>
            </div>
        `;
    }
    
    modal.classList.add('active');
}

function closeModal() {
    const modal = document.getElementById('cartModal');
    modal.classList.remove('active');
}

// Close modal when clicking outside or on close button
function initModal() {
    const modal = document.getElementById('cartModal');
    const closeBtn = document.getElementById('closeModal');
    
    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }
    
    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
}

// Toast notification
function showToast(message) {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');
    
    toastMessage.textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Countdown Timer
function initCountdown() {
    // Set the countdown to 24 hours from now
    const countDownDate = new Date();
    countDownDate.setHours(countDownDate.getHours() + 24);
    
    function updateCountdown() {
        const now = new Date().getTime();
        const distance = countDownDate - now;
        
        const hours = Math.floor(distance / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
        document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
        document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
        
        // If countdown is finished
        if (distance < 0) {
            clearInterval(countdownInterval);
            document.getElementById('hours').textContent = '00';
            document.getElementById('minutes').textContent = '00';
            document.getElementById('seconds').textContent = '00';
            
            // Show expired message
            const saleBanner = document.querySelector('.sale-content p');
            if (saleBanner) {
                saleBanner.textContent = 'Sale has ended. Check back for new deals!';
            }
        }
    }
    
    // Update every second
    updateCountdown();
    const countdownInterval = setInterval(updateCountdown, 1000);
}

// Stats Counter Animation
function initStatsCounter() {
    const stats = [
        { id: 'happyCustomers', target: 5000 },
        { id: 'productsSold', target: 15000 },
        { id: 'yearsExperience', target: 5 }
    ];
    
    function animateStats() {
        stats.forEach(stat => {
            const element = document.getElementById(stat.id);
            if (!element) return;
            
            const target = stat.target;
            let current = 0;
            const increment = target / 100; // Divide animation into 100 steps
            const duration = 2000; // 2 seconds
            const stepTime = duration / 100;
            
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    element.textContent = target.toLocaleString();
                    clearInterval(timer);
                } else {
                    element.textContent = Math.floor(current).toLocaleString();
                }
            }, stepTime);
        });
    }
    
    // Start animation when about section is visible
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateStats();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(aboutSection);
    }
}

// Newsletter Form
function initNewsletterForm() {
    const form = document.getElementById('newsletterForm');
    const messageDiv = document.getElementById('formMessage');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('emailInput').value;
            const emailInput = document.getElementById('emailInput');
            
            // Simple email validation
            if (!isValidEmail(email)) {
                showFormMessage('Please enter a valid email address', 'error');
                emailInput.classList.add('error');
                return;
            }
            
            emailInput.classList.remove('error');
            
            // Simulate form submission
            showFormMessage('Thanks for subscribing! Check your inbox for deals.', 'success');
            form.reset();
            
            // Show toast notification
            showToast('Successfully subscribed to newsletter!');
        });
    }
}

function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function showFormMessage(message, type) {
    const messageDiv = document.getElementById('formMessage');
    messageDiv.textContent = message;
    messageDiv.className = 'form-message ' + type;
    
    setTimeout(() => {
        messageDiv.textContent = '';
        messageDiv.className = 'form-message';
    }, 5000);
}

// Category Cards Interaction
function initCategoryCards() {
    const categoryCards = document.querySelectorAll('.category-card');
    
    categoryCards.forEach(card => {
        card.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            
            // Show toast notification
            showToast(`Browsing ${category} category`);
            
            // Animate clicked card
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'translateY(-10px)';
            }, 200);
        });
    });
}

// Scroll to products section
window.scrollToProducts = function() {
    const productsSection = document.getElementById('products');
    if (productsSection) {
        productsSection.scrollIntoView({ behavior: 'smooth' });
    }
};

// View All Products button
document.addEventListener('DOMContentLoaded', function() {
    const viewAllBtn = document.getElementById('viewAllBtn');
    if (viewAllBtn) {
        viewAllBtn.addEventListener('click', function() {
            showToast('View all products - Full store coming soon!');
        });
    }
    
    // Sale button
    const saleBtn = document.getElementById('saleBtn');
    if (saleBtn) {
        saleBtn.addEventListener('click', function() {
            showToast('Flash sale products loaded!');
        });
    }
    
    // Newsletter button in hero
    const newsletterBtn = document.getElementById('newsletterBtn');
    if (newsletterBtn) {
        newsletterBtn.addEventListener('click', function() {
            const contactSection = document.getElementById('contact');
            if (contactSection) {
                contactSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
});

// Add smooth hover effects for all buttons
document.addEventListener('mouseover', function(e) {
    if (e.target.classList.contains('btn-primary') || 
        e.target.classList.contains('btn-secondary') ||
        e.target.classList.contains('btn-outline')) {
        e.target.style.transition = 'all 0.3s ease';
    }
});

// Handle window resize
window.addEventListener('resize', function() {
    // Close mobile menu if window is resized above mobile breakpoint
    if (window.innerWidth > 768) {
        const mobileNav = document.getElementById('mobileNav');
        const menuIcon = document.querySelector('#mobileMenu i');
        if (mobileNav && mobileNav.classList.contains('active')) {
            mobileNav.classList.remove('active');
            if (menuIcon) {
                menuIcon.className = 'fas fa-bars';
            }
        }
    }
});

// Add loading animation for images
document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('load', function() {
            this.style.animation = 'fadeIn 0.5s ease';
        });
    });
});

// Keyboard navigation for modal
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        const modal = document.getElementById('cartModal');
        if (modal && modal.classList.contains('active')) {
            closeModal();
        }
    }
});