import * as actionType from './constants';
import { handleServerError, handleServerSuccess } from './common';
import * as Services from '../api/index';

export const getShopList = (payload = {}) => {
  return (dispatch) => {
    dispatch({
      type: actionType.GET_SHOP_LIST_LOADING,
      payload: {
        loading: true,
      },
    });
    Services.getListings(payload.url)
      .then((response) => {
        if (payload.onSuccess) {
          payload.onSuccess();
        }
        handleServerSuccess(
          actionType.GET_SHOP_LIST_SUCCESS,
          actionType.GET_SHOP_LIST_LOADING,
          response,
          dispatch
        );
      })
      .catch((err) => {
        dispatch({
          type: actionType.GET_SHOP_LIST_LOADING,
          payload: { loading: false },
        });
        if (payload.onFail) {
          payload.onFail();
        }
        handleServerError(
          actionType.GET_SHOP_LIST_ERROR,
          actionType.GET_ROOM_LIST_LOADING,
          err,
          dispatch
        );
      });
  };
};

export const setFinishedCheckout = (status) => {
  return (dispatch) => {
    dispatch({
      type: actionType.FINISH_CHECKOUT,
      payload: {
        status,
      },
    });
  };
};

export const getListingDetail = (id) => {
  return new Promise((resolve, reject) => {
    Services.getListingDetail(id)
      .then((response) => {
        resolve({
          statusCode: response.status,
          body: response,
        });
      })
      .catch((error) => {
        if (error !== undefined) {
          resolve({
            statusCode: error.response.status,
            body: error,
          });
        } else {
          reject(new Error('Check Your Connection'));
        }
      });
  });
};

export const applyFilter = () => {
  return (dispatch) => {
    Services.applyFilter()
      .then((response) => {
        handleServerSuccess(
          actionType.APPLY_FILTER_SUCCESS,
          actionType.GET_SHOP_LIST_LOADING,
          response,
          dispatch
        );
      })
      .catch((err) => {
        dispatch({
          type: actionType.GET_SHOP_LIST_LOADING,
          payload: { loading: false },
        });
        handleServerError(
          actionType.APPLY_FILTER_ERROR,
          actionType.GET_ROOM_LIST_LOADING,
          err,
          dispatch
        );
      });
  };
};

export const getPurchasedBundles = () => (dispatch) => {
  dispatch({
    type: actionType.GET_SHOP_LIST_LOADING,
    payload: {
      loading: true,
    },
  });
  Services.getListingsPurchasedBy()
    .then((response) => {
      handleServerSuccess(
        actionType.GET_PURCHASED_LIST_SUCCESS,
        actionType.GET_SHOP_LIST_LOADING,
        response,
        dispatch
      );
    })
    .catch((err) => {
      dispatch({
        type: actionType.GET_SHOP_LIST_LOADING,
        payload: { loading: false },
      });
      handleServerError(
        actionType.GET_PURCHASED_LIST_ERROR,
        actionType.GET_ROOM_LIST_LOADING,
        err,
        dispatch
      );
    });
};

export const getSingleListingDetail = (id) => (dispatch) => {
  dispatch({
    type: actionType.GET_LISTING_DETAILS_LOADING,
    payload: {
      loading: true,
    },
  });
  Services.getListingDetail(id)
    .then((response) => {
      handleServerSuccess(
        actionType.GET_LISTING_DETAILS_SUCCESS,
        actionType.GET_LISTING_DETAILS_LOADING,
        response,
        dispatch
      );
    })
    .catch((err) => {
      handleServerError(
        actionType.GET_LISTING_DETAILS_ERROR,
        actionType.GET_LISTING_DETAILS_LOADING,
        err,
        dispatch
      );
    });
};

export const confirmOrder = (id) => (dispatch) => {
  dispatch({
    type: actionType.SELLER_CONFIRM_ORDER_LOADING,
    payload: {
      loading: true,
    },
  });
  Services.confirmOrder(id)
    .then((response) => {
      handleServerSuccess(
        actionType.SELLER_CONFIRM_ORDER_SUCCESS,
        actionType.SELLER_CONFIRM_ORDER_LOADING,
        response,
        dispatch
      );
    })
    .catch((err) => {
      console.log('Errir', JSON.stringify(err));
      handleServerError(
        actionType.SELLER_CONFIRM_ORDER_ERROR,
        actionType.SELLER_CONFIRM_ORDER_LOADING,
        err,
        dispatch
      );
    });
};

export const cancelOrder = (id, reason) => (dispatch) => {
  dispatch({
    type: actionType.SELLER_CANCEL_ORDER_LOADING,
    payload: {
      loading: true,
    },
  });
  Services.cancelOrder(id, reason)
    .then((response) => {
      handleServerSuccess(
        actionType.SELLER_CANCEL_ORDER_SUCCESS,
        actionType.SELLER_CANCEL_ORDER_LOADING,
        response,
        dispatch
      );
    })
    .catch((err) => {
      console.log('Errir', JSON.stringify(err));
      handleServerError(
        actionType.SELLER_CANCEL_ORDER_ERROR,
        actionType.SELLER_CANCEL_ORDER_LOADING,
        err,
        dispatch
      );
    });
};

export const BuyerOrderCancel = (id, reason) => (dispatch) => {
  dispatch({
    type: actionType.BUYER_CANCEL_ORDER_LOADING,
    payload: {
      loading: true,
    },
  });
  Services.BuyerCancelOrder(id, reason)
    .then((response) => {
      handleServerSuccess(
        actionType.BUYER_CANCEL_ORDER_SUCCESS,
        actionType.BUYER_CANCEL_ORDER_LOADING,
        response,
        dispatch
      );
    })
    .catch((err) => {
      console.log('Errir', JSON.stringify(err));
      handleServerError(
        actionType.BUYER_CANCEL_ORDER_ERROR,
        actionType.BUYER_CANCEL_ORDER_LOADING,
        err,
        dispatch
      );
    });
};
export const orderDetailList = () => (dispatch) => {
  dispatch({
    type: actionType.GET_ORDER_DETAIL_LIST_LOADING,
    payload: {
      loading: true,
    },
  });
  Services.orderDetailList()
    .then((response) => {
      handleServerSuccess(
        actionType.GET_ORDER_DETAIL_LIST_SUCCESS,
        actionType.GET_ORDER_DETAIL_LIST_LOADING,
        response,
        dispatch
      );
    })
    .catch((err) => {
      handleServerError(
        actionType.GET_ORDER_DETAIL_LIST_ERROR,
        actionType.GET_ORDER_DETAIL_LIST_LOADING,
        err,
        dispatch
      );
    });
};
export const buyerOrderDetailList = () => (dispatch) => {
  dispatch({
    type: actionType.GET_BUYER_ORDER_DETAIL_LIST_LOADING,
    payload: {
      loading: true,
    },
  });
  Services.buyerOrderDetailList()
    .then((response) => {
      handleServerSuccess(
        actionType.GET_BUYER_ORDER_DETAIL_LIST_SUCCESS,
        actionType.GET_BUYER_ORDER_DETAIL_LIST_LOADING,
        response,
        dispatch
      );
    })
    .catch((err) => {
      handleServerError(
        actionType.GET_BUYER_ORDER_DETAIL_LIST_ERROR,
        actionType.GET_BUYER_ORDER_DETAIL_LIST_LOADING,
        err,
        dispatch
      );
    });
};

export const filterData = (url) => {
  return (dispatch) => {
    Services.filterData(url)
      .then((response) => {
        handleServerSuccess(
          actionType.GET_FILTER_DATA,
          actionType.GET_FILTER_DATA_LOADING,
          response,
          dispatch
        );
      })
      .catch((err) => {
        handleServerError(
          actionType.GET_FILTER_DATA_ERROR,
          actionType.GET_FILTER_DATA_LOADING,
          err,
          dispatch
        );
      });
  };
};

export const addHistory = (item) => {
  return (dispatch) => {
    handleServerSuccess(
      actionType.HISTORY_DATA,
      actionType.HISTORY_DATA_LOADING,
      item,
      dispatch
    );
  };
};

export const clearHistory = (item) => {
  return (dispatch) => {
    handleServerSuccess(
      actionType.CLEAR_HISTORY_DATA,
      actionType.HISTORY_DATA_LOADING,
      item,
      dispatch
    );
  };
};

export const review = (req) => {
  return (dispatch) => {
    Services.review(req.data)
      .then((response) => {
        if (req.isSuccess) {
          req.isSuccess(response);
        }
        handleServerSuccess(
          actionType.ADD_REVIEW,
          actionType.ADD_REVIEW_LOADING,
          response,
          dispatch
        );
      })
      .catch((err) => {
        if (req.isFail) {
          req.isFail(err);
        }
        handleServerError(
          actionType.ADD_REVIEW_ERROR,
          actionType.ADD_REVIEW_LOADING,
          err,
          dispatch
        );
      });
  };
};

export const orderReceived = (id) => {
  return (dispatch) => {
    Services.receive(id)
      .then((response) => {
        handleServerSuccess(
          actionType.MARK_LISTING_RECEIVED,
          actionType.MARK_LISTING_RECEIVED_LOADING,
          response,
          dispatch
        );
      })
      .catch((err) => {
        handleServerError(
          actionType.MARK_LISTING_RECEIVED_ERROR,
          actionType.MARK_LISTING_RECEIVED_LOADING,
          err,
          dispatch
        );
      });
  };
};
