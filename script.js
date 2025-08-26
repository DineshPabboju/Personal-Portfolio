// Theme Management
class ThemeManager {
    constructor() {
        this.themeToggle = document.getElementById('theme-toggle');
        this.currentTheme = localStorage.getItem('theme') || 'light';
        this.init();
    }

    init() {
        this.setTheme(this.currentTheme);
        this.themeToggle.addEventListener('click', () => this.toggleTheme());
    }

    setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        this.currentTheme = theme;
    }

    toggleTheme() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
    }
}

// Navigation Management
class Navigation {
    constructor() {
        this.navbar = document.getElementById('navbar');
        this.navMenu = document.getElementById('nav-menu');
        this.hamburger = document.getElementById('hamburger');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.init();
    }

    init() {
        this.handleScroll();
        this.handleMobileMenu();
        this.handleSmoothScroll();
        this.highlightActiveSection();
        
        window.addEventListener('scroll', () => {
            this.handleScroll();
            this.highlightActiveSection();
        });
    }

    handleScroll() {
        if (window.scrollY > 100) {
            this.navbar.classList.add('scrolled');
        } else {
            this.navbar.classList.remove('scrolled');
        }
    }

    handleMobileMenu() {
        this.hamburger.addEventListener('click', () => {
            this.hamburger.classList.toggle('active');
            this.navMenu.classList.toggle('active');
        });

        // Close mobile menu when clicking on a link
        this.navLinks.forEach(link => {
            link.addEventListener('click', () => {
                this.hamburger.classList.remove('active');
                this.navMenu.classList.remove('active');
            });
        });
    }

    handleSmoothScroll() {
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    const offsetTop = targetSection.offsetTop - 100; // Account for fixed navbar
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    highlightActiveSection() {
        const sections = document.querySelectorAll('section');
        const scrollPos = window.scrollY + 200;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                this.navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
}

// Scroll Animations
class ScrollAnimations {
    constructor() {
        this.animatedElements = [];
        this.init();
    }

    init() {
        this.setupAnimations();
        this.handleScroll();
        window.addEventListener('scroll', () => this.handleScroll());
    }

    setupAnimations() {
        // Add animation classes to elements
        const elements = [
            '.hero-content',
            '.about-content',
            '.project-card',
            '.github-stats',
            '.contact-content'
        ];

        elements.forEach(selector => {
            const nodeList = document.querySelectorAll(selector);
            nodeList.forEach((element, index) => {
                element.classList.add('animate-on-scroll');
                element.style.animationDelay = `${index * 0.1}s`;
                this.animatedElements.push(element);
            });
        });
    }

    handleScroll() {
        this.animatedElements.forEach(element => {
            if (this.isElementInViewport(element) && !element.classList.contains('animated')) {
                element.classList.add('animated');
            }
        });
    }

    isElementInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        ) || (
            rect.top < (window.innerHeight || document.documentElement.clientHeight) &&
            rect.bottom >= 0
        );
    }
}

// Contact Form Handler
class ContactForm {
    constructor() {
        this.form = document.getElementById('contact-form');
        this.initEmailJS();
        this.init();
    }

    initEmailJS() {
        // Initialize EmailJS with your public key
        emailjs.init("YOUR_PUBLIC_KEY"); // Replace with your actual public key
    }

    init() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    }

    async handleSubmit(e) {
        if(!this.form) return;
        e.preventDefault();
        
        // Show loading state
        const submitButton = this.form.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        submitButton.textContent = 'Sending...';
        submitButton.disabled = true;
        
        const formData = new FormData(this.form);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            message: formData.get('message')
        };

        try {
            // Send email using EmailJS
            const response = await emailjs.send(
                'YOUR_SERVICE_ID',    // Replace with your service ID
                'YOUR_TEMPLATE_ID',   // Replace with your template ID
                {
                    from_name: data.name,
                    from_email: data.email,
                    message: data.message,
                    to_email: 'dinesh040805@gmail.com' // Your email
                }
            );
            
            console.log('Email sent successfully:', response);
            this.showNotification('Thank you for your message! I\'ll get back to you soon.', 'success');
            this.form.reset();
            
        } catch (error) {
            console.error('Failed to send email:', error);
            this.showNotification('Sorry, there was an error sending your message. Please try again.', 'error');
        } finally {
            // Reset button state
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        }
    }

    showNotification(message, type = 'success') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Add styles for notification
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${type === 'success' ? 'var(--primary)' : 'var(--destructive)'};
            color: white;
            padding: var(--spacing-md) var(--spacing-lg);
            border-radius: var(--radius-md);
            box-shadow: 0 4px 15px var(--shadow);
            z-index: 1000;
            animation: slideInRight 0.3s ease;
            max-width: 300px;
            font-weight: 500;
        `;

        // Add animation styles
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            @keyframes slideOutRight {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);

        document.body.appendChild(notification);

        // Remove notification after 4 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
                if (style.parentNode) {
                    style.parentNode.removeChild(style);
                }
            }, 300);
        }, 4000);
    }
}

// Intersection Observer for better performance
class IntersectionAnimations {
    constructor() {
        this.observer = null;
        this.init();
    }

    init() {
        // Only use Intersection Observer if supported
        if ('IntersectionObserver' in window) {
            this.setupIntersectionObserver();
        } else {
            // Fallback to scroll-based animations
            new ScrollAnimations();
        }
    }

    setupIntersectionObserver() {
        const options = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                    this.observer.unobserve(entry.target);
                }
            });
        }, options);

        // Observe elements
        const elements = document.querySelectorAll('.animate-on-scroll');
        elements.forEach(element => {
            this.observer.observe(element);
        });
    }
}

// Parallax Effect for Hero Section
class ParallaxEffect {
    constructor() {
        this.hero = document.querySelector('.hero');
        this.init();
    }

    init() {
        if (window.innerWidth > 768) { // Only on desktop
            window.addEventListener('scroll', () => this.handleParallax());
        }
    }

    handleParallax() {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        if (this.hero) {
            this.hero.style.transform = `translateY(${rate}px)`;
        }
    }
}

// Typing Animation for Hero Text
class TypingAnimation {
    constructor() {
        this.element = document.querySelector('.hero-subtitle');
        this.text = 'Frontend Developer';
        this.index = 0;
        this.isDeleting = false;
        this.init();
    }

    init() {
        if (this.element) {
            this.element.textContent = '';
            setTimeout(() => this.type(), 1000);
        }
    }

    type() {
        const current = this.text.substring(0, this.index);
        this.element.textContent = current;

        if (!this.isDeleting && this.index < this.text.length) {
            this.index++;
            setTimeout(() => this.type(), 100);
        } else if (this.isDeleting && this.index > 0) {
            this.index--;
            setTimeout(() => this.type(), 50);
        } else if (!this.isDeleting && this.index === this.text.length) {
            setTimeout(() => {
                this.isDeleting = true;
                this.type();
            }, 2000);
        } else if (this.isDeleting && this.index === 0) {
            this.isDeleting = false;
            setTimeout(() => this.type(), 500);
        }
    }
}

// Smooth reveal for project cards
class ProjectCardAnimations {
    constructor() {
        this.cards = document.querySelectorAll('.project-card');
        this.init();
    }

    init() {
        this.cards.forEach((card, index) => {
            card.style.animationDelay = `${index * 0.2}s`;
            
            // Add hover effects
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-10px) scale(1.02)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0) scale(1)';
            });
        });
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all components
    new ThemeManager();
    new Navigation();
    new IntersectionAnimations();
    new ContactForm();
    new ParallaxEffect();
    new TypingAnimation();
    new ProjectCardAnimations();

    // Add loading animation
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);

    // Preload animations
    const style = document.createElement('style');
    style.textContent = `
        .animate-on-scroll {
            opacity: 0;
            transform: translateY(30px);
            transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .animate-on-scroll.animated {
            opacity: 1;
            transform: translateY(0);
        }
    `;
    document.head.appendChild(style);
});

// Performance optimization
window.addEventListener('load', () => {
    // Remove any loading states
    document.body.classList.add('loaded');
    
    // Lazy load images if any
    const images = document.querySelectorAll('img[data-src]');
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
});

// Error handling
window.addEventListener('error', (e) => {
    console.error('An error occurred:', e.error);
});

// Handle resize events
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        // Recalculate any position-dependent elements
        window.dispatchEvent(new Event('scroll'));
    }, 250);
});