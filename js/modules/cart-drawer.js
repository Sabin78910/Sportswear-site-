/**
 * Bag drawer UI: renders cart state, handles quantity changes and checkout.
 */
import { subscribe, changeQuantity, removeItem } from "./cart-store.js";
import { formatMoney, html } from "./utils.js";

export function initCartDrawer() {
  const drawer = document.getElementById("bag-drawer");
  const backdrop = document.getElementById("bag-backdrop");
  const openBtn = document.getElementById("bag-open");
  const closeBtn = document.getElementById("bag-close");
  const linesEl = document.getElementById("bag-lines");
  const footEl = document.getElementById("bag-foot");
  const countEl = document.getElementById("bag-count");
  if (!drawer || !linesEl || !footEl || !countEl) return;

  let lastFocused = null;
  let showCheckoutNote = false;
  let previousCount = null;

  /* ---- Open / close ------------------------------------------------------ */

  const open = () => {
    lastFocused = document.activeElement;
    drawer.classList.add("is-open");
    drawer.setAttribute("aria-hidden", "false");
    backdrop.hidden = false;
    closeBtn.focus();
  };

  const close = () => {
    drawer.classList.remove("is-open");
    drawer.setAttribute("aria-hidden", "true");
    backdrop.hidden = true;
    lastFocused?.focus();
  };

  openBtn.addEventListener("click", open);
  closeBtn.addEventListener("click", close);
  backdrop.addEventListener("click", close);
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && drawer.classList.contains("is-open")) close();
  });

  /* ---- Line actions ------------------------------------------------------ */

  linesEl.addEventListener("click", (event) => {
    const target = event.target.closest("button");
    if (!target) return;
    const index = Number(target.dataset.index);
    showCheckoutNote = false;

    switch (target.dataset.action) {
      case "increase": changeQuantity(index, 1); break;
      case "decrease": changeQuantity(index, -1); break;
      case "remove": removeItem(index); break;
      case "browse": close(); break;
      default: break;
    }
  });

  footEl.addEventListener("click", (event) => {
    if (event.target.closest("[data-action='checkout']")) {
      // Hook your payment provider here (e.g. redirect to Stripe Checkout).
      showCheckoutNote = true;
      render(lastState);
    }
  });

  /* ---- Render ------------------------------------------------------------ */

  let lastState;

  function render(state) {
    lastState = state;
    countEl.textContent = String(state.count);

    if (previousCount !== null && state.count > previousCount) {
      countEl.classList.remove("is-bumped");
      void countEl.offsetWidth; // restart the animation
      countEl.classList.add("is-bumped");
    }
    previousCount = state.count;

    if (state.lines.length === 0) {
      linesEl.innerHTML = html`
        <div class="bag-empty">
          <span>Your bag is empty.</span>
          <a class="btn btn--light" href="#shop" data-action="browse">Browse the collection</a>
        </div>`;
      linesEl.querySelector("[data-action='browse']").addEventListener("click", close);
      footEl.innerHTML = "";
      return;
    }

    linesEl.innerHTML = state.lines.map((line, index) => html`
      <div class="bag-line">
        <img src="${line.product.image}" alt="" width="64" height="85">
        <div>
          <h3 class="bag-line__name">${line.product.name}</h3>
          <div class="bag-line__meta">Size ${line.size} · ${line.product.sku}</div>
          <div class="qty" role="group" aria-label="Quantity for ${line.product.name}">
            <button type="button" data-action="decrease" data-index="${index}" aria-label="Decrease quantity">−</button>
            <output>${line.qty}</output>
            <button type="button" data-action="increase" data-index="${index}" aria-label="Increase quantity">+</button>
          </div>
        </div>
        <div>
          <div class="price bag-line__price">${formatMoney(line.product.price * line.qty)}</div>
          <button class="bag-line__remove" type="button" data-action="remove" data-index="${index}">Remove</button>
        </div>
      </div>`).join("");

    const shippingLabel = state.remainingForFreeShipping > 0
      ? `Add ${formatMoney(state.remainingForFreeShipping)} more for free shipping`
      : "Free shipping unlocked";

    footEl.innerHTML = html`
      <div class="shipping-meter__label">${shippingLabel}</div>
      <div class="shipping-meter__bar"><i style="width:${(state.freeShippingProgress * 100).toFixed(1)}%"></i></div>
      <div class="totals-row"><span>Subtotal</span><span>${formatMoney(state.subtotal)}</span></div>
      <div class="totals-row"><span>Shipping</span><span>${state.shipping ? formatMoney(state.shipping) : "Free"}</span></div>
      <div class="totals-row"><span>Total</span><strong>${formatMoney(state.total)}</strong></div>
      ${showCheckoutNote ? html`
        <p class="checkout-note" role="status">
          Your order of ${state.count} item${state.count > 1 ? "s" : ""} is ready for checkout.
          Payments aren't connected yet, so nothing has been charged.
        </p>` : ""}
      <button class="btn" type="button" data-action="checkout">Checkout · ${formatMoney(state.total)}</button>`;
  }

  subscribe((state) => {
    showCheckoutNote = showCheckoutNote && state.count === lastState?.count;
    render(state);
  });
}
