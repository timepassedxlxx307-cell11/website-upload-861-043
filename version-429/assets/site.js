(function () {
  function ready(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
    } else {
      callback();
    }
  }

  function initMenu() {
    var toggle = document.querySelector("[data-menu-toggle]");
    var nav = document.querySelector("[data-main-nav]");
    if (!toggle || !nav) {
      return;
    }
    toggle.addEventListener("click", function () {
      nav.classList.toggle("is-open");
    });
  }

  function initHero() {
    var root = document.querySelector("[data-hero]");
    if (!root) {
      return;
    }
    var slides = Array.prototype.slice.call(root.querySelectorAll("[data-hero-slide]"));
    var dots = Array.prototype.slice.call(root.querySelectorAll("[data-hero-dot]"));
    var prev = root.querySelector("[data-hero-prev]");
    var next = root.querySelector("[data-hero-next]");
    if (!slides.length) {
      return;
    }
    var current = 0;
    var timer = null;

    function show(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle("is-active", i === current);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle("is-active", i === current);
      });
    }

    function start() {
      stop();
      timer = window.setInterval(function () {
        show(current + 1);
      }, 5500);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
      }
    }

    dots.forEach(function (dot, i) {
      dot.addEventListener("click", function () {
        show(i);
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
    root.addEventListener("mouseenter", stop);
    root.addEventListener("mouseleave", start);
    show(0);
    start();
  }

  function initFilters() {
    var lists = Array.prototype.slice.call(document.querySelectorAll("[data-card-list]"));
    var input = document.querySelector("[data-search-input]");
    var category = document.querySelector("[data-filter-category]");
    var type = document.querySelector("[data-filter-type]");
    var year = document.querySelector("[data-filter-year]");
    if (!lists.length || (!input && !category && !type && !year)) {
      return;
    }
    var params = new URLSearchParams(window.location.search);
    var q = params.get("q");
    if (q && input) {
      input.value = q;
    }

    function includesType(card, value) {
      if (!value) {
        return true;
      }
      var raw = card.getAttribute("data-type") || "";
      return raw.indexOf(value) !== -1;
    }

    function apply() {
      var term = input ? input.value.trim().toLowerCase() : "";
      var cat = category ? category.value : "";
      var typeValue = type ? type.value : "";
      var yearValue = year ? year.value : "";
      lists.forEach(function (list) {
        Array.prototype.slice.call(list.querySelectorAll("[data-movie-card]")).forEach(function (card) {
          var search = (card.getAttribute("data-search") || "").toLowerCase();
          var ok = true;
          if (term && search.indexOf(term) === -1) {
            ok = false;
          }
          if (cat && card.getAttribute("data-category") !== cat) {
            ok = false;
          }
          if (!includesType(card, typeValue)) {
            ok = false;
          }
          if (yearValue && card.getAttribute("data-year") !== yearValue) {
            ok = false;
          }
          card.classList.toggle("is-hidden", !ok);
        });
      });
    }

    [input, category, type, year].forEach(function (control) {
      if (control) {
        control.addEventListener("input", apply);
        control.addEventListener("change", apply);
      }
    });
    apply();
  }

  function initPlayers() {
    var videos = Array.prototype.slice.call(document.querySelectorAll("video[data-video]"));
    videos.forEach(function (video) {
      var videoUrl = video.getAttribute("data-video");
      var shell = video.closest(".player-shell");
      var button = shell ? shell.querySelector("[data-play-button]") : null;
      var prepared = false;

      function prepare() {
        if (prepared || !videoUrl) {
          return;
        }
        prepared = true;
        if (video.canPlayType("application/vnd.apple.mpegurl")) {
          video.src = videoUrl;
        } else if (window.Hls && window.Hls.isSupported()) {
          var hls = new window.Hls({
            enableWorker: true,
            lowLatencyMode: true
          });
          hls.loadSource(videoUrl);
          hls.attachMedia(video);
          video.hlsPlayer = hls;
        } else {
          video.src = videoUrl;
        }
      }

      function play() {
        prepare();
        if (shell) {
          shell.classList.add("is-playing");
        }
        var result = video.play();
        if (result && typeof result.catch === "function") {
          result.catch(function () {});
        }
      }

      if (button) {
        button.addEventListener("click", play);
      }
      video.addEventListener("click", function () {
        if (video.paused) {
          play();
        }
      });
      video.addEventListener("play", function () {
        if (shell) {
          shell.classList.add("is-playing");
        }
      });
      video.addEventListener("pause", function () {
        if (shell) {
          shell.classList.remove("is-playing");
        }
      });
      video.addEventListener("ended", function () {
        if (shell) {
          shell.classList.remove("is-playing");
        }
      });
    });
  }

  ready(function () {
    initMenu();
    initHero();
    initFilters();
    initPlayers();
  });
})();
