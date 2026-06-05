/**
 * Dinesh Pabboju - Personal Portfolio
 * Core Javascript logic for Theme Management, Navigation, Scroll Reveal, and Forms.
 * Performance optimized to prevent Layout Thrashing (no offsetTop queries on scroll).
 */

// ==========================================================================
// Theme Management
// ==========================================================================
class ThemeManager {
    constructor() {
        this.themeToggle = document.getElementById('theme-toggle');
        // Initial theme is already set by inline head script to avoid flash
        this.currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
        this.init();
    }

    init() {
        if (this.themeToggle) {
            this.themeToggle.addEventListener('click', () => this.toggleTheme());
        }
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

// ==========================================================================
// Navigation & Mobile Menu Management
// ==========================================================================
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
        this.setupActiveSectionObserver();
        
        // Passive event listener for high performance scrolling
        window.addEventListener('scroll', () => this.handleScroll(), { passive: true });
    }

    handleScroll() {
        if (!this.navbar) return;
        if (window.scrollY > 50) {
            this.navbar.classList.add('scrolled');
        } else {
            this.navbar.classList.remove('scrolled');
        }
    }

    handleMobileMenu() {
        if (!this.hamburger || !this.navMenu) return;

        this.hamburger.addEventListener('click', () => {
            this.hamburger.classList.toggle('active');
            this.navMenu.classList.toggle('active');
        });

        // Close mobile menu drawer when clicking a link
        this.navLinks.forEach(link => {
            link.addEventListener('click', () => {
                this.hamburger.classList.remove('active');
                this.navMenu.classList.remove('active');
            });
        });

        // Close drawer when clicking outside
        document.addEventListener('click', (e) => {
            if (this.navMenu.classList.contains('active') && 
                !this.navMenu.contains(e.target) && 
                !this.hamburger.contains(e.target)) {
                this.hamburger.classList.remove('active');
                this.navMenu.classList.remove('active');
            }
        });
    }

    handleSmoothScroll() {
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const targetId = link.getAttribute('href');
                if (targetId.startsWith('#')) {
                    e.preventDefault();
                    const targetSection = document.querySelector(targetId);
                    if (targetSection) {
                        // Offset matching the scroll-padding-top in CSS
                        const offsetTop = targetSection.offsetTop - 80;
                        window.scrollTo({
                            top: offsetTop,
                            behavior: 'smooth'
                        });
                    }
                }
            });
        });
    }

    /**
     * Replaces scroll-event offset queries with IntersectionObserver.
     * Fully prevents forced reflows (layout thrashing) on scroll.
     */
    setupActiveSectionObserver() {
        if (!('IntersectionObserver' in window)) return;

        const options = {
            root: null,
            rootMargin: '-30% 0px -60% 0px', // Activates nav links when section reaches upper viewport
            threshold: 0
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const sectionId = entry.target.getAttribute('id');
                    this.navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${sectionId}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        }, options);

        const sections = document.querySelectorAll('section');
        sections.forEach(section => observer.observe(section));
    }
}

// ==========================================================================
// Scroll Reveal Animations
// ==========================================================================
class ScrollReveal {
    constructor() {
        this.selectors = [
            '.hero-content',
            '.about-content',
            '.project-card',
            '.certification-item',
            '.profile-item',
            '.education-item',
            '.contact-content'
        ];
        this.init();
    }

    init() {
        this.setupAnimations();
        
        if ('IntersectionObserver' in window) {
            this.setupIntersectionObserver();
        } else {
            // Fallback for older browsers (no reveals, just instantly visible)
            document.querySelectorAll('.animate-on-scroll').forEach(el => {
                el.classList.add('animated');
            });
        }
    }

    setupAnimations() {
        // Tag elements dynamically and stagger animation delays
        this.selectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach((element, index) => {
                element.classList.add('animate-on-scroll');
                // Stagger animations based on container children
                const delay = (index % 3) * 0.1;
                element.style.transitionDelay = `${delay}s`;
            });
        });
    }

    setupIntersectionObserver() {
        const options = {
            threshold: 0.05,
            rootMargin: '0px 0px -30px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                    observer.unobserve(entry.target);
                }
            });
        }, options);

        const elements = document.querySelectorAll('.animate-on-scroll');
        elements.forEach(element => observer.observe(element));
    }
}

// ==========================================================================
// Contact Form Handler (EmailJS)
// ==========================================================================
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
        if (this.form) {
            this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        }
    }

    async handleSubmit(e) {
        e.preventDefault();
        
        const submitButton = this.form.querySelector('button[type="submit"]');
        if (!submitButton) return;
        
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
                    to_email: 'dinesh040805@gmail.com'
                }
            );
            
            console.log('Email sent successfully:', response);
            this.showNotification('Thank you! Your message has been sent successfully.', 'success');
            this.form.reset();
            
        } catch (error) {
            console.error('Failed to send email:', error);
            this.showNotification('Sorry, something went wrong. Please try emailing me directly.', 'error');
        } finally {
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        }
    }

    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        notification.style.cssText = `
            position: fixed;
            bottom: 30px;
            right: 30px;
            background: ${type === 'success' ? 'var(--text-primary)' : 'var(--destructive)'};
            color: var(--bg-primary);
            padding: var(--spacing-md) var(--spacing-lg);
            border-radius: var(--radius-sm);
            border: 1px solid var(--border);
            box-shadow: var(--shadow-hover);
            z-index: var(--z-notification);
            max-width: 320px;
            font-size: var(--font-size-sm);
            font-weight: 500;
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.3s cubic-bezier(0.16, 1, 0.3, 1), transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        `;

        document.body.appendChild(notification);

        // Micro-timeout to trigger transition
        requestAnimationFrame(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateY(0)';
        });

        // Remove notification after 4 seconds
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateY(20px)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 4000);
    }
}

// ==========================================================================
// Initialization
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
    new ThemeManager();
    new Navigation();
    new ScrollReveal();
    new ContactForm();
});