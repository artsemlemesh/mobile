import { updateThenPublish } from '@app/actions/bundle';
import { connectStripe } from '@app/actions/signup';
import { AppContext } from '@app/context';
import { ThemeStatic } from '@app/theme';
import { Feather } from '@expo/vector-icons';
import React, { useContext, useRef, useState } from 'react';
import {
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  View,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import StripeConnectSheet from '../common/StripeConnectSheet';
import { InfoCard, PriceCard, ShippingCard } from './components/index';
import { IListFlowValues } from './interface';
import { styles } from './styles';

const testTags = ['tag1'];
const ListingFlow: React.FC = ({ navigation, route }: any) => {
  const { multicategory, removeMultiple } = useContext(AppContext);
  const StripeConnectSheetRef = useRef();
  // @ts-ignore
  const onStripeConnectSheetRefOpen = () =>
    StripeConnectSheetRef?.current?.open();
  // @ts-ignore
  const onStripeConnectSheetRefClose = () =>
    StripeConnectSheetRef?.current?.close();

  const user = useSelector((state) => state?.user);
  const bundlesDetails = useSelector((state) => state?.bundle?.bundlesDetails);
  const { id, profile } = user;

  const { is_stripe_connected } = profile || false;
  const dispatch = useDispatch();
  const { navigate, goBack } = navigation;
  const data = route?.params?.item ?? {};
  const itemsCount = route?.params?.itemsCount ?? 0;
  const type = route?.params?.type ?? {};
  const formData = route?.params?.formValues ?? {};
  const [step, setStep] = useState<number>(1);
  const [listingInformation, setListingInformation] = useState<IListFlowValues>(
    {
      title: type == 'edit' ? bundlesDetails.title : '',
      // tags: type == 'edit' ? data.tags : testTags,
      tags: [
        ...bundlesDetails?.tags,
        ...(multicategory && multicategory?.length > 0 ? multicategory : []),
      ],
      description: type == 'edit' ? bundlesDetails.description : '',
    }
  );

  const navigateBack = () => goBack();

  const multipleTag = (item: string[]) => {
    removeMultiple(item);
  };

  const onPublishBundle = (seller_price: number) => {
    if (profile && profile.address_line_1 === null) {
      navigate('AddressFlow');
    } else {
      if (!is_stripe_connected) {
        const data = {
          country: 'US',
        };
        dispatch(connectStripe(data));
        onStripeConnectSheetRefOpen();
      } else {
        let temp = {
          ...listingInformation,
          seller_price,
        };
        let item = {
          ...data,
          ...temp,
        };

        dispatch(updateThenPublish(item));

        multipleTag([]);
        navigateBack();
      }
    }
  };

  const _onNext = (n: number, values: any) => {
    if (listingInformation) {
      let data = { ...listingInformation, ...values };
      setListingInformation(data);
    } else {
      setListingInformation(values);
    }
    setStep(n);
  };

  let content1 = (
    <InfoCard
      step={step}
      formValues={listingInformation}
      type={type}
      onNext={_onNext}
      // onNext={() => {}}
    />
  );

  let content2 = (
    <ShippingCard step={step} setStep={setStep} onNext={_onNext} />
  );

  let content3 = (
    <PriceCard
      step={step}
      price={bundlesDetails.seller_price}
      bundleDetails={data}
      onPublish={onPublishBundle}
      itemsCount={itemsCount}
    />
  );

  return (
    <View style={styles().container}>
      <ImageBackground
        source={require('@app/assets/images/app-auth-bg.png')}
        style={styles().backgroundImage}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
          style={{ flex: 0.9, flexDirection: 'column' }}
        >
          <View style={[{ marginTop: 30, marginLeft: 10 }]}>
            <TouchableOpacity
              onPress={navigateBack}
              style={[styles().back, styles().iconStyle]}
            >
              <Feather
                type="Feather"
                name="chevron-left"
                size={30}
                style={{ fontSize: 30, padding: 10, color: ThemeStatic.white }}
              />
            </TouchableOpacity>
          </View>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {step == 1 ? content1 : step == 2 ? content2 : content3}
          </View>
        </KeyboardAvoidingView>
      </ImageBackground>
      <StripeConnectSheet
        ref={StripeConnectSheetRef}
        onSheetlose={onStripeConnectSheetRefClose}
      />
    </View>
  );
};
export default ListingFlow;
