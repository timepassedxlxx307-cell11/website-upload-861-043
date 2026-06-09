const menuButton = document.querySelector('[data-menu-toggle]');
const nav = document.querySelector('[data-site-nav]');

if (menuButton && nav) {
    menuButton.addEventListener('click', () => {
        nav.classList.toggle('is-open');
    });
}

const hero = document.querySelector('[data-hero]');

if (hero) {
    const slides = Array.from(hero.querySelectorAll('[data-hero-slide]'));
    const dots = Array.from(hero.querySelectorAll('[data-hero-dot]'));
    const prev = hero.querySelector('[data-hero-prev]');
    const next = hero.querySelector('[data-hero-next]');
    let index = 0;
    let timer = null;

    const showSlide = (nextIndex) => {
        if (!slides.length) {
            return;
        }
        index = (nextIndex + slides.length) % slides.length;
        slides.forEach((slide, i) => slide.classList.toggle('is-active', i === index));
        dots.forEach((dot, i) => dot.classList.toggle('is-active', i === index));
    };

    const start = () => {
        timer = window.setInterval(() => showSlide(index + 1), 5200);
    };

    const restart = () => {
        window.clearInterval(timer);
        start();
    };

    dots.forEach((dot) => {
        dot.addEventListener('click', () => {
            showSlide(Number(dot.dataset.heroDot || 0));
            restart();
        });
    });

    if (prev) {
        prev.addEventListener('click', () => {
            showSlide(index - 1);
            restart();
        });
    }

    if (next) {
        next.addEventListener('click', () => {
            showSlide(index + 1);
            restart();
        });
    }

    start();
}

const redirectForm = document.querySelector('[data-search-form]');

if (redirectForm) {
    redirectForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const input = redirectForm.querySelector('input[name="q"]');
        const query = input ? input.value.trim() : '';
        const url = query ? `./search.html?q=${encodeURIComponent(query)}` : './search.html';
        window.location.href = url;
    });
}

const filterInput = document.querySelector('[data-live-filter-input]');
const filterList = document.querySelector('[data-live-filter-list]');
const filterForm = document.querySelector('[data-live-filter-form]');

if (filterInput && filterList) {
    const cards = Array.from(filterList.querySelectorAll('[data-movie-card]'));
    const applyFilter = () => {
        const value = filterInput.value.trim().toLowerCase();
        cards.forEach((card) => {
            const haystack = card.dataset.search || '';
            card.style.display = !value || haystack.includes(value) ? '' : 'none';
        });
    };
    const params = new URLSearchParams(window.location.search);
    const query = params.get('q');
    if (query) {
        filterInput.value = query;
    }
    filterInput.addEventListener('input', applyFilter);
    if (filterForm) {
        filterForm.addEventListener('submit', (event) => {
            event.preventDefault();
            applyFilter();
        });
    }
    applyFilter();
}
