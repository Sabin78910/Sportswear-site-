/**
 * Product catalogue.
 * Replace with a fetch from your commerce backend (Shopify, Medusa, etc.) when ready.
 *
 * @typedef {Object} Product
 * @property {string}   id
 * @property {string}   name
 * @property {string}   category
 * @property {number}   price     Price in whole US dollars.
 * @property {string}   sku
 * @property {string}   image
 * @property {string}   description
 * @property {string[]} sizes
 * @property {string}   [tag]
 */

/** @type {ReadonlyArray<Product>} */
export const PRODUCTS = Object.freeze([
  {
    id: "nimbus",
    name: "Nimbus Tulle Parka",
    category: "Outerwear",
    price: 1240,
    sku: "SW-OW-0126",
    image: "assets/images/products/nimbus.jpg",
    tag: "Hero piece",
    description: "38 layers of recycled tulle over a waterproof ripstop shell.",
    sizes: ["XS", "S", "M", "L", "XL"],
  },
  {
    id: "apex",
    name: "Apex Column Trouser",
    category: "Bottoms",
    price: 420,
    sku: "SW-BT-0211",
    image: "assets/images/products/apex.jpg",
    description: "Double-weave wide leg with bonded seams and a 34 cm hem.",
    sizes: ["XS", "S", "M", "L", "XL"],
  },
  {
    id: "slipstream",
    name: "Slipstream Knit Tank",
    category: "Tops",
    price: 165,
    sku: "SW-TP-0304",
    image: "assets/images/products/slipstream.jpg",
    tag: "New",
    description: "Seamless jacquard knit with gradient airflow panels.",
    sizes: ["XS", "S", "M", "L", "XL"],
  },
  {
    id: "grid",
    name: "Grid Crouch Set",
    category: "Sets",
    price: 560,
    sku: "SW-ST-0402",
    image: "assets/images/products/grid.jpg",
    description: "Matching tank and column trouser in Glacier Teal.",
    sizes: ["XS", "S", "M", "L", "XL"],
  },
  {
    id: "livery",
    name: "Livery 01 Drift Shell",
    category: "Pit Lane",
    price: 690,
    sku: "SW-PL-0001",
    image: "assets/images/products/livery.jpg",
    tag: "No.1 / 400",
    description: "Red and carbon panels cut from the No.1 livery, fire-retardant lining.",
    sizes: ["S", "M", "L", "XL"],
  },
  {
    id: "pitvest",
    name: "Pit Board Ripstop Vest",
    category: "Pit Lane",
    price: 310,
    sku: "SW-PL-0007",
    image: "assets/images/products/pitlane.jpg",
    tag: "No.1 / 400",
    description: "Sponsor-strip ripstop vest with a magnetic number panel.",
    sizes: ["S", "M", "L", "XL"],
  },
]);

export const CATEGORIES = Object.freeze(["All", "Outerwear", "Tops", "Bottoms", "Sets", "Pit Lane"]);

/**
 * @param {string} id
 * @returns {Product | undefined}
 */
export const getProduct = (id) => PRODUCTS.find((product) => product.id === id);
