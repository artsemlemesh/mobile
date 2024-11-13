import React, { useContext, useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Image,
  FlatList,
  TouchableOpacity,
  Dimensions,
  Alert,
  Pressable,
} from 'react-native';
import {
  // Container,
  // Header,
  // Body,

  Text,
  Button,
  // Title,
  // Left,
  // Right,
  Card,
  // CardItem,
  Badge,
  Spinner,
} from 'native-base';
import { AppContext } from '@app/context';
import ListEmptyComponent from '../../layout/misc/ListEmptyComponent';
import {
  // useNavigation,
  useIsFocused,
} from '@react-navigation/native';
import { ThemeStatic, Typography } from '@app/theme';
import { ThemeColors } from '@app/types/theme';
import { useDispatch, useSelector } from 'react-redux';
import { Col, Row } from 'react-native-easy-grid';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import {
  deleteItemFromCart,
  getUserCart,
  cartCheckout,
  deleteLocalItemToCart,
} from '@app/actions/product';
import { Routes } from '@app/constants';
import { getImageUrl } from '../../utils/common';
import LoadingIndicator from '@app/layout/misc/LoadingIndicator';

import { Feather, FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { StatusBar, Box, HStack, IconButton, Icon } from 'native-base';

const { FontWeights, FontSizes } = Typography;
const screenWidth = Math.round(Dimensions.get('window').width);

const CartScreen: React.FC = ({ navigation }: any) => {
  const { theme } = useContext(AppContext);
  const dispatch = useDispatch();
  const { navigate } = navigation;
  const isFocused = useIsFocused();
  const cartData = useSelector((state) => state.cart);
  const user = useSelector((state) => state.user);
  const { carts, loading } = cartData;

  const error = false;
  const tax = 0.0;
  const [timestamp, setTimestamp] = useState('');

  useEffect(() => {
    if (
      user.profile !== null &&
      user.profile !== undefined &&
      user.profile !== ''
    ) {
      dispatch(getUserCart());
    }
    // else {
    // navigate(Routes.Auth);
    // }
  }, []);

  const onDeleteCart = (id: number) => {
    if (
      user.profile !== null &&
      user.profile !== undefined &&
      user.profile !== ''
    ) {
      dispatch(deleteItemFromCart(id));
    } else {
      let cartsFilterData = carts.filter((item) => {
        return item.listing.id !== id;
      });
      dispatch(deleteLocalItemToCart(cartsFilterData));
    }
  };

  const calculateTotal = () => {
    if (carts && !carts.detail && carts.length > 0) {
      let totalPrice =
        tax +
        carts.reduce(
          (total: number, item: any) =>
            item &&
            item.listing &&
            item.listing.buyer_price &&
            total + parseFloat(item.listing.status == 'published' ? item.listing.buyer_price : 0),
          0.0
        );

      return totalPrice.toFixed(2);
    } else {
      return 0.0;
    }
  };

  const renderItem = ({ item }) => {
    const { title } = item;
    return (
      <View
        style={{
          borderBottomColor: ThemeStatic.white,
          borderBottomWidth: 1,
          paddingHorizontal: 20,
          paddingVertical: 10,
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      >
        <Text>{title}</Text>
        <FontAwesome
          size={20}
          type="FontAwesome"
          name="remove"
          style={{ color: ThemeStatic.black, fontSize: 20 }}
        />
      </View>
    );
  };

  const renderResultItem = ({ item }) => {
    const { title } = item;
    return (
      <View
        style={{
          borderBottomColor: ThemeStatic.white,
          borderBottomWidth: 1,
          paddingHorizontal: 20,
          paddingVertical: 10,
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      >
        <Text>{title}</Text>
      </View>
    );
  };

  const checkout = async () => {
    if (carts && carts.length > 0) {
      let newArray = [];
      carts.map((item) => {
        if (item.listing.status == 'published') {
        let obj = {
          listing_pk: item.listing.id,
        };
        newArray.push(obj);
      }});

      let finalObj = {
        items: newArray,
      };
      navigate('CheckoutScreen', { carts: carts, loading: loading });
      dispatch(cartCheckout(finalObj));
    }

    // if (
    //   user.profile !== null &&
    //   user.profile !== undefined &&
    //   user.profile !== ''
    // ) {
    //   navigate(Routes.CheckoutScreen, { carts: carts });
    //   dispatch(cartCheckout());
    // } else {
    //   navigate(Routes.LoginScreen);
    // }
  };
  const RightActions = (progress, item) => {
    const scale = progress.interpolate({
      inputRange: [-100, 0],
      outputRange: [0.7, 0],
    });
    return (
      <>
        <View
          style={{
            backgroundColor: 'red',
            justifyContent: 'center',
            marginTop: 5,
            marginBottom: 5,
            marginLeft: 5,
          }}
        >
          <TouchableOpacity
            onPress={() => onDeleteCart(item.listing.id)}
            style={{ backgroundColor: 'transparent' }}
          >
            <FontAwesome
              type="FontAwesome"
              name="trash-o"
              size={30}
              style={{
                color: ThemeStatic.white,
                fontSize: 30,
                paddingHorizontal: 20,
                fontWeight: 'bold',
              }}
            />
            <Text
              style={{
                color: ThemeStatic.white,
                fontSize: 15,
                paddingHorizontal: 10,
                fontWeight: 'bold',
              }}
            >
              Delete
            </Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            backgroundColor: 'green',
            justifyContent: 'center',
            margin: 5,
          }}
        >
          <TouchableOpacity
            onPress={() =>
              navigate(Routes.ListingDetail, { data: item.listing, index: 0 })
            }
            style={{ backgroundColor: 'transparent' }}
          >
            <FontAwesome
              size={28}
              type="FontAwesome"
              name="arrow-right"
              style={{
                color: ThemeStatic.white,
                fontSize: 28,
                paddingHorizontal: 20,
              }}
            />
            <Text
              style={{
                color: ThemeStatic.white,
                fontSize: 15,
                paddingHorizontal: 15,
                fontWeight: 'bold',
              }}
            >
              View
            </Text>
          </TouchableOpacity>
        </View>
      </>
    );
  };
  const onDeleteItem = (id: number) => {
    Alert.alert(
      'Alert',
      'Are you sure you want to remove?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: () => {
            onDeleteCart(id);
          },
        },
      ],
      { cancelable: false }
    );
  };
  const renderCartItem = ({ item, index }) => {
    const { id, title, buyer_price, items, status } = item.listing;

    return (
      <>
        <Swipeable
          renderRightActions={(progress) => RightActions(progress, item)}
        >
          <Card
            style={{
              borderWidth: 1,
              shadowOpacity: 1,
              borderRadius: 10,
              shadowRadius: 12,
              marginVertical: 5,
              shadowColor: 'black',
              alignItems: 'center',
              marginHorizontal: 12,
              borderColor: 'lightgray',
              backgroundColor: 'white',
              shadowOffset: { width: 1, height: 20 },
            }}
          >
            {/* <CardItem>
              <Body> */}
            <Row>
              <Col>
                <View style={styles(theme).imageContainer}>
                  {
                    <>
                      <Badge
                        style={{
                          backgroundColor: ThemeStatic.accentLight,
                          position: 'absolute',
                          top: -12,
                          left: -5,
                          zIndex: 2,
                        }}
                      >
                        <Text style={{ color: '#333' }}>+{items.length}</Text>
                      </Badge>
                      <Image
                        key={index}
                        style={styles().paginationImageStyle}
                        source={{ uri: getImageUrl(items, true) }}
                      />
                    </>
                  }
                </View>
              </Col>
              <Col
              // onPress={() =>
              //   navigate(Routes.ListingDetail, { data: item, index: 0 })
              // }
              >
                <Text style={styles(theme).titleText}>{title}</Text>
                <Text style={styles(theme).subtitleText}>
                  {items.length} items
                </Text>
              </Col>
              <Col
                style={{
                  flex: 0.5,
                  flexDirection: 'row',
                  alignItems: 'center',
                  alignContent: 'flex-end',
                }}
              >
                <View style={{ display: 'flex', flexDirection: 'column' }}>
                  <View style={styles().xbutton}>
                    <TouchableOpacity
                      onPress={() => onDeleteItem(item.listing.id)}
                    >
                      <Text style={styles().textStyle}>X</Text>
                    </TouchableOpacity>
                  </View>
                  <View
                    style={{
                      flex: 1,
                      flexDirection: 'column',
                      marginTop: 35,
                    }}
                  >
                    <Text style={styles(theme).rowPriceText}>
                      ${parseFloat(buyer_price).toFixed(2)}
                    </Text>
                  </View>
                </View>
              </Col>
            </Row>
            {status !== 'published' && (
              <Text style={styles().errorstyle}>{'No Longer Available'}</Text>
            )}
            {/* </Body>
            </CardItem> */}
          </Card>
        </Swipeable>
      </>
    );
  };
  let summary = <View />;
  if (!error && carts?.length > 0) {
    summary = (
      <View style={{ flex: 1 }}>
        <Card
          style={{
            borderWidth: 1,
            shadowOpacity: 1,
            borderRadius: 10,
            shadowRadius: 12,
            marginVertical: 5,
            shadowColor: 'black',
            alignItems: 'center',
            marginHorizontal: 12,
            borderColor: 'lightgray',
            backgroundColor: 'white',
            shadowOffset: { width: 1, height: 20 },
          }}
        >
          {/* <CardItem bordered>
            <Body> */}
          <Row>
            <Col>
              <Text style={styles(theme).footerText}>SHIPPING</Text>
            </Col>
            <Col
              style={{
                width: 100,
                alignItems: 'flex-end',
                alignSelf: 'center',
              }}
            >
              <Text style={{ fontSize: 12, color: 'green' }}>FREE</Text>
            </Col>
          </Row>
          {/* </Body>
          </CardItem> */}
          {/* <CardItem bordered>
            <Body>
              <Row>
                <Col>
                  <Text>Tax</Text>
                </Col>
                <Col style={{ width: 100, alignItems: 'flex-end', alignSelf: 'center' }}>
                  <Text>${tax.toFixed(2)}</Text></Col>
              </Row>
            </Body>
          </CardItem> */}
          {/* <CardItem bordered>
            <Body> */}
          <Row>
            <Col>
              <Text style={styles(theme).footerText}>TOTAL</Text>
            </Col>
            <Col
              style={{
                width: 100,
                alignItems: 'flex-end',
                alignSelf: 'center',
              }}
            >
              <Text style={styles(theme).totalText}>${calculateTotal()}</Text>
            </Col>
          </Row>
          {/* </Body>
          </CardItem> */}
        </Card>
        <Button
          style={{ margin: 16, backgroundColor: '#5CB85C' }}
          full
          onPress={() => {
            checkout();
          }}
          disabled={carts && carts.length > 0 ? false : true}
        >
          <Text style={{ color: '#FFFFFF' }}>Checkout</Text>
        </Button>
      </View>
    );
  }
  return (
    <View style={{ flex: 1 }}>
      <StatusBar bg="#6E5ABA" barStyle="light-content" />
      <Box safeAreaTop bg="#6E5ABA" />
      <HStack bg="#6E5ABA" px="3" py="2" justifyContent="space-between" alignItems="center" w="100%">
        <HStack alignItems="center">
          <IconButton icon={<Icon size="sm" as={Feather} name="shopping-cart" color="white" />} />
          <Text color="white" fontSize="20" fontWeight="bold">
            Shopping Cart
          </Text>
        </HStack>
        
      </HStack>
      {/* <View style={styles().headerView}>
        <Text>{'                   '}</Text>
        <Text style={styles().headerTitle}>My Cart</Text>
        <Pressable onPress={() => checkout()}>
          <Text style={styles().headerRightContent}>Checkout</Text>
        </Pressable>
      </View> */}
      {loading ? (
        <LoadingIndicator />
      ) : (
        <FlatList
          extraData={carts.length}
          bounces={false}
          showsVerticalScrollIndicator={false}
          data={carts && carts.length > 0 ? carts : []}
          renderItem={renderCartItem}
          style={styles().container}
          ListEmptyComponent={() => (
            // Image empty cart
            <View>
              <Image source={require('../../../assets/images/empty-cart.png')} style={{alignSelf: 'center', width:'50%', aspectRatio:'1'}}/>
              <ListEmptyComponent
                placeholder="Add your first bundle!"
                placeholderStyle={styles().placeholderStyle}
                spacing={10}
              />
            </View>
          )}
          ListFooterComponent={summary}
          keyExtractor={(item) => item.listing.id.toString()}
        />
      )}
    </View>
  );
};

const styles = (theme = {} as ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      margin: 10,
      backgroundColor: theme.base,
    },
    listStyle: {},
    placeholderStyle: {},
    errorstyle: {
      alignSelf: 'center',
      color: 'red',
      fontSize: 14,
      fontWeight: '500',
    },
    imageContainer: {
      width: '100%',
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    paginationImageStyle: {
      height: screenWidth / 3,
      aspectRatio: 1,
      resizeMode: 'contain',
    },
    titleText: {
      fontSize: 16,
      color: '#444',
    },
    subtitleText: {
      fontSize: 12,
      color: theme.text02,
    },
    rowPriceText: {
      fontSize: 14,
      color: theme.accent,
    },
    footerText: {
      fontSize: 16,
      color: theme.text02,
    },
    totalText: {
      fontSize: 17,
      color: theme.accent,
    },
    xbutton: { display: 'flex', flexDirection: 'row-reverse' },
    textStyle: { fontWeight: 'bold', fontSize: 18, color: 'red' },
    headerView: {
      alignItems: 'center',
      backgroundColor: '#6E5ABA',
      height: 70,
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    headerTitle: {
      color: ThemeStatic.headerTitle,
      marginTop: 30,
      textAlign: 'center',
      alignSelf: 'center',
    },
    headerRightContent: {
      marginTop: 30,
      marginRight: 20,
      color: '#F0AD4F',
    },
  });

export default CartScreen;
