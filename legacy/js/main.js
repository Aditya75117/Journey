(function () {
  'use strict';

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var header = document.getElementById('header');
  var menuToggle = document.querySelector('.menu-toggle');
  var siteNav = document.getElementById('site-nav');
  var navLinks = document.querySelectorAll('.site-nav__link');
  var sections = document.querySelectorAll('section[id]');
  var statNumbers = document.querySelectorAll('[data-count]');
  var processTimeline = document.getElementById('process-timeline');

  /* --- Sticky header on scroll --- */
  function handleHeaderScroll() {
    if (window.scrollY > 50) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }
  }

  window.addEventListener('scroll', handleHeaderScroll, { passive: true });
  handleHeaderScroll();

  /* --- Mobile menu toggle --- */
  function toggleMenu(forceClose) {
    var isOpen = forceClose === true ? false : menuToggle.getAttribute('aria-expanded') !== 'true';
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    siteNav.classList.toggle('is-open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }

  menuToggle.addEventListener('click', function () {
    toggleMenu();
  });

  navLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      toggleMenu(true);
    });
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && siteNav.classList.contains('is-open')) {
      toggleMenu(true);
      menuToggle.focus();
    }
  });

  /* --- Smooth scroll with header offset --- */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      if (targetId === '#') return;

      var target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();
      var headerHeight = header.offsetHeight;
      var top = target.getBoundingClientRect().top + window.scrollY - headerHeight;

      window.scrollTo({
        top: top,
        behavior: prefersReducedMotion ? 'auto' : 'smooth'
      });
    });
  });

  /* --- Intersection Observer: reveal animations --- */
  var revealElements = document.querySelectorAll('.reveal, .reveal-stagger');

  if ('IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');

            if (entry.target.id === 'stats-grid') {
              animateCounters();
            }

            if (entry.target.id === 'process-timeline') {
              entry.target.classList.add('is-visible');
            }

            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );

    revealElements.forEach(function (el) {
      revealObserver.observe(el);
    });

    if (processTimeline) {
      revealObserver.observe(processTimeline);
    }
  } else {
    revealElements.forEach(function (el) {
      el.classList.add('is-visible');
    });
  }

  /* --- Nav spy: highlight active section --- */
  if ('IntersectionObserver' in window) {
    var navObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var id = entry.target.getAttribute('id');
            navLinks.forEach(function (link) {
              link.classList.toggle('active', link.getAttribute('data-section') === id);
            });
          }
        });
      },
      { threshold: 0.3, rootMargin: '-' + header.offsetHeight + 'px 0px -50% 0px' }
    );

    sections.forEach(function (section) {
      navObserver.observe(section);
    });
  }

  /* --- Stat counter animation --- */
  var countersAnimated = false;

  function animateCounters() {
    if (countersAnimated || prefersReducedMotion) {
      statNumbers.forEach(function (el) {
        el.textContent = el.getAttribute('data-count') + (el.getAttribute('data-suffix') || '');
      });
      countersAnimated = true;
      return;
    }

    countersAnimated = true;
    var duration = 1500;

    statNumbers.forEach(function (el) {
      var target = parseInt(el.getAttribute('data-count'), 10);
      var suffix = el.getAttribute('data-suffix') || '';
      var start = 0;
      var startTime = null;

      function step(timestamp) {
        if (!startTime) startTime = timestamp;
        var progress = Math.min((timestamp - startTime) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        var current = Math.floor(eased * target);
        el.textContent = current + (progress >= 1 ? suffix : '');
        if (progress < 1) {
          requestAnimationFrame(step);
        }
      }

      requestAnimationFrame(step);
    });
  }

  /* --- Hero reveals on load --- */
  var heroReveals = document.querySelectorAll('.hero .reveal, .hero .reveal-stagger');
  setTimeout(function () {
    heroReveals.forEach(function (el) {
      el.classList.add('is-visible');
    });
  }, 100);
})();
