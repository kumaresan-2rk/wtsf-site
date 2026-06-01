(function() {
  let instructors = [];
  let currentView = 'gallery';

  const STATE_ORDER = [
    'Tamil Nadu',
    'Karnataka',
    'Andhra Pradesh',
    'Maharashtra',
    'Gujarat',
    'Odisha',
    'Uttar Pradesh'
  ];

  function getUniqueStates(data) {
    const states = [...new Set(data.map(i => i.state))];
    return states.sort((a, b) => {
      const ai = STATE_ORDER.indexOf(a);
      const bi = STATE_ORDER.indexOf(b);
      return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
    });
  }

  function getDistrictsByState(data, state) {
    return [...new Set(data.filter(i => i.state === state).map(i => i.district))].sort();
  }

  let activeState = null;

  function getSelectedState() {
    return activeState;
  }

  function hasActiveFilters() {
    const state = getSelectedState();
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
      <div style="color:var(--text-secondary);font-size:0.85rem;margin-top:0.25rem;">${i.district}, ${i.state}</div>
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
        html += `<div class="${wrapperClass}">`;
        grouped[state][district].forEach(i => { html += renderFn(i); });
        html += `</div>`;
      });
    });
    return html;
  }

  function renderFlat(data, renderFn, wrapperClass) {
    let html = `<div class="${wrapperClass}">`;
    data.forEach(i => { html += renderFn(i); });
    html += `</div>`;
    return html;
  }

  function renderGalleryView(data) {
    const container = document.getElementById('instructorGrid');
    container.dataset.view = 'gallery';
    if (data.length === 0) {
      container.innerHTML = '<p style="color:var(--text-muted);text-align:center;padding:2rem;">No instructors found matching your criteria.</p>';
      return;
    }
    container.innerHTML = renderFlat(data, buildCardHtml, 'card-grid card-grid-4');
  }

  function renderListView(data) {
    const container = document.getElementById('instructorGrid');
    container.dataset.view = 'list';
    if (data.length === 0) {
      container.innerHTML = '<p style="color:var(--text-muted);text-align:center;padding:2rem;">No instructors found matching your criteria.</p>';
      return;
    }
    container.innerHTML = renderFlat(data, buildListItemHtml, 'instructor-list');
  }

  function renderCarouselView(data) {
    const container = document.getElementById('instructorGrid');
    container.dataset.view = 'carousel';
    if (data.length === 0) {
      container.innerHTML = '<p style="color:var(--text-muted);text-align:center;padding:2rem;">No instructors found matching your criteria.</p>';
      return;
    }
    let html = '<div class="carousel-wrapper">';
    if (data.length > 1) {
      html += '<button class="carousel-arrow prev" onclick="scrollCarousel(-1)">&#8249;</button>';
      html += '<button class="carousel-arrow next" onclick="scrollCarousel(1)">&#8250;</button>';
    }
    html += renderFlat(data, buildCarouselCardHtml, 'instructor-carousel');
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
    const stateFilter = getSelectedState();
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
    const state = getSelectedState();
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

  function renderStatePills(data) {
    const container = document.getElementById('statePills');
    if (!container) return;
    const states = getUniqueStates(data);
    container.innerHTML = states.map(function(s) {
      var active = s === activeState ? ' active' : '';
      return '<span class="pill' + active + '" data-state="' + s + '">' + s + '</span>';
    }).join('');

    container.querySelectorAll('.pill').forEach(function(pill) {
      pill.addEventListener('click', function() {
        var state = this.dataset.state;
        if (activeState === state) {
          activeState = null;
        } else {
          activeState = state;
        }
        renderStatePills(data);
        populateDistricts();
        filterInstructors();
      });
    });
  }

  function init() {
    const grid = document.getElementById('instructorGrid');
    if (!grid) return;

    fetch('data/instructors.json')
      .then(r => r.json())
      .then(data => {
        instructors = data;
        activeState = null;
        renderStatePills(data);

        document.querySelectorAll('.view-toggle button').forEach(btn => {
          btn.addEventListener('click', function() {
            setView(this.dataset.view);
          });
        });

        populateDistricts();
        renderGalleryView(data);

        document.getElementById('filterDistrict').addEventListener('change', filterInstructors);
        document.getElementById('filterSearch').addEventListener('input', filterInstructors);
      });
  }

  document.addEventListener('DOMContentLoaded', init);
})();
