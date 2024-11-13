import Storage from 'react-native-storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

const storage = new Storage({
  size: 1000,
  storageBackend: AsyncStorage,
  defaultExpires: 7 * 1000 * 3600 * 24, // 7 days, eg: 1 day (1000 * 3600 * 24 milliseconds)
  enableCache: true,
});

export const StorageErrorTypes = {
  Expired: 'ExpiredError',
  NotFound: 'NotFoundError',
};

export const saveToken = (token: string) => {
  return storage.save({
    key: 'yello:token',
    data: token,
  });
};

export const loadToken = () => {
  return storage.load({
    key: 'yello:token',
  });
};

export const removeToken = () => {
  return storage.remove({
    key: 'yello:token',
  });
};

export const saveThemeType = (themeType: string) => {
  return storage.save({
    key: 'yello:theme',
    data: themeType,
    expires: null, // never expires until changed
  });
};

export const loadThemeType = () => {
  return storage.load({
    key: 'yello:theme',
  });
};

export default storage;
