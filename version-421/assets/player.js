function initMoviePlayer(streamUrl) {
    var video = document.getElementById("movie-video");
    var overlay = document.getElementById("play-overlay");
    var hls = null;

    if (!video || !streamUrl) {
        return;
    }

    function attach() {
        if (video.getAttribute("data-ready") === "1") {
            return;
        }
        if (video.canPlayType("application/vnd.apple.mpegurl")) {
            video.src = streamUrl;
        } else if (window.Hls && window.Hls.isSupported()) {
            hls = new window.Hls({
                enableWorker: true,
                lowLatencyMode: true
            });
            hls.loadSource(streamUrl);
            hls.attachMedia(video);
        } else {
            video.src = streamUrl;
        }
        video.setAttribute("data-ready", "1");
    }

    function start() {
        attach();
        if (overlay) {
            overlay.classList.add("is-hidden");
        }
        var promise = video.play();
        if (promise && typeof promise.catch === "function") {
            promise.catch(function () {});
        }
    }

    if (overlay) {
        overlay.addEventListener("click", start);
    }

    video.addEventListener("click", function () {
        if (video.paused) {
            start();
        }
    });

    video.addEventListener("play", function () {
        if (overlay) {
            overlay.classList.add("is-hidden");
        }
    });

    window.addEventListener("beforeunload", function () {
        if (hls && typeof hls.destroy === "function") {
            hls.destroy();
        }
    });
}
