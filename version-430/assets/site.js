(function () {
  function initMobileMenu() {
    var button = document.querySelector('.menu-toggle');
    var menu = document.querySelector('.mobile-menu');
    if (!button || !menu) return;
    button.addEventListener('click', function () {
      var open = menu.classList.toggle('is-open');
      button.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  function initHeroSlider() {
    var slider = document.querySelector('[data-hero-slider]');
    if (!slider) return;
    var slides = Array.prototype.slice.call(slider.querySelectorAll('.hero-slide'));
    var dots = Array.prototype.slice.call(slider.querySelectorAll('.hero-dot'));
    if (!slides.length) return;
    var index = 0;
    function show(next) {
      index = (next + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('is-active', i === index);
        slide.setAttribute('aria-hidden', i === index ? 'false' : 'true');
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('is-active', i === index);
      });
    }
    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () {
        show(i);
      });
    });
    show(0);
    window.setInterval(function () {
      show(index + 1);
    }, 5200);
  }

  function normalize(value) {
    return (value || '').toString().trim().toLowerCase();
  }

  function filterScope(scope) {
    var queryInput = scope.querySelector('[data-local-search], [data-search-page]');
    var typeSelect = scope.querySelector('[data-filter-type]');
    var cards = Array.prototype.slice.call(scope.querySelectorAll('.movie-card'));
    var empty = scope.querySelector('[data-empty]');
    var query = normalize(queryInput && queryInput.value);
    var selectedType = normalize(typeSelect && typeSelect.value);
    var shown = 0;
    cards.forEach(function (card) {
      var haystack = normalize([
        card.getAttribute('data-title'),
        card.getAttribute('data-region'),
        card.getAttribute('data-type'),
        card.getAttribute('data-year'),
        card.getAttribute('data-genre')
      ].join(' '));
      var type = normalize(card.getAttribute('data-type'));
      var visible = (!query || haystack.indexOf(query) !== -1) && (!selectedType || type === selectedType);
      card.style.display = visible ? '' : 'none';
      if (visible) shown += 1;
    });
    if (empty) empty.classList.toggle('is-visible', shown === 0);
  }

  function initFilters() {
    var scopes = Array.prototype.slice.call(document.querySelectorAll('[data-filter-scope]'));
    scopes.forEach(function (scope) {
      var queryInput = scope.querySelector('[data-local-search], [data-search-page]');
      var typeSelect = scope.querySelector('[data-filter-type]');
      var resetButton = scope.querySelector('[data-filter-reset]');
      if (queryInput) {
        queryInput.addEventListener('input', function () {
          filterScope(scope);
        });
      }
      if (typeSelect) {
        typeSelect.addEventListener('change', function () {
          filterScope(scope);
        });
      }
      if (resetButton) {
        resetButton.addEventListener('click', function () {
          if (queryInput) queryInput.value = '';
          if (typeSelect) typeSelect.value = '';
          filterScope(scope);
        });
      }
      filterScope(scope);
    });
  }

  function initSearchPage() {
    var input = document.querySelector('[data-search-page]');
    if (!input) return;
    var params = new URLSearchParams(window.location.search);
    var q = params.get('q') || '';
    if (q) {
      input.value = q;
      var scope = input.closest('[data-filter-scope]');
      if (scope) filterScope(scope);
    }
  }

  window.setupVideo = function (videoId, overlayId, stream) {
    var video = document.getElementById(videoId);
    var overlay = document.getElementById(overlayId);
    if (!video || !overlay || !stream) return;
    var hls = null;
    var ready = false;
    function attach() {
      if (ready) return;
      ready = true;
      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = stream;
      } else if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({ enableWorker: true });
        hls.loadSource(stream);
        hls.attachMedia(video);
      } else {
        video.src = stream;
      }
    }
    function play() {
      attach();
      overlay.classList.add('is-hidden');
      video.setAttribute('controls', 'controls');
      var started = video.play();
      if (started && typeof started.catch === 'function') {
        started.catch(function () {
          overlay.classList.remove('is-hidden');
        });
      }
    }
    overlay.addEventListener('click', play);
    video.addEventListener('click', function () {
      if (!ready || video.paused) play();
    });
    window.addEventListener('beforeunload', function () {
      if (hls) hls.destroy();
    });
  };

  document.addEventListener('DOMContentLoaded', function () {
    initMobileMenu();
    initHeroSlider();
    initSearchPage();
    initFilters();
  });
})();
