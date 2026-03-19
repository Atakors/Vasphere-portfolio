/* ========================================
   VASphere Portfolio — JavaScript
   Language toggle, scroll effects, mobile nav
   ======================================== */

(function () {
  'use strict';

  // ──────────── Language Toggle ────────────
  let currentLang = 'en';
  const langToggle = document.getElementById('langToggle');
  const html = document.documentElement;

  function setLanguage(lang) {
    currentLang = lang;

    if (lang === 'ar') {
      html.setAttribute('dir', 'rtl');
      html.setAttribute('lang', 'ar');
    } else {
      html.setAttribute('dir', 'ltr');
      html.setAttribute('lang', 'en');
    }

    // Update all elements with data-en / data-ar attributes
    document.querySelectorAll('[data-en][data-ar]').forEach(el => {
      const text = el.getAttribute(`data-${lang}`);
      if (text) {
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.tagName === 'SELECT') {
          // For form elements, don't change inner content
        } else {
          el.innerHTML = text;
        }
      }
    });

    // Update placeholders
    document.querySelectorAll('[data-placeholder-en][data-placeholder-ar]').forEach(el => {
      el.placeholder = el.getAttribute(`data-placeholder-${lang}`) || '';
    });

    // Update select options
    document.querySelectorAll('select option[data-en][data-ar]').forEach(opt => {
      opt.textContent = opt.getAttribute(`data-${lang}`);
    });

    // Update lang toggle button
    if (langToggle) {
      langToggle.setAttribute('aria-label', lang === 'ar' ? 'Switch to English' : 'التبديل إلى العربية');
    }

  }

  if (langToggle) {
    langToggle.addEventListener('click', () => {
      setLanguage(currentLang === 'en' ? 'ar' : 'en');
    });
  }

  // ──────────── Mobile Navigation ────────────
  const mobileToggle = document.getElementById('mobileToggle');
  const nav = document.getElementById('nav');

  function openMobileNav() {
    nav.classList.add('nav--mobile-open');
    mobileToggle.setAttribute('aria-expanded', 'true');

    // Add close button
    if (!nav.querySelector('.mobile-close')) {
      const closeBtn = document.createElement('button');
      closeBtn.className = 'mobile-close';
      closeBtn.setAttribute('aria-label', 'Close menu');
      closeBtn.innerHTML = '✕';
      closeBtn.addEventListener('click', closeMobileNav);
      nav.prepend(closeBtn);
    }

    // Add lang toggle to mobile nav
    if (!nav.querySelector('.mobile-lang')) {
      const mobileLang = langToggle.cloneNode(true);
      mobileLang.className = 'lang-toggle mobile-lang';
      mobileLang.style.marginTop = '2rem';
      mobileLang.addEventListener('click', () => {
        setLanguage(currentLang === 'en' ? 'ar' : 'en');
      });
      nav.querySelector('.nav__list').after(mobileLang);
    }

    // Add WhatsApp to mobile nav
    if (!nav.querySelector('.mobile-wa')) {
      const mobileWa = document.createElement('a');
      mobileWa.href = 'https://wa.me/213558655085';
      mobileWa.target = '_blank';
      mobileWa.rel = 'noopener noreferrer';
      mobileWa.className = 'btn btn--accent mobile-wa';
      mobileWa.style.marginTop = '1rem';
      mobileWa.textContent = currentLang === 'ar' ? 'واتساب' : 'WhatsApp Us';
      nav.querySelector('.nav__list').after(mobileWa);
    }

    // Close on link click
    nav.querySelectorAll('.nav__link').forEach(link => {
      link.addEventListener('click', closeMobileNav, { once: true });
    });
  }

  function closeMobileNav() {
    nav.classList.remove('nav--mobile-open');
    mobileToggle.setAttribute('aria-expanded', 'false');
  }

  if (mobileToggle) {
    mobileToggle.addEventListener('click', () => {
      if (nav.classList.contains('nav--mobile-open')) {
        closeMobileNav();
      } else {
        openMobileNav();
      }
    });
  }

  // ──────────── Header Scroll State ────────────
  const header = document.getElementById('header');
  let lastScrollY = 0;

  function handleScroll() {
    const scrollY = window.scrollY;

    if (scrollY > 50) {
      header.classList.add('header--scrolled');
    } else {
      header.classList.remove('header--scrolled');
    }

    lastScrollY = scrollY;
  }

  window.addEventListener('scroll', handleScroll, { passive: true });

  // ──────────── Scroll Reveal Fallback ────────────
  // For browsers that don't support scroll-driven animations
  if (!CSS.supports || !CSS.supports('animation-timeline', 'scroll()')) {
    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -60px 0px',
      threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    document.querySelectorAll('.fade-in').forEach(el => {
      observer.observe(el);
    });
  }

  // ──────────── Contact Form Handler ────────────
  window.handleFormSubmit = function (e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);

    // Build WhatsApp message
    const name = formData.get('name') || '';
    const email = formData.get('email') || '';
    const service = formData.get('service') || '';
    const message = formData.get('message') || '';

    const waMessage = encodeURIComponent(
      `Hello! I'm ${name}\n` +
      `Email: ${email}\n` +
      `Interested in: ${service}\n` +
      `Message: ${message}`
    );

    // Show success state
    form.innerHTML = `
      <div class="form-success">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
          <polyline points="22 4 12 14.01 9 11.01"/>
        </svg>
        <h3>${currentLang === 'ar' ? 'شكراً لك!' : 'Thank you!'}</h3>
        <p>${currentLang === 'ar' ? 'سيتم فتح واتساب لإكمال التواصل...' : 'Opening WhatsApp to continue the conversation...'}</p>
      </div>
    `;

    // Open WhatsApp
    setTimeout(() => {
      window.open(`https://wa.me/213558655085?text=${waMessage}`, '_blank');
    }, 800);
  };

  // ──────────── Smooth scroll for anchor links ────────────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

})();
