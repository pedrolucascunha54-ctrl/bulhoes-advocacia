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

  ScrollTrigger.refresh();
});
