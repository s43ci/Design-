// Add subtle shadow to navigation bar when scrolling
window.addEventListener('scroll', () => {
    const nav = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        nav.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
    } else {
        nav.style.boxShadow = 'none';
    }
});

// Interactive Shopping Cart Logic
document.addEventListener('DOMContentLoaded', () => {
    let cartCount = 0;
    const cartBadge = document.querySelector('.cart-badge');
    const addToCartButtons = document.querySelectorAll('.add-to-cart');

    addToCartButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Prevent link jumping if wrapped in anchor tags
            e.preventDefault(); 
            
            // Increment cart value
            cartCount++;
            
            // Update UI
            cartBadge.textContent = cartCount;
            
            // Animate badge for visual feedback
            cartBadge.style.transform = 'scale(1.3)';
            setTimeout(() => {
                cartBadge.style.transform = 'scale(1)';
            }, 200);

            // Change button state to indicate success
            const originalText = this.textContent;
            this.textContent = 'Added to Cart!';
            this.style.backgroundColor = 'var(--primary-color)';
            this.style.color = 'var(--white)';
            
            // Revert button back to normal after 1.5 seconds
            setTimeout(() => {
                this.textContent = originalText;
                this.style.backgroundColor = 'transparent';
                this.style.color = 'var(--primary-color)';
            }, 1500);
        });
    });
});
