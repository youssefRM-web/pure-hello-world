import { useState } from 'react';
import { v4 as uuid } from 'uuid';
import { useNavigate } from 'react-router-dom';

import { useAuthContext } from './useAuthContext';
import { useCartContext } from './useCartContext';

import {
  setCurrentUser,
  upsertUserRecord,
  getUserRecord,
  getUsers,
} from 'db/mockStore';

export const useAuth = () => {
  const navigate = useNavigate();

  const { dispatch: dispatchAuthAction } = useAuthContext();
  const { dispatch: dispatchCartAction } = useCartContext();

  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [defaultValue, setDefaultValue] = useState(false);

  const signUp = async ({ name, lastName, email, password }) => {
    setError(null);
    setIsLoading(true);
    setDefaultValue({ name, lastName, email });

    try {
      const uid = `user-${uuid()}`;
      const user = { uid, email, isAnonymous: false };
      const userData = {
        name,
        lastName,
        email,
        phoneNumber: null,
        addresses: [],
        isVerified: true,
        password, // mock-only — do NOT do this in real apps
      };
      upsertUserRecord(uid, userData);
      setCurrentUser(user);
      dispatchAuthAction({ type: 'LOGIN', payload: { user, ...userData } });
      setIsLoading(false);
      navigate('/');
    } catch (err) {
      console.error(err);
      setError({ message: err.message });
      setIsLoading(false);
    }
  };

  const login = async ({ email, password }) => {
    setError(null);
    setIsLoading(true);
    setDefaultValue({ email });

    try {
      dispatchCartAction({ type: 'IS_LOGIN' });

      const all = getUsers();
      let foundUid = Object.keys(all).find((uid) => all[uid].email === email);

      let user;
      let userData;
      if (foundUid) {
        userData = all[foundUid];
        user = { uid: foundUid, email, isAnonymous: false };
      } else {
        // Mock: accept any email/password and create the account on the fly
        const uid = `user-${uuid()}`;
        userData = {
          name: email.split('@')[0] || 'User',
          lastName: '',
          email,
          phoneNumber: null,
          addresses: [],
          isVerified: true,
          password,
        };
        upsertUserRecord(uid, userData);
        user = { uid, email, isAnonymous: false };
      }

      setCurrentUser(user);
      dispatchAuthAction({ type: 'LOGIN', payload: { user, ...userData } });
      setIsLoading(false);
      navigate('/');
    } catch (err) {
      console.error(err);
      setError({ message: err.message });
      dispatchCartAction({ type: 'IS_NOT_LOGIN' });
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setError(null);
    setIsLoading(true);
    try {
      const anon = { uid: `anon-${uuid()}`, isAnonymous: true };
      setCurrentUser(anon);
      dispatchCartAction({ type: 'DELETE_CART' });
      dispatchAuthAction({ type: 'LOGOUT' });
      // re-init anonymous user so other hooks have user.uid
      dispatchAuthAction({ type: 'ANONYMOUS_AUTH_IS_READY', payload: { user: anon } });
      setIsLoading(false);
    } catch (err) {
      console.error(err);
      setError({ message: err.message });
      setIsLoading(false);
    }
  };

  return { signUp, login, logout, isLoading, error, defaultValue };
};