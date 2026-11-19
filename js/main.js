/**
 * MEGHANA PORTFOLIO - MAIN INTERACTIVE JAVASCRIPT
 * Features:
 * - Dynamic typing effect
 * - Theme Switcher (Dark / Light) with LocalStorage
 * - Mobile Navigation Menu & Backdrop
 * - Active Navigation Link Highlighting on Scroll
 * - Intersection Observer Scroll Reveals
 * - Interactive Stat Counter Animations
 * - Skill & Project Category Filtering
 * - Project Details Modal System
 * - Real-Time Form Validation & Toast Notification System
 * - Back to Top Button
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initTypingEffect();
  initNavbar();
  initScrollSpy();
  initScrollReveal();
  initStatsCounter();
  initSkillsFilter();
  initProjectsFilter();
  initProjectModal();
  initContactForm();
  initBackToTop();
  initResumeDownload();
});

/* --------------------------------------------------------------------------
   1. THEME SWITCHER (Dark / Light Mode)
   -------------------------------------------------------------------------- */
function initTheme() {
  const themeToggle = document.getElementById('theme-toggle');
  const htmlElement = document.documentElement;
  
  // Check localStorage or system preference
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  if (savedTheme) {
    htmlElement.setAttribute('data-theme', savedTheme);
  } else if (!prefersDark) {
    htmlElement.setAttribute('data-theme', 'light');
  }

  themeToggle.addEventListener('click', () => {
    const currentTheme = htmlElement.getAttribute('data-theme') || 'dark';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    htmlElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    showToast(`Switched to ${newTheme === 'dark' ? 'Dark' : 'Light'} theme`, 'info');
  });
}

/* --------------------------------------------------------------------------
   2. DYNAMIC TYPING EFFECT
   -------------------------------------------------------------------------- */
function initTypingEffect() {
  const typingElement = document.getElementById('typing-text');
  if (!typingElement) return;

  const roles = [
    'scalable web applications.',
    'responsive modern user interfaces.',
    'full-stack cloud software.',
    'clean, accessible user experiences.'
  ];

  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  const typingSpeed = 90;
  const deletingSpeed = 45;
  const pauseTime = 1800;

  function type() {
    const currentRole = roles[roleIndex];

    if (isDeleting) {
      typingElement.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
    } else {
      typingElement.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
    }

    if (!isDeleting && charIndex === currentRole.length) {
      isDeleting = true;
      setTimeout(type, pauseTime);
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      setTimeout(type, 300);
    } else {
      const speed = isDeleting ? deletingSpeed : typingSpeed;
      setTimeout(type, speed);
    }
  }

  type();
}

/* --------------------------------------------------------------------------
   3. NAVBAR & MOBILE NAVIGATION
   -------------------------------------------------------------------------- */
function initNavbar() {
  const header = document.getElementById('header');
  const menuToggle = document.getElementById('menu-toggle');
  const navMenu = document.getElementById('nav-menu');
  const mobileBackdrop = document.getElementById('mobile-backdrop');
  const navLinks = document.querySelectorAll('.nav-link');

  // Sticky navbar with blur on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // Toggle mobile menu
  function toggleMobileMenu(open) {
    const isOpen = open !== undefined ? open : !navMenu.classList.contains('open');
    menuToggle.classList.toggle('active', isOpen);
    menuToggle.setAttribute('aria-expanded', isOpen);
    navMenu.classList.toggle('open', isOpen);
    mobileBackdrop.classList.toggle('open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }

  menuToggle.addEventListener('click', () => toggleMobileMenu());
  mobileBackdrop.addEventListener('click', () => toggleMobileMenu(false));

  // Close menu on link click
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      toggleMobileMenu(false);
    });
  });

  // Close on ESC key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu.classList.contains('open')) {
      toggleMobileMenu(false);
    }
  });
}

/* --------------------------------------------------------------------------
   4. ACTIVE NAV LINK HIGHLIGHTING (ScrollSpy)
   -------------------------------------------------------------------------- */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  function highlightNav() {
    const scrollY = window.pageYOffset + 120;

    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop;
      const sectionId = current.getAttribute('id');

      if (scrollY >= sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', highlightNav, { passive: true });
}

/* --------------------------------------------------------------------------
   5. SCROLL REVEAL ANIMATIONS
   -------------------------------------------------------------------------- */
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -50px 0px'
  });

  reveals.forEach(el => revealObserver.observe(el));
}

/* --------------------------------------------------------------------------
   6. STATS COUNTER ANIMATION
   -------------------------------------------------------------------------- */
function initStatsCounter() {
  const statNumbers = document.querySelectorAll('.stat-number');
  let animated = false;

  const statsSection = document.querySelector('.about-stats-column');
  if (!statsSection) return;

  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !animated) {
      animated = true;
      statNumbers.forEach(counter => {
        const target = +counter.getAttribute('data-target');
        const duration = 1500; // ms
        const stepTime = 30;
        const totalSteps = duration / stepTime;
        const increment = target / totalSteps;
        let current = 0;

        const timer = setInterval(() => {
          current += increment;
          if (current >= target) {
            counter.textContent = target;
            clearInterval(timer);
          } else {
            counter.textContent = Math.floor(current);
          }
        }, stepTime);
      });
    }
  }, { threshold: 0.2 });

  observer.observe(statsSection);
}

/* --------------------------------------------------------------------------
   7. SKILLS FILTER & ANIMATED PROGRESS BARS
   -------------------------------------------------------------------------- */
function initSkillsFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const skillCards = document.querySelectorAll('.skill-card');
  const progressBars = document.querySelectorAll('.progress-fill');

  // Animate progress bars when entering viewport
  const progressObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fill = entry.target;
        const progress = fill.getAttribute('data-progress');
        fill.style.width = `${progress}%`;
      }
    });
  }, { threshold: 0.2 });

  progressBars.forEach(bar => progressObserver.observe(bar));

  // Category Filtering
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      skillCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'block';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 20);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 200);
        }
      });
    });
  });
}

/* --------------------------------------------------------------------------
   8. PROJECTS FILTER
   -------------------------------------------------------------------------- */
function initProjectsFilter() {
  const projectBtns = document.querySelectorAll('.project-filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  projectBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      projectBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 20);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 250);
        }
      });
    });
  });
}

/* --------------------------------------------------------------------------
   9. PROJECT DETAILS MODAL
   -------------------------------------------------------------------------- */
const projectsData = {
  devflow: {
    title: 'DevFlow – Developer Knowledge & Community Platform',
    category: 'Full-Stack',
    desc: 'DevFlow is a modern stack overflow alternative and tech blogging ecosystem designed for developer collaboration. It enables engineers to share technical questions, format code blocks, upvote peer solutions, and publish articles with real-time markdown preview.',
    features: [
      'Full-stack architecture using Next.js, Express, MongoDB, and TypeScript',
      'Secure user authentication with JWT, OAuth, and granular role permissions',
      'Advanced search indexing by tags, author, and keyword queries',
      'Interactive syntax-highlighted code editor with copy and live run simulations',
      'Responsive design with light/dark theme toggle and mobile optimizations'
    ],
    tags: ['React', 'Next.js', 'Node.js', 'Express', 'MongoDB', 'Tailwind CSS', 'TypeScript'],
    mockupHtml: `
      <div class="project-preview-mockup mockup-gradient-1" style="height: 100%;">
        <div class="mockup-bar">
          <span class="mock-dot red"></span>
          <span class="mock-dot yellow"></span>
          <span class="mock-dot green"></span>
          <span class="mockup-address">https://devflow.app/questions/react-hooks</span>
        </div>
        <div class="mockup-content">
          <span class="mock-badge">🚀 Active Q&A Community</span>
          <p style="color: #cbd5e1; font-size: 0.85rem; text-align: center;">Over 12,000 active monthly developer discussions and code shares.</p>
        </div>
      </div>
    `
  },
  cloudpulse: {
    title: 'CloudPulse – Real-Time Infrastructure Monitoring Dashboard',
    category: 'Frontend & SaaS',
    desc: 'CloudPulse provides DevOps teams with instant observability across distributed cloud infrastructure, tracking server CPU metrics, memory spikes, container health, and latency anomalies in real-time.',
    features: [
      'WebSocket continuous streaming for microsecond live metrics updates',
      'Interactive Chart.js visualizations with customizable date range filters',
      'Automated threshold alerts with Slack and webhook integrations',
      'Dynamic CSS Grid multi-dashboard layout supporting custom widget drag & resize',
      'Comprehensive export to PDF and CSV reports'
    ],
    tags: ['JavaScript', 'React', 'Chart.js', 'WebSockets', 'CSS Grid', 'Tailwind CSS'],
    mockupHtml: `
      <div class="project-preview-mockup mockup-gradient-2" style="height: 100%;">
        <div class="mockup-bar">
          <span class="mock-dot red"></span>
          <span class="mock-dot yellow"></span>
          <span class="mock-dot green"></span>
          <span class="mockup-address">https://cloudpulse.io/dashboard</span>
        </div>
        <div class="mockup-content">
          <span class="mock-badge">📊 Cloud Observability</span>
          <p style="color: #cbd5e1; font-size: 0.85rem; text-align: center;">99.98% Uptime SLA • Latency Tracking & Auto-Alerts</p>
        </div>
      </div>
    `
  },
  shopsphere: {
    title: 'ShopSphere – Modern Responsive E-Commerce Platform',
    category: 'Full-Stack & E-Commerce',
    desc: 'ShopSphere is a high-converting, lightning-fast e-commerce storefront featuring multi-currency checkout, dynamic search filters, wishlists, and seamless state persistence.',
    features: [
      'Client-side cart state management with real-time tax and shipping calculations',
      'Instant faceted search and category filtering with debounce optimizations',
      'Integrated Stripe Checkout simulation with receipt generation',
      'Responsive mobile-first layout with smooth touch swipe product carousels',
      'Optimized Lighthouse audit scores: 98 Performance, 100 Accessibility'
    ],
    tags: ['JavaScript', 'HTML5', 'SCSS', 'REST API', 'Stripe SDK', 'LocalStorage'],
    mockupHtml: `
      <div class="project-preview-mockup mockup-gradient-3" style="height: 100%;">
        <div class="mockup-bar">
          <span class="mock-dot red"></span>
          <span class="mock-dot yellow"></span>
          <span class="mock-dot green"></span>
          <span class="mockup-address">https://shopsphere.store/products</span>
        </div>
        <div class="mockup-content">
          <span class="mock-badge">🛍️ High-Conversion Checkout</span>
          <p style="color: #cbd5e1; font-size: 0.85rem; text-align: center;">Multi-currency • Instant cart sync • Smooth checkout</p>
        </div>
      </div>
    `
  },
  novapay: {
    title: 'NovaPay – Mobile-First Digital Banking & Wallet UI',
    category: 'UI/UX & Mobile',
    desc: 'NovaPay is a fintech design system and progressive web application crafted for modern digital wallets, peer-to-peer split payments, and financial goal tracking.',
    features: [
      'Engineered in Figma with atomic design principles and translated to semantic web code',
      'Haptic feedback and 60fps micro-animations using CSS transitions',
      'Biometric authentication UX and virtual card masking preview',
      'Accessible color contrast exceeding WCAG AAA compliance standards',
      'Installable Progressive Web App (PWA) with offline balance caching'
    ],
    tags: ['UI/UX', 'Figma', 'CSS Animations', 'PWA Ready', 'Responsive Design'],
    mockupHtml: `
      <div class="project-preview-mockup mockup-gradient-4" style="height: 100%;">
        <div class="mockup-bar">
          <span class="mock-dot red"></span>
          <span class="mock-dot yellow"></span>
          <span class="mock-dot green"></span>
          <span class="mockup-address">https://novapay.design/wallet</span>
        </div>
        <div class="mockup-content">
          <span class="mock-badge">💳 Next-Gen Fintech</span>
          <p style="color: #cbd5e1; font-size: 0.85rem; text-align: center;">Secure Virtual Card • Split Bills • Instant Crypto & Fiat</p>
        </div>
      </div>
    `
  },
  taskmatrix: {
    title: 'TaskMatrix – Kanban Project Management Workspace',
    category: 'Productivity & Frontend',
    desc: 'TaskMatrix streamlines agile workflow management with interactive Kanban boards, sprint backlogs, drag-and-drop task sorting, and persistent browser storage.',
    features: [
      'Smooth HTML5 native drag-and-drop mechanics with tactile visual feedback',
      'Subtask checklists, color-coded priority labels, and due date countdowns',
      'Offline persistence using IndexedDB and LocalStorage synchronization',
      'Keyboard accessibility shortcuts (J/K navigation, Enter to open, ESC to close)',
      'Export and import board configurations via JSON files'
    ],
    tags: ['JavaScript', 'HTML Drag & Drop', 'CSS Flex/Grid', 'IndexedDB'],
    mockupHtml: `
      <div class="project-preview-mockup mockup-gradient-5" style="height: 100%;">
        <div class="mockup-bar">
          <span class="mock-dot red"></span>
          <span class="mock-dot yellow"></span>
          <span class="mock-dot green"></span>
          <span class="mockup-address">https://taskmatrix.dev/board/sprint-12</span>
        </div>
        <div class="mockup-content">
          <span class="mock-badge">📋 Agile Sprint Boards</span>
          <p style="color: #cbd5e1; font-size: 0.85rem; text-align: center;">Tactile drag-and-drop • Keyboard accessible • Instant save</p>
        </div>
      </div>
    `
  },
  ecotracker: {
    title: 'EcoTracker – Carbon Footprint Calculator & Tracker',
    category: 'Green Tech & Full-Stack',
    desc: 'EcoTracker is a sustainability web tool empowering individuals and organizations to calculate, visualize, and diminish their daily carbon footprint through customized tips.',
    features: [
      'Interactive multi-step questionnaire for travel, dietary, and energy habits',
      'Custom SVG dynamic chart visualizations representing CO2 equivalents',
      'Personalized sustainability roadmap with gamified milestone badges',
      'Community challenges and carbon offset partnership integrations'
    ],
    tags: ['React', 'Node.js', 'SVG Charts', 'REST API', 'CSS Grid'],
    mockupHtml: `
      <div class="project-preview-mockup mockup-gradient-6" style="height: 100%;">
        <div class="mockup-bar">
          <span class="mock-dot red"></span>
          <span class="mock-dot yellow"></span>
          <span class="mock-dot green"></span>
          <span class="mockup-address">https://ecotracker.earth/my-impact</span>
        </div>
        <div class="mockup-content">
          <span class="mock-badge">🌱 Environmental Intelligence</span>
          <p style="color: #cbd5e1; font-size: 0.85rem; text-align: center;">Track daily impact • Reduce emissions by up to 35%</p>
        </div>
      </div>
    `
  }
};

function initProjectModal() {
  const modal = document.getElementById('project-modal');
  const modalClose = document.getElementById('modal-close');
  const modalTitle = document.getElementById('modal-title');
  const modalCategory = document.getElementById('modal-category');
  const modalDesc = document.getElementById('modal-desc');
  const modalFeatures = document.getElementById('modal-features');
  const modalTags = document.getElementById('modal-tags');
  const modalMockup = document.getElementById('modal-mockup');
  const triggers = document.querySelectorAll('.btn-modal-trigger');

  function openModal(projectId) {
    const data = projectsData[projectId];
    if (!data) return;

    modalTitle.textContent = data.title;
    modalCategory.textContent = data.category;
    modalDesc.textContent = data.desc;
    modalMockup.innerHTML = data.mockupHtml;

    modalFeatures.innerHTML = data.features.map(f => `<li>${f}</li>`).join('');
    modalTags.innerHTML = data.tags.map(t => `<span class="tech-tag">${t}</span>`).join('');

    if (typeof modal.showModal === 'function') {
      modal.showModal();
    } else {
      modal.setAttribute('open', '');
    }
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    if (typeof modal.close === 'function') {
      modal.close();
    } else {
      modal.removeAttribute('open');
    }
    document.body.style.overflow = '';
  }

  triggers.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const id = btn.getAttribute('data-project');
      openModal(id);
    });
  });

  modalClose.addEventListener('click', closeModal);

  // Close when clicking outside dialog contents
  modal.addEventListener('click', (e) => {
    const rect = modal.getBoundingClientRect();
    const isInDialog = (rect.top <= e.clientY && e.clientY <= rect.top + rect.height &&
      rect.left <= e.clientX && e.clientX <= rect.left + rect.width);
    if (!isInDialog) {
      closeModal();
    }
  });

  modal.addEventListener('cancel', () => {
    document.body.style.overflow = '';
  });
}

/* --------------------------------------------------------------------------
   10. CONTACT FORM VALIDATION & SUBMISSION
   -------------------------------------------------------------------------- */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const submitBtn = document.getElementById('submit-btn');
  const messageInput = document.getElementById('message');
  const charCount = document.getElementById('char-count');

  if (!form) return;

  // Real-time character count
  messageInput.addEventListener('input', () => {
    const len = messageInput.value.length;
    charCount.textContent = `${len} / 1000`;
  });

  // Validate single field helper
  function validateField(id, errorId, condition, errorMsg) {
    const input = document.getElementById(id);
    const error = document.getElementById(errorId);
    if (!condition) {
      input.classList.add('input-error');
      error.textContent = errorMsg;
      return false;
    } else {
      input.classList.remove('input-error');
      error.textContent = '';
      return true;
    }
  }

  // Clear errors on input
  ['name', 'email', 'subject', 'message'].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('input', () => {
        el.classList.remove('input-error');
        const err = document.getElementById(`${id}-error`);
        if (err) err.textContent = '';
      });
    }
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const subject = document.getElementById('subject').value.trim();
    const message = messageInput.value.trim();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const isNameValid = validateField('name', 'name-error', name.length >= 2, 'Please enter your name (at least 2 characters).');
    const isEmailValid = validateField('email', 'email-error', emailRegex.test(email), 'Please enter a valid email address.');
    const isSubjectValid = validateField('subject', 'subject-error', subject.length >= 3, 'Please provide a subject (at least 3 characters).');
    const isMessageValid = validateField('message', 'message-error', message.length >= 10, 'Please write a message with at least 10 characters.');

    if (!isNameValid || !isEmailValid || !isSubjectValid || !isMessageValid) {
      showToast('Please correct the highlighted fields.', 'error');
      return;
    }

    // Submit Simulation
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;

    setTimeout(() => {
      submitBtn.classList.remove('loading');
      submitBtn.disabled = false;
      form.reset();
      charCount.textContent = '0 / 1000';
      showToast('Thank you! Your message has been sent successfully. Meghana will reach out soon.', 'success');
    }, 1500);
  });
}

/* --------------------------------------------------------------------------
   11. TOAST NOTIFICATION UTILITY
   -------------------------------------------------------------------------- */
function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;

  const icon = type === 'success' ? '✅' : type === 'error' ? '⚠️' : 'ℹ️';
  toast.innerHTML = `<span>${icon}</span><span>${message}</span>`;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = 'toast-fade-out 0.4s forwards ease-in';
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 400);
  }, 4000);
}

/* --------------------------------------------------------------------------
   12. BACK TO TOP BUTTON
   -------------------------------------------------------------------------- */
function initBackToTop() {
  const backToTopBtn = document.getElementById('back-to-top');
  if (!backToTopBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  }, { passive: true });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/* --------------------------------------------------------------------------
   13. RESUME DOWNLOAD SIMULATION
   -------------------------------------------------------------------------- */
function initResumeDownload() {
  const resumeBtn = document.getElementById('download-cv-btn');
  if (!resumeBtn) return;

  resumeBtn.addEventListener('click', (e) => {
    e.preventDefault();
    showToast('Resume profile loaded! You can also reach out directly via contact form.', 'success');
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth' });
    }
  });
}
