import React, { useCallback, useEffect, useState } from 'react';
import {
  Text,
  View,
  Image,
  StyleSheet,
  Linking,
  ScrollView,
  Dimensions,
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import Modal from 'react-native-modal';

import {
  // Header,
  // Body,
  Icon,
  Button,
  // Title,
  // Left,
  // Right,
  Container,
  // CardItem,
  // Col,
} from 'native-base';
import { ProfileScreenPlaceholder } from '@app/layout';
import { ThemeStatic } from '@app/theme';

import { useDispatch, useSelector } from 'react-redux';
import {
  getSingleListingDetail,
  confirmOrder,
  cancelOrder,
  orderDetailList,
} from '@app/actions/shop';
import { Colors } from 'react-native-paper';
import {
  cancelOrderNotification,
  confirmOrderNotification,
} from '@app/utils/notifications';
import { Feather } from '@expo/vector-icons';

const SellingSingleDetail: React.FC = ({ navigation, route }: any) => {
  const dispatch = useDispatch();
  const { listingId, orderId, orderStatus } = route.params;

  const data = useSelector((state) => state.shop);

  const { goBack } = navigation;
  const [reason, setReason] = useState<boolean>();
  const [reloading, setReloading] = useState<boolean>(false);
  const [confirm, setConfirm] = useState<boolean>(false);
  const [reasonData, setReasonData] = useState<string>();
  useEffect(() => {
    dispatch(getSingleListingDetail(listingId));
  }, [listingId]);

  useEffect(() => {
    dispatch(getSingleListingDetail(listingId));
  }, []);

  const sellerConfirmOrder = () => {
    dispatch(confirmOrder(orderId));
    confirmOrderNotification();
    setConfirm(true);
    setTimeout(() => {
      goBack();
    }, 2000);
  };
  useEffect(
    useCallback(() => {
      dispatch(orderDetailList());
      setReloading(false);
      setConfirm(false);
    }, [reloading])
  );
  const sellerCancelOrder = () => {
    dispatch(cancelOrder(orderId, reasonData));
    cancelOrderNotification();
    setReloading(true);
    setTimeout(() => {
      goBack();
    }, 2000);
  };

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

  let name = map.get(orderStatus);

  const { getDetailData, error } = data;
  let header = <ProfileScreenPlaceholder />;
  if (!error) {
    header = (
      <>
        {/* <Header
          style={{ backgroundColor: ThemeStatic.headerBackground }}
          androidStatusBarColor={ThemeStatic.accent}
        > */}
        {/* <Left style={{ flex: 1 }}> */}
        <Button transparent>
          <Feather
            onPress={() => goBack()}
            type="Feather"
            name="chevron-left"
            size={30}
            style={{ fontSize: 30, padding: 10, color: ThemeStatic.white }}
          />
        </Button>
        {/* </Left> */}
        {/* <Body
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
          > */}
        {/* <Title style={{ color: ThemeStatic.headerTitle }}>
              Order Details
            </Title> */}
        <Text style={{ color: ThemeStatic.headerTitle }}>Order Details</Text>
        {/* </Body>
          <Right style={{ flex: 1 }} />
        </Header> */}
      </>
    );
  }

  return (
    <Container>
      <View>{header}</View>
      {getDetailData.length === 0 ? (
        <View>
          <ActivityIndicator />
        </View>
      ) : (
        <ScrollView>
          <View>
            {/* <Card> */}
            {/* <CardItem> */}
            <View>
              <Image
                source={{ uri: getDetailData.items[0].images[0].image_large }}
                style={Styles.image}
              />
            </View>
            {/* </CardItem> */}
            {/* <CardItem header bordered> */}
            {/* <Col> */}
            <Text>Listing ID {getDetailData.id}</Text>
            {/* </Col> */}
            {/* <Col> */}
            <Text>Title {getDetailData.title}</Text>
            {/* </Col> */}
            {/* </CardItem> */}

            {getDetailData.shipments.length === 0 ||
            getDetailData.shipments[0].tracker === null ? (
              <View>
                <Text style={{ alignSelf: 'center' }}>No Tracking Details</Text>
              </View>
            ) : (
              <View>
                {/* <CardItem> */}
                <Text>
                  {' '}
                  Tracking Code:{' '}
                  {getDetailData.shipments[0].tracker.tracking_code}
                </Text>
                {/* </CardItem> */}
                {/* <CardItem> */}
                <Text>
                  {' '}
                  Shipment Status:{' '}
                  {
                    getDetailData.shipments[0].tracker.tracking_details.slice(
                      -1
                    )[0].status
                  }
                </Text>
                {/* </CardItem> */}
                {/* <CardItem> */}
                <Text>
                  {' '}
                  Shipment Source:{' '}
                  {
                    getDetailData.shipments[0].tracker.tracking_details.slice(
                      -1
                    )[0].source
                  }
                </Text>
                {/* </CardItem> */}
                {/* <CardItem> */}
                <Text>
                  {' '}
                  Tracking Status Detail:{' '}
                  {
                    getDetailData.shipments[0].tracker.tracking_details.slice(
                      -1
                    )[0].status_detail
                  }
                </Text>
                {/* </CardItem> */}
                {/* <CardItem> */}
                <Text>
                  {' '}
                  Zip Code:{' '}
                  {
                    getDetailData.shipments[0].tracker.tracking_details.slice(
                      -1
                    )[0].tracking_location.zip
                  }
                </Text>
                {/* </CardItem> */}
                {/* <CardItem> */}
                <Text>
                  {' '}
                  City:{' '}
                  {
                    getDetailData.shipments[0].tracker.tracking_details.slice(
                      -1
                    )[0].tracking_location.city
                  }
                </Text>
                {/* </CardItem> */}
                {/* <CardItem> */}
                <Text>
                  {' '}
                  State:{' '}
                  {
                    getDetailData.shipments[0].tracker.tracking_details.slice(
                      -1
                    )[0].tracking_location.state
                  }
                </Text>
                {/* </CardItem> */}
                {/* <CardItem> */}
                <Text>
                  {' '}
                  Country:{' '}
                  {
                    getDetailData.shipments[0].tracker.tracking_details.slice(
                      -1
                    )[0].tracking_location.country
                  }
                </Text>
                {/* </CardItem> */}

                <Text> {'   '}Tracking Url </Text>
                {/* <CardItem> */}
                <Text
                  style={Styles.links}
                  onPress={() => {
                    Linking.openURL(
                      getDetailData.shipments[0].tracker.tracking_url
                    );
                  }}
                >
                  {getDetailData.shipments[0].tracker.tracking_url}
                </Text>
                {/* </CardItem> */}
                <Text> Shipment Label: </Text>
                {/* <CardItem> */}
                <Text
                  style={Styles.links}
                  onPress={() => {
                    Linking.openURL(getDetailData.shipments[0].label_url);
                  }}
                >
                  {' '}
                  {getDetailData.shipments[0].label_url}
                </Text>
                {/* </CardItem> */}
              </View>
            )}
            {orderStatus == 'c' || orderStatus == 'd' || orderStatus == 't' ? (
              <View style={Styles.text}>
                <Text>Your order has been {name}</Text>
              </View>
            ) : (
              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}
              >
                <TouchableOpacity
                  style={Styles.btn}
                  onPress={sellerConfirmOrder}
                >
                  <Text>Confirm order</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={Styles.btn}
                  onPress={() => {
                    setReason(true);
                  }}
                >
                  <Text>Cancel order</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
          {/* </Card> */}
          <Modal
            isVisible={reason}
            style={{
              backgroundColor: 'white',
              height: 200,
              flex: 0,
              marginTop: 200,
              marginLeft: 28,
              borderRadius: 16,
            }}
          >
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <View>
                <Text>Give us the Reason for cancelling the order</Text>
                <TextInput
                  style={{
                    height: 42,
                    backgroundColor: 'white',
                    paddingLeft: 10,
                    borderRadius: 6,
                    fontSize: 12,
                    borderWidth: 1,
                    marginBottom: 10,
                    marginTop: 10,
                    color: 'black',
                  }}
                  onChangeText={setReasonData}
                  value={reasonData}
                  placeholder="Enter the Reason Here"
                  keyboardType="default"
                />
              </View>
              <View style={Styles.btn}>
                <TouchableOpacity
                  // style={}
                  onPress={() => {
                    setReason(!reason);
                    sellerCancelOrder();
                  }}
                >
                  <Text style={{ color: 'black' }}>Confirm Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </ScrollView>
      )}
    </Container>
  );
};

const Styles = StyleSheet.create({
  links: { color: '#027ebf' },
  image: {
    width: Dimensions.get('window').width - 20,
    height: 200,
    right: 8,
  },
  btn: {
    height: 40,
    width: '40%',
    backgroundColor: Colors.blue200,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    marginHorizontal: 25,
    marginVertical: 10,
  },
  text: {
    height: 40,
    width: '80%',
    backgroundColor: Colors.blue200,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: 15,
    marginHorizontal: 30,
    marginVertical: 10,
  },
});

export default SellingSingleDetail;
