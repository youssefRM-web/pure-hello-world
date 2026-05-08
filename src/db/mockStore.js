// Tiny localStorage-backed store. No Firebase.

const KEYS = {
  user: 'mock.user',
  users: 'mock.users',
  cart: 'mock.cart',
  addresses: 'mock.addresses',
  profile: 'mock.profile',
  orders: 'mock.orders',
  newsletter: 'mock.newsletter',
  checkout: 'mock.checkout',
};

const safeParse = (raw, fallback) => {
  try { return raw ? JSON.parse(raw) : fallback; } catch { return fallback; }
};

const read = (key, fallback) =>
  typeof window === 'undefined' ? fallback : safeParse(window.localStorage.getItem(key), fallback);

const write = (key, value) => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(key, JSON.stringify(value));
};

const remove = (key) => {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(key);
};

// ---- Users / Auth ----
export const getCurrentUser = () => read(KEYS.user, null);
export const setCurrentUser = (user) => (user ? write(KEYS.user, user) : remove(KEYS.user));
export const getUsers = () => read(KEYS.users, {});
export const upsertUserRecord = (uid, data) => {
  const all = getUsers();
  all[uid] = { ...(all[uid] || {}), ...data };
  write(KEYS.users, all);
  return all[uid];
};
export const getUserRecord = (uid) => getUsers()[uid] || null;

// ---- Cart ----
export const getCart = () => read(KEYS.cart, []);
export const setCart = (items) => write(KEYS.cart, items);
export const clearCart = () => remove(KEYS.cart);

// ---- Addresses ----
export const getAddresses = () => read(KEYS.addresses, []);
export const setAddresses = (list) => write(KEYS.addresses, list);

// ---- Profile ----
export const getProfile = () => read(KEYS.profile, null);
export const setProfile = (p) => write(KEYS.profile, p);

// ---- Orders ----
export const getOrders = () => read(KEYS.orders, []);
export const addOrder = (order) => {
  const list = getOrders();
  list.unshift(order);
  write(KEYS.orders, list);
  return order;
};

// ---- Newsletter ----
export const getSubscribers = () => read(KEYS.newsletter, []);
export const subscribe = (email) => {
  const list = getSubscribers();
  if (list.includes(email)) return false;
  list.push(email);
  write(KEYS.newsletter, list);
  return true;
};

// ---- Checkout session ----
export const getCheckoutSession = () => read(KEYS.checkout, null);
export const setCheckoutSession = (session) => write(KEYS.checkout, session);
export const clearCheckoutSession = () => remove(KEYS.checkout);

export const STORE_KEYS = KEYS;