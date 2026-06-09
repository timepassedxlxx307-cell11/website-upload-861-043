(function () {
    function ready(fn) {
        if (document.readyState !== "loading") {
            fn();
        } else {
            document.addEventListener("DOMContentLoaded", fn);
        }
    }

    ready(function () {
        var toggle = document.querySelector("[data-mobile-toggle]");
        var menu = document.querySelector("[data-mobile-menu]");
        if (toggle && menu) {
            toggle.addEventListener("click", function () {
                menu.classList.toggle("is-open");
            });
        }

        var hero = document.querySelector("[data-hero]");
        if (hero) {
            var slides = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-slide]"));
            var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
            var prev = hero.querySelector("[data-hero-prev]");
            var next = hero.querySelector("[data-hero-next]");
            var active = 0;
            var timer = null;

            function show(index) {
                if (!slides.length) {
                    return;
                }
                active = (index + slides.length) % slides.length;
                slides.forEach(function (slide, i) {
                    slide.classList.toggle("is-active", i === active);
                });
                dots.forEach(function (dot, i) {
                    dot.classList.toggle("is-active", i === active);
                });
            }

            function start() {
                stop();
                timer = window.setInterval(function () {
                    show(active + 1);
                }, 5200);
            }

            function stop() {
                if (timer) {
                    window.clearInterval(timer);
                }
            }

            if (prev) {
                prev.addEventListener("click", function () {
                    show(active - 1);
                    start();
                });
            }
            if (next) {
                next.addEventListener("click", function () {
                    show(active + 1);
                    start();
                });
            }
            dots.forEach(function (dot) {
                dot.addEventListener("click", function () {
                    show(Number(dot.getAttribute("data-hero-dot")) || 0);
                    start();
                });
            });
            hero.addEventListener("mouseenter", stop);
            hero.addEventListener("mouseleave", start);
            show(0);
            start();
        }

        var scopes = Array.prototype.slice.call(document.querySelectorAll("[data-filter-scope]"));
        scopes.forEach(function (scope) {
            var input = scope.querySelector("[data-filter-input]");
            var region = scope.querySelector("[data-filter-region]");
            var type = scope.querySelector("[data-filter-type]");
            var year = scope.querySelector("[data-filter-year]");
            var genre = scope.querySelector("[data-filter-genre]");
            var holder = scope.parentElement || document;
            var cards = Array.prototype.slice.call(holder.querySelectorAll("[data-card]"));

            function normalize(value) {
                return (value || "").toString().toLowerCase().trim();
            }

            function apply() {
                var q = normalize(input && input.value);
                var r = region ? region.value : "";
                var t = type ? type.value : "";
                var y = year ? year.value : "";
                var g = genre ? genre.value : "";
                cards.forEach(function (card) {
                    var haystack = normalize(card.getAttribute("data-haystack"));
                    var ok = true;
                    if (q && haystack.indexOf(q) === -1) {
                        ok = false;
                    }
                    if (r && card.getAttribute("data-region") !== r) {
                        ok = false;
                    }
                    if (t && card.getAttribute("data-type") !== t) {
                        ok = false;
                    }
                    if (y && card.getAttribute("data-year") !== y) {
                        ok = false;
                    }
                    if (g && (card.getAttribute("data-genre") || "").indexOf(g) === -1) {
                        ok = false;
                    }
                    card.hidden = !ok;
                });
            }

            [input, region, type, year, genre].forEach(function (control) {
                if (control) {
                    control.addEventListener("input", apply);
                    control.addEventListener("change", apply);
                }
            });

            var params = new URLSearchParams(window.location.search);
            if (input && params.get("q")) {
                input.value = params.get("q");
            }
            apply();
        });
    });
})();
