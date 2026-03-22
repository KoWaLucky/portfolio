// ========== i18n Translator ==========
let currentLang = localStorage.getItem('carma-lang') || 'ru';

function getNested(obj, path) {
  return path.split('.').reduce((o, k) => (o && o[k]), obj);
}

function applyTranslations(lang) {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.ru;
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const val = getNested(t, key);
    if (val !== undefined) {
      if (el.tagName === 'TITLE') {
        document.title = val;
      } else {
        el.innerHTML = val;
      }
    }
  });
}

const LANG_CODES = { ru: 'ru', en: 'en', de: 'de', es: 'es', pt: 'pt', th: 'th' };

function initTranslator() {
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const lang = btn.dataset.lang;
      currentLang = TRANSLATIONS[lang] ? lang : 'ru';
      localStorage.setItem('carma-lang', currentLang);
      document.documentElement.lang = LANG_CODES[currentLang] || 'ru';
      document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      applyTranslations(currentLang);
    });
  });
  currentLang = TRANSLATIONS[currentLang] ? currentLang : 'ru';
  document.documentElement.lang = LANG_CODES[currentLang] || 'ru';
  document.querySelector(`.lang-btn[data-lang="${currentLang}"]`)?.classList.add('active');
  applyTranslations(currentLang);
}

// DOM Elements
const nav = document.getElementById('nav');
const heroSection = document.getElementById('hero');
const aboutSection = document.getElementById('about');
const portfolioSection = document.getElementById('portfolio');
const contactSection = document.getElementById('contact');
const projectCards = document.querySelectorAll('.project-card');
const navLinks = document.querySelectorAll('.nav-menu a');

// Navigation scroll behavior
let lastScrollTop = 0;
let scrollTimeout;

function handleNavScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Show/hide nav based on scroll direction
    if (scrollTop > lastScrollTop && scrollTop > 100) {
        nav.classList.add('hidden');
    } else {
        nav.classList.remove('hidden');
    }
    
    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
}

// Throttled scroll handler
function throttledScrollHandler() {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(handleNavScroll, 10);
}

// Enhanced smooth scroll for navigation links
function handleSmoothScroll(e) {
    e.preventDefault();
    const targetId = this.getAttribute('href').substring(1);
    const targetElement = document.getElementById(targetId);
    
    if (targetElement) {
        const navHeight = nav ? nav.offsetHeight : 0;
        const offsetTop = targetElement.offsetTop - navHeight - 20;
        
        // Remove any existing smooth scroll behavior
        document.documentElement.style.scrollBehavior = 'auto';
        
        // Use requestAnimationFrame for smooth custom scrolling
        smoothScrollToPosition(offsetTop, 800);
    }
}

// Custom smooth scroll function
function smoothScrollToPosition(targetPosition, duration = 800) {
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let startTime = null;
    
    function ease(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    }
    
    function animation(currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const run = ease(timeElapsed, startPosition, distance, duration);
        window.scrollTo(0, run);
        
        if (timeElapsed < duration) {
            requestAnimationFrame(animation);
        }
    }
    
    requestAnimationFrame(animation);
}

// Intersection Observer for animations
const observerOptions = {
    root: null,
    rootMargin: '0px 0px -100px 0px',
    threshold: 0.1
};

function createFadeInObserver() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { root: null, rootMargin: '-50px 0px -50px 0px', threshold: 0.1 });

    const sectionsToObserve = [aboutSection, portfolioSection, contactSection];
    sectionsToObserve.forEach(section => {
        if (section) {
            section.classList.add('animate-in');
            observer.observe(section);
        }
    });

    projectCards.forEach((card, index) => {
        card.classList.add('animate-in');
        card.style.transitionDelay = `${index * 0.08}s`;
        observer.observe(card);
    });
}

// Active nav link highlighting
function updateActiveNavLink() {
    const scrollPosition = window.scrollY + 150;
    
    const sections = [
        { element: heroSection, link: 'hero' },
        { element: aboutSection, link: 'about' },
        { element: portfolioSection, link: 'portfolio' },
        { element: contactSection, link: 'contact' }
    ];
    
    let currentSection = 'hero'; // default
    
    sections.forEach(section => {
        if (section.element) {
            const sectionTop = section.element.offsetTop;
            const sectionHeight = section.element.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSection = section.link;
            }
        }
    });
    
    // Update active nav link
    navLinks.forEach(link => link.classList.remove('active'));
    const activeLink = document.querySelector(`a[href="#${currentSection}"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }
}

// Project card hover effects
function enhanceProjectCards() {
    projectCards.forEach(card => {
        const img = card.querySelector('img');
        const overlay = card.querySelector('.project-overlay');
        
        // Initial styling
        if (img) {
            img.style.filter = 'grayscale(20%)';
            img.style.transition = 'all 0.4s ease';
        }
        
        card.addEventListener('mouseenter', () => {
            if (img) {
                img.style.filter = 'grayscale(0%) brightness(1.1)';
                img.style.transform = 'scale(1.05)';
            }
        });
        
        card.addEventListener('mouseleave', () => {
            if (img) {
                img.style.filter = 'grayscale(20%)';
                img.style.transform = 'scale(1)';
            }
        });
    });
}

// Image lazy loading with fade-in effect
function setupImageLoading() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    images.forEach(img => {
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.6s ease';
        
        img.addEventListener('load', () => {
            img.style.opacity = '1';
        });
        
        // Fallback for already loaded images
        if (img.complete) {
            img.style.opacity = '1';
        }
    });
}

// Contact links enhancement
function enhanceContactLinks() {
 const links = document.querySelectorAll('.contact-link');
 
 links.forEach(link => {
 if (link) {
   link.style.transition = 'all 0.3s ease';
   link.addEventListener('click', (e) => {
                // Add click animation
                link.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    link.style.transform = 'scale(1)';
                }, 150);
            });
            
            link.addEventListener('mouseenter', () => {
                link.style.transform = 'translateY(-2px)';
            });
            
 link.addEventListener('mouseleave', () => {
   link.style.transform = 'translateY(0)';
 });
 }
 });
}

// Scroll to top functionality
function addScrollToTop() {
    const scrollToTopBtn = document.createElement('button');
    scrollToTopBtn.innerHTML = '↑';
    scrollToTopBtn.className = 'scroll-to-top';
    scrollToTopBtn.style.cssText = `
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        width: 50px;
        height: 50px;
        border: 1px solid var(--color-border);
        background: var(--color-surface);
        color: var(--color-text);
        border-radius: 50%;
        font-size: 1.2rem;
        cursor: pointer;
        opacity: 0;
        transform: translateY(20px);
        transition: all 0.3s ease;
        z-index: 1000;
        backdrop-filter: blur(10px);
    `;
    
    document.body.appendChild(scrollToTopBtn);
    
    // Show/hide scroll to top button
    function toggleScrollToTop() {
        if (window.pageYOffset > 300) {
            scrollToTopBtn.style.opacity = '1';
            scrollToTopBtn.style.transform = 'translateY(0)';
        } else {
            scrollToTopBtn.style.opacity = '0';
            scrollToTopBtn.style.transform = 'translateY(20px)';
        }
    }
    
    scrollToTopBtn.addEventListener('click', () => {
        smoothScrollToPosition(0, 600);
    });
    
    scrollToTopBtn.addEventListener('mouseenter', () => {
        scrollToTopBtn.style.transform = 'translateY(0) scale(1.1)';
    });
    
    scrollToTopBtn.addEventListener('mouseleave', () => {
        scrollToTopBtn.style.transform = 'translateY(0) scale(1)';
    });
    
    window.addEventListener('scroll', toggleScrollToTop);
}

// Initialize navigation
function initNavigation() {
    // Ensure smooth scroll is disabled on document to prevent conflicts
    document.documentElement.style.scrollBehavior = 'auto';
    
    // Add click handlers to all navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', handleSmoothScroll);
        console.log(`Added click handler to: ${link.href}`); // Debug log
    });
    
    console.log(`Navigation initialized with ${navLinks.length} links`); // Debug log
}

// Enhanced error handling
function handleErrors() {
    window.addEventListener('error', (e) => {
        console.error('An error occurred:', e.error);
    });
    
    // Handle missing images gracefully
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('error', (e) => {
            console.log('Image failed to load:', img.src);
            img.style.display = 'none';
            const parent = img.closest('.project-image');
            if (parent) {
                parent.style.backgroundColor = 'var(--color-bg-1)';
                parent.innerHTML = '<div style="display: flex; align-items: center; justify-content: center; height: 100%; color: var(--color-text-secondary); font-size: 0.9rem;">Изображение недоступно</div>';
            }
        });
    });
}

// Performance optimization
function optimizePerformance() {
    // Debounce resize events
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            updateActiveNavLink();
        }, 250);
    });
    
    // Passive scroll listeners where possible
    window.addEventListener('scroll', throttledScrollHandler, { passive: true });
    window.addEventListener('scroll', updateActiveNavLink, { passive: true });
}

// Remove preload for entrance animations
function initPreload() {
  requestAnimationFrame(() => {
    document.body.classList.remove('preload');
  });
}

// Burger menu (mobile)
function initBurger() {
  const burger = document.getElementById('navBurger');
  const nav = document.getElementById('nav');
  if (burger && nav) {
    burger.addEventListener('click', () => {
      nav.classList.toggle('open');
      document.body.style.overflow = nav.classList.contains('open') ? 'hidden' : '';
    });
    document.querySelectorAll('.nav-menu a').forEach(link => {
      link.addEventListener('click', () => nav.classList.remove('open'));
    });
  }
}

// Contact form -> Telegram
function initContactForm() {
  const form = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');
  if (!form || !status) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = form.querySelector('.form-submit');
    const origText = btn.textContent;
    btn.disabled = true;
    status.textContent = '';
    status.className = 'form-status';

    const api = form.dataset.api || (window.location.origin + '/api/contact');
    const data = new FormData(form);

    try {
      const r = await fetch(api, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Object.fromEntries(data))
      });
      const t = TRANSLATIONS[currentLang] || TRANSLATIONS.ru;
      if (r.ok) {
        status.textContent = t.form?.success || 'Отправлено!';
        status.classList.add('success');
        form.reset();
      } else {
        status.textContent = t.form?.error || 'Ошибка. Попробуйте позже.';
        status.classList.add('error');
      }
    } catch (err) {
      status.textContent = (TRANSLATIONS[currentLang] || TRANSLATIONS.ru).form?.error || 'Ошибка. Попробуйте позже.';
      status.classList.add('error');
    }
    btn.disabled = false;
    btn.textContent = origText;
  });
}

// Main initialization function
function init() {
  initPreload();
  initBurger();
  if (typeof initTranslator === 'function') initTranslator();
  initContactForm();
  initNavigation();
    
    // Initialize animations and effects
    createFadeInObserver();
    enhanceProjectCards();
    setupImageLoading();
    enhanceContactLinks();
    addScrollToTop();
    
    // Initial calls
    updateActiveNavLink();
    
    // Add loading class removal after page load
    window.addEventListener('load', () => {
        document.body.classList.add('loaded');
        console.log('Page fully loaded'); // Debug log
    });
    
    // Keyboard navigation support
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const overlays = document.querySelectorAll('.project-overlay');
            overlays.forEach(overlay => {
                overlay.style.opacity = '0';
            });
        }
        
        // Arrow key navigation
        if (e.key === 'ArrowDown' && e.ctrlKey) {
            e.preventDefault();
            const currentSection = getCurrentSection();
            scrollToNextSection(currentSection);
        } else if (e.key === 'ArrowUp' && e.ctrlKey) {
            e.preventDefault();
            const currentSection = getCurrentSection();
            scrollToPrevSection(currentSection);
        }
    });
    
    console.log('Portfolio application initialized successfully'); // Debug log
}

// Helper functions for keyboard navigation
function getCurrentSection() {
    const scrollPosition = window.scrollY + 150;
    const sections = ['hero', 'about', 'portfolio', 'contact'];
    
    for (let i = 0; i < sections.length; i++) {
        const element = document.getElementById(sections[i]);
        if (element) {
            const sectionTop = element.offsetTop;
            const sectionHeight = element.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                return sections[i];
            }
        }
    }
    return 'hero';
}

function scrollToNextSection(currentSection) {
    const sections = ['hero', 'about', 'portfolio', 'contact'];
    const currentIndex = sections.indexOf(currentSection);
    const nextIndex = Math.min(currentIndex + 1, sections.length - 1);
    const targetElement = document.getElementById(sections[nextIndex]);
    
    if (targetElement) {
        const navHeight = nav ? nav.offsetHeight : 0;
        const offsetTop = targetElement.offsetTop - navHeight - 20;
        smoothScrollToPosition(offsetTop, 800);
    }
}

function scrollToPrevSection(currentSection) {
    const sections = ['hero', 'about', 'portfolio', 'contact'];
    const currentIndex = sections.indexOf(currentSection);
    const prevIndex = Math.max(currentIndex - 1, 0);
    const targetElement = document.getElementById(sections[prevIndex]);
    
    if (targetElement) {
        const navHeight = nav ? nav.offsetHeight : 0;
        const offsetTop = targetElement.offsetTop - navHeight - 20;
        smoothScrollToPosition(offsetTop, 800);
    }
}

// Start the application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    init();
    handleErrors();
    optimizePerformance();
});