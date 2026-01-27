document.addEventListener('DOMContentLoaded', function() {
    initializeNavbar();
    initializeMobileMenu();
    initializeSearchModal();
    addDynamicStyles();
});

function initializeNavbar() {
    // Menú hamburguesa (versión simplificada que será reemplazada por initializeMobileMenu)
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    if (mobileMenuButton) {
        const icon = mobileMenuButton.querySelector('i');
        mobileMenuButton.addEventListener('click', function() {
            if (icon) {
                icon.classList.toggle('fa-bars');
                icon.classList.toggle('fa-times');
            }
        });
    }
}

function initializeMobileMenu() {
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const closeMenuButton = document.getElementById('close-menu');
    const mobileMenu = document.getElementById('mobile-menu');
    const menuOverlay = document.getElementById('menu-overlay');

    if (!mobileMenuButton || !mobileMenu) return;

    mobileMenuButton.addEventListener('click', () => {
        mobileMenu.classList.remove('-translate-x-full');
        mobileMenu.classList.remove('hidden');
        if (menuOverlay) menuOverlay.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
        
        // Cambiar ícono
        const icon = mobileMenuButton.querySelector('i');
        if (icon) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        }
    });

    if (closeMenuButton) {
        closeMenuButton.addEventListener('click', closeMobileMenu);
    }

    if (menuOverlay) {
        menuOverlay.addEventListener('click', closeMobileMenu);
    }

    function closeMobileMenu() {
        mobileMenu.classList.add('-translate-x-full');
        if (menuOverlay) menuOverlay.classList.add('hidden');
        document.body.style.overflow = '';
        
        // Cambiar ícono
        const icon = mobileMenuButton.querySelector('i');
        if (icon) {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    }
}

function initializeSearchModal() {
    const searchModal = document.getElementById('search-modal');
    const searchButton = document.getElementById('search-button');
    const mobileSearchButton = document.getElementById('mobile-search-button');
    const closeSearch = document.getElementById('close-search');

    function openSearchModal() {
        if (searchModal) {
            searchModal.classList.remove('none');
            searchModal.classList.add('anim');
            document.body.style.overflow = 'hidden';
        }
    }

    function closeSearchModal() {
        if (searchModal) {
            searchModal.classList.add('none');
            document.body.style.overflow = '';
        }
    }

    if (searchButton) searchButton.addEventListener('click', openSearchModal);
    if (mobileSearchButton) mobileSearchButton.addEventListener('click', openSearchModal);
    if (closeSearch) closeSearch.addEventListener('click', closeSearchModal);

    if (searchModal) {
        searchModal.addEventListener('click', function(e) {
            if (e.target === searchModal) {
                closeSearchModal();
            }
        });
    }

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && searchModal && !searchModal.classList.contains('none')) {
            closeSearchModal();
        }
    });
}

function addDynamicStyles() {
    const style = document.createElement('style');
    style.textContent = `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
        
        .anim {
            animation: fadeIn 0.3s ease-in-out;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        .none {
            display: none;
        }
        
        /* Estilos para el menú móvil */
        .-translate-x-full {
            transform: translateX(-100%);
        }
        
        #mobile-menu {
            transition: transform 0.3s ease-in-out;
        }
        
        #menu-overlay {
            background-color: rgba(0, 0, 0, 0.5);
        }
    `;
    document.head.appendChild(style);
}

(function() {
  'use strict';

  const SELECTORS = {
    productTab: '#product-tab',
    imagesTab: '#images-tab',
    productView: '#product-view',
    galleryView: '#gallery-view',
    imageModal: '#image-modal',
    modalImage: '#modal-image',
    mainImage: '#img_main',
    thumbnailBtns: '.thumbnail-btn',
    tabBtns: '.tab-btn'
  };

  const CLASSES = {
    hidden: 'hidden',
    active: 'active',
    borderBlue: 'border-blue-500',
    borderGray: 'border-gray-200',
    bgBlue: 'bg-blue-600',
    bgWhite: 'bg-white',
    textWhite: 'text-white',
    textGray: 'text-gray-700'
  };

  let elements = {};

  function init() {
    // Esperar a que el DOM esté completamente cargado
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', setupApp);
    } else {
      setupApp();
    }
  }

  function setupApp() {
    cacheElements();
    bindEvents();
    initializeTabs();
    console.log('✅ App inicializada correctamente');
  }

  function cacheElements() {
    elements = {
      productTab: document.querySelector(SELECTORS.productTab),
      imagesTab: document.querySelector(SELECTORS.imagesTab),
      productView: document.querySelector(SELECTORS.productView),
      galleryView: document.querySelector(SELECTORS.galleryView),
      imageModal: document.querySelector(SELECTORS.imageModal),
      modalImage: document.querySelector(SELECTORS.modalImage),
      mainImage: document.querySelector(SELECTORS.mainImage),
      thumbnailBtns: document.querySelectorAll(SELECTORS.thumbnailBtns),
      tabBtns: document.querySelectorAll(SELECTORS.tabBtns)
    };

    // Validar que los elementos existan
    validateElements();
  }

  function validateElements() {
    const requiredElements = [
      'productTab',
      'imagesTab',
      'productView',
      'galleryView',
      'imageModal',
      'modalImage',
      'mainImage'
    ];

    requiredElements.forEach(key => {
      if (!elements[key]) {
        console.warn(`⚠️ Elemento no encontrado: ${key}`);
      }
    });
  }

  function bindEvents() {
    // Eventos de tabs
    if (elements.productTab) {
      elements.productTab.addEventListener('click', () => switchTab('product'));
    }

    if (elements.imagesTab) {
      elements.imagesTab.addEventListener('click', () => switchTab('images'));
    }

    // Eventos de miniaturas
    elements.thumbnailBtns.forEach((btn, index) => {
      btn.addEventListener('click', () => handleThumbnailClick(btn, index));
    });

    // Cerrar modal con tecla Escape
    document.addEventListener('keydown', handleEscapeKey);

    // Cerrar modal al hacer click fuera de la imagen
    if (elements.imageModal) {
      elements.imageModal.addEventListener('click', handleModalClick);
    }

    // Prevenir scroll del body cuando el modal está abierto
    observeModalState();
  }

  function initializeTabs() {
    // Mostrar vista de producto por defecto
    showProductView();
  }

  function switchTab(tabName) {
    if (tabName === 'product') {
      showProductView();
    } else if (tabName === 'images') {
      showGalleryView();
    }

    // Animación suave al cambiar
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  function showProductView() {
    // Mostrar/ocultar vistas
    if (elements.productView) {
      elements.productView.classList.remove(CLASSES.hidden);
    }
    if (elements.galleryView) {
      elements.galleryView.classList.add(CLASSES.hidden);
    }

    // Actualizar estado de los tabs
    updateTabStates(elements.productTab, elements.imagesTab);
  }

  function showGalleryView() {
    // Mostrar/ocultar vistas
    if (elements.productView) {
      elements.productView.classList.add(CLASSES.hidden);
    }
    if (elements.galleryView) {
      elements.galleryView.classList.remove(CLASSES.hidden);
    }

    // Actualizar estado de los tabs
    updateTabStates(elements.imagesTab, elements.productTab);
  }

  function updateTabStates(activeTab, inactiveTab) {
    if (activeTab) {
      activeTab.classList.add(CLASSES.active, CLASSES.bgBlue, CLASSES.textWhite);
      activeTab.classList.remove(CLASSES.bgWhite, CLASSES.textGray);
    }

    if (inactiveTab) {
      inactiveTab.classList.remove(CLASSES.active, CLASSES.bgBlue, CLASSES.textWhite);
      inactiveTab.classList.add(CLASSES.bgWhite, CLASSES.textGray);
    }
  }

  function handleThumbnailClick(clickedBtn, index) {
    // Obtener la imagen de la miniatura
    const thumbnailImg = clickedBtn.querySelector('img');
    if (!thumbnailImg || !elements.mainImage) return;

    // Cambiar imagen principal
    changeMainImage(thumbnailImg.src, thumbnailImg.alt);

    // Actualizar estado activo de las miniaturas
    updateThumbnailStates(index);
  }

  function changeMainImage(src, alt) {
    if (!elements.mainImage) return;

    // Efecto de transición suave
    elements.mainImage.style.opacity = '0';
    
    setTimeout(() => {
      elements.mainImage.src = src;
      elements.mainImage.alt = alt || 'Imagen del producto';
      elements.mainImage.style.opacity = '1';
    }, 150);
  }

  function updateThumbnailStates(activeIndex) {
    elements.thumbnailBtns.forEach((btn, index) => {
      if (index === activeIndex) {
        btn.classList.add(CLASSES.borderBlue);
        btn.classList.remove(CLASSES.borderGray);
      } else {
        btn.classList.remove(CLASSES.borderBlue);
        btn.classList.add(CLASSES.borderGray);
      }
    });
  }

  function viewImage(imageSrc) {
    if (!elements.imageModal || !elements.modalImage) return;

    // Establecer la imagen del modal
    elements.modalImage.src = imageSrc;
    elements.modalImage.alt = 'Imagen ampliada';

    // Mostrar modal
    openModal();
  }

  function openModal() {
    if (!elements.imageModal) return;

    elements.imageModal.classList.remove(CLASSES.hidden);
    document.body.style.overflow = 'hidden';

    // Agregar animación
    requestAnimationFrame(() => {
      elements.imageModal.style.opacity = '0';
      requestAnimationFrame(() => {
        elements.imageModal.style.transition = 'opacity 300ms ease-in-out';
        elements.imageModal.style.opacity = '1';
      });
    });
  }

  function closeModal() {
    if (!elements.imageModal) return;

    // Animación de salida
    elements.imageModal.style.opacity = '0';

    setTimeout(() => {
      elements.imageModal.classList.add(CLASSES.hidden);
      document.body.style.overflow = '';
      elements.imageModal.style.opacity = '';
    }, 300);
  }

  function handleModalClick(event) {
    // Cerrar solo si se hace click en el fondo, no en la imagen
    if (event.target === elements.imageModal) {
      closeModal();
    }
  }

  function handleEscapeKey(event) {
    if (event.key === 'Escape' && elements.imageModal && !elements.imageModal.classList.contains(CLASSES.hidden)) {
      closeModal();
    }
  }

  function observeModalState() {
    if (!elements.imageModal) return;

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          const isHidden = elements.imageModal.classList.contains(CLASSES.hidden);
          document.body.style.overflow = isHidden ? '' : 'hidden';
        }
      });
    });

    observer.observe(elements.imageModal, {
      attributes: true,
      attributeFilter: ['class']
    });
  }

  window.toExchangeImage = function(element) {
    const img = element.querySelector('img');
    if (!img || !elements.mainImage) return;

    // Cambiar la imagen principal
    changeMainImage(img.src, img.alt);

    // Actualizar estado de las miniaturas
    const allThumbnails = Array.from(elements.thumbnailBtns);
    const clickedIndex = allThumbnails.indexOf(element);
    if (clickedIndex !== -1) {
      updateThumbnailStates(clickedIndex);
    }
  };

  window.viewImage = function(imageSrc) {
    viewImage(imageSrc);
  };

  window.closeModal = function() {
    closeModal();
  };

  function debounce(func, wait) {
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

  function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }

  function initLazyLoading() {
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.classList.add('loaded');
            observer.unobserve(img);
          }
        });
      });

      lazyImages.forEach(img => imageObserver.observe(img));
    } else {
      // Fallback para navegadores que no soportan IntersectionObserver
      lazyImages.forEach(img => img.classList.add('loaded'));
    }
  }

  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#' || href === '') return;

        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
  }

  function initScrollDetection() {
  let lastScroll = 0;
  const header = document.querySelector('nav');
  
  if (!header) return;

  const handleScroll = throttle(() => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll <= 0) {
      header.classList.remove('shadow-lg');
      header.style.transform = 'translateY(0)';
      return;
    }

    if (currentScroll > lastScroll && currentScroll > 100) {
      // Scroll hacia abajo
      header.style.transform = 'translateY(-100%)';
    } else {
      // Scroll hacia arriba
      header.style.transform = 'translateY(0)';
      // ❌ shadow eliminado
    }

    lastScroll = currentScroll;
  }, 100);

  window.addEventListener('scroll', handleScroll);
}

  function initTooltips() {
    const tooltipTriggers = document.querySelectorAll('[data-tooltip]');
    
    tooltipTriggers.forEach(trigger => {
      const tooltipText = trigger.getAttribute('data-tooltip');
      
      trigger.addEventListener('mouseenter', () => {
        showTooltip(trigger, tooltipText);
      });

      trigger.addEventListener('mouseleave', () => {
        hideTooltip();
      });
    });
  }

  function showTooltip(element, text) {
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.textContent = text;
    tooltip.id = 'active-tooltip';
    
    document.body.appendChild(tooltip);
    
    const rect = element.getBoundingClientRect();
    tooltip.style.position = 'absolute';
    tooltip.style.top = `${rect.top - tooltip.offsetHeight - 8}px`;
    tooltip.style.left = `${rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2)}px`;
  }

  function hideTooltip() {
    const tooltip = document.getElementById('active-tooltip');
    if (tooltip) {
      tooltip.remove();
    }
  }

  function initImageErrorHandling() {
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
      img.addEventListener('error', function() {
        this.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect width="400" height="400" fill="%23f3f4f6"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="Arial, sans-serif" font-size="16" fill="%239ca3af"%3EImagen no disponible%3C/text%3E%3C/svg%3E';
        this.alt = 'Imagen no disponible';
        console.warn('⚠️ Error al cargar imagen:', this.dataset.src || this.src);
      });
    });
  }

  function trackEvent(category, action, label) {
    // Integración con Google Analytics o similar
    if (typeof gtag !== 'undefined') {
      gtag('event', action, {
        'event_category': category,
        'event_label': label
      });
    }
    
    console.log('📊 Event tracked:', { category, action, label });
  }

  function logPerformanceMetrics() {
    if ('performance' in window) {
      window.addEventListener('load', () => {
        setTimeout(() => {
          const perfData = window.performance.timing;
          const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
          const connectTime = perfData.responseEnd - perfData.requestStart;
          const renderTime = perfData.domComplete - perfData.domLoading;

          console.log('⚡ Performance Metrics:');
          console.log(`  - Page Load Time: ${pageLoadTime}ms`);
          console.log(`  - Connect Time: ${connectTime}ms`);
          console.log(`  - Render Time: ${renderTime}ms`);
        }, 0);
      });
    }
  }

  function initAdditionalFeatures() {
    initLazyLoading();
    initSmoothScroll();
    initScrollDetection();
    initImageErrorHandling();
    logPerformanceMetrics();
    
    // Descomentar si necesitas tooltips
    // initTooltips();
  }

  window.productApp = {
    switchTab,
    viewImage,
    closeModal,
    changeMainImage,
    trackEvent
  };

  init();

  // Inicializar características adicionales después de la carga completa
  if (document.readyState === 'complete') {
    initAdditionalFeatures();
  } else {
    window.addEventListener('load', initAdditionalFeatures);
  }

})();