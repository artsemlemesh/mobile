// import {messaging, crashlytics} from './firebase';
import Analytics from '@app/utils/Analytics';
import {StorageErrorTypes, removeToken} from './reduxStore';
// import { StorageErrorTypes, removeToken } from './storage';
import {Errors} from '@app/constants';
// import { crashlytics } from './firebase';

export const handleLoginError = async (errorType: string) => {
  switch (errorType) {
    case StorageErrorTypes.Expired:
      await signOut();
      break;

    case StorageErrorTypes.NotFound:
      break;

    default:
      break;
  }
};

export const signOut = async () => {
  try {
    // await messaging.deleteToken();
    await removeToken();
    Analytics.reset();
  } catch (e) {
    console.log('signOut error', e);
    // crashlytics.recordCustomError(Errors.SIGN_OUT, message);
  }
};
