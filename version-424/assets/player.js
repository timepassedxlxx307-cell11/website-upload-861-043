import { H as Hls } from "./hls.js";

export function initMoviePlayer(source) {
    const video = document.getElementById('movie-player');
    const trigger = document.getElementById('play-trigger');
    const layer = document.querySelector('[data-player-layer]');
    let prepared = false;

    if (!video || !source) {
        return;
    }

    const prepare = () => {
        if (prepared) {
            return;
        }
        prepared = true;
        if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = source;
        } else if (Hls.isSupported()) {
            const hls = new Hls({
                enableWorker: true,
                lowLatencyMode: true,
                backBufferLength: 90
            });
            hls.loadSource(source);
            hls.attachMedia(video);
            video.hlsController = hls;
        } else {
            video.src = source;
        }
    };

    const play = () => {
        prepare();
        if (layer) {
            layer.classList.add('is-hidden');
        }
        const request = video.play();
        if (request && typeof request.catch === 'function') {
            request.catch(() => {
                if (layer) {
                    layer.classList.remove('is-hidden');
                }
            });
        }
    };

    if (trigger) {
        trigger.addEventListener('click', play);
    }

    if (layer) {
        layer.addEventListener('click', play);
    }

    video.addEventListener('play', () => {
        if (layer) {
            layer.classList.add('is-hidden');
        }
    });

    video.addEventListener('pause', () => {
        if (video.currentTime === 0 && layer) {
            layer.classList.remove('is-hidden');
        }
    });
}
