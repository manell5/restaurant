     document.addEventListener('DOMContentLoaded', function() {
            const eventCards = document.querySelectorAll('.event-card');
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.animation = `fadeIn 0.8s forwards, float 6s ease-in-out infinite 2s`;
                    }
                });
            }, { threshold: 0.1 });

            eventCards.forEach(card => {
                observer.observe(card);
            });
        });