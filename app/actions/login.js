import * as actionType from './constants';
import { handleServerError, handleServerSuccess } from './common';
import * as Services from '../api/index';
import { saveTokenAndNavigate } from '@app/utils/common';
import { saveToken } from '@app/utils/reduxStore';
import Analytics from '@app/utils/Analytics';

export const loginUser = (data) => {
  return (dispatch) => {
    dispatch({
      type: actionType.USER_LOGIN_LOADING,
      payload: { loading: true },
    });
    const { email, password } = data;
    Services.signIn(email, password)
      .then((response) => {
        if (data.onSuccess) {
          data.onSuccess(response);
        }
        handleServerSuccess(
          actionType.USER_LOGIN_SUCCESS,
          actionType.USER_LOGIN_LOADING,
          response,
          dispatch
        );
      })
      .catch((err) => {
        if (data.onFail) {
          data.onFail(err);
        }
        handleServerError(
          actionType.USER_LOGIN_ERROR,
          actionType.USER_LOGIN_LOADING,
          err,
          dispatch
        );
      });
  };
};

export const refreshAuthToken = () => {
  return () => {
    Services.refreshAuthToken()
      .then((response) => {
        if (response.token) saveToken(response.token);
      })
      .catch((err) => {
        console.log({ err });
      });
  };
};

export const clearLogin = () => (dispatch) =>
  dispatch({ type: actionType.USER_LOGIN_CLEAR, payload: null });

export const timeoutLogin = () => (dispatch) =>
  dispatch({
    type: actionType.USER_LOGIN_LOADING,
    payload: { loading: false },
  });

export const logoutUser = () => {
  Analytics.reset();
  return (dispatch) => {
    dispatch({ type: actionType.USER_LOGOUT });
  };
};

export const getUserProfile = (req) => {
  return (dispatch) => {
    dispatch({
      type: actionType.GET_PROFILE_LOADING,
      payload: { loading: true },
    });
    Services.getUserProfile()
      .then((response) => {
        if (req.onSuccess) {
          req.onSuccess(response);
        }
        try {
          Analytics.identify(response.pk, {
            email: response.email,
            first_name: response.first_name,
            last_name: response.last_name,
            phone: response.phone,
            address_line1: response.address_line1,
            address_line2: response.address_line2,
            city: response.city,
            state: response.state,
            postal_code: response.postal_code,
          });
        } catch (err) {
          console.log('Error in identify', err);
        }
        handleServerSuccess(
          actionType.GET_PROFILE_SUCCESS,
          actionType.GET_PROFILE_LOADING,
          response,
          dispatch
        );
      })
      .catch((err) => {
        if (req.onFail) {
          req.onFail(err);
        }
        handleServerError(
          actionType.GET_PROFILE_ERROR,
          actionType.GET_PROFILE_LOADING,
          err,
          dispatch
        );
      });
  };
};

export const updateProfile = (req) => {
  return (dispatch) => {
    dispatch({
      type: actionType.UPDATE_PROFILE_LOADING,
      payload: { loading: true },
    });
    Services.updateProfile(req.item)
      .then((response) => {
        if (req.onSuccess) {
          req.onSuccess(response);
        }

        dispatch({
          type: actionType.UPDATE_PROFILE_SUCCESS,
          payload: { data: response },
        });
      })
      .catch((err) => {
        if (req.onFail) {
          req.onFail(err);
        }
        dispatch({
          type: actionType.UPDATE_PROFILE_ERROR,
          payload: { data: err },
        });
      });
  };
};

export const socialLogin = ({ provider, token, navigate }) => {
  return (dispatch) => {
    dispatch({
      type: actionType.USER_LOGIN_LOADING,
      payload: { loading: true },
    });
    Services.socialLogin(provider, token)
      .then(async (response) => {
        await saveTokenAndNavigate(response, navigate);
        handleServerSuccess(
          actionType.USER_LOGIN_SUCCESS,
          actionType.LOADING_DATA,
          response,
          dispatch
        );
      })
      .catch((err) => {
        handleServerError(
          actionType.USER_LOGIN_ERROR,
          actionType.LOADING_DATA,
          err,
          dispatch
        );
      });
  };
};

export const expressDashboard = () => {
  return (dispatch) => {
    Services.expressDashboard()
      .then((response) => {
        handleServerSuccess(
          actionType.EXPRESS_DASHBOARD,
          actionType.EXPRESS_DASHBOARD_LOADING,
          response,
          dispatch
        );
      })
      .catch((err) => {
        handleServerError(
          actionType.EXPRESS_DASHBOARD_ERROR,
          actionType.EXPRESS_DASHBOARD_LOADING,
          err,
          dispatch
        );
      });
  };
};

export const stripeAccountLink = () => {
  return (dispatch) => {
    dispatch({
      type: actionType.STRIPE_ACCOUNT_LINK_LOADING,
      payload: { loading: true },
    });
    Services.stripeAccountLink()
      .then((response) => {
        console.log('response from stripe @@@@@@@@@@@@@@@@@@@', response);
        handleServerSuccess(
          actionType.STRIPE_ACCOUNT_LINK,
          actionType.STRIPE_ACCOUNT_LINK_LOADING,
          response,
          dispatch
        );
      })
      .catch((err) => {
        console.log('response from stripe @@@@@@@@@@@@@@@@@@@', err);

        handleServerError(
          actionType.STRIPE_ACCOUNT_LINK_ERROR,
          actionType.STRIPE_ACCOUNT_LINK_LOADING,
          err,
          dispatch
        );
      });
  };
};

export const getStripeBalance = () => {
  return (dispatch) => {
    Services.stripeBalance()
      .then((response) => {
        handleServerSuccess(
          actionType.STRIPE_BALANCE,
          actionType.STRIPE_BALANCE_LOADING,
          response,
          dispatch
        );
      })
      .catch((err) => {
        handleServerError(
          actionType.STRIPE_BALANCE_ERROR,
          actionType.STRIPE_BALANCE_LOADING,
          err,
          dispatch
        );
      });
  };
};

export const socialApple = (payload = {}) => {
  return (dispatch) => {
    dispatch({
      type: actionType.USER_LOGIN_LOADING_APPLE,
      payload: { loading: true },
    });
    let params = {
      access_token: payload.token,
      first_name: payload.fname,
      last_name: payload.lname,
    };
    Services.socialApple(params)
      .then((response) => {
        if (payload.onSuccess) {
          payload.onSuccess(response);
        }
        handleServerSuccess(
          actionType.USER_LOGIN_SUCCESS,
          actionType.USER_LOGIN_LOADING_APPLE,
          response,
          dispatch
        );
      })
      .catch((err) => {
        if (payload.onFail) {
          payload.onFail(err);
        }
        handleServerError(
          actionType.USER_LOGIN_ERROR,
          actionType.USER_LOGIN_LOADING_APPLE,
          err,
          dispatch
        );
      });
  };
};

export const deleteProfile = () => {
  return (dispatch) => {
    dispatch({
      type: actionType.DELETE_PROFILE_LOADING,
      payload: { loading: true },
    });
    Services.deleteProfile()
      .then((response) => {
        handleServerSuccess(
          actionType.DELETE_PROFILE_SUCCESS,
          actionType.DELETE_PROFILE_LOADING,
          response,
          dispatch
        );
      })
      .catch((err) => {
        handleServerError(
          actionType.DELETE_PROFILE_ERROR,
          actionType.DELETE_PROFILE_LOADING,
          err,
          dispatch
        );
      });
  };
};
