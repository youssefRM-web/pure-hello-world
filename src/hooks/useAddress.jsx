import { useState } from 'react';
import { v4 as uuid } from 'uuid';

import { useAuthContext } from 'hooks/useAuthContext';

import { handleError } from 'helpers/error/handleError';

import {
  upsertUserRecord,
  getCheckoutSession,
  setCheckoutSession,
} from 'db/mockStore';

export const useAddress = () => {
  const { user, addresses, dispatch } = useAuthContext();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const userAddresses = [...(addresses || [])];

  const persistAddresses = (list) => {
    if (user?.uid) upsertUserRecord(user.uid, { addresses: list });
  };

  const fmt = (s) => (s || '').trim().replace(/\s+/g, ' ');

  const createAddress = async ({
    id = null,
    name,
    lastName,
    phoneNumber,
    address,
    zipCode,
    city,
    state,
    isMain = false,
  }) => {
    setError(null);
    setIsLoading(true);
    try {
      if (!isMain) {
        isMain = userAddresses.length === 0;
      }

      if (!id) id = uuid();

      const formattedName = fmt(name);
      const formattedLastName = fmt(lastName);
      const formattedAddress = fmt(address);
      const formattedZipCode = fmt(zipCode);
      const formattedCity = fmt(city);
      const formattedState = fmt(state);

      const addressToAdd = {
        id,
        name: formattedName,
        lastName: formattedLastName,
        phoneNumber,
        address: formattedAddress,
        zipCode: formattedZipCode,
        city: formattedCity,
        state: formattedState,
        isMain,
        label: `${formattedName} ${formattedLastName} - ${formattedAddress} - ${formattedCity}, ${formattedState} ${formattedZipCode}`,
        value: id,
      };

      if (isMain && userAddresses.length > 0) {
        const idx = userAddresses.findIndex((a) => a.isMain);
        if (idx >= 0) userAddresses[idx].isMain = false;
        userAddresses.unshift(addressToAdd);
      } else {
        userAddresses.push(addressToAdd);
      }

      for (let i = 1; i <= userAddresses.length; i++) {
        userAddresses[i - 1].displayOrder = i;
      }

      persistAddresses(userAddresses);
      dispatch({ type: 'UPDATE_ADDRESSES', payload: userAddresses });
      setIsLoading(false);
      return addressToAdd;
    } catch (err) {
      console.error(err);
      setError(handleError(err));
      setIsLoading(false);
    }
  };

  const editAddress = async ({
    name,
    lastName,
    phoneNumber,
    address,
    zipCode,
    city,
    state,
    isMain,
    id,
    displayOrder,
  }) => {
    setError(null);
    setIsLoading(true);
    try {
      if (!isMain) {
        const idx = userAddresses.findIndex((a) => a.id === id);
        isMain = !!userAddresses[idx]?.isMain;
      }

      const updatedAddress = {
        id,
        name: fmt(name),
        lastName: fmt(lastName),
        phoneNumber,
        address: fmt(address),
        zipCode: fmt(zipCode),
        city: fmt(city),
        state: fmt(state),
        isMain,
        displayOrder,
      };
      updatedAddress.label = `${updatedAddress.name} ${updatedAddress.lastName} - ${updatedAddress.address} - ${updatedAddress.city}, ${updatedAddress.state} ${updatedAddress.zipCode}`;
      updatedAddress.value = id;

      let updatedAddresses = [...userAddresses];

      if (isMain) {
        updatedAddresses = userAddresses.filter((a) => a.id !== id);
        const mainIdx = updatedAddresses.findIndex((a) => a.isMain);
        if (mainIdx >= 0) updatedAddresses[mainIdx].isMain = false;
        updatedAddresses.unshift(updatedAddress);
        for (let i = 1; i <= updatedAddresses.length; i++) {
          updatedAddresses[i - 1].displayOrder = i;
        }
      } else {
        const idx = updatedAddresses.findIndex((a) => a.id === id);
        updatedAddresses[idx] = { ...updatedAddress };
      }

      persistAddresses(updatedAddresses);
      dispatch({ type: 'UPDATE_ADDRESSES', payload: updatedAddresses });
      setIsLoading(false);
    } catch (err) {
      console.error(err);
      setError(handleError(err));
      setIsLoading(false);
    }
  };

  const deleteAddress = async (id) => {
    setError(null);
    setIsLoading(true);
    try {
      const session = getCheckoutSession();
      if (session?.shippingAddressId === id) {
        setCheckoutSession({ ...session, shippingAddressId: null });
      }

      const updatedAddresses = userAddresses.filter((a) => a.id !== id);
      if (updatedAddresses.length > 0) {
        for (let i = 1; i <= updatedAddresses.length; i++) {
          updatedAddresses[i - 1].displayOrder = i;
        }
        if (!updatedAddresses.find((a) => a.isMain)) {
          updatedAddresses[0].isMain = true;
        }
      }

      persistAddresses(updatedAddresses);
      dispatch({ type: 'UPDATE_ADDRESSES', payload: updatedAddresses });
      setIsLoading(false);
    } catch (err) {
      console.error(err);
      setError(handleError(err));
      setIsLoading(false);
    }
  };

  return { createAddress, editAddress, deleteAddress, isLoading, error };
};