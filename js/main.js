/**
 * LeadForge Digital - Main JavaScript
 * Handles navigation, mobile menu, scroll reveals, and interactions
 */

document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const navMenu = document.getElementById('navMenu');
    const navbar = document.getElementById('navbar');

    if (mobileMenuToggle && navMenu) {
        mobileMenuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            mobileMenuToggle.classList.toggle('active');
        });

        const navLinks = navMenu.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                mobileMenuToggle.classList.remove('active');
            });
        });

        document.addEventListener('click', function(event) {
            const isClickInsideNav = navbar.contains(event.target);
            if (!isClickInsideNav && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                mobileMenuToggle.classList.remove('active');
            }
        });
    }

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href.length > 1) {
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });

    // Navbar shadow on scroll
    if (navbar) {
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 10) {
                navbar.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
            } else {
                navbar.style.boxShadow = 'none';
            }
        });
    }

    // Auto-tag common sections with reveal classes if not already present
    const autoRevealSelectors = [
        '.benefits-grid', '.services-grid', '.case-study-content',
        '.process-steps', '.pricing-grid', '.care-pricing-grid',
        '.addons-grid', '.terms-content', '.service-detail-card',
        '.care-features-grid', '.portfolio-grid', '.contact-content',
        '.section-title', '.results-grid', '.case-study-features',
        '.contact-wrapper', '.case-study-link-content', '.case-study-overview',
        '.case-study-header'
    ];
    autoRevealSelectors.forEach(sel => {
        document.querySelectorAll(sel).forEach(el => {
            if (!el.classList.contains('reveal') && !el.classList.contains('reveal-stagger')) {
                el.classList.add('reveal');
            }
        });
    });

    // Stagger children of grid-like reveal targets
    ['.benefits-grid', '.services-grid', '.process-steps', '.pricing-grid', '.care-pricing-grid', '.results-grid', '.case-study-features'].forEach(sel => {
        document.querySelectorAll(sel).forEach(el => {
            el.classList.remove('reveal');
            el.classList.add('reveal-stagger');
            Array.from(el.children).forEach(child => child.classList.add('stagger-item'));
        });
    });

    // Scroll-triggered reveal via IntersectionObserver
    const revealTargets = document.querySelectorAll('.reveal, .reveal-stagger');
    if ('IntersectionObserver' in window && revealTargets.length) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

        revealTargets.forEach(el => observer.observe(el));
    } else {
        revealTargets.forEach(el => el.classList.add('visible'));
    }

    // Animated stat counters
    const statNumbers = document.querySelectorAll('.stat-number, .result-number');
    if (statNumbers.length) {
        const animateCount = (el) => {
            const raw = el.textContent.trim();
            const match = raw.match(/^([\d,]*\.?\d+)(.*)$/);
            if (!match) return;
            const numStr = match[1].replace(/,/g, '');
            const target = parseFloat(numStr);
            const suffix = match[2] || '';
            const decimals = numStr.includes('.') ? numStr.split('.')[1].length : 0;
            if (isNaN(target)) return;

            const duration = 1400;
            const start = performance.now();

            function tick(now) {
                const progress = Math.min((now - start) / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3);
                const value = target * eased;
                el.textContent = value.toFixed(decimals) + suffix;
                if (progress < 1) {
                    requestAnimationFrame(tick);
                }
            }
            requestAnimationFrame(tick);
        };

        if ('IntersectionObserver' in window) {
            const statObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        animateCount(entry.target);
                        statObserver.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.5 });
            statNumbers.forEach(el => statObserver.observe(el));
        }
    }

    // Inject decorative hero blobs
    document.querySelectorAll('.hero').forEach(hero => {
        if (!hero.querySelector('.hero-blob-1')) {
            const blob1 = document.createElement('div');
            blob1.className = 'hero-blob hero-blob-1';
            const blob2 = document.createElement('div');
            blob2.className = 'hero-blob hero-blob-2';
            hero.prepend(blob2);
            hero.prepend(blob1);
        }
    });
});
