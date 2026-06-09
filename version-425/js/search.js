(function () {
  var input = document.getElementById('siteSearchInput');
  var button = document.getElementById('siteSearchButton');
  var results = document.getElementById('siteSearchResults');
  var data = window.MOVIE_SEARCH_DATA || [];

  function imageErrorCode() {
    return "this.parentElement.classList.add('is-empty'); this.remove();";
  }

  function render(items) {
    if (!results) {
      return;
    }
    if (!items.length) {
      results.innerHTML = '<div class="search-empty">请输入关键词搜索影片。</div>';
      return;
    }
    results.innerHTML = items.slice(0, 60).map(function (item) {
      return '<article class="movie-card movie-card-compact">'
        + '<a class="poster-link" href="' + item.href + '">'
        + '<span class="poster-frame">'
        + '<img src="' + item.cover + '" alt="' + item.title.replace(/"/g, '&quot;') + '" loading="lazy" onerror="' + imageErrorCode() + '">'
        + '<span class="poster-shade"></span><span class="poster-play">▶</span></span></a>'
        + '<div class="movie-card-body">'
        + '<a class="movie-title" href="' + item.href + '">' + item.title + '</a>'
        + '<div class="movie-meta"><span>' + item.year + '</span><span>' + item.region + '</span><span>' + item.type + '</span></div>'
        + '<p>' + item.oneLine + '</p>'
        + '</div></article>';
    }).join('');
  }

  function search() {
    var query = input ? input.value.trim().toLowerCase() : '';
    if (!query) {
      render([]);
      return;
    }
    var words = query.split(/\s+/).filter(Boolean);
    var matched = data.filter(function (item) {
      var text = [item.title, item.year, item.region, item.type, item.genre, item.oneLine].join(' ').toLowerCase();
      return words.every(function (word) {
        return text.indexOf(word) !== -1;
      });
    });
    render(matched);
  }

  if (button) {
    button.addEventListener('click', search);
  }
  if (input) {
    input.addEventListener('input', search);
    render([]);
  }
})();
