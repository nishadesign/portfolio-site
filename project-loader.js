// Project Detail Page - Data Loader

const DATA_PATH = 'data/projects.json';

// Get project ID from URL
function getProjectId() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
}

// Initialize project page
async function initProjectPage() {
    try {
        const response = await fetch(DATA_PATH);
        const data = await response.json();
        
        const projectId = getProjectId();
        const project = data.projects.find(p => p.id === projectId);
        const projectIndex = data.projects.findIndex(p => p.id === projectId);
        
        if (!project) {
            showError('Project not found');
            return;
        }
        
        // Update page title
        document.title = `${project.title} · ${data.profile.name}`;
        
        // Get next project for navigation
        const nextProject = data.projects[projectIndex + 1] || data.projects[0];
        
        // Render project content
        renderProject(project, nextProject);
        
        // Update footer with profile data
        updateFooter(data.profile);
        
    } catch (error) {
        console.error('Error loading project:', error);
        showError('Error loading project');
    }
}

// Render the full project page
function renderProject(project, nextProject) {
    const container = document.getElementById('project-content');
    const details = project.details;
    
    container.innerHTML = `
        <!-- Hero Section -->
        <header class="project-hero">
            <div class="hero-content">
                <span class="project-category">${project.sector}</span>
                <h1 class="project-title">${project.title}</h1>
                <p class="project-tagline">${details.tagline}</p>
            </div>
            <div class="hero-image">
                ${project.heroVideo 
                    ? `<video autoplay loop muted playsinline preload="auto">
                        <source src="${encodeURI(project.heroVideo)}" type="video/mp4">
                        Your browser does not support the video tag.
                       </video>`
                    : project.heroImage 
                        ? `<img src="${project.heroImage}" alt="${project.title}">`
                        : `<div class="hero-image-placeholder"><span>Hero Image</span></div>`
                }
            </div>
        </header>

        <!-- Overview Section -->
        ${details.overview ? `
        <section class="project-overview">
            <h2 class="section-heading">${details.overviewHeader || 'Overview'}</h2>
            <div class="section-content">
                <p>${details.overview.replace(/\n/g, '<br>')}</p>
            </div>
        </section>
        ` : ''}

        <!-- Project Credits -->
        <section class="project-credits">
            <div class="credits-grid">
                <div class="credit-item">
                    <h4 class="credit-label">When</h4>
                    <p class="credit-value">${project.year}</p>
                </div>
                <div class="credit-item">
                    <h4 class="credit-label">For</h4>
                    <p class="credit-value">${project.company}</p>
                </div>
                <div class="credit-item">
                    <h4 class="credit-label">Sector</h4>
                    <p class="credit-value">${project.sector}</p>
                </div>
                <div class="credit-item">
                    <h4 class="credit-label">Discipline</h4>
                    <p class="credit-value">${project.category}</p>
                </div>
                ${renderTeamCredits(details.team)}
            </div>
        </section>

        <!-- Divider - only show if there's content below -->
        ${details.challenge || details.problem || details.goals || details.successMetrics ? `
        <hr class="section-divider">
        ` : ''}

        <!-- Challenge Section -->
        ${details.challenge ? `
        <section class="project-section">
            <h2 class="section-heading">${details.challengeHeader || 'Challenge'}</h2>
            <div class="section-content">
                <p>${details.challenge.replace(/\n/g, '<br>')}</p>
            </div>
        </section>
        ` : ''}

        <!-- Problem Section -->
        ${details.problem ? `
        <section class="project-section">
            <h2 class="section-heading">${details.problemHeader || 'Problem'}</h2>
            <div class="section-content">
                <p>${details.problem.replace(/\n/g, '<br>')}</p>
            </div>
            ${details.problemImage ? `
            <div class="section-image">
                <img src="${details.problemImage}" alt="${details.problemHeader || 'Problem'} illustration">
            </div>
            ` : ''}
        </section>
        ` : ''}

        <!-- Goals & Metrics Section -->
        ${details.goals || details.successMetrics ? `
        <section class="project-section goals-metrics-section">
            <div class="goals-metrics-grid">
                ${details.goals ? `
                <div class="goals-card">
                    <div class="card-icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="12" cy="12" r="10"/>
                            <circle cx="12" cy="12" r="6"/>
                            <circle cx="12" cy="12" r="2"/>
                        </svg>
                    </div>
                    <h3 class="card-heading">${details.goalsHeader || 'Goals'}</h3>
                    <div class="card-content">
                        <p>${details.goals.replace(/\n/g, '<br>')}</p>
                    </div>
                </div>
                ` : ''}
                ${details.successMetrics ? `
                <div class="metrics-card">
                    <div class="card-icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
                        </svg>
                    </div>
                    <h3 class="card-heading">${details.successMetricsHeader || 'Success Metrics'}</h3>
                    <div class="card-content">
                        <p>${details.successMetrics.replace(/\n/g, '<br>')}</p>
                    </div>
                </div>
                ` : ''}
            </div>
        </section>
        ` : ''}

        <!-- Divider before Final Designs - only show if there's content -->
        ${details.solution || details.solutionItems || details.customSections ? `
        <hr class="section-divider">
        ` : ''}

        <!-- Solution / Final Designs Section -->
        ${details.solution || details.solutionItems ? `
        <section class="project-section final-designs-section">
            <h2 class="section-heading">${details.solutionHeader || 'Final Designs'}</h2>
            ${details.solution ? `
            <div class="section-content">
                <p>${details.solution.replace(/\n/g, '<br>')}</p>
            </div>
            ` : ''}
            
            ${details.solutionItems ? details.solutionItems.map(item => `
            <div class="solution-item-block">
                <h3 class="solution-item-title">${item.title}</h3>
                <p class="solution-item-description">${item.description.replace(/\n/g, '<br>')}</p>
                ${item.video ? `
                <div class="solution-item-video">
                    <video autoplay loop muted playsinline>
                        <source src="${encodeURI(item.video)}" type="video/mp4">
                    </video>
                </div>
                ` : ''}
            </div>
            `).join('') : ''}
        </section>
        ` : ''}

        <!-- Custom Subsections under Final Designs -->
        ${details.customSections ? details.customSections.map(section => `
        ${section.video ? `
        <div class="project-subsection custom-section custom-section-with-media">
            <div class="section-media-container">
                <div class="section-media-header">
                    <h3 class="subsection-heading">${section.title}</h3>
                    <div class="section-content">
                        <p>${section.content.replace(/\n/g, '<br>')}</p>
                    </div>
                </div>
                <video autoplay loop muted playsinline preload="auto">
                    <source src="${encodeURI(section.video)}" type="${section.video.endsWith('.mov') ? 'video/quicktime' : 'video/mp4'}">
                    Your browser does not support the video tag.
                </video>
            </div>
        </div>
        ` : section.gallery ? `
        <div class="project-subsection custom-section custom-section-with-media">
            <div class="section-media-container">
                <div class="section-media-header">
                    <h3 class="subsection-heading">${section.title}</h3>
                    <div class="section-content">
                        <p>${section.content.replace(/\n/g, '<br>')}</p>
                    </div>
                </div>
                <div class="auto-scroll-gallery">
                    <div class="gallery-track">
                        ${section.gallery.map(img => `<img src="${img}" alt="${section.title}">`).join('')}
                        ${section.gallery.map(img => `<img src="${img}" alt="${section.title}">`).join('')}
                    </div>
                </div>
            </div>
        </div>
        ` : section.image ? `
        <div class="project-subsection custom-section custom-section-with-media">
            <div class="section-media-container">
                <div class="section-media-header">
                    <h3 class="subsection-heading">${section.title}</h3>
                    <div class="section-content">
                        <p>${section.content.replace(/\n/g, '<br>')}</p>
                    </div>
                </div>
                <img src="${section.image}" alt="${section.title}">
            </div>
        </div>
        ` : `
        <div class="project-subsection custom-section custom-section-with-media">
            <div class="section-media-header">
                <h3 class="subsection-heading">${section.title}</h3>
                <div class="section-content">
                    <p>${section.content.replace(/\n/g, '<br>')}</p>
                </div>
            </div>
        </div>
        `}
        `).join('') : ''}

        <!-- Divider before Next Project -->
        <hr class="section-divider">

        <!-- Next Project -->
        <section class="next-project">
            <a href="${nextProject.externalUrl ? nextProject.externalUrl : `project.html?id=${nextProject.id}`}" class="next-project-link" ${nextProject.externalUrl ? 'target="_blank"' : ''}>
                <div class="next-project-content">
                    <span class="next-label">Next Project</span>
                    <h3 class="next-title">${nextProject.title}</h3>
                    <p class="next-description">${nextProject.description.substring(0, 100)}...</p>
                </div>
                <div class="next-project-image">
                    ${nextProject.coverImage 
                        ? `<img src="${nextProject.coverImage}" alt="${nextProject.title}" class="next-cover-img">`
                        : nextProject.coverVideo 
                            ? `<video autoplay loop muted playsinline class="next-cover-video">
                                <source src="${encodeURI(nextProject.coverVideo)}" type="video/mp4">
                               </video>`
                            : nextProject.coverVideos && nextProject.coverVideos.length > 0
                                ? `<video autoplay loop muted playsinline class="next-cover-video">
                                    <source src="${encodeURI(nextProject.coverVideos[0])}" type="video/mp4">
                                   </video>`
                                : `<div class="next-image-placeholder" style="background: linear-gradient(135deg, ${nextProject.previewColors[0]} 0%, ${nextProject.previewColors[1]} 100%)">
                                    <span>Preview</span>
                                   </div>`
                    }
                </div>
            </a>
        </section>
    `;
    
    // Initialize carousels after rendering
    initCarousels();
}

// Initialize image carousels
function initCarousels() {
    const carousels = document.querySelectorAll('[data-carousel]');
    
    carousels.forEach(carousel => {
        const track = carousel.querySelector('.carousel-track');
        const slides = carousel.querySelectorAll('.carousel-slide');
        const dots = carousel.querySelectorAll('.carousel-dot');
        const prevBtn = carousel.querySelector('.carousel-btn.prev');
        const nextBtn = carousel.querySelector('.carousel-btn.next');
        
        let currentIndex = 0;
        const totalSlides = slides.length;
        
        function goToSlide(index) {
            // Wrap around
            if (index < 0) index = totalSlides - 1;
            if (index >= totalSlides) index = 0;
            
            currentIndex = index;
            
            // Update slides
            slides.forEach((slide, i) => {
                slide.classList.toggle('active', i === currentIndex);
            });
            
            // Update dots
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === currentIndex);
            });
            
            // Move track
            track.style.transform = `translateX(-${currentIndex * 100}%)`;
        }
        
        // Event listeners
        prevBtn.addEventListener('click', () => goToSlide(currentIndex - 1));
        nextBtn.addEventListener('click', () => goToSlide(currentIndex + 1));
        
        dots.forEach((dot, i) => {
            dot.addEventListener('click', () => goToSlide(i));
        });
        
        // Keyboard navigation
        carousel.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') goToSlide(currentIndex - 1);
            if (e.key === 'ArrowRight') goToSlide(currentIndex + 1);
        });
    });
}


// Render team credits
function renderTeamCredits(team) {
    if (!team) return '';
    
    const roles = ['product', 'design', 'research', 'engineering'];
    const labels = {
        product: 'Product',
        design: 'Design',
        research: 'Research',
        engineering: 'Engineering'
    };
    
    return roles
        .filter(role => team[role] && team[role].length > 0)
        .map(role => `
            <div class="credit-item">
                <h4 class="credit-label">${labels[role]}</h4>
                <p class="credit-value">${team[role].join('<br>')}</p>
            </div>
        `).join('');
}

// Update footer with profile data
function updateFooter(profile) {
    const footer = document.getElementById('site-footer');
    if (!footer) return;
    
    // Build footer links dynamically (only show links that exist)
    const footerLinks = [];
    if (profile.social?.linkedin) footerLinks.push(`<a href="${profile.social.linkedin}" class="footer-link" target="_blank" rel="noopener">LinkedIn</a>`);
    if (profile.resume) footerLinks.push(`<a href="${profile.resume}" class="footer-link" target="_blank" rel="noopener">Resume</a>`);
    if (profile.social?.substack) footerLinks.push(`<a href="${profile.social.substack}" class="footer-link" target="_blank" rel="noopener">Substack</a>`);
    
    footer.innerHTML = `
        <a href="mailto:${profile.email}" class="footer-email">${profile.email}</a>
        <div class="footer-links">
            ${footerLinks.join('')}
        </div>
    `;
}

// Show error state
function showError(message) {
    const container = document.getElementById('project-content');
    container.innerHTML = `
        <div class="error-state">
            <h1>Oops!</h1>
            <p>${message}</p>
            <a href="index.html" class="back-home">← Back to home</a>
        </div>
    `;
}

// Initialize scroll animations
function initScrollAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -50px 0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all animatable elements
    const animatableElements = document.querySelectorAll('.project-section, .project-overview, .project-credits, .goals-metrics-section, .custom-section-with-media, .next-project');
    
    animatableElements.forEach((el, index) => {
        el.style.transitionDelay = `${index * 0.05}s`;
        observer.observe(el);
    });
}

// Parallax disabled to prevent content overlap issues
function initParallax() {
    // Hero image and videos now stay fixed in position
}

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    initProjectPage();
    // Delay animations slightly to allow content to render
    setTimeout(() => {
        initScrollAnimations();
        initParallax();
    }, 100);
});

