(function () {
  var menuButton = document.querySelector('.menu-button');
  var mobilePanel = document.querySelector('.mobile-panel');

  if (menuButton && mobilePanel) {
    menuButton.addEventListener('click', function () {
      var open = mobilePanel.classList.toggle('open');
      menuButton.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  var visual = document.querySelector('[data-visual]');
  if (visual) {
    var slides = Array.prototype.slice.call(visual.querySelectorAll('.visual-slide'));
    var nextButton = visual.querySelector('[data-visual-next]');
    var prevButton = visual.querySelector('[data-visual-prev]');
    var index = Math.max(0, slides.findIndex(function (slide) {
      return slide.classList.contains('active');
    }));

    function showSlide(nextIndex) {
      if (!slides.length) {
        return;
      }
      slides[index].classList.remove('active');
      index = (nextIndex + slides.length) % slides.length;
      slides[index].classList.add('active');
    }

    if (nextButton) {
      nextButton.addEventListener('click', function () {
        showSlide(index + 1);
      });
    }

    if (prevButton) {
      prevButton.addEventListener('click', function () {
        showSlide(index - 1);
      });
    }

    if (slides.length > 1) {
      setInterval(function () {
        showSlide(index + 1);
      }, 5200);
    }
  }

  var params = new URLSearchParams(window.location.search);
  var initialQuery = params.get('q') || '';
  var searchInput = document.getElementById('searchInput') || document.querySelector('.page-filter-input');
  var yearSelect = document.querySelector('.page-filter-year');
  var cards = Array.prototype.slice.call(document.querySelectorAll('.filter-list .movie-card'));

  if (searchInput && initialQuery) {
    searchInput.value = initialQuery;
  }

  function normalize(value) {
    return String(value || '').toLowerCase().trim();
  }

  function applyFilter() {
    if (!cards.length) {
      return;
    }

    var query = normalize(searchInput ? searchInput.value : '');
    var year = yearSelect ? normalize(yearSelect.value) : '';

    cards.forEach(function (card) {
      var haystack = normalize([
        card.dataset.title,
        card.dataset.region,
        card.dataset.year,
        card.dataset.genre
      ].join(' '));
      var matchesQuery = !query || haystack.indexOf(query) !== -1;
      var matchesYear = !year || normalize(card.dataset.year) === year;
      card.classList.toggle('filtered-out', !(matchesQuery && matchesYear));
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', applyFilter);
  }

  if (yearSelect) {
    yearSelect.addEventListener('change', applyFilter);
  }

  applyFilter();
})();
