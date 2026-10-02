/**
 * Cart state: a tiny observable store persisted to localStorage.
 */
import { getProduct } from "../data/products.js";
import { storage } from "./utils.js";

const STORAGE_KEY = "sportswear:bag";
export const FREE_SHIPPING_THRESHOLD = 500;
export const FLAT_SHIPPING = 18;

/** @typedef {{ id: string, size: string, qty: number }} CartLine */

/** @type {CartLine[]} */
let lines = storage
  .get(STORAGE_KEY, [])
  .filter((line) => getProduct(line.id) && Number.isInteger(line.qty) && line.qty > 0);

const listeners = new Set();

function commit() {
  storage.set(STORAGE_KEY, lines);
  listeners.forEach((listener) => listener(getState()));
}

export function subscribe(listener) {
  listeners.add(listener);
  listener(getState());
  return () => listeners.delete(listener);
}

export function getState() {
  const count = lines.reduce((sum, line) => sum + line.qty, 0);
  const subtotal = lines.reduce((sum, line) => sum + line.qty * getProduct(line.id).price, 0);
  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const shipping = count === 0 || remainingForFreeShipping === 0 ? 0 : FLAT_SHIPPING;

  return {
    lines: lines.map((line) => ({ ...line, product: getProduct(line.id) })),
    count,
    subtotal,
    shipping,
    total: subtotal + shipping,
    remainingForFreeShipping,
    freeShippingProgress: Math.min(1, subtotal / FREE_SHIPPING_THRESHOLD),
  };
}

export function addItem(id, size) {
  const existing = lines.find((line) => line.id === id && line.size === size);
  if (existing) existing.qty += 1;
  else lines.push({ id, size, qty: 1 });
  commit();
}

export function changeQuantity(index, delta) {
  const line = lines[index];
  if (!line) return;
  line.qty += delta;
  if (line.qty < 1) lines.splice(index, 1);
  commit();
}

export function removeItem(index) {
  lines.splice(index, 1);
  commit();
}
