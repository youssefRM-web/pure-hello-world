## Goal
Remove Firebase entirely from the project and run everything off local mock data, using the images already in `src/assets/images` as placeholders for products / variants / slides. UI keeps working; data is in-memory (with `localStorage` for cart/auth/orders so basic flows still feel real).

## Scope of removal
- Delete: `src/db/config.jsx`, `src/db/firebase-config.js`
- Drop `firebase` from `package.json`
- Rewrite every hook/context that imports from `firebase/*` or `db/config` to use a local mock layer instead. Files affected:
  - Contexts: `AuthProvider`, `CartProvider`, `CheckoutProvider`, `ProductProvider`
  - Hooks: `useAuth`, `useAdmin`, `useAddress`, `useCart`, `useCheckout`, `useCollection`, `useInventory`, `useNewsletter`, `useOrder`, `useProfile`, `useSeed`
- Remove Firebase URLs in `data.jsx` files (NavDrawer, HomePage Collections, HomePage Slideshow) and replace with imports from `src/assets/images`.

## New mock data layer
Add `src/db/mockData.js` that exports:
- `mockProducts` — a small catalog (~6 products) shaped like the Firestore schema the app already expects (`productId`, `slug`, `price`, `tags`, `variants[]` with `color`, `images[]`, `sizes[]`, `skus[]`, `availableQuantity`, `discount`, `isSoldOut`, etc.). All `images` point to local `src/assets/images/*` files.
- `mockCollections` keyed by `products | anime | music`, each returning a slice of `mockProducts`.
- Helpers: `getProductBySlug`, `getCollection`, `getRelatedProducts`.

Add `src/db/mockStore.js` — a tiny localStorage-backed store for `auth`, `cart`, `addresses`, `orders`, `profile`, `newsletter`. Each domain exposes `get/set/subscribe` so contexts can read/write without Firebase.

## Hook/context rewrites (behavior preserved, data local)
- **AuthProvider / useAuth**: `signup/login/logout/resetPassword` operate on `mockStore.auth`. No anonymous auth — just an "anonymous" placeholder user on first load. Persist current user in localStorage.
- **ProductProvider / useCollection / useProduct**: read from `mockData`. Pagination just slices the array; `hasMore` flips false after one page. Keep the same return shape so `ProductCard`, `CollectionPage`, `ProductPage` render unchanged.
- **CartProvider / useCart**: cart lives in `mockStore.cart`. Adding/removing/updating quantity mutates local state + persists.
- **CheckoutProvider / useCheckout**: stepper state stays in memory; "place order" pushes into `mockStore.orders` and clears the cart.
- **useAddress / useProfile**: CRUD against `mockStore.addresses` / `mockStore.profile`.
- **useOrder**: lists/reads from `mockStore.orders`.
- **useInventory / useAdmin / useSeed**: stubbed no-ops that operate on the in-memory `mockProducts` array (admin add/edit/delete mutates the array for the session). `useSeed` becomes a no-op that just returns success — data is already "seeded" via `mockData`.
- **useNewsletter**: stores subscribed emails in `mockStore.newsletter`.

All hooks keep their existing **exported function names + return shapes** so no component code needs to change.

## Image replacement
Every Firebase Storage URL in `data.jsx` files becomes an `import` from `src/assets/images`. The same set of local images is reused across products, variants, slides, and collection cards as placeholders.

## Cleanup
- Delete `src/anime.json`, `src/music.json`, `src/products.json`, `src/productsss.json` (seed data no longer needed).
- Delete `src/db/firebase-config.js` and `src/db/config.jsx`.
- `bun remove firebase` (drops the dependency).

## Out of scope
- No UI/visual changes.
- No new features.
- Real backend integration — this purely swaps Firebase for an in-memory/localStorage mock so you can later plug in a different backend.

## Risk / notes
- Admin write operations (add/edit product, upload images) will only persist for the current session since there is no backend.
- Auth is mock-only: any email/password is accepted. Make sure not to ship this to production as-is.
