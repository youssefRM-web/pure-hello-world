import { useState } from 'react';

import { useAuthContext } from './useAuthContext';
import { handleError } from 'helpers/error/handleError';
import { upsertUserRecord } from 'db/mockStore';

export const useProfile = () => {
  const { user, dispatch } = useAuthContext();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  const editProfile = async ({ name, lastName, phoneNumber = null }) => {
    setError(null);
    setIsLoading(true);
    try {
      if (user?.uid) {
        upsertUserRecord(user.uid, { name, lastName, phoneNumber });
      }
      dispatch({ type: 'UPDATE_USER', payload: { name, lastName, phoneNumber } });
      setIsLoading(false);
    } catch (err) {
      console.error(err);
      setError(handleError(err));
      setIsLoading(false);
    }
  };

  return { editProfile, isLoading, error };
};