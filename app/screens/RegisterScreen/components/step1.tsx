import React, { useContext, useRef, useEffect, useState } from 'react';
import { View, Animated, TouchableOpacity, Platform,Text, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Button } from 'react-native-elements';
import { Formik } from 'formik';
import { ThemeStatic } from '@app/theme';
import { AppContext } from '@app/context';
import { signUpFirstValidationSchema } from '@app/utils/validation';
import { styles } from '../styles';
import { ISignUpStepFirstValues } from '../interface';
import { FontAwesome, Zocial, MaterialIcons } from '@expo/vector-icons';
import Separator from '../../../components/common/Separator';
import SocialButton  from '../../../components/common/SocialButton'
import { welcomeNotification } from '../../../utils/notifications';
// import { identify } from '../../../utils/Analytics';
import { signOut } from '@app/utils/authentication';
import { useDispatch, useSelector } from 'react-redux';
import {
  fbLogIn,
  loginWithApple,
  signInAsync,
  signInWithGoogleAsync,
} from '../../../utils/commonFuntions';
interface Step1Interface {
  step: number;
  loadingUserLogin: boolean;
  formValues: ISignUpStepFirstValues;
  onNext: (n: number, values: any) => void;
  terms?: any;
}
const Step1: React.FC<Step1Interface> = ({
  formValues,
  loadingUserLogin,
  step,
  onNext,
  terms,
}) => {
  const { navigate } = useNavigation();
  const { theme } = useContext(AppContext);
  const opacity = new Animated.Value(0);

  const emailRef = useRef(null);
  const passRef = useRef(null);
  const passRef2 = useRef(null);
  const [email, setEmail] = useState<string>(null);
  const [loadingSignUp, setLoadingSignUp] = useState<boolean>(false);

  const dispatch = useDispatch();

  const user = useSelector((state) => state.user);

  useEffect(() => {
    if (
      user.profile !== null &&
      user.profile !== undefined &&
      user.profile !== ''
    ) {
      if (user.success) navigateToApp(user?.profile?.token);
    }
  }, [!user.profile]);

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: step == 1 ? 1 : 0,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, [step]);

  const saveButtonTranslationX = opacity.interpolate({
    inputRange: [0, 1],
    outputRange: [100, 0],
  });

  const goToRegisterScreen = () => {
    navigate('RegisterScreen');
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

  return (
    <View style={{ flex: 1 }}>
      <Animated.View
        style={[
          styles().roundedView,
          {
            flex: 1,
            opacity: opacity,
            // transform: [{ translateX: saveButtonTranslationX }],
          },
        ]}
      >
        <View style={styles(theme).roundedViewInner}>
          <View>
            <Formik
              initialValues={{ ...formValues }}
              validationSchema={signUpFirstValidationSchema}
            >
              {({
                handleChange,
                handleBlur,
                handleSubmit,
                values,
                errors,
                touched,
              }) => (
                <View style={styles(theme).roundedContent}>
                  <View style={styles(theme).sectionRow}>
                    <View style={styles(theme).fullName}>
                      <View
                        style={{
                          display: 'flex',
                          width: '48%',
                          marginRight: '4%',
                        }}
                      >
                        {errors.first_name && errors.first_name.length > 1 ? (
                          <Text
                            style={[
                              styles(theme).sectionText,
                              { color: ThemeStatic.badge },
                            ]}
                          >
                            {errors.first_name}
                          </Text>
                        ) : (
                          <Text style={styles(theme).sectionText}>
                            {!!values.first_name.length && 'First Name'}
                          </Text>
                        )}
                        <View
                          // borderType="underline"
                          style={styles().textField}
                        >
                          <FontAwesome
                            name="user-circle"
                            style={styles().icons}
                          />
                          <TextInput
                            autoFocus
                            getRef={(input) => {
                              this.firstNameRef = input;
                            }}
                            returnKeyType={'next'}
                            onSubmitEditing={() => {}}
                            blurOnSubmit={false}
                            defaultValue={values.first_name}
                            onChangeText={handleChange('first_name')}
                            style={styles(theme).input}
                            placeholderTextColor={ThemeStatic.text02}
                            placeholder={'First Name'}
                            accessibilityLabel={'Register_FirstName'}
                          />
                          </View>
                        {/* </InputGroup> */}
                      </View>
                      <View style={{ display: 'flex', width: '48%' }}>
                        {errors.last_name && errors.last_name.length > 1 ? (
                          <Text
                            style={[
                              styles(theme).sectionText,
                              { color: ThemeStatic.badge },
                            ]}
                          >
                            {errors.last_name}
                          </Text>
                        ) : (
                          <Text style={styles(theme).sectionText}>
                            {!!values.last_name.length && 'Last Name'}
                          </Text>
                        )}
                        <View
                          style={styles().textField}
                        >
                          <FontAwesome
                            name="user-circle"
                            style={styles().icons}
                          />
                          <TextInput
                            Ref={(input) => {
                              this.lastNameRef = input;
                            }}
                            returnKeyType={'next'}
                            onSubmitEditing={() => {}}
                            blurOnSubmit={false}
                            defaultValue={values.last_name}
                            onChangeText={handleChange('last_name')}
                            style={styles(theme).input}
                            placeholderTextColor={ThemeStatic.text02}
                            placeholder={'Last Name'}
                            accessibilityLabel={'Register_LastName'}
                          />
                        </View>
                      </View>
                    </View>
                  </View>
                  <View style={styles().EmailField}>
                    {/* {errors.email && touched.email ? (
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
                        {values.email && 'Email'}
                      </Text>
                    )} */}
                    <View
                      style={styles().textField}
                    >
                      <Zocial name="email" style={styles().icons} />
                      <TextInput
                        ref={emailRef}
                        returnKeyType={'next'}
                        onSubmitEditing={() => {
                          email.current._root.focus();
                        }}
                        blurOnSubmit={false}
                        style={styles().input}
                        placeholderTextColor={ThemeStatic.text02}
                        value={values.email}
                        returnKeyType="next"
                        onChangeText={handleChange('email')}
                        placeholder={'Email'}
                        keyboardType="email-address"
                        accessibilityLabel={'Register_Email'}
                      />
                    </View>
                  </View>
                  <View style={styles().PasswordField}>
                    {/* {errors.password && touched.password ? (
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
                        {values.password && 'Password'}
                      </Text>
                    )} */}
                    <View
                      style={styles().textField}
                    >
                      <MaterialIcons name="lock" style={styles().icons} />
                      <TextInput
                        ref={passRef}
                        returnKeyType={'next'}
                        onSubmitEditing={() => {
                          passRef.current._root.focus();
                        }}
                        blurOnSubmit={false}
                        secureTextEntry
                        textContentType="oneTimeCode"
                        style={styles().input}
                        placeholderTextColor={ThemeStatic.text02}
                        value={values.password}
                        returnKeyType="next"
                        onChangeText={handleChange('password')}
                        placeholder={'Password'}
                        accessibilityLabel={'Register_Password'}
                      />
                    </View>
                    {/* {errors.confirmPassword && touched.password ? (
                      <Text
                        style={[
                          styles().sectionText,
                          { color: ThemeStatic.badge },
                        ]}
                      >
                        {errors.confirmPassword}
                      </Text>
                    ) : (
                      <Text style={styles().sectionText}>
                        {values.confirmPassword && 'ConfirmPassword'}
                      </Text>
                    )} */}
                    <View
                      style={styles().textField}
                    >
                      <MaterialIcons name="lock" style={styles().icons} />
                      <TextInput
                        ref={passRef2}
                        secureTextEntry
                        textContentType="oneTimeCode"
                        style={styles().input}
                        placeholderTextColor={ThemeStatic.text02}
                        value={values.confirmPassword}
                        returnKeyType="next"
                        onChangeText={handleChange('confirmPassword')}
                        placeholder={'Confirm Password'}
                        onSubmitEditing={handleSubmit}
                        accessibilityLabel={'Register_ConfirmPass'}
                        testID={'Register_ConfirmPassword'}
                      />
                    </View>
                  </View>

                  <Button
                    onPress={() => {
                      onNext(1, values);
                    }}
                    loading={loadingUserLogin}
                    fontWeight="bold"
                    fontFamily="sans-serif"
                    buttonStyle={[
                      styles().button,
                      { backgroundColor: '#846BE2' },
                    ]}
                    title="Sign Up"
                    accessibilityLabel={'Register_SignUp'}
                  />
                  <View
                    style={{ paddingTop: 8, alignSelf: 'center', width: '80%' }}
                  >
                    <Text>By signing up you accept our {''}</Text>
                    <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                      <TouchableOpacity onPress={terms}>
                        <Text style={styles(theme).color}>
                          terms of services
                        </Text>
                      </TouchableOpacity>
                      <Text> and {''}</Text>
                      <TouchableOpacity onPress={terms}>
                        <Text style={styles(theme).color}>privacy policy</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              )}
            </Formik>
          </View>
        </View>
      </Animated.View>
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
              testIDs={'Register_AppleLogin'}
            />
          )}
          <SocialButton
            onPress={() => signInWithGoogleAsync(dispatch, navigate)}
            image={require('@app/assets/google.png')}
            imageStyle={{}}
            buttonViewStyle={{ backgroundColor: '#E5664F' }}
            testIDs={'Register_GoogleLogin'}
          />
          {/* <SocialButton
            onPress={() => fbLogIn(dispatch, navigate)}]
            image={require('@app/assets/facebook.png')}
            imageStyle={{}}
            buttonViewStyle={{ backgroundColor: '#3B5998' }}
            testIDs={'Register_FbLogin'}
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
    </View>
  );
};

export default Step1;
