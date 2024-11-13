import 'intl';
import React from 'react';
import { Platform } from 'react-native';
import { Card, View } from 'native-base';
if (Platform.OS === 'android') {
  // See https://github.com/expo/expo/issues/6536 for this issue.
  if (typeof (Intl as any).__disableRegExpRestore === 'function') {
    (Intl as any).__disableRegExpRestore();
  }
}
import 'intl/locale-data/jsonp/en';

interface FeedCardProps {
  item: any;
}
const OrderDetailCard: React.FC<FeedCardProps> = ({item}) => {
  return (
    <View style={{ flex: 1 }}>
      <Card>
      </Card>
    </View>
  );
};

export default OrderDetailCard;
