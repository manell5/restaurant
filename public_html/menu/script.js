document.addEventListener('DOMContentLoaded', function() {
    // Simulate loading
    setTimeout(function() {
        document.querySelector('.loading-screen').style.opacity = '0';
        document.querySelector('.menu-container').classList.remove('hidden');
        
        setTimeout(function() {
            document.querySelector('.loading-screen').style.display = 'none';
            
            // Affichage simple sans animation Animate.css
            setupTabNavigation();
            // Scroll animations désactivées (Animate.css)
        }, 500);
    }, 2000);
});

function setupTabNavigation() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const menuSections = document.querySelectorAll('.menu-section');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            tabButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Hide all sections
            menuSections.forEach(section => section.classList.remove('show'));
            
            // Show selected section
            const tabToShow = this.getAttribute('data-tab');
            document.querySelector(`.menu-section.${tabToShow}`).classList.add('show');
        });
    });
}

// Parallax effect for background
window.addEventListener('scroll', function() {
    const scrollPosition = window.pageYOffset;
    document.body.style.backgroundPositionY = `${scrollPosition * 0.5}px`;
});