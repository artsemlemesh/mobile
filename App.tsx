import { LogBox, StatusBar, StyleSheet } from 'react-native';

import { Provider, useSelector } from 'react-redux';

import * as Font from 'expo-font'; // this is how you import it
import { PersistGate } from 'redux-persist/es/integration/react';
import React, { useState, useContext, useEffect } from 'react';

import FlashMessage from 'react-native-flash-message';

import Config from '@app/config';

import { AppContext, AppContextProvider } from './app/context';
import ExpoNotification from './app/notifications/expo-notifications';
import AppNavigator from './app/navigation';
import { ThemeStatic, Typography } from './app/theme';
import { ThemeColors } from './app/types/theme';

import { getStore, getPersistor, loadThemeType } from './app/utils/reduxStore';

import * as Sentry from '@sentry/react-native';
import { NativeBaseProvider } from 'native-base';
import * as SplashScreen from 'expo-splash-screen';
// import { LogBox } from 'react-native';
// import * as Linking from 'expo-linking';

// LogBox.ignoreAllLogs(true);

Sentry.init({
  environment: Config.env,
  dsn: Config.sentry_dsn,
  debug: true,
});

import * as Updates from 'expo-updates';

import 'react-native-devsettings/withAsyncStorage';

import Analytics from '@app/utils/Analytics';

export function AppContainer() {
  // console.log('Starting AppContainer')
  // console.log('Updates.channel', Updates.channel)

  // This code was added for manually checking updates.
  // It is not needed for automatic OTA updates.
  // Updates.checkForUpdateAsync().then((update) => {
  //   // console.log('update.isAvailable', update.isAvailable);
  //   if (update.isAvailable) {
  //     Updates.fetchUpdateAsync().then(() => {
  //       // console.log('RELOADING APP');
  //       Updates.reloadAsync();
  //       // reload
  //     });
  //   }
  // });

  try {
    Analytics.track('App Opened');
    // Analytics.identify(response.user.id, {
    //   email: response.user.email,
    //   name: response.user.first_name + ' ' + response.user.last_name,
    //   phone: response.user.phone,
    // });
  } catch (err) {
    console.log('Error in track', err);
  }

  // async function onFetchUpdateAsync() {
  //   try {
  //     console.log('onFetchUpdateAsync')
  //     console.log('Updates.channel', Updates.channel)
  //     const update = await Updates.checkForUpdateAsync();

  //     if (update.isAvailable) {
  //       console.log('update.isAvailable', update.isAvailable);
  //       await Updates.fetchUpdateAsync();
  //       await Updates.reloadAsync();
  //     }
  //   } catch (error) {
  //     // You can also add an alert() to see the error message in case of an error when fetching updates.
  //     console.log(`Error fetching latest Expo update: ${error}`);
  //   }
  // }
  // onFetchUpdateAsync();

  // updateApp();
  const myStore = getStore();
  const myPersistor = getPersistor();
  const { user, theme, themeType, toggleTheme, updateUnreadMessages } =
    useContext(AppContext);
  // const { barStyle, backgroundColor } = DynamicStatusBar[themeType];
  // const userEmail = useSelector((state) => state?.user?.profile?.email);
  // console.log("userEmailuserEmail",userEmail);

  // useEffect(() => {
  //   LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
  //   LogBox.ignoreAllLogs();
  // }, []);

  return (
    <Provider store={myStore}>
      <NativeBaseProvider>
        <PersistGate persistor={myPersistor}>
          <AppContextProvider>
            <ExpoNotification />
            <StatusBar
              animated
              barStyle={'dark-content'}
              backgroundColor={'rgba(0,0,0,0.4)'}
            />
            <AppNavigator initialScreen={undefined} />
            <FlashMessage
              titleStyle={styles().flashMessageTitle}
              floating
              position="bottom"
            />
          </AppContextProvider>
        </PersistGate>
      </NativeBaseProvider>
    </Provider>
  );
}

// export default function App() {
//   const [isReady, setReady] = useState(false);

//   if (!isReady) {
//     // this is what makes sure the fonts are ready before loading the app
//     return (
//       <AppLoading
//         startAsync={_loadAssets} // this loads the fonts
//         onFinish={() => setReady(true)}
//         onError={(e) => console.error(e)}
//       />
//     );
//   }
//   return <AppContainer />;
// }

function App() {
  const [isFontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function loadFontsAndApp() {
      try {
        await _loadAssets(); // Load fonts
        await SplashScreen.preventAutoHideAsync(); // Prevent splash screen from auto-hiding
        setFontsLoaded(true); // Set fonts loaded flag
        await SplashScreen.hideAsync(); // Hide the splash screen
      } catch (e) {
        console.error(e);
      }
    }

    loadFontsAndApp();
  }, []);

  if (!isFontsLoaded) {
    return null; // Return null while fonts are loading
  }

  return <AppContainer />;
}
export default Sentry.wrap(App);

// font loading function
const _loadAssets = async () => {
  await Font.loadAsync({
    'SFProDisplay-Bold': require('./assets/fonts/SFProDisplay-Bold.ttf'),
    'SFProDisplay-Regular': require('./assets/fonts/SFProDisplay-Regular.ttf'),
    'SFProDisplay-Light': require('./assets/fonts/SFProDisplay-Light.ttf'),
    // 'Material Design Icons': require('./node_modules/native-base/Fonts/MaterialCommunityIcons.ttf'),
    // 'Material Icons': require('./node_modules/native-base/Fonts/MaterialIcons.ttf'),
    // MaterialIcons: require('./node_modules/native-base/Fonts/MaterialIcons.ttf'),
    // Entypo: require('./node_modules/native-base/Fonts/Entypo.ttf'),
    // Feather: require('./node_modules/native-base/Fonts/Feather.ttf'),
    // FontAwesome: require('./node_modules/native-base/Fonts/FontAwesome.ttf'),
    // 'FontAwesome5Free-Solid': require('./node_modules/native-base/Fonts/FontAwesome5_Solid.ttf'),
    // 'FontAwesome5-Solid': require('./node_modules/native-base/Fonts/FontAwesome5_Solid.ttf'),
    // FontAwesome5_Solid: require('./node_modules/native-base/Fonts/FontAwesome5_Solid.ttf'),
    // 'FontAwesome5-Regular': require('./node_modules/native-base/Fonts/FontAwesome5_Regular.ttf'),
    // FontAwesome5_Regular: require('./node_modules/native-base/Fonts/FontAwesome5_Regular.ttf'),
    // Ionicons: require('./node_modules/native-base/Fonts/Ionicons.ttf'),
    // Roboto_medium: require('./node_modules/native-base/Fonts/Roboto_medium.ttf'),
  });
};

const styles = (theme = {} as ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      // height: responsiveHeight(Platform.OS === "android" ? 100 : 100),
      backgroundColor: '#000',
      // backgroundColor: theme.base,
    },
    flashMessageTitle: {
      ...Typography.FontWeights.Light,
      ...Typography.FontSizes.Body,
      color: ThemeStatic.white,
    },
  });
