/**
 * Catalogue: category filters, product grid and the featured "Add to bag".
 */
import { PRODUCTS, CATEGORIES, getProduct } from "../data/products.js";
import { addItem } from "./cart-store.js";
import { formatMoney, html } from "./utils.js";
import { showToast } from "./toast.js";

const DEFAULT_SIZE = "M";

export function initCatalog() {
  const filtersEl = document.getElementById("filters");
  const gridEl = document.getElementById("product-grid");
  if (!filtersEl || !gridEl) return;

  let activeCategory = "All";

  const renderFilters = () => {
    filtersEl.innerHTML = CATEGORIES.map(
      (category) => html`<button type="button" data-category="${category}" aria-pressed="${category === activeCategory}">${category}</button>`
    ).join("");
  };

  const renderGrid = () => {
    const visible = PRODUCTS.filter(
      (product) => activeCategory === "All" || product.category === activeCategory
    );
    gridEl.innerHTML = visible.map(productCard).join("");
  };

  const setCategory = (category) => {
    if (!CATEGORIES.includes(category)) return;
    activeCategory = category;
    renderFilters();
    renderGrid();
  };

  filtersEl.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-category]");
    if (button) setCategory(button.dataset.category);
  });

  gridEl.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-add]");
    if (!button) return;
    const { add: id } = button.dataset;
    const size = document.getElementById(`size-${id}`)?.value ?? DEFAULT_SIZE;
    addToBag(id, size);
  });

  // Links like "Shop Pit Lane" pre-filter the grid.
  document.querySelectorAll("[data-filter-link]").forEach((link) => {
    link.addEventListener("click", () => setCategory(link.dataset.filterLink));
  });

  // Featured product board.
  document.querySelectorAll("[data-add-featured]").forEach((button) => {
    button.addEventListener("click", () => {
      const id = button.dataset.addFeatured;
      const checked = document.querySelector(`input[name="${id}-size"]:checked`);
      addToBag(id, checked?.value ?? DEFAULT_SIZE);
    });
  });

  renderFilters();
  renderGrid();
}

function addToBag(id, size) {
  const product = getProduct(id);
  if (!product) return;
  addItem(id, size);
  showToast(`Added ${product.name}, size ${size}`);
}

/** @param {import("../data/products.js").Product} product */
function productCard(product) {
  return html`
    <article class="product-card">
      <figure class="product-card__media">
        <img src="${product.image}" alt="${product.name}" loading="lazy" decoding="async" width="600" height="800">
        ${product.tag ? html`<span class="product-card__tag">${product.tag}</span>` : ""}
      </figure>
      <div class="product-card__body">
        <div class="product-card__top">
          <h3 class="product-card__name">${product.name}</h3>
          <span class="price">${formatMoney(product.price)}</span>
        </div>
        <p class="product-card__desc">${product.description}</p>
        <span class="product-card__sku">${product.sku} · ${product.category}</span>
        <div class="product-card__actions">
          <label class="visually-hidden" for="size-${product.id}">Size for ${product.name}</label>
          <select id="size-${product.id}">
            ${product.sizes.map(
              (size) => html`<option value="${size}" ${size === DEFAULT_SIZE ? "selected" : ""}>${size}</option>`
            )}
          </select>
          <button class="btn btn--small" type="button" data-add="${product.id}">Add to bag</button>
        </div>
      </div>
    </article>`;
}
