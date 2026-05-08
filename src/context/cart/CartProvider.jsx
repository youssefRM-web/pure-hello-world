import { useReducer, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import { useAuthContext } from 'hooks/useAuthContext';
import { useToast } from 'hooks/useToast';

import CartContext from './cart-context';

import { findVariantBySku } from 'db/mockData';
import { getCart, setCart, clearCart } from 'db/mockStore';
import { updateCartAtLogin } from 'helpers/cart';

const initialState = {
  items: [],
  cartIsReady: false,
  cartNeedsCheck: true,
  isLogin: true,
};

const cartReducer = (state, action) => {
  const { type, payload } = action;
  switch (type) {
    case 'CART_IS_READY':
      return { ...state, cartIsReady: true, isLogin: false };
    case 'CART_NOT_READY':
      return { ...state, cartIsReady: false };
    case 'UPDATE_CART':
      return { ...state, items: payload, cartIsReady: true, isLogin: false };
    case 'DELETE_CART':
      return { ...initialState, cartIsReady: true };
    case 'CHECK':
      return { ...state, cartNeedsCheck: true };
    case 'NO_CHECK':
      return { ...state, cartNeedsCheck: false };
    case 'IS_LOGIN':
      return { ...state, isLogin: true };
    case 'IS_NOT_LOGIN':
      return { ...state, isLogin: false };
    default:
      return state;
  }
};

const populateItem = (item) => {
  const found = findVariantBySku(item.skuId);
  if (!found) return null;
  const { product, variant, sku } = found;
  if (sku.quantity <= 0) return null;
  const quantity = Math.min(item.quantity, sku.quantity);
  return {
    ...item,
    quantity,
    size: sku.size,
    model: product.model,
    type: product.type,
    color: variant.color,
    price: variant.variantPrice ?? variant.price,
    slug: `${product.slug}-${variant.color}`,
    image: variant.images?.[0]?.src,
  };
};

const CartProvider = ({ children }) => {
  const { sendToast } = useToast();
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const location = useLocation();
  const { user } = useAuthContext();

  useEffect(() => {
    if (!user) {
      dispatch({ type: 'CART_IS_READY' });
      return;
    }
    if (!state.isLogin) return;

    dispatch({ type: 'CART_NOT_READY' });
    if (location.pathname === '/cart' || location.pathname === '/checkout') {
      dispatch({ type: 'NO_CHECK' });
    }

    let stored = getCart();
    let needsUpdate = false;

    if (state.items.length > 0) {
      stored = updateCartAtLogin([...state.items, ...stored]);
      needsUpdate = true;
    }

    if (stored.length === 0) {
      dispatch({ type: 'CART_IS_READY' });
      return;
    }

    const populated = stored
      .map((item) => {
        const result = populateItem(item);
        if (!result) needsUpdate = true;
        else if (result.quantity !== item.quantity) needsUpdate = true;
        return result;
      })
      .filter(Boolean);

    if (needsUpdate) {
      const persistable = populated.map((i) => ({
        skuId: i.skuId, productId: i.productId, variantId: i.variantId, quantity: i.quantity,
      }));
      if (persistable.length === 0) clearCart();
      else setCart(persistable);
      sendToast?.({ error: true, content: { message: 'Item quantities in cart have been updated!' } });
    }

    dispatch({ type: 'UPDATE_CART', payload: populated });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return (
    <CartContext.Provider value={{ ...state, dispatch }}>
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;