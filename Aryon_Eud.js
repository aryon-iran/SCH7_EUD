/* ═══════════════════════════════════
   Aryon Studio | Aryon_Eud.js
   Sch7 — v1405
   ═══════════════════════════════════ */

(() => {
  'use strict';

  const isDesktop = window.matchMedia('(min-width: 993px)').matches;

  /* ─── 1. HEADER SCROLL ─── */
  const header = document.getElementById('header');
  const onScroll = () => {
    header?.classList.toggle('scrolled', window.scrollY > 20);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ─── 2. CUSTOM CURSOR ─── */
  if (isDesktop) {
    const cursor = document.getElementById('cursor');
    const dot = document.getElementById('cursorDot');

    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let cx = mx, cy = my;

    window.addEventListener('mousemove', e => {
      mx = e.clientX;
      my = e.clientY;
      if (dot) {
        dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
      }
    });

    const animateCursor = () => {
      cx += (mx - cx) * 0.18;
      cy += (my - cy) * 0.18;
      if (cursor) {
        cursor.style.transform = `translate(${cx}px, ${cy}px) translate(-50%, -50%)`;
      }
      requestAnimationFrame(animateCursor);
    };
    animateCursor();

    // Hover effect
    const hoverTargets = document.querySelectorAll(
      'a, button, input, textarea, select, .work-card, .service-card, .info-item'
    );
    hoverTargets.forEach(el => {
      el.addEventListener('mouseenter', () => cursor?.classList.add('hover'));
      el.addEventListener('mouseleave', () => cursor?.classList.remove('hover'));
    });
  }

  /* ─── 3. MOBILE MENU ─── */
  const burger = document.getElementById('burger');
  const nav = document.getElementById('nav');

  burger?.addEventListener('click', e => {
    e.stopPropagation();
    nav.classList.toggle('open');
    burger.classList.toggle('active');
  });

  nav?.querySelectorAll('a').forEach(a =>
    a.addEventListener('click', () => {
      nav.classList.remove('open');
      burger.classList.remove('active');
    })
  );

  document.addEventListener('click', e => {
    if (!nav || !burger) return;
    if (!nav.contains(e.target) && !burger.contains(e.target)) {
      nav.classList.remove('open');
      burger.classList.remove('active');
    }
  });

  /* ─── 4. ACTIVE NAV LINK ─── */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const navObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const id = e.target.id;
        navLinks.forEach(l =>
          l.classList.toggle('active', l.getAttribute('href') === `#${id}`)
        );
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px' });

  sections.forEach(s => navObs.observe(s));

  /* ─── 5. REVEAL ON SCROLL ─── */
  const revealObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        revealObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('[data-reveal]').forEach((el, i) => {
    el.style.transitionDelay = `${Math.min(i * 40, 240)}ms`;
    revealObs.observe(el);
  });

  /* ─── 6. COUNTERS ─── */
  const toFa = n => n.toLocaleString('fa-IR');

  const counters = document.querySelectorAll('[data-count]');
  const countObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const target = +el.dataset.count;
      const suffix = el.dataset.suffix || '';
      const dur = 1400;
      const start = performance.now();

      const tick = now => {
        const p = Math.min((now - start) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        const val = Math.floor(target * eased);
        el.textContent = toFa(val) + suffix;
        if (p < 1) requestAnimationFrame(tick);
        else el.textContent = toFa(target) + suffix;
      };
      requestAnimationFrame(tick);
      countObs.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(c => countObs.observe(c));

  /* ─── 7. SMOOTH SCROLL ─── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      if (id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 90;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* ─── 8. 3D TILT ─── */
  if (isDesktop) {
    document.querySelectorAll('[data-tilt]').forEach(el => {
      const maxTilt = 6;

      el.addEventListener('mousemove', e => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        el.style.transform =
          `perspective(1200px) rotateY(${x * maxTilt}deg) rotateX(${-y * maxTilt}deg) translateY(-4px)`;
      });

      el.addEventListener('mouseleave', () => {
        el.style.transform = '';
      });
    });
  }

  /* ─── 9. CONTACT FORM ─── */
  const form = document.getElementById('contactForm');
  form?.addEventListener('submit', e => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const html = btn.innerHTML;

    btn.innerHTML = '✓ پیام ارسال شد';
    btn.style.background = 'linear-gradient(135deg, #4ade80, #22c55e)';
    btn.disabled = true;

    setTimeout(() => {
      btn.innerHTML = html;
      btn.style.background = '';
      btn.disabled = false;
      form.reset();
    }, 2200);
  });

  /* ─── 10. PARALLAX ON FLOATING TAGS ─── */
  if (isDesktop) {
    const tags = document.querySelectorAll('.floating-tag');
    window.addEventListener('mousemove', e => {
      const x = (e.clientX / window.innerWidth - 0.5) * 20;
      const y = (e.clientY / window.innerHeight - 0.5) * 20;
      tags.forEach((t, i) => {
        const factor = (i + 1) * 0.5;
        t.style.marginTop = `${y * factor}px`;
        t.style.marginRight = `${x * factor}px`;
      });
    });
  }

})();