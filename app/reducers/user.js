import * as actionType from '../actions/constants';

const initialState = {
  loadingUserLogin: false,
  loadingUserLoginSocial: false,
  profile: null,
  success: false,
  forgotPasswordSuccess: false,
  error: null,
  errorForget : '',
  errorLogin: '',
  errorRegister : '',
  errorStripe : '',
  temp: null,
  dashboard: null,
  loading : false,
  loadingUserForgot: false,
  loadingPushNotification: false,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case actionType.EXPRESS_DASHBOARD: {
      return {
        ...state,
        dashboard: action.payload.data,
      };
    }

    case actionType.USER_LOGIN_LOADING: {
      return {
        ...state,
        loadingUserLogin: action.payload.loading,
      };
    }

    case actionType.USER_LOGIN_LOADING_APPLE: {
      return {
        ...state,
        loadingUserLoginSocial: action.payload.loading,
      };
    }

    case actionType.PHONE_VERIFICATION_BLANK: {
      return {
        ...state,
        loadingUserLogin: false,
        success: false,
        error: null,
      };
    }

    case actionType.USER_LOGIN_SUCCESS:
      return {
        ...initialState,
        success: true,
        profile: action.payload.data,
        loadingUserLogin: false,
        loadingUserLoginSocial: false,
        error: null,
      };

    case actionType.USER_RGISTER_SUCCESS:
      return {
        ...initialState,
        success: true,
        loadingUserLogin: false,
        error: null,
      };
      case actionType.USER_RGISTER_ERROR:
      return {
        ...initialState,
        success: false,
        loadingUserLogin: false,
        errorRegister: action.payload.error,
      };
    case actionType.USER_LOGOUT:
      return {
        ...initialState,
        success: false,
        profile: null,
        loadingUserLogin: false,
      };

    case actionType.USER_LOGIN_ERROR:
      return {
        ...initialState,
        errorLogin: action.payload.error,
        success: false,
        loadingUserLogin: false,
        loadingUserLoginSocial: false,
      };

    case actionType.USER_UPDATE_SUCCESS: {
      const { profile } = state;
      const updatedProfile = Object.assign({}, profile, action.payload.data);
      return { ...initialState, success: true, profile: updatedProfile };
    }

    case actionType.GET_PROFILE_SUCCESS: {
      return {
        ...state,
        profile: action.payload.data,
        error: null,
        success: true,
      };
    }
    case actionType.GET_PROFILE_ERROR: {
      return {
        ...state,
        error: action.payload.error,
        success: false,
      };
    }

    case actionType.STRIPE_BALANCE: {
      const { profile } = state;
      return {
        ...state,
        profile: { ...profile, balance: action.payload.data },
      };
    }

    case actionType.STRIPE_ACCOUNT_LINK_LOADING: {
      const { profile } = state;
      let stripe_data = profile?.stripe_account_link
      if (action.payload.loading) {
        stripe_data = null
      }
      return {
        ...state,
        profile: { ...profile, stripe_account_link: stripe_data },
        loading: action.payload.loading
      };
    }

    case actionType.STRIPE_ACCOUNT_LINK: {
      const { profile } = state;
      return {
        ...state,
        profile: { ...profile, stripe_account_link: action.payload.data },
        loading : false
      };
    }

    case actionType.STRIPE_ACCOUNT_LINK_ERROR: {
      return {
        ...state,
        errorStripe: action.payload.error,
        success: false,
      };
    }

    case actionType.STRIPE_CONNECTION_SUCCESS: {
      return {
        ...state,
        success: true,
        temp: action.payload.data,
        loadingUserLogin: false,
      };
    }
    case actionType.STRIPE_CONNECTED: {
      const { profile } = state;
      return { ...state, profile: { ...profile, is_stripe_connected: true } };
    }
    case actionType.REMOVE_OPENTOK_TOKEN: {
      const { profile } = state;
      delete profile.opentokToken;
      const updatedProfile = Object.assign({}, profile);
      return { ...initialState, success: true, profile: updatedProfile };
    }
    case actionType.USER_LOGIN_CLEAR: {
      return { ...state, success: false, error: null };
    }
    case actionType.USER_FORGOT_ERROR: {
      return {
        ...initialState,
        errorForget: action.payload.error,
        forgotPasswordSuccess: false,
        loadingUserForgot: false,
      };
    }
    case actionType.USER_FORGOT_LOADING: {
      return {
        ...state,
        loadingUserForgot: action.payload.loading,
      };
    }
    case actionType.USER_FORGOT_SUCCESS: {
      return {
        ...initialState,
        forgotPasswordSuccess: true,
        // profile: action.payload.data?.message,
        loadingUserForgot: false,
        error: null,
      };
    }
    case actionType.PUSH_NOTIFICATION_ERROR: {
      return {
        ...initialState,
        error: action.payload.error,
        success: false,
        loadingPushNotification: false,
      };
    }
    case actionType.PUSH_NOTIFICATION_LOADING: {
      return {
        ...state,
        loadingPushNotification: action.payload.loading,
      };
    }
    case actionType.PUSH_NOTIFICATION_SUCCESS: {
      // Check This
      return {
        ...state,
        success: true,
        // profile: action.payload.data,
        loadingPushNotification: false,
        error: null,
      };
    }
    
    default:
      return state;
  }
};
