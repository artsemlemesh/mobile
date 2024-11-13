import React, { useContext, useEffect, useRef, useState } from 'react';
import { ImageBackground, Text, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Routes } from '@app/constants';
import { AppContext } from '@app/context';
import { ThemeStatic } from '@app/theme';
import { showErrorNotification } from '@app/utils/notifications';
import { forgotUser } from '@app/actions/forgot';

import { IForgotScreenFormValues } from './interface';
import { styles } from './styles';
import { showMessage } from 'react-native-flash-message';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { LeftArrow, Logo } from '../../utils/commonFuntions';
import { Zocial } from '@expo/vector-icons';
import { TextInput } from 'react-native-gesture-handler';

const ForgotScreen: React.FC = ({ navigation, route }: any) => {
  const dispatch = useDispatch();

  const { theme, themeType, updateUser } = useContext(AppContext);
  const { navigate, goBack } = navigation;

  const [email, setEmail] = useState<string>('');
  const user = useSelector((state) => state.user);

  const { loadingUserForgot, error, profile } = user;

  const [errors, setError] = useState<IForgotScreenFormValues>({
    email: '',
  });
  const bgImage = require('@app/assets/images/app-auth-bg.png');
  const navigateBack = () => goBack();

  useEffect(() => {}, []);

  const _forgot = async () => {
    if (!email) {
      const errors = {
        email: !email ? 'Email is required' : '',
      };
      setError(errors);
      return;
    } else if (
      !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,15}/.test(email)
    ) {
      const errors = {
        email: 'Enter a valid email Address',
      };
      setError(errors);
      return;
    } else {
      let obj = {
        email: email.toLowerCase().trim(),
        onSuccess: (res) => {
          if (res) {
            showMessage(res);
            navigate(Routes.LoginScreen);
          }
        },
        onFail: (response) => {
          if (response && response.statusCode === 401) {
            navigate(Routes.RegisterScreen, { step: 2 });
          } else if (response && response.statusCode === 400) {
            if (
              response.body.non_field_errors[0] == 'User account is disabled.'
            ) {
              navigate(Routes.RegisterScreen, {
                step: 2,
                initialValues: { email: email },
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
      await dispatch(forgotUser(obj));
    }
  };

  let content = (
    <>
      <KeyboardAwareScrollView keyboardShouldPersistTaps>
        <View style={styles(theme).content}>
          <View style={{ display: 'flex', flexDirection: 'row' }}>
            <TouchableOpacity onPress={navigateBack}>
              <LeftArrow />
            </TouchableOpacity>
            <Logo />
          </View>
          <View>
            <Text style={styles().recoverInContainer}>Find your account</Text>
            <Text style={styles().recoverInDescription}>
              Please enter your email address to search for your account
            </Text>
          </View>
          <View style={[styles(theme).roundedView, { flex: 0.65 }]}>
            <View style={styles(theme).roundedViewInner}>
              <View style={{ flex: 1, flexDirection: 'column' }}>
                <View style={styles(theme).roundedContent}>
                  <View style={styles().forgotItem}>
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
                    <View style={styles().textField}>
                      <Zocial name="email" style={styles().inputIcons} />
                      <TextInput
                        autoFocus
                        style={styles().input}
                        placeholderTextColor={ThemeStatic.text02}
                        value={email}
                        returnKeyType={'next'}
                        onChangeText={(email) => {
                          setEmail(email);
                          setError({ email: '' });
                        }}
                        blurOnSubmit={false}
                        placeholder={'Email'}
                        keyboardType="email-address"
                        accessibilityLabel={'Forgot_Email'}
                      />
                    </View>
                  </View>
                  <TouchableOpacity
                    style={[styles().button, { backgroundColor: '#846BE2' }]}
                    onPress={() => _forgot()}
                  >
                    <Text
                      style={{
                        color: 'white',
                        fontWeight: 'bold',
                        fontFamily: 'sans-serif',
                      }}
                    >
                      Search
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </>
  );

  return (
    <View style={styles(theme).container}>
      <ImageBackground source={bgImage} style={styles().backgroundImage}>
        {content}
      </ImageBackground>
    </View>
  );
};

export default ForgotScreen;
