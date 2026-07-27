/* ═══════════════════════════════════════════════════════════════════
   Lighthouse BSD City — script.js
   Nav · FAQ Accordion · Counter Animation · Scroll Reveal · Form
   ═══════════════════════════════════════════════════════════════════ */


// ── Mobile nav toggle ─────────────────────────────────────────────
const navToggle = document.getElementById('nav-toggle');
const navLinks  = document.getElementById('nav-links');

if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    navToggle.classList.toggle('open', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
  document.addEventListener('click', (e) => {
    if (!navLinks.contains(e.target) && !navToggle.contains(e.target)) {
      navLinks.classList.remove('open');
      navToggle.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    }
  });
}

// ── Nav shadow on scroll ──────────────────────────────────────────
const siteNav = document.getElementById('site-nav');
if (siteNav) {
  window.addEventListener('scroll', () => {
    siteNav.style.boxShadow = window.scrollY > 20
      ? '0 2px 24px rgba(0,0,0,0.28)' : 'none';
  }, { passive: true });
}

// ── Nav logo fades in on scroll past hero ─────────────────────────
(function () {
  const heroSection = document.getElementById('hero');
  const navLogoPill = document.getElementById('nav-logo-pill');
  if (!heroSection || !navLogoPill) return;

  function update() {
    const heroH    = heroSection.offsetHeight;
    const progress = Math.min(window.scrollY / (heroH * 0.4), 1);
    navLogoPill.style.opacity   = String(progress.toFixed(3));
    navLogoPill.style.transform = `scale(${(0.85 + 0.15 * progress).toFixed(3)})`;
  }

  window.addEventListener('scroll', update, { passive: true });
  update();
})();

// ── Hero GIF: play once, freeze on last frame via loop-detection ─────
(function () {
  const img = document.getElementById('hero-gif-bg');
  if (!img) return;

  // Tiny off-screen canvas for frame fingerprinting only — never in DOM
  const sc  = document.createElement('canvas');
  sc.width  = 48; sc.height = 36;
  const sCtx = sc.getContext('2d');

  let firstSig   = null;   // fingerprint of the very first frame
  let lastSnapURL = null;   // full-res PNG of the most recent frame
  let startMs    = null;
  let frozen     = false;
  const MIN_PLAY_MS = 2500; // don't freeze for at least 2.5 s
  let lastSnapMs  = 0;

  function fingerprint() {
    try {
      sCtx.clearRect(0, 0, 48, 36);
      sCtx.drawImage(img, 0, 0, 48, 36);
      const d = sCtx.getImageData(0, 0, 48, 36).data;
      let s = 0;
      for (let i = 0; i < d.length; i += 12) s += d[i] * 3 + d[i+1] * 5 + d[i+2] * 2;
      return s;
    } catch (e) { return null; }
  }

  function snapFullFrame() {
    try {
      const w = img.naturalWidth  || img.width  || 1280;
      const h = img.naturalHeight || img.height || 720;
      const fc = document.createElement('canvas');
      fc.width = w; fc.height = h;
      fc.getContext('2d').drawImage(img, 0, 0, w, h);
      return fc.toDataURL('image/png'); // lossless → same quality as source frame
    } catch (e) { return null; }
  }

  function tick() {
    if (frozen) return;
    const now = Date.now();
    if (!startMs) startMs = now;
    const elapsed = now - startMs;

    const sig = fingerprint();
    if (sig === null) { requestAnimationFrame(tick); return; }

    if (firstSig === null) {
      // Record the very first frame we can read
      firstSig = sig;
      lastSnapURL = snapFullFrame();
    } else if (elapsed > MIN_PLAY_MS) {
      // After the minimum play time, watch for the GIF looping back to frame 1
      if (Math.abs(sig - firstSig) < 800 && lastSnapURL) {
        // We've returned near the first frame — the GIF has looped.
        // Freeze on the last good snapshot (the actual last frame).
        img.src = lastSnapURL;
        frozen = true;
        return;
      }
      // Capture a fresh full-res snapshot every ~400 ms for the "last frame" backup
      if (now - lastSnapMs > 400) {
        const snap = snapFullFrame();
        if (snap) lastSnapURL = snap;
        lastSnapMs = now;
      }
    }

    requestAnimationFrame(tick);
  }

  function start() { requestAnimationFrame(tick); }
  if (img.complete && img.naturalWidth) start();
  else img.addEventListener('load', start);
})();

// ── FAQ Accordion ─────────────────────────────────────────────────
document.querySelectorAll('.faq-q').forEach(btn => {
  btn.addEventListener('click', () => {
    const item   = btn.closest('.faq-item');
    const answer = item.querySelector('.faq-a');
    const isOpen = item.classList.contains('open');

    // Close all others
    document.querySelectorAll('.faq-item.open').forEach(openItem => {
      if (openItem !== item) {
        openItem.classList.remove('open');
        openItem.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
        const a = openItem.querySelector('.faq-a');
        a.classList.remove('open');
        a.hidden = true;
      }
    });

    // Toggle current
    if (isOpen) {
      item.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
      answer.classList.remove('open');
      answer.hidden = true;
    } else {
      item.classList.add('open');
      btn.setAttribute('aria-expanded', 'true');
      answer.hidden = false;
      requestAnimationFrame(() => answer.classList.add('open'));
    }
  });
});

// ── Counter animation ─────────────────────────────────────────────
function animateCounter(el) {
  const target   = parseInt(el.dataset.target, 10);
  const duration = 1800;
  const start    = performance.now();

  function tick(now) {
    const elapsed  = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // Ease-out cubic
    const eased    = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(eased * target);
    if (progress < 1) requestAnimationFrame(tick);
    else el.textContent = target;
  }

  requestAnimationFrame(tick);
}

// ── Scroll-reveal + counter trigger ──────────────────────────────
const revealEls = document.querySelectorAll(
  '.stat-card, .feature-row, .step, .who-card, .faq-item, .story-slideshow'
);

if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const siblings = Array.from(entry.target.parentElement.children);
      const delay    = siblings.indexOf(entry.target) * 90;
      setTimeout(() => entry.target.classList.add('visible'), delay);
      revealObserver.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach(el => revealObserver.observe(el));

  // Counter: trigger when stat section enters view
  const counterEls = document.querySelectorAll('.stat-number[data-target]');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    });
  }, { threshold: 0.5 });

  counterEls.forEach(el => counterObserver.observe(el));
}

// ── Lead capture form ─────────────────────────────────────────────
const leadForm  = document.getElementById('lead-form');
const submitBtn = document.getElementById('submit-btn');
const formMsg   = document.getElementById('form-message');

if (leadForm) {
  leadForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    formMsg.className = 'form-message';
    formMsg.textContent = '';

    const parent_name  = leadForm.parent_name.value.trim();
    const whatsapp     = leadForm.whatsapp.value.trim();
    const child_name   = leadForm.child_name.value.trim();
    const child_grade  = leadForm.child_grade.value.trim();
    const child_school = leadForm.child_school.value.trim();
    const notes        = leadForm.notes.value.trim();
    const subjects     = Array.from(
      leadForm.querySelectorAll('input[name="subjects"]:checked')
    ).map(cb => cb.value);

    if (!parent_name || !whatsapp || !child_name || !child_grade) {
      showMsg('error', 'Please fill in all required fields (marked with *).');
      return;
    }

    submitBtn.disabled = true;
    const origText = submitBtn.textContent;
    submitBtn.textContent = 'Sending…';

    try {
      const res  = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ parent_name, whatsapp, child_name, child_grade, child_school, subjects, notes }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        showMsg('success', data.message || 'Thank you! We\'ll reach out within 24 hours.');
        leadForm.reset();
        formMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      } else {
        showMsg('error', data.error || 'Something went wrong. Please try again.');
      }
    } catch (_) {
      showMsg('error', 'Could not send your details. Please contact us directly on WhatsApp.');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = origText;
    }
  });

  function showMsg(type, text) {
    formMsg.className = `form-message form-message--${type}`;
    formMsg.textContent = text;
  }
}

// ── Smooth scroll for anchor links ───────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

// ── Storyboard slideshow ──────────────────────────────────────────
(function () {
  const slideshowEl   = document.getElementById('story-slideshow');
  const panels        = document.querySelectorAll('.story-panel');
  const captionEl     = document.getElementById('story-caption');
  const dotsAll       = document.querySelectorAll('.story-dot');
  const progressFill  = document.getElementById('story-progress-fill');
  const DURATION      = 2800;

  if (!panels.length) return;

  let current   = 0;
  let slideTimer = null;
  let progRaf    = null;

  function goTo(idx) {
    panels[current].classList.remove('active');
    dotsAll[current].classList.remove('active');
    current = (idx + panels.length) % panels.length;
    panels[current].classList.add('active');
    dotsAll[current].classList.add('active');
    if (captionEl) {
      captionEl.style.opacity = '0';
      setTimeout(() => {
        captionEl.textContent = panels[current].dataset.caption;
        captionEl.style.opacity = '1';
      }, 180);
    }
    restartProgress();
  }

  function restartProgress() {
    if (!progressFill) return;
    progressFill.style.transition = 'none';
    progressFill.style.width = '0%';
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        progressFill.style.transition = `width ${DURATION}ms linear`;
        progressFill.style.width = '100%';
      });
    });
  }

  function startAuto() {
    if (slideTimer) return;
    slideTimer = setInterval(() => goTo(current + 1), DURATION);
    restartProgress();
  }

  function stopAuto() {
    clearInterval(slideTimer);
    slideTimer = null;
    if (progressFill) {
      const curr = getComputedStyle(progressFill).width;
      progressFill.style.transition = 'none';
      progressFill.style.width = curr;
    }
  }

  // Pause on hover
  slideshowEl?.addEventListener('mouseenter', stopAuto);
  slideshowEl?.addEventListener('mouseleave', startAuto);

  // Dot clicks
  dotsAll.forEach((dot, i) => {
    dot.addEventListener('click', () => { stopAuto(); goTo(i); startAuto(); });
  });

  // Arrow buttons
  document.getElementById('slide-prev')?.addEventListener('click', (e) => {
    e.stopPropagation();
    stopAuto(); goTo(current - 1); startAuto();
  });
  document.getElementById('slide-next')?.addEventListener('click', (e) => {
    e.stopPropagation();
    stopAuto(); goTo(current + 1); startAuto();
  });

  // Touch swipe support
  let touchStartX = 0;
  const frame = document.getElementById('slideshow-frame');
  frame?.addEventListener('touchstart', (e) => { touchStartX = e.touches[0].clientX; }, { passive: true });
  frame?.addEventListener('touchend', (e) => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) { stopAuto(); goTo(diff > 0 ? current + 1 : current - 1); startAuto(); }
  });

  startAuto();
})();

// ── 3D card tilt on hover ─────────────────────────────────────────
document.querySelectorAll('.who-card, .stat-card').forEach(card => {
  card.addEventListener('mouseenter', () => {
    card.style.transition = 'transform 0.08s ease, box-shadow 0.2s ease';
  });
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width  - 0.5) * 12;
    const y = ((e.clientY - rect.top)  / rect.height - 0.5) * 12;
    card.style.transform = `perspective(700px) rotateX(${-y}deg) rotateY(${x}deg) translateY(-4px) scale(1.02)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transition = 'transform 0.4s ease, box-shadow 0.2s ease';
    card.style.transform = '';
  });
});

// ── Active nav section highlight on scroll ────────────────────────
(function () {
  const sectionEls = document.querySelectorAll('section[id]');
  const navLinkEls = document.querySelectorAll('.nav-links a[href^="#"]');
  if (!('IntersectionObserver' in window) || !navLinkEls.length) return;

  const navObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const id = entry.target.id;
      navLinkEls.forEach(link => {
        link.classList.toggle('nav-active', link.getAttribute('href') === `#${id}`);
      });
    });
  }, { threshold: 0.35, rootMargin: '-64px 0px 0px 0px' });

  sectionEls.forEach(s => navObs.observe(s));
})();
