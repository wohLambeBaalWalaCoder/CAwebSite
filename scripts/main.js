/**
 * L R B & Company - Main JavaScript
 * Handles navigation, animations, and UI interactions
 */

document.addEventListener("DOMContentLoaded", () => {
  initNavbar();
  initMobileMenu();
  initScrollAnimations();
  initSmoothScroll();
  initCounterAnimations();
});

/**
 * Navbar scroll behavior
 */
function initNavbar() {
  const navbar = document.querySelector(".navbar");
  if (!navbar) return;

  const handleScroll = () => {
    if (window.scrollY > 50) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  };

  window.addEventListener("scroll", handleScroll, { passive: true });
  handleScroll(); // Check initial state
}

/**
 * Mobile menu toggle
 */
function initMobileMenu() {
  const toggle = document.querySelector(".navbar__toggle");
  const menu = document.querySelector(".navbar__menu");
  const links = document.querySelectorAll(".navbar__link");

  // Create overlay element
  const overlay = document.createElement("div");
  overlay.className = "navbar-overlay";
  document.body.appendChild(overlay);

  if (!toggle || !menu) return;

  const closeMenu = () => {
    menu.classList.remove("open");
    toggle.classList.remove("active");
    overlay.classList.remove("active");
    document.body.style.overflow = "";

    // hide overlay completely after transition
    setTimeout(() => {
      if (!menu.classList.contains("open")) overlay.style.display = "none";
    }, 250);
  };

  const toggleMenu = () => {
    const isOpen = menu.classList.toggle("open");
    toggle.classList.toggle("active");

    if (isOpen) {
      overlay.style.display = "block";
      // Force reflow
      void overlay.offsetWidth;
      overlay.classList.add("active");
      document.body.style.overflow = "hidden";
    } else {
      closeMenu();
    }
  };

  toggle.addEventListener("click", toggleMenu);
  overlay.addEventListener("click", closeMenu);

  // Close menu when clicking a link
  links.forEach((link) => {
    link.addEventListener("click", closeMenu);
  });
}

/**
 * Scroll-triggered animations
 */
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll("[data-animate]");
  if (animatedElements.length === 0) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const delay = entry.target.dataset.animateDelay || 0;
          setTimeout(() => {
            entry.target.classList.add("visible");
          }, delay);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    },
  );

  animatedElements.forEach((el) => observer.observe(el));
}

/**
 * Smooth scroll for anchor links
 */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");
      if (targetId === "#") return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();
      const navbarHeight = document.querySelector(".navbar")?.offsetHeight || 0;
      const targetPosition =
        target.getBoundingClientRect().top + window.scrollY - navbarHeight;

      window.scrollTo({
        top: targetPosition,
        behavior: "smooth",
      });
    });
  });
}

/**
 * Animated counters for stats
 */
function initCounterAnimations() {
  const counters = document.querySelectorAll("[data-counter]");
  if (counters.length === 0) return;

  const animateCounter = (counter) => {
    const target = parseInt(counter.dataset.counter, 10);
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;

    const updateCounter = () => {
      current += step;
      if (current < target) {
        counter.textContent = Math.floor(current);
        requestAnimationFrame(updateCounter);
      } else {
        counter.textContent = target;
        // Add suffix if specified
        if (counter.dataset.counterSuffix) {
          counter.textContent += counter.dataset.counterSuffix;
        }
      }
    };

    updateCounter();
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 },
  );

  counters.forEach((counter) => observer.observe(counter));
}

/**
 * Active nav link highlighting based on current page
 */
function setActiveNavLink() {
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll(".navbar__link");

  navLinks.forEach((link) => {
    const href = link.getAttribute("href");
    if (
      currentPath.endsWith(href) ||
      (currentPath === "/" && href === "index.html")
    ) {
      link.classList.add("active");
    }
  });
}

// Run on load
setActiveNavLink();

/**
 * Utility: Debounce function
 */
function debounce(func, wait = 100) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Utility: Throttle function
 */
function throttle(func, limit = 100) {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}
