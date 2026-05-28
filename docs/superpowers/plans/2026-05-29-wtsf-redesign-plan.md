# WTSF Website Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the existing HTTrack-mirrored WordPress static HTML with a clean, modern, mobile-first responsive static site. JSON-driven instructor directory and blog, zero backend.

**Architecture:** Pure static HTML/CSS/JS. Single CSS file with custom properties. Vanilla JS for hamburger menu, instructor filtering, and blog rendering. JSON files as data sources. A local Node.js script (`generate.js`) produces individual instructor profile HTML pages from the JSON data.

**Tech Stack:** HTML5, CSS3 (Grid, Flexbox, Custom Properties), Vanilla JS (ES6), Node.js (for generate.js script only), JSON.

---

## File Map

| File | Responsibility |
|------|---------------|
| `css/style.css` | All styles: variables, reset, typography, layout, navigation, cards, forms, footer, responsive |
| `js/main.js` | Hamburger menu toggle, close-on-outside-click, active nav highlight |
| `js/instructors.js` | Load `data/instructors.json`, cascade filters (state→district), search, render card grid |
| `js/blog.js` | Load `data/blog.json`, render blog grid with category filter, lightbox/modal for post detail |
| `data/instructors.json` | Instructor records |
| `data/blog.json` | Blog post records |
| `generate.js` | Read `data/instructors.json` → generate `instructors/{id}.html` per instructor |
| `index.html` | Home page with hero, featured section, footer |
| `about.html` | About the federation |
| `blog.html` | Blog listing, includes blog.js |
| `instructors.html` | Instructor listing, includes instructors.js |
| `events.html` | Events listing |
| `classes.html` | Classes info |
| `contacts.html` | Contact form/info |
| `instructors/{id}.html` | Generated individual instructor profile pages |

---

### Task 1: Project Scaffolding

**Files:**
- Create: `css/style.css`
- Create: `.gitkeep` in `js/`, `data/`, `assets/images/`, `assets/instructors/`, `assets/blog/`, `instructors/`

- [ ] **Step 1: Create directories and .gitkeep files**

```bash
mkdir -p css js data assets/images assets/instructors assets/blog instructors
touch js/.gitkeep data/.gitkeep assets/images/.gitkeep assets/instructors/.gitkeep assets/blog/.gitkeep instructors/.gitkeep
```

- [ ] **Step 2: Remove old files**

Remove the old WordPress-mirrored files that will be replaced. Keep `assets/uploads/` as it contains existing images.

```bash
# Remove old HTML pages
rm -f index.html index-2.html about.html gallery.html portfolio.html contacts.html event.html classes-page.html

# Remove bloated mirrored assets (WordPress plugins, themes, etc.)
rm -rf wp-content wp-includes webassets my-account
```

- [ ] **Step 3: Commit scaffolding**

```bash
git add -A && git commit -m "chore: scaffold project directories for redesign"
```

---

### Task 2: CSS Design System

**Files:**
- Create: `css/style.css`

This is the largest single file. It contains the entire design system.

- [ ] **Step 1: Write CSS variables and reset**

```css
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

:root {
  --bg-primary: #0f0f0f;
  --bg-surface: #1a1a1a;
  --bg-card: #1a1a1a;
  --bg-input: #252525;
  --border: #2a2a2a;
  --accent: #e8a84c;
  --accent-hover: #d4932e;
  --text-primary: #f0f0f0;
  --text-secondary: #a0a0a0;
  --text-muted: #6b6b6b;
  --font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  --max-width: 1200px;
  --header-height: 64px;
  --radius: 8px;
  --radius-lg: 12px;
  --transition: 0.2s ease;
}

html {
  font-size: 16px;
  scroll-behavior: smooth;
}

body {
  font-family: var(--font-family);
  background: var(--bg-primary);
  color: var(--text-primary);
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
}

a {
  color: var(--accent);
  text-decoration: none;
}

a:hover {
  color: var(--accent-hover);
}

img {
  max-width: 100%;
  height: auto;
  display: block;
}

ul { list-style: none; }

.container {
  width: 100%;
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 0 1rem;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0,0,0,0);
  border: 0;
}
```

- [ ] **Step 2: Write typography styles**

```css
h1, h2, h3, h4 {
  font-weight: 700;
  line-height: 1.3;
  color: var(--text-primary);
}

h1 { font-size: 2.5rem; }
h2 { font-size: 2rem; }
h3 { font-size: 1.5rem; }
h4 { font-size: 1.25rem; }

p { margin-bottom: 1rem; }

.section-title {
  text-align: center;
  margin-bottom: 2.5rem;
}

.section-title h2 {
  position: relative;
  display: inline-block;
}

.section-title h2::after {
  content: '';
  display: block;
  width: 60px;
  height: 3px;
  background: var(--accent);
  margin: 0.75rem auto 0;
  border-radius: 2px;
}

@media (max-width: 639px) {
  h1 { font-size: 1.75rem; }
  h2 { font-size: 1.5rem; }
  h3 { font-size: 1.25rem; }
}
```

- [ ] **Step 3: Write header and navigation styles**

```css
.site-header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: var(--header-height);
  background: rgba(15, 15, 15, 0.95);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--border);
  z-index: 1000;
}

.header-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: var(--text-primary);
  font-weight: 700;
  font-size: 1.1rem;
}

.logo img { height: 40px; }

.nav-toggle {
  display: none;
  background: none;
  border: none;
  color: var(--text-primary);
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
  z-index: 1001;
}

.nav {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.nav a {
  padding: 0.5rem 0.75rem;
  color: var(--text-secondary);
  font-size: 0.9rem;
  border-radius: var(--radius);
  transition: color var(--transition), background var(--transition);
}

.nav a:hover,
.nav a.active {
  color: var(--accent);
  background: rgba(232, 168, 76, 0.1);
}

.nav-overlay {
  display: none;
}

@media (max-width: 639px) {
  .nav-toggle {
    display: block;
  }

  .nav {
    position: fixed;
    top: 0;
    left: -280px;
    width: 280px;
    height: 100vh;
    background: var(--bg-surface);
    flex-direction: column;
    align-items: flex-start;
    padding: 5rem 1.5rem 2rem;
    gap: 0.5rem;
    transition: left 0.3s ease;
    z-index: 1002;
    border-right: 1px solid var(--border);
  }

  .nav.open {
    left: 0;
  }

  .nav a {
    width: 100%;
    font-size: 1.1rem;
    padding: 0.75rem 1rem;
  }

  .nav-overlay {
    display: block;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.5);
    z-index: 1001;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.3s ease;
  }

  .nav-overlay.open {
    opacity: 1;
    pointer-events: auto;
  }
}
```

- [ ] **Step 4: Write main content area and page wrapper**

```css
.page-content {
  padding-top: var(--header-height);
  min-height: 100vh;
}

.section {
  padding: 4rem 0;
}

.section-dark {
  background: var(--bg-surface);
}

@media (max-width: 639px) {
  .section { padding: 2.5rem 0; }
}
```

- [ ] **Step 5: Write hero section**

```css
.hero {
  position: relative;
  min-height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  background: linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%);
  overflow: hidden;
}

.hero::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background:
    radial-gradient(circle at 20% 50%, rgba(232,168,76,0.08) 0%, transparent 50%),
    radial-gradient(circle at 80% 50%, rgba(232,168,76,0.05) 0%, transparent 50%);
}

.hero-content {
  position: relative;
  z-index: 1;
  padding: 2rem;
}

.hero-content .logo-main {
  max-width: 180px;
  margin: 0 auto 2rem;
}

.hero h1 {
  font-size: 3rem;
  margin-bottom: 1rem;
  letter-spacing: -0.02em;
}

.hero .tagline {
  font-size: 1.25rem;
  color: var(--accent);
  letter-spacing: 0.3em;
  text-transform: uppercase;
  font-weight: 600;
  margin-bottom: 1.5rem;
}

.hero p {
  color: var(--text-secondary);
  font-size: 1.1rem;
  max-width: 600px;
  margin: 0 auto;
}

@media (max-width: 639px) {
  .hero { min-height: 60vh; }
  .hero h1 { font-size: 1.75rem; }
  .hero .tagline { font-size: 0.9rem; letter-spacing: 0.15em; }
  .hero p { font-size: 1rem; }
}
```

- [ ] **Step 6: Write card grid component**

```css
.card-grid {
  display: grid;
  gap: 1.5rem;
}

.card-grid-3 {
  grid-template-columns: repeat(3, 1fr);
}

.card-grid-2 {
  grid-template-columns: repeat(2, 1fr);
}

.card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  overflow: hidden;
  transition: transform var(--transition), border-color var(--transition);
}

.card:hover {
  transform: translateY(-4px);
  border-color: var(--accent);
}

.card-image {
  width: 100%;
  aspect-ratio: 1;
  object-fit: cover;
}

.card-body {
  padding: 1.25rem;
}

.card-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.card-subtitle {
  color: var(--text-secondary);
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

.card-text {
  color: var(--text-secondary);
  font-size: 0.85rem;
}

@media (max-width: 1024px) {
  .card-grid-3 { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 639px) {
  .card-grid-3, .card-grid-2 { grid-template-columns: 1fr; }
}
```

- [ ] **Step 7: Write filter/search bar styles**

```css
.filter-bar {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.filter-bar select,
.filter-bar input {
  background: var(--bg-input);
  border: 1px solid var(--border);
  color: var(--text-primary);
  padding: 0.65rem 1rem;
  border-radius: var(--radius);
  font-size: 0.9rem;
  font-family: inherit;
  min-width: 180px;
  flex: 1;
}

.filter-bar select {
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%23a0a0a0' viewBox='0 0 16 16'%3E%3Cpath d='M8 11L3 6h10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
  padding-right: 2.25rem;
}

.filter-bar select:focus,
.filter-bar input:focus {
  outline: none;
  border-color: var(--accent);
}

.filter-bar input::placeholder {
  color: var(--text-muted);
}

@media (max-width: 639px) {
  .filter-bar { flex-direction: column; }
  .filter-bar select,
  .filter-bar input { min-width: 100%; }
}
```

- [ ] **Step 8: Write blog grid and modal styles**

```css
.blog-grid {
  display: grid;
  gap: 1.5rem;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
}

.blog-card {
  background: var(--bg-surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  overflow: hidden;
  cursor: pointer;
  transition: transform var(--transition), border-color var(--transition);
}

.blog-card:hover {
  transform: translateY(-4px);
  border-color: var(--accent);
}

.blog-card-image {
  width: 100%;
  aspect-ratio: 16/9;
  object-fit: cover;
}

.blog-card-body {
  padding: 1.25rem;
}

.blog-card-date {
  color: var(--text-muted);
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.5rem;
}

.blog-card-category {
  display: inline-block;
  background: rgba(232,168,76,0.15);
  color: var(--accent);
  font-size: 0.75rem;
  padding: 0.2rem 0.6rem;
  border-radius: 4px;
  margin-bottom: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* Category filter buttons */
.category-filters {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.category-btn {
  background: var(--bg-input);
  border: 1px solid var(--border);
  color: var(--text-secondary);
  padding: 0.5rem 1rem;
  border-radius: 20px;
  cursor: pointer;
  font-size: 0.85rem;
  font-family: inherit;
  transition: all var(--transition);
}

.category-btn:hover,
.category-btn.active {
  background: var(--accent);
  color: #0f0f0f;
  border-color: var(--accent);
}

/* Modal / Lightbox */
.modal-overlay {
  display: none;
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.85);
  z-index: 2000;
  overflow-y: auto;
  padding: 2rem;
}

.modal-overlay.open {
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-content {
  background: var(--bg-surface);
  border-radius: var(--radius-lg);
  max-width: 800px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  padding: 2rem;
  position: relative;
}

.modal-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  color: var(--text-secondary);
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
}

.modal-close:hover {
  color: var(--text-primary);
}

.modal-body img {
  width: 100%;
  border-radius: var(--radius);
  margin-bottom: 1rem;
}

.modal-body h2 {
  margin-bottom: 0.5rem;
}

.modal-body .meta {
  color: var(--text-muted);
  font-size: 0.85rem;
  margin-bottom: 1rem;
}
```

- [ ] **Step 9: Write form styles**

```css
.form-group {
  margin-bottom: 1.25rem;
}

.form-group label {
  display: block;
  color: var(--text-secondary);
  font-size: 0.9rem;
  margin-bottom: 0.4rem;
}

.form-group input,
.form-group textarea {
  width: 100%;
  background: var(--bg-input);
  border: 1px solid var(--border);
  color: var(--text-primary);
  padding: 0.75rem 1rem;
  border-radius: var(--radius);
  font-size: 1rem;
  font-family: inherit;
  transition: border-color var(--transition);
}

.form-group textarea {
  min-height: 140px;
  resize: vertical;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: var(--accent);
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: var(--accent);
  color: #0f0f0f;
  font-weight: 600;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: var(--radius);
  font-size: 1rem;
  cursor: pointer;
  font-family: inherit;
  transition: background var(--transition);
}

.btn:hover {
  background: var(--accent-hover);
  color: #0f0f0f;
}
```

- [ ] **Step 10: Write footer styles**

```css
.site-footer {
  background: var(--bg-surface);
  border-top: 1px solid var(--border);
  padding: 3rem 0 1.5rem;
  margin-top: 4rem;
}

.footer-grid {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 2rem;
  margin-bottom: 2rem;
}

.footer-col h4 {
  color: var(--text-primary);
  margin-bottom: 1rem;
  font-size: 1rem;
}

.footer-col p,
.footer-col a {
  color: var(--text-secondary);
  font-size: 0.9rem;
  line-height: 2;
}

.footer-col a:hover {
  color: var(--accent);
}

.footer-social {
  display: flex;
  gap: 0.75rem;
  margin-top: 1rem;
}

.footer-social a {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--bg-input);
  color: var(--text-secondary);
  font-size: 1.1rem;
  transition: all var(--transition);
}

.footer-social a:hover {
  background: var(--accent);
  color: #0f0f0f;
}

.footer-bottom {
  text-align: center;
  padding-top: 1.5rem;
  border-top: 1px solid var(--border);
  color: var(--text-muted);
  font-size: 0.85rem;
}

@media (max-width: 768px) {
  .footer-grid {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 639px) {
  .footer-grid {
    grid-template-columns: 1fr;
  }
}
```

- [ ] **Step 11: Write instructor profile page styles**

```css
.profile-header {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 2rem;
  margin-bottom: 2rem;
}

.profile-photo {
  width: 100%;
  aspect-ratio: 1;
  object-fit: cover;
  border-radius: var(--radius-lg);
  border: 3px solid var(--border);
}

.profile-info h1 {
  margin-bottom: 0.5rem;
}

.profile-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.profile-meta-item {
  background: var(--bg-input);
  padding: 0.4rem 0.8rem;
  border-radius: var(--radius);
  font-size: 0.85rem;
  color: var(--text-secondary);
}

.profile-meta-item strong {
  color: var(--accent);
}

.profile-bio {
  color: var(--text-secondary);
  line-height: 1.8;
}

.profile-social {
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
}

.profile-social a {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-secondary);
  font-size: 0.9rem;
  transition: color var(--transition);
}

.profile-social a:hover {
  color: var(--accent);
}

@media (max-width: 768px) {
  .profile-header {
    grid-template-columns: 1fr;
  }
  .profile-photo {
    max-width: 250px;
  }
}
```

- [ ] **Step 12: Write view toggle, list view, and carousel styles**

```css
/* View toggle buttons */
.view-toggle {
  display: flex;
  gap: 0.25rem;
  background: var(--bg-input);
  border-radius: var(--radius);
  padding: 3px;
}

.view-toggle button {
  background: none;
  border: none;
  color: var(--text-muted);
  padding: 0.4rem 0.6rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1.1rem;
  line-height: 1;
  transition: all var(--transition);
  font-family: inherit;
}

.view-toggle button:hover {
  color: var(--text-secondary);
}

.view-toggle button.active {
  background: var(--accent);
  color: #0f0f0f;
}

/* List view */
.instructor-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.list-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: var(--bg-surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 1rem;
  text-decoration: none;
  color: inherit;
  transition: border-color var(--transition);
}

.list-item:hover {
  border-color: var(--accent);
}

.list-item img {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
}

.list-item-info {
  flex: 1;
  min-width: 0;
}

.list-item-info .name {
  font-weight: 600;
  margin-bottom: 0.15rem;
}

.list-item-info .location {
  color: var(--text-secondary);
  font-size: 0.85rem;
}

.list-item-info .specialization {
  color: var(--accent);
  font-size: 0.8rem;
}

/* Carousel view */
.instructor-carousel {
  display: flex;
  gap: 1rem;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  padding-bottom: 1rem;
}

.instructor-carousel::-webkit-scrollbar {
  display: none;
}

.carousel-card {
  flex: 0 0 280px;
  scroll-snap-align: start;
  background: var(--bg-surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 1.5rem;
  text-align: center;
  text-decoration: none;
  color: inherit;
  transition: border-color var(--transition);
}

.carousel-card:hover {
  border-color: var(--accent);
}

.carousel-card img {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  margin: 0 auto 1rem;
}

.carousel-wrapper {
  position: relative;
}

.carousel-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: var(--bg-surface);
  border: 1px solid var(--border);
  color: var(--text-primary);
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  display: none;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  z-index: 2;
  transition: all var(--transition);
}

.carousel-arrow:hover {
  border-color: var(--accent);
  color: var(--accent);
}

.carousel-arrow.prev { left: -20px; }
.carousel-arrow.next { right: -20px; }

@media (min-width: 1024px) {
  .carousel-arrow { display: flex; }
}

/* Section grouping headers */
.group-header {
  margin: 2rem 0 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid var(--border);
}

.group-header.state {
  font-size: 1.5rem;
  color: var(--accent);
}

.group-header.district {
  font-size: 1.1rem;
  color: var(--text-secondary);
  margin-top: -0.5rem;
  border-bottom-color: transparent;
}
```

- [ ] **Step 13 (renumbered): Write utility and helper classes**

```css
.text-center { text-align: center; }
.mt-1 { margin-top: 1rem; }
.mt-2 { margin-top: 2rem; }
.mb-1 { margin-bottom: 1rem; }
.mb-2 { margin-bottom: 2rem; }
.gap-1 { gap: 1rem; }
.flex { display: flex; }
.flex-wrap { flex-wrap: wrap; }
.items-center { align-items: center; }
.justify-center { justify-content: center; }
```

- [ ] **Step 13: Commit CSS**

```bash
git add css/style.css && git commit -m "feat: add complete CSS design system"
```

---

### Task 3: JavaScript — main.js (Hamburger Menu)

**Files:**
- Create: `js/main.js`

- [ ] **Step 1: Write main.js**

```js
document.addEventListener('DOMContentLoaded', function() {
  const toggle = document.getElementById('navToggle');
  const nav = document.getElementById('nav');
  const overlay = document.getElementById('navOverlay');

  if (!toggle || !nav) return;

  function openNav() {
    nav.classList.add('open');
    if (overlay) overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeNav() {
    nav.classList.remove('open');
    if (overlay) overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  toggle.addEventListener('click', function() {
    nav.classList.contains('open') ? closeNav() : openNav();
  });

  if (overlay) {
    overlay.addEventListener('click', closeNav);
  }

  // Close nav on escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closeNav();
  });

  // Highlight active page in nav
  const currentPath = location.pathname.split('/').pop() || 'index.html';
  nav.querySelectorAll('a').forEach(function(link) {
    const href = link.getAttribute('href');
    if (href === currentPath) {
      link.classList.add('active');
    }
  });
});
```

- [ ] **Step 2: Commit**

```bash
git add js/main.js && git commit -m "feat: add hamburger menu and nav JS"
```

---

### Task 4: Data Files

**Files:**
- Create: `data/instructors.json`
- Create: `data/blog.json`

- [ ] **Step 1: Write data/instructors.json with sample data**

```json
[
  {
    "id": "cbe-001",
    "fullId": "WTSF-D-CBE-2026-001",
    "name": "Guru Kumaresan",
    "state": "Tamil Nadu",
    "district": "Coimbatore",
    "photo": "assets/instructors/cbe-001.jpg",
    "specialization": "Silambattam",
    "experience": 25,
    "bio": "Guru Kumaresan is a master of Silambattam with over 25 years of experience. He has trained hundreds of students across Tamil Nadu and is dedicated to preserving the traditional martial art form.",
    "social": {
      "instagram": "https://instagram.com/",
      "youtube": "https://youtube.com/"
    }
  },
  {
    "id": "cbe-002",
    "fullId": "WTSF-D-CBE-2026-002",
    "name": "Guru Selvam",
    "state": "Tamil Nadu",
    "district": "Coimbatore",
    "photo": "assets/instructors/cbe-002.jpg",
    "specialization": "Kalaripayattu",
    "experience": 18,
    "bio": "Guru Selvam specializes in Kalaripayattu and has been teaching for 18 years. He is known for his expertise in weapon-based martial arts.",
    "social": {
      "instagram": "https://instagram.com/"
    }
  },
  {
    "id": "tup-001",
    "fullId": "WTSF-D-TUP-2026-001",
    "name": "Guru Rajan",
    "state": "Tamil Nadu",
    "district": "Tirupur",
    "photo": "assets/instructors/tup-001.jpg",
    "specialization": "Silambattam",
    "experience": 30,
    "bio": "Guru Rajan is a senior instructor with 30 years of experience in Silambattam. He has conducted workshops across India and internationally.",
    "social": {
      "youtube": "https://youtube.com/"
    }
  },
  {
    "id": "che-001",
    "fullId": "WTSF-D-CHE-2026-001",
    "name": "Guru Priya",
    "state": "Tamil Nadu",
    "district": "Chennai",
    "photo": "assets/instructors/che-001.jpg",
    "specialization": "Silambattam",
    "experience": 12,
    "bio": "Guru Priya is one of the leading female Silambattam instructors in Chennai. She specializes in training women and children in traditional martial arts.",
    "social": {
      "instagram": "https://instagram.com/"
    }
  }
]
```

- [ ] **Step 2: Write data/blog.json with sample posts**

```json
[
  {
    "id": "post-001",
    "title": "Annual Silambattam Championship 2026",
    "date": "2026-05-15",
    "coverImage": "assets/blog/championship-2026.jpg",
    "images": ["assets/blog/championship-1.jpg", "assets/blog/championship-2.jpg"],
    "content": "The World Traditional Silambattam Federation successfully conducted its annual championship in Coimbatore. Participants from across Tamil Nadu showcased their skills in various categories including Silambattam, Kalaripayattu, and traditional weapons forms.\n\nThe event was graced by esteemed masters and dignitaries. Over 200 participants competed in 15 categories. The federation congratulates all winners and participants for their dedication to preserving this ancient martial art.",
    "excerpt": "Over 200 participants competed in 15 categories at the annual Silambattam championship held in Coimbatore.",
    "category": "Events"
  },
  {
    "id": "post-002",
    "title": "New Training Program for Beginners",
    "date": "2026-04-20",
    "coverImage": "assets/blog/training-program.jpg",
    "images": ["assets/blog/training-1.jpg", "assets/blog/training-2.jpg"],
    "content": "WTSF is launching a new beginner-friendly training program designed for those who are new to Silambattam. The program covers basic stances, footwork, and introductory stick techniques.\n\nClasses will be held on weekends at our training centers across Tamil Nadu. Participants will receive certification upon completion of the program.",
    "excerpt": "WTSF launches a beginner-friendly Silambattam training program with weekend classes across Tamil Nadu.",
    "category": "Training"
  },
  {
    "id": "post-003",
    "title": "International Silambattam Workshop",
    "date": "2026-03-10",
    "coverImage": "assets/blog/international-workshop.jpg",
    "images": ["assets/blog/workshop-1.jpg", "assets/blog/workshop-2.jpg", "assets/blog/workshop-3.jpg"],
    "content": "The federation organized an international workshop featuring masters from Malaysia, Singapore, and Sri Lanka. The workshop focused on cross-cultural exchanges in traditional martial arts.\n\nAttendees learned diverse techniques and gained insights into how Silambattam has evolved across different regions of Southeast Asia.",
    "excerpt": "International workshop featuring Silambattam masters from Malaysia, Singapore, and Sri Lanka.",
    "category": "Events"
  },
  {
    "id": "post-004",
    "title": "Instructor Certification Program",
    "date": "2026-02-01",
    "coverImage": "assets/blog/certification.jpg",
    "images": [],
    "content": "WTSF announces its annual instructor certification program. Aspiring instructors will undergo rigorous training covering teaching methodologies, safety protocols, and advanced techniques.\n\nThe certification is valid for 3 years and is recognized across all WTSF affiliated centers.",
    "excerpt": "Annual instructor certification program now open for applications.",
    "category": "Training"
  },
  {
    "id": "post-005",
    "title": "Traditional Silambattam Festival",
    "date": "2026-01-12",
    "coverImage": "assets/blog/festival.jpg",
    "images": ["assets/blog/festival-1.jpg"],
    "content": "The Traditional Silambattam Festival celebrated the rich heritage of Tamil martial arts. The event featured demonstrations, cultural performances, and a grand procession of masters.\n\nHundreds of spectators witnessed the breathtaking performances that highlighted the grace and power of Silambattam.",
    "excerpt": "Annual Traditional Silambattam Festival celebrates Tamil martial arts heritage with demonstrations and cultural performances.",
    "category": "Events"
  }
]
```

- [ ] **Step 3: Commit**

```bash
git add data/ && git commit -m "feat: add sample data files for instructors and blog"
```

---

### Task 5: index.html (Home Page)

**Files:**
- Create: `index.html`

- [ ] **Step 1: Write index.html**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>World Traditional Silambattam Federation</title>
  <meta name="description" content="World Traditional Silambattam Association Tamil Nadu, India - LEARN | SECURE | TEACH">
  <link rel="stylesheet" href="css/style.css">
  <link rel="icon" href="assets/images/favicon.png">
</head>
<body>
  <header class="site-header">
    <div class="container header-inner">
      <a href="index.html" class="logo">
        <img src="assets/images/logo.png" alt="WTSF Logo">
        <span>WTSF</span>
      </a>
      <button class="nav-toggle" id="navToggle" aria-label="Menu">&#9776;</button>
      <nav class="nav" id="nav">
        <a href="index.html">Home</a>
        <a href="about.html">About</a>
        <a href="blog.html">Blog</a>
        <a href="instructors.html">Instructors</a>
        <a href="events.html">Events</a>
        <a href="classes.html">Classes</a>
        <a href="contacts.html">Contact</a>
      </nav>
      <div class="nav-overlay" id="navOverlay"></div>
    </div>
  </header>

  <main class="page-content">
    <section class="hero">
      <div class="hero-content">
        <img class="logo-main" src="assets/images/logo.png" alt="WTSF">
        <p class="tagline">LEARN | SECURE | TEACH</p>
        <h1>World Traditional<br>Silambattam Federation</h1>
        <p>Preserving and promoting the ancient Tamil martial art of Silambattam across India and the world.</p>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="section-title">
          <h2>About Our Federation</h2>
        </div>
        <div style="max-width:800px;margin:0 auto;text-align:center;color:var(--text-secondary);">
          <p>The World Traditional Silambattam Federation (WTSF) is dedicated to the preservation, practice, and promotion of Silambattam — the ancient Tamil martial art. With affiliated instructors across Tamil Nadu, we provide authentic training in traditional Silambattam techniques, weapons forms, and associated disciplines.</p>
          <p>Our mission is to ensure this rich cultural heritage is passed down to future generations through structured training programs, certifications, and public demonstrations.</p>
        </div>
      </div>
    </section>

    <section class="section section-dark">
      <div class="container">
        <div class="section-title">
          <h2>Our Instructors</h2>
        </div>
        <div class="card-grid card-grid-3" id="homeInstructors">
          <!-- Populated by JS -->
        </div>
        <div class="text-center mt-2">
          <a href="instructors.html" class="btn">View All Instructors</a>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="section-title">
          <h2>Upcoming Events</h2>
        </div>
        <div class="card-grid card-grid-3" id="homeEvents">
          <!-- Populated by JS -->
        </div>
        <div class="text-center mt-2">
          <a href="events.html" class="btn">View All Events</a>
        </div>
      </div>
    </section>
  </main>

  <footer class="site-footer">
    <div class="container">
      <div class="footer-grid">
        <div class="footer-col">
          <h4>World Traditional Silambattam Federation</h4>
          <p>Dedicated to preserving and promoting the ancient Tamil martial art of Silambattam.</p>
          <div class="footer-social">
            <a href="#" aria-label="Facebook">F</a>
            <a href="#" aria-label="Instagram">I</a>
            <a href="#" aria-label="Twitter">X</a>
            <a href="#" aria-label="YouTube">Y</a>
          </div>
        </div>
        <div class="footer-col">
          <h4>Quick Links</h4>
          <a href="about.html">About Us</a><br>
          <a href="instructors.html">Instructors</a><br>
          <a href="blog.html">Blog</a><br>
          <a href="events.html">Events</a>
        </div>
        <div class="footer-col">
          <h4>Programs</h4>
          <a href="classes.html">Classes</a><br>
          <a href="instructors.html">Training</a><br>
          <a href="blog.html">Workshops</a>
        </div>
        <div class="footer-col">
          <h4>Contact</h4>
          <a href="contacts.html">Get in Touch</a><br>
          <p>Tamil Nadu, India</p>
        </div>
      </div>
      <div class="footer-bottom">
        &copy; 2026 World Traditional Silambattam Federation. All rights reserved.
      </div>
    </div>
  </footer>

  <script src="js/main.js"></script>
  <script>
    // Load featured instructors for homepage
    fetch('data/instructors.json')
      .then(r => r.json())
      .then(data => {
        const container = document.getElementById('homeInstructors');
        if (!container) return;
        const featured = data.slice(0, 3);
        container.innerHTML = featured.map(i => `
          <a href="instructors/${i.id}.html" class="card" style="text-decoration:none;color:inherit;">
            <img class="card-image" src="${i.photo}" alt="${i.name}" loading="lazy">
            <div class="card-body">
              <div class="card-title">${i.name}</div>
              <div class="card-subtitle">${i.district}, ${i.state}</div>
              <div class="card-text">${i.specialization}</div>
            </div>
          </a>
        `).join('');
      });

    // Load upcoming events for homepage
    fetch('data/blog.json')
      .then(r => r.json())
      .then(data => {
        const container = document.getElementById('homeEvents');
        if (!container) return;
        const events = data.filter(p => p.category === 'Events').slice(0, 3);
        container.innerHTML = events.map(e => `
          <div class="blog-card" onclick="openBlogPost('${e.id}')">
            <img class="blog-card-image" src="${e.coverImage}" alt="${e.title}" loading="lazy">
            <div class="blog-card-body">
              <div class="blog-card-date">${new Date(e.date).toLocaleDateString('en-US', { year:'numeric', month:'long', day:'numeric' })}</div>
              <div class="blog-card-category">${e.category}</div>
              <div class="card-title">${e.title}</div>
            </div>
          </div>
        `).join('');
      });
  </script>
</body>
</html>
```

- [ ] **Step 2: Commit**

```bash
git add index.html && git commit -m "feat: add home page"
```

---

### Task 6: about.html

**Files:**
- Create: `about.html`

- [ ] **Step 1: Write about.html**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>About Us — WTSF</title>
  <meta name="description" content="About the World Traditional Silambattam Federation">
  <link rel="stylesheet" href="css/style.css">
  <link rel="icon" href="assets/images/favicon.png">
</head>
<body>
  <header class="site-header">
    <div class="container header-inner">
      <a href="index.html" class="logo">
        <img src="assets/images/logo.png" alt="WTSF Logo">
        <span>WTSF</span>
      </a>
      <button class="nav-toggle" id="navToggle" aria-label="Menu">&#9776;</button>
      <nav class="nav" id="nav">
        <a href="index.html">Home</a>
        <a href="about.html">About</a>
        <a href="blog.html">Blog</a>
        <a href="instructors.html">Instructors</a>
        <a href="events.html">Events</a>
        <a href="classes.html">Classes</a>
        <a href="contacts.html">Contact</a>
      </nav>
      <div class="nav-overlay" id="navOverlay"></div>
    </div>
  </header>

  <main class="page-content">
    <section class="section">
      <div class="container">
        <div class="section-title">
          <h2>About Us</h2>
        </div>
        <div style="max-width:800px;margin:0 auto;color:var(--text-secondary);">
          <p>The World Traditional Silambattam Federation (WTSF) is a premier organization dedicated to the preservation and promotion of Silambattam, the ancient Tamil martial art that has been practiced for thousands of years in South India.</p>
          <p>Founded by a group of dedicated Silambattam masters, WTSF aims to bring authentic traditional martial arts training to students across India and around the world. Our federation is built on three core principles:</p>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:1.5rem;margin:2rem 0;">
            <div style="background:var(--bg-surface);padding:1.5rem;border-radius:var(--radius-lg);border:1px solid var(--border);text-align:center;">
              <h3 style="color:var(--accent);margin-bottom:0.5rem;">LEARN</h3>
              <p style="font-size:0.9rem;">Structured training programs for beginners to advanced practitioners, following traditional teaching methods.</p>
            </div>
            <div style="background:var(--bg-surface);padding:1.5rem;border-radius:var(--radius-lg);border:1px solid var(--border);text-align:center;">
              <h3 style="color:var(--accent);margin-bottom:0.5rem;">SECURE</h3>
              <p style="font-size:0.9rem;">Certification and recognition for practitioners, ensuring authentic lineage and proper technique.</p>
            </div>
            <div style="background:var(--bg-surface);padding:1.5rem;border-radius:var(--radius-lg);border:1px solid var(--border);text-align:center;">
              <h3 style="color:var(--accent);margin-bottom:0.5rem;">TEACH</h3>
              <p style="font-size:0.9rem;">Instructor training programs to ensure the art is passed down to future generations with integrity.</p>
            </div>
          </div>
          <p>With affiliated instructors across Tamil Nadu and growing international presence, WTSF is committed to making Silambattam accessible to all who wish to learn this ancient martial art.</p>
        </div>
      </div>
    </section>

    <section class="section section-dark">
      <div class="container">
        <div class="section-title">
          <h2>Our Mission</h2>
        </div>
        <div style="max-width:800px;margin:0 auto;text-align:center;color:var(--text-secondary);">
          <p>To preserve the authentic traditions of Silambattam while making it accessible to modern practitioners. We strive to create a global community of Silambattam practitioners united by respect for the art, dedication to practice, and commitment to teaching.</p>
        </div>
      </div>
    </section>
  </main>

  <footer class="site-footer">
    <div class="container">
      <div class="footer-grid">
        <div class="footer-col">
          <h4>World Traditional Silambattam Federation</h4>
          <p>Dedicated to preserving and promoting the ancient Tamil martial art of Silambattam.</p>
        </div>
        <div class="footer-col">
          <h4>Quick Links</h4>
          <a href="index.html">Home</a><br>
          <a href="instructors.html">Instructors</a><br>
          <a href="blog.html">Blog</a>
        </div>
        <div class="footer-col">
          <h4>Programs</h4>
          <a href="classes.html">Classes</a><br>
          <a href="events.html">Events</a>
        </div>
        <div class="footer-col">
          <h4>Contact</h4>
          <a href="contacts.html">Get in Touch</a>
        </div>
      </div>
      <div class="footer-bottom">
        &copy; 2026 World Traditional Silambattam Federation. All rights reserved.
      </div>
    </div>
  </footer>

  <script src="js/main.js"></script>
</body>
</html>
```

- [ ] **Step 2: Commit**

```bash
git add about.html && git commit -m "feat: add about page"
```

---

### Task 7: instructors.html + instructors.js

**Files:**
- Create: `instructors.html`
- Create: `js/instructors.js`

- [ ] **Step 1: Write js/instructors.js**

```js
(function() {
  let instructors = [];
  let currentView = 'gallery';

  function getUniqueStates(data) {
    return [...new Set(data.map(i => i.state))].sort();
  }

  function getDistrictsByState(data, state) {
    return [...new Set(data.filter(i => i.state === state).map(i => i.district))].sort();
  }

  function hasActiveFilters() {
    const state = document.getElementById('filterState').value;
    const district = document.getElementById('filterDistrict').value;
    const search = document.getElementById('filterSearch').value.trim();
    return state || district || search;
  }

  function buildCardHtml(i) {
    return `<a href="instructors/${i.id}.html" class="card" style="text-decoration:none;color:inherit;">
      <img class="card-image" src="${i.photo}" alt="${i.name}" loading="lazy" onerror="this.src='assets/images/placeholder.svg'">
      <div class="card-body">
        <div class="card-title">${i.name}</div>
        <div class="card-subtitle">${i.district}, ${i.state}</div>
        <div class="card-text" style="color:var(--accent);font-size:0.85rem;">${i.specialization}</div>
      </div>
    </a>`;
  }

  function buildListItemHtml(i) {
    return `<a href="instructors/${i.id}.html" class="list-item">
      <img src="${i.photo}" alt="${i.name}" loading="lazy" onerror="this.src='assets/images/placeholder.svg'">
      <div class="list-item-info">
        <div class="name">${i.name}</div>
        <div class="location">${i.district}, ${i.state}</div>
        <div class="specialization">${i.specialization}</div>
      </div>
    </a>`;
  }

  function buildCarouselCardHtml(i) {
    return `<a href="instructors/${i.id}.html" class="carousel-card">
      <img src="${i.photo}" alt="${i.name}" loading="lazy" onerror="this.src='assets/images/placeholder.svg'">
      <div class="card-title">${i.name}</div>
      <div style="color:var(--text-secondary);font-size:0.85rem;margin-top:0.25rem;">${i.district}</div>
      <div style="color:var(--accent);font-size:0.8rem;margin-top:0.5rem;">${i.specialization}</div>
    </a>`;
  }

  function renderGrouped(data, renderFn, wrapperClass) {
    const grouped = {};
    data.forEach(i => {
      if (!grouped[i.state]) grouped[i.state] = {};
      if (!grouped[i.state][i.district]) grouped[i.state][i.district] = [];
      grouped[i.state][i.district].push(i);
    });

    let html = '';
    const stateKeys = Object.keys(grouped).sort();
    stateKeys.forEach(state => {
      html += `<h3 class="group-header state">${state}</h3>`;
      const districtKeys = Object.keys(grouped[state]).sort();
      districtKeys.forEach(district => {
        html += `<h4 class="group-header district">${district}</h4>`;
        if (wrapperClass === 'instructor-carousel') {
          html += `<div class="${wrapperClass}">`;
          grouped[state][district].forEach(i => { html += renderFn(i); });
          html += `</div>`;
        } else {
          html += `<div class="${wrapperClass}">`;
          grouped[state][district].forEach(i => { html += renderFn(i); });
          html += `</div>`;
        }
      });
    });
    return html;
  }

  function renderFlat(data, renderFn, wrapperClass) {
    let html;
    if (wrapperClass === 'instructor-carousel') {
      html = `<div class="${wrapperClass}">`;
      data.forEach(i => { html += renderFn(i); });
      html += `</div>`;
    } else {
      html = `<div class="${wrapperClass}">`;
      data.forEach(i => { html += renderFn(i); });
      html += `</div>`;
    }
    return html;
  }

  function renderGalleryView(data) {
    const container = document.getElementById('instructorGrid');
    container.dataset.view = 'gallery';
    if (data.length === 0) {
      container.innerHTML = '<p style="color:var(--text-muted);text-align:center;padding:2rem;">No instructors found matching your criteria.</p>';
      return;
    }

    if (hasActiveFilters()) {
      container.innerHTML = renderFlat(data, buildCardHtml, 'card-grid card-grid-3');
    } else {
      container.innerHTML = renderGrouped(data, buildCardHtml, 'card-grid card-grid-3');
    }
  }

  function renderListView(data) {
    const container = document.getElementById('instructorGrid');
    container.dataset.view = 'list';
    if (data.length === 0) {
      container.innerHTML = '<p style="color:var(--text-muted);text-align:center;padding:2rem;">No instructors found matching your criteria.</p>';
      return;
    }

    if (hasActiveFilters()) {
      container.innerHTML = renderFlat(data, buildListItemHtml, 'instructor-list');
    } else {
      container.innerHTML = renderGrouped(data, buildListItemHtml, 'instructor-list');
    }
  }

  function renderCarouselView(data) {
    const container = document.getElementById('instructorGrid');
    container.dataset.view = 'carousel';
    if (data.length === 0) {
      container.innerHTML = '<p style="color:var(--text-muted);text-align:center;padding:2rem;">No instructors found matching your criteria.</p>';
      return;
    }

    const needsArrows = data.length > 1;

    let html = '<div class="carousel-wrapper">';
    if (needsArrows && !hasActiveFilters()) {
      html += '<button class="carousel-arrow prev" onclick="scrollCarousel(-1)">&#8249;</button>';
      html += '<button class="carousel-arrow next" onclick="scrollCarousel(1)">&#8250;</button>';
    }

    if (hasActiveFilters()) {
      html += renderFlat(data, buildCarouselCardHtml, 'instructor-carousel');
    } else {
      html += renderGrouped(data, buildCarouselCardHtml, 'instructor-carousel');
    }

    html += '</div>';
    container.innerHTML = html;
  }

  window.scrollCarousel = function(dir) {
    const carousel = document.querySelector('.instructor-carousel');
    if (!carousel) return;
    const scrollAmount = carousel.querySelector('.carousel-card')?.offsetWidth + 16 || 300;
    carousel.scrollBy({ left: dir * scrollAmount, behavior: 'smooth' });
  };

  function filterInstructors() {
    const stateFilter = document.getElementById('filterState').value;
    const districtFilter = document.getElementById('filterDistrict').value;
    const searchQuery = document.getElementById('filterSearch').value.toLowerCase().trim();

    let filtered = instructors;

    if (stateFilter) {
      filtered = filtered.filter(i => i.state === stateFilter);
    }
    if (districtFilter) {
      filtered = filtered.filter(i => i.district === districtFilter);
    }
    if (searchQuery) {
      filtered = filtered.filter(i =>
        i.name.toLowerCase().includes(searchQuery) ||
        i.specialization.toLowerCase().includes(searchQuery) ||
        i.district.toLowerCase().includes(searchQuery)
      );
    }

    switch (currentView) {
      case 'list': renderListView(filtered); break;
      case 'carousel': renderCarouselView(filtered); break;
      default: renderGalleryView(filtered);
    }
  }

  function setView(view) {
    currentView = view;
    document.querySelectorAll('.view-toggle button').forEach(b => {
      b.classList.toggle('active', b.dataset.view === view);
    });
    filterInstructors();
  }

  function populateDistricts() {
    const state = document.getElementById('filterState').value;
    const districtSelect = document.getElementById('filterDistrict');
    const currentDistrict = districtSelect.value;

    districtSelect.innerHTML = '<option value="">All Districts</option>';

    if (!state) {
      districtSelect.disabled = true;
      return;
    }

    districtSelect.disabled = false;
    const districts = getDistrictsByState(instructors, state);
    districts.forEach(d => {
      const opt = document.createElement('option');
      opt.value = d;
      opt.textContent = d;
      if (d === currentDistrict) opt.selected = true;
      districtSelect.appendChild(opt);
    });
  }

  function init() {
    const grid = document.getElementById('instructorGrid');
    if (!grid) return;

    fetch('data/instructors.json')
      .then(r => r.json())
      .then(data => {
        instructors = data;

        // Populate state dropdown
        const stateSelect = document.getElementById('filterState');
        getUniqueStates(data).forEach(s => {
          const opt = document.createElement('option');
          opt.value = s;
          opt.textContent = s;
          stateSelect.appendChild(opt);
        });

        // Wire view toggle
        document.querySelectorAll('.view-toggle button').forEach(btn => {
          btn.addEventListener('click', function() {
            setView(this.dataset.view);
          });
        });

        // Initial render
        renderGalleryView(data);

        // Wire filter events
        stateSelect.addEventListener('change', function() {
          populateDistricts();
          filterInstructors();
        });

        document.getElementById('filterDistrict').addEventListener('change', filterInstructors);
        document.getElementById('filterSearch').addEventListener('input', filterInstructors);
      });
  }

  document.addEventListener('DOMContentLoaded', init);
})();
```

- [ ] **Step 2: Write instructors.html**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Instructors — WTSF</title>
  <meta name="description" content="WTSF Silambattam instructors directory by state and district">
  <link rel="stylesheet" href="css/style.css">
  <link rel="icon" href="assets/images/favicon.png">
</head>
<body>
  <header class="site-header">
    <div class="container header-inner">
      <a href="index.html" class="logo">
        <img src="assets/images/logo.png" alt="WTSF Logo">
        <span>WTSF</span>
      </a>
      <button class="nav-toggle" id="navToggle" aria-label="Menu">&#9776;</button>
      <nav class="nav" id="nav">
        <a href="index.html">Home</a>
        <a href="about.html">About</a>
        <a href="blog.html">Blog</a>
        <a href="instructors.html">Instructors</a>
        <a href="events.html">Events</a>
        <a href="classes.html">Classes</a>
        <a href="contacts.html">Contact</a>
      </nav>
      <div class="nav-overlay" id="navOverlay"></div>
    </div>
  </header>

  <main class="page-content">
    <section class="section">
      <div class="container">
        <div class="section-title">
          <h2>Our Instructors</h2>
          <p style="color:var(--text-secondary);margin-top:0.5rem;">Find certified Silambattam instructors by state and district</p>
        </div>

        <div class="filter-bar">
          <select id="filterState">
            <option value="">All States</option>
          </select>
          <select id="filterDistrict" disabled>
            <option value="">All Districts</option>
          </select>
          <input type="text" id="filterSearch" placeholder="Search by name or specialization...">
          <div class="view-toggle">
            <button data-view="gallery" class="active" title="Gallery view">▦</button>
            <button data-view="list" title="List view">☰</button>
            <button data-view="carousel" title="Carousel view">≋</button>
          </div>
        </div>

        <div id="instructorGrid" data-view="gallery">
          <!-- Populated by instructors.js -->
        </div>
      </div>
    </section>
  </main>

  <footer class="site-footer">
    <div class="container">
      <div class="footer-grid">
        <div class="footer-col">
          <h4>World Traditional Silambattam Federation</h4>
          <p>Dedicated to preserving and promoting the ancient Tamil martial art of Silambattam.</p>
        </div>
        <div class="footer-col">
          <h4>Quick Links</h4>
          <a href="index.html">Home</a><br>
          <a href="about.html">About</a><br>
          <a href="blog.html">Blog</a>
        </div>
        <div class="footer-col">
          <h4>Programs</h4>
          <a href="classes.html">Classes</a><br>
          <a href="events.html">Events</a>
        </div>
        <div class="footer-col">
          <h4>Contact</h4>
          <a href="contacts.html">Get in Touch</a>
        </div>
      </div>
      <div class="footer-bottom">
        &copy; 2026 World Traditional Silambattam Federation. All rights reserved.
      </div>
    </div>
  </footer>

  <script src="js/main.js"></script>
  <script src="js/instructors.js"></script>
</body>
</html>
```

- [ ] **Step 3: Commit**

```bash
git add instructors.html js/instructors.js && git commit -m "feat: add instructors page with filter UI"
```

---

### Task 8: blog.html + blog.js

**Files:**
- Create: `blog.html`
- Create: `js/blog.js`

- [ ] **Step 1: Write js/blog.js**

```js
(function() {
  let posts = [];

  function getCategories(data) {
    return [...new Set(data.map(p => p.category))].sort();
  }

  function renderBlogGrid(data) {
    const container = document.getElementById('blogGrid');
    if (!container) return;

    if (data.length === 0) {
      container.innerHTML = '<p style="color:var(--text-muted);text-align:center;padding:2rem;">No blog posts found.</p>';
      return;
    }

    container.innerHTML = data.map(p => `
      <div class="blog-card" onclick="openBlogPost('${p.id}')">
        <img class="blog-card-image" src="${p.coverImage}" alt="${p.title}" loading="lazy" onerror="this.style.display='none'">
        <div class="blog-card-body">
          <div class="blog-card-date">${formatDate(p.date)}</div>
          <div class="blog-card-category">${p.category}</div>
          <div class="card-title">${p.title}</div>
          <div class="card-text" style="margin-top:0.5rem;">${p.excerpt}</div>
        </div>
      </div>
    `).join('');
  }

  function formatDate(dateStr) {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  }

  function renderModal(post) {
    const overlay = document.getElementById('modalOverlay');
    const body = document.getElementById('modalBody');

    const imagesHtml = post.images && post.images.length > 0
      ? post.images.map(img => `<img src="${img}" alt="${post.title}" loading="lazy">`).join('')
      : '';

    body.innerHTML = `
      <button class="modal-close" onclick="closeBlogPost()">&times;</button>
      <img src="${post.coverImage}" alt="${post.title}" style="width:100%;border-radius:var(--radius);margin-bottom:1rem;">
      <h2>${post.title}</h2>
      <div class="meta">${formatDate(post.date)} &middot; ${post.category}</div>
      <div style="color:var(--text-secondary);line-height:1.8;white-space:pre-line;">${post.content}</div>
      ${imagesHtml}
    `;

    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  window.openBlogPost = function(id) {
    const post = posts.find(p => p.id === id);
    if (post) renderModal(post);
  };

  window.closeBlogPost = function() {
    document.getElementById('modalOverlay').classList.remove('open');
    document.body.style.overflow = '';
  };

  function init() {
    const grid = document.getElementById('blogGrid');
    if (!grid) return;

    fetch('data/blog.json')
      .then(r => r.json())
      .then(data => {
        posts = data;

        // Populate category filters
        const filterContainer = document.getElementById('categoryFilters');
        const categories = getCategories(data);

        const allBtn = document.createElement('button');
        allBtn.className = 'category-btn active';
        allBtn.textContent = 'All';
        allBtn.dataset.category = '';
        filterContainer.appendChild(allBtn);

        categories.forEach(cat => {
          const btn = document.createElement('button');
          btn.className = 'category-btn';
          btn.textContent = cat;
          btn.dataset.category = cat;
          filterContainer.appendChild(btn);
        });

        // Initial render
        renderBlogGrid(data);

        // Wire up filters
        filterContainer.addEventListener('click', function(e) {
          if (!e.target.classList.contains('category-btn')) return;
          filterContainer.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
          e.target.classList.add('active');

          const cat = e.target.dataset.category;
          const filtered = cat ? data.filter(p => p.category === cat) : data;
          renderBlogGrid(filtered);
        });

        // Close modal on overlay click
        document.getElementById('modalOverlay').addEventListener('click', function(e) {
          if (e.target === this) closeBlogPost();
        });

        // Close on escape
        document.addEventListener('keydown', function(e) {
          if (e.key === 'Escape') closeBlogPost();
        });
      });
  }

  document.addEventListener('DOMContentLoaded', init);
})();
```

- [ ] **Step 2: Write blog.html**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Blog — WTSF</title>
  <meta name="description" content="WTSF Silambattam blog - news, events, training updates">
  <link rel="stylesheet" href="css/style.css">
  <link rel="icon" href="assets/images/favicon.png">
</head>
<body>
  <header class="site-header">
    <div class="container header-inner">
      <a href="index.html" class="logo">
        <img src="assets/images/logo.png" alt="WTSF Logo">
        <span>WTSF</span>
      </a>
      <button class="nav-toggle" id="navToggle" aria-label="Menu">&#9776;</button>
      <nav class="nav" id="nav">
        <a href="index.html">Home</a>
        <a href="about.html">About</a>
        <a href="blog.html">Blog</a>
        <a href="instructors.html">Instructors</a>
        <a href="events.html">Events</a>
        <a href="classes.html">Classes</a>
        <a href="contacts.html">Contact</a>
      </nav>
      <div class="nav-overlay" id="navOverlay"></div>
    </div>
  </header>

  <main class="page-content">
    <section class="section">
      <div class="container">
        <div class="section-title">
          <h2>Blog</h2>
          <p style="color:var(--text-secondary);margin-top:0.5rem;">News, events, and updates from WTSF</p>
        </div>

        <div class="category-filters" id="categoryFilters">
          <!-- Populated by blog.js -->
        </div>

        <div class="blog-grid" id="blogGrid">
          <!-- Populated by blog.js -->
        </div>
      </div>
    </section>
  </main>

  <!-- Modal overlay for blog post detail -->
  <div class="modal-overlay" id="modalOverlay">
    <div class="modal-content" id="modalBody">
      <!-- Populated by blog.js -->
    </div>
  </div>

  <footer class="site-footer">
    <div class="container">
      <div class="footer-grid">
        <div class="footer-col">
          <h4>World Traditional Silambattam Federation</h4>
          <p>Dedicated to preserving and promoting the ancient Tamil martial art of Silambattam.</p>
        </div>
        <div class="footer-col">
          <h4>Quick Links</h4>
          <a href="index.html">Home</a><br>
          <a href="about.html">About</a><br>
          <a href="instructors.html">Instructors</a>
        </div>
        <div class="footer-col">
          <h4>Programs</h4>
          <a href="classes.html">Classes</a><br>
          <a href="events.html">Events</a>
        </div>
        <div class="footer-col">
          <h4>Contact</h4>
          <a href="contacts.html">Get in Touch</a>
        </div>
      </div>
      <div class="footer-bottom">
        &copy; 2026 World Traditional Silambattam Federation. All rights reserved.
      </div>
    </div>
  </footer>

  <script src="js/main.js"></script>
  <script src="js/blog.js"></script>
</body>
</html>
```

- [ ] **Step 3: Commit**

```bash
git add blog.html js/blog.js && git commit -m "feat: add blog page with category filter and modal"
```

---

### Task 9: generate.js (Instructor Page Generator)

**Files:**
- Create: `generate.js`

- [ ] **Step 1: Write generate.js**

```js
const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, 'data', 'instructors.json');
const OUTPUT_DIR = path.join(__dirname, 'instructors');
const TEMPLATE_FILE = path.join(__dirname, 'instructors', '_template.html');

function validateInstructor(i, index) {
  const errors = [];
  if (!i.id) errors.push(`Item ${index}: missing "id"`);
  if (!i.name) errors.push(`Item ${index} (${i.id || 'unknown'}): missing "name"`);
  if (!i.photo) errors.push(`${i.name}: missing "photo"`);
  if (!i.district) errors.push(`${i.name}: missing "district"`);
  if (!i.state) errors.push(`${i.name}: missing "state"`);
  return errors;
}

function buildProfileHtml(i) {
  const socialHtml = [];
  if (i.social && i.social.instagram) {
    socialHtml.push(`<a href="${i.social.instagram}" target="_blank" rel="noopener">Instagram</a>`);
  }
  if (i.social && i.social.youtube) {
    socialHtml.push(`<a href="${i.social.youtube}" target="_blank" rel="noopener">YouTube</a>`);
  }

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${i.name} — WTSF Instructor</title>
  <meta name="description" content="${i.name} - ${i.specialization} instructor in ${i.district}, ${i.state}">
  <link rel="stylesheet" href="../css/style.css">
  <link rel="icon" href="../assets/images/favicon.png">
</head>
<body>
  <header class="site-header">
    <div class="container header-inner">
      <a href="../index.html" class="logo">
        <img src="../assets/images/logo.png" alt="WTSF Logo">
        <span>WTSF</span>
      </a>
      <button class="nav-toggle" id="navToggle" aria-label="Menu">&#9776;</button>
      <nav class="nav" id="nav">
        <a href="../index.html">Home</a>
        <a href="../about.html">About</a>
        <a href="../blog.html">Blog</a>
        <a href="../instructors.html">Instructors</a>
        <a href="../events.html">Events</a>
        <a href="../classes.html">Classes</a>
        <a href="../contacts.html">Contact</a>
      </nav>
      <div class="nav-overlay" id="navOverlay"></div>
    </div>
  </header>

  <main class="page-content">
    <section class="section">
      <div class="container">
        <a href="../instructors.html" style="color:var(--text-secondary);display:inline-block;margin-bottom:2rem;">&larr; Back to Instructors</a>
        <div class="profile-header">
          <img class="profile-photo" src="../${i.photo}" alt="${i.name}" onerror="this.src='../assets/images/placeholder.jpg'">
          <div class="profile-info">
            <h1>${i.name}</h1>
            <div class="profile-meta">
              <span class="profile-meta-item"><strong>${i.district}</strong>, ${i.state}</span>
              <span class="profile-meta-item">${i.specialization}</span>
              <span class="profile-meta-item">${i.experience} years experience</span>
              ${i.fullId ? `<span class="profile-meta-item">ID: ${i.fullId}</span>` : ''}
            </div>
            <div class="profile-bio">${i.bio || ''}</div>
            ${socialHtml.length > 0 ? '<div class="profile-social">' + socialHtml.join('') + '</div>' : ''}
          </div>
        </div>
      </div>
    </section>
  </main>

  <footer class="site-footer">
    <div class="container">
      <div class="footer-grid">
        <div class="footer-col">
          <h4>World Traditional Silambattam Federation</h4>
          <p>Dedicated to preserving and promoting the ancient Tamil martial art of Silambattam.</p>
        </div>
        <div class="footer-col">
          <h4>Quick Links</h4>
          <a href="../index.html">Home</a><br>
          <a href="../about.html">About</a><br>
          <a href="../instructors.html">Instructors</a>
        </div>
        <div class="footer-col">
          <h4>Programs</h4>
          <a href="../classes.html">Classes</a><br>
          <a href="../events.html">Events</a>
        </div>
        <div class="footer-col">
          <h4>Contact</h4>
          <a href="../contacts.html">Get in Touch</a>
        </div>
      </div>
      <div class="footer-bottom">
        &copy; 2026 World Traditional Silambattam Federation. All rights reserved.
      </div>
    </div>
  </footer>

  <script src="../js/main.js"></script>
</body>
</html>`;
}

function main() {
  if (!fs.existsSync(DATA_FILE)) {
    console.error('Error: data/instructors.json not found.');
    console.error('Run this script from the project root directory.');
    process.exit(1);
  }

  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const raw = fs.readFileSync(DATA_FILE, 'utf-8');
  let instructors;
  try {
    instructors = JSON.parse(raw);
  } catch (e) {
    console.error('Error: data/instructors.json is not valid JSON.');
    process.exit(1);
  }

  if (!Array.isArray(instructors)) {
    console.error('Error: data/instructors.json must contain an array.');
    process.exit(1);
  }

  // Validate
  let hasErrors = false;
  instructors.forEach((i, idx) => {
    const errors = validateInstructor(i, idx);
    if (errors.length > 0) {
      hasErrors = true;
      errors.forEach(e => console.error('  - ' + e));
    }
  });

  if (hasErrors) {
    console.error('Validation failed. Fix errors and try again.');
    process.exit(1);
  }

  // Generate files
  let generated = 0;
  instructors.forEach(i => {
    const html = buildProfileHtml(i);
    const filePath = path.join(OUTPUT_DIR, `${i.id}.html`);
    fs.writeFileSync(filePath, html, 'utf-8');
    generated++;
    console.log(`  Generated: instructors/${i.id}.html (${i.name})`);
  });

  console.log(`\nDone. ${generated} instructor page(s) generated.`);
}

main();
```

- [ ] **Step 2: Run generate.js to create initial instructor pages**

```bash
node generate.js
```

Expected output:
```
  Generated: instructors/cbe-001.html (Guru Kumaresan)
  Generated: instructors/cbe-002.html (Guru Selvam)
  Generated: instructors/tup-001.html (Guru Rajan)
  Generated: instructors/che-001.html (Guru Priya)

Done. 4 instructor page(s) generated.
```

- [ ] **Step 3: Commit**

```bash
git add generate.js instructors/ && git commit -m "feat: add generate.js script and generated instructor profile pages"
```

---

### Task 10: events.html

**Files:**
- Create: `events.html`

- [ ] **Step 1: Write events.html**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Events — WTSF</title>
  <meta name="description" content="WTSF events, tournaments, and workshops">
  <link rel="stylesheet" href="css/style.css">
  <link rel="icon" href="assets/images/favicon.png">
</head>
<body>
  <header class="site-header">
    <div class="container header-inner">
      <a href="index.html" class="logo">
        <img src="assets/images/logo.png" alt="WTSF Logo">
        <span>WTSF</span>
      </a>
      <button class="nav-toggle" id="navToggle" aria-label="Menu">&#9776;</button>
      <nav class="nav" id="nav">
        <a href="index.html">Home</a>
        <a href="about.html">About</a>
        <a href="blog.html">Blog</a>
        <a href="instructors.html">Instructors</a>
        <a href="events.html">Events</a>
        <a href="classes.html">Classes</a>
        <a href="contacts.html">Contact</a>
      </nav>
      <div class="nav-overlay" id="navOverlay"></div>
    </div>
  </header>

  <main class="page-content">
    <section class="section">
      <div class="container">
        <div class="section-title">
          <h2>Events</h2>
          <p style="color:var(--text-secondary);margin-top:0.5rem;">Upcoming and past events from WTSF</p>
        </div>
        <div class="blog-grid" id="eventsGrid"></div>
      </div>
    </section>
  </main>

  <div class="modal-overlay" id="modalOverlay">
    <div class="modal-content" id="modalBody"></div>
  </div>

  <footer class="site-footer">
    <div class="container">
      <div class="footer-grid">
        <div class="footer-col">
          <h4>World Traditional Silambattam Federation</h4>
          <p>Dedicated to preserving and promoting the ancient Tamil martial art of Silambattam.</p>
        </div>
        <div class="footer-col">
          <h4>Quick Links</h4>
          <a href="index.html">Home</a><br>
          <a href="about.html">About</a><br>
          <a href="instructors.html">Instructors</a>
        </div>
        <div class="footer-col">
          <h4>Programs</h4>
          <a href="classes.html">Classes</a><br>
          <a href="blog.html">Blog</a>
        </div>
        <div class="footer-col">
          <h4>Contact</h4>
          <a href="contacts.html">Get in Touch</a>
        </div>
      </div>
      <div class="footer-bottom">
        &copy; 2026 World Traditional Silambattam Federation. All rights reserved.
      </div>
    </div>
  </footer>

  <script src="js/main.js"></script>
  <script>
    fetch('data/blog.json')
      .then(r => r.json())
      .then(data => {
        const events = data.filter(p => p.category === 'Events');
        const grid = document.getElementById('eventsGrid');
        if (events.length === 0) {
          grid.innerHTML = '<p style="color:var(--text-muted);text-align:center;padding:2rem;">No upcoming events at this time.</p>';
          return;
        }
        grid.innerHTML = events.map(e => `
          <div class="blog-card" onclick="window.openBlogPost('${e.id}')">
            <img class="blog-card-image" src="${e.coverImage}" alt="${e.title}" loading="lazy">
            <div class="blog-card-body">
              <div class="blog-card-date">${new Date(e.date).toLocaleDateString('en-US', { year:'numeric', month:'long', day:'numeric' })}</div>
              <div class="blog-card-category">${e.category}</div>
              <div class="card-title">${e.title}</div>
              <div class="card-text" style="margin-top:0.5rem;">${e.excerpt}</div>
            </div>
          </div>
        `).join('');
      });
  </script>
</body>
</html>
```

- [ ] **Step 2: Commit**

```bash
git add events.html && git commit -m "feat: add events page"
```

---

### Task 11: classes.html

**Files:**
- Create: `classes.html`

- [ ] **Step 1: Write classes.html**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Classes — WTSF</title>
  <meta name="description" content="WTSF Silambattam training classes">
  <link rel="stylesheet" href="css/style.css">
  <link rel="icon" href="assets/images/favicon.png">
</head>
<body>
  <header class="site-header">
    <div class="container header-inner">
      <a href="index.html" class="logo">
        <img src="assets/images/logo.png" alt="WTSF Logo">
        <span>WTSF</span>
      </a>
      <button class="nav-toggle" id="navToggle" aria-label="Menu">&#9776;</button>
      <nav class="nav" id="nav">
        <a href="index.html">Home</a>
        <a href="about.html">About</a>
        <a href="blog.html">Blog</a>
        <a href="instructors.html">Instructors</a>
        <a href="events.html">Events</a>
        <a href="classes.html">Classes</a>
        <a href="contacts.html">Contact</a>
      </nav>
      <div class="nav-overlay" id="navOverlay"></div>
    </div>
  </header>

  <main class="page-content">
    <section class="section">
      <div class="container">
        <div class="section-title">
          <h2>Classes</h2>
          <p style="color:var(--text-secondary);margin-top:0.5rem;">Training programs and class schedules</p>
        </div>
        <div style="max-width:800px;margin:0 auto;color:var(--text-secondary);">
          <p>WTSF offers structured training programs in Silambattam for practitioners of all levels. Our classes are conducted by certified instructors at affiliated training centers across Tamil Nadu.</p>

          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:1.5rem;margin:2rem 0;">
            <div style="background:var(--bg-surface);padding:1.5rem;border-radius:var(--radius-lg);border:1px solid var(--border);">
              <h4 style="color:var(--accent);margin-bottom:0.75rem;">Beginner</h4>
              <p style="font-size:0.9rem;">Introduction to Silambattam: basic stances, footwork, and fundamental stick techniques. No prior experience required.</p>
            </div>
            <div style="background:var(--bg-surface);padding:1.5rem;border-radius:var(--radius-lg);border:1px solid var(--border);">
              <h4 style="color:var(--accent);margin-bottom:0.75rem;">Intermediate</h4>
              <p style="font-size:0.9rem;">Advanced techniques, forms (kata), and introduction to weapons training. Prerequisite: Beginner certification.</p>
            </div>
            <div style="background:var(--bg-surface);padding:1.5rem;border-radius:var(--radius-lg);border:1px solid var(--border);">
              <h4 style="color:var(--accent);margin-bottom:0.75rem;">Advanced</h4>
              <p style="font-size:0.9rem;">Master-level training: advanced weapons, teaching methodology, and instructor certification.</p>
            </div>
          </div>

          <p style="text-align:center;">For class schedules and enrollment, <a href="contacts.html">contact us</a> or reach out to your nearest WTSF instructor.</p>
        </div>
      </div>
    </section>
  </main>

  <footer class="site-footer">
    <div class="container">
      <div class="footer-grid">
        <div class="footer-col">
          <h4>World Traditional Silambattam Federation</h4>
          <p>Dedicated to preserving and promoting the ancient Tamil martial art of Silambattam.</p>
        </div>
        <div class="footer-col">
          <h4>Quick Links</h4>
          <a href="index.html">Home</a><br>
          <a href="about.html">About</a><br>
          <a href="instructors.html">Instructors</a>
        </div>
        <div class="footer-col">
          <h4>Programs</h4>
          <a href="blog.html">Blog</a><br>
          <a href="events.html">Events</a>
        </div>
        <div class="footer-col">
          <h4>Contact</h4>
          <a href="contacts.html">Get in Touch</a>
        </div>
      </div>
      <div class="footer-bottom">
        &copy; 2026 World Traditional Silambattam Federation. All rights reserved.
      </div>
    </div>
  </footer>

  <script src="js/main.js"></script>
</body>
</html>
```

- [ ] **Step 2: Commit**

```bash
git add classes.html && git commit -m "feat: add classes page"
```

---

### Task 12: contacts.html

**Files:**
- Create: `contacts.html`

- [ ] **Step 1: Write contacts.html**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Contact Us — WTSF</title>
  <meta name="description" content="Contact the World Traditional Silambattam Federation">
  <link rel="stylesheet" href="css/style.css">
  <link rel="icon" href="assets/images/favicon.png">
</head>
<body>
  <header class="site-header">
    <div class="container header-inner">
      <a href="index.html" class="logo">
        <img src="assets/images/logo.png" alt="WTSF Logo">
        <span>WTSF</span>
      </a>
      <button class="nav-toggle" id="navToggle" aria-label="Menu">&#9776;</button>
      <nav class="nav" id="nav">
        <a href="index.html">Home</a>
        <a href="about.html">About</a>
        <a href="blog.html">Blog</a>
        <a href="instructors.html">Instructors</a>
        <a href="events.html">Events</a>
        <a href="classes.html">Classes</a>
        <a href="contacts.html">Contact</a>
      </nav>
      <div class="nav-overlay" id="navOverlay"></div>
    </div>
  </header>

  <main class="page-content">
    <section class="section">
      <div class="container">
        <div class="section-title">
          <h2>Contact Us</h2>
          <p style="color:var(--text-secondary);margin-top:0.5rem;">Get in touch with WTSF</p>
        </div>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:3rem;max-width:900px;margin:0 auto;">
          <div>
            <h3 style="margin-bottom:1.5rem;">Send a Message</h3>
            <form id="contactForm">
              <div class="form-group">
                <label for="name">Name</label>
                <input type="text" id="name" placeholder="Your name" required>
              </div>
              <div class="form-group">
                <label for="email">Email</label>
                <input type="email" id="email" placeholder="Your email" required>
              </div>
              <div class="form-group">
                <label for="subject">Subject</label>
                <input type="text" id="subject" placeholder="Subject">
              </div>
              <div class="form-group">
                <label for="message">Message</label>
                <textarea id="message" placeholder="Your message..." required></textarea>
              </div>
              <button type="submit" class="btn">Send Message</button>
            </form>
            <div id="formStatus" style="margin-top:1rem;color:var(--accent);font-size:0.9rem;display:none;"></div>
          </div>

          <div>
            <h3 style="margin-bottom:1.5rem;">Contact Information</h3>
            <div style="margin-bottom:1.5rem;">
              <h4 style="color:var(--accent);margin-bottom:0.25rem;">Location</h4>
              <p style="color:var(--text-secondary);">Tamil Nadu, India</p>
            </div>
            <div style="margin-bottom:1.5rem;">
              <h4 style="color:var(--accent);margin-bottom:0.25rem;">Email</h4>
              <p style="color:var(--text-secondary);">info@wtsfsilambam.com</p>
            </div>
            <div style="margin-bottom:1.5rem;">
              <h4 style="color:var(--accent);margin-bottom:0.25rem;">Follow Us</h4>
              <p style="color:var(--text-secondary);">Stay connected on social media</p>
              <div class="footer-social" style="justify-content:flex-start;">
                <a href="#" aria-label="Facebook">F</a>
                <a href="#" aria-label="Instagram">I</a>
                <a href="#" aria-label="Twitter">X</a>
                <a href="#" aria-label="YouTube">Y</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>

  <footer class="site-footer">
    <div class="container">
      <div class="footer-grid">
        <div class="footer-col">
          <h4>World Traditional Silambattam Federation</h4>
          <p>Dedicated to preserving and promoting the ancient Tamil martial art of Silambattam.</p>
        </div>
        <div class="footer-col">
          <h4>Quick Links</h4>
          <a href="index.html">Home</a><br>
          <a href="about.html">About</a><br>
          <a href="instructors.html">Instructors</a>
        </div>
        <div class="footer-col">
          <h4>Programs</h4>
          <a href="blog.html">Blog</a><br>
          <a href="events.html">Events</a>
        </div>
        <div class="footer-col">
          <h4>Contact</h4>
          <a href="contacts.html">Get in Touch</a>
        </div>
      </div>
      <div class="footer-bottom">
        &copy; 2026 World Traditional Silambattam Federation. All rights reserved.
      </div>
    </div>
  </footer>

  <script src="js/main.js"></script>
  <script>
    document.getElementById('contactForm')?.addEventListener('submit', function(e) {
      e.preventDefault();
      const status = document.getElementById('formStatus');
      status.textContent = 'Thank you for your message. We will get back to you soon.';
      status.style.display = 'block';
      this.reset();
    });
  </script>
</body>
</html>
```

- [ ] **Step 2: Commit**

```bash
git add contacts.html && git commit -m "feat: add contacts page with form"
```

---

### Task 13: Final Cleanup & Placeholder Assets

**Files:**
- Modify: `assets/images/` (placeholder image)
- Create: `assets/images/placeholder.jpg`
- Create: `assets/images/.gitkeep`
- Create: `assets/instructors/.gitkeep`
- Create: `assets/blog/.gitkeep`
- Create: `assets/images/favicon.png`

- [ ] **Step 1: Create a simple SVG placeholder image for missing photos**

Create `assets/images/placeholder.svg`:

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">
  <rect width="400" height="400" fill="#2a2a2a"/>
  <text x="200" y="200" text-anchor="middle" dominant-baseline="middle" fill="#6b6b6b" font-family="sans-serif" font-size="18">No Photo</text>
</svg>
```

- [ ] **Step 2: Clean up old unused files from the repository**

```bash
# Remove old mirrored WP files and empty HTML
find . -name "*.html" -type f -not -path "./node_modules/*" -not -path "./.superpowers/*" -not -path "./docs/*" | sort
```

Verify that only the new HTML files remain: `index.html`, `about.html`, `blog.html`, `instructors.html`, `events.html`, `classes.html`, `contacts.html`, and the files under `instructors/`.

- [ ] **Step 3: Commit**

```bash
git add -A && git commit -m "chore: add placeholder assets and cleanup"
```

---

### Task 14: Spec Self-Review Verification

Verify the implementation covers every spec requirement:

| Spec Requirement | Status |
|---|---|
| 7 pages (Home, About, Blog, Instructors, Events, Classes, Contact) | Covered (Tasks 5-12) |
| Blog with category filter + modal | Covered (Task 8) |
| Instructor filtering by state/district + search | Covered (Task 7) |
| Generated individual instructor pages | Covered (Task 9) |
| Mobile-first responsive design | Covered (Task 2 CSS) |
| Hamburger menu | Covered (Task 3 JS + Task 2 CSS) |
| Dark theme with gold accent | Covered (Task 2 CSS) |
| JSON-driven content | Covered (Task 4 data + Task 7/8 JS) |
| generate.js script | Covered (Task 9) |
| Social media links in footer | Covered (all pages) |
| Contact form | Covered (Task 12) |

- [ ] **Step 1: Run git status to confirm everything is clean**

```bash
git status
```

Expected: All files tracked, working tree clean.

- [ ] **Step 2: Push to remote**

```bash
git push origin main
```
