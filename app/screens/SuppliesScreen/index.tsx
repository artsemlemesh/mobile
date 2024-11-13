import { orderSupplies } from '@app/actions/bundle';
import { ThemeStatic } from '@app/theme';
import {
  showErrorNotification,
  showSuccessNotification,
} from '@app/utils/notifications';
import { Feather } from '@expo/vector-icons';
import React from 'react';
import {
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useDispatch } from 'react-redux';
import ShippingCard from './components/ShippingCard';
import { styles } from './styles';

const SuppliesScreen: React.FC = ({ navigation, route }: any) => {
  const { navigate, goBack } = navigation;
  const dispatch = useDispatch();

  const gotoProfileScreen = () =>
    navigate('ProfileScreen', { screen: 'ProfileScreen' });

  const _onSubmit = (boxes: string[]) => {
    const data = boxes.map((box) => ({ item: box, quantity: 5 }));

    const obj = {
      data,
      onSuccess: () => {
        showSuccessNotification('Supplies Ordered Successfully');
        gotoProfileScreen();
      },
      onFail: () => {
        showErrorNotification('Failed to Order Supplies');
      },
    };
    dispatch(orderSupplies(obj));
  };

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
          <View
            style={[
              {
                marginTop: 30,
                margin: 10,
                flexDirection: 'row',
                justifyContent: 'space-between',
                padding: 10,
              },
            ]}
          >
            <TouchableOpacity
              onPress={goBack}
              style={[styles().back, styles().iconStyle]}
            >
              <Feather
                type="Feather"
                name="chevron-left"
                size={30}
                style={{ fontSize: 30, color: ThemeStatic.white }}
              />
            </TouchableOpacity>
            <Text style={[styles().titleText, { color: ThemeStatic.white }]}>
              Order More Supplies
            </Text>
            <TouchableOpacity
              onPress={gotoProfileScreen}
              style={[styles().back, styles().iconStyle]}
            >
              <Feather
                type="Feather"
                name="x"
                size={30}
                style={{ fontSize: 30, color: ThemeStatic.white }}
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
            <ShippingCard onSubmit={_onSubmit} />
          </View>
        </KeyboardAvoidingView>
      </ImageBackground>
    </View>
  );
};
export default SuppliesScreen;
