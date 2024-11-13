import React, { useCallback, useContext, useEffect } from 'react';
import { StyleSheet, View, Dimensions, Text, Alert } from 'react-native';
import { AppContext } from '@app/context';

import { Modalize } from 'react-native-modalize';
import { responsiveWidth } from 'react-native-responsive-dimensions';
import { ThemeStatic, Typography } from '@app/theme';
import { useSelector, useDispatch } from 'react-redux';
import {
  getStripeBalance,
  stripeAccountLink,
  getUserProfile,
} from '@app/actions/login';
import * as actionType from '@app/actions/constants';
import Config from '@app/config';
import { WebView } from 'react-native-webview';
import { connectStripe, disconnectStripe } from '@app/actions/signup';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import debounce from 'lodash.debounce';
import throttle from 'lodash.throttle';
import { ActivityIndicator } from 'react-native-paper';
import WebViewConponent from './WebViewConponent';
const { width, height } = Dimensions.get('window');
const ratio = width / height;

const { FontWeights, FontSizes } = Typography;

interface BottomSheetProps {
  ref: React.Ref<any>;
  onSheetlose: () => void;
}

const RefreshUrl = () => {
  return <></>;
};

const BottomSheet: React.FC<BottomSheetProps> = React.forwardRef(
  ({ onSheetlose }, ref) => {
    const { theme } = useContext(AppContext);
    const dispatch = useDispatch();
    const { profile, loading } = useSelector((state) => state?.user);
    const { stripe_account_link } = profile || '';
    const [count, setCount] = React.useState(0);
    const [url, setUrl] = React.useState<string>();

    const BASE_URL = Config.api_base_url;
    const refreshUrl = `${BASE_URL}/stripe/refresh`;
    const successUrl = `${BASE_URL}/stripe/return`;
    const initialize = () => {};
    const _onNavigationStateChange = useCallback(
      throttle((webviewState) => {
        if (webviewState.url === refreshUrl && loading !== true) {
          

          if (count < 2) {
            dispatch(stripeAccountLink());
            setCount(count + 1);
          } else {
            setTimeout(() => {
              setCount(0);
              onSheetlose();
              Alert.alert('Server Error', "Can't connect to stripe");
            }, 1000);
          }
        } else if (webviewState.url == successUrl) {

          dispatch(connectStripe());

          let userProfile = {
            onSuccess: () => {},
            onFail: () => {},
          };

          dispatch(getUserProfile(userProfile));
          dispatch(getStripeBalance());
          dispatch(stripeAccountLink());
          onSheetlose();
        }
      }, 0),
      [count]
    );

    let content = (
      <>
        {stripe_account_link === undefined ? (
          <>
            <ActivityIndicator />
          </>
        ) : (
          <WebViewConponent
            navigation={_onNavigationStateChange}
            url={
              stripe_account_link?.url ? stripe_account_link?.url : refreshUrl
            }
          />
        )}
      </>
    );

    return (
      <Modalize
        //@ts-ignore
        ref={ref}
        scrollViewProps={{ showsVerticalScrollIndicator: false }}
        modalStyle={styles(theme).container}
      >
        {/* <ActivityIndicator/> */}
        {/* <BottomSheetHeader
        heading='Connect Stripe'
        subHeading=''
      /> */}
        <View style={styles().content}>{content}</View>
        {/* <View style={[styles(theme).subContent, { marginTop: 20, paddingBottom: 50 }]}>
        <Button
          label={"Close"}
          labelStyle={[styles().typeText, { color: ThemeStatic.white }]}
          onPress={onSheetlose}
          containerStyle={[styles().buttonStyle]}
        />
      </View> */}
      </Modalize>
    );
  }
);

const styles = (theme = {} as ThemeColors) =>
  StyleSheet.create({
    container: {
      marginTop: 50,
      padding: 20,
      backgroundColor: theme.base,
    },
    content: {
      // paddingTop: 20
      flex: 1,
    },
    subContent: {
      justifyContent: 'space-between',
      flexDirection: 'row',
    },
    typeText: {
      ...FontWeights.Bold,
      ...FontSizes.Caption,
      color: theme.text01,
      textAlign: 'center',
    },
    buttonStyle: {
      flex: 1,
      marginHorizontal: 5,
      height: 30,
      paddingVertical: 0,
    },
    label: {
      ...FontWeights.Light,
      ...FontSizes.Body,
      width: responsiveWidth(74),
      color: theme.text01,
    },
    subTitle: {
      ...FontWeights.Light,
      ...FontSizes.Body,
      width: responsiveWidth(74),
      color: theme.text01,
    },
  });

export default BottomSheet;
