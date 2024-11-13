import * as actionType from '../actions/constants';
import * as _ from 'lodash';

const initialState = {
  success: false,
  error: null,
  errorCheckout: null,
  errorGetCart : null,
  carts: [],
  favorites: [],
  favors: [],
  loading: false,
  checkouts: {},
};

export default (state = initialState, action) => {
  let filteredData;
  let product;
  switch (action.type) {
    case actionType.DELETE_LOCAL_CART_ITEM: {
      return {
        ...state,
        carts: action.payload.data,
        error: null,
        success: true,
      };
    }
    case actionType.ADD_LOCAL_NEW_CART_ITEM_SUCCESS: {
      return {
        ...state,
        carts: action.payload.data,
        error: null,
        success: true,
      };
    }
    case actionType.CHECKOUT_SUCCESS: {
      return {
        ...state,
        checkouts: action.payload,
        error: null,
        success: true,
      };
    }
    case actionType.CHECKOUT_ERROR: {
      return { ...state, success: false, errorCheckout: action.payload.error };
    }

    case actionType.CLEAR_CART: {
      return {
        ...state,
        carts: [],
        error: null,
        success: false,
        loading: false,
      };
    }
    case actionType.GET_CART_LOADING: {
      return {
        ...state,
        loading: action.payload.loading,
      };
    }
    case actionType.GET_CART_SUCCESS: {
      const { carts } = state;
      const cartItems = action.payload.data.items

      return {
        ...state,
        success: true,
        carts:
          carts.length === cartItems.length
            ? carts
            : cartItems.length > 0 ? cartItems : [],
      };
    }
    case actionType.GET_CART_ERROR: {
      return {
        ...state,
        success: false,
        carts: [],
        errorGetCart: action.payload.error,
      };
    }
    case actionType.ADD_NEW_CART_ITEM: {

      const newItem = action.payload.newItem;
      const isItemAlreadyInCart = state.carts.some(cartItem => cartItem.listing.id === newItem.listing.id);

      return {
        ...state,
        carts: isItemAlreadyInCart ? state.carts : [...state.carts, newItem],
      };
    }
    case actionType.ADD_NEW_CART_ITEM_SUCCESS: {
      return {
        ...state,
        success: true,
        error: null,
      };
    }
    case actionType.ADD_NEW_CART_ITEM_ERROR: {
      return {
        ...state,
        success: false,
        error: action.payload.error,
      };
    }
    case actionType.DELETE_CART_ITEM: {
      const id = action.payload.id;
    
      return {
        ...state,
        carts: state.carts.filter((item) => item.listing.id !== id),
      };
    }    
    
    case actionType.DELETE_CART_ITEM_SUCCESS: {
      return {
        ...state,
        success: true,
        error: null,
      };
    }
    case actionType.DELETE_CART_ITEM_ERROR: {
      return {
        ...state,
        success: false,
        error: action.payload.error,
      };
    }
    case actionType.USER_LOGOUT:
      return initialState;
    default:
      return state;
  }
};
