// ===== DOM Elements =====
const navbar = document.querySelector('.navbar');
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const navLinksItems = document.querySelectorAll('.nav-links a');
const testimonialCards = document.querySelectorAll('.testimonial-card');
const dots = document.querySelectorAll('.dot');
const prevBtn = document.querySelector('.slider-btn.prev');
const nextBtn = document.querySelector('.slider-btn.next');
const statNumbers = document.querySelectorAll('.stat-number');

let currentTestimonial = 0;
let statsAnimated = false;

// ===== Navbar Scroll Effect =====
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    // Animate stats when visible
    const statsSection = document.querySelector('.stats-container');
    const statsPosition = statsSection.getBoundingClientRect().top;
    const screenPosition = window.innerHeight / 1.3;
    
    if (statsPosition < screenPosition && !statsAnimated) {
        animateStats();
        statsAnimated = true;
    }
});

// ===== Mobile Menu Toggle =====
hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    hamburger.classList.toggle('active');
});

// ===== Smooth Scrolling for Nav Links =====
navLinksItems.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            const offsetTop = targetSection.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
            
            // Close mobile menu
            navLinks.classList.remove('active');
            
            // Update active state
            navLinksItems.forEach(item => item.classList.remove('active'));
            link.classList.add('active');
        }
    });
});

// ===== Update Active Nav Link on Scroll =====
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (window.scrollY >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    navLinksItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('href') === `#${current}`) {
            item.classList.add('active');
        }
    });
});

// ===== Testimonials Slider =====
function showTestimonial(index) {
    testimonialCards.forEach((card, i) => {
        card.classList.remove('active');
        dots[i].classList.remove('active');
    });
    
    testimonialCards[index].classList.add('active');
    dots[index].classList.add('active');
}

prevBtn.addEventListener('click', () => {
    currentTestimonial--;
    if (currentTestimonial < 0) {
        currentTestimonial = testimonialCards.length - 1;
    }
    showTestimonial(currentTestimonial);
});

nextBtn.addEventListener('click', () => {
    currentTestimonial++;
    if (currentTestimonial >= testimonialCards.length) {
        currentTestimonial = 0;
    }
    showTestimonial(currentTestimonial);
});

dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        currentTestimonial = index;
        showTestimonial(currentTestimonial);
    });
});

// Auto-advance testimonials
setInterval(() => {
    currentTestimonial++;
    if (currentTestimonial >= testimonialCards.length) {
        currentTestimonial = 0;
    }
    showTestimonial(currentTestimonial);
}, 5000);

// ===== Counter Animation for Stats =====
function animateStats() {
    statNumbers.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-target'));
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;
        
        const updateCounter = () => {
            current += increment;
            if (current < target) {
                if (target >= 1000) {
                    stat.textContent = Math.floor(current).toLocaleString();
                } else {
                    stat.textContent = Math.floor(current);
                }
                requestAnimationFrame(updateCounter);
            } else {
                if (target >= 1000) {
                    stat.textContent = target.toLocaleString() + '+';
                } else {
                    stat.textContent = target + '+';
                }
            }
        };
        
        updateCounter();
    });
}

// ===== Wishlist Button Toggle =====
const wishlistBtns = document.querySelectorAll('.wishlist-btn');

wishlistBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const icon = btn.querySelector('i');
        icon.classList.toggle('far');
        icon.classList.toggle('fas');
        
        if (icon.classList.contains('fas')) {
            btn.style.background = '#f59e0b';
            btn.style.color = '#ffffff';
        } else {
            btn.style.background = '#ffffff';
            btn.style.color = '';
        }
    });
});

// ===== Form Submission =====
const bookingForm = document.getElementById('bookingForm');

bookingForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Get form values
    const formData = new FormData(bookingForm);
    
    // Show success message (in real app, you'd send to server)
    alert('Thank you for your message! We will get back to you soon.');
    bookingForm.reset();
});

// ===== Newsletter Form =====
const newsletterForm = document.querySelector('.newsletter-form');

if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Thank you for subscribing to our newsletter!');
        newsletterForm.reset();
    });
}

// ===== Intersection Observer for Animations =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe destination cards and service cards
const animatedElements = document.querySelectorAll('.destination-card, .service-card');

animatedElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// ===== Parallax Effect for Hero Section =====
window.addEventListener('scroll', () => {
    const hero = document.querySelector('.hero');
    const scrolled = window.scrollY;
    
    if (scrolled < hero.offsetHeight) {
        const floatingElements = document.querySelectorAll('.floating-element');
        floatingElements.forEach((el, index) => {
            const speed = (index + 1) * 0.5;
            el.style.transform = `translateY(${scrolled * speed}px)`;
        });
    }
});

// ===== CTA Button Click =====
const ctaBtn = document.querySelector('.cta-btn');
const exploreBtn = document.querySelector('.btn-primary');

[ctaBtn, exploreBtn].forEach(btn => {
    if (btn) {
        btn.addEventListener('click', () => {
            const destinationsSection = document.querySelector('#destinations');
            if (destinationsSection) {
                const offsetTop = destinationsSection.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    }
});

// ===== Add Hover Effect to Service Cards =====
const serviceCards = document.querySelectorAll('.service-card');

serviceCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
        serviceCards.forEach(c => {
            if (c !== card) {
                c.style.opacity = '0.7';
            }
        });
    });
    
    card.addEventListener('mouseleave', function() {
        serviceCards.forEach(c => {
            c.style.opacity = '1';
        });
    });
});

// ===== Page Load Animation =====
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// ===== Console Message =====
console.log('%c🌍 Wanderlust Travel - Discover Your Next Adventure!', 'font-size: 20px; font-weight: bold; color: #667eea;');
console.log('%cBuilt with ❤️ for travel enthusiasts', 'font-size: 14px; color: #764ba2;');
