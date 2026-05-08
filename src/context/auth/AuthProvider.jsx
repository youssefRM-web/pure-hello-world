import { useReducer, useEffect } from 'react';
import { v4 as uuid } from 'uuid';

import { getCurrentUser, setCurrentUser, getUserRecord, upsertUserRecord } from 'db/mockStore';

import AuthContext from './auth-context';

const initialState = {
  user:"",
  name: "",
  lastName: "",
  email: "",
  phoneNumber: "",
  addresses: [],
  isVerified: false,
  isAdmin: false,
  authIsReady: true,
};

const authReducer = (state, action) => {
  switch (action.type) {
    case 'AUTH_IS_READY': {
      return {
        user: action.payload.user,
        name: action.payload.name,
        lastName: action.payload.lastName,
        email: action.payload.email,
        phoneNumber: action.payload.phoneNumber || null,
        addresses: action.payload.addresses || [],
        isVerified: true,
        isAdmin: action.payload.isAdmin || null,
        authIsReady: true,
      };
    }

    case 'ANONYMOUS_AUTH_IS_READY': {
      return {
        ...initialState,
        user: action.payload.user,
        authIsReady: true,
      };
    }

    case 'LOGIN': {
      return {
        ...state,
        user: action.payload.user,
        name: action.payload.name,
        lastName: action.payload.lastName,
        email: action.payload.email,
        phoneNumber: action.payload.phoneNumber || null,
        addresses: action.payload.addresses || [],
        isVerified: action.payload.isVerified,
        isAdmin: action.payload.isAdmin || null,
      };
    }

    case 'LOGOUT': {
      return {
        ...initialState,
      };
    }

    case 'UPDATE_USER': {
      return {
        ...state,
        ...action.payload,
      };
    }

    case 'UPDATE_ADDRESSES': {
      return {
        ...state,
        addresses: action.payload,
      };
    }

    default: {
      return state;
    }
  }
};

const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    let stored = getCurrentUser();
    if (!stored) {
      // Create an anonymous "user" placeholder
      stored = { uid: `anon-${uuid()}`, isAnonymous: true };
      setCurrentUser(stored);
      dispatch({ type: 'ANONYMOUS_AUTH_IS_READY', payload: { user: stored } });
      return;
    }

    if (stored.isAnonymous) {
      dispatch({ type: 'ANONYMOUS_AUTH_IS_READY', payload: { user: stored } });
      return;
    }

    const record = getUserRecord(stored.uid) || {};
    dispatch({
      type: 'AUTH_IS_READY',
      payload: { user: stored, ...record },
    });
  }, []);

  console.log('auth-context', state);

  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
