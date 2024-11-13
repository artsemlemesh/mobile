import React, { useContext, useState, useEffect, useRef } from 'react';
import { View, Animated, Dimensions, Button } from 'react-native';
import { InputGroup, Icon, Input, Label, Text, Spinner } from 'native-base';
// import { Button } from 'react-native-elements';
import { Formik } from 'formik';
import { ThemeStatic } from '@app/theme';
import { AppContext } from '@app/context';
import { addressValidationSchema } from '@app/utils/validation';
import { styles } from '../styles';
// import { useNavigation } from 'react-navigation-hooks';
import { ISignUpStepFirstValues } from '../interface';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import Config from '@app/config';
import { useSelector } from 'react-redux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const { height, width } = Dimensions.get('window');
interface Step1Interface {
  step: number;
  formValues: ISignUpStepFirstValues;
  loading: boolean;
  onNext: (n: number, values: any) => void;
}
const Step1: React.FC<Step1Interface> = ({
  formValues,
  step,
  onNext,
  loading,
}) => {
  const { theme } = useContext(AppContext);
  const user = useSelector((state) => state.user);
  const opacity = new Animated.Value(0);

  const cityRef = useRef(null);
  const stateRef = useRef(null);
  const postalCodeRef = useRef(null);

  const [formatted_address, setFormatted_address] = useState('');
  const [addressLine1, setAddressLine1] = useState(
    user && user.profile && user.profile.address_line_1
      ? user.profile.address_line_1
      : ''
  );
  const [addressLine2, setAddressLine2] = useState(
    user && user.profile && user.profile.address_line_2
      ? user.profile.address_line_2
      : ''
  );
  const [city, setCity] = useState(
    user && user.profile && user.profile.city ? user.profile.city : ''
  );
  const [state, setState] = useState(
    user && user.profile && user.profile.state ? user.profile.state : ''
  );
  const [zipCode, setZipCode] = useState(
    user && user.profile && user.profile.postal_code
      ? user.profile.postal_code
      : ''
  );

  const [listViewDisplayed, setlistViewDisplayed] = useState<boolean>(true);

  const [errorMessage, setErrorMessage] = useState<any>();

  const [top_view_visible, setTop_view_visible] = useState(true);

  const borderRadius = formatted_address ? 5 : undefined;
  const borderWidth = formatted_address ? 0.5 : undefined;

  const ref = useRef();
  useEffect(() => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, [step]);

  const saveButtonTranslationX = opacity.interpolate({
    inputRange: [0, 1],
    outputRange: [100, 0],
  });

  const onAddressDetail = (addressDetails: any) => {
    setlistViewDisplayed(false);
    setErrorMessage(null);

    if (
      addressDetails &&
      addressDetails.address_components &&
      addressDetails.address_components.length > 0
    ) {
      // setAddressLine1(addressDetails.address_components[0].long_name + ' ' + addressDetails.address_components[1].long_name);
      let streetNumber;
      let routeName;
      addressDetails.address_components.map((item) => {
        let streetNo = item.types.includes('street_number');
        if (streetNo) {
          streetNumber = item.long_name;
        }
        let route = item.types.includes('route');
        if (route) {
          routeName = item.short_name;
        }
        let address2 = item.types.includes('subpremise');
        if (address2) {
          setAddressLine2(item.long_name);
        }
        let checkCity = item.types.includes('locality');
        if (checkCity) {
          setCity(item.long_name);
        }
        let checkState = item.types.includes('administrative_area_level_1');
        if (checkState) {
          setState(item.short_name);
        }
        let checkZip = item.types.includes('postal_code');
        if (checkZip) {
          setZipCode(item.long_name);
        }
      });
      if (streetNumber && routeName) {
        setAddressLine1(streetNumber + ' ' + routeName);
      }
    }
  };

  const onSubmit = () => {
    if (!addressLine1) {
      setErrorMessage('Address is required!');
    } else if (!city) {
      setErrorMessage('City is required!');
    } else if (!state) {
      setErrorMessage('State is required!');
    } else if (!zipCode) {
      setErrorMessage('Zip is required!');
    } else {
      let addressDetails = {
        address_line_1: addressLine1,
        address_line_2: addressLine2,
        city: city,
        state: state,
        postal_code: zipCode,
      };

      onNext(3, addressDetails);
    }
  };

  return (
    <Animated.View
      style={[
        styles().roundedView,
        {
          flex: 1,
          opacity: opacity,
          // transform: [{ translateX: saveButtonTranslationX }]
        },
      ]}
    >
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      >
        <View style={styles(theme).roundedViewInner}>
          <View style={{ flex: 1, flexDirection: 'column' }}>
            <Text style={styles(theme).titleText}> Shipping From Address</Text>
            <Formik
              initialValues={{ ...formValues }}
              validationSchema={addressValidationSchema}
              onSubmit={(values) => onNext(3, values)}
            >
              {({ handleChange, handleSubmit, values }) => (
                <View style={styles(theme).roundedContent}>
                  {/* <View style={{ marginBottom: 60, zIndex: 99 }}> */}
                  <View
                    style={{
                      flex: 1,
                      marginBottom: 60,
                      padding: 4,
                      zIndex: 99,
                    }}
                  >
                    <GooglePlacesAutocomplete
                      ref={ref}
                      placeholder="Enter Location"
                      minLength={2}
                      autoFocus={true}
                      // returnKeyType={'default'}
                      fetchDetails={true}
                      suppressDefaultStyles={true}
                      enablePoweredByContainer={false}
                      listViewDisplayed={listViewDisplayed}
                      styles={{
                        textInputContainer: {
                          borderColor: ThemeStatic.accent,
                          borderWidth: 1.5,
                          borderRadius: 5,
                          marginTop: 20,
                        },
                        textInput: {
                          height: 38,
                          color: '#5d5d5d',
                          fontSize: 16,
                          marginStart: 10,
                        },
                        predefinedPlacesDescription: {
                          color: '#1faadb',
                        },
                        listView: {
                          borderRadius: borderRadius,
                          borderColor: formatted_address && ThemeStatic.accent,
                          borderWidth: borderWidth,
                          height: height / 6,
                          marginVertical: 5,
                        },
                        separator: {
                          height: 0.5,
                          width: width / 1.35,
                          backgroundColor: ThemeStatic.accent,
                          alignSelf: 'center',
                        },
                        row: {
                          backgroundColor: '#FFFFFF',
                          padding: 13,
                          height: 44,
                        },
                      }}
                      textInputProps={{
                        onChangeText: (text) => {
                          setFormatted_address(text);
                          // setSelected_street_address(
                          //   text.indexOf(',') > -1
                          //     ? text.substring(0, text.indexOf(','))
                          //     : text
                          // );
                          // setSelected_address_remainder(
                          //   text.indexOf(',') > -1
                          //     ? text.substring(text.indexOf(',') + 2)
                          //     : ''
                          // );
                        },
                        onFocus: () => {
                          setTop_view_visible(false),
                            setlistViewDisplayed(true);
                        },
                      }}
                      scrollEnabled={true}
                      onPress={(data, details = null) => {
                        onAddressDetail(details);
                        // ref.current.setAddressText(details?.formatted_address);

                        // setSelected_street_address(
                        //   details?.formatted_address.substring(
                        //     0,
                        //     details?.formatted_address.indexOf(',')
                        //   )
                        // );
                        // setSelected_address_remainder(
                        //   details?.formatted_address.substring(
                        //     details?.formatted_address.indexOf(',') + 2
                        //   )
                        // );
                      }}
                      query={{
                        key: Config.google_place_api_key,
                        language: 'en',
                        components: 'country:us',
                        types: ['address'],
                      }}
                      numberOfLines={6}
                      accessibilityLabel={'fromAddress_location'}
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    {/* <InputGroup borderType="underline"> */}
                    <Input
                      value={addressLine1}
                      getRef={(input) => {
                        this.addressLine1Ref = input;
                      }}
                      returnKeyType={'next'}
                      onSubmitEditing={() => {
                        lastNameRef.current._root.focus();
                      }}
                      blurOnSubmit={false}
                      defaultValue={values.addressLine1}
                      onChangeText={(values) => {
                        setAddressLine1(values);
                        handleChange('addressLine1');
                      }}
                      style={styles(theme).input}
                      placeholderTextColor={ThemeStatic.text02}
                      placeholder={'Address Line 1'}
                      numberOfLines={3}
                      multiline={true}
                      accessibilityLabel={'fromAddress_addressLine1'}
                    />
                    {/* </InputGroup> */}
                  </View>
                  <View style={{ flex: 1 }}>
                    {/* <Label
                    style={[
                      styles(theme).sectionText,
                      { color: ThemeStatic.badge },
                    ]}
                  >
                    {errorMessage}
                  </Label> */}
                    {/* <InputGroup borderType="underline"> */}
                    <Input
                      value={addressLine2}
                      getRef={(input) => {
                        this.addressLine2Ref = input;
                      }}
                      returnKeyType={'next'}
                      onSubmitEditing={() => {
                        cityRef.current._root.focus();
                      }}
                      blurOnSubmit={false}
                      defaultValue={values.addressLine2}
                      onChangeText={(values) => setAddressLine2(values)}
                      style={styles(theme).input}
                      placeholderTextColor={ThemeStatic.text02}
                      placeholder={'Address Line 2'}
                      numberOfLines={3}
                      multiline={true}
                      accessibilityLabel={'fromAddress_addressLine2'}
                    />
                    {/* </InputGroup> */}
                  </View>

                  <View style={styles(theme).sectionRow}>
                    <View style={{ flex: 1 }}>
                      {/* <Label
                      style={[
                        styles(theme).sectionText,
                        { color: ThemeStatic.badge },
                      ]}
                    >
                      {errorMessage}
                    </Label> */}
                      {/* <InputGroup borderType="underline"> */}
                      <Input
                        value={city}
                        getRef={(input) => {
                          this.cityRef = input;
                        }}
                        returnKeyType={'next'}
                        onSubmitEditing={() => {
                          stateRef.current._root.focus();
                        }}
                        blurOnSubmit={false}
                        defaultValue={values.city}
                        onChangeText={(values) => {
                          setCity(values);
                          handleChange('city');
                        }}
                        style={styles(theme).input}
                        placeholderTextColor={ThemeStatic.text02}
                        placeholder={'City'}
                        accessibilityLabel={'fromAddress_city'}
                      />
                      {/* </InputGroup> */}
                    </View>
                    <View style={{ flex: 1 }}>
                      {/* <Label
                      style={[
                        styles(theme).sectionText,
                        { color: ThemeStatic.badge },
                      ]}
                    >
                      {errorMessage}
                    </Label> */}
                      {/* <InputGroup borderType="underline"> */}
                      <Input
                        value={state}
                        getRef={(input) => {
                          this.stateRef = input;
                        }}
                        returnKeyType={'next'}
                        onSubmitEditing={() => {
                          postalCodeRef.current._root.focus();
                        }}
                        blurOnSubmit={false}
                        defaultValue={values.state}
                        onChangeText={(values) => {
                          setState(values);
                          handleChange('state');
                        }}
                        style={styles(theme).input}
                        placeholderTextColor={ThemeStatic.text02}
                        placeholder={'State'}
                        accessibilityLabel={'fromAddress_state'}
                      />
                      {/* </InputGroup> */}
                    </View>
                    <View style={{ flex: 1 }}>
                      {/* <Label
                      style={[
                        styles(theme).sectionText,
                        { color: ThemeStatic.badge },
                      ]}
                    >
                      {errorMessage}
                    </Label> */}
                      {/* <InputGroup borderType="underline"> */}
                      <Input
                        value={zipCode}
                        getRef={(input) => {
                          this.postalCodeRef = input;
                        }}
                        returnKeyType={'next'}
                        onSubmitEditing={handleSubmit}
                        blurOnSubmit={false}
                        defaultValue={values.postalCode}
                        onChangeText={(values) => {
                          setZipCode(values);
                        }}
                        style={styles(theme).input}
                        placeholderTextColor={ThemeStatic.text02}
                        placeholder={'Zip'}
                        accessibilityLabel={'fromAddress_zip'}
                      />
                      {/* </InputGroup> */}
                    </View>
                  </View>
                  <Text
                    style={[
                      styles(theme).sectionText,
                      {
                        color: ThemeStatic.badge,
                        alignSelf: 'center',
                        fontSize: 14,
                      },
                    ]}
                  >
                    {errorMessage}
                  </Text>
                  {/* <Label
                    style={[
                      styles(theme).sectionText,
                      {
                        color: ThemeStatic.badge,
                        alignSelf: 'center',
                        fontSize: 14,
                      },
                    ]}
                  >
                    {errorMessage}
                  </Label> */}
                  {loading ? (
                    <Spinner color="#846BE2" />
                  ) : (
                    <Button
                      onPress={() => {
                        onSubmit();
                      }}
                      icon={{
                        name: 'map',
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
                      title="Update"
                      accessibilityLabel={'fromAddress_update'}
                    />
                  )}
                </View>
              )}
            </Formik>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </Animated.View>
  );
};

export default Step1;
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
