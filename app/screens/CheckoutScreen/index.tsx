import React from 'react';
import { View } from 'react-native';
import { StatusBar, Box } from 'native-base';
import { useDispatch, useSelector } from 'react-redux';
import Config from '@app/config';
import WebView from 'react-native-webview';
import { showErrorNotification } from '@app/utils/notifications';
import {
  deleteItemFromCart,
  deleteLocalItemToCart,
} from '@app/actions/product';
import { getPurchasedBundles, setFinishedCheckout } from '@app/actions/shop';

const CheckoutScreen: React.FC = ({ navigation }: any) => {
  const dispatch = useDispatch();
  const { navigate } = navigation;
  //@ts-ignore
  const { checkouts, carts } = useSelector((state) => state.cart);
  const handleChange = (e) => {
    if (e.loading === false && e.url === checkouts.data.success_url) {

      if (carts && carts.listing && carts.listing.id > 0) {
        carts?.map((items) => {
          return dispatch(deleteItemFromCart(items.listing.id));
        });
        dispatch(getPurchasedBundles());
      }
      dispatch(setFinishedCheckout(true));
      dispatch(deleteLocalItemToCart([]));
      navigate('PaymentSuccess');
    } else if (!e.loading && e.url === checkouts.data.failure_url) {
      showErrorNotification('Payment failed');
      navigate('CartScreen');
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <StatusBar bg="#6E5ABA" barStyle="light-content" />
      <Box safeAreaTop bg="#6E5ABA" />

      <View style={{ flex: 1 }}>
        {Object.keys(checkouts).length > 0 &&
          checkouts?.data.stripe_session_id && (
            <WebView
              originWhitelist={['*']}
              source={{
                uri: `${Config.api_base_url}/checkout/?sessionId=${checkouts.data.stripe_session_id}`,
              }}
              onNavigationStateChange={handleChange}
            />
          )}
      </View>
    </View>
  );
};

export default CheckoutScreen;
