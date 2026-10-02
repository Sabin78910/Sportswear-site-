/**
 * Sportswear storefront entry point.
 */
import { initScrollVideo } from "./modules/scroll-video.js";
import { initCatalog } from "./modules/catalog.js";
import { initCartDrawer } from "./modules/cart-drawer.js";
import { initNewsletter } from "./modules/newsletter.js";

function init() {
  initScrollVideo();
  initCatalog();
  initCartDrawer();
  initNewsletter();

  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init, { once: true });
} else {
  init();
}
