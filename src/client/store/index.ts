import { combineReducers } from 'redux';
import authModule from '@client/store/modules/authModule';
import { configureStore } from '@reduxjs/toolkit';

export default configureStore({
  reducer: combineReducers({
    [authModule.name]: authModule.reducer,
  }),
});
