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
  Button,
} from 'react-native';
import { Icon, Input, Label } from 'native-base';
// import { Button } from 'react-native-elements';
import { Formik } from 'formik';
import { ThemeColors } from '@app/types/theme';
import { ThemeStatic } from '@app/theme';
import { AppContext } from '@app/context';
import { signUpSecondValidationSchema } from '@app/utils/validation';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { IconSizes } from '@app/constants';
import { styles } from '../styles';
import { useNavigation } from 'react-navigation-hooks';
import { ISignUpStepSecondValues } from '../interface';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import Config from '@app/config';
interface Step2Interface {
  step: number;
  formValues: ISignUpStepSecondValues;
  onNext: (n: number, values: any) => void;
}
const Step2: React.FC<Step2Interface> = ({ formValues, step, onNext }) => {
  const { theme } = useContext(AppContext);

  const opacity = new Animated.Value(0);
  const [formatted_address, setFormatted_address] = useState('');
  const [selected_street_address, setSelected_street_address] = useState('');
  const [selected_address_remainder, setSelected_address_remainder] =
    useState('');
  const [top_view_visible, setTop_view_visible] = useState(true);

  const ref = useRef();
  useEffect(() => {
    Animated.timing(opacity, {
      toValue: step == 2 ? 1 : 0,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, [step]);

  const saveButtonTranslationX = opacity.interpolate({
    inputRange: [0, 1],
    outputRange: [100, 0],
  });
  return (
    <Animated.View
      style={[
        styles().roundedView,
        {
          flex: 0.65,
          opacity: opacity,
          transform: [{ translateX: saveButtonTranslationX }],
        },
      ]}
    >
      <View style={styles(theme).roundedViewInner}>
        <View style={{ flex: 1, flexDirection: 'column' }}>
          <Text style={styles(theme).titleText}> Contact Detail </Text>
          <Formik
            initialValues={{ ...formValues }}
            validationSchema={signUpSecondValidationSchema}
            onSubmit={(values) => onNext(3, values)}
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
                  <View style={styles(theme).halfCol}>
                    {errors.first_name ? (
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
                        {values.first_name?.length != 0 && 'First Name'}
                      </Text>
                    )}
                    {/* {errors.first_name ? (
                      <Label style={[styles(theme).sectionText, { color: ThemeStatic.badge }]}>
                        {errors.first_name}
                      </Label>
                    ) : (
                        <Label style={styles(theme).sectionText}>
                          {!!values.first_name.length && "First Name"}
                        </Label>
                      )} */}
                    <Input
                      //ref={ref => {this.fNameInput = ref}}
                      defaultValue={values.first_name}
                      onChangeText={handleChange('first_name')}
                      onSubmitEditing={() => {}}
                      returnKeyType="next"
                      style={styles(theme).input}
                      placeholderTextColor={ThemeStatic.text02}
                      placeholder={'First Name *'}
                    />
                  </View>

                  <View style={styles(theme).halfCol}>
                    {errors.last_name ? (
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
                        {values?.last_name?.length != 0 && 'Last Name'}
                      </Text>
                    )}
                    {/* {errors.last_name ? (
                      <Label style={[styles(theme).sectionText, { color: ThemeStatic.badge }]}>
                        {errors.last_name}
                      </Label>
                    ) : (
                        <Label style={styles(theme).sectionText}>
                          {!!values.last_name.length && "Last Name"}
                        </Label>
                      )} */}
                    <Input
                      //ref={ref => { this.lNameInput = ref }}
                      defaultValue={values.last_name}
                      onChangeText={handleChange('last_name')}
                      onSubmitEditing={() => {}}
                      returnKeyType="next"
                      style={styles(theme).input}
                      placeholderTextColor={ThemeStatic.text02}
                      placeholder={'Last Name *'}
                    />
                  </View>
                </View>

                <View style={{ marginBottom: 60, zIndex: 99 }}>
                  <GooglePlacesAutocomplete
                    ref={ref}
                    textInputProps={{
                      onChangeText: (text) => {
                        setFormatted_address(text);
                        setSelected_street_address(
                          text.indexOf(',') > -1
                            ? text.substring(0, text.indexOf(','))
                            : text
                        );
                        setSelected_address_remainder(
                          text.indexOf(',') > -1
                            ? text.substring(text.indexOf(',') + 2)
                            : ''
                        );
                      },
                      onFocus: () => setTop_view_visible(false),
                    }}
                    styles={inputStyle.input}
                    scrollEnabled={true}
                    placeholder="Address"
                    minLength={1}
                    autoFocus={true}
                    returnKeyType={'search'}
                    fetchDetails={true}
                    onPress={(data, details = null) => {
                      // 'details' is provided when fetchDetails = true
                      console.info({
                        message: 'Data:' + JSON.stringify(data),
                      });
                      console.info({
                        message:
                          'Details: ' +
                          JSON.stringify(details?.formatted_address),
                      });
                      ref.current.setAddressText(details?.formatted_address);

                      setSelected_street_address(
                        details?.formatted_address.substring(
                          0,
                          details?.formatted_address.indexOf(',')
                        )
                      );
                      setSelected_address_remainder(
                        details?.formatted_address.substring(
                          details?.formatted_address.indexOf(',') + 2
                        )
                      );
                    }}
                    query={{
                      key: Config.google_place_api_key,
                      language: 'en',
                    }}
                    numberOfLines={2}
                  />
                </View>
                <Button
                  onPress={handleSubmit}
                  loading={false}
                  icon={{
                    name: 'user',
                    type: 'font-awesome',
                    color: 'white',
                    marginRight: 9,
                  }}
                  fontWeight="bold"
                  fontFamily="sans-serif"
                  buttonStyle={[
                    styles().button,
                    { backgroundColor: '#846BE2' },
                  ]}
                  title="Submit"
                />
              </View>
            )}
          </Formik>
        </View>
      </View>
    </Animated.View>
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
