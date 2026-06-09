import { H as Hls } from './hls-vendor-dru42stk.js';

function startPlayer(shell) {
  var video = shell.querySelector('video');
  var button = shell.querySelector('[data-play-button]');
  var source = shell.getAttribute('data-src');
  if (!video || !source) {
    return;
  }
  if (button) {
    button.classList.add('is-hidden');
  }
  if (!video.dataset.ready) {
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = source;
    } else if (Hls && Hls.isSupported()) {
      var hls = new Hls({ enableWorker: true, lowLatencyMode: true });
      hls.loadSource(source);
      hls.attachMedia(video);
      shell._hls = hls;
    } else {
      video.src = source;
    }
    video.dataset.ready = 'true';
  }
  var play = video.play();
  if (play && typeof play.catch === 'function') {
    play.catch(function () {
      if (button) {
        button.classList.remove('is-hidden');
      }
    });
  }
}

Array.prototype.slice.call(document.querySelectorAll('[data-player]')).forEach(function (shell) {
  var button = shell.querySelector('[data-play-button]');
  var video = shell.querySelector('video');
  if (button) {
    button.addEventListener('click', function () {
      startPlayer(shell);
    });
  }
  if (video) {
    video.addEventListener('click', function () {
      if (!video.dataset.ready || video.paused) {
        startPlayer(shell);
      }
    });
  }
});
