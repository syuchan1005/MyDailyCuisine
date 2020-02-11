import { createSlice } from '@reduxjs/toolkit';

type AuthState = {
  accessToken?: string;
  refreshToken?: string;
  expires?: number;
};

const initialState: AuthState = {
  accessToken: undefined,
  refreshToken: undefined,
  expires: undefined,
};

export const getAuth = (store) => store.auth;

const authModule = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    set: (state, action) => {
      const s = { ...action.payload };
      if (s.expiresIn) {
        s.expires = Date.now() + s.expiresIn;
        delete s.expiresIn;
      }
      return s;
    },
    reset: () => initialState,
  },
});

export default authModule;
