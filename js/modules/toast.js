/**
 * Lightweight toast notifications.
 */
const VISIBLE_MS = 2200;
let timer;

export function showToast(message) {
  const toast = document.getElementById("toast");
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("is-visible");
  clearTimeout(timer);
  timer = setTimeout(() => toast.classList.remove("is-visible"), VISIBLE_MS);
}
