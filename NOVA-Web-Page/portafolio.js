document.addEventListener('DOMContentLoaded', () => {

  const grid = document.getElementById('pfGrid');
  const empty = document.getElementById('pfEmpty');
  const mainFilters = document.getElementById('mainFilters');
  const subFilterRow = document.getElementById('subFilterRow');

  if (!grid || typeof PROJECTS === 'undefined') return;

  const state = { main: 'todos', sub: null };

  function render(){
    let filtered = PROJECTS;

    if (state.main === 'paginas-web') {
      filtered = PROJECTS.filter(p => p.category === 'paginas-web');
    } else if (state.main === 'material-digital') {
      // Aún no hay proyectos de material digital publicados.
      filtered = state.sub
        ? PROJECTS.filter(p => p.category === 'material-digital' && p.subcategory === state.sub)
        : PROJECTS.filter(p => p.category === 'material-digital');
    }

    grid.innerHTML = filtered.map(p => `
      <article class="pf-grid-card" data-id="${p.id}">
        <span class="pf-tag">${p.tag}</span>
        <img src="${p.img}" alt="${p.name}" loading="lazy">
        <div class="pf-grid-overlay">
          <h3>${p.name}</h3>
          <div class="client">Cliente: ${p.client}</div>
          <div class="pf-tech-row">${p.tech.map(t => `<span>${t}</span>`).join('')}</div>
          <span class="btn btn-outline-gold btn-sm pf-view-btn">Ver Proyecto →</span>
        </div>
      </article>
    `).join('');

    empty.classList.toggle('show', filtered.length === 0);

    grid.querySelectorAll('.pf-grid-card').forEach(card => {
      card.addEventListener('click', () => openModal(card.dataset.id));
    });
  }

  mainFilters.querySelectorAll('.filter-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      mainFilters.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      state.main = pill.dataset.filter;
      state.sub = null;
      subFilterRow.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
      subFilterRow.classList.toggle('open', state.main === 'material-digital');
      render();
    });
  });

  subFilterRow.querySelectorAll('.filter-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      const already = pill.classList.contains('active');
      subFilterRow.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
      if (!already) {
        pill.classList.add('active');
        state.sub = pill.dataset.subfilter;
      } else {
        state.sub = null;
      }
      render();
    });
  });

  render();

  /* ---------- Modal ---------- */
  const overlay = document.getElementById('modalOverlay');
  const modalImg = document.getElementById('modalImg');
  const modalTag = document.getElementById('modalTag');
  const modalTitle = document.getElementById('modalTitle');
  const modalClient = document.getElementById('modalClient');
  const modalDesc = document.getElementById('modalDesc');
  const modalTech = document.getElementById('modalTech');
  const modalTime = document.getElementById('modalTime');
  const modalVisit = document.getElementById('modalVisit');
  const modalClose = document.getElementById('modalClose');

  function openModal(id){
    const p = PROJECTS.find(x => x.id === id);
    if (!p) return;
    modalImg.src = p.img;
    modalImg.alt = p.name;
    modalTag.textContent = p.tag;
    modalTitle.textContent = p.name;
    modalClient.textContent = 'Cliente: ' + p.client;
    modalDesc.textContent = p.desc;
    modalTech.textContent = p.tech.join(', ');
    modalTime.textContent = p.time;
    modalVisit.href = p.url;

    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeModal(){
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }
  modalClose.addEventListener('click', closeModal);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) closeModal(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

});
