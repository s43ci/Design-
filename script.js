document.addEventListener('DOMContentLoaded', () => {
    
    // 1. تأثير شريط التنقل عند التمرير
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 10) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 2. منطق قائمة الهاتف (المحدثة)
    const menuToggle = document.getElementById('mobile-menu');
    const navOverlay = document.getElementById('nav-overlay');
    const navLinks = document.querySelectorAll('.nav-links a');
    const body = document.body;

    const toggleMenu = () => {
        menuToggle.classList.toggle('active');
        navOverlay.classList.toggle('active');
        
        // منع التمرير في الخلفية عند فتح القائمة
        if (navOverlay.classList.contains('active')) {
            body.style.overflow = 'hidden';
        } else {
            body.style.overflow = '';
        }
    };

    menuToggle.addEventListener('click', toggleMenu);

    // إغلاق القائمة عند النقر على أي رابط
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navOverlay.classList.contains('active')) {
                toggleMenu();
            }
        });
    });

    // 3. أنيميشن الظهور عند التمرير (Fade-in)
    const faders = document.querySelectorAll('.fade-in');
    const appearOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -40px 0px"
    };

    const appearOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add('appear');
                observer.unobserve(entry.target);
            }
        });
    }, appearOptions);

    faders.forEach(fader => {
        appearOnScroll.observe(fader);
    });

});
