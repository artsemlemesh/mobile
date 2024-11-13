import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useContext, useEffect, useRef, useState } from 'react';
import {
  ImageBackground,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
// import { useNavigation } from 'react-navigation-hooks';

import * as AppleAuthentication from 'expo-apple-authentication';

import {
  clearLogin,
  loginUser,
  socialApple,
  timeoutLogin,
} from '@app/actions/login';
import { addItemToCart } from '@app/actions/product';
import { IconSizes } from '@app/constants';
import { AppContext } from '@app/context';
import { ThemeStatic } from '@app/theme';
import { handleLoginError } from '@app/utils/authentication';
import {
  showErrorNotification,
  welcomeNotification,
} from '@app/utils/notifications';
import { loadToken, saveToken } from '@app/utils/reduxStore';
import { MaterialIcons, Zocial } from '@expo/vector-icons';
import LoadingIndicator from '../../../app/layout/misc/LoadingIndicator';
import {
  LeftArrow,
  Logo,
  StorageKey,
  signInWithGoogleAsync,
  loginWithApple,
} from '../../utils/commonFuntions';
import { saveTokenAndNavigate } from '@app/utils/common';
import { ISignInFormValues } from './interface';
import { styles } from './styles';
// import Separator from '../../components/common';
import { ActivityIndicator } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'reducers';
import Separator from '../../components/common/Separator';
import SocialButton from '../../components/common/SocialButton';

const LoginScreen: React.FC = ({ navigation, route }: any) => {
  const dispatch = useDispatch();

  const { theme, themeType, updateUser } = useContext(AppContext);
  const { navigate, goBack } = navigation;
  const [initializing, setInitializing] = useState<boolean>(true);
  const [email, setEmail] = useState<string>(null);
  const [password, setPassword] = useState<string>(null);

  const cartData = useSelector((state: RootState) => state.cart);
  const { carts, error: reduxError } = cartData;

  const user = useSelector((state: RootState) => state.user);
  const { errorLogin, loadingUserLogin } = user;

  const [authState, setAuthState] = useState<any>(null);
  const [errors, setError] = useState<ISignInFormValues>({
    email: '',
    password: '',
  });
  const passRef = useRef(null);
  const bgImage = require('@app/assets/images/app-auth-bg.png');
  const navigateBack = () => navigate('LaunchScreen');

  const navigateToApp = async (token: string) => {
    try {
      welcomeNotification();
      navigate('App');
    } catch (err) {
      return '';
    }
  };

  const initialize = async () => {
    if (errorLogin) {
      if (
        user.profile !== null &&
        user.profile !== undefined &&
        user.profile !== ''
      ) {
        showErrorNotification(errorLogin);
        dispatch(clearLogin());
      }
    }
    dispatch(timeoutLogin());
    try {
      const token = await loadToken();
      navigateToApp(token);
      (async () => {
        let cachedAuth = await getCachedAuthAsync();
        if (cachedAuth && !authState) {
          setAuthState(cachedAuth);
        }
      })();
    } catch ({ message, name: errorType }) {
      handleLoginError(errorType);
      setInitializing(false);
    }
  };

  useEffect(() => {
    initialize();
  }, []);

  useEffect(() => {
    if (
      user.profile !== null &&
      user.profile !== undefined &&
      user.profile !== ''
    ) {
      if (user.success) navigateToApp(user?.profile?.token);
    }
  }, [!user.profile]);

  async function getCachedAuthAsync() {
    let value = await AsyncStorage.getItem(StorageKey);
    let authState = JSON.parse(value);
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

  const goToRegisterScreen = () => {
    navigation.navigate('RegisterScreen');
  };

  async function refreshAuthAsync({ refreshToken }) {
    // let authState = await AppAuth.refreshAsync(
    //   getGoogleAuthConfig(),
    //   refreshToken
    // );
    // await cacheAuthAsync(authState);
    // return authState;
    return;
  }

  const _signIn = async () => {
    if (!email || !password) {
      const errors = {
        email: !email ? 'Email is required' : '',
        password: !password ? 'Password is required' : '',
      };
      setError(errors);
      return;
    } else if (
      !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,15}/.test(email)
    ) {
      const errors = {
        email: 'Enter a valid email Address',
        password: '',
      };
      setError(errors);
      return;
    } else {
      let obj = {
        email: email.toLowerCase().trim(),
        password,
        onSuccess: async (res) => {
          if (res && res.token) {
            setTimeout(() => {
              setEmail('');
              setPassword('');
            }, 2000);

            await saveTokenAndNavigate(res, navigate);
            carts.map((item) => {
              dispatch(addItemToCart(item.listing));
            });
          }
        },
        onFail: (response) => {
          if (response && response.statusCode === 401) {
            navigate('RegisterScreen', { step: 2 });
          } else if (response && response.statusCode === 400) {
            if (
              response.body.non_field_errors[0] == 'User account is disabled.'
            ) {
              navigate('RegisterScreen', {
                step: 2,
                initialValues: { email: email, password: password },
              });
            } else {
              showErrorNotification(
                response.body.email
                  ? response.body.email[0]
                  : response.body.non_field_errors[0]
              );
            }
          }
        },
      };
      dispatch(loginUser(obj));
    }
  };

  let content = (
    <LoadingIndicator color={ThemeStatic.accent} size={IconSizes.x1} />
  );

  if (!initializing) {
    content = (
      <>
        <KeyboardAwareScrollView>
          <View style={styles(theme).content}>
            <View style={{ display: 'flex', flexDirection: 'row' }}>
              <TouchableOpacity onPress={navigateBack}>
                <LeftArrow />
              </TouchableOpacity>
              <Logo />
            </View>
            <View>
              <Text style={styles().signInContainer}>Sign In</Text>
              <Text style={styles().signInDescription}></Text>
            </View>
            <View style={[styles(theme).roundedView, { flex: 1 }]}>
              <View style={styles(theme).roundedViewInner}>
                <View style={{ flex: 1, flexDirection: 'column' }}>
                  <View style={styles(theme).roundedContent}>
                    <View style={styles().loginItem}>
                      {errors.email ? (
                        <Text
                          style={[
                            styles().sectionText,
                            { color: ThemeStatic.badge },
                          ]}
                        >
                          {errors.email}
                        </Text>
                      ) : (
                        <Text style={styles().sectionText}>
                          {email && 'Email'}
                        </Text>
                      )}
                      <View borderType="underline" style={styles().textField}>
                        <Zocial name="email" style={styles().inputIcons} />
                        <TextInput
                          autoFocus
                          style={[styles().input, { flex: 1 }]}
                          placeholderTextColor={ThemeStatic.text02}
                          value={email}
                          returnKeyType={'next'}
                          onChangeText={(email) => {
                            setEmail(email);
                            setError({ email: '', password: errors.password });
                          }}
                          onSubmitEditing={() => {
                            passRef?.current?.focus();
                          }}
                          blurOnSubmit={false}
                          placeholder={'Email'}
                          keyboardType="email-address"
                          accessibilityLabel={'Login_Email'}
                        />
                      </View>
                    </View>
                    <View style={[styles().loginItem, { marginTop: 10 }]}>
                      {errors.password ? (
                        <Text
                          style={[
                            styles().sectionText,
                            { color: ThemeStatic.badge },
                          ]}
                        >
                          {errors.password}
                        </Text>
                      ) : (
                        <Text style={styles().sectionText}>
                          {password && 'Password'}
                        </Text>
                      )}
                      <View style={styles().textField}>
                        <MaterialIcons
                          name="lock"
                          style={styles().inputIcons}
                        />
                        <TextInput
                          ref={passRef}
                          secureTextEntry
                          style={[styles().input, { flex: 1 }]}
                          placeholderTextColor={ThemeStatic.text02}
                          value={password}
                          returnKeyType="next"
                          onChangeText={(password) => {
                            setPassword(password);
                            setError({ email: errors.email, password: '' });
                          }}
                          onSubmitEditing={() => _signIn()}
                          placeholder={'Password'}
                          keyboardType={'default'}
                          accessibilityLabel={'Login_Password'}
                        />
                      </View>
                    </View>

                    <TouchableOpacity
                      accessibilityLabel={'Login_SignIn'}
                      style={[styles().button, { backgroundColor: '#846BE2' }]}
                      onPress={loadingUserLogin ? () => {} : () => _signIn()}
                    >
                      {loadingUserLogin ? (
                        <ActivityIndicator size="small" color="#FFFFFF" />
                      ) : (
                        <Text
                          style={{
                            color: 'white',
                            fontWeight: 'bold',
                          }}
                        >
                          SIGN IN
                        </Text>
                      )}
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles(theme).terms}
                      onPress={() => navigate('ForgotScreen')}
                    >
                      <Text
                        style={styles(theme).termsTextForgotPassword}
                        accessibilityLabel={'Login_ForgotPass'}
                        accessible={true}
                      >
                        Forgot Password?
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
            <View style={styles().separatorStyle}>
              <Separator />
            </View>
            <View style={[styles(theme).roundedView]}>
              <View style={[styles().cardViewStyle, { flexDirection: 'row' }]}>
                {Platform.OS !== 'android' && (
                  <SocialButton
                    onPress={() => loginWithApple(dispatch, navigate)}
                    image={require('@app/assets/apple.png')}
                    imageStyle={{}}
                    buttonViewStyle={{ backgroundColor: '#000' }}
                    testIDs={'Login_AppleLogin'}
                  />
                )}
                <SocialButton
                  onPress={() => signInWithGoogleAsync(dispatch, navigate)}
                  image={require('@app/assets/google.png')}
                  imageStyle={{}}
                  buttonViewStyle={{ backgroundColor: '#E5664F' }}
                  testIDs={'Login_GoogleLogin'}
                />

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
            <View style={styles().separatorStyle}></View>
          </View>
        </KeyboardAwareScrollView>
      </>
    );
  }
  return (
    <View style={styles(theme).container}>
      <ImageBackground source={bgImage} style={styles().backgroundImage}>
        {content}
      </ImageBackground>
    </View>
  );
};

export default LoginScreen;
