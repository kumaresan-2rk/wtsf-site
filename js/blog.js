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

        renderBlogGrid(data);

        filterContainer.addEventListener('click', function(e) {
          if (!e.target.classList.contains('category-btn')) return;
          filterContainer.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
          e.target.classList.add('active');

          const cat = e.target.dataset.category;
          const filtered = cat ? data.filter(p => p.category === cat) : data;
          renderBlogGrid(filtered);
        });

        document.getElementById('modalOverlay').addEventListener('click', function(e) {
          if (e.target === this) closeBlogPost();
        });

        document.addEventListener('keydown', function(e) {
          if (e.key === 'Escape') closeBlogPost();
        });
      });
  }

  document.addEventListener('DOMContentLoaded', init);
})();
