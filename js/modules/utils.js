/**
 * Shared helpers.
 */

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

/** @param {number} amount */
export const formatMoney = (amount) => currency.format(amount);

/**
 * Format seconds as a lap time, e.g. 6.75 -> "00:06.75".
 * @param {number} seconds
 */
export function formatLapTime(seconds) {
  const safe = Math.max(0, seconds || 0);
  const minutes = Math.floor(safe / 60);
  const rest = safe - minutes * 60;
  return `${String(minutes).padStart(2, "0")}:${rest.toFixed(2).padStart(5, "0")}`;
}

/**
 * Escape a string for safe insertion into HTML.
 * @param {unknown} value
 */
export function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

/** HTML that has already been escaped; safe to nest inside other templates. */
class SafeHtml {
  constructor(value) {
    this.value = value;
  }

  toString() {
    return this.value;
  }
}

/**
 * Tagged template that escapes every interpolated value.
 * Nested `html` templates (and arrays of them) are inserted as-is.
 * The result can be assigned straight to `innerHTML`.
 */
export function html(strings, ...values) {
  const out = strings.reduce((acc, str, i) => {
    if (i >= values.length) return acc + str;
    const value = values[i];
    const rendered = Array.isArray(value) ? value.map(toHtml).join("") : toHtml(value);
    return acc + str + rendered;
  }, "");
  return new SafeHtml(out);
}

/** Mark a trusted string as HTML. Never pass user input. */
export const raw = (value) => new SafeHtml(String(value));

function toHtml(value) {
  if (value == null || value === false) return "";
  if (value instanceof SafeHtml) return value.value;
  return escapeHtml(value);
}

/** Safe localStorage wrapper: storage can be blocked in private windows. */
export const storage = {
  get(key, fallback) {
    try {
      const value = localStorage.getItem(key);
      return value === null ? fallback : JSON.parse(value);
    } catch {
      return fallback;
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* storage unavailable: state stays in memory */
    }
  },
};

export const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;
