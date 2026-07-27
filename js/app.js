/* ============================================================
   BULHÕES SOCIEDADE DE ADVOCACIA — Interaction & Motion
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  gsap.registerPlugin(ScrollTrigger);

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------- Lenis smooth scroll ---------------- */
  let lenis;
  if (!reduceMotion) {
    lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  /* ---------------- Loader ---------------- */
  const loader = document.getElementById('loader');
  gsap.timeline()
    .to('.loader-mark', { opacity: 1, duration: 0.6, ease: 'power2.out' })
    .to('.loader-mark', { opacity: 1, duration: 0.3 })
    .to(loader, {
      opacity: 0, duration: 0.7, ease: 'power2.inOut',
      onComplete: () => { loader.style.display = 'none'; }
    })
    .add(() => runHeroIntro());

  /* ---------------- Header scroll state ---------------- */
  const header = document.querySelector('[data-header]');
  ScrollTrigger.create({
    start: 'top -80',
    end: 99999,
    onUpdate: (self) => {
      header.classList.toggle('is-scrolled', self.scroll() > 80);
    }
  });

  /* ---------------- Mobile nav ---------------- */
  const menuBtn = document.querySelector('[data-menu-toggle]');
  const mobileNav = document.querySelector('[data-mobile-nav]');
  menuBtn.addEventListener('click', () => {
    const open = mobileNav.classList.toggle('is-open');
    menuBtn.setAttribute('aria-expanded', open);
  });
  mobileNav.querySelectorAll('a').forEach((a) => {
    a.addEventListener('click', () => {
      mobileNav.classList.remove('is-open');
      menuBtn.setAttribute('aria-expanded', false);
    });
  });

  /* ---------------- Hero: letter-split intro ---------------- */
  function splitIntoWords(el) {
    const text = el.textContent;
    el.textContent = '';
    text.split(' ').forEach((word, i, arr) => {
      const span = document.createElement('span');
      span.className = 'word';
      span.style.display = 'inline-block';
      span.style.willChange = 'transform, opacity';
      span.textContent = word + (i < arr.length - 1 ? ' ' : '');
      el.appendChild(span);
    });
    return el.querySelectorAll('.word');
  }

  function runHeroIntro() {
    const lines = document.querySelectorAll('.hero-title .line');
    const words = [];
    lines.forEach((line) => words.push(...splitIntoWords(line)));

    gsap.set(words, { yPercent: 130, opacity: 0 });
    gsap.set('.hero-subtext, .hero-actions', { y: 24, opacity: 0 });

    const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
    tl.to(words, { yPercent: 0, opacity: 1, duration: 1.1, stagger: 0.035 })
      .to('.hero-subtext', { y: 0, opacity: 1, duration: 0.8 }, '-=0.5')
      .to('.hero-actions', { y: 0, opacity: 1, duration: 0.8 }, '-=0.55');
  }

  /* ---------------- Hero parallax on visual ---------------- */
  gsap.to('.hero-visual', {
    yPercent: 18,
    ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
  });

  /* ---------------- Generic [data-reveal] fade/clip ---------------- */
  document.querySelectorAll('[data-reveal="fade"]').forEach((el) => {
    gsap.from(el, {
      y: 32, opacity: 0, duration: 1, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 85%' }
    });
  });

  document.querySelectorAll('[data-reveal="clip"]').forEach((el) => {
    gsap.fromTo(el,
      { clipPath: 'inset(0 0 100% 0)' },
      {
        clipPath: 'inset(0 0 0% 0)', duration: 1.4, ease: 'power4.inOut',
        scrollTrigger: { trigger: el, start: 'top 80%' }
      }
    );
  });

  document.querySelectorAll('[data-reveal="scale"]').forEach((el) => {
    gsap.from(el, {
      scale: 0.85, opacity: 0, duration: 1.2, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 75%' }
    });
  });

  /* ---------------- Áreas: per-block distinct animation ---------------- */
  document.querySelectorAll('.area-block').forEach((block) => {
    const type = block.dataset.animation;
    const visual = block.querySelector('.area-visual');
    const text = block.querySelector('.area-text');
    const children = text.querySelectorAll('.area-icon, .area-index, h3, .gold-rule, p');

    const trigger = { trigger: block, start: 'top 70%' };

    gsap.set(children, { opacity: 0 });

    switch (type) {
      case 'slide-left':
        gsap.from(visual, { xPercent: -100, opacity: 0, duration: 1.2, ease: 'power4.out', scrollTrigger: trigger });
        gsap.to(children, { opacity: 1, y: 0, duration: 0.9, stagger: 0.1, ease: 'power3.out', scrollTrigger: trigger, from: { y: 30 } });
        break;
      case 'slide-right':
        gsap.from(visual, { xPercent: 100, opacity: 0, duration: 1.2, ease: 'power4.out', scrollTrigger: trigger });
        gsap.to(children, { opacity: 1, y: 0, duration: 0.9, stagger: 0.1, ease: 'power3.out', scrollTrigger: trigger, from: { y: 30 } });
        break;
      case 'fade-scale':
        gsap.from(visual, { scale: 1.15, opacity: 0, duration: 1.3, ease: 'power2.out', scrollTrigger: trigger });
        gsap.to(children, { opacity: 1, duration: 1, stagger: 0.12, ease: 'power2.out', scrollTrigger: trigger });
        break;
      case 'scale-up':
        gsap.from(visual, { scale: 0.8, opacity: 0, duration: 1.1, ease: 'back.out(1.4)', scrollTrigger: trigger });
        gsap.to(children, { opacity: 1, y: 0, duration: 0.9, stagger: 0.1, ease: 'power3.out', scrollTrigger: trigger, from: { y: 30 } });
        break;
      case 'reveal-wipe':
        gsap.fromTo(visual, { clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)', duration: 1.3, ease: 'power4.inOut', scrollTrigger: trigger });
        gsap.to(children, { opacity: 1, y: 0, duration: 0.9, stagger: 0.1, ease: 'power3.out', scrollTrigger: trigger, from: { y: 30 } });
        break;
      case 'mask-circle':
        gsap.fromTo(visual, { clipPath: 'circle(0% at 50% 50%)' }, { clipPath: 'circle(75% at 50% 50%)', duration: 1.4, ease: 'power3.inOut', scrollTrigger: trigger });
        gsap.to(children, { opacity: 1, y: 0, duration: 0.9, stagger: 0.1, ease: 'power3.out', scrollTrigger: trigger, from: { y: 30 } });
        break;
    }
  });

  /* ---------------- Diferenciais: stagger + counters ---------------- */
  gsap.from('.dif-item', {
    y: 40, opacity: 0, duration: 0.9, stagger: 0.12, ease: 'power3.out',
    scrollTrigger: { trigger: '.dif-grid', start: 'top 80%' }
  });

  document.querySelectorAll('[data-count]').forEach((el) => {
    const target = parseFloat(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    gsap.fromTo(el, { textContent: 0 }, {
      textContent: target,
      duration: 1.6,
      ease: 'power1.out',
      snap: { textContent: 1 },
      onUpdate: function () { el.textContent = Math.round(this.targets()[0].textContent) + suffix; },
      scrollTrigger: { trigger: el, start: 'top 85%' }
    });
  });

  /* ---------------- Processo: growing gold line ---------------- */
  gsap.to('[data-timeline-fill]', {
    width: '100%', ease: 'none',
    scrollTrigger: { trigger: '[data-timeline]', start: 'top 70%', end: 'bottom 60%', scrub: true }
  });
  gsap.from('.timeline-step', {
    y: 30, opacity: 0, duration: 0.9, stagger: 0.15, ease: 'power3.out',
    scrollTrigger: { trigger: '[data-timeline]', start: 'top 70%' }
  });

  /* ---------------- Depoimentos ---------------- */
  document.querySelectorAll('.dep-item').forEach((item) => {
    const type = item.dataset.animation;
    const from = type === 'slide-right' ? { x: 60, opacity: 0 } : { y: 40, opacity: 0 };
    gsap.from(item, { ...from, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: item, start: 'top 85%' } });
  });

  /* ---------------- FAQ accordion ---------------- */
  document.querySelectorAll('.faq-question').forEach((btn) => {
    const answer = btn.nextElementSibling;
    btn.addEventListener('click', () => {
      const isOpen = btn.getAttribute('aria-expanded') === 'true';
      document.querySelectorAll('.faq-question').forEach((other) => {
        if (other !== btn) {
          other.setAttribute('aria-expanded', 'false');
          gsap.to(other.nextElementSibling, { maxHeight: 0, duration: 0.5, ease: 'power2.inOut' });
        }
      });
      btn.setAttribute('aria-expanded', String(!isOpen));
      gsap.to(answer, {
        maxHeight: isOpen ? 0 : answer.scrollHeight,
        duration: 0.6,
        ease: 'power3.inOut'
      });
    });
  });

  /* ---------------- CTA final: scale reveal ---------------- */
  gsap.from('.cta-visual', {
    scale: 1.2, opacity: 0, duration: 1.6, ease: 'power2.out',
    scrollTrigger: { trigger: '.cta-final', start: 'top 70%' }
  });

  /* ---------------- Swap poster for mobile-specific frame ---------------- */
  if (window.matchMedia('(max-width: 767px)').matches) {
    document.querySelectorAll('[data-poster-mobile]').forEach((video) => {
      video.setAttribute('poster', video.dataset.posterMobile);
    });
  }

  /* ---------------- Lazy-load background videos ---------------- */
  const lazyVideos = document.querySelectorAll('[data-lazy-video]');
  const loadVideo = (video) => {
    if (video.dataset.loaded) return;
    video.dataset.loaded = 'true';
    video.querySelectorAll('source[data-src]').forEach((source) => {
      source.src = source.dataset.src;
      source.removeAttribute('data-src');
    });
    video.load();
    video.play().catch(() => {});
  };

  const videoObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const video = entry.target;
      if (entry.isIntersecting) {
        loadVideo(video);
        video.play().catch(() => {});
      } else if (video.dataset.loaded) {
        video.pause();
      }
    });
  }, { rootMargin: '1800px 0px' });

  lazyVideos.forEach((video) => videoObserver.observe(video));

  /* ---------------- Footer year ---------------- */
  document.querySelectorAll('[data-year]').forEach((el) => { el.textContent = new Date().getFullYear(); });

  /* ---------------- Dual nav links (mobile id vs desktop id) ---------------- */
  document.querySelectorAll('[data-nav-dual]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const key = link.dataset.navDual;
      const isDesktop = window.matchMedia('(min-width: 901px)').matches;
      const targetId = isDesktop ? `${key}-desktop` : key;
      const target = document.getElementById(targetId);
      if (!target) return;
      e.preventDefault();
      const y = target.getBoundingClientRect().top + window.scrollY - 20;
      if (lenis) lenis.scrollTo(y); else window.scrollTo({ top: y, behavior: 'smooth' });
    });
  });

  /* ---------------- Desktop narrative: canvas crossfade + pinned scroll ---------------- */
  if (window.matchMedia('(min-width: 901px)').matches) {
    initDesktopNarrative();
  }

  ScrollTrigger.refresh();
});

/* ============================================================
   DESKTOP NARRATIVE ENGINE
   Canvas fixo com crossfade de vídeo + scroll-container gigante.
   Só é chamado quando a viewport inicial é ≥901px (ver acima).
   ============================================================ */
function initDesktopNarrative() {
  const VIDEO_SRCS = [
    'assets/video/sobre.mp4',
    'assets/video/trabalhista.mp4',
    'assets/video/criminal.mp4',
    'assets/video/civil.mp4',
    'assets/video/familia.mp4',
    'assets/video/empresarial-vertical.mp4',
    'assets/video/previdenciario-vertical.mp4',
    'assets/video/tributario-vertical.mp4',
    'assets/video/diferenciais.mp4',
    'assets/video/processo.mp4',
    'assets/video/cta.mp4',
  ];
  const BREAKS = [0, 0.091, 0.182, 0.273, 0.364, 0.455, 0.545, 0.636, 0.727, 0.818, 0.909];
  const STATS_ENTER = 0.727;
  const STATS_LEAVE = 0.818;

  const canvas = document.getElementById('canvas');
  const canvasWrap = document.getElementById('canvas-wrap');
  const darkOverlay = document.getElementById('dark-overlay');
  const scrollCont = document.getElementById('scroll-container');
  if (!canvas || !scrollCont) return;
  const ctx = canvas.getContext('2d');

  let videoEls = [];
  let currentIdx = 0;
  let prevIdx = -1;
  let blendStart = null;
  const BLEND_MS = 600;

  function resizeCanvas() {
    const dpr = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
    ctx.scale(dpr, dpr);
  }

  function drawPaddedCover(el) {
    if (!el) return;
    const cw = window.innerWidth, ch = window.innerHeight;
    const iw = el.videoWidth || 0, ih = el.videoHeight || 0;
    if (!iw || !ih) return;
    const scale = Math.max(cw / iw, ch / ih);
    const dw = iw * scale, dh = ih * scale;
    const dx = (cw - dw) / 2, dy = (ch - dh) / 2;
    ctx.fillStyle = '#080808';
    ctx.fillRect(0, 0, cw, ch);
    ctx.drawImage(el, dx, dy, dw, dh);
  }

  function drawLoop(timestamp) {
    requestAnimationFrame(drawLoop);
    const cv = videoEls[currentIdx];
    const pv = prevIdx >= 0 ? videoEls[prevIdx] : null;
    let blend = 1;
    if (blendStart !== null) {
      blend = Math.min(1, (timestamp - blendStart) / BLEND_MS);
      if (blend >= 1) {
        blendStart = null;
        if (pv && pv !== cv) { pv.pause(); }
        prevIdx = -1;
      }
    }
    if (pv && pv !== cv && blend < 1) { ctx.globalAlpha = 1; drawPaddedCover(pv); }
    if (cv) { ctx.globalAlpha = blend; drawPaddedCover(cv); ctx.globalAlpha = 1; }
  }

  function getVideoIdx(p) {
    for (let i = BREAKS.length - 1; i >= 0; i--) if (p >= BREAKS[i]) return i;
    return 0;
  }

  function setActiveVideo(idx) {
    if (idx === currentIdx) return;
    prevIdx = currentIdx;
    currentIdx = idx;
    blendStart = performance.now();
    const nv = videoEls[idx];
    if (nv) { nv.currentTime = 0; nv.play().catch(() => {}); }
  }

  function loadVideos(onComplete) {
    let done = 0;
    let revealed = false;
    VIDEO_SRCS.forEach((src, i) => {
      const v = document.createElement('video');
      v.src = src;
      v.muted = true;
      v.loop = true;
      v.playsInline = true;
      v.preload = i === 0 ? 'auto' : 'metadata';
      let fired = false;
      const timeout = setTimeout(() => { if (!fired) { fired = true; ready(); } }, 4000);
      v.addEventListener('canplay', () => { if (!fired) { fired = true; clearTimeout(timeout); ready(); } }, { once: true });
      videoEls[i] = v;
      function ready() {
        done++;
        if (!revealed && i === 0) { revealed = true; onComplete(); }
        if (!revealed && done >= 2) { revealed = true; onComplete(); }
      }
    });
  }

  function positionSections() {
    const totalH = scrollCont.offsetHeight;
    document.querySelectorAll('.scroll-section').forEach((sec) => {
      const enter = parseFloat(sec.dataset.enter) / 100;
      const leave = parseFloat(sec.dataset.leave) / 100;
      sec.style.top = `${((enter + leave) / 2) * totalH}px`;
      sec.style.transform = 'translateY(-50%)';
    });
  }

  const sectionCfgs = [];
  function setupSections() {
    document.querySelectorAll('.scroll-section').forEach((sec) => {
      const type = sec.dataset.animation || 'fade-up';
      const persist = sec.dataset.persist === 'true';
      const enter = parseFloat(sec.dataset.enter) / 100;
      const leave = parseFloat(sec.dataset.leave) / 100;
      const children = [...sec.querySelectorAll(
        '.sec-label, .section-heading, .section-body, .section-note, .process-list li, .cta-button, .cta-deco, .btn, .stat'
      )];
      gsap.set(sec, { opacity: 0 });
      const tl = gsap.timeline({ paused: true, defaults: { ease: 'power3.out' } });
      switch (type) {
        case 'slide-left':
          gsap.set(children, { x: -80, opacity: 0 });
          tl.to(children, { x: 0, opacity: 1, stagger: 0.12, duration: 0.9 });
          break;
        case 'slide-right':
          gsap.set(children, { x: 80, opacity: 0 });
          tl.to(children, { x: 0, opacity: 1, stagger: 0.12, duration: 0.9 });
          break;
        case 'scale-up':
          gsap.set(children, { scale: 0.85, opacity: 0 });
          tl.to(children, { scale: 1, opacity: 1, stagger: 0.1, duration: 1.0, ease: 'power2.out' });
          break;
        case 'rotate-in':
          gsap.set(children, { y: 40, rotation: 3, opacity: 0 });
          tl.to(children, { y: 0, rotation: 0, opacity: 1, stagger: 0.1, duration: 0.9 });
          break;
        case 'stagger-up':
          gsap.set(children, { y: 60, opacity: 0 });
          tl.to(children, { y: 0, opacity: 1, stagger: 0.14, duration: 0.8 });
          break;
        case 'clip-reveal':
          gsap.set(children, { clipPath: 'inset(100% 0 0 0)', opacity: 0 });
          tl.to(children, { clipPath: 'inset(0% 0 0 0)', opacity: 1, stagger: 0.14, duration: 1.1, ease: 'power4.inOut' });
          break;
        default:
          gsap.set(children, { y: 50, opacity: 0 });
          tl.to(children, { y: 0, opacity: 1, stagger: 0.1, duration: 0.9 });
      }
      sectionCfgs.push({ sec, tl, enter, leave, persist, played: false });
    });
  }

  function updateSections(p) {
    sectionCfgs.forEach((cfg) => {
      const { sec, tl, enter, leave, persist } = cfg;
      const active = p >= enter && (persist || p <= leave);
      if (active) {
        if (!cfg.played) {
          cfg.played = true;
          gsap.to(sec, { opacity: 1, duration: 0.25, ease: 'power2.out' });
          sec.classList.add('is-active');
          tl.restart();
        }
      } else if (!persist && cfg.played) {
        cfg.played = false;
        gsap.to(sec, {
          opacity: 0, duration: 0.25, ease: 'power2.in',
          onComplete() { sec.classList.remove('is-active'); tl.pause(0); },
        });
      }
    });
  }

  function animateDesktopCounters() {
    document.querySelectorAll('.section-stats .stat-number').forEach((el) => {
      const target = parseFloat(el.dataset.value);
      gsap.fromTo(el, { textContent: 0 }, {
        textContent: target, duration: 1.8, ease: 'power1.out',
        snap: { textContent: 1 },
        onUpdate() { el.textContent = Math.round(parseFloat(el.textContent)); },
      });
    });
  }

  function updateOverlay(p) {
    if (!darkOverlay) return;
    const FADE = 0.03;
    let opacity = 0;
    if (p >= STATS_ENTER - FADE && p <= STATS_ENTER) opacity = (p - (STATS_ENTER - FADE)) / FADE;
    else if (p > STATS_ENTER && p < STATS_LEAVE) opacity = 0.55;
    else if (p >= STATS_LEAVE && p <= STATS_LEAVE + FADE) opacity = 0.55 * (1 - (p - STATS_LEAVE) / FADE);
    darkOverlay.style.opacity = opacity;
  }

  resizeCanvas();
  window.addEventListener('resize', () => { resizeCanvas(); positionSections(); });

  let statsDone = false;
  loadVideos(() => {
    if (videoEls[0]) { videoEls[0].currentTime = 0; videoEls[0].play().catch(() => {}); }
    requestAnimationFrame(drawLoop);
    gsap.to(canvasWrap, { opacity: 1, duration: 0.8, delay: 0.2 });

    positionSections();
    setupSections();

    ScrollTrigger.create({
      trigger: scrollCont,
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
      onUpdate(self) {
        const p = self.progress;
        setActiveVideo(getVideoIdx(p));
        updateSections(p);
        updateOverlay(p);
        if (p >= STATS_ENTER && p <= STATS_LEAVE && !statsDone) { statsDone = true; animateDesktopCounters(); }
        if (p < STATS_ENTER) statsDone = false;
      },
    });
  });
}
