import slide1 from 'assets/images/slide-1.jpg';
import slide2 from 'assets/images/slide-2.jpg';
import slide3 from 'assets/images/slide-3.jpg';
import slide1b from 'assets/images/slide-1-b.jpg';
import slide2b from 'assets/images/slide-2-b.jpg';
import slide3b from 'assets/images/slide-3-b.jpg';
import acdc from 'assets/images/Ac dc Crop TOp (4).jpg';
import angel from 'assets/images/Angel hoodie apercu copy.jpg';
import draken from 'assets/images/Draken Top.jpg';
import hb4 from 'assets/images/HB4.jpg';
import mikey from 'assets/images/Mikey Oversized.jpg';
import myhero from 'assets/images/My hero Oversized.jpg';
import mahito from 'assets/images/mahito sukuna tee.jpg';
import ojos from 'assets/images/productos-remera-ojos-negra-1.jpg';

// Pool of placeholder images we cycle through for variants/slides
const IMG_POOL = [
  slide1, slide2, slide3, slide1b, slide2b, slide3b,
  acdc, angel, draken, hb4, mikey, myhero, mahito, ojos,
];

const pick = (i) => IMG_POOL[i % IMG_POOL.length];

const SIZES = ['s', 'm', 'l', 'xl'];

const buildSkus = (productId, variantId, baseQty = 5) =>
  SIZES.map((size, i) => ({
    skuId: `${variantId}-${size}`,
    productId,
    variantId,
    size,
    value: size,
    quantity: baseQty + i,
    order: i,
  }));

const buildVariant = ({ productId, idx, color, imgIndex, price, actualPrice, model, type, slug }) => {
  const variantId = `${productId}-v${idx}`;
  const skus = buildSkus(productId, variantId);
  const images = [
    { id: `${variantId}-img1`, name: `${variantId}-img1.jpg`, src: pick(imgIndex) },
    { id: `${variantId}-img2`, name: `${variantId}-img2.jpg`, src: pick(imgIndex + 1) },
  ];
  const slides = images.map((img) => ({ ...img, url: `${slug}-${color}` }));
  const availableQuantity = skus.reduce((acc, s) => ({ ...acc, [s.size]: s.quantity }), {});
  const sizes = SIZES;
  const isSoldOut = skus.every((s) => s.quantity === 0);
  const discount = actualPrice > price
    ? Math.round(((actualPrice - price) / actualPrice) * 100)
    : 0;

  return {
    variantId,
    productId,
    color,
    colorDisplay: color,
    variantPrice: price,
    price,
    actualPrice,
    images,
    slides,
    skus,
    sizes,
    availableQuantity,
    isSoldOut,
    discount,
    model,
    type,
    slug,
  };
};

const buildProduct = ({ id, slug, model, type, collection, description, price, actualPrice, fit, variantsDef }) => {
  const productId = id;

  const variants = variantsDef.map((v, idx) =>
    buildVariant({
      productId,
      idx,
      color: v.color,
      imgIndex: v.imgIndex,
      price,
      actualPrice,
      model,
      type,
      slug,
    })
  );

  // Cross-link allVariants and numberOfVariants
  variants.forEach((v) => {
    v.numberOfVariants = variants.length;
    v.allVariants = variants;
    v.id = v.variantId;
  });

  return {
    productId,
    id: productId,
    slug,
    model,
    type,
    collection,
    description,
    price: actualPrice,
    fit,
    tags: [collection, type, model],
    createdAt: new Date(`2024-01-${String((id.length % 28) + 1).padStart(2, '0')}`),
    variants,
    variantSlugs: variants.map((v) => `${slug}-${v.color}`),
  };
};

// ---- Catalog ----
const PRODUCTS = [
  buildProduct({
    id: 'p-anime-1',
    slug: 'my-hero-oversized',
    model: 'My Hero',
    type: 'oversized tee',
    collection: 'anime',
    description: 'Oversized tee inspired by My Hero Academia.',
    price: 29.99,
    actualPrice: 39.99,
    fit: 'oversized',
    variantsDef: [
      { color: 'black', imgIndex: 11 },
      { color: 'white', imgIndex: 6 },
    ],
  }),
  buildProduct({
    id: 'p-anime-2',
    slug: 'mahito-sukuna-tee',
    model: 'Mahito Sukuna',
    type: 'tee',
    collection: 'anime',
    description: 'Jujutsu Kaisen inspired tee.',
    price: 24.99,
    actualPrice: 24.99,
    fit: 'regular',
    variantsDef: [
      { color: 'black', imgIndex: 12 },
    ],
  }),
  buildProduct({
    id: 'p-anime-3',
    slug: 'mikey-oversized',
    model: 'Mikey',
    type: 'oversized tee',
    collection: 'anime',
    description: 'Tokyo Revengers inspired oversized tee.',
    price: 27.99,
    actualPrice: 34.99,
    fit: 'oversized',
    variantsDef: [
      { color: 'black', imgIndex: 10 },
      { color: 'gray', imgIndex: 8 },
    ],
  }),
  buildProduct({
    id: 'p-music-1',
    slug: 'acdc-crop-top',
    model: 'AC/DC',
    type: 'crop top',
    collection: 'music',
    description: 'Rock & roll crop top.',
    price: 22.0,
    actualPrice: 30.0,
    fit: 'crop',
    variantsDef: [
      { color: 'black', imgIndex: 6 },
    ],
  }),
  buildProduct({
    id: 'p-products-1',
    slug: 'angel-hoodie',
    model: 'Angel',
    type: 'hoodie',
    collection: 'products',
    description: 'Cozy gothic hoodie.',
    price: 49.99,
    actualPrice: 59.99,
    fit: 'regular',
    variantsDef: [
      { color: 'black', imgIndex: 7 },
    ],
  }),
  buildProduct({
    id: 'p-products-2',
    slug: 'ojos-tee',
    model: 'Ojos Negros',
    type: 'tee',
    collection: 'products',
    description: 'Statement graphic tee.',
    price: 19.99,
    actualPrice: 19.99,
    fit: 'regular',
    variantsDef: [
      { color: 'black', imgIndex: 13 },
    ],
  }),
];

// In-memory mutable catalog (admin can mutate this for the session)
let catalog = [...PRODUCTS];

export const getAllProducts = () => catalog;

export const getProductsByCollection = (collectionName) => {
  if (!collectionName || collectionName === 'products') return catalog;
  return catalog.filter((p) => p.collection === collectionName || p.tags?.includes(collectionName));
};

export const getProductBySlug = (slug) =>
  catalog.find((p) => p.slug === slug);

export const getProductById = (productId) =>
  catalog.find((p) => p.productId === productId);

export const findVariantBySku = (skuId) => {
  for (const p of catalog) {
    for (const v of p.variants) {
      const sku = v.skus.find((s) => s.skuId === skuId);
      if (sku) return { product: p, variant: v, sku };
    }
  }
  return null;
};

export const findVariant = (productId, variantId) => {
  const product = getProductById(productId);
  if (!product) return null;
  return product.variants.find((v) => v.variantId === variantId) || null;
};

export const flattenedVariants = () =>
  catalog.flatMap((p) => p.variants);

export const removeProduct = (productId) => {
  catalog = catalog.filter((p) => p.productId !== productId);
};

export const upsertProduct = (product) => {
  const i = catalog.findIndex((p) => p.productId === product.productId);
  if (i >= 0) catalog[i] = product;
  else catalog.push(product);
};