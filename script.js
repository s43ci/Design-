document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Navbar Scroll Effect
    const navbar = document.getElementById('navbar');
    
    window.addEventListener('scroll', () => {
        // Add subtle bottom border when scrolling down
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 2. Scroll Fade-in Animation (Intersection Observer)
    const faders = document.querySelectorAll('.fade-in');
    
    // Options for the observer: trigger when 15% of the element is visible
    const appearOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const appearOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return; // Do nothing if not in view
            } else {
                // Add the 'appear' class to trigger CSS transition
                entry.target.classList.add('appear');
                // Stop observing once it has appeared
                observer.unobserve(entry.target);
            }
        });
    }, appearOptions);

    // Attach observer to every element with the 'fade-in' class
    faders.forEach(fader => {
        appearOnScroll.observe(fader);
    });

});
