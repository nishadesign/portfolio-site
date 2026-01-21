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
        
        // Update page title and meta tags
        updateMetaTags(project, data.profile);
        
        // Render project content with navigation
        renderProject(project, projectIndex, data.projects);
        
        // Update footer with profile data
        updateFooter(data.profile);

    } catch (error) {
        console.error('Error loading project:', error);
        showError('Error loading project');
    }
}

// Render the full project page
function renderProject(project, projectIndex, allProjects) {
    const container = document.getElementById('project-content');
    const details = project.details;

    // Helper to format multi-line content
    const formatContent = (text) => text ? text.replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br>') : '';

    // Calculate previous and next projects
    const prevProject = projectIndex > 0 ? allProjects[projectIndex - 1] : null;
    const nextProject = projectIndex < allProjects.length - 1 ? allProjects[projectIndex + 1] : null;
    
    container.innerHTML = `
        <!-- Project Hero -->
        <section class="project-hero">
            <div class="project-meta">
                <span>${project.company}</span>
                <span>${project.sector}</span>
            </div>
            <h1 class="project-title">${project.title}</h1>
            <p class="project-subtitle">${formatContent(details.tagline)}</p>
            <div class="project-hero-image">
                ${project.heroVideo 
                    ? `<video autoplay loop muted playsinline preload="auto">
                        <source src="${encodeURI(project.heroVideo)}" type="video/mp4">
                       </video>`
                    : project.heroImage 
                        ? `<img src="${project.heroImage}" alt="${project.title}">`
                        : `<span class="placeholder-text">Hero Image/Video</span>`
                }
            </div>
        </section>

        <!-- Project Details -->
        <section class="project-details">
            <!-- Sidebar -->
            <aside class="project-sidebar">
                ${details.role ? `
                <div class="detail-group">
                    <div class="detail-label">Role</div>
                    <div class="detail-value">${formatContent(details.role)}</div>
                </div>
                ` : ''}
                
                ${details.timeline ? `
                <div class="detail-group">
                    <div class="detail-label">Timeline</div>
                    <div class="detail-value">${formatContent(details.timeline)}</div>
                </div>
                ` : ''}
                
                ${details.teamDescription ? `
                <div class="detail-group">
                    <div class="detail-label">Team</div>
                    <div class="detail-value">${formatContent(details.teamDescription)}</div>
                </div>
                ` : ''}
                
                ${details.responsibilities ? `
                <div class="detail-group">
                    <div class="detail-label">Responsibilities</div>
                    <div class="detail-tags">
                        ${details.responsibilities.split(',').map(r => 
                            `<span class="detail-tag">${r.trim()}</span>`
                        ).join('')}
                    </div>
                </div>
                ` : ''}
                
                ${details.tools ? `
                <div class="detail-group">
                    <div class="detail-label">Tools</div>
                    <div class="detail-value">${formatContent(details.tools)}</div>
                </div>
                ` : ''}
            </aside>

            <!-- Main Content -->
            <div class="project-content">
                ${details.overview ? `
                <div class="content-section">
                    <div class="section-label">${details.overviewLabel || 'Overview'}</div>
                    ${details.overviewTitle ? `<h2>${details.overviewTitle}</h2>` : ''}
                    <p>${formatContent(details.overview)}</p>
                </div>
                ` : ''}
                
                ${details.challenge ? `
                <div class="content-section">
                    <div class="section-label">${details.challengeLabel || 'The Challenge'}</div>
                    ${details.challengeTitle ? `<h2>${details.challengeTitle}</h2>` : ''}
                    <p>${formatContent(details.challenge)}</p>
                </div>
                ` : ''}
                
                ${details.discovery ? `
                <div class="content-section">
                    <div class="section-label">${details.discoveryLabel || 'Discovery'}</div>
                    ${details.discoveryTitle ? `<h2>${details.discoveryTitle}</h2>` : ''}
                    <p>${formatContent(details.discovery)}</p>
                </div>
                ` : ''}
                
                ${details.process || details.processSteps ? `
                <div class="content-section">
                    <div class="section-label">${details.processLabel || 'Design Process'}</div>
                    ${details.processTitle ? `<h2>${details.processTitle}</h2>` : ''}
                    ${details.process && !details.processSteps ? `<p>${formatContent(details.process)}</p>` : ''}
                    ${details.processSteps && details.processSteps.length > 0 ? `
                    <div class="process-steps">
                        ${details.processSteps.map((step, index) => `
                        <div class="process-step">
                            <div class="step-number">${String(index + 1).padStart(2, '0')}</div>
                            <div class="step-content">
                                <h3>${step.title}</h3>
                                <p>${formatContent(step.description)}</p>
                            </div>
                        </div>
                        `).join('')}
                    </div>
                    ` : ''}
                </div>
                ` : ''}
                
                ${details.solution ? `
                <div class="content-section">
                    <div class="section-label">${details.solutionLabel || 'The Solution'}</div>
                    ${details.solutionTitle ? `<h2>${details.solutionTitle}</h2>` : ''}
                    <p>${formatContent(details.solution)}</p>
                </div>
                ` : ''}
                
                ${details.impact ? `
                <div class="content-section">
                    <div class="section-label">${details.impactLabel || 'Results'}</div>
                    ${details.impactTitle ? `<h2>${details.impactTitle}</h2>` : ''}
                    <p>${formatContent(details.impact)}</p>
                </div>
                ` : ''}
                
                ${details.learnings ? `
                <div class="content-section">
                    <div class="section-label">${details.learningsLabel || 'Reflection'}</div>
                    ${details.learningsTitle ? `<h2>${details.learningsTitle}</h2>` : ''}
                    <p>${formatContent(details.learnings)}</p>
                </div>
                ` : ''}
            </div>
        </section>

        <!-- Custom Media Sections -->
        ${details.customSections && details.customSections.length > 0 ? details.customSections.map(section => `
            <section class="custom-section-with-media project-section">
                ${section.title || section.content ? `
                <div class="section-media-header">
                    ${section.title ? `<h2 class="section-heading">${section.title}</h2>` : ''}
                    ${section.content ? `
                    <div class="section-content">
                        <p>${formatContent(section.content)}</p>
                    </div>
                    ` : ''}
                </div>
                ` : ''}
                
                ${section.video ? `
                <div class="section-media-container">
                    <video autoplay loop muted playsinline>
                        <source src="${encodeURI(section.video)}" type="video/mp4">
                    </video>
                </div>
                ` : section.image ? `
                <div class="section-media-container">
                    <img src="${section.image}" alt="${section.title || 'Project image'}">
                </div>
                ` : ''}
            </section>
        `).join('') : ''}

        <!-- Project Navigation -->
        ${prevProject || nextProject ? `
        <section class="project-navigation">
            <div class="project-nav-container">
                ${prevProject ? `
                <a href="project.html?id=${prevProject.id}" class="project-nav-card project-nav-prev">
                    <div class="nav-label">
                        <span class="nav-arrow">←</span>
                        <span>Previous Project</span>
                    </div>
                    <h3 class="nav-title">${prevProject.title}</h3>
                    <p class="nav-meta">${prevProject.company}${prevProject.date ? ` · ${prevProject.date}` : ''}</p>
                </a>
                ` : '<div class="project-nav-spacer"></div>'}

                ${nextProject ? `
                <a href="project.html?id=${nextProject.id}" class="project-nav-card project-nav-next">
                    <div class="nav-label">
                        <span>Next Project</span>
                        <span class="nav-arrow">→</span>
                    </div>
                    <h3 class="nav-title">${nextProject.title}</h3>
                    <p class="nav-meta">${nextProject.company}${nextProject.date ? ` · ${nextProject.date}` : ''}</p>
                </a>
                ` : '<div class="project-nav-spacer"></div>'}
            </div>
        </section>
        ` : ''}

        <!-- Back to All Projects -->
        <section class="back-to-projects">
            <a href="work.html" class="back-button">
                <span class="back-arrow">←</span>
                <span>Back to all case studies</span>
            </a>
        </section>
    `;
}

// Update footer with profile data
function updateFooter(profile) {
    const footer = document.getElementById('site-footer');
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

// Update meta tags for SEO
function updateMetaTags(project, profile) {
    const baseUrl = 'https://nisha-rastogi.com';
    const projectUrl = `${baseUrl}/project.html?id=${project.id}`;
    const description = project.description || `Case study: ${project.title} by ${profile.name} - Product Designer specializing in AI & Platform UX.`;
    const imageUrl = project.coverImage ? `${baseUrl}/${project.coverImage}` : `${baseUrl}/assets/profile image 1.jpg`;
    
    // Update title
    document.title = `${project.title} · ${profile.name}`;
    
    // Update or create meta tags
    const updateMeta = (name, content, isProperty = false) => {
        const selector = isProperty ? `meta[property="${name}"]` : `meta[name="${name}"]`;
        let meta = document.querySelector(selector);
        if (!meta) {
            meta = document.createElement('meta');
            if (isProperty) {
                meta.setAttribute('property', name);
            } else {
                meta.setAttribute('name', name);
            }
            document.head.appendChild(meta);
        }
        meta.setAttribute('content', content);
    };
    
    // Primary meta tags
    updateMeta('title', `${project.title} · ${profile.name}`);
    updateMeta('description', description);
    updateMeta('keywords', `${project.title}, ${profile.name}, Product Designer, UX Designer, Case Study, ${project.category || ''}`);
    
    // Canonical URL
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
        canonical = document.createElement('link');
        canonical.setAttribute('rel', 'canonical');
        document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', projectUrl);
    
    // Open Graph tags
    updateMeta('og:type', 'article', true);
    updateMeta('og:url', projectUrl, true);
    updateMeta('og:title', `${project.title} · ${profile.name}`, true);
    updateMeta('og:description', description, true);
    updateMeta('og:image', imageUrl, true);
    
    // Twitter tags
    updateMeta('twitter:card', 'summary_large_image', true);
    updateMeta('twitter:url', projectUrl, true);
    updateMeta('twitter:title', `${project.title} · ${profile.name}`, true);
    updateMeta('twitter:description', description, true);
    updateMeta('twitter:image', imageUrl, true);
    
    // Add structured data for Article
    let structuredData = document.querySelector('script[type="application/ld+json"]');
    if (!structuredData) {
        structuredData = document.createElement('script');
        structuredData.setAttribute('type', 'application/ld+json');
        document.head.appendChild(structuredData);
    }
    
    const articleData = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": project.title,
        "description": description,
        "image": imageUrl,
        "author": {
            "@type": "Person",
            "name": profile.name,
            "url": baseUrl,
            "logo": `${baseUrl}/assets/Nisha-Rastogi-logo.png`,
            "sameAs": [
                profile.social?.linkedin,
                profile.social?.substack
            ].filter(Boolean)
        },
        "publisher": {
            "@type": "Organization",
            "name": profile.name,
            "logo": {
                "@type": "ImageObject",
                "url": `${baseUrl}/assets/Nisha-Rastogi-logo.png`
            }
        },
        "datePublished": project.date || new Date().toISOString(),
        "dateModified": project.date || new Date().toISOString()
    };
    
    structuredData.textContent = JSON.stringify(articleData);
    
    // Add WebSite schema with logo for better search result display
    let websiteSchema = document.querySelector('script[type="application/ld+json"][data-schema="website"]');
    if (!websiteSchema) {
        websiteSchema = document.createElement('script');
        websiteSchema.setAttribute('type', 'application/ld+json');
        websiteSchema.setAttribute('data-schema', 'website');
        document.head.appendChild(websiteSchema);
    }
    
    const websiteData = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": profile.name,
        "url": baseUrl,
        "logo": `${baseUrl}/assets/Nisha-Rastogi-logo.png`
    };
    
    websiteSchema.textContent = JSON.stringify(websiteData);
}

// Show error state
function showError(message) {
    const container = document.getElementById('project-content');
    container.innerHTML = `
        <div class="error-state">
            <h1>Oops!</h1>
            <p>${message}</p>
            <a href="work.html" class="back-home">← Back to work</a>
        </div>
    `;
}

// Initialize scroll animations
function initScrollAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -100px 0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Observe all animatable elements
    const animatableElements = document.querySelectorAll('.content-section');
    
    animatableElements.forEach((el) => {
        observer.observe(el);
    });
}

// Initialize scroll progress bar
function initScrollProgress() {
    const progressBar = document.querySelector('.scroll-progress');
    if (!progressBar) return;

    window.addEventListener('scroll', () => {
        const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (window.scrollY / windowHeight) * 100;
        progressBar.style.width = scrolled + '%';
    });
}

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    initProjectPage();
    initScrollProgress();
    // Delay animations slightly to allow content to render
    setTimeout(() => {
        initScrollAnimations();
    }, 100);
});
