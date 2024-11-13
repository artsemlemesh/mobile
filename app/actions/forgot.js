import * as actionType from './constants';
 import { handleServerError, handleServerSuccess } from './common';
 import * as Services from '../api/index';

 export const forgotUser = (req) => {
   return (dispatch) => {
     dispatch({
       type: actionType.USER_FORGOT_LOADING,
       payload: { loading: true },
     });
     Services.forgot(req.email)
       .then((response) => {
         if (req.onSuccess) {
           req.onSuccess(response.message);
         }
         handleServerSuccess(
           actionType.USER_FORGOT_SUCCESS,
           actionType.LOADING_DATA,
           response,
           dispatch,
         );
       })
       .catch((err) => {
         if (req.onFail) {
           req.onFail(err.non_field_errors[0]);
         }
         handleServerError(
           actionType.USER_FORGOT_ERROR,
           actionType.LOADING_DATA,
           err,
           dispatch,
         );
       });
   };
 };