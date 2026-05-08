import { useState } from 'react';

import { useCartContext } from './useCartContext';

import { addAllItemsQuantity } from 'helpers/item';
import { CustomError } from 'helpers/error/customError';
import { handleError } from 'helpers/error/handleError';

import { findVariantBySku } from 'db/mockData';
import { setCart, clearCart } from 'db/mockStore';

export const useInventory = () => {
  const { dispatch } = useCartContext();

  const [isLoading, setIsLoading] = useState();
  const [error, setError] = useState();

  const checkInventory = async (items) => {
    setError(null);
    setIsLoading(true);
    try {
      let updatedItems = [...items];
      let stockDifference;

      for (const item of items) {
        const found = findVariantBySku(item.skuId);
        const availableQuantity = found ? found.sku.quantity : 0;

        if (availableQuantity <= 0) {
          stockDifference = true;
          updatedItems = updatedItems.filter((c) => c.skuId !== item.skuId);
        } else if (availableQuantity < item.quantity) {
          stockDifference = true;
          const i = updatedItems.findIndex((c) => c.skuId === item.skuId);
          updatedItems[i].quantity = availableQuantity;
        }
      }

      const total = addAllItemsQuantity(updatedItems);
      if (total === 0) {
        clearCart();
        dispatch({ type: 'DELETE_CART' });
      } else if (stockDifference) {
        setCart(updatedItems);
        dispatch({ type: 'UPDATE_CART', payload: updatedItems });
      }

      if (stockDifference) {
        throw new CustomError(
          'Available stock is limited. Quantities in cart have been updated!'
        );
      }

      setIsLoading(false);
    } catch (err) {
      console.error(err);
      setError(handleError(err));
      setIsLoading(false);
    }
  };

  return { checkInventory, isLoading, error };
};

export default useInventory;