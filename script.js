/**
 * Dinesh Pabboju - Personal Portfolio
 * Core JavaScript logic for Theme Management, Navigation, Scroll Reveal, Copy-to-Clipboard, and Contact Form.
 */

// ==========================================================================
// Theme Management
// ==========================================================================
class ThemeManager {
    constructor() {
        this.themeToggle = document.getElementById('theme-toggle');
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
        this.navWrapper = document.querySelector('.nav-menu-wrapper');
        this.hamburger = document.getElementById('hamburger');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.init();
    }

    init() {
        this.handleScroll();
        this.handleMobileMenu();
        this.handleSmoothScroll();
        this.setupActiveSectionObserver();
        
        window.addEventListener('scroll', () => this.handleScroll(), { passive: true });
    }

    handleScroll() {
        if (!this.navbar) return;
        if (window.scrollY > 40) {
            this.navbar.classList.add('scrolled');
        } else {
            this.navbar.classList.remove('scrolled');
        }
    }

    handleMobileMenu() {
        if (!this.hamburger || !this.navWrapper) return;

        const toggleMenu = () => {
            this.hamburger.classList.toggle('active');
            this.navWrapper.classList.toggle('active');
        };

        const closeMenu = () => {
            this.hamburger.classList.remove('active');
            this.navWrapper.classList.remove('active');
        };

        this.hamburger.addEventListener('click', toggleMenu);

        // Close menu when clicking a navigation link
        this.navLinks.forEach(link => {
            link.addEventListener('click', closeMenu);
        });

        // Close when clicking outside
        document.addEventListener('click', (e) => {
            if (this.navWrapper.classList.contains('active') && 
                !this.navWrapper.contains(e.target) && 
                !this.hamburger.contains(e.target)) {
                closeMenu();
            }
        });
    }

    handleSmoothScroll() {
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const targetId = link.getAttribute('href');
                if (targetId && targetId.startsWith('#')) {
                    e.preventDefault();
                    const targetSection = document.querySelector(targetId);
                    if (targetSection) {
                        const offsetTop = targetSection.offsetTop - 75;
                        window.scrollTo({
                            top: offsetTop,
                            behavior: 'smooth'
                        });
                    }
                }
            });
        });
    }

    setupActiveSectionObserver() {
        if (!('IntersectionObserver' in window)) return;

        const options = {
            root: null,
            rootMargin: '-25% 0px -65% 0px',
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
            '.hero-grid',
            '.about-grid',
            '.education-card',
            '.cert-card',
            '.project-card',
            '.profile-card-item',
            '.contact-grid'
        ];
        this.init();
    }

    init() {
        this.setupAnimations();
        
        if ('IntersectionObserver' in window) {
            this.setupIntersectionObserver();
        } else {
            document.querySelectorAll('.animate-on-scroll').forEach(el => {
                el.classList.add('animated');
            });
        }
    }

    setupAnimations() {
        this.selectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach((element, index) => {
                element.classList.add('animate-on-scroll');
                const delay = (index % 4) * 0.08;
                element.style.transitionDelay = `${delay}s`;
            });
        });
    }

    setupIntersectionObserver() {
        const options = {
            threshold: 0.05,
            rootMargin: '0px 0px -40px 0px'
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
// Clipboard & Toast Helper
// ==========================================================================
class ClipboardHelper {
    constructor() {
        this.init();
    }

    init() {
        const emailCard = document.getElementById('copy-email');
        const phoneCard = document.getElementById('copy-phone');

        if (emailCard) {
            emailCard.addEventListener('click', () => {
                this.copyText('dinesh040805@gmail.com', 'Email copied to clipboard!');
            });
        }

        if (phoneCard) {
            phoneCard.addEventListener('click', () => {
                this.copyText('+91 9000269928', 'Phone number copied to clipboard!');
            });
        }
    }

    copyText(text, successMessage) {
        navigator.clipboard.writeText(text).then(() => {
            this.showToast(successMessage);
        }).catch(() => {
            this.showToast('Unable to copy. Please select manually.');
        });
    }

    showToast(message) {
        const existingToast = document.querySelector('.portfolio-toast');
        if (existingToast) existingToast.remove();

        const toast = document.createElement('div');
        toast.className = 'portfolio-toast';
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            bottom: 28px;
            right: 28px;
            background: var(--text-primary);
            color: var(--bg-primary);
            padding: 12px 20px;
            border-radius: var(--radius-md);
            font-size: var(--font-size-xs);
            font-weight: 600;
            box-shadow: var(--shadow-hover);
            z-index: var(--z-notification);
            opacity: 0;
            transform: translateY(16px);
            transition: opacity 0.25s cubic-bezier(0.16, 1, 0.3, 1), transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
            border: 1px solid var(--border);
        `;

        document.body.appendChild(toast);

        requestAnimationFrame(() => {
            toast.style.opacity = '1';
            toast.style.transform = 'translateY(0)';
        });

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(16px)';
            setTimeout(() => toast.remove(), 250);
        }, 3000);
    }
}

// ==========================================================================
// Contact Form Configuration (EmailJS)
// ==========================================================================
// 1. Create a free account at https://www.emailjs.com/
// 2. Add an Email Service (Gmail) to get your SERVICE_ID
// 3. Create an Email Template to get your TEMPLATE_ID
// 4. Go to Account > Security to copy your PUBLIC_KEY
const EMAILJS_CONFIG = {
    SERVICE_ID: 'service_pki9vqfwq',     // e.g., 'service_abc123'
    TEMPLATE_ID: 'template_bcbbuy5',   // e.g., 'template_xyz456'
    PUBLIC_KEY: 'Bi3X3vlcnQimA_pNk'      // e.g., 'user_123456789'
};

class ContactForm {
    constructor() {
        this.form = document.getElementById('contact-form');
        this.init();
    }

    init() {
        if (!this.form) return;
        const emailClient = window.emailjs;
        if (emailClient && EMAILJS_CONFIG.PUBLIC_KEY !== 'YOUR_PUBLIC_KEY') {
            emailClient.init({ publicKey: EMAILJS_CONFIG.PUBLIC_KEY });
        }
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    }

    async handleSubmit(e) {
        e.preventDefault();

        const submitButton = this.form.querySelector('button[type="submit"]');
        if (!submitButton) return;

        const originalHtml = submitButton.innerHTML;
        submitButton.innerHTML = '<span>Sending...</span>';
        submitButton.disabled = true;

        const formData = new FormData(this.form);
        const name = formData.get('name')?.toString().trim();
        const email = formData.get('email')?.toString().trim();
        const subject = formData.get('subject')?.toString().trim();
        const message = formData.get('message')?.toString().trim();

        if (!name || !email || !message) {
            this.showNotification('Please fill in all required fields.', 'error');
            submitButton.innerHTML = originalHtml;
            submitButton.disabled = false;
            return;
        }

        try {
            // Check if user has provided valid EmailJS credentials
            const isConfigured = Boolean(
                EMAILJS_CONFIG.SERVICE_ID &&
                EMAILJS_CONFIG.TEMPLATE_ID &&
                EMAILJS_CONFIG.PUBLIC_KEY &&
                !EMAILJS_CONFIG.SERVICE_ID.includes('YOUR_') &&
                !EMAILJS_CONFIG.TEMPLATE_ID.includes('YOUR_') &&
                !EMAILJS_CONFIG.PUBLIC_KEY.includes('YOUR_')
            );

            const emailClient = window.emailjs;

            if (isConfigured && emailClient && typeof emailClient.send === 'function') {
                await emailClient.send(
                    EMAILJS_CONFIG.SERVICE_ID,
                    EMAILJS_CONFIG.TEMPLATE_ID,
                    {
                        name: name,
                        email: email,
                        subject: subject || 'Portfolio Contact Inquiry',
                        message: message,
                        reply_to: email
                    },
                    {
                        publicKey: EMAILJS_CONFIG.PUBLIC_KEY
                    }
                );
                this.showNotification('Thank you! Your message has been sent successfully.', 'success');
                this.form.reset();
            } else {
                // Friendly notice when keys haven't been plugged in yet
                setTimeout(() => {
                    this.showNotification(`Thank you, ${name}! (Configure EMAILJS_CONFIG in script.js to receive live emails)`, 'success');
                    this.form.reset();
                    submitButton.innerHTML = originalHtml;
                    submitButton.disabled = false;
                }, 700);
                return;
            }
        } catch (error) {
            console.error('EmailJS transmission error:', error);
            const errorMsg = error?.text || (typeof error === 'string' ? error : 'Check network/keys');
            this.showNotification(`Message delivery failed (${errorMsg}). Please email dinesh040805@gmail.com directly.`, 'error');
        } finally {
            submitButton.innerHTML = originalHtml;
            submitButton.disabled = false;
        }
    }

    showNotification(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `portfolio-toast toast-${type}`;
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            bottom: 28px;
            right: 28px;
            background: var(--text-primary);
            color: var(--bg-primary);
            padding: 12px 20px;
            border-radius: var(--radius-md);
            font-size: var(--font-size-xs);
            font-weight: 600;
            box-shadow: var(--shadow-hover);
            z-index: var(--z-notification);
            opacity: 0;
            transform: translateY(16px);
            transition: opacity 0.25s cubic-bezier(0.16, 1, 0.3, 1), transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
            border: 1px solid var(--border);
        `;

        document.body.appendChild(toast);

        requestAnimationFrame(() => {
            toast.style.opacity = '1';
            toast.style.transform = 'translateY(0)';
        });

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(16px)';
            setTimeout(() => toast.remove(), 250);
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
    new ClipboardHelper();
    new ContactForm();
});