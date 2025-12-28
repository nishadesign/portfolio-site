# Designer Portfolio Template

A beautiful, modern portfolio template for UX/Product designers. Built with vanilla HTML, CSS, and JavaScript - no frameworks needed!

![Portfolio Preview](assets/preview.png)

## ✨ Features

- **Clean, Modern Design** - Minimal aesthetic that puts your work front and center
- **Responsive** - Looks great on desktop, tablet, and mobile
- **Interactive Elements** - Fan spread photo gallery, auto-scrolling testimonials, spiral travel gallery
- **Easy Content Management** - All content stored in a single JSON file
- **Admin Panel** - Local admin page to edit content without touching code
- **Filter Pills** - Filter projects by category (B2B SaaS, B2C, etc.)
- **Fast & Lightweight** - No frameworks, just vanilla HTML/CSS/JS
- **SEO Friendly** - Clean HTML structure
- **Free Hosting Ready** - Deploy to Vercel, Netlify, or GitHub Pages

## 🚀 Quick Start

### 1. Clone or Download

```bash
git clone https://github.com/nishadesign/portfolio-site.git
cd portfolio-site
```

### 2. Customize Your Content

Edit `data/projects.json` to add your own:
- Profile information (name, title, email, social links)
- Projects (title, description, images, videos)
- About page content (bio, values, testimonials)

### 3. Add Your Assets

Replace files in the `assets/` folder:
- Profile photos
- Project screenshots and videos
- Travel photos (for the spiral gallery)
- Logo/favicon

### 4. Preview Locally

```bash
python3 -m http.server 8000
# or
npx serve
```

Open `http://localhost:8000` in your browser.

### 5. Deploy

**Vercel (Recommended):**
1. Push to GitHub
2. Import project at [vercel.com](https://vercel.com)
3. Done! Auto-deploys on every push

**Netlify:**
1. Drag & drop folder at [netlify.com/drop](https://netlify.com/drop)

**GitHub Pages:**
1. Go to repo Settings → Pages → Deploy from main branch

## 📁 Project Structure

```
portfolio-site/
├── index.html          # Home/About page (landing)
├── work.html           # Projects page
├── project.html        # Individual project template
├── styles.css          # All styles
├── script.js           # Work page functionality
├── project-loader.js   # Project page functionality
├── data/
│   └── projects.json   # All your content lives here!
├── assets/
│   ├── travel/         # Travel photos for spiral gallery
│   └── ...             # Project images, videos, logos
└── admin/
    └── index.html      # Local admin panel (not deployed)
```

## 📝 Content Structure (projects.json)

```json
{
  "profile": {
    "name": "Your Name",
    "title": "Your Title",
    "email": "your@email.com",
    "resume": "link-to-resume",
    "social": {
      "linkedin": "linkedin-url",
      "substack": "substack-url"
    }
  },
  "aboutPage": {
    "hero": {
      "title": "Your Name",
      "subtitle": "Your bio...",
      "images": ["profile1.jpg", "profile2.jpg", ...],
      "links": { ... }
    },
    "values": [...],
    "testimonials": [...],
    "travelStories": { ... }
  },
  "projects": [
    {
      "id": "project-one",
      "title": "Project Name",
      "company": "Company",
      "description": "...",
      "coverImage": "image.png",
      "filterTag": "b2b-saas",
      "details": { ... }
    }
  ]
}
```

## 🎨 Customization

### Colors
Edit CSS variables in `styles.css`:
```css
:root {
    --color-primary: #1a1a1a;
    --color-text-primary: #1a1a1a;
    --color-text-secondary: #666666;
    --color-background: #ffffff;
    --color-surface: #f8f8f8;
    --color-border: #e5e5e5;
}
```

### Fonts
Change the Google Fonts import in HTML files:
```html
<link href="https://fonts.googleapis.com/css2?family=YOUR+FONT&display=swap" rel="stylesheet">
```

### Project Card Colors
Edit in `styles.css`:
```css
.project-card[data-project-id="project-one"] { background: #f5f7fa; }
.project-card[data-project-id="project-two"] { background: #f0f5f0; }
```

## 🛠 Admin Panel

Run locally and visit `http://localhost:8000/admin/` to:
- Edit profile information
- Add/edit projects
- Update about page content
- Manage testimonials

The admin panel generates JSON that you copy into `projects.json`.

## 📱 Pages Overview

| Page | File | Description |
|------|------|-------------|
| Home/About | `index.html` | Landing page with bio, photo fan, values, travel gallery, testimonials |
| Work | `work.html` | Project grid with filter pills |
| Project | `project.html` | Individual project case study |

## 🙏 Credits

Created by [Nisha Rastogi](https://nisharastogi.design)

Feel free to use this template for your own portfolio! If you found it helpful, a star ⭐ on GitHub would be appreciated.

## 📄 License

MIT License - Use freely for personal or commercial projects.

