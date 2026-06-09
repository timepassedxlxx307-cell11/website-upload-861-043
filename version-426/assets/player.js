(function () {
  var video = document.getElementById('moviePlayer');
  var cover = document.querySelector('.player-cover');
  var button = document.querySelector('.player-start');
  var attached = false;
  var hls = null;

  function startPlayer() {
    if (!video || !button) {
      return;
    }

    var stream = button.getAttribute('data-video');
    if (!stream) {
      return;
    }

    if (!attached) {
      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = stream;
      } else if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({ enableWorker: true, lowLatencyMode: true });
        hls.loadSource(stream);
        hls.attachMedia(video);
      } else {
        video.src = stream;
      }
      attached = true;
    }

    if (cover) {
      cover.classList.add('hidden');
    }

    var promise = video.play();
    if (promise && typeof promise.catch === 'function') {
      promise.catch(function () {});
    }
  }

  if (button) {
    button.addEventListener('click', function (event) {
      event.stopPropagation();
      startPlayer();
    });
  }

  if (cover) {
    cover.addEventListener('click', startPlayer);
  }

  window.addEventListener('pagehide', function () {
    if (hls && typeof hls.destroy === 'function') {
      hls.destroy();
    }
  });
})();
