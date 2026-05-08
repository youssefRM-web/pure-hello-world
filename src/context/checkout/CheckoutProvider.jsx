import { useReducer, useEffect } from 'react';

import { useAuthContext } from 'hooks/useAuthContext';

import CheckoutContext from './checkout-context';

import { getCheckoutSession, setCheckoutSession } from 'db/mockStore';

const initialState = {
  checkoutIsReady: false,
  currentStep: 1,
  email: null,
  id: null,
  shippingAddress: { id: null },
  shippingOption: { standard: false, expedited: false },
  shippingCost: 0,
};

const checkoutReducer = (state, action) => {
  const { type, payload } = action;
  switch (type) {
    case 'SELECT_STEP':
      return { ...state, currentStep: payload };
    case 'SELECT_PREVIOUS_STEP':
      return { ...state, currentStep: state.currentStep - 1 };
    case 'SUBMIT_SHIPPING_INFO':
      return {
        ...state,
        currentStep: state.currentStep + 1,
        email: payload.email,
        shippingAddress: payload.shippingAddress,
      };
    case 'SELECT_SHIPPING_OPTION':
      return { ...state, shippingOption: payload };
    case 'SUBMIT_SHIPPING_OPTION':
      return { ...state, shippingCost: payload, currentStep: state.currentStep + 1 };
    case 'CREATE_CHECKOUT_SESSION':
      return { ...state, checkoutIsReady: true, id: payload.id, email: payload.email };
    case 'UPDATE_CHECKOUT_SESSION':
      return {
        ...state,
        checkoutIsReady: true,
        email: payload.email,
        id: payload.id,
        shippingAddress: payload.shippingAddress,
        shippingOption: payload.shippingOption,
        shippingCost: payload.shippingCost,
      };
    default:
      return state;
  }
};

const CheckoutProvider = ({ children }) => {
  const { email, user } = useAuthContext();
  const [state, dispatch] = useReducer(checkoutReducer, initialState);

  useEffect(() => {
    const session = getCheckoutSession();
    if (session) {
      const { shippingAddressId, ...rest } = session;
      dispatch({
        type: 'UPDATE_CHECKOUT_SESSION',
        payload: {
          ...rest,
          shippingAddress: { id: shippingAddressId },
          id: user?.uid,
          email: rest.email || email,
          shippingOption: rest.shippingOption || { standard: false, expedited: false },
          shippingCost: rest.shippingCost || 0,
        },
      });
    } else {
      const fresh = {
        email,
        shippingAddressId: null,
        shippingOption: { standard: false, expedited: false },
        paymentInfo: {},
        shippingCost: 0,
      };
      setCheckoutSession(fresh);
      dispatch({
        type: 'CREATE_CHECKOUT_SESSION',
        payload: { id: user?.uid, email },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <CheckoutContext.Provider value={{ ...state, dispatch }}>
      {children}
    </CheckoutContext.Provider>
  );
};

export default CheckoutProvider;