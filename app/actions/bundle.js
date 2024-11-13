import * as actionType from './constants';
import { handleServerError, handleServerSuccess } from './common';
import * as Services from '../api/index';

export const getSellingList = (payload = {}) => {
  return (dispatch) => {
    dispatch({
      type: actionType.GET_SELLING_LIST_LOADING,
      payload: { loading: true },
    });
    Services.getBundleList(payload.url)
      .then((response) => {
        if (payload.onSuccess) {
          payload.onSuccess();
        }
        handleServerSuccess(
          actionType.GET_SELLING_LIST_SUCCESS,
          actionType.GET_SELLING_LIST_LOADING,
          response,
          dispatch
        );
      })
      .catch((err) => {
        console.log('err', err);
        if (payload.onFail) {
          payload.onFail();
        }
        handleServerError(
          actionType.GET_SELLING_LIST_ERROR,
          actionType.GET_SELLING_LIST_LOADING,
          err,
          dispatch
        );
      });
  };
};

export const orderDetailList = (payload = {}) => {
  return (dispatch) => {
    dispatch({
      type: actionType.GET_ORDER_DETAIL_LIST_LOADING,
      payload: { loading: true },
    });
    Services.orderDetailList(payload.url)
      .then((response) => {
        if (payload.onSuccess) {
          payload.onSuccess();
        }
        handleServerSuccess(
          actionType.GET_ORDER_DETAIL_LIST_SUCCESS,
          actionType.GET_ORDER_DETAIL_LIST_LOADING,
          response,
          dispatch
        );
      })
      .catch((err) => {
        console.log('err', err);
        if (payload.onFail) {
          payload.onFail();
        }
        handleServerError(
          actionType.GET_ORDER_DETAIL_LIST_ERROR,
          actionType.GET_ORDER_DETAIL_LIST_LOADING,
          err,
          dispatch
        );
      });
  };
};

export const createNewBundle = (payload) => {
  return (dispatch) => {
    dispatch({
      type: actionType.GET_SELLING_LIST_LOADING,
      payload: { loading: true },
    });
    const { title, tags, description, seller_price } = payload.data;
    Services.createNewBundle(title, tags, description, seller_price)
      .then((response) => {
        payload.onSuccess(response.data);
        handleServerSuccess(
          actionType.ADD_NEW_BUNNDLE,
          actionType.GET_SELLING_LIST_LOADING,
          response,
          dispatch
        );
      })
      .catch((err) => {
        payload.onFail(err);
        handleServerError(
          actionType.GET_SELLING_LIST_ERROR,
          actionType.GET_SELLING_LIST_LOADING,
          err,
          dispatch
        );
      });
  };
};

export const deleteBundle = (pk) => {
  return (dispatch) => {
    dispatch({
      type: actionType.GET_SELLING_LIST_LOADING,
      payload: { loading: true },
    });
    Services.deleteBundle(pk)
      .then((response) => {
        handleServerSuccess(
          actionType.DELETE_BUNDLE_ITEM,
          actionType.GET_SELLING_LIST_LOADING,
          pk,
          dispatch
        );
        dispatch(getSellingList());
      })
      .catch((err) => {
        handleServerError(
          actionType.GET_SELLING_LIST_ERROR,
          actionType.GET_SELLING_LIST_LOADING,
          err,
          dispatch
        );
      });
  };
};

export const orderSupplies = (obj) => {
  const { data } = obj;
  return (dispatch) => {
    Services.orderSupplies(data)
      .then((response) => {
        obj.onSuccess(response.data);
      })
      .catch((err) => {
        obj.onFail(err);
      });
  };
};

export const getSellingDetail = (id) => {
  return (dispatch) => {
    dispatch({
      type: actionType.GET_SELLING_ITEM_DETAIL_LOADING,
      payload: { loading: true },
    });
    Services.getBundleDetail(id)
      .then((response) => {
        handleServerSuccess(
          actionType.GET_SELLING_ITEM_DETAIL_SUCCESS,
          actionType.GET_SELLING_LIST_LOADING,
          response,
          dispatch
        );
      })
      .catch((err) => {
        handleServerError(
          actionType.GET_SELLING_ITEM_DETAIL_ERROR,
          actionType.GET_SELLING_LIST_LOADING,
          err,
          dispatch
        );
      });
  };
};

export const orderDetail = (id) => {
  return (dispatch) => {
    dispatch({
      type: actionType.GET_ORDER_DETAIL_LOADING,
      payload: { loading: true },
    });
    Services.orderDetail(id)
      .then((response) => {
        handleServerSuccess(
          actionType.GET_ORDER_DETAIL_SUCCESS,
          actionType.GET_ORDER_DETAIL_LOADING,
          response,
          dispatch
        );
      })
      .catch((err) => {
        handleServerError(
          actionType.GET_ORDER_DETAIL_ERROR,
          actionType.GET_ORDER_DETAIL_LOADING,
          err,
          dispatch
        );
      });
  };
};

export const updateBundle = (item) => {
  return (dispatch) => {
    dispatch({
      type: actionType.GET_SELLING_LIST_LOADING,
      payload: { loading: true },
    });
    // const { pk, title, tags, description, seller_price, shipping_type } = item;
    Services.updateBundle(item.pk)
      .then((response) => {
        handleServerSuccess(
          actionType.UPDATE_BUNDLE_ITEM,
          actionType.GET_SELLING_LIST_LOADING,
          response,
          dispatch
        );
      })
      .catch((err) => {
        handleServerError(
          actionType.GET_SELLING_LIST_ERROR,
          actionType.GET_SELLING_LIST_LOADING,
          err,
          dispatch
        );
      });
  };
};

export const publishBundle = (id) => {
  return (dispatch) => {
    dispatch({
      type: actionType.GET_SELLING_LIST_LOADING,
      payload: { loading: true },
    });
    Services.publishBundle(id)
      .then((response) => {
        handleServerSuccess(
          actionType.PUBLISH_BUNDLE,
          actionType.GET_SELLING_LIST_LOADING,
          response,
          dispatch
        );
      })
      .catch((err) => {
        handleServerError(
          actionType.PUBLISH_BUNDLE_ERROR,
          actionType.GET_SELLING_LIST_LOADING,
          err,
          dispatch
        );
      });
  };
};

export const unpublishBundle = (id) => {
  return (dispatch) => {
    Services.unpublishBundle(id)
      .then((response) => {
        handleServerSuccess(
          actionType.UNPUBLISH_BUNDLE,
          actionType.UNPUBLISH_BUNDLE_LOADING,
          response,
          dispatch
        );
      })
      .catch((err) => {
        handleServerError(
          actionType.UNPUBLISH_BUNDLE_ERROR,
          actionType.UNPUBLISH_BUNDLE_LOADING,
          err,
          dispatch
        );
      });
  };
};

export const addItem = (req) => {
  return (dispatch) => {
    dispatch({
      type: actionType.GET_SELLING_LIST_LOADING,
      payload: { loading: true },
    });
    dispatch({
      type: actionType.ADD_PENDING_ITEM,
      payload: { data: req },
    });
    Services.addItem(req.pk, req.data)
      .then((response) => {
        if (req.onSuccess) {
          req.onSuccess(response);
        }
        handleServerSuccess(
          actionType.ADD_NEW_ITEM,
          actionType.GET_SELLING_LIST_LOADING,
          response,
          dispatch
        );
      })
      .catch((err) => {
        if (req.onFail) {
          req.onFail(err);
        }
        handleServerError(
          actionType.ADD_NEW_ITEM_ERROR,
          actionType.GET_SELLING_LIST_LOADING,
          err,
          dispatch
        );
      });
  };
};

export const updateItem = (listingId, id, item) => {
  return (dispatch) => {
    dispatch({
      type: actionType.GET_SELLING_LIST_LOADING,
      payload: { loading: true },
    });
    Services.updateItem(listingId, id, item)
      .then((response) => {
        handleServerSuccess(
          actionType.UPDATE_LISTING_ITEM,
          actionType.GET_SELLING_LIST_LOADING,
          response,
          dispatch
        );
      })
      .catch((err) => {
        handleServerError(
          actionType.GET_SELLING_LIST_ERROR,
          actionType.GET_SELLING_LIST_LOADING,
          err,
          dispatch
        );
      });
  };
};

export const deleteItem = (listingId, id) => {
  return (dispatch) => {
    dispatch({
      type: actionType.GET_SELLING_LIST_LOADING,
      payload: { loading: true },
    });
    const data = {
      listingId,
      id,
    };
    Services.deleteItem(listingId, id)
      .then((response) => {
        handleServerSuccess(
          actionType.DELETE_LISTING_ITEM,
          actionType.GET_SELLING_LIST_LOADING,
          data,
          dispatch
        );
      })
      .catch((err) => {
        handleServerError(
          actionType.GET_SELLING_LIST_ERROR,
          actionType.GET_SELLING_LIST_LOADING,
          err,
          dispatch
        );
      });
  };
};

export const clearImage = (req) => {
  return (dispatch) => {
    Services.clearImage(req.pk, req.data)
      .then((response) => {
        if (req.onSuccess) {
          req.onSuccess(response);
        }
        handleServerSuccess(
          actionType.CLEAR_IMAGE_DATA,
          actionType.CLEAR_IMAGE_LOADING,
          response,
          dispatch
        );
      })
      .catch((err) => {
        if (req.onFail) {
          req.onFail(err);
        }
        handleServerError(
          actionType.CLEAR_IMAGE_ERROR,
          actionType.CLEAR_IMAGE_LOADING,
          err,
          dispatch
        );
      });
  };
};

export const updateThenPublish = (item) => {
  return (dispatch) => {
    Services.updateBundle(item)
      .then((response) => {
        handleServerSuccess(
          actionType.UPDATE_BUNDLE_ITEM,
          actionType.GET_SELLING_LIST_LOADING,
          response,
          dispatch
        );
        Services.publishBundle(item.pk)
          .then((response) => {
            handleServerSuccess(
              actionType.PUBLISH_BUNDLE,
              actionType.GET_SELLING_LIST_LOADING,
              response,
              dispatch
            );
          })
          .catch((err) => {
            handleServerError(
              actionType.PUBLISH_BUNDLE_ERROR,
              actionType.GET_SELLING_LIST_LOADING,
              err,
              dispatch
            );
          });
      })
      .catch((err) => {
        handleServerError(
          actionType.GET_SELLING_LIST_ERROR,
          actionType.GET_SELLING_LIST_LOADING,
          err,
          dispatch
        );
      });
  };
};

export const addSuggestBrand = (req) => {
  return (dispatch) => {
    Services.addSuggestBrand(req.item)
      .then((response) => {
        if (req.onSuccess) {
          req.onSuccess(response);
        }
        handleServerSuccess(
          actionType.CLEAR_IMAGE_DATA,
          actionType.GET_SELLING_LIST_LOADING,
          response,
          dispatch
        );
      })
      .catch((err) => {
        if (req.onFail) {
          req.onFail(err);
        }
        handleServerError(
          actionType.ADD_NEW_ITEM_ERROR,
          actionType.GET_SELLING_LIST_LOADING,
          err,
          dispatch
        );
      });
  };
};

export const removeBackground = (req) => {
  return (dispatch) => {
    dispatch({
      type: actionType.REMOVE_BACKGROUND_LOADING,
      payload: { loading: true },
    });
    Services.removeBackground(req.data)
      .then((response) => {
        if (req.onSuccess) {
          req.onSuccess(response);
        }
        handleServerSuccess(
          actionType.REMOVE_BACKGROUND_SUCCESS,
          actionType.REMOVE_BACKGROUND_LOADING,
          response,
          dispatch
        );
      })
      .catch((err) => {
        if (req.onFail) {
          req.onFail(err.non_field_errors[0]);
        }
        handleServerError(actionType.REMOVE_BACKGROUND_ERROR, err, dispatch);
      });
  };
};

export const poolForRemoveBackground = (id) => {
  return (dispatch) => {
    dispatch({
      type: actionType.IMAGE_PROGRESS_LOADING,
      payload: { loading: true },
    });
    Services.imageProgress(id)
      .then((response) => {
        handleServerSuccess(
          actionType.IMAGE_PROGRESS_SUCCESS,
          actionType.IMAGE_PROGRESS_LOADING,
          response,
          dispatch
        );
      })
      .catch((error) => {
        if (error.statusCode === 409) {
          setTimeout(() => dispatch(poolForRemoveBackground(id)), 2000);
        } else {
          handleServerError(actionType.IMAGE_PROGRESS_ERROR, err, dispatch);
        }
      });
  };
};

export const emptyRemoveBackgroundState = () => {
  return (dispatch) => {
    dispatch({
      type: actionType.RESET_BACKGROUNDIMAGE_STATE,
      payload: null,
    });
  };
};

export const listingImageID = (req) => {
  return (dispatch) => {
    dispatch({
      type: actionType.IMAGE_ID_LOADING,
      payload: { loading: true },
    });
    Services.listingImageID(req.data)
      .then((response) => {
        if (req.onSuccess) {
          req.onSuccess(response);
        }
        handleServerSuccess(
          actionType.IMAGE_ID_SUCCESS,
          actionType.IMAGE_ID_LOADING,
          response,
          dispatch
        );
      })
      .catch((err) => {
        if (req.onFail) {
          req.onFail(err.non_field_errors[0]);
        }
        handleServerError(actionType.IMAGE_ID_ERROR, err, dispatch);
      });
  };
};
