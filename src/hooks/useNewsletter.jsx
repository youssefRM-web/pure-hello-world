import { useState } from 'react';
import { subscribe } from 'db/mockStore';
import { handleError } from 'helpers/error/handleError';

export const useNewsletter = () => {
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  const subscribeToNewsletter = async ({ email }) => {
    setError(null);
    try {
      const added = subscribe(email);
      setSuccess({ message: added ? 'Thanks for joining!' : 'You have already joined!' });
    } catch (err) {
      console.error(err);
      setError(handleError(err));
    }
  };

  return { subscribeToNewsletter, success, error };
};