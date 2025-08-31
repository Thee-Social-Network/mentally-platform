// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    // Emergency button functionality
    const emergencyButton = document.getElementById('emergency-button');
    if (emergencyButton) {
        emergencyButton.addEventListener('click', function() {
            if (confirm('Are you sure you want to call emergency services?')) {
                // In a real implementation, this would call South African emergency numbers
                window.location.href = 'tel:112';
                alert('Calling emergency services. Please stay on the line.');
            }
        });
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
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

    // Animation on scroll
    function animateOnScroll() {
        const elements = document.querySelectorAll('.feature-card, .testimonials blockquote');
        
        elements.forEach(element => {
            const position = element.getBoundingClientRect();
            
            // If element is in viewport
            if (position.top < window.innerHeight - 100) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    }

    // Initialize elements for animation
    const animatedElements = document.querySelectorAll('.feature-card, .testimonials blockquote');
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });

    // Listen for scroll events
    window.addEventListener('scroll', animateOnScroll);
    // Initial check
    animateOnScroll();
});