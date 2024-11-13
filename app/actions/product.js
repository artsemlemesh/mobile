import * as actionType from './constants';
import { handleServerErrorNew, handleServerSuccessNew } from './common';
import * as Services from '../api/index';
import Analytics from '@app/utils/Analytics';

export const clearCart = () => (dispatch) =>
  dispatch({ type: actionType.CLEAR_CART });

export const getUserCart = () => {
  return (dispatch) => {
    dispatch({
      type: actionType.GET_CART_LOADING,
      payload: { loading: true },
    });
    Services.getCart()
      .then((response) => {
        handleServerSuccessNew(
          actionType.GET_CART_SUCCESS,
          actionType.GET_CART_LOADING,
          response,
          dispatch
        );
      })
      .catch((err) => {
        handleServerErrorNew(
          actionType.GET_CART_ERROR,
          actionType.GET_CART_LOADING,
          err,
          dispatch
        );
      });
  };
};

export const addItemToCart = (item) => {
  return (dispatch) => {
    dispatch({
      type: actionType.GET_CART_LOADING,
      payload: { loading: true },
    });
    Services.addToCart({ listing: item.id })
      .then((response) => {
        // dispatch(getUserCart());
  
        const newItem = item;

        dispatch({
          type: actionType.ADD_NEW_CART_ITEM,
          payload: { newItem: {listing: newItem }},
        });
        
        handleServerSuccessNew(
          actionType.ADD_NEW_CART_ITEM_SUCCESS,
          actionType.GET_CART_LOADING,
          response,
          dispatch 
        );
        // track Add To Cart
        Analytics.track('Add To Cart', item); 
      })
      .catch((err) => {
        handleServerErrorNew(
          actionType.ADD_NEW_CART_ITEM_ERROR,
          actionType.GET_CART_LOADING,
          err,
          dispatch
        );
      });
  };
};
export const addLocalItemToCart = (item) => {
  return (dispatch) => {
    dispatch({
      type: actionType.GET_CART_LOADING,
      payload: { loading: true },
    });

    handleServerSuccessNew(
      actionType.ADD_LOCAL_NEW_CART_ITEM_SUCCESS,
      actionType.GET_CART_LOADING,
      item,
      dispatch
    );
  };
};

export const deleteLocalItemToCart = (item) => {
  return (dispatch) => {
    dispatch({
      type: actionType.GET_CART_LOADING,
      payload: { loading: true },
    });

    handleServerSuccessNew(
      actionType.DELETE_LOCAL_CART_ITEM,
      actionType.GET_CART_LOADING,
      item,
      dispatch
    );
  };
};

export const deleteItemFromCart = (id) => {
  return (dispatch) => {
    dispatch({
      type: actionType.GET_CART_LOADING,
      payload: { loading: true },
    });
    Services.deleteFromCart(id)
      .then((response) => {
        // dispatch(getUserCart());
        dispatch({
          type: actionType.DELETE_CART_ITEM,
          payload: {id: id},
        }) 
        handleServerSuccessNew(
          actionType.DELETE_CART_ITEM_SUCCESS,
          actionType.GET_CART_LOADING,
          response,
          dispatch
        );
      })
      .catch((err) => {
        handleServerErrorNew(
          actionType.DELETE_CART_ITEM_ERROR,
          actionType.GET_CART_LOADING,
          err,
          dispatch
        );
      });
  };
};

export const addFavorite = (item) => {
  return (dispatch) => {
    dispatch({ type: actionType.ADD_NEW_FAVORITE_ITEM, payload: { item } });
  };
};

export const deleteFavorite = (id) => {
  return (dispatch) => {
    dispatch({ type: actionType.DELETE_FAVORITE_ITEM, payload: { id } });
  };
};

export const cartCheckout = (obj) => {
  return (dispatch) => {
    Services.cartCheckout(obj)
      .then((response) => {
        handleServerSuccessNew(
          actionType.CHECKOUT_SUCCESS,
          actionType.CHECKOUT_LODING,
          response,
          dispatch
        );
        // track Checkout
        Analytics.track('Checkout', {
          items: response.count,
          total: response.total,
        });
      })
      .catch((err) => {
        handleServerErrorNew(
          actionType.CHECKOUT_ERROR,
          actionType.CHECKOUT_LODING,
          err,
          dispatch
        );
      });
  };
};
