import * as actionType from './constants';
 import { handleServerError, handleServerSuccess } from './common';
 import * as Services from '../api/index';

 export const pushNotification = (req) => {
   return (dispatch) => {
     dispatch({
       type: actionType.PUSH_NOTIFICATION_LOADING,
       payload: { loading: true },
     });
     Services.expoPushToken(req.data)
       .then((response) => {
         if (req.onSuccess) {
           req.onSuccess(response.message);
         }
         handleServerSuccess(
           actionType.PUSH_NOTIFICATION_SUCCESS,
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
           actionType.PUSH_NOTIFICATION_ERROR,
           actionType.LOADING_DATA,
           err,
           dispatch,
         );
       });
   };
 };