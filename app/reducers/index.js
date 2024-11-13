import {combineReducers} from 'redux';
import commonReducer from './common';
import userReducer from './user';
import cartReducer from './cart';
import favoriteReducer from './favorite';
import bundleReducer from './bundle';
import shopReducer from './shop';
import removeBackgroundReducer from './removedBackground';
import * as actionType from '../actions/constants';

const appReducer = combineReducers({
  common: commonReducer,
  user: userReducer,
  cart: cartReducer,
  favorite: favoriteReducer,
  bundle: bundleReducer,
  shop: shopReducer,
  removeBackground: removeBackgroundReducer
});

const rootReducer = (state, action) => {
  // if (action.type === actionType.USER_LOGOUT) {
  //   state = undefined;
  // }

  return appReducer(state, action);
};

export default rootReducer;
export type RootState = ReturnType<typeof appReducer>

