/* ──────────────────────────────────────────────
   Shekel v2 — interactions
   ────────────────────────────────────────────── */

(() => {
  const prefersReduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ─── Starfield (layered for parallax) ─── */
  const buildStarfield = (svg, count, baseR, baseOp, twinkleChance) => {
    if (!svg) return;
    const W = 1600, H = 2400;
    const ns = 'http://www.w3.org/2000/svg';
    const frag = document.createDocumentFragment();
    for (let i = 0; i < count; i++) {
      const c = document.createElementNS(ns, 'circle');
      const r = Math.random();
      const radius = baseR + Math.random() * baseR * 0.9;
      c.setAttribute('cx', Math.random() * W);
      c.setAttribute('cy', Math.random() * H);
      c.setAttribute('r', radius.toFixed(2));
      c.setAttribute('fill', r < 0.7 ? '#ffffff' : (r < 0.92 ? '#cfdcff' : '#9bb6ff'));
      const op = baseOp + Math.random() * 0.5;
      c.setAttribute('opacity', op.toFixed(2));
      if (!prefersReduced && Math.random() < twinkleChance) {
        const dur = (2.5 + Math.random() * 5).toFixed(2) + 's';
        const a = document.createElementNS(ns, 'animate');
        a.setAttribute('attributeName', 'opacity');
        a.setAttribute('values', `${op.toFixed(2)};${(op * 0.15).toFixed(2)};${op.toFixed(2)}`);
        a.setAttribute('dur', dur);
        a.setAttribute('repeatCount', 'indefinite');
        c.appendChild(a);
      }
      frag.appendChild(c);
    }
    svg.appendChild(frag);
  };
  buildStarfield(document.getElementById('starfieldFar'),  240, 0.35, 0.10, 0.10);
  buildStarfield(document.getElementById('starfieldMid'),  140, 0.7,  0.20, 0.20);
  buildStarfield(document.getElementById('starfieldNear'),  80, 1.1,  0.35, 0.28);

  /* ─── Mouse-parallax for starfield layers ─── */
  const sfFar  = document.getElementById('starfieldFar');
  const sfMid  = document.getElementById('starfieldMid');
  const sfNear = document.getElementById('starfieldNear');
  if (!prefersReduced && matchMedia('(pointer: fine)').matches) {
    let pmx = 0, pmy = 0;
    addEventListener('mousemove', e => {
      pmx = (e.clientX / innerWidth - 0.5) * 2;
      pmy = (e.clientY / innerHeight - 0.5) * 2;
    }, { passive: true });
    const pTick = () => {
      if (sfFar)  sfFar.style.transform  = `translate(${pmx * 6}px, ${pmy * 4}px)`;
      if (sfMid)  sfMid.style.transform  = `translate(${pmx * 14}px, ${pmy * 10}px)`;
      if (sfNear) sfNear.style.transform = `translate(${pmx * 26}px, ${pmy * 18}px)`;
      requestAnimationFrame(pTick);
    };
    pTick();
  }

  /* ─── Cursor trail ─── */
  if (!prefersReduced && matchMedia('(pointer: fine)').matches) {
    const dots = Array.from(document.querySelectorAll('.cursor-trail span'));
    const pos = dots.map(() => ({ x: -50, y: -50 }));
    let mx = -50, my = -50, running = false;
    addEventListener('mousemove', e => {
      mx = e.clientX;
      my = e.clientY;
      if (!running) { running = true; requestAnimationFrame(tick); }
    }, { passive: true });
    function tick() {
      pos[0].x += (mx - pos[0].x) * 0.4;
      pos[0].y += (my - pos[0].y) * 0.4;
      for (let i = 1; i < pos.length; i++) {
        pos[i].x += (pos[i - 1].x - pos[i].x) * 0.32;
        pos[i].y += (pos[i - 1].y - pos[i].y) * 0.32;
      }
      for (let i = 0; i < dots.length; i++) {
        dots[i].style.transform = `translate(${pos[i].x}px, ${pos[i].y}px) translate(-50%, -50%)`;
      }
      requestAnimationFrame(tick);
    }
  } else {
    const t = document.querySelector('.cursor-trail');
    if (t) t.remove();
    document.body.style.cursor = 'auto';
  }

  /* ─── Theme toggle ─── */
  const root = document.documentElement;
  const stored = localStorage.getItem('shekel-theme-v2');
  if (stored === 'light' || stored === 'dark') root.setAttribute('data-theme', stored);
  const themeBtn = document.getElementById('themeToggle');
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
      root.setAttribute('data-theme', next);
      localStorage.setItem('shekel-theme-v2', next);
    });
  }

  /* ─── Waitlist modal ─── */
  const modal = document.getElementById('signupModal');
  const formStep = modal && modal.querySelector('[data-step="form"]');
  const doneStep = modal && modal.querySelector('[data-step="done"]');
  const nameInput = document.getElementById('f-name');
  const emailInput = document.getElementById('f-email');
  const submitBtn = modal && modal.querySelector('.modal-submit');
  const counterAgents = document.getElementById('counterAgents');
  const counterWait = document.getElementById('counterWait');

  const showStep = (which) => {
    if (!modal) return;
    [formStep, doneStep].forEach(s => s && s.classList.remove('is-active'));
    const target = which === 'done' ? doneStep : formStep;
    if (target) target.classList.add('is-active');
  };

  const openModal = () => {
    if (!modal) return;
    showStep('form');
    modal.hidden = false;
    document.body.classList.add('modal-open');
    setTimeout(() => nameInput && nameInput.focus(), 200);
  };
  const closeModal = () => {
    if (!modal) return;
    modal.hidden = true;
    document.body.classList.remove('modal-open');
  };

  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('[data-signup]');
    if (trigger) {
      e.preventDefault();
      openModal();
      return;
    }
    const closer = e.target.closest('[data-close]');
    if (closer && modal && !modal.hidden) {
      e.preventDefault();
      closeModal();
    }
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && !modal.hidden) closeModal();
    // ⌘K / Ctrl+K opens the modal
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      openModal();
    }
  });

  // Hero search submit → open modal
  const heroSearch = document.getElementById('heroSearch');
  if (heroSearch) {
    heroSearch.addEventListener('submit', (e) => {
      e.preventDefault();
      openModal();
    });
  }

  // Form submit
  const form = document.getElementById('waitlistForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = (nameInput.value || '').trim();
      const email = (emailInput.value || '').trim();
      const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      let ok = true;
      nameInput.parentElement.classList.toggle('has-error', !name);
      emailInput.parentElement.classList.toggle('has-error', !emailOk);
      if (!name || !emailOk) return;

      submitBtn.classList.add('is-loading');
      setTimeout(() => {
        submitBtn.classList.remove('is-loading');
        const firstName = name.split(/\s+/)[0];
        const successName = document.getElementById('successName');
        const successEmail = document.getElementById('successEmail');
        if (successName) successName.textContent = firstName;
        if (successEmail) successEmail.textContent = email;
        // Bump waitlist counter
        if (counterWait) counterWait.textContent = '3,185';
        showStep('done');
      }, 1100);
    });

    // Clear error state on input
    [nameInput, emailInput].forEach(el => {
      el && el.addEventListener('input', () => el.parentElement.classList.remove('has-error'));
    });
  }

  /* ─── Nav scrolled ─── */
  const nav = document.getElementById('nav');
  const onScroll = () => {
    if (nav) nav.classList.toggle('scrolled', scrollY > 20);
  };
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ─── Reveal observer ─── */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry, idx) => {
        if (entry.isIntersecting) {
          const target = entry.target;
          // Stagger siblings if many revealed at once
          setTimeout(() => target.classList.add('revealed'), idx * 80);
          io.unobserve(target);
        }
      });
    }, { threshold: 0.18, rootMargin: '0px 0px -60px 0px' });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('revealed'));
  }

  /* ─── Agent card "revealed" (kicks off mini widget animations) ─── */
  if ('IntersectionObserver' in window) {
    const aio = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          aio.unobserve(entry.target);
        }
      });
    }, { threshold: 0.35 });
    document.querySelectorAll('.agent').forEach(el => aio.observe(el));

    // Dev stage (chart line draw)
    const dio = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          dio.unobserve(entry.target);
        }
      });
    }, { threshold: 0.35 });
    document.querySelectorAll('.dev-stage').forEach(el => dio.observe(el));
  }

  /* ─── Typewriter for command search ─── */
  const cmdTyped = document.getElementById('cmdTyped');
  if (cmdTyped) {
    const queries = [
      'review a contract',
      'write product descriptions',
      'design a floor plan',
      'summarize support tickets',
      'generate ad copy'
    ];
    let qi = 0, ci = 0, deleting = false;
    const tick = () => {
      const q = queries[qi];
      if (!deleting) {
        ci++;
        cmdTyped.textContent = q.slice(0, ci);
        if (ci >= q.length) {
          deleting = true;
          setTimeout(tick, 1800);
          return;
        }
        setTimeout(tick, 60 + Math.random() * 40);
      } else {
        ci--;
        cmdTyped.textContent = q.slice(0, ci);
        if (ci <= 0) {
          deleting = false;
          qi = (qi + 1) % queries.length;
          setTimeout(tick, 350);
          return;
        }
        setTimeout(tick, 26);
      }
    };
    if (!prefersReduced) {
      setTimeout(tick, 800);
    } else {
      cmdTyped.textContent = queries[0];
    }
  }

  /* ─── Typed product names (ShopScribe viz) ─── */
  const typedNames = document.querySelectorAll('.typed-name');
  if (typedNames.length && !prefersReduced && 'IntersectionObserver' in window) {
    const tio = new IntersectionObserver((entries) => {
      entries.forEach((entry, idx) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const txt = el.dataset.text || '';
        let i = 0;
        const baseDelay = 200 + idx * 280;
        setTimeout(function step() {
          el.textContent = txt.slice(0, ++i);
          if (i < txt.length) setTimeout(step, 22 + Math.random() * 30);
        }, baseDelay);
        tio.unobserve(el);
      });
    }, { threshold: 0.5 });
    typedNames.forEach(el => tio.observe(el));
  } else {
    typedNames.forEach(el => { el.textContent = el.dataset.text || ''; });
  }

  /* ─── Chip filter (dims non-matching cards) ─── */
  const chips = document.querySelectorAll('.chips .chip');
  const agentCards = document.querySelectorAll('.agent');
  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      chips.forEach(c => c.classList.remove('is-active'));
      chip.classList.add('is-active');
      const cat = chip.dataset.cat;
      agentCards.forEach(card => {
        if (cat === 'all' || card.dataset.cat === cat) {
          card.classList.remove('is-dim');
        } else {
          card.classList.add('is-dim');
        }
      });
    });
  });

  /* ─── Scrollytelling: How It Works ─── */
  const howSteps = document.querySelectorAll('.how-step');
  const howMascots = document.querySelectorAll('.how-mascot');
  const howDecors = document.querySelectorAll('.how-decor');
  if (howSteps.length && 'IntersectionObserver' in window) {
    const setActive = (n) => {
      howSteps.forEach(s => s.classList.toggle('is-active', s.dataset.step === n));
      howMascots.forEach(m => m.classList.toggle('is-active', m.dataset.step === n));
      howDecors.forEach(d => d.classList.toggle('is-active', d.dataset.step === n));
    };
    const hio = new IntersectionObserver((entries) => {
      // Pick the entry whose center is most stable in viewport
      let best = null, bestRatio = 0;
      entries.forEach(e => {
        if (e.isIntersecting && e.intersectionRatio > bestRatio) {
          best = e;
          bestRatio = e.intersectionRatio;
        }
      });
      if (best) setActive(best.target.dataset.step);
    }, { threshold: [0.35, 0.6, 0.85], rootMargin: '-30% 0px -30% 0px' });
    howSteps.forEach(s => hio.observe(s));
  }

  /* ─── Hero mascot parallax (gentle, 0.6x scroll) ─── */
  const mascotHero = document.querySelector('.mascot-hero');
  const nebula1 = document.querySelector('.nebula-1');
  const nebula2 = document.querySelector('.nebula-2');
  if (mascotHero && !prefersReduced) {
    let ticking = false;
    const onPx = () => {
      const y = scrollY;
      if (mascotHero) mascotHero.style.transform = `translateY(${-y * 0.18}px)`;
      // Stars / nebulae move slower (background) — handled via fixed positioning
      ticking = false;
    };
    addEventListener('scroll', () => {
      if (!ticking) { requestAnimationFrame(onPx); ticking = true; }
    }, { passive: true });
  }

  /* ─── Smooth-scroll for in-page nav (overrides default to ease) ─── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (!id || id === '#') return;
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ─── Constellation (decorative) ─── */
  const cn = document.getElementById('constellation');
  if (cn) {
    const ns = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(ns, 'svg');
    svg.setAttribute('viewBox', '0 0 400 400');
    svg.style.width = '100%';
    svg.style.height = '100%';
    const pts = [];
    for (let i = 0; i < 12; i++) {
      const x = 20 + Math.random() * 360;
      const y = 20 + Math.random() * 360;
      pts.push([x, y]);
      const c = document.createElementNS(ns, 'circle');
      c.setAttribute('cx', x); c.setAttribute('cy', y);
      c.setAttribute('r', 1 + Math.random() * 2);
      c.setAttribute('fill', '#60A5FA');
      svg.appendChild(c);
    }
    // Connect nearest neighbours
    for (let i = 0; i < pts.length; i++) {
      let best = -1, bd = 1e9;
      for (let j = 0; j < pts.length; j++) {
        if (i === j) continue;
        const d = Math.hypot(pts[i][0] - pts[j][0], pts[i][1] - pts[j][1]);
        if (d < bd) { bd = d; best = j; }
      }
      if (best > -1) {
        const l = document.createElementNS(ns, 'line');
        l.setAttribute('x1', pts[i][0]); l.setAttribute('y1', pts[i][1]);
        l.setAttribute('x2', pts[best][0]); l.setAttribute('y2', pts[best][1]);
        l.setAttribute('stroke', 'rgba(96,165,250,0.3)');
        l.setAttribute('stroke-width', '0.6');
        svg.appendChild(l);
      }
    }
    cn.appendChild(svg);
  }
})();
