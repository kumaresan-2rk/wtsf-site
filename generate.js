const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, 'data', 'instructors.json');
const OUTPUT_DIR = path.join(__dirname, 'instructors');

function validateInstructor(i, index) {
  const errors = [];
  if (!i.id) errors.push(`Item ${index}: missing "id"`);
  if (!i.name) errors.push(`Item ${index} (${i.id || 'unknown'}): missing "name"`);
  if (!i.photo) errors.push(`${i.name}: missing "photo"`);
  if (!i.district) errors.push(`${i.name}: missing "district"`);
  if (!i.state) errors.push(`${i.name}: missing "state"`);
  return errors;
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function buildProfileHtml(i) {
  const socialHtml = [];
  if (i.social && i.social.instagram) {
    socialHtml.push(`<a href="${escapeHtml(i.social.instagram)}" target="_blank" rel="noopener">Instagram</a>`);
  }
  if (i.social && i.social.youtube) {
    socialHtml.push(`<a href="${escapeHtml(i.social.youtube)}" target="_blank" rel="noopener">YouTube</a>`);
  }

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(i.name)} — WTSF Instructor</title>
  <meta name="description" content="${escapeHtml(i.name)} - ${escapeHtml(i.specialization)} instructor in ${escapeHtml(i.district)}, ${escapeHtml(i.state)}">
  <link rel="stylesheet" href="../css/style.css">
  <link rel="icon" href="../assets/images/favicon.svg" type="image/svg+xml">
</head>
<body>
  <header class="site-header">
    <div class="container header-inner">
      <a href="../index.html" class="logo">
        <img src="../assets/uploads/logo/22434.png" alt="WTSF Logo">
        <span>WTSF</span>
      </a>
      <button class="nav-toggle" id="navToggle" aria-label="Menu">&#9776;</button>
      <nav class="nav" id="nav">
        <a href="../index.html">Home</a>
        <a href="../about.html">About</a>
        <a href=\"../blog.html\">Blog</a>
        <a href=\"../gallery.html\">Gallery</a>
        <a href=\"../instructors.html\">Instructors</a>
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
          <img class="profile-photo" src="../${escapeHtml(i.photo)}" alt="${escapeHtml(i.name)}" onerror="this.src='../assets/images/placeholder.svg'">
          <div class="profile-info">
            <h1>${escapeHtml(i.name)}</h1>
            <div class="profile-meta">
              <span class="profile-meta-item"><strong>${escapeHtml(i.district)}</strong>, ${escapeHtml(i.state)}</span>
              <span class="profile-meta-item">${escapeHtml(i.specialization)}</span>
              <span class="profile-meta-item">${i.experience} years experience</span>
              ${i.fullId ? `<span class="profile-meta-item">ID: ${escapeHtml(i.fullId)}</span>` : ''}
            </div>
            <div class="profile-bio">${escapeHtml(i.bio || '')}</div>
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
