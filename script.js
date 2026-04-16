/**
 * Wathiq Mohammed Portfolio — Script
 * Handles: particles, cursor glow, theme toggle, nav, scroll animations
 */

document.addEventListener('DOMContentLoaded', () => {

    // =============================================
    // 1. FLOATING PARTICLES SYSTEM
    // =============================================
    const canvas = document.getElementById('particles-canvas');
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animFrameId;
    let mouseX = 0, mouseY = 0;

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2.5 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.3;
            this.speedY = (Math.random() - 0.5) * 0.3;
            this.opacity = Math.random() * 0.4 + 0.1;
            this.fadeDirection = Math.random() > 0.5 ? 1 : -1;
            this.fadeSpeed = Math.random() * 0.003 + 0.001;
            // Shape: 0 = circle, 1 = ring, 2 = diamond
            this.shape = Math.floor(Math.random() * 3);
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            // Gentle mouse repulsion
            const dx = this.x - mouseX;
            const dy = this.y - mouseY;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 120) {
                const force = (120 - dist) / 120 * 0.15;
                this.x += (dx / dist) * force;
                this.y += (dy / dist) * force;
            }

            // Pulsing opacity
            this.opacity += this.fadeDirection * this.fadeSpeed;
            if (this.opacity >= 0.5) this.fadeDirection = -1;
            if (this.opacity <= 0.05) this.fadeDirection = 1;

            // Wrap around edges
            if (this.x < -10) this.x = canvas.width + 10;
            if (this.x > canvas.width + 10) this.x = -10;
            if (this.y < -10) this.y = canvas.height + 10;
            if (this.y > canvas.height + 10) this.y = -10;
        }

        draw(ctx) {
            const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
            const color = isDark ? `rgba(147, 197, 253, ${this.opacity})` : `rgba(0, 113, 227, ${this.opacity})`;

            ctx.save();
            ctx.fillStyle = color;
            ctx.strokeStyle = color;

            switch (this.shape) {
                case 0: // Circle
                    ctx.beginPath();
                    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                    ctx.fill();
                    break;
                case 1: // Ring
                    ctx.beginPath();
                    ctx.arc(this.x, this.y, this.size * 1.5, 0, Math.PI * 2);
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                    break;
                case 2: // Diamond
                    ctx.beginPath();
                    ctx.translate(this.x, this.y);
                    ctx.rotate(Math.PI / 4);
                    ctx.fillRect(-this.size * 0.6, -this.size * 0.6, this.size * 1.2, this.size * 1.2);
                    break;
            }

            ctx.restore();
        }
    }

    function initParticles() {
        // Responsive particle count
        const area = canvas.width * canvas.height;
        const count = Math.min(Math.floor(area / 15000), 80);
        particles = [];
        for (let i = 0; i < count; i++) {
            particles.push(new Particle());
        }
    }

    // Draw subtle connection lines between nearby particles
    function drawConnections(ctx) {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 120) {
                    const alpha = (1 - dist / 120) * 0.08;
                    ctx.strokeStyle = isDark
                        ? `rgba(147, 197, 253, ${alpha})`
                        : `rgba(0, 113, 227, ${alpha})`;
                    ctx.lineWidth = 0.5;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw(ctx);
        });
        drawConnections(ctx);
        animFrameId = requestAnimationFrame(animateParticles);
    }

    resizeCanvas();
    initParticles();
    animateParticles();

    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            resizeCanvas();
            initParticles();
        }, 200);
    });

    // =============================================
    // 2. CURSOR GLOW (Desktop only)
    // =============================================
    const cursorGlow = document.getElementById('cursor-glow');
    let cursorGlowActive = false;

    if (window.matchMedia('(pointer: fine)').matches) {
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;

            if (!cursorGlowActive) {
                cursorGlow.classList.add('active');
                cursorGlowActive = true;
            }

            cursorGlow.style.transform = `translate(${e.clientX - 150}px, ${e.clientY - 150}px)`;
        });

        document.addEventListener('mouseleave', () => {
            cursorGlow.classList.remove('active');
            cursorGlowActive = false;
        });
    }

    // Card mouse tracking for spotlight effect
    document.querySelectorAll('.social-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            card.style.setProperty('--mouse-x', `${x}%`);
            card.style.setProperty('--mouse-y', `${y}%`);
        });
    });

    // =============================================
    // 3. THEME TOGGLE (Dark / Light)
    // =============================================
    const themeToggle = document.getElementById('theme-toggle');
    const root = document.documentElement;

    // Check saved preference or system preference
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme) {
        root.setAttribute('data-theme', savedTheme);
    } else if (prefersDark) {
        root.setAttribute('data-theme', 'dark');
    }

    // Update meta theme-color
    function updateMetaTheme() {
        const isDark = root.getAttribute('data-theme') === 'dark';
        const meta = document.querySelector('meta[name="theme-color"]');
        if (meta) {
            meta.setAttribute('content', isDark ? '#09090b' : '#ffffff');
        }
    }
    updateMetaTheme();

    themeToggle.addEventListener('click', () => {
        const current = root.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        root.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);
        updateMetaTheme();
    });

    // =============================================
    // 4. NAVIGATION
    // =============================================
    const navbar = document.getElementById('navbar');
    const menuToggle = document.getElementById('mobile-menu');
    const navOverlay = document.getElementById('nav-overlay');
    const navLinks = document.querySelectorAll('.nav-links a');
    const body = document.body;

    // Scroll effect
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        if (scrollY > 10) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        lastScroll = scrollY;
    }, { passive: true });

    // Mobile menu toggle
    const toggleMenu = () => {
        menuToggle.classList.toggle('active');
        navOverlay.classList.toggle('active');

        if (navOverlay.classList.contains('active')) {
            body.style.overflow = 'hidden';
        } else {
            body.style.overflow = '';
        }
    };

    menuToggle.addEventListener('click', toggleMenu);

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navOverlay.classList.contains('active')) {
                toggleMenu();
            }
        });
    });

    // =============================================
    // 5. SCROLL ANIMATIONS
    // =============================================
    // Fade-in sections
    const faders = document.querySelectorAll('.fade-in');
    const fadeObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('appear');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -60px 0px'
    });

    faders.forEach(fader => fadeObserver.observe(fader));

    // Staggered card reveal
    const cards = document.querySelectorAll('.social-card');
    const cardObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Find the index of this card among all cards for stagger
                const cardIndex = Array.from(cards).indexOf(entry.target);
                setTimeout(() => {
                    entry.target.classList.add('card-visible');
                }, cardIndex * 100);
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.05,
        rootMargin: '0px 0px -30px 0px'
    });

    cards.forEach(card => cardObserver.observe(card));

    // =============================================
    // 6. SMOOTH SCROLL for anchor links
    // =============================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height')) || 56;
                const top = target.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({
                    top,
                    behavior: 'smooth'
                });
            }
        });
    });

});
