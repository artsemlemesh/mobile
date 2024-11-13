import * as actionType from './constants';
import { handleServerError, handleServerSuccess } from './common';
import * as Services from '../api/index';
import { loginErrorMessage } from '../utils/notifications';

export const signupUser = (req) => {
  return (dispatch) => {
    dispatch({
      type: actionType.USER_LOGIN_LOADING,
      payload: { loading: true },
    });
    Services.signUp(req.item)
      .then((response) => {
        if (req.onSuccess) {
          req.onSuccess(response);
        }

        handleServerSuccess(
          actionType.USER_RGISTER_SUCCESS,
          actionType.LOADING_DATA,
          response,
          dispatch
        );
      })
      .catch((err) => {
        if (req.onFail) {
          req.onFail(err);
        }
        handleServerError(
          actionType.USER_RGISTER_ERROR,
          actionType.LOADING_DATA,
          err,
          dispatch
        );
      });
  };
};

export const connectStripe = (data) => {
  return (dispatch) => {
    dispatch({
      type: actionType.USER_LOGIN_LOADING,
      payload: { loading: true },
    });
    Services.connectStripe(data)
      .then((response) => {
        handleServerSuccess(
          actionType.STRIPE_CONNECTION_SUCCESS,
          actionType.LOADING_DATA,
          response,
          dispatch
        );
      })
      .catch((err) => {
        // console.log('[error--]', err);
      });
  };
};

export const confirmCode = (req) => {
  return (disptch) => {
    Services.confirmCode(req.code)
      .then((response) => {
        if (req.onSuccess) {
          req.onSuccess(response);
        }
      })
      .catch((err) => {
        if (req.onFail) {
          req.onFail(err);
        }
      });
  };
};
export const resendOtp = (req) => {
  return (disptch) => {
    Services.resendOtp(req.email)
      .then((response) => {
        if (req.onSuccess) {
          req.onSuccess(response);
        }
      })
      .catch((err) => {
        if (req.onFail) {
          req.onFail(err);
        }
      });
  };
};

export const disconnectStripe = () => {
  return (dispatch) => {
    Services.disconnectStripe()
      .then((response) => {
        // console.log('[stripe]', response)
      })
      .catch((err) => {
        // console.log('[stripe]', err)
      });
  };
};

export const sendFeedback = (data) => {
  const { feedback } = data;
  return (dispatch) => {
    Services.sendFeedback(feedback)
      .then((response) => {
        if (data.onSuccess) {
          data.onSuccess(response);
        }
      })
      .catch((err) => {
        if (data.onFail) {
          data.onFail(err);
        }
      });
  };
};
