(function () {
  function ready(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
    } else {
      callback();
    }
  }

  ready(function () {
    document.querySelectorAll("[data-player]").forEach(function (root) {
      var video = root.querySelector("video");
      var cover = root.querySelector("[data-player-cover]");
      var startButton = root.querySelector("[data-play-button]");
      var toggleButton = root.querySelector("[data-player-toggle]");
      var muteButton = root.querySelector("[data-player-mute]");
      var fullscreenButton = root.querySelector("[data-player-fullscreen]");
      var stream = root.getAttribute("data-stream");
      var prepared = false;
      var pendingPlay = false;
      var hls = null;

      if (!video || !stream) {
        return;
      }

      function markPlaying(isPlaying) {
        root.classList.toggle("is-playing", isPlaying);
        if (toggleButton) {
          toggleButton.textContent = isPlaying ? "❚❚" : "▶";
        }
      }

      function showError() {
        if (cover) {
          cover.classList.remove("is-hidden");
        }
        root.classList.remove("is-playing");
      }

      function tryPlay() {
        var playPromise = video.play();
        if (playPromise && typeof playPromise.catch === "function") {
          playPromise.catch(function () {
            setTimeout(function () {
              video.play().catch(showError);
            }, 250);
          });
        }
      }

      function prepare() {
        if (prepared) {
          return;
        }
        prepared = true;
        video.controls = true;

        if (video.canPlayType("application/vnd.apple.mpegurl")) {
          video.src = stream;
        } else if (window.Hls && window.Hls.isSupported()) {
          hls = new window.Hls({
            enableWorker: true,
            lowLatencyMode: false
          });
          hls.loadSource(stream);
          hls.attachMedia(video);
          hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
            if (pendingPlay) {
              tryPlay();
            }
          });
          hls.on(window.Hls.Events.ERROR, function (eventName, data) {
            if (data && data.fatal) {
              if (data.type === window.Hls.ErrorTypes.NETWORK_ERROR) {
                hls.startLoad();
              } else if (data.type === window.Hls.ErrorTypes.MEDIA_ERROR) {
                hls.recoverMediaError();
              } else {
                showError();
              }
            }
          });
        } else {
          video.src = stream;
        }
      }

      function start() {
        pendingPlay = true;
        prepare();
        if (cover) {
          cover.classList.add("is-hidden");
        }
        tryPlay();
      }

      function toggle() {
        prepare();
        if (video.paused) {
          start();
        } else {
          video.pause();
        }
      }

      if (cover) {
        cover.addEventListener("click", function (event) {
          event.preventDefault();
          start();
        });
      }

      if (startButton) {
        startButton.addEventListener("click", function (event) {
          event.preventDefault();
          event.stopPropagation();
          start();
        });
      }

      video.addEventListener("click", function () {
        toggle();
      });

      video.addEventListener("play", function () {
        markPlaying(true);
      });

      video.addEventListener("pause", function () {
        markPlaying(false);
      });

      video.addEventListener("ended", function () {
        pendingPlay = false;
        markPlaying(false);
        if (cover) {
          cover.classList.remove("is-hidden");
        }
      });

      if (toggleButton) {
        toggleButton.addEventListener("click", function (event) {
          event.stopPropagation();
          toggle();
        });
      }

      if (muteButton) {
        muteButton.addEventListener("click", function (event) {
          event.stopPropagation();
          video.muted = !video.muted;
          muteButton.textContent = video.muted ? "🔇" : "🔊";
        });
      }

      if (fullscreenButton) {
        fullscreenButton.addEventListener("click", function (event) {
          event.stopPropagation();
          if (document.fullscreenElement) {
            document.exitFullscreen();
          } else if (root.requestFullscreen) {
            root.requestFullscreen();
          }
        });
      }

      prepare();
    });
  });
})();
