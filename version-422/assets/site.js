(function () {
  function ready(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
    } else {
      callback();
    }
  }

  function setupNavigation() {
    var button = document.querySelector("[data-menu-toggle]");
    var panel = document.querySelector("[data-mobile-menu]");

    if (!button || !panel) {
      return;
    }

    button.addEventListener("click", function () {
      var isOpen = panel.classList.toggle("open");
      button.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
  }

  function setupHero() {
    var hero = document.querySelector("[data-hero]");

    if (!hero) {
      return;
    }

    var slides = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-slide]"));
    var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
    var prev = hero.querySelector("[data-hero-prev]");
    var next = hero.querySelector("[data-hero-next]");
    var current = 0;
    var timer = null;

    function show(index) {
      if (!slides.length) {
        return;
      }

      current = (index + slides.length) % slides.length;

      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle("hero-slide-active", slideIndex === current);
      });

      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle("active", dotIndex === current);
      });
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    }

    function start() {
      stop();
      timer = window.setInterval(function () {
        show(current + 1);
      }, 5200);
    }

    dots.forEach(function (dot, index) {
      dot.addEventListener("click", function () {
        show(index);
        start();
      });
    });

    if (prev) {
      prev.addEventListener("click", function () {
        show(current - 1);
        start();
      });
    }

    if (next) {
      next.addEventListener("click", function () {
        show(current + 1);
        start();
      });
    }

    hero.addEventListener("mouseenter", stop);
    hero.addEventListener("mouseleave", start);
    show(0);
    start();
  }

  function setupFilters() {
    var scopes = Array.prototype.slice.call(document.querySelectorAll("[data-filter-scope]"));

    scopes.forEach(function (scope) {
      var input = scope.querySelector("[data-search-input]");
      var region = scope.querySelector("[data-region-filter]");
      var type = scope.querySelector("[data-type-filter]");
      var year = scope.querySelector("[data-year-filter]");
      var cards = Array.prototype.slice.call(scope.querySelectorAll(".movie-card"));
      var empty = scope.querySelector("[data-empty-state]");
      var clear = scope.querySelector("[data-clear-filters]");
      var params = new URLSearchParams(window.location.search);
      var queryFromUrl = params.get("q");

      if (input && queryFromUrl) {
        input.value = queryFromUrl;
      }

      function valueOf(element) {
        return element ? element.value.trim().toLowerCase() : "";
      }

      function matchText(card, query) {
        if (!query) {
          return true;
        }

        var source = [
          card.dataset.title,
          card.dataset.region,
          card.dataset.type,
          card.dataset.year,
          card.dataset.genre,
          card.dataset.tags,
          card.textContent
        ].join(" ").toLowerCase();

        return source.indexOf(query) !== -1;
      }

      function matchSelect(card, key, value) {
        if (!value) {
          return true;
        }

        return (card.dataset[key] || "").toLowerCase() === value;
      }

      function apply() {
        var query = valueOf(input);
        var regionValue = valueOf(region);
        var typeValue = valueOf(type);
        var yearValue = valueOf(year);
        var visible = 0;

        cards.forEach(function (card) {
          var ok = matchText(card, query)
            && matchSelect(card, "region", regionValue)
            && matchSelect(card, "type", typeValue)
            && matchSelect(card, "year", yearValue);

          card.classList.toggle("is-hidden", !ok);

          if (ok) {
            visible += 1;
          }
        });

        if (empty) {
          empty.classList.toggle("show", visible === 0);
        }
      }

      [input, region, type, year].forEach(function (element) {
        if (!element) {
          return;
        }

        element.addEventListener("input", apply);
        element.addEventListener("change", apply);
      });

      if (clear) {
        clear.addEventListener("click", function () {
          if (input) {
            input.value = "";
          }

          if (region) {
            region.value = "";
          }

          if (type) {
            type.value = "";
          }

          if (year) {
            year.value = "";
          }

          apply();
        });
      }

      apply();
    });
  }

  function setupPlayer() {
    var video = document.querySelector("[data-player-video]");
    var button = document.querySelector("[data-play-button]");

    if (!video || !button) {
      return;
    }

    var source = button.getAttribute("data-src") || video.getAttribute("data-src");
    var hls = null;
    var initialized = false;

    function hideButton() {
      button.classList.add("hidden");
      button.setAttribute("aria-hidden", "true");
    }

    function showButton() {
      button.classList.remove("hidden");
      button.setAttribute("aria-hidden", "false");
    }

    function attachSource() {
      if (initialized) {
        return;
      }

      initialized = true;

      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = source;
        return;
      }

      if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true,
          backBufferLength: 90
        });
        hls.loadSource(source);
        hls.attachMedia(video);
        return;
      }

      video.src = source;
    }

    function playMovie() {
      attachSource();
      hideButton();

      var playPromise = video.play();

      if (playPromise && typeof playPromise.catch === "function") {
        playPromise.catch(function () {
          showButton();
        });
      }
    }

    button.addEventListener("click", playMovie);

    video.addEventListener("click", function () {
      if (video.paused) {
        playMovie();
      }
    });

    video.addEventListener("play", hideButton);
    video.addEventListener("pause", function () {
      if (!video.ended) {
        showButton();
      }
    });
    video.addEventListener("ended", showButton);

    window.addEventListener("beforeunload", function () {
      if (hls && typeof hls.destroy === "function") {
        hls.destroy();
      }
    });
  }

  ready(function () {
    setupNavigation();
    setupHero();
    setupFilters();
    setupPlayer();
  });
})();
