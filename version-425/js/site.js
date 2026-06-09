(function () {
  var toggle = document.querySelector('[data-menu-toggle]');
  var panel = document.querySelector('[data-mobile-panel]');
  if (toggle && panel) {
    toggle.addEventListener('click', function () {
      panel.classList.toggle('is-open');
    });
  }

  var hero = document.querySelector('[data-hero]');
  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
    var current = 0;
    var show = function (index) {
      if (!slides.length) {
        return;
      }
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('is-active', i === current);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('is-active', i === current);
      });
    };
    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () {
        show(i);
      });
    });
    window.setInterval(function () {
      show(current + 1);
    }, 5000);
  }

  var filterInput = document.querySelector('[data-page-filter]');
  var filterList = document.querySelector('[data-filter-list]');
  if (filterInput && filterList) {
    var cards = Array.prototype.slice.call(filterList.children);
    filterInput.addEventListener('input', function () {
      var query = filterInput.value.trim().toLowerCase();
      cards.forEach(function (card) {
        var text = card.textContent.toLowerCase();
        card.classList.toggle('is-filter-hidden', query && text.indexOf(query) === -1);
      });
    });
  }
})();
