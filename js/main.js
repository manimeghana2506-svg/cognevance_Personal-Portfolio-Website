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
    'Software Developer.',
    'Problem Solver (C++ & Python).',
    'Full-Stack Web Developer.',
    'B.Tech Student @ NIAT.'
  ];

  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  const typingSpeed = 80;
  const deletingSpeed = 40;
  const pauseTime = 1600;

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

  // Immediately reveal elements in viewport on page load
  reveals.forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top <= (window.innerHeight || document.documentElement.clientHeight)) {
      el.classList.add('revealed');
    }
  });

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.08,
    rootMargin: '0px 0px 50px 0px'
  });

  reveals.forEach(el => {
    if (!el.classList.contains('revealed')) {
      revealObserver.observe(el);
    }
  });
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
  algovisual: {
    title: 'AlgoVisual – Interactive Algorithm & Data Structure Visualizer',
    category: 'C++ & JavaScript',
    desc: 'AlgoVisual is an educational interactive web platform designed to demonstrate how fundamental data structures and algorithms execute step-by-step. It provides controls to step forward, pause, change execution speeds, and inspect variable states.',
    features: [
      'Visualizations for QuickSort, MergeSort, BubbleSort, and InsertionSort with bar comparisons',
      'Pathfinding grid visualizer executing Dijkstra, Breadth-First Search (BFS), and Depth-First Search (DFS)',
      'Algorithmic time complexity and space complexity metrics rendered dynamically',
      'HTML5 Canvas rendering engine with fluid 60fps animations and custom input array generation'
    ],
    tags: ['C++ Logic', 'JavaScript (ES6+)', 'HTML5 Canvas', 'CSS3 Grid', 'Algorithms'],
    mockupHtml: `
      <div class="project-preview-mockup mockup-gradient-1" style="height: 100%;">
        <div class="mockup-bar">
          <span class="mock-dot red"></span>
          <span class="mock-dot yellow"></span>
          <span class="mock-dot green"></span>
          <span class="mockup-address">https://algovisual.app/visualizer/quicksort</span>
        </div>
        <div class="mockup-content">
          <span class="mock-badge">📊 Sorting Visualizer</span>
          <p style="color: #cbd5e1; font-size: 0.85rem; text-align: center;">QuickSort O(N log N) • Color-coded pointer tracking • Step-by-step debug</p>
        </div>
      </div>
    `
  },
  campusconnect: {
    title: 'CampusConnect – NIAT Student Collaboration Portal',
    category: 'Full-Stack Web',
    desc: 'CampusConnect is a campus collaboration portal developed specifically for engineering students at NIAT. It provides a centralized hub to share lecture notes, form study groups, post club updates, and coordinate hackathon teams.',
    features: [
      'User authentication and profile management for college students and club leads',
      'Subject-wise resource repository with PDF upload, tagging, and search indexing',
      'Discussion boards with threaded comments, upvoting, and instant peer notifications',
      'Responsive design styled with modern CSS and Tailwind for mobile access across campus'
    ],
    tags: ['Node.js', 'Express', 'MongoDB', 'HTML5', 'CSS3', 'REST API'],
    mockupHtml: `
      <div class="project-preview-mockup mockup-gradient-2" style="height: 100%;">
        <div class="mockup-bar">
          <span class="mock-dot red"></span>
          <span class="mock-dot yellow"></span>
          <span class="mock-dot green"></span>
          <span class="mockup-address">https://campusconnect-niat.edu/feed</span>
        </div>
        <div class="mockup-content">
          <span class="mock-badge">🎓 NIAT Student Hub</span>
          <p style="color: #cbd5e1; font-size: 0.85rem; text-align: center;">Notes Sharing • Hackathon Teams • Peer Discussions</p>
        </div>
      </div>
    `
  },
  devportfolio: {
    title: 'Responsive Personal Portfolio Website',
    category: 'Frontend & UI/UX',
    desc: 'A modern, responsive personal portfolio website engineered from scratch using semantic HTML5, modern CSS3 variables and animations, and vanilla JavaScript. Features a dark/light theme switcher, mobile drawer, and interactive project modals.',
    features: [
      'Fully responsive fluid layouts optimized for mobile, tablet, and desktop screens',
      'Persistent dark/light theme toggle with LocalStorage preference save',
      'Accessible navigation with scrollspy active indicator and keyboard navigation',
      'Zero external frontend framework dependencies for sub-second page loads and 100 Lighthouse score'
    ],
    tags: ['HTML5', 'CSS3 Variables', 'Vanilla JavaScript', 'GitHub Pages', 'Responsive Design'],
    mockupHtml: `
      <div class="project-preview-mockup mockup-gradient-3" style="height: 100%;">
        <div class="mockup-bar">
          <span class="mock-dot red"></span>
          <span class="mock-dot yellow"></span>
          <span class="mock-dot green"></span>
          <span class="mockup-address">https://manimeghana.dev</span>
        </div>
        <div class="mockup-content">
          <span class="mock-badge">⚡ Pure Vanilla Web</span>
          <p style="color: #cbd5e1; font-size: 0.85rem; text-align: center;">100% Responsive • Smooth CSS Animations • Zero Bloat</p>
        </div>
      </div>
    `
  },
  smartlibrary: {
    title: 'SmartLibrary – Database Management & Book Tracking System',
    category: 'Python & DBMS',
    desc: 'SmartLibrary is a comprehensive library database management application written in Python with SQLite/MySQL. It models relational tables with primary/foreign keys to manage book inventories, student member records, checkouts, and fine tracking.',
    features: [
      'Normalized relational database schema (3NF) ensuring data integrity and fast queries',
      'Full CRUD operations for managing book inventory, student memberships, and loan statuses',
      'Automated fine calculation algorithm based on overdue borrow dates',
      'Interactive command-line and web dashboard interface with search by ISBN, Title, and Author'
    ],
    tags: ['Python', 'SQL & SQLite', 'DBMS Concepts', 'Normalization', 'CRUD'],
    mockupHtml: `
      <div class="project-preview-mockup mockup-gradient-4" style="height: 100%;">
        <div class="mockup-bar">
          <span class="mock-dot red"></span>
          <span class="mock-dot yellow"></span>
          <span class="mock-dot green"></span>
          <span class="mockup-address">https://smartlibrary.local/admin</span>
        </div>
        <div class="mockup-content">
          <span class="mock-badge">📚 Relational DBMS</span>
          <p style="color: #cbd5e1; font-size: 0.85rem; text-align: center;">SQLite • Normalized Schema • Automated Overdue Fine System</p>
        </div>
      </div>
    `
  },
  taskpulse: {
    title: 'TaskPulse – Student Productivity & Goal Tracker',
    category: 'JavaScript & Productivity',
    desc: 'TaskPulse is an intuitive web-based productivity workspace featuring customizable Kanban task boards, semester goal milestones, and an integrated Pomodoro study timer designed to help students stay organized.',
    features: [
      'HTML5 drag-and-drop task workflow with customizable board categories (To-Do, In Progress, Completed)',
      'Built-in customizable 25/5 minute Pomodoro focus timer with audio chimes and study streak tracker',
      'Persistent state saved in browser LocalStorage with zero server dependencies',
      'Responsive design supporting mobile touch and keyboard shortcuts for quick task entry'
    ],
    tags: ['JavaScript (ES6+)', 'CSS Grid & Flexbox', 'LocalStorage', 'Pomodoro Timer'],
    mockupHtml: `
      <div class="project-preview-mockup mockup-gradient-5" style="height: 100%;">
        <div class="mockup-bar">
          <span class="mock-dot red"></span>
          <span class="mock-dot yellow"></span>
          <span class="mock-dot green"></span>
          <span class="mockup-address">https://taskpulse.me/board</span>
        </div>
        <div class="mockup-content">
          <span class="mock-badge">📋 Kanban Workspace</span>
          <p style="color: #cbd5e1; font-size: 0.85rem; text-align: center;">Drag-and-Drop • Pomodoro Timer • Offline Persistence</p>
        </div>
      </div>
    `
  },
  weathercast: {
    title: 'WeatherCast – Real-Time Global Forecast Web App',
    category: 'API Integration',
    desc: 'WeatherCast connects to global meteorological REST APIs to deliver live weather updates, temperature charts, humidity, wind velocity, and 5-day weather forecasts for cities worldwide, including Hyderabad.',
    features: [
      'Asynchronous data fetching with ES6 Promises and graceful error handling',
      'HTML5 Geolocation API integration to detect the user’s local weather automatically',
      'Dynamic weather cards that shift gradients based on day/night and weather conditions',
      'Search auto-complete with debounce optimization to reduce unnecessary API requests'
    ],
    tags: ['JavaScript Fetch', 'RESTful API', 'CSS Grid', 'Geolocation API', 'Responsive'],
    mockupHtml: `
      <div class="project-preview-mockup mockup-gradient-6" style="height: 100%;">
        <div class="mockup-bar">
          <span class="mock-dot red"></span>
          <span class="mock-dot yellow"></span>
          <span class="mock-dot green"></span>
          <span class="mockup-address">https://weathercast.live/hyderabad</span>
        </div>
        <div class="mockup-content">
          <span class="mock-badge">⛅ Meteorological API</span>
          <p style="color: #cbd5e1; font-size: 0.85rem; text-align: center;">Live Hyderabad Conditions • 5-Day Forecast • Dynamic UI Themes</p>
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

  resumeBtn.addEventListener('click', () => {
    showToast('Downloading Mani Meghana\'s Resume (PDF)...', 'success');
  });
}
