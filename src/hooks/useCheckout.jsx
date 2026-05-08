import { useState } from 'react';

import { useCheckoutContext } from './useCheckoutContext';
import { useAddress } from './useAddress';

import {
  getCheckoutSession,
  setCheckoutSession,
  clearCheckoutSession,
} from 'db/mockStore';

export const useCheckout = () => {
  const { dispatch } = useCheckoutContext();
  const { createAddress } = useAddress();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateSession = (patch) => {
    const current = getCheckoutSession() || {};
    setCheckoutSession({ ...current, ...patch });
  };

  const selectPreviousStep = () => dispatch({ type: 'SELECT_PREVIOUS_STEP' });
  const selectStep = (index) => dispatch({ type: 'SELECT_STEP', payload: index });

  const submitShippingInfo = async (userInput) => {
    setError(null);
    setIsLoading(true);
    try {
      const { email, ...shippingAddress } = userInput;
      let formatted = shippingAddress;
      if (shippingAddress.value === 'new') {
        const created = await createAddress({ ...shippingAddress });
        if (created) formatted = created;
      }
      updateSession({ email, shippingAddressId: formatted.id });
      dispatch({
        type: 'SUBMIT_SHIPPING_INFO',
        payload: { email, shippingAddress: formatted },
      });
      setIsLoading(false);
    } catch (err) {
      console.error(err);
      setError(err);
      setIsLoading(false);
    }
  };

  const selectShippingOption = (option) => {
    const selectedOption =
      option === 'standard'
        ? { standard: true, expedited: false }
        : { standard: false, expedited: true };
    dispatch({ type: 'SELECT_SHIPPING_OPTION', payload: selectedOption });
  };

  const submitShippingOption = async ({ shippingOption, shippingCost = 0 }) => {
    setError(null);
    setIsLoading(true);
    try {
      updateSession({ shippingOption, shippingCost });
      dispatch({ type: 'SUBMIT_SHIPPING_OPTION', payload: shippingCost });
      setIsLoading(false);
    } catch (err) {
      console.error(err);
      setError(err);
      setIsLoading(false);
    }
  };

  const deleteCheckoutSession = async () => {
    setError(null);
    setIsLoading(true);
    try {
      clearCheckoutSession();
      setIsLoading(false);
    } catch (err) {
      console.error(err);
      setError(err);
      setIsLoading(false);
    }
  };

  return {
    selectPreviousStep,
    selectStep,
    submitShippingInfo,
    selectShippingOption,
    submitShippingOption,
    deleteCheckoutSession,
    isLoading,
    error,
  };
};