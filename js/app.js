/* ═══════════════════════════════════════════
   CLASSIFIED PORTFOLIO — INTERACTIONS
   ═══════════════════════════════════════════ */

const TOTAL_PAGES = 10; // pages 0–9
let currentPage   = 0;
let isAnimating   = false;

const pageStack   = document.getElementById('pageStack');
const folder      = document.getElementById('folder');
const navBar      = document.getElementById('navBar');
const prevBtn     = document.getElementById('prevBtn');
const nextBtn     = document.getElementById('nextBtn');
const pageCounter = document.getElementById('pageCounter');
const openBtn     = document.getElementById('openBtn');
const closeBtn    = document.getElementById('closeBtn');

/* ─── helpers ──────────────────────────────── */
function getPage(n) { return document.getElementById('page-' + n); }

function showPage(n) {
  for (let i = 0; i < TOTAL_PAGES; i++) {
    const p = getPage(i);
    if (!p) continue;
    p.style.display = 'none';
    p.classList.remove('active');
  }
  const p = getPage(n);
  if (p) { p.style.display = 'flex'; p.classList.add('active'); }
}

function updateNav() {
  const label = currentPage === 7
    ? 'ANNEX A — SUPPLEMENTARY'
    : 'PAGE ' + (currentPage + 1) + ' OF ' + TOTAL_PAGES;
  pageCounter.textContent = label;
  prevBtn.disabled = (currentPage === 0);
  nextBtn.disabled = (currentPage === TOTAL_PAGES - 1);
}

/* ─── INTRO SEQUENCE ────────────────────────── */
function playIntro() {
  const tl = gsap.timeline({ delay: 0.3 });

  tl.from(folder, {
    y: 120, opacity: 0, duration: 0.9, ease: 'power3.out'
  })
  .to('#folderStamp', {
    scale: 1.15, opacity: 0.92, rotation: -8,
    duration: 0.25, ease: 'back.out(3)'
  })
  .to('#folderStamp', { scale: 1.05, duration: 0.06 })
  .to('#folderStamp', { scale: 1,    duration: 0.12 })
  .to('.open-btn',    { opacity: 1,  duration: 0.4, ease: 'power2.out' }, '+=0.2');
}

/* ─── OPEN FOLDER ───────────────────────────── */
openBtn.addEventListener('click', function () {
  const tl = gsap.timeline({
    onComplete: function () {
      folder.style.display = 'none';
      enterFile();
    }
  });

  tl.to('#folderFlap', {
    rotateX: -140, transformOrigin: 'bottom center',
    duration: 0.4, ease: 'power2.inOut'
  })
  .to(folder, {
    y: 80, scaleY: 0.85, opacity: 0,
    duration: 0.5, ease: 'power3.in'
  }, '-=0.1');
});

/* ─── ENTER FILE ────────────────────────────── */
function enterFile() {
  showPage(0);
  gsap.set(pageStack, { opacity: 0, y: 30 });
  pageStack.classList.add('visible');

  gsap.to(pageStack, {
    opacity: 1, y: 0, duration: 0.6, ease: 'power2.out',
    onComplete: function () {
      navBar.classList.add('visible');
      closeBtn.classList.add('visible');
      gsap.from(navBar,    { opacity: 0, y: 10,  duration: 0.3, ease: 'power2.out' });
      gsap.from(closeBtn,  { opacity: 0, x: 10,  duration: 0.3, ease: 'power2.out' });
      updateNav();
      animateCoverStamp();
      animatePageStamps(getPage(0));
    }
  });
}

/* ─── PAGE TRANSITION ───────────────────────── */
function goToPage(targetIndex, direction) {
  if (isAnimating) return;
  if (targetIndex < 0 || targetIndex >= TOTAL_PAGES) return;
  isAnimating = true;

  const fromPage = getPage(currentPage);
  const toPage   = getPage(targetIndex);

  toPage.style.display = 'flex';
  toPage.classList.add('active');
  gsap.set(toPage,   { zIndex: 1, opacity: 1, y: 0, rotation: 0, scale: 1 });
  gsap.set(fromPage, { zIndex: 2 });

  const tl = gsap.timeline({
    onComplete: function () {
      fromPage.style.display = 'none';
      fromPage.classList.remove('active');
      gsap.set(fromPage, { clearProps: 'all' });
      currentPage = targetIndex;
      isAnimating  = false;
      updateNav();
      animatePageStamps(toPage);
      if (targetIndex === 7) drawStrings();
    }
  });

  if (direction === 'forward') {
    tl.to(fromPage, {
      y: -14, scale: 1.015, rotation: 1,
      boxShadow: '0 40px 80px rgba(0,0,0,0.55)',
      duration: 0.18, ease: 'power2.in'
    })
    .to(fromPage, { y: '-108%', rotation: 2, scale: 1.02, duration: 0.42, ease: 'power3.in' })
    .from(toPage, { scale: 0.965, y: 12, duration: 0.32, ease: 'power2.out' }, '-=0.15');
  } else {
    tl.to(fromPage, { y: 14, scale: 0.99, duration: 0.15, ease: 'power2.in' })
    .to(fromPage, { y: '108%', rotation: -2, duration: 0.42, ease: 'power3.in' })
    .from(toPage, { scale: 1.015, y: -12, duration: 0.32, ease: 'power2.out' }, '-=0.15');
  }
}

/* ─── NAV ───────────────────────────────────── */
nextBtn.addEventListener('click', function () {
  if (currentPage < TOTAL_PAGES - 1) goToPage(currentPage + 1, 'forward');
});

prevBtn.addEventListener('click', function () {
  if (currentPage > 0) goToPage(currentPage - 1, 'backward');
});

document.addEventListener('keydown', function (e) {
  if (e.key === 'ArrowRight' || e.key === 'ArrowDown') nextBtn.click();
  if (e.key === 'ArrowLeft'  || e.key === 'ArrowUp')   prevBtn.click();
});

/* ─── STAMP ANIMATION ───────────────────────── */
function animatePageStamps(page) {
  if (!page) return;
  const stamps = page.querySelectorAll(
    '.stamp:not(.stamp-large):not(.stamp-avail)'
  );
  stamps.forEach(function (stamp, i) {
    const rot = parseFloat(stamp.dataset.rot) || 0;
    gsap.set(stamp, { opacity: 0, scale: 0, rotation: rot - 22 });

    gsap.timeline({ delay: 0.38 + i * 0.22 })
      .to(stamp, { scale: 1.18, rotation: rot + 3, opacity: 1, duration: 0.22, ease: 'back.out(2.5)' })
      .to(stamp, { scaleX: 1.06, scaleY: 0.94, duration: 0.06 })
      .to(stamp, { scaleX: 1,    scaleY: 1,    duration: 0.1  })
      .to(stamp, { scale: 1, rotation: rot, duration: 0.18, ease: 'power2.out' });
  });

  const avail = page.querySelector('.stamp-avail');
  if (avail) {
    gsap.set(avail, { opacity: 0, scale: 0, rotation: -20 });
    gsap.timeline({ delay: 0.4 })
      .to(avail, { scale: 1.2, opacity: 1, rotation: 2, duration: 0.25, ease: 'back.out(2.5)' })
      .to(avail, { scaleX: 1.08, scaleY: 0.92, duration: 0.06 })
      .to(avail, { scaleX: 1,    scaleY: 1,    duration: 0.1  })
      .to(avail, { scale: 1, rotation: 0, duration: 0.2, ease: 'power2.out' });
  }
}

function animateCoverStamp() {
  const stamp = document.querySelector('.stamp-large');
  if (!stamp) return;
  gsap.set(stamp, { opacity: 0, scale: 0, rotation: -28 });
  gsap.timeline({ delay: 0.7 })
    .to(stamp, { scale: 1.15, opacity: 1, rotation: -5, duration: 0.25, ease: 'back.out(2.5)' })
    .to(stamp, { scaleX: 1.08, scaleY: 0.93, duration: 0.06 })
    .to(stamp, { scaleX: 1,    scaleY: 1,    duration: 0.1  })
    .to(stamp, { scale: 1, rotation: -8, duration: 0.2, ease: 'power2.out' });
}

/* ─── REDACTED BARS ─────────────────────────── */
function initRedacted() {
  document.querySelectorAll('.redacted').forEach(function (el) {
    var bar  = el.querySelector('.redact-bar');
    var text = el.querySelector('.redact-text');
    if (!bar || !text) return;

    el.addEventListener('mouseenter', function () {
      gsap.to(bar,  { scaleX: 0, transformOrigin: 'right center', duration: 0.28, ease: 'power2.out' });
      gsap.to(text, { opacity: 1, duration: 0.22, delay: 0.12 });
    });
    el.addEventListener('mouseleave', function () {
      gsap.to(text, { opacity: 0, duration: 0.1 });
      gsap.to(bar,  { scaleX: 1, transformOrigin: 'right center', duration: 0.28, ease: 'power2.in', delay: 0.05 });
    });
  });
}

/* ─── CORK BOARD STRINGS ────────────────────── */
function drawStrings() {
  var svg = document.getElementById('corkStrings');
  if (!svg) return;
  svg.innerHTML = '';

  var connections = [
    ['cc-hvac',    'cc-anomaly'],
    ['cc-hvac',    'cc-forecast'],
    ['cc-anomaly', 'cc-ecg'],
    ['cc-llama',   'cc-interview'],
    ['cc-voice',   'cc-translate'],
    ['cc-voice',   'cc-content'],
    ['cc-gesture', 'cc-voice'],
    ['cc-books',   'cc-interview'],
  ];

  setTimeout(function () {
    var svgRect = svg.getBoundingClientRect();

    connections.forEach(function (pair) {
      var a = document.getElementById(pair[0]);
      var b = document.getElementById(pair[1]);
      if (!a || !b) return;

      var ar = a.getBoundingClientRect();
      var br = b.getBoundingClientRect();

      var x1 = ar.left + ar.width  / 2 - svgRect.left;
      var y1 = ar.top  + 8             - svgRect.top;
      var x2 = br.left + br.width  / 2 - svgRect.left;
      var y2 = br.top  + 8             - svgRect.top;

      var mx = (x1 + x2) / 2;
      var my = (y1 + y2) / 2 + 22;

      var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', 'M ' + x1 + ' ' + y1 + ' Q ' + mx + ' ' + my + ' ' + x2 + ' ' + y2);
      path.setAttribute('stroke', '#cc2222');
      path.setAttribute('stroke-width', '1.5');
      path.setAttribute('fill', 'none');
      path.setAttribute('opacity', '0.6');
      svg.appendChild(path);

      var length = path.getTotalLength();
      gsap.fromTo(path,
        { strokeDasharray: length, strokeDashoffset: length },
        { strokeDashoffset: 0, duration: 0.55, ease: 'power2.out', delay: Math.random() * 0.5 }
      );
    });
  }, 100);
}

/* ─── CORK CARD HOVER ───────────────────────── */
function initCorkCards() {
  document.querySelectorAll('.cork-card').forEach(function (card) {
    card.addEventListener('mouseenter', function () {
      gsap.to(card, { y: -6, duration: 0.2, ease: 'power2.out' });
    });
    card.addEventListener('mouseleave', function () {
      gsap.to(card, { y: 0, duration: 0.25, ease: 'power2.inOut' });
    });
  });
}

/* ─── CLOSE FILE ────────────────────────────── */
closeBtn.addEventListener('click', function () {
  if (isAnimating) return;

  // hide nav + close button
  gsap.to([navBar, closeBtn], { opacity: 0, duration: 0.25, onComplete: function () {
    navBar.classList.remove('visible');
    closeBtn.classList.remove('visible');
  }});

  // pages stack drops away
  gsap.to(pageStack, {
    y: 60, opacity: 0, scale: 0.96, duration: 0.5, ease: 'power3.in',
    onComplete: function () {
      pageStack.classList.remove('visible');
      pageStack.style.opacity = '';
      pageStack.style.transform = '';
      // hide current page
      for (var i = 0; i < TOTAL_PAGES; i++) {
        var p = getPage(i);
        if (p) { p.style.display = 'none'; p.classList.remove('active'); }
      }
      currentPage  = 0;
      isAnimating  = false;

      // bring folder back
      folder.style.display = '';
      gsap.set(folder, { y: 80, opacity: 0 });
      gsap.set('#folderStamp', { scale: 1, opacity: 0.92, rotation: -8 });
      gsap.set('.open-btn', { opacity: 1 });
      gsap.to(folder, { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' });
    }
  });
});

/* ─── BOOT ───────────────────────────────────── */
window.addEventListener('DOMContentLoaded', function () {
  for (var i = 0; i < TOTAL_PAGES; i++) {
    var p = getPage(i);
    if (p) p.style.display = 'none';
  }
  initRedacted();
  initCorkCards();
  playIntro();
});
