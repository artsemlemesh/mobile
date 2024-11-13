import { getUserProfile, updateProfile } from '@app/actions/login';
import { AppContext } from '@app/context';
import { ThemeStatic } from '@app/theme';
import { Feather } from '@expo/vector-icons';
import React, { useContext, useState } from 'react';
import {
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  View,
} from 'react-native';
import { useDispatch } from 'react-redux';
import AddressDetail from '../../screens/AddressFlow/components/step1';
import AddressValidation from '../../screens/AddressFlow/components/step2';
import { ISignUpStepFirstValues } from './interface';
import { styles } from './styles';

const AddressFlow: React.FC = ({ navigation }: any) => {
  const dispatch = useDispatch();

  const { theme, themeType, updateUser } = useContext(AppContext);
  const { navigate, goBack } = navigation;
  const [loginDetailData, setLoginDetailData] =
    useState<ISignUpStepFirstValues>({
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      postalCode: '',
    });

  const [step, setStep] = useState<number>(1);
  const navigateBack = () => goBack();

  const [loading, setLoader] = useState<boolean>(false);

  const bgImage = require('@app/assets/images/app-auth-bg.png');

  const goToStep = (n: number, values: any) => {
    if (n === 3) {
      onSubmit(values);
      setLoader(true);
    }
  };

  const onSubmit = (values: any) => {
    let data = {};
    let additionalData = {
      country: 'US',
      expo_push_token: 'token',
      is_google_calendar_synced: false,
      is_stripe_connected: false,
    };
    data = { ...values, ...additionalData };
    processNewUser(data);
  };

  const processNewUser = (data: any) => {
    let profileData = {
      item: data,
      onSuccess: (res) => {
        if (res) {
          let userProfile = {
            onSuccess: () => {},
            onFail: () => {},
          };

          dispatch(getUserProfile(userProfile));
          setLoader(false);
          navigate('SuppliesScreen');
        }
      },
      onFail: () => {
        setLoader(false);
      },
    };

    dispatch(updateProfile(profileData));
  };

  const content = (
    <>
      <KeyboardAvoidingView
        behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <View style={styles(theme).content}>
          <TouchableOpacity onPress={navigateBack} style={[styles().iconStyle]}>
            <Feather
              size={30}
              type="Feather"
              name="chevron-left"
              style={{ fontSize: 30, padding: 10, color: ThemeStatic.white }}
            />
          </TouchableOpacity>
          {step == 1 && (
            <AddressDetail
              step={step}
              formValues={loginDetailData}
              onNext={goToStep}
              loading={loading}
            />
          )}
          {step == 2 && (
            <AddressValidation
              step={step}
              formValues={{
                addressLine1: 'hi',
                addressLine2: 'hi',
                city: 'hi',
                state: 'hi',
                postalCode: 'hi',
              }}
              onNext={goToStep}
            />
          )}
        </View>
      </KeyboardAvoidingView>
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

export default AddressFlow;
