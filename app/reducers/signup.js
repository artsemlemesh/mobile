import * as actionType from '../actions/constants';
// import {createFA5iconSet} from "@expo/vector-icons/vendor/react-native-vector-icons/lib/create-icon-set-from-fontawesome5";
import {REHYDRATE} from 'redux-persist';

const initialState = {
  signup: {
    loading: false,
    success: false,
    error: false,
    message: '',
  },
  phoneVerification: {
    codeSent: false,
    codeVerified: false,
    message: '',
    sentSuccess: false,
    sentError: null,
    verifiedSuccess: false,
    verifiedError: null,
  },
  genderAndDOB: {
    success: false,
    error: false,
    message: '',
  },
  photoUpload: {
    success: false,
    error: false,
    message: '',
  },
};

export default (state = initialState, action) => {
  switch (action.type) {
    // case REHYDRATE: {
    //   return {
    //     ...state,
    //     signup: {
    //       success: false,
    //       error: false,
    //       message: ""
    //     }
    //   };
    // }

    case actionType.USER_SIGNUP_BLANK: {
      return {
        ...state,
        signup: {
          success: false,
          error: false,
          message: '',
        },
      };
    }

    case actionType.USER_SIGNUP_LOADING: {
      let signup = {...state.signup};
      signup.loading = action.payload.loading;
      return {...state, signup};
    }

    case actionType.USER_SIGNUP_SUCCESS: {
      let signup = {};
      signup.success = true;
      signup.error = false;
      signup.message = '';
      return {...state, signup: {...signup}};
    }

    case actionType.USER_SIGNUP_ERROR: {
      let msg = action.payload.error;

      let signup = {};
      signup.success = false;
      signup.error = true;
      signup.message = msg;
      return {...state, signup: {...signup}};
    }

    case actionType.PHONE_VERIFICATION_BLANK: {
      return {
        ...state,
        phoneVerification: {
          codeSent: false,
          codeVerified: false,
          message: '',
          sentSuccess: false,
          sentError: null,
          verifiedSuccess: false,
          verifiedError: null,
        },
      };
    }

    case actionType.SEND_VERIFICATION_CODE_SUCCESS: {
      const {phoneVerification} = state;
      phoneVerification.codeSent = action.payload.data.success;
      phoneVerification.sentSuccess = true;
      phoneVerification.sentError = null;
      phoneVerification.message = action.payload.data.message;
      return {...initialState, phoneVerification};
    }

    case actionType.SEND_VERIFICATION_CODE_ERROR: {
      const {phoneVerification} = state;
      phoneVerification.codeSent = false;
      phoneVerification.sentSuccess = false;
      phoneVerification.sentError = action.payload.error;
      phoneVerification.message = action.payload.error;
      return {...initialState, phoneVerification};
    }

    case actionType.VERIFY_VERIFICATION_CODE_SUCCESS: {
      let {phoneVerification} = state;
      phoneVerification.codeVerified = action.payload.data.success;
      phoneVerification.verifiedSuccess = true;
      phoneVerification.verifiedError = null;
      phoneVerification.message = action.payload.data.message;
      return {...initialState, phoneVerification};
    }

    case actionType.VERIFY_VERIFICATION_CODE_ERROR: {
      let {phoneVerification} = state;
      phoneVerification.codeVerified = false;
      phoneVerification.verifiedSuccess = false;
      phoneVerification.verifiedError = action.payload.error;
      phoneVerification.message = action.payload.error;
      return {...initialState, phoneVerification};
    }

    // case actionType.UPLOAD_PHOTO_SUCCESS: {
    //     let {photoUpload} = state;
    //     photoUpload.success = true;
    //     photoUpload.message = action.payload.data;
    //     return {...initialState, photoUpload};
    // }
    //
    // case actionType.UPLOAD_PHOTO_ERROR:
    //     let { photoUpload } = state;
    //     photoUpload.error = true;
    //     photoUpload.message = action.payload.error;
    //     return { ...initialState, photoUpload };

    default:
      return state;
  }
};
