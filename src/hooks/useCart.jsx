import { useState } from 'react';

import { useAuthContext } from './useAuthContext';
import { useCartContext } from './useCartContext';

import { addAllItemsQuantity } from 'helpers/item';
import { CustomError } from 'helpers/error/customError';
import { handleError } from 'helpers/error/handleError';

import { findVariantBySku } from 'db/mockData';
import { setCart, clearCart } from 'db/mockStore';

const persistItems = (items) => {
  if (!items.length) clearCart();
  else setCart(items);
};

export const useCart = () => {
  useAuthContext();
  const { items, dispatch } = useCartContext();

  const [isLoading, setIsLoading] = useState(false);
  const [loadingItemId, setLoadingItemId] = useState(false);
  const [error, setError] = useState(null);

  const getCurrentStock = async (productId, skuId) => {
    const found = findVariantBySku(skuId);
    if (!found) return { quantity: 0 };
    return { quantity: found.sku.quantity };
  };

  const addItem = async (itemToAdd) => {
    if (isLoading) return;
    setLoadingItemId(itemToAdd.skuId);
    setError(null);
    setIsLoading(true);
    try {
      const itemInCartIndex = items.findIndex((i) => i.skuId === itemToAdd.skuId);
      const itemInCart = items[itemInCartIndex];
      let updatedItems = [...items];

      const { quantity: availableQuantity } = await getCurrentStock(
        itemToAdd.productId,
        itemToAdd.skuId
      );

      let noStock;
      let stockWasUpdated;

      if (availableQuantity <= 0) {
        if (itemInCart) {
          updatedItems = updatedItems.filter((i) => i.skuId !== itemInCart.skuId);
          noStock = true;
        } else {
          throw new CustomError(
            `Size ${(itemToAdd.size || '').toUpperCase()} is out of stock!`
          );
        }
      } else if (itemInCart) {
        if (itemInCart.quantity > availableQuantity) {
          itemInCart.quantity = availableQuantity;
          stockWasUpdated = true;
        } else if (itemInCart.quantity === availableQuantity) {
          throw new CustomError('All available stock is currently in cart!');
        } else {
          updatedItems[itemInCartIndex] = { ...itemInCart, quantity: itemInCart.quantity + 1 };
        }
      } else {
        updatedItems.push({ ...itemToAdd, quantity: 1 });
      }

      const cartTotalItemQuantity = addAllItemsQuantity(updatedItems);
      if (cartTotalItemQuantity === 0) {
        clearCart();
        dispatch({ type: 'DELETE_CART' });
      } else {
        persistItems(updatedItems);
        dispatch({ type: 'UPDATE_CART', payload: updatedItems });
      }

      if (noStock) throw new CustomError('This item is out of stock. Cart was updated!');
      if (stockWasUpdated) throw new CustomError('Stock is limited. Item quantity in cart updated!');

      setLoadingItemId(null);
      setIsLoading(false);
    } catch (err) {
      console.error(err);
      setError(handleError(err));
      setLoadingItemId(null);
      setIsLoading(false);
    }
  };

  const removeItem = async (productId, skuId) => {
    setLoadingItemId(skuId);
    setError(null);
    setIsLoading(true);
    try {
      const itemInCartIndex = items.findIndex((item) => item.skuId === skuId);
      const itemInCart = items[itemInCartIndex];
      let updatedItems = [...items];

      let noStock;
      let stockWasUpdated;

      if (itemInCart.quantity === 1) {
        updatedItems = items.filter((i) => i.skuId !== skuId);
      } else {
        const { quantity: availableQuantity } = await getCurrentStock(productId, skuId);
        if (availableQuantity <= 0) {
          updatedItems = updatedItems.filter((i) => i.skuId !== itemInCart.skuId);
          noStock = true;
        } else if (availableQuantity < itemInCart.quantity) {
          updatedItems[itemInCartIndex] = { ...itemInCart, quantity: availableQuantity };
          stockWasUpdated = true;
        } else {
          updatedItems[itemInCartIndex] = { ...itemInCart, quantity: itemInCart.quantity - 1 };
        }
      }

      const cartTotalItemQuantity = addAllItemsQuantity(updatedItems);
      if (cartTotalItemQuantity === 0) {
        clearCart();
        dispatch({ type: 'DELETE_CART' });
      } else {
        persistItems(updatedItems);
        dispatch({ type: 'UPDATE_CART', payload: updatedItems });
      }

      if (noStock) throw new CustomError('This item is out of stock and was removed from cart!');
      if (stockWasUpdated) throw new CustomError('Stock is limited. Item quantity in cart updated!');

      setLoadingItemId(null);
      setIsLoading(false);
    } catch (err) {
      console.error(err);
      setLoadingItemId(null);
      setError(handleError(err));
      setIsLoading(false);
    }
  };

  const deleteItem = async (skuId) => {
    setError(null);
    setIsLoading(true);
    try {
      const updatedItems = items.filter((i) => i.skuId !== skuId);
      const total = addAllItemsQuantity(updatedItems);
      if (total === 0) {
        clearCart();
        dispatch({ type: 'DELETE_CART' });
      } else {
        persistItems(updatedItems);
        dispatch({ type: 'UPDATE_CART', payload: updatedItems });
      }
      setIsLoading(false);
    } catch (err) {
      console.error(err);
      setError({ details: err.message });
      setIsLoading(false);
    }
  };

  const deleteCart = async () => {
    clearCart();
    dispatch({ type: 'DELETE_CART' });
  };

  const activateCartCheck = () => {
    dispatch({ type: 'CHECK' });
  };

  return {
    addItem,
    removeItem,
    deleteItem,
    deleteCart,
    activateCartCheck,
    isLoading,
    loadingItemId,
    error,
  };
};