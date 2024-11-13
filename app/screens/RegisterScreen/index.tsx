import React, { useContext, useEffect, useRef, useState } from 'react';
import { ImageBackground, TouchableOpacity, View, Text } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { AppContext } from '@app/context';
import { handleLoginError, signOut } from '@app/utils/authentication';
import {
  welcomeNotification,
  showErrorNotification,
  showSuccessNotification,
} from '@app/utils/notifications';
import { loadToken } from '@app/utils/reduxStore';

import TermsAndConditionsBottomSheet from './components/TermsAndConditionsBottomSheet';
import VerificationCode from './components/step2';
import LoginDetail from './components/step1';
// import {
//   TermsAndConditionsBottomSheet,
//   LoginDetail,
//   VerificationCode,
// } from './components';

import { signupUser, confirmCode, resendOtp } from '@app/actions/signup';
import { loginUser, clearLogin, timeoutLogin } from '@app/actions/login';

import {
  ISignUpStepFirstValues,
  ISignUpStepSecondValues,
  ISignUpStepThirdValues,
} from './interface';
import { styles } from './styles';
import { getUserProfile } from '@app/actions/login';
import { addItemToCart } from '@app/actions/product';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { LeftArrow, Logo } from '../../utils/commonFuntions';
import { saveTokenAndNavigate } from '@app/utils/common';
import { RootState } from 'reducers';

const LoginScreen: React.FC = ({ navigation, route }: any) => {
  const dispatch = useDispatch();

  const { theme } = useContext(AppContext);
  const { navigate, goBack } = navigation;
  const [initializing, setInitializing] = useState(true);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [facebookLoading, setFacebookLoading] = useState(false);
  const [loginDetailData, setLoginDetailData] =
    useState<ISignUpStepFirstValues>({
      email: '',
      password: '',
      first_name: '',
      last_name: '',
      confirmPassword: '',
    });
  const [validationCodeValues, setValidationCodeValues] =
    useState<ISignUpStepSecondValues>({
      verification_code: '',
      email: '',
      password: '',
    });
  const [contactDetailValues, setContactDetailValues] =
    useState<ISignUpStepThirdValues>({
      first_name: 'test',
      last_name: 'test',
      city: 'test',
      address_line_1: 'test',
      postal_code: 'test',
    });

  const steps = route.params?.step ?? 1;
  const initialValues = route.params?.initialValues ?? 'initialValues';
  const [step, setStep] = useState<number>(steps);

  useEffect(() => {
    setValidationCodeValues(initialValues);
  });
  // useEffect(() => {
  //   if (steps && steps > 0) {
  //     setStep(steps);
  //   } else {
  //     setStep(1);
  //   }
  // }, [step]);

  const [termsConfirmationModal, setTermsConfirmationModal] = useState(false);
  const user = useSelector((state: RootState) => state.user);
  const { profile, success, error, loadingUserLogin } = user;

  const cartData = useSelector((state: RootState) => state.cart);
  const { carts, error: reduxError } = cartData;

  const termsAndConditionsBottomSheetRef = useRef() as any;
  const onTermAndCondtion = () =>
    termsAndConditionsBottomSheetRef.current.open();

  const bgImage = require('@app/assets/images/app-auth-bg.png');

  const navigateBack = () => goBack();

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

  useEffect(() => {
    return () => {
      dispatch(clearLogin());
    };
  }, []);

  useEffect(() => {
    // if (success) {
    //   const { token } = profile;
    //   saveTokenAndNavigate(token);
    // } else {
    initialize();
    // }
  }, [success, error]);

  const initialize = async () => {
    // if (error) {
    //   showErrorNotification(error);
    // }
    dispatch(timeoutLogin());
    try {
      const token = await loadToken();
      navigateToApp(token);
    } catch ({ message, name: errorType }) {
      handleLoginError(errorType as any);
      setInitializing(false);
    }
  };

  const termsConfirmationToggle = () => {
    setTermsConfirmationModal(!termsConfirmationModal);
  };

  const goToStep = (n: number, values: any) => {
    if (n === 2 && values === 'resendOtp') {
      resendUserOtp();
    } else {
      if (n === 1) {
        setLoginDetailData(values);
        onSubmit(values);
      } else if (n === 2) {
        if (values.verification_code === '') {
          showErrorNotification('Verification code is required!');
        } else {
          setValidationCodeValues(values);
          verifyOTP(values);
        }
      }
    }
  };

  const resendUserOtp = () => {
    let otpObj = {
      email: { email: loginDetailData.email? loginDetailData.email : validationCodeValues.email},
      onSuccess: (res) => {
        if (res && res.message) {
          showSuccessNotification(res.message);
        }
      },
      onFail: (err) => {
        console.log('fail', err.response);
      },
    };
    dispatch(resendOtp(otpObj));
  };

  const otpVerifiedSuccess = async (res) => {
    if (res && res.token) {
      await saveTokenAndNavigate(res, navigate);
      setTimeout(() => {
        setLoginDetailData({
          email: '',
          password: '',
          first_name: '',
          last_name: '',
          confirmPassword: '',
        });
        setStep(1);
      }, 2000);
      dispatch(getUserProfile({}));
      carts.map((item) => {
        dispatch(addItemToCart(item.listing));
      });
    }
  };
  const verifyOTP = (values) => {
    if (profile === null) {
      let req = {
        code: {
          email: values.email ? values.email : loginDetailData.email,
          code: values.verification_code,
        },
        onSuccess: (res) => {
          let loginObj = {
            email: loginDetailData.email? loginDetailData.email : validationCodeValues.email,
            password: loginDetailData.password? loginDetailData.password : validationCodeValues.password,
            onSuccess: otpVerifiedSuccess,
            onFail: (err) => {
              console.log(err);
            },
          };

          dispatch(loginUser(loginObj));
        },
        onFail: (err) => {
          console.log('err', err);
          if (err.code) {
            showErrorNotification(err.code);
          } else if (err.email) {
            showErrorNotification(err.email);
          } else if (err.non_field_errors) {
            showErrorNotification(err.non_field_errors);
          }
        },
      };

      dispatch(confirmCode(req));
    }
  };

  const onSubmit = (values: any) => {
    let data = {} as any;
    let additionalData = {
      country: 'US',
      expo_push_token: 'token',
      is_stripe_connected: false,
    };
    data = { ...values, ...additionalData };
    let email = data.email.toLowerCase();
    data.email = email;

    if (values.first_name === '') {
      showErrorNotification('First name is required.');
    } else if (values.last_name === '') {
      showErrorNotification('Last name is required.');
    } else if (values.email === '') {
      showErrorNotification('Email is required.');
    } else if (values.password === '') {
      showErrorNotification('Password is required.');
    } else if (values.password !== values.confirmPassword) {
      showErrorNotification('Password does not match.');
    } else {
      processNewUser(data);
    }
  };

  const processNewUser = (data: any) => {
    let obj = {
      item: data,
      onSuccess: (res) => {
        setStep(2);
      },
      onFail: (err) => {
        if (err && err.firstname) {
          showErrorNotification(err.firstname);
        } else if (err && err.lastname) {
          showErrorNotification(err.lastname);
        } else if (err && err.email) {
          showErrorNotification(err.email);
        } else if (err && err.password) {
          showErrorNotification(err.password);
        }
      },
    };
    dispatch(signupUser(obj));
  };

  let content = (
    // <LoadingIndicator color={ThemeStatic.accent} size={IconSizes.x1} />
    <View />
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
              <Text style={styles().registerInContainer}>
                {step == 1 ? (
                  <Text>Sign up</Text>
                ) : <Text></Text> && step == 2 ? (
                  <Text>Enter 4-Digit Code</Text>
                ) : (
                  <Text></Text>
                )}
              </Text>
              <Text style={styles().registerInDescription}>
                {step == 2 ? (
                  <Text>
                    Please enter the code sent to your registered email{' '}
                  </Text>
                ) : (
                  <Text></Text>
                )}
              </Text>
            </View>
            {step == 1 && (
              <LoginDetail
                step={step}
                formValues={loginDetailData}
                loadingUserLogin={loadingUserLogin}
                onNext={goToStep}
                terms={onTermAndCondtion}
              />
            )}
            {step == 2 && (
              <VerificationCode
                step={step}
                formValues={validationCodeValues}
                loadingUserLogin={loadingUserLogin}
                onNext={goToStep}
                onOtpVerified={otpVerifiedSuccess}
              />
            )}
          </View>
        </KeyboardAwareScrollView>
      </>
    );
  }

  return (
    <View style={styles(theme).container}>
      <ImageBackground source={bgImage} style={styles().backgroundImage}>
        {content}
        <TermsAndConditionsBottomSheet ref={termsAndConditionsBottomSheetRef} />
      </ImageBackground>
    </View>
  );
};

export default LoginScreen;
