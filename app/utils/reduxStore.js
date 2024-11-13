import {applyMiddleware, createStore, compose} from 'redux';
import ReduxThunk from 'redux-thunk';
import {createLogger} from 'redux-logger';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Storage from 'react-native-storage';
const storage = new Storage({
  size: 1000,
  storageBackend: AsyncStorage,
  defaultExpires: 7 * 1000 * 3600 * 24, // 7 days, eg: 1 day (1000 * 3600 * 24 milliseconds)
  enableCache: true,
});

// import { persistStore, persistReducer } from 'redux-persist';
// import storage from 'redux-persist/lib/storage'
// import rootReducer from "./reducers";

// const persistConfig = {
//   key: 'root',
//   storage,
//   /*
//   these reducers data will be available in store even after the app is restarted.
//   clears on cache clearance.
//   For account reducer, we only save user data
//   */
//   whitelist: ['account']
// };

// const persistedReducer = persistReducer(persistConfig, rootReducer);
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const logger = createLogger({collapsed: true});
const middleware = applyMiddleware( ReduxThunk);

const enhancer = composeEnhancers(middleware);

// export const reduxStore = createStore(persistedReducer, enhancer);
// export const persistor = persistStore(reduxStore);

// import { createStore } from "redux";
import {persistStore, persistReducer} from 'redux-persist';

import rootReducer from '@app/reducers';
// import storeConstants from './constants';
const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
};
const persistedReducer = persistReducer(persistConfig, rootReducer);
// const store = createStore(persistedReducer, storeConstants.DEF_STORE);
const store = createStore(persistedReducer, enhancer);
const persistor = persistStore(store);
const getPersistor = () => persistor;
const getStore = () => store;
const getState = () => {
  return store.getState();
};

export const StorageErrorTypes = {
  Expired: 'ExpiredError',
  NotFound: 'NotFoundError',
};

export const saveToken = async (token) => {
  try{
    return storage.save({
      key: 'bynde:token',
      data: token,
    });
  } catch (error) {
    console.log(error)
  }
  
};

export const loadToken = async () => {
  try{
    return storage.load({
      key: 'bynde:token',
    });
  }catch (error) {
    console.log(error)
  }
};

export const removeToken = async () => {
  try {
    await storage.remove({
      key: 'bynde:token',
    });
  } catch (error) {
    console.log(error)
  }
};

export const saveThemeType = (themeType) => {
  return storage.save({
    key: 'bynde:theme',
    data: themeType,
    expires: null, // never expires until changed
  });
};

export const loadThemeType = () => {
  return storage.load({
    key: 'bynde:theme',
  });
};

export {getStore, getState, getPersistor};
export default {
  getStore,
  getState,
  getPersistor,
};
