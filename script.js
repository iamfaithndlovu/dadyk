/* =====================================================
   DADY.K CONSTRUCTION — script.js
   Pure vanilla JS, no frameworks
   ===================================================== */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {

    /* ================================================
       NAVBAR — scroll state + active link
    ================================================ */
    var navbar   = document.getElementById('navbar');
    var navLinks = document.querySelectorAll('.nav-links a');
    var sections = document.querySelectorAll('section[id]');

    function onScroll() {
      // Toggle scrolled class
      if (window.scrollY > 60) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
      // Highlight active link
      var current = '';
      sections.forEach(function (sec) {
        if (window.scrollY >= sec.offsetTop - 110) {
          current = sec.getAttribute('id');
        }
      });
      navLinks.forEach(function (link) {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + current) {
          link.classList.add('active');
        }
      });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    /* ================================================
       MOBILE HAMBURGER MENU
    ================================================ */
    var hamburger       = document.getElementById('hamburger');
    var navLinksWrapper = document.getElementById('nav-links');

    function closeMenu() {
      hamburger.classList.remove('open');
      navLinksWrapper.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    }

    hamburger.addEventListener('click', function () {
      var isOpen = navLinksWrapper.classList.contains('open');
      if (isOpen) {
        closeMenu();
      } else {
        hamburger.classList.add('open');
        navLinksWrapper.classList.add('open');
        hamburger.setAttribute('aria-expanded', 'true');
      }
    });

    navLinksWrapper.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });

    document.addEventListener('click', function (e) {
      if (!navbar.contains(e.target) && navLinksWrapper.classList.contains('open')) {
        closeMenu();
      }
    });

    /* ================================================
       SMOOTH SCROLL FOR ANCHOR LINKS
    ================================================ */
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        var target = document.querySelector(this.getAttribute('href'));
        if (!target) return;
        e.preventDefault();
        var offset = 80;
        var top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: top, behavior: 'smooth' });
      });
    });

    /* ================================================
       SCROLL REVEAL
    ================================================ */
    var revealSelectors = [
      '.service-card',
      '.stat',
      '.step',
      '.proj-card',
      '.testi-card',
      '.about-text',
      '.about-images',
      '.contact-info',
      '.contact-form-wrap'
    ];

    var revealEls = document.querySelectorAll(revealSelectors.join(', '));

    revealEls.forEach(function (el) {
      el.classList.add('reveal');
    });

    if ('IntersectionObserver' in window) {
      var revealObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry, i) {
          if (entry.isIntersecting) {
            setTimeout(function () {
              entry.target.classList.add('visible');
            }, i * 55);
            revealObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

      revealEls.forEach(function (el) {
        revealObserver.observe(el);
      });
    } else {
      // Fallback for old browsers
      revealEls.forEach(function (el) {
        el.classList.add('visible');
      });
    }

    /* ================================================
       PROJECT FILTER
    ================================================ */
    var filterBtns = document.querySelectorAll('.filter-btn');
    var projCards  = document.querySelectorAll('.proj-card');

    filterBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        filterBtns.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');

        var filter = btn.getAttribute('data-filter');

        projCards.forEach(function (card) {
          if (filter === 'all' || card.getAttribute('data-category') === filter) {
            card.classList.remove('hidden');
            card.style.animation = 'cardFadeIn 0.38s ease forwards';
          } else {
            card.classList.add('hidden');
          }
        });
      });
    });

    // Inject card fade keyframe
    var ks = document.createElement('style');
    ks.textContent = '@keyframes cardFadeIn { from { opacity:0; transform:scale(0.96); } to { opacity:1; transform:scale(1); } }';
    document.head.appendChild(ks);

    /* ================================================
       TESTIMONIAL SLIDER (mobile / tablet)
    ================================================ */
    var testiCards    = document.querySelectorAll('.testi-card');
    var testiDots     = document.querySelectorAll('.tdot');
    var currentTesti  = 0;
    var testiInterval = null;

    function showTesti(idx) {
      testiCards.forEach(function (c, i) {
        c.style.display = i === idx ? 'block' : 'none';
      });
      testiDots.forEach(function (d) {
        d.classList.remove('active');
        d.setAttribute('aria-selected', 'false');
      });
      if (testiDots[idx]) {
        testiDots[idx].classList.add('active');
        testiDots[idx].setAttribute('aria-selected', 'true');
      }
      currentTesti = idx;
    }

    function isSliderMode() {
      return window.innerWidth <= 1024;
    }

    function startTestitimer() {
      clearInterval(testiInterval);
      testiInterval = setInterval(function () {
        if (isSliderMode()) {
          showTesti((currentTesti + 1) % testiCards.length);
        }
      }, 4800);
    }

    testiDots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        clearInterval(testiInterval);
        showTesti(parseInt(dot.getAttribute('data-idx'), 10));
        startTestitimer();
      });
    });

    function handleResize() {
      if (isSliderMode()) {
        showTesti(currentTesti);
        startTestitimer();
      } else {
        clearInterval(testiInterval);
        testiCards.forEach(function (c) { c.style.display = ''; });
      }
    }

    window.addEventListener('resize', handleResize);
    handleResize();

    /* ================================================
       WHATSAPP FLOATING BUTTON
    ================================================ */
    var waFloat  = document.getElementById('wa-float');
    var waFab    = document.getElementById('wa-fab');
    var waPopup  = document.getElementById('wa-popup');
    var waClose  = document.getElementById('wa-close');
    var waIconChat  = waFab.querySelector('.wa-icon-chat');
    var waIconClose = waFab.querySelector('.wa-icon-close');

    function openWaPopup() {
      waPopup.classList.add('open');
      waIconChat.style.display  = 'none';
      waIconClose.style.display = 'block';
      waFab.setAttribute('aria-label', 'Close WhatsApp chat');
    }

    function closeWaPopup() {
      waPopup.classList.remove('open');
      waIconChat.style.display  = 'block';
      waIconClose.style.display = 'none';
      waFab.setAttribute('aria-label', 'Open WhatsApp chat');
    }

    // Auto-open popup after 3.5 seconds
    setTimeout(openWaPopup, 3500);

    waFab.addEventListener('click', function (e) {
      e.stopPropagation();
      if (waPopup.classList.contains('open')) {
        closeWaPopup();
      } else {
        openWaPopup();
      }
    });

    waClose.addEventListener('click', function (e) {
      e.stopPropagation();
      closeWaPopup();
    });

    document.addEventListener('click', function (e) {
      if (!waFloat.contains(e.target) && waPopup.classList.contains('open')) {
        closeWaPopup();
      }
    });

    /* ================================================
       CONTACT FORM
    ================================================ */
    var contactForm  = document.getElementById('contact-form');
    var submitBtn    = document.getElementById('submit-btn');
    var btnText      = document.getElementById('btn-text');
    var formSuccess  = document.getElementById('form-success');

    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      // Validate required fields
      var requiredFields = contactForm.querySelectorAll('[required]');
      var valid = true;

      requiredFields.forEach(function (field) {
        field.classList.remove('error');
        if (!field.value.trim()) {
          field.classList.add('error');
          valid = false;
        }
      });

      // Basic email check
      var emailField = document.getElementById('email');
      if (emailField.value && !emailField.value.includes('@')) {
        emailField.classList.add('error');
        valid = false;
      }

      if (!valid) return;

      // Simulate send
      submitBtn.disabled = true;
      btnText.textContent = 'Sending...';

      setTimeout(function () {
        submitBtn.style.display = 'none';
        formSuccess.classList.add('show');
        contactForm.reset();
      }, 1400);
    });

    // Remove error state on input
    contactForm.querySelectorAll('input, textarea').forEach(function (field) {
      field.addEventListener('input', function () {
        this.classList.remove('error');
      });
    });

  });

})();
