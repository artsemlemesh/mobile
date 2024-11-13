import React, {
  Component,
  useContext,
  useState,
  useEffect,
  useRef,
} from 'react';
import {
  Image,
  ImageBackground,
  Platform,
  Text,
  TouchableOpacity,
  View,
  Animated,
  Alert,
  SafeAreaView,
} from 'react-native';
import * as Linking from 'expo-linking';
import { InputGroup, Icon, Input } from 'native-base';
import { Button } from 'react-native-elements';
import { Formik } from 'formik';
import { ThemeColors } from '@app/types/theme';
import { ThemeStatic } from '@app/theme';
import { AppContext } from '@app/context';
import { signUpSecondValidationSchema } from '@app/utils/validation';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { IconSizes } from '@app/constants';
import { styles } from '../styles';
// import { useNavigation } from 'react-navigation-hooks';
import { ISignUpStepSecondValues } from '../interface';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import user from 'reducers/user';
import { useSelector } from 'react-redux';
interface Step2Interface {
  step: number;
  loadingUserLogin: boolean;
  formValues: ISignUpStepSecondValues;
  onNext: (n: number, values: any) => void;
  onOtpVerified: ({ token: string }) => void;
}
const Step2: React.FC<Step2Interface> = ({
  formValues,
  loadingUserLogin,
  step,
  onNext,
  onOtpVerified,
}) => {
  const { theme } = useContext(AppContext);

  const opacity = new Animated.Value(0);
  const [formatted_address, setFormatted_address] = useState('');
  const [selected_street_address, setSelected_street_address] = useState('');
  const [selected_address_remainder, setSelected_address_remainder] =
    useState('');
  const [top_view_visible, setTop_view_visible] = useState(true);
  const user = useSelector((state) => state.user);

  useEffect(() => {
    const handleOpenURL = (e: Linking.EventType) => {
      const { queryParams } = Linking.parse(e.url);
      if (queryParams.token) {
        onOtpVerified({ token: queryParams.token });
      }
    };
    const handleOpenURL1 = (e: Linking.EventType | string) => {};
    Linking.getInitialURL()
      .then((ev) => {
        if (ev) {
          handleOpenURL1(ev);
        }
      })
      .catch((err) => {
        console.warn('An error occurred', err);
      });
    // const url = Linking.makeUrl('/verify', {});
    const url1 = Linking.createURL('/?');
    const eventListener = Linking.addEventListener('url', handleOpenURL);
  }, []);
  const ref = useRef();
  const verificationRef = useRef(null);

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: step == 2 ? 2 : 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, [step]);

  const saveButtonTranslationX = opacity.interpolate({
    inputRange: [0, 1],
    outputRange: [100, 0],
  });
  const CELL_COUNT = 4;
  const [value, setValue] = useState('');
  const ref1 = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });
  return (
    <View
      style={[
        styles().roundedView,
        {
          flex: 0.65,
          // opacity: opacity,
          // transform: [{ translateX: saveButtonTranslationX }]
        },
      ]}
    >
      <View style={styles(theme).roundedViewInner}>
        <View style={{ flex: 1, flexDirection: 'column' }}>
          <Formik
            initialValues={{ ...formValues }}
            validationSchema={signUpSecondValidationSchema}
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
                  <View style={{ flex: 1 }}>
                    {errors.verification_code ? (
                      <Text
                        style={[
                          styles(theme).sectionText,
                          { color: ThemeStatic.badge },
                        ]}
                      >
                        {errors.verification_code}
                      </Text>
                    ) : null}
                    <InputGroup borderType="underline">
                      <SafeAreaView style={styles().root}>
                        <CodeField
                          ref={ref1}
                          {...props}
                          // Use `caretHidden={false}` when users can't paste a text value, because context menu doesn't appear
                          value={values.verification_code}
                          onChangeText={handleChange('verification_code')}
                          cellCount={CELL_COUNT}
                          rootStyle={styles().codeFieldRoot}
                          keyboardType="number-pad"
                          textContentType="oneTimeCode"
                          renderCell={({ index, symbol, isFocused }) => (
                            <Text
                              key={index}
                              style={[
                                styles().cell,
                                isFocused && styles().focusCell,
                              ]}
                              onLayout={getCellOnLayoutHandler(index)}
                            >
                              {symbol || (isFocused ? <Cursor /> : null)}
                            </Text>
                          )}
                          accessibilityLabel={'Verification_CodeField'}
                        />
                      </SafeAreaView>
                    </InputGroup>
                  </View>
                </View>
                <Button
                  onPress={() => {
                    onNext(2, values);
                  }}
                  loading={loadingUserLogin}
                  fontWeight="bold"
                  fontFamily="sans-serif"
                  buttonStyle={[
                    styles().button,
                    { backgroundColor: '#846BE2' },
                  ]}
                  title="Submit"
                  accessibilityLabel={'Verification_Submit'}
                />
              </View>
            )}
          </Formik>
          <View>
            <TouchableOpacity
              // @ts-ignore
              onPress={() => onNext(2, 'resendOtp')}
              style={styles(theme).terms}
              accessibilityLabel={'Verification_ResendOtp'}
            >
              <Text style={styles(theme).termsText}>
                Didn't get the code?{' '}
                <Text style={styles().resendText}>Resend</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default Step2;
export const inputStyle = {
  input: {
    textInputContainer: {
      backgroundColor: 'transparent',
      paddingLeft: 10,
      borderTopColor: 'white',
      borderBottomWidth: 1,
      borderBottomColor: '#B2C1D3',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      marginTop: 20,
      marginBottom: 20,
    },
    textInput: {
      backgroundColor: 'transparent',
      marginLeft: 0,
      marginRight: 0,
      marginTop: 0,
      marginBottom: 0,
      fontSize: 18,
    },
    poweredContainer: {
      backgroundColor: 'transparent',
    },
    predefinedPlacesDescription: {
      backgroundColor: 'transparent',
      color: '#1faadb',
    },
    row: {
      alignItems: 'center',
      justifyContent: 'center',
      width: '80%',
      borderRadius: 35,
      height: 70,
      backgroundColor: '#E9EDF6',
      paddingLeft: 30,
      paddingRight: 30,
    },
    separator: {
      backgroundColor: 'white',
      marginBottom: 10,
    },
    description: {
      fontSize: 12,
      textAlign: 'center',
    },
    container: {
      overflow: 'visible',
      flexGrow: 0,
      flexShrink: 0,
      elevation: 200,
      zIndex: 99,
    },
    listView: {
      position: 'absolute',
      top: 70,
      elevation: 999,
      zIndex: 999,
      backgroundColor: 'white',
    },
  },
};
