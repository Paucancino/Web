document.addEventListener('DOMContentLoaded', () => {

  /* =========================================================
     STARFIELD (canvas)
     ========================================================= */
  const canvas = document.getElementById('stars');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let stars = [];
    let w, h;

    function resize(){
      w = canvas.width = window.innerWidth;
      h = canvas.height = document.documentElement.scrollHeight;
      const count = Math.min(180, Math.floor((w * h) / 14000));
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.3 + 0.3,
        gold: Math.random() < 0.18,
        speed: Math.random() * 0.15 + 0.02,
        phase: Math.random() * Math.PI * 2,
        twinkleSpeed: Math.random() * 0.015 + 0.005
      }));
    }

    let t = 0;
    function draw(){
      ctx.clearRect(0, 0, w, h);
      t += 1;
      stars.forEach(s => {
        const alpha = 0.35 + 0.5 * Math.abs(Math.sin(t * s.twinkleSpeed + s.phase));
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = s.gold ? `rgba(191,164,111,${alpha})` : `rgba(248,248,248,${alpha * 0.7})`;
        ctx.fill();
        s.y += s.speed;
        if (s.y > h) s.y = 0;
      });
      requestAnimationFrame(draw);
    }

    resize();
    draw();
    window.addEventListener('resize', () => { resize(); });
  }

  /* =========================================================
     NAVBAR
     ========================================================= */
  const navbar = document.getElementById('navbar');
  const onScroll = () => {
    if (navbar) {
      if (window.scrollY > 30) navbar.classList.add('scrolled');
      else navbar.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  const navToggle = document.getElementById('navToggle');
  const mobileNav = document.getElementById('mobileNav');
  if (navToggle && mobileNav) {
    navToggle.addEventListener('click', () => {
      const open = mobileNav.classList.toggle('open');
      navToggle.classList.toggle('active', open);
      navToggle.setAttribute('aria-expanded', String(open));
    });
    mobileNav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      mobileNav.classList.remove('open');
      navToggle.classList.remove('active');
    }));
  }

  /* =========================================================
     SMOOTH SCROLL
     ========================================================= */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const id = link.getAttribute('href');
      if (id.length > 1) {
        const target = document.querySelector(id);
        if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
      }
    });
  });

  /* =========================================================
     SCROLL REVEAL
     ========================================================= */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) { entry.target.classList.add('in'); io.unobserve(entry.target); }
      });
    }, { threshold: 0.14, rootMargin: '0px 0px -60px 0px' });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('in'));
  }

  /* =========================================================
     PARALLAX (planeta + mockups)
     ========================================================= */
  const parallaxEls = document.querySelectorAll('[data-parallax]');
  if (parallaxEls.length) {
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      parallaxEls.forEach(el => {
        const factor = parseFloat(el.dataset.parallax) || 0.1;
        el.style.transform = `translateY(${y * factor}px)`;
      });
    }, { passive: true });
  }

  /* =========================================================
     CHAT SIMULADO — "Tu proyecto nunca estará solo"
     ========================================================= */
  const chatBody = document.getElementById('chatBody');
  const chatPhone = document.getElementById('chatPhone');
  const CHAT_SCRIPT = [
    { who: 'me', text: 'Hola, me gustaría tener una página web para mi negocio 👋' },
    { who: 'them', text: '¡Hola! Con gusto te ayudo. Cuéntame un poco sobre tu negocio, ¿qué vendes o qué servicio ofreces?' },
    { who: 'me', text: 'Soy terapeuta y quiero transmitir confianza y profesionalismo.' },
    { who: 'them', text: 'Perfecto. Diseñamos algo que refleje exactamente eso. Te comparto algunas ideas de estilo en los próximos minutos ✨' },
    { who: 'me', text: '¡Qué bueno! ¿Cuánto tiempo tarda el proceso?' },
    { who: 'them', text: 'Entre 5 y 10 días. Trabajamos contigo en cada etapa para que el resultado sea exactamente lo que imaginas 🚀' },
  ];

  let chatStarted = false;
  function startChat(){
    if (chatStarted || !chatBody) return;
    chatStarted = true;
    let i = 0;

    function showNext(){
      if (i >= CHAT_SCRIPT.length) return;
      const msg = CHAT_SCRIPT[i];

      if (msg.who === 'them') {
        const typing = document.createElement('div');
        typing.className = 'chat-typing';
        typing.innerHTML = '<span></span><span></span><span></span>';
        chatBody.appendChild(typing);
        requestAnimationFrame(() => typing.classList.add('show'));
        chatBody.scrollTop = chatBody.scrollHeight;

        setTimeout(() => {
          typing.remove();
          appendBubble(msg);
          i++;
          setTimeout(showNext, 900);
        }, 1100);
      } else {
        appendBubble(msg);
        i++;
        setTimeout(showNext, 1300);
      }
    }

    function appendBubble(msg){
      const bubble = document.createElement('div');
      bubble.className = 'chat-bubble ' + msg.who;
      bubble.textContent = msg.text;
      chatBody.appendChild(bubble);
      requestAnimationFrame(() => bubble.classList.add('show'));
      chatBody.scrollTop = chatBody.scrollHeight;
    }

    setTimeout(showNext, 500);
  }

  if (chatPhone && 'IntersectionObserver' in window) {
    const chatIo = new IntersectionObserver((entries) => {
      entries.forEach(entry => { if (entry.isIntersecting) { startChat(); chatIo.disconnect(); } });
    }, { threshold: 0.4 });
    chatIo.observe(chatPhone);
  } else if (chatPhone) {
    startChat();
  }

  /* =========================================================
     FAQ ACCORDION (solo una abierta a la vez)
     ========================================================= */
  const faqList = document.getElementById('faqList');
  if (faqList) {
    const items = faqList.querySelectorAll('.faq-item');
    items.forEach(item => {
      const q = item.querySelector('.faq-q');
      const a = item.querySelector('.faq-a');
      q.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');
        items.forEach(other => {
          other.classList.remove('open');
          other.querySelector('.faq-a').style.maxHeight = null;
          other.querySelector('.faq-icon').textContent = '+';
        });
        if (!isOpen) {
          item.classList.add('open');
          a.style.maxHeight = a.scrollHeight + 'px';
          item.querySelector('.faq-icon').textContent = '+';
        }
      });
    });
  }

  /* =========================================================
     DOCK FLOTANTE
     ========================================================= */
  const dock = document.getElementById('dock');
  const dockToggle = document.getElementById('dockToggle');
  if (dock && dockToggle) {
    dockToggle.addEventListener('click', () => {
      const open = dock.classList.toggle('open');
      dockToggle.setAttribute('aria-expanded', String(open));
    });
    document.addEventListener('click', (e) => {
      if (!dock.contains(e.target)) dock.classList.remove('open');
    });
  }

  /* =========================================================
     PORTAFOLIO PREVIEW (página de inicio)
     ========================================================= */
  const pfTrack = document.getElementById('pfPreviewTrack');
  if (pfTrack && typeof PROJECTS !== 'undefined') {
    pfTrack.innerHTML = PROJECTS.map(p => `
      <div class="pf-card">
        <span class="pf-tag">${p.tag}</span>
        <img src="${p.img}" alt="${p.name}" loading="lazy">
        <div class="pf-overlay">
          <h3>${p.name}</h3>
          <p>${p.tag}</p>
          <a href="${p.url}" target="_blank" rel="noopener" class="btn btn-outline-gold btn-sm pf-visit">Visitar proyecto →</a>
        </div>
      </div>
    `).join('');
  }

});
