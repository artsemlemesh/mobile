import React, { useEffect, useRef, useState } from 'react';
import {
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  SafeAreaView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Linking from 'expo-linking';
// import {
//   BackgroundView,
//   ButtonView,
//   Separator,
//   SocialButton,
// } from '../../components';

import BackgroundView from '../../components/common/BackGroundView';
import Separator from '../../components/common/Separator';
import ButtonView from '../../components/common/Button';
import SocialButton from '../../components/common/SocialButton';

import { hp, IconSizes, wp } from '../../constants';
import { useDispatch, useSelector } from 'react-redux';
import TermsAndConditionsBottomSheet from '../../screens/RegisterScreen/components/TermsAndConditionsBottomSheet';
import {
  showErrorNotification,
  welcomeNotification,
} from '@app/utils/notifications';
import { handleLoginError, signOut } from '@app/utils/authentication';
import { loadToken, saveToken } from '@app/utils/reduxStore';
import { getUserProfile } from '@app/actions/login';
import LoadingIndicator from '../../layout/misc/LoadingIndicator';
import { ThemeStatic } from '@app/theme';
import {
  cacheAuthAsync,
  StorageKey,
  loginWithApple,
  signInWithGoogleAsync,
} from '../../utils/commonFuntions';
import { RootState } from 'reducers';
import { Feather } from '@expo/vector-icons';
const LaunchScreen: React.FC = ({ navigation }: any) => {
  const { navigate } = navigation;
  const dispatch = useDispatch();
  const [initializing, setInitializing] = useState(true);
  const [authState, setAuthState] = useState(null);

  const user = useSelector((state: RootState) => state.user);

  const termsAndConditionsBottomSheetRef = useRef() as any;
  const onTermAndCondtion = () =>
    termsAndConditionsBottomSheetRef.current.open();
  const { profile, success } = user;

  useEffect(() => {
    if (
      user.profile !== null &&
      user.profile !== undefined &&
      user.profile !== ''
    ) {
      if (success && profile?.access_token?.[0] !== 'Invalid token')
        navigateToApp(profile?.token);
    }
  }, [!user.profile]);

  const initialize = async () => {
    Linking.getInitialURL().then(async (url) => {
      if (url) {
        let { path, queryParams } = Linking.parse(url);
        let token = queryParams && queryParams.token ? queryParams.token : null;
        if (token !== null) {
          await saveToken(token);
          let obj = {
            onSuccess: () => {},
            onFail: () => {},
          };
          dispatch(getUserProfile(obj));
          navigateToApp(token);
        }
      }
    });

    try {
      const token = await loadToken();
      if (token) navigateToApp(token);
      else
        (async () => {
          let cachedAuth = await getCachedAuthAsync();
          if (cachedAuth && !authState) {
            setAuthState(cachedAuth);
          }
        })();
      // _syncUserWithStateAsync();
    } catch ({ message, name: errorType }) {
      handleLoginError(errorType);
    }
    setInitializing(false);
  };

  useEffect(() => {
    initialize();
  }, []);

  async function getCachedAuthAsync() {
    let value = await AsyncStorage.getItem(StorageKey);
    let authState: any;
    if (value) authState = JSON.parse(value);
    if (authState) {
      if (checkIfTokenExpired(authState)) {
        return refreshAuthAsync(authState);
      } else {
        return authState;
      }
    }
    return null;
  }

  function checkIfTokenExpired({ accessTokenExpirationDate }) {
    return new Date(accessTokenExpirationDate) < new Date();
  }

  async function refreshAuthAsync({ refreshToken }) {
    // let authState = await AppAuth.refreshAsync(
    //   getGoogleAuthConfig(),
    //   refreshToken
    // );
    // await cacheAuthAsync(authState);
    // return authState;
    return
  }

  cacheAuthAsync(authState);
  const goToLoginScreen = () => {
    navigate('LoginScreen');
  };

  const goToRegisterScreen = () => {
    navigation.navigate('RegisterScreen');
  };

  const navigateToApp = async (token: string) => {
    try {
      welcomeNotification();
      navigate('App');
    } catch {
      if (!__DEV__) {
        signOut();
      }
    }
  };

  const continueAsGust = () => {
    return (
      <View style={style.closeButtonStyle}>
        <TouchableOpacity
          onPress={() => {
            navigateToApp('');
          }}
          style={{ marginBottom: 45 }}
        >
          <Feather
            type="Feather"
            name="x"
            size={25}
            style={style.closeIconStyle}
            onPress={() => {
              navigateToApp('');
            }}
          />
        </TouchableOpacity>
      </View>
    );
  };

  const termAndCondition = () => {
    return (
      <View style={style.conditionView}>
        <TouchableOpacity onPress={onTermAndCondtion}>
          <Text>{'Terms and conditions'}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const contentLoader = () => {
    return <LoadingIndicator color={ThemeStatic.accent} size={IconSizes.x1} />;
  };

  const containerView = () => {
    return (
      <SafeAreaView style={style.mainContainer}>
        {continueAsGust()}
        <View style={style.container}>
          <View style={style.logoView}>
            <View style={style.logoStyle}>
              <Image
                style={style.imageLogo}
                source={require('@app/assets/images/logo3.png')}
                resizeMode="contain"
              />
            </View>
            <View style={style.roundedView}>
              <View style={style.cardViewStyle}>
                <Text style={style.welcomeTextStyle}>
                  {'Welcome to BundleUp'}
                </Text>
                <Text style={style.subTitleTextStyle}>
                  {'Buy and sell baby & toddler clothing by the bundle'}
                </Text>
              </View>
              <View
                style={[
                  style.cardViewStyle,
                  { marginVertical: hp(8), marginTop: hp(10) },
                ]}
              >
                <ButtonView
                  onPress={goToLoginScreen}
                  title={'Sign In'}
                  buttonStyle={style.singInButtonView}
                  buttonTextStyle={{ fontSize: hp(2.2) }}
                  loading={false}
                  testIDs={'Launch_SignIn'}
                />
                <View style={{ margin: hp(1.15) }} />
                <ButtonView
                  onPress={goToRegisterScreen}
                  title={'Sign Up'}
                  buttonStyle={style.singUpButtonView}
                  buttonTextStyle={{ color: '#705FDE', fontSize: hp(2.2) }}
                  loading={false}
                  testIDs={'Launch_SignUp'}
                />
              </View>
              <View style={style.separatorStyle}>
                <Separator />
              </View>
              <View style={[style.cardViewStyle, { flexDirection: 'row' }]}>
                {Platform.OS === 'ios' && (
                  <SocialButton
                    onPress={() => loginWithApple(dispatch, navigate)}
                    image={require('@app/assets/apple.png')}
                    imageStyle={{}}
                    buttonViewStyle={{ backgroundColor: '#000' }}
                    testIDs={'Launch_AppleLogin'}
                  />
                )}
                <SocialButton
                  onPress={() => signInWithGoogleAsync(dispatch, navigate)}
                  image={require('@app/assets/google.png')}
                  imageStyle={{}}
                  buttonViewStyle={{ backgroundColor: '#E5664F' }}
                  testIDs={'Launch_GoogleLogin'}
                />
                {/* <SocialButton
                  onPress={() => fbLogIn(dispatch, navigate)}
                  image={require('@app/assets/facebook.png')}
                  imageStyle={{}}
                  buttonViewStyle={{ backgroundColor: '#3B5998' }}
                  testIDs={'Launch_FacebookLogin'}
                /> */}
                {Platform.OS === 'android' && (
                  <SocialButton
                    onPress={goToRegisterScreen}
                    imageStyle={{}}
                    image={require('@app/assets/email.png')}
                    buttonViewStyle={{}}
                  />
                )}
              </View>
            </View>
            {termAndCondition()}
          </View>
        </View>
        <TermsAndConditionsBottomSheet ref={termsAndConditionsBottomSheetRef} />
      </SafeAreaView>
    );
  };

  return (
    <BackgroundView
      contentView={!initializing ? containerView() : contentLoader()}
    ></BackgroundView>
  );
};

const style = StyleSheet.create({
  backgroundStyle: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  mainContainer: { flex: 1 },
  container: {
    flex: 1,
    alignItems: 'center',
  },
  logoStyle: {
    height: hp(25),
    marginTop: -35,
    alignItems: 'center',
    justifyContent: 'center',
  },
  roundedView: {
    height: hp(50),
    width: wp(90),
    backgroundColor: '#fff',
    borderRadius: hp(3),
    paddingVertical: hp(3),
  },
  conditionView: {
    height: hp(10),
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageLogo: {
    height: 100,
    width: 100,
    alignSelf: 'center',
  },
  singInButtonView: {
    borderWidth: wp(0.6),
    borderColor: '#705FDE',
    backgroundColor: '#705FDE',
  },
  singUpButtonView: {
    borderWidth: wp(0.6),
    borderColor: '#705FDE',
    backgroundColor: '#fff',
  },
  cardViewStyle: {
    flex: 1,
    marginTop: hp(1.5),
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonStyle: { flexDirection: 'row-reverse' },
  closeIconStyle: {
    marginTop: wp(4.5),
    // marginEnd: wp(4.5),
    fontSize: 30,
    padding: 20,
    color: '#fff',
  },
  logoView: { flex: 1 },
  welcomeTextStyle: { fontSize: 19, marginBottom: 5, fontWeight: '700' },
  subTitleTextStyle: { width: wp(90), textAlign: 'center' },
  separatorStyle: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});

export default LaunchScreen;
