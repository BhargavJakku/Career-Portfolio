// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Navbar background on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.8)';
        navbar.style.boxShadow = 'none';
    }
});

// Resume Modal
const modal = document.getElementById('resumeModal');
const resumeBtn = document.getElementById('resumeBtn');
const closeBtn = document.querySelector('.close');

resumeBtn.addEventListener('click', (e) => {
    e.preventDefault();
    modal.style.display = 'block';
});

closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
});

window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
    }
});

// Contact Form Handling
const contactForm = document.querySelector('.contact-form');
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Get form values
    const name = e.target.querySelector('input[type="text"]').value;
    const email = e.target.querySelector('input[type="email"]').value;
    const message = e.target.querySelector('textarea').value;
    
    // Here you would typically send the data to a server
    // For now, we'll just show an alert
    alert(`Thank you ${name}! Your message has been received. I'll get back to you soon at ${email}.`);
    
    // Reset form
    e.target.reset();
});

// Water Canvas Animation
const canvas = document.getElementById('waterCanvas');
const ctx = canvas.getContext('2d');

// Set canvas size
function resizeCanvas() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Water wave animation
class Wave {
    constructor(y, height, frequency, phase) {
        this.y = y;
        this.height = height;
        this.frequency = frequency;
        this.phase = phase;
    }
    
    draw(time) {
        ctx.beginPath();
        ctx.moveTo(0, canvas.height);
        
        for (let x = 0; x < canvas.width; x++) {
            const y = this.y + Math.sin((x * this.frequency) + (time * 0.002) + this.phase) * this.height;
            ctx.lineTo(x, y);
        }
        
        ctx.lineTo(canvas.width, canvas.height);
        ctx.closePath();
        
        return this;
    }
}

const waves = [
    new Wave(canvas.height * 0.3, 20, 0.01, 0),
    new Wave(canvas.height * 0.4, 15, 0.015, Math.PI / 2),
    new Wave(canvas.height * 0.5, 25, 0.008, Math.PI),
];

let startTime = Date.now();

function animateWater() {
    const time = Date.now() - startTime;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw waves with different opacities
    waves.forEach((wave, index) => {
        ctx.fillStyle = `rgba(255, 255, 255, ${0.1 - index * 0.02})`;
        wave.draw(time).draw(time);
        ctx.fill();
    });
    
    // Add some bubbles
    if (Math.random() < 0.05) {
        createBubble();
    }
    
    bubbles.forEach((bubble, index) => {
        bubble.update();
        bubble.draw();
        
        if (bubble.y < 0 || bubble.opacity <= 0) {
            bubbles.splice(index, 1);
        }
    });
    
    requestAnimationFrame(animateWater);
}

// Bubble class
class Bubble {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = Math.random() * 3 + 2;
        this.speedY = -Math.random() * 2 - 1;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.opacity = 0.6;
    }
    
    update() {
        this.y += this.speedY;
        this.x += this.speedX;
        this.opacity -= 0.005;
    }
    
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
        ctx.fill();
        ctx.strokeStyle = `rgba(255, 255, 255, ${this.opacity * 0.5})`;
        ctx.lineWidth = 1;
        ctx.stroke();
    }
}

let bubbles = [];

function createBubble() {
    const x = Math.random() * canvas.width;
    const y = canvas.height * 0.6 + Math.random() * canvas.height * 0.4;
    bubbles.push(new Bubble(x, y));
}

// Start water animation
animateWater();

// Intersection Observer for scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for scroll animations
document.querySelectorAll('.project-card, .timeline-item, .stat-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all 0.6s ease';
    observer.observe(el);
});

// Counter animation for stats
const statNumbers = document.querySelectorAll('.stat-item h3');

function animateCounter(element, target, duration) {
    const targetNum = parseInt(target.replace('+', ''));
    const increment = targetNum / (duration / 16);
    let current = 0;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= targetNum) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current) + '+';
        }
    }, 16);
}

const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
            entry.target.classList.add('counted');
            const target = entry.target.textContent;
            animateCounter(entry.target, target, 2000);
        }
    });
}, { threshold: 0.5 });

statNumbers.forEach(stat => {
    statsObserver.observe(stat);
});

// Typing effect for hero subtitle (optional enhancement)
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.textContent = '';
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Add parallax effect to hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero-content');
    if (hero && scrolled < window.innerHeight) {
        hero.style.transform = `translateY(${scrolled * 0.5}px)`;
        hero.style.opacity = 1 - (scrolled / window.innerHeight);
    }
});

// Skill items hover effect
document.querySelectorAll('.skill-item').forEach(skill => {
    skill.addEventListener('mouseenter', function() {
        this.style.boxShadow = '0 10px 30px rgba(0, 113, 227, 0.3)';
    });
    
    skill.addEventListener('mouseleave', function() {
        this.style.boxShadow = 'none';
    });
});

// Add ripple effect to buttons
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        ripple.style.cssText = `
            position: absolute;
            width: 10px;
            height: 10px;
            background: rgba(255, 255, 255, 0.6);
            border-radius: 50%;
            transform: translate(-50%, -50%);
            left: ${x}px;
            top: ${y}px;
            animation: rippleEffect 0.6s ease-out;
            pointer-events: none;
        `;
        
        this.style.position = 'relative';
        this.style.overflow = 'hidden';
        this.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    });
});

// Add ripple animation to CSS dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes rippleEffect {
        to {
            width: 200px;
            height: 200px;
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Console message for developers
console.log('%c👋 Hey there, developer!', 'font-size: 20px; color: #0071e3; font-weight: bold;');
console.log('%cInterested in how this was built? Check out the code!', 'font-size: 14px; color: #666;');
console.log('%c⭐ Made with passion and lots of coffee', 'font-size: 12px; color: #999; font-style: italic;');

// Performance optimization: Lazy load images
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                observer.unobserve(img);
            }
        });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// Add loading animation
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});