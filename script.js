/* =========================================================
   MOBILE MENU TOGGLE
========================================================= */
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');

if (menuToggle && navLinks) {
  menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    menuToggle.classList.toggle('open');
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 768) {
        navLinks.classList.remove('active');
        menuToggle.classList.remove('open');
      }
    });
  });

  document.addEventListener('click', (e) => {
    if (window.innerWidth <= 768 && navLinks.classList.contains('active')) {
      const insideNav = navLinks.contains(e.target);
      const insideToggle = menuToggle.contains(e.target);
      if (!insideNav && !insideToggle) {
        navLinks.classList.remove('active');
        menuToggle.classList.remove('open');
      }
    }
  });
}

/* =========================================================
   ANIMATION 1: PARTICLE CONSTELLATION
========================================================= */
const canvas = document.getElementById('particleCanvas');
if (canvas) {
  const ctx = canvas.getContext('2d');
  let particles = [];
  let mouse = { x: null, y: null, radius: 150 };

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();

  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2 + 1;
      this.speedX = (Math.random() - 0.5) * 0.6;
      this.speedY = (Math.random() - 0.5) * 0.6;
      this.color = Math.random() > 0.5 ? '#00ffa3' : '#00d4ff';
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
      if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
    }
    draw() {
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function initParticles() {
    particles = [];
    const count = window.innerWidth < 768 ? 40 : 90;
    for (let i = 0; i < count; i++) {
      particles.push(new Particle());
    }
  }
  initParticles();

  function connectParticles() {
    for (let a = 0; a < particles.length; a++) {
      for (let b = a; b < particles.length; b++) {
        const dx = particles[a].x - particles[b].x;
        const dy = particles[a].y - particles[b].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 120) {
          ctx.strokeStyle = `rgba(0, 255, 163, ${0.15 - distance / 120 * 0.15})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(particles[a].x, particles[a].y);
          ctx.lineTo(particles[b].x, particles[b].y);
          ctx.stroke();
        }
      }

      // Mouse connection
      if (mouse.x !== null) {
        const dx = particles[a].x - mouse.x;
        const dy = particles[a].y - mouse.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < mouse.radius) {
          ctx.strokeStyle = `rgba(0, 255, 163, ${0.4 - distance / mouse.radius * 0.4})`;
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.moveTo(particles[a].x, particles[a].y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }
      }
    }
  }

  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    connectParticles();
    requestAnimationFrame(animateParticles);
  }
  animateParticles();

  window.addEventListener('resize', () => {
    resizeCanvas();
    initParticles();
  });

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });
}

/* =========================================================
   ANIMATION 2: TEXT SCRAMBLE on Hero
========================================================= */
function scrambleText(el) {
  const finalText = el.dataset.scramble || el.textContent;
  const chars = '!<>-_\\/[]{}—=+*^?#________';
  const duration = 1800;
  const frameRate = 30;
  const totalFrames = duration / frameRate;
  let frame = 0;

  // Preserve the HTML structure with gradient span
  const originalHTML = el.innerHTML;
  const hasGradientSpan = originalHTML.includes('gradient-text');

  if (hasGradientSpan) {
    // Split into parts: before, gradient, after
    const parts = originalHTML.split(/<span class="gradient-text[^"]*">|<\/span>/);
    // Simpler: just reveal whole text
    el.style.opacity = '1';
    return;
  }

  const interval = setInterval(() => {
    frame++;
    const progress = frame / totalFrames;
    let output = '';
    for (let i = 0; i < finalText.length; i++) {
      const threshold = i / finalText.length;
      if (progress > threshold + 0.2) {
        output += finalText[i];
      } else if (progress > threshold - 0.1) {
        output += chars[Math.floor(Math.random() * chars.length)];
      } else {
        output += ' ';
      }
    }
    el.textContent = output;
    if (frame >= totalFrames) {
      clearInterval(interval);
      el.textContent = finalText;
    }
  }, frameRate);
}

// Trigger scramble on hero h1 when visible
const kineticText = document.querySelector('.kinetic-text');
if (kineticText) {
  const scrambleObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Just show it — scramble is complex with gradient spans
        entry.target.style.opacity = '1';
        scrambleObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  scrambleObserver.observe(kineticText);
}

/* =========================================================
   ANIMATION 3: SCROLL SPOTLIGHT
========================================================= */
const spotlight = document.getElementById('scrollSpotlight');
if (spotlight) {
  window.addEventListener('mousemove', (e) => {
    spotlight.style.left = (e.clientX - 250) + 'px';
    spotlight.style.top = (e.clientY - 250) + 'px';
  });
}

/* =========================================================
   ANIMATION 4: CUSTOM CURSOR (Dot + Ring)
========================================================= */
const cursorDot = document.getElementById('cursorDot');
const cursorRing = document.getElementById('cursorRing');

if (cursorDot && cursorRing && window.innerWidth > 768) {
  let mouseX = 0, mouseY = 0;
  let ringX = 0, ringY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorDot.style.left = mouseX + 'px';
    cursorDot.style.top = mouseY + 'px';
  });

  function animateRing() {
    ringX += (mouseX - ringX) * 0.15;
    ringY += (mouseY - ringY) * 0.15;
    cursorRing.style.left = ringX + 'px';
    cursorRing.style.top = ringY + 'px';
    requestAnimationFrame(animateRing);
  }
  animateRing();

  const hoverTargets = document.querySelectorAll(
    'a, button, .btn, .skill-card, .project-card, .ach-card, .info-card, .stat-box, .liquid-btn, [data-magnetic]'
  );
  hoverTargets.forEach(el => {
    el.addEventListener('mouseenter', () => cursorRing.classList.add('hover'));
    el.addEventListener('mouseleave', () => cursorRing.classList.remove('hover'));
  });
}

/* =========================================================
   SECTION-WISE ANIMATIONS — Trigger on Scroll
========================================================= */
const sectionAnimObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in');
    }
  });
}, {
  threshold: 0.15,
  rootMargin: '-50px 0px -50px 0px'
});

document.querySelectorAll('[data-animate]').forEach(el => {
  sectionAnimObserver.observe(el);
});

/* =========================================================
   FORCE HERO REVEAL ON LOAD
========================================================= */
window.addEventListener('load', () => {
  const heroContent = document.querySelector('.hero-content');
  const heroVisual = document.querySelector('.hero-visual');
  const heroSection = document.querySelector('[data-animate="hero"]');

  if (heroContent) heroContent.classList.add('in');
  if (heroVisual) heroVisual.classList.add('in');
  if (heroSection) heroSection.classList.add('in');
});

// Also trigger immediately in case load event already fired
setTimeout(() => {
  const heroContent = document.querySelector('.hero-content');
  const heroVisual = document.querySelector('.hero-visual');
  const heroSection = document.querySelector('[data-animate="hero"]');
  if (heroContent) heroContent.classList.add('in');
  if (heroVisual) heroVisual.classList.add('in');
  if (heroSection) heroSection.classList.add('in');
}, 100);

/* =========================================================
   LEGACY REVEAL OBSERVER
========================================================= */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* =========================================================
   ANIMATION 5: DRAG SCROLL — Horizontal Carousel
========================================================= */
document.querySelectorAll('[data-drag-scroll]').forEach(el => {
  let isDown = false;
  let startX;
  let scrollLeft;

  el.addEventListener('mousedown', (e) => {
    isDown = true;
    el.classList.add('dragging');
    startX = e.pageX - el.offsetLeft;
    scrollLeft = el.scrollLeft;
  });

  el.addEventListener('mouseleave', () => {
    isDown = false;
    el.classList.remove('dragging');
  });

  el.addEventListener('mouseup', () => {
    isDown = false;
    el.classList.remove('dragging');
  });

  el.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - el.offsetLeft;
    const walk = (x - startX) * 1.5;
    el.scrollLeft = scrollLeft - walk;
  });

  let touchStartX = 0;
  let touchScrollLeft = 0;

  el.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].pageX;
    touchScrollLeft = el.scrollLeft;
  }, { passive: true });

  el.addEventListener('touchmove', (e) => {
    const x = e.touches[0].pageX;
    const walk = (touchStartX - x) * 1.5;
    el.scrollLeft = touchScrollLeft + walk;
  }, { passive: true });
});

/* =========================================================
   ANIMATION 6: MAGNETIC CARDS
========================================================= */
if (window.innerWidth > 768) {
  document.querySelectorAll('[data-magnetic]').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const moveX = (x - centerX) / 15;
      const moveY = (y - centerY) / 15;

      card.style.transform = `translate(${moveX}px, ${moveY}px)`;
      card.style.transition = 'transform 0.1s ease-out';
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)';
    });
  });
}

/* =========================================================
   TYPING EFFECT — ROTATING ROLES
========================================================= */
const typedEl = document.getElementById('typed');
const roles = [
  'Full Stack Applications',
  'GenAI-Powered Solutions',
  'RAG & LLM Systems',
  'Modern Web Experiences'
];

let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingSpeed = 90;

function typeLoop() {
  if (!typedEl) return;

  const currentRole = roles[roleIndex];

  if (!isDeleting) {
    typedEl.textContent = currentRole.substring(0, charIndex + 1);
    charIndex++;

    if (charIndex === currentRole.length) {
      isDeleting = true;
      typingSpeed = 1500;
    } else {
      typingSpeed = 90;
    }
  } else {
    typedEl.textContent = currentRole.substring(0, charIndex - 1);
    charIndex--;

    if (charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      typingSpeed = 400;
    } else {
      typingSpeed = 40;
    }
  }

  setTimeout(typeLoop, typingSpeed);
}

if (typedEl) {
  setTimeout(typeLoop, 800);
}

/* =========================================================
   ANIMATED NUMBER COUNTERS
========================================================= */
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const target = parseInt(el.dataset.count, 10);
      let current = 0;
      const step = Math.max(1, Math.ceil(target / 40));

      const timer = setInterval(() => {
        current += step;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        el.textContent = current + '+';
      }, 25);

      counterObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('[data-count]').forEach(el => counterObserver.observe(el));

/* =========================================================
   CURSOR GLOW (Background Glow)
========================================================= */
const cursorGlow = document.querySelector('.cursor-glow');

if (cursorGlow && window.innerWidth > 768) {
  document.addEventListener('mousemove', (e) => {
    cursorGlow.style.left = e.clientX + 'px';
    cursorGlow.style.top = e.clientY + 'px';
  });
}

/* =========================================================
   SCROLL PROGRESS BAR
========================================================= */
const progressBar = document.getElementById('scrollProgress');

if (progressBar) {
  window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const total = document.documentElement.scrollHeight - window.innerHeight;
    const percent = (scrolled / total) * 100;
    progressBar.style.width = percent + '%';
  });
}

/* =========================================================
   SECTION DOTS — Active State
========================================================= */
const sectionDots = document.querySelectorAll('.section-dots .dot');
const allSections = document.querySelectorAll('section[id]');

if (sectionDots.length && allSections.length) {
  window.addEventListener('scroll', () => {
    let current = '';
    allSections.forEach(sec => {
      const top = sec.offsetTop - 150;
      if (window.pageYOffset >= top) {
        current = sec.getAttribute('id');
      }
    });

    sectionDots.forEach(dot => {
      dot.classList.remove('active');
      if (dot.getAttribute('data-section') === current) {
        dot.classList.add('active');
      }
    });
  });
}

/* =========================================================
   PARALLAX EFFECT ON BLOBS
========================================================= */
const blob1 = document.querySelector('.blob-1');
const blob2 = document.querySelector('.blob-2');
const blob3 = document.querySelector('.blob-3');

if (blob1 && blob2 && blob3 && window.innerWidth > 768) {
  window.addEventListener('scroll', () => {
    const y = window.pageYOffset;
    blob1.style.transform = `translate(${y * 0.05}px, ${y * 0.08}px) scale(1)`;
    blob2.style.transform = `translate(${-y * 0.06}px, ${y * 0.05}px) scale(1)`;
    blob3.style.transform = `translate(${y * 0.04}px, ${-y * 0.07}px) scale(1)`;
  });
}

/* =========================================================
   3D TILT EFFECT ON CARDS
========================================================= */
if (window.innerWidth > 768) {
  document.querySelectorAll('.tilt').forEach(card => {
    if (card.hasAttribute('data-magnetic')) return;
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(900px) rotateX(${y * -6}deg) rotateY(${x * 6}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

/* =========================================================
   ANIMATION 7: LIQUID BUTTONS
========================================================= */
if (window.innerWidth > 768) {
  document.querySelectorAll('[data-liquid]').forEach(btn => {
    btn.addEventListener('mouseenter', () => {
      btn.style.transition = 'border-radius 0.3s ease';
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.borderRadius = '50px';
    });
  });
}

/* =========================================================
   MAGNETIC BUTTON EFFECT (old buttons without data-magnetic)
========================================================= */
if (window.innerWidth > 768) {
  document.querySelectorAll('.btn:not([data-liquid])').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });
}

/* =========================================================
   CONTACT FORM HANDLING
========================================================= */
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');

if (contactForm && formStatus) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const subject = document.getElementById('subject').value.trim();
    const message = document.getElementById('message').value.trim();

    if (!name || !email || !subject || !message) {
      formStatus.textContent = '⚠️ Please fill in all fields.';
      formStatus.className = 'form-status error';
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      formStatus.textContent = '⚠️ Please enter a valid email address.';
      formStatus.className = 'form-status error';
      return;
    }

    formStatus.textContent = '✓ Sending message...';
    formStatus.className = 'form-status';

    setTimeout(() => {
      formStatus.textContent = `✓ Thanks ${name}! I'll get back to you soon.`;
      formStatus.className = 'form-status success';
      contactForm.reset();

      setTimeout(() => {
        formStatus.textContent = '';
        formStatus.className = 'form-status';
      }, 5000);
    }, 1200);
  });
}

/* =========================================================
   SMOOTH SCROLL FOR ANCHOR LINKS
========================================================= */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href === '#') return;

    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      const offset = 76;
      const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* =========================================================
   ACTIVE NAV LINK ON SCROLL
========================================================= */
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a');

function updateActiveNav() {
  const scrollY = window.pageYOffset;

  sections.forEach(section => {
    const sectionTop = section.offsetTop - 100;
    const sectionHeight = section.offsetHeight;
    const sectionId = section.getAttribute('id');

    if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
      navAnchors.forEach(a => {
        a.classList.remove('active');
        if (a.getAttribute('href') === '#' + sectionId) {
          a.classList.add('active');
        }
      });
    }
  });
}

if (sections.length && navAnchors.length) {
  window.addEventListener('scroll', updateActiveNav);
}

/* =========================================================
   THEME TOGGLE (Press 'T' to switch)
========================================================= */
document.addEventListener('keydown', (e) => {
  if (e.key === 't' || e.key === 'T') {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    document.body.classList.toggle('theme-crimson');
  }
});
