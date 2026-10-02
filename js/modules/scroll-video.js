/**
 * Scroll-driven background video.
 *
 * Maps page scroll progress (0 → 1) onto the video timeline (0 → duration).
 * The video is encoded all-intra (every frame a keyframe) so seeking is instant
 * in both directions. The whole file is fetched into memory first, so scrubbing
 * never waits on the network.
 */
import { formatLapTime, prefersReducedMotion } from "./utils.js";

const SMOOTHING = 0.14;      // 0..1, higher = snappier
const END_PADDING = 0.04;    // keep clear of the last frame (some browsers show black)
const MIN_SEEK_DELTA = 0.01; // seconds

export function initScrollVideo({
  video = document.getElementById("bg-video"),
  timeEl = document.getElementById("lap-time"),
  totalEl = document.getElementById("lap-total"),
  stateEl = document.getElementById("lap-state"),
  barEl = document.getElementById("lap-bar"),
} = {}) {
  if (!video) return;

  const source = pickSource(video);
  const smoothing = prefersReducedMotion() ? 1 : SMOOTHING;

  let duration = 0;
  let current = 0;
  let ready = false;

  video.addEventListener("loadedmetadata", () => {
    duration = video.duration || 0;
    ready = duration > 0;
    if (totalEl) totalEl.textContent = `/ ${formatLapTime(duration)}`;
    if (stateEl) stateEl.textContent = "Scroll";

    // iOS Safari only paints seeks after the element has played once.
    const playback = video.play();
    if (playback?.then) playback.then(() => video.pause()).catch(() => {});
  });

  loadIntoMemory(source, (percent) => {
    if (stateEl) stateEl.textContent = `Loading ${percent}%`;
  })
    .then((objectUrl) => attach(video, objectUrl))
    .catch(() => attach(video, source)); // fall back to streaming

  const scrollProgress = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    return max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
  };

  const tick = () => {
    if (ready) {
      const target = scrollProgress() * Math.max(0, duration - END_PADDING);
      current += (target - current) * smoothing;
      if (Math.abs(target - current) < 0.002) current = target;

      if (!video.seeking && Math.abs(video.currentTime - current) > MIN_SEEK_DELTA) {
        video.currentTime = current;
      }

      if (timeEl) timeEl.textContent = formatLapTime(current);
      if (barEl) barEl.style.width = `${((current / duration) * 100).toFixed(2)}%`;
    }
    requestAnimationFrame(tick);
  };

  requestAnimationFrame(tick);
}

/** Prefer H.264 MP4; fall back to VP9 WebM for browsers without H.264. */
function pickSource(video) {
  const { srcMp4, srcWebm } = video.dataset;
  const canPlayMp4 = video.canPlayType('video/mp4; codecs="avc1.640028"') !== "";
  return canPlayMp4 || !srcWebm ? srcMp4 : srcWebm;
}

function attach(video, src) {
  video.src = src;
  video.load();
}

/**
 * Fetch the full video and return an object URL, reporting progress.
 * @param {string} url
 * @param {(percent: number) => void} onProgress
 */
async function loadIntoMemory(url, onProgress) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Video request failed: ${response.status}`);

  const total = Number(response.headers.get("content-length")) || 0;
  const type = response.headers.get("content-type") || "video/mp4";

  if (!response.body || !total) {
    return URL.createObjectURL(await response.blob());
  }

  const reader = response.body.getReader();
  const chunks = [];
  let received = 0;

  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
    received += value.length;
    onProgress(Math.round((received / total) * 100));
  }

  return URL.createObjectURL(new Blob(chunks, { type }));
}
