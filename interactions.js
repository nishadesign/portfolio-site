// ===============================================
// DYNAMIC INTERACTIONS - Portfolio Enhancement
// Features: Magnetic buttons, 3D card tilt,
// Text reveal animations, Custom cursor
// ===============================================

// ===== 1. MAGNETIC BUTTONS =====
// Buttons subtly follow the cursor when hovering

class MagneticButton {
    constructor(element) {
        this.element = element;
        this.strength = 0.3; // How much the button moves (0-1)
        this.boundingRect = null;

        this.onMouseMove = this.onMouseMove.bind(this);
        this.onMouseLeave = this.onMouseLeave.bind(this);
        this.onMouseEnter = this.onMouseEnter.bind(this);

        this.init();
    }

    init() {
        this.element.addEventListener('mouseenter', this.onMouseEnter);
        this.element.addEventListener('mousemove', this.onMouseMove);
        this.element.addEventListener('mouseleave', this.onMouseLeave);
        this.element.style.transition = 'transform 0.2s cubic-bezier(0.33, 1, 0.68, 1)';
    }

    onMouseEnter() {
        this.boundingRect = this.element.getBoundingClientRect();
    }

    onMouseMove(e) {
        if (!this.boundingRect) return;

        const centerX = this.boundingRect.left + this.boundingRect.width / 2;
        const centerY = this.boundingRect.top + this.boundingRect.height / 2;

        const deltaX = (e.clientX - centerX) * this.strength;
        const deltaY = (e.clientY - centerY) * this.strength;

        this.element.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
    }

    onMouseLeave() {
        this.element.style.transform = 'translate(0, 0)';
        this.boundingRect = null;
    }
}

function initMagneticButtons() {
    // Select all buttons that should have magnetic effect
    const magneticElements = document.querySelectorAll(
        '.footer-button, .filter-pill, .hero-link-btn, .nav-link, .release-notes-link'
    );

    magneticElements.forEach(el => {
        // Skip on touch devices
        if ('ontouchstart' in window) return;
        new MagneticButton(el);
    });

    console.log('Magnetic buttons initialized:', magneticElements.length);
}


// ===== 2. 3D CARD TILT =====
// Project cards tilt based on mouse position

class TiltCard {
    constructor(element) {
        this.element = element;
        this.maxTilt = 8; // Maximum tilt in degrees
        this.perspective = 1000;
        this.scale = 1.02;
        this.speed = 400;
        this.glareOpacity = 0.1;

        this.boundingRect = null;
        this.glareElement = null;

        this.onMouseMove = this.onMouseMove.bind(this);
        this.onMouseLeave = this.onMouseLeave.bind(this);
        this.onMouseEnter = this.onMouseEnter.bind(this);

        this.init();
    }

    init() {
        // Set up the card for 3D transforms
        this.element.style.transformStyle = 'preserve-3d';
        this.element.style.transition = `transform ${this.speed}ms cubic-bezier(0.03, 0.98, 0.52, 0.99)`;

        // Create glare element
        this.createGlare();

        this.element.addEventListener('mouseenter', this.onMouseEnter);
        this.element.addEventListener('mousemove', this.onMouseMove);
        this.element.addEventListener('mouseleave', this.onMouseLeave);
    }

    createGlare() {
        this.glareElement = document.createElement('div');
        this.glareElement.className = 'tilt-glare';
        this.glareElement.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            background: linear-gradient(
                135deg,
                rgba(255, 255, 255, ${this.glareOpacity}) 0%,
                rgba(255, 255, 255, 0) 60%
            );
            opacity: 0;
            transition: opacity ${this.speed}ms ease;
            border-radius: inherit;
            z-index: 10;
        `;
        this.element.style.position = 'relative';
        this.element.appendChild(this.glareElement);
    }

    onMouseEnter(e) {
        this.boundingRect = this.element.getBoundingClientRect();
        this.element.style.transition = `transform ${this.speed}ms cubic-bezier(0.03, 0.98, 0.52, 0.99)`;
    }

    onMouseMove(e) {
        if (!this.boundingRect) return;

        const x = e.clientX - this.boundingRect.left;
        const y = e.clientY - this.boundingRect.top;

        const centerX = this.boundingRect.width / 2;
        const centerY = this.boundingRect.height / 2;

        // Calculate rotation (inverted for natural feel)
        const rotateX = ((y - centerY) / centerY) * -this.maxTilt;
        const rotateY = ((x - centerX) / centerX) * this.maxTilt;

        // Apply transform
        this.element.style.transform = `
            perspective(${this.perspective}px)
            rotateX(${rotateX}deg)
            rotateY(${rotateY}deg)
            scale3d(${this.scale}, ${this.scale}, ${this.scale})
        `;

        // Update glare position
        if (this.glareElement) {
            const glareX = (x / this.boundingRect.width) * 100;
            const glareY = (y / this.boundingRect.height) * 100;
            this.glareElement.style.background = `
                radial-gradient(
                    circle at ${glareX}% ${glareY}%,
                    rgba(255, 255, 255, ${this.glareOpacity * 2}) 0%,
                    rgba(255, 255, 255, 0) 60%
                )
            `;
            this.glareElement.style.opacity = '1';
        }
    }

    onMouseLeave() {
        this.element.style.transform = `
            perspective(${this.perspective}px)
            rotateX(0deg)
            rotateY(0deg)
            scale3d(1, 1, 1)
        `;

        if (this.glareElement) {
            this.glareElement.style.opacity = '0';
        }

        this.boundingRect = null;
    }
}

function initTiltCards() {
    // Skip on touch devices
    if ('ontouchstart' in window) return;

    const cards = document.querySelectorAll('.project-card');
    cards.forEach(card => new TiltCard(card));

    console.log('Tilt cards initialized:', cards.length);
}


// ===== 3. TEXT REVEAL ANIMATIONS =====
// Hero text animates in word by word or letter by letter

class TextReveal {
    constructor(element, options = {}) {
        this.element = element;
        this.type = options.type || 'words'; // 'words' or 'chars'
        this.staggerDelay = options.staggerDelay || 50; // ms between each item
        this.animationDuration = options.animationDuration || 600;
        this.originalText = element.textContent;

        this.init();
    }

    init() {
        // Don't re-initialize if already processed
        if (this.element.classList.contains('text-reveal-processed')) return;
        this.element.classList.add('text-reveal-processed');

        const items = this.type === 'words'
            ? this.originalText.split(' ')
            : this.originalText.split('');

        // Clear the element
        this.element.innerHTML = '';
        this.element.classList.add('text-reveal');

        items.forEach((item, index) => {
            const span = document.createElement('span');
            span.className = 'text-reveal-item';
            span.textContent = this.type === 'words' ? item : item;
            span.style.animationDelay = `${index * this.staggerDelay}ms`;
            span.style.animationDuration = `${this.animationDuration}ms`;

            this.element.appendChild(span);

            // Add space after words (not after last word)
            if (this.type === 'words' && index < items.length - 1) {
                const space = document.createTextNode(' ');
                this.element.appendChild(space);
            }
        });
    }
}

function initTextReveal() {
    // Hero title on work page
    const workHeroTitle = document.querySelector('.work-hero-title');
    if (workHeroTitle) {
        new TextReveal(workHeroTitle, { type: 'chars', staggerDelay: 30, animationDuration: 500 });
    }

    // Hero descriptions on work page
    const workHeroDescriptions = document.querySelectorAll('.work-hero-description');
    workHeroDescriptions.forEach((desc, index) => {
        // Add delay so descriptions animate after title
        setTimeout(() => {
            new TextReveal(desc, { type: 'words', staggerDelay: 40, animationDuration: 500 });
        }, 400 + (index * 200));
    });

    // About page title
    const aboutTitle = document.querySelector('.finding-title');
    if (aboutTitle) {
        new TextReveal(aboutTitle, { type: 'chars', staggerDelay: 25, animationDuration: 500 });
    }

    // Footer heading
    const footerHeading = document.querySelector('.footer-heading');
    if (footerHeading) {
        // Use Intersection Observer to trigger when visible
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    new TextReveal(footerHeading, { type: 'words', staggerDelay: 60, animationDuration: 600 });
                    observer.disconnect();
                }
            });
        }, { threshold: 0.5 });
        observer.observe(footerHeading);
    }

    console.log('Text reveal initialized');
}


// ===== 4. CUSTOM CURSOR =====
// Distinctive cursor that changes contextually

class CustomCursor {
    constructor() {
        this.cursor = null;
        this.cursorDot = null;
        this.cursorRing = null;
        this.isHovering = false;
        this.isClicking = false;
        this.currentX = 0;
        this.currentY = 0;
        this.targetX = 0;
        this.targetY = 0;

        this.onMouseMove = this.onMouseMove.bind(this);
        this.onMouseDown = this.onMouseDown.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this);
        this.animate = this.animate.bind(this);

        this.init();
    }

    init() {
        // Skip on touch devices
        if ('ontouchstart' in window || window.innerWidth < 768) {
            return;
        }

        this.createCursor();
        this.addEventListeners();
        this.animate();

        // Hide default cursor
        document.body.classList.add('custom-cursor-active');

        console.log('Custom cursor initialized');
    }

    createCursor() {
        // Main cursor container
        this.cursor = document.createElement('div');
        this.cursor.className = 'custom-cursor';

        // Inner dot
        this.cursorDot = document.createElement('div');
        this.cursorDot.className = 'cursor-dot';

        // Outer ring
        this.cursorRing = document.createElement('div');
        this.cursorRing.className = 'cursor-ring';

        this.cursor.appendChild(this.cursorDot);
        this.cursor.appendChild(this.cursorRing);
        document.body.appendChild(this.cursor);
    }

    addEventListeners() {
        document.addEventListener('mousemove', this.onMouseMove);
        document.addEventListener('mousedown', this.onMouseDown);
        document.addEventListener('mouseup', this.onMouseUp);

        // Hover states for interactive elements
        const interactiveElements = document.querySelectorAll(
            'a, button, .project-card, .filter-pill, .footer-button, .nav-link, .bento-item, input, textarea'
        );

        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => this.setHoverState(true, el));
            el.addEventListener('mouseleave', () => this.setHoverState(false, el));
        });

        // Hide cursor when leaving window
        document.addEventListener('mouseleave', () => {
            this.cursor.style.opacity = '0';
        });

        document.addEventListener('mouseenter', () => {
            this.cursor.style.opacity = '1';
        });
    }

    onMouseMove(e) {
        this.targetX = e.clientX;
        this.targetY = e.clientY;
    }

    onMouseDown() {
        this.isClicking = true;
        this.cursor.classList.add('clicking');
    }

    onMouseUp() {
        this.isClicking = false;
        this.cursor.classList.remove('clicking');
    }

    setHoverState(isHovering, element) {
        this.isHovering = isHovering;

        if (isHovering) {
            this.cursor.classList.add('hovering');

            // Special states for different element types
            if (element.classList.contains('project-card')) {
                this.cursor.classList.add('cursor-view');
            } else if (element.tagName === 'A' || element.tagName === 'BUTTON') {
                this.cursor.classList.add('cursor-pointer');
            }
        } else {
            this.cursor.classList.remove('hovering', 'cursor-view', 'cursor-pointer');
        }
    }

    animate() {
        // Smooth follow with easing
        const ease = 0.15;

        this.currentX += (this.targetX - this.currentX) * ease;
        this.currentY += (this.targetY - this.currentY) * ease;

        this.cursor.style.transform = `translate(${this.currentX}px, ${this.currentY}px)`;

        requestAnimationFrame(this.animate);
    }
}

function initCustomCursor() {
    new CustomCursor();
}


// ===== INITIALIZATION =====
// Initialize all interactive features

function initInteractions() {
    // Wait for DOM to be fully ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', runInit);
    } else {
        runInit();
    }
}

function runInit() {
    // Small delay to ensure other scripts have loaded
    setTimeout(() => {
        initCustomCursor();
        initMagneticButtons();
        initTextReveal();

        // Initialize tilt cards after content is loaded (for dynamically rendered cards)
        setTimeout(initTiltCards, 100);

        // Re-initialize when new content is added (e.g., after filtering)
        observeContentChanges();
    }, 50);
}

// Re-initialize effects when content changes (e.g., after filtering projects)
function observeContentChanges() {
    const projectsContainer = document.querySelector('.projects');
    if (!projectsContainer) return;

    const observer = new MutationObserver((mutations) => {
        mutations.forEach(mutation => {
            if (mutation.addedNodes.length > 0) {
                // Re-initialize tilt cards for new project cards
                setTimeout(initTiltCards, 100);

                // Re-attach hover listeners for custom cursor
                const newInteractiveElements = projectsContainer.querySelectorAll(
                    'a, button, .project-card, .release-notes-link'
                );
                newInteractiveElements.forEach(el => {
                    el.addEventListener('mouseenter', () => {
                        document.querySelector('.custom-cursor')?.classList.add('hovering');
                        if (el.classList.contains('project-card')) {
                            document.querySelector('.custom-cursor')?.classList.add('cursor-view');
                        }
                    });
                    el.addEventListener('mouseleave', () => {
                        document.querySelector('.custom-cursor')?.classList.remove('hovering', 'cursor-view');
                    });
                });

                // Re-initialize magnetic buttons for new elements
                const newMagneticElements = projectsContainer.querySelectorAll('.release-notes-link');
                newMagneticElements.forEach(el => {
                    if (!('ontouchstart' in window)) {
                        new MagneticButton(el);
                    }
                });
            }
        });
    });

    observer.observe(projectsContainer, { childList: true, subtree: true });
}

// Start initialization
initInteractions();

// Export for potential external use
window.PortfolioInteractions = {
    initMagneticButtons,
    initTiltCards,
    initTextReveal,
    initCustomCursor,
    MagneticButton,
    TiltCard,
    TextReveal,
    CustomCursor
};
