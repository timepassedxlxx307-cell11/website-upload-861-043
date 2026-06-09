(function () {
  function ready(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
    } else {
      callback();
    }
  }

  function normalize(value) {
    return String(value || "").trim().toLowerCase();
  }

  ready(function () {
    var menuButton = document.querySelector("[data-menu-button]");
    var mobileMenu = document.querySelector("[data-mobile-menu]");

    if (menuButton && mobileMenu) {
      menuButton.addEventListener("click", function () {
        mobileMenu.classList.toggle("is-open");
      });
    }

    document.querySelectorAll("[data-hero]").forEach(function (hero) {
      var slides = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-slide]"));
      var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
      var prev = hero.querySelector("[data-hero-prev]");
      var next = hero.querySelector("[data-hero-next]");
      var index = 0;
      var timer = null;

      function show(nextIndex) {
        if (!slides.length) {
          return;
        }

        index = (nextIndex + slides.length) % slides.length;
        slides.forEach(function (slide, slideIndex) {
          slide.classList.toggle("is-active", slideIndex === index);
        });
        dots.forEach(function (dot, dotIndex) {
          dot.classList.toggle("is-active", dotIndex === index);
        });
      }

      function play() {
        if (timer) {
          clearInterval(timer);
        }
        timer = setInterval(function () {
          show(index + 1);
        }, 5200);
      }

      if (prev) {
        prev.addEventListener("click", function () {
          show(index - 1);
          play();
        });
      }

      if (next) {
        next.addEventListener("click", function () {
          show(index + 1);
          play();
        });
      }

      dots.forEach(function (dot) {
        dot.addEventListener("click", function () {
          show(Number(dot.getAttribute("data-hero-dot")) || 0);
          play();
        });
      });

      show(0);
      play();
    });

    var params = new URLSearchParams(window.location.search);
    var queryParam = params.get("q") || "";

    document.querySelectorAll("[data-filter-scope]").forEach(function (scope) {
      var controls = Array.prototype.slice.call(scope.querySelectorAll("[data-filter-key]"));
      var cards = Array.prototype.slice.call(scope.querySelectorAll(".movie-card, .compact-card"));
      var empty = scope.querySelector("[data-empty-result]");

      controls.forEach(function (control) {
        if (control.getAttribute("data-filter-key") === "query" && queryParam && !control.value) {
          control.value = queryParam;
        }
      });

      function applyFilters() {
        var filters = {};
        controls.forEach(function (control) {
          filters[control.getAttribute("data-filter-key")] = normalize(control.value);
        });

        var visible = 0;
        cards.forEach(function (card) {
          var haystack = normalize([
            card.getAttribute("data-title"),
            card.getAttribute("data-region"),
            card.getAttribute("data-type"),
            card.getAttribute("data-year"),
            card.getAttribute("data-genre"),
            card.getAttribute("data-tags")
          ].join(" "));

          var matches = true;
          if (filters.query && haystack.indexOf(filters.query) === -1) {
            matches = false;
          }
          ["region", "type", "year", "genre"].forEach(function (key) {
            if (filters[key] && normalize(card.getAttribute("data-" + key)).indexOf(filters[key]) === -1) {
              matches = false;
            }
          });

          card.classList.toggle("is-hidden", !matches);
          if (matches) {
            visible += 1;
          }
        });

        if (empty) {
          empty.hidden = visible !== 0;
        }
      }

      controls.forEach(function (control) {
        control.addEventListener("input", applyFilters);
        control.addEventListener("change", applyFilters);
      });

      applyFilters();
    });
  });
})();
