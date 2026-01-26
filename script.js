// Portfolio - Data-driven rendering

const DATA_PATH = 'data/projects.json';

// Store all projects globally for filtering
let allProjects = [];
let currentFilter = 'all';

// Fetch and render portfolio data
async function initPortfolio() {
    try {
        const response = await fetch(DATA_PATH);
        const data = await response.json();
        
        // Store all projects
        allProjects = data.projects;
        
        // Render projects
        renderProjects(allProjects);
        
        // Initialize filter pills
        initFilterPills();
        
        // Render footer
        renderFooter(data.profile);
        
        // Initialize animations after content loads
        initAnimations();
        
    } catch (error) {
        console.error('Error loading portfolio data:', error);
    }
}

// Initialize filter pills
function initFilterPills() {
    const filterPills = document.querySelectorAll('.filter-pill');
    
    filterPills.forEach(pill => {
        pill.addEventListener('click', () => {
            // Update active state
            filterPills.forEach(p => p.classList.remove('active'));
            pill.classList.add('active');
            
            // Get filter value and filter projects
            currentFilter = pill.dataset.filter;
            filterProjects(currentFilter);
        });
    });
}

// Filter and render projects
function filterProjects(filter) {
    let filteredProjects;
    
    if (filter === 'all') {
        filteredProjects = allProjects;
    } else {
        filteredProjects = allProjects.filter(project => project.filterTag === filter);
    }
    
    renderProjects(filteredProjects);
    initAnimations(); // Re-initialize animations for new cards
}

// Render the profile/header section
function renderProfile(profile) {
    const profileSection = document.querySelector('.profile');
    if (!profileSection) return;
    
    const previousText = profile.previousCompanies.join(', ');
    
    // Use profile image if available, otherwise show initials placeholder
    const photoHTML = profile.profileImage 
        ? `<img src="${profile.profileImage}" alt="${profile.name}">`
        : `<div class="photo-placeholder">${profile.initials}</div>`;
    
    profileSection.innerHTML = `
        <div class="profile-photo">
            ${photoHTML}
        </div>
        <div class="profile-info">
            <h1 class="name">${profile.name}</h1>
            <p class="title">${profile.title} <span class="highlight">${profile.company}</span></p>
            <p class="previous">Previously at ${previousText}</p>
        </div>
    `;
}

// Render all project cards
function renderProjects(projects) {
    const projectsSection = document.querySelector('.projects');
    if (!projectsSection) return;
    
    projectsSection.innerHTML = projects.map((project, index) => `
        <article class="project-card" data-project-id="${project.id}" data-filter-tag="${project.filterTag || ''}">
            <a href="${project.externalUrl || `project.html?id=${project.id}`}" class="project-cover-link"${project.externalUrl ? ' target="_blank" rel="noopener noreferrer"' : ''}>
            ${project.coverVideos && project.coverVideos.length > 0 ? `
                <div class="project-cover-grid">
                    ${project.coverVideos.map(video => `
                        <div class="project-cover-item">
                            <video autoplay loop muted playsinline>
                                <source src="${encodeURI(video)}" type="video/mp4">
                            </video>
                        </div>
                    `).join('')}
                </div>
            ` : project.coverVideo ? `
                <div class="project-cover">
                    <video autoplay loop muted playsinline>
                        <source src="${encodeURI(project.coverVideo)}" type="video/mp4">
                    </video>
                </div>
            ` : project.coverImage ? `
                <div class="project-cover">
                    <img src="${project.coverImage}" alt="${project.title}">
                </div>
            ` : `
                <div class="project-preview">
                    <div class="preview-card" style="background: ${project.previewColors[0]}">
                        <div class="preview-label">${project.previewLabels[0]}</div>
                    </div>
                    <div class="preview-card" style="background: ${project.previewColors[1]}">
                        <div class="preview-label">${project.previewLabels[1]}</div>
                    </div>
                </div>
            `}
            </a>
            <div class="project-content">
                <a href="${project.externalUrl || `project.html?id=${project.id}`}" class="project-header-link"${project.externalUrl ? ' target="_blank" rel="noopener noreferrer"' : ''}>
                    <h2 class="project-title">${project.title}<span class="title-arrow">↗</span></h2>
                </a>
                <p class="project-meta">
                    ${project.company ? `<span>${project.company}</span>` : ''}
                    ${project.date ? `<span>${project.date}</span>` : ''}
                    ${project.filterTag ? `<span>${project.filterTag}</span>` : ''}
                </p>
                <p class="project-description">${project.description}</p>
                ${project.releaseNotes ? `<a href="${project.releaseNotes}" class="release-notes-link" target="_blank" rel="noopener">Release Notes</a>` : `<a href="${project.externalUrl || `project.html?id=${project.id}`}" class="release-notes-link"${project.externalUrl ? ' target="_blank" rel="noopener noreferrer"' : ''}>View Case Study</a>`}
            </div>
        </article>
    `).join('');
}

// Render footer with profile data
function renderFooter(profile) {
    const footer = document.querySelector('.footer');
    if (!footer) return;
    
    // Build footer buttons
    const buttons = [];
    
    // LinkedIn button
    if (profile.social?.linkedin) {
        buttons.push(`
            <a href="${profile.social.linkedin}" class="footer-button" target="_blank" rel="noopener">
                <span class="footer-button-icon">💼</span>
                <span>LinkedIn</span>
            </a>
        `);
    }
    
    // Resume button
    if (profile.resume) {
        buttons.push(`
            <a href="${profile.resume}" class="footer-button" target="_blank" rel="noopener">
                <span class="footer-button-icon">📄</span>
                <span>Resume</span>
            </a>
        `);
    }
    
    // Substack button
    if (profile.social?.substack) {
        buttons.push(`
            <a href="${profile.social.substack}" class="footer-button" target="_blank" rel="noopener">
                <span class="footer-button-icon">✍️</span>
                <span>Substack</span>
            </a>
        `);
    }
    
    const currentYear = new Date().getFullYear();
    
    footer.innerHTML = `
        <h2 class="footer-heading">Let's Work Together</h2>
        <p class="footer-subtext">I'm always interested in hearing about new opportunities and collaborations.</p>
        <div class="footer-buttons">
            ${buttons.join('')}
        </div>
        <p class="footer-copyright">© ${currentYear} Nisha Rastogi. Designed & built with care.</p>
    `;
}

// Initialize scroll animations
function initAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -50px 0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                entry.target.classList.add('in-view');
            }
        });
    }, observerOptions);

    // Observe project cards with scroll animation
    document.querySelectorAll('.project-card').forEach((card, index) => {
        card.classList.add('scroll-animate');
        card.style.transitionDelay = `${index * 0.1}s`;
        observer.observe(card);
    });
    
    // Add scroll animation to filter pills
    document.querySelectorAll('.filter-pill').forEach((pill, index) => {
        pill.classList.add('scroll-animate');
        pill.style.transitionDelay = `${index * 0.05}s`;
        observer.observe(pill);
    });
    
    // Animate footer
    const footer = document.querySelector('.footer');
    if (footer) {
        footer.classList.add('scroll-animate');
        observer.observe(footer);
    }

    // Add hover effects to preview cards
    document.querySelectorAll('.preview-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'scale(1.03)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'scale(1)';
        });
    });
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    // Check if we're on the homepage (has .projects section)
    if (document.querySelector('.projects')) {
        initPortfolio();
    }
    
    // Add loading state handling
    window.addEventListener('load', () => {
        document.body.classList.add('loaded');
    });
});

// Console greeting
console.log('%c👋 Hello fellow designer/developer!', 'font-size: 16px; font-weight: bold;');
console.log('%cThis portfolio was built with love and clean code.', 'font-size: 12px; color: #666;');
