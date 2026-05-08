import { useState } from 'react';
import { v4 as uuid } from 'uuid';
import moment from 'moment';

import { useAuthContext } from './useAuthContext';
import { useCartContext } from './useCartContext';
import { useCheckoutContext } from './useCheckoutContext';
import { useCart } from './useCart';
import { useCheckout } from './useCheckout';

import { handleError } from 'helpers/error/handleError';
import { addOrder, getOrders as readOrders } from 'db/mockStore';

export const useOrder = () => {
  const { user } = useAuthContext();
  const { items } = useCartContext();
  const { email, shippingAddress, shippingOption, shippingCost } = useCheckoutContext();
  const { deleteCart } = useCart();
  const { deleteCheckoutSession } = useCheckout();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const createOrder = async (paymentInfo, billingAddress) => {
    setError(null);
    setIsLoading(true);
    try {
      addOrder({
        id: uuid(),
        createdAt: moment().toDate(),
        items,
        email,
        shippingAddress,
        shippingOption,
        shippingCost,
        paymentInfo,
        billingAddress,
        createdBy: user?.uid,
      });

      await deleteCart();
      await deleteCheckoutSession();
      setIsLoading(false);
    } catch (err) {
      console.error(err);
      setError(handleError(err));
      setIsLoading(false);
    }
  };

  const getOrders = async () => {
    setError(null);
    try {
      return readOrders().filter((o) => o.createdBy === user?.uid);
    } catch (err) {
      console.error(err);
      setError(handleError(err));
      return [];
    }
  };

  return { createOrder, getOrders, isLoading, error };
};