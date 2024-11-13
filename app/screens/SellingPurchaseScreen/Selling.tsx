import 'intl';
import React from 'react';
import { TouchableOpacity, Platform } from 'react-native';
import { Badge, Text, View } from 'native-base';
import { ThemeColors } from '@app/types/theme';
if (Platform.OS === 'android') {
  // See https://github.com/expo/expo/issues/6536 for this issue.
  if (typeof (Intl as any).__disableRegExpRestore === 'function') {
    (Intl as any).__disableRegExpRestore();
  }
}
import 'intl/locale-data/jsonp/en';
import { useNavigation } from '@react-navigation/native';

interface FeedCardProps {
  item: any;
}
const Selling: React.FC<FeedCardProps> = ({ item }) => {
  const navigation = useNavigation();

  const { id, batch, listing, order, created, modified, shipmentid, status } =
    item;
  let map = new Map();
  map.set('a', 'Active');
  map.set('s', 'Ready To Ship');
  map.set('i', 'Label Pending');
  map.set('p', 'Label Printed');
  map.set('f', 'Label Failure');
  map.set('t', 'In Transit');
  map.set('d', 'Received');
  map.set('c', 'Canceled');
  map.set('r', 'In Return');

  let name = map.get(status);

  let data = (
    <Badge
      info
      style={{
        alignSelf: 'flex-end',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
      }}
    >
      <Text>{name}</Text>
    </Badge>
  );
  return (
    <View style={{ flex: 1 }}>
      {/* <Card> */}
      {/* <CardItem header bordered> */}
      {/* <Col> */}
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('SellingSingleScreen', {
            listingId: listing,
            orderId: id,
            orderStatus: status,
          })
        }
      >
        <Text>Order Id {order}</Text>
      </TouchableOpacity>
      {/* </Col>
          <Col> */}
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('SellingSingleScreen', {
            listingId: listing,
            orderId: id,
            orderStatus: status,
          })
        }
      >
        <Text>Listing Id {listing}</Text>
      </TouchableOpacity>
      {/* </Col> */}
      {/* </CardItem>
        <CardItem footer> */}
      {/* <Col> */}
      <Text>Created Date {created.slice(0, 10)}</Text>
      {/* </Col>
          <Col> */}
      <Text>Modified Date {modified.slice(0, 10)}</Text>
      {/* </Col> */}
      {/* </CardItem>
        <CardItem> */}
      {/* <Col> */}
      {/* <Text>Batch Id {batch}</Text> */}
      <Text>
        <Text style={{ fontWeight: 'bold' }}>Shipment ID</Text> {shipmentid}
      </Text>
      {/* </Col> */}
      {/* </CardItem> */}
      <View style={{ flexDirection: 'row-reverse' }}>
        {data}
        <Text style={{ marginTop: 5 }}>Status </Text>
      </View>
      {/* </Card> */}
    </View>
  );
};

export default Selling;
