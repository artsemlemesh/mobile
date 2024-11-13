import 'intl';
import React, { Component, useContext, useState } from 'react';
import { StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Card, Text, Button, Badge, View } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { ThemeColors } from '@app/types/theme';
import { ThemeStatic } from '@app/theme';

import { AppContext } from '@app/context';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { IconSizes } from '@app/constants';
import FeedCarousel from '../../common/FeedCarousel';
import { useDispatch, useSelector } from 'react-redux';
if (Platform.OS === 'android') {
  if (typeof (Intl as any).__disableRegExpRestore === 'function') {
    (Intl as any).__disableRegExpRestore();
  }
}
import 'intl/locale-data/jsonp/en';
import TagDisplay from '../../../../app/screens/common/TagDisplay';

interface FeedCardProps {
  item: any;
  isSelling?: boolean;
  onAddCart?: (item: any) => void;
  onFavorite?: (item: any) => void;
  onDetail: (item: any, index: number) => void;
}
const FeedCard: React.FC<FeedCardProps> = ({
  item,
  isSelling,
  onDetail,
  onAddCart,
  onFavorite,
}) => {
  const { theme } = useContext(AppContext);
  const [isFavorited, setFavorited] = useState(false);
  const { title, buyer_price, tags, items, seller_price, status } = item;
  const price = isSelling ? seller_price : buyer_price;
  var formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });
  const priceFormat = formatter.format(price);
  const priceOfPerItem = items?.length
    ? formatter.format(price / items?.length)
    : formatter.format(0);
  const navigateToScreen = (index) => {
    onDetail(item, index);
  };
  const addFavorite = () => {
    onFavorite(item);
    setFavorited(!isFavorited);
  };

  const options = useSelector((state) => state.shop.options);

  const badgeStatus = (status) => {
    switch (status) {
      case 'draft':
        return (
          <View
            style={{
              alignSelf: 'flex-end',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#62B1FC',
              borderRadius: 13,
            }}
          >
            <Text
              style={{
                color: 'white',
                paddingHorizontal: 10,
                paddingVertical: 3,
              }}
            >
              {status}
            </Text>
          </View>
        );
      case 'published':
        return (
          <View
            style={{
              alignSelf: 'flex-end',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#119822',
              borderRadius: 13,
            }}
          >
            <Text
              style={{
                color: 'white',
                paddingHorizontal: 10,
                paddingVertical: 3,
              }}
            >
              {status}
            </Text>
          </View>
        );
      default:
        return (
          <View
            style={{
              alignSelf: 'flex-end',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#458845',
              borderRadius: 13,
            }}
          >
            <Text
              style={{
                color: 'white',
                paddingHorizontal: 10,
                paddingVertical: 3,
              }}
            >
              {status}
            </Text>
          </View>
        );
    }
  };

  return (
    <View
      style={{
        flex: 1,
      }}
    >
      <Card
        style={{
          // elevation: 12,
          borderWidth: 1,
          shadowOpacity: 1,
          borderRadius: 10,
          shadowRadius: 12,
          marginVertical: 5,
          shadowColor: 'black',
          // alignItems: 'center',
          marginHorizontal: 12,
          borderColor: 'lightgray',
          backgroundColor: 'white',
          shadowOffset: { width: 1, height: 20 },
        }}
      >
        {/* <Col> */}
        <View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <View
                style={{
                  marginRight: 10,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: ThemeStatic.accent,
                  borderRadius: 20,
                  height: 25,
                  width: 25,
                }}
              >
                <Text
                  style={{
                    // paddingHorizontal: 8,
                    // paddingVertical: 2,
                    color: '#FFFFFF',
                    fontSize: 16,
                    alignSelf: 'center',
                  }}
                  onPress={(i) => navigateToScreen(0)}
                >
                  {items.length}
                </Text>
              </View>
              <Text
                style={{
                  maxWidth: 210,
                  // marginLeft: 10,
                  marginRight: 22,
                  fontWeight: '500',
                  padding: 5,
                  fontSize: 16,
                }}
                onPress={(i) => navigateToScreen(0)}
                accessibilityLabel={`${title}`}
              >
                {title}
              </Text>
            </View>
            {isSelling && <View style={{}}>{badgeStatus(status)}</View>}
          </View>
        </View>
        {/* <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text
            onPress={(i) => navigateToScreen(0)}
            style={[
              styles(theme).titleText,
              { maxWidth: 220, fontWeight: '700' },
            ]}
            accessibilityLabel={`${title}`}
          >
            {title}
          </Text>
          {isSelling && <Col>{badgeStatus(status)}</Col>}
        </View> */}
        {/* </Col> */}
        <FeedCarousel items={items} onPress={(i) => navigateToScreen(i)} />
        <TagDisplay
          items={items}
          options={options}
          value={tags}
          onChange={(tags) => {}}
          labelExtractor={(tag) => tag}
          text={''}
          inputProps={{
            placeholder: '',

            placeholderTextColor: 'blue',
          }}
          tagColor={theme.accent}
          tagTextStyle={{ fontSize: 12 }}
          tagContainerStyle={{ height: 26, borderRadius: 6 }}
          tagTextColor={theme.white}
          editable={false}
          onChangeText={(value) => setText(value)}
        />
        <Grid>
          <Col>
            <Row>
              <Text
                style={styles(theme).itemCountText}
                accessibilityLabel={`${items?.length}item_feedCard`}
              >
                {items?.length} items{' '}
              </Text>
            </Row>
            <Row>
              <Text
                style={styles(theme).unitPriceText}
                accessibilityLabel={`${priceOfPerItem}item_feedCard`}
              >
                {priceOfPerItem} / item
              </Text>
            </Row>
          </Col>
          <Col>
            <Row>
              <Col
                style={{
                  alignItems: 'flex-end',
                  alignSelf: 'flex-end',
                }}
              >
                <Row>
                  <Text
                    style={styles(theme).priceText}
                    accessibilityLabel={`${priceFormat}_feedCard`}
                  >
                    {priceFormat}
                  </Text>
                </Row>
                <Row>
                  <FontAwesome5
                    name="shipping-fast"
                    size={IconSizes.x2}
                    style={{ fontSize: 12, width: 20, color: '#119822' }}
                  />
                  <Text
                    style={{ fontSize: 10, color: '#119822' }}
                    accessibilityLabel={'freeShip_feedCard'}
                  >
                    FREE SHIPPING
                  </Text>
                </Row>
              </Col>
              {!isSelling && (
                <Col
                  style={{
                    alignItems: 'flex-end',
                    alignSelf: 'flex-end',
                    width: 50,
                  }}
                >
                  <Button
                    onPress={() => onAddCart(item)}
                    block
                    bordered
                    style={{
                      width: 40,
                      marginLeft: 10,
                      alignSelf: 'flex-end',
                      backgroundColor: ThemeStatic.white,
                      borderColor: ThemeStatic.translucent,
                    }}
                    accessibilityLabel={'addToCart_feedCard'}
                  >
                    <FontAwesome5
                      name="cart-arrow-down"
                      size={IconSizes.x5}
                      style={{ fontSize: 15, color: '#FA9F42' }}
                    />
                  </Button>
                </Col>
              )}
            </Row>
          </Col>
        </Grid>
      </Card>
    </View>
  );
};

const styles = (theme = {} as ThemeColors) =>
  StyleSheet.create({
    itemCountText: {
      fontSize: 20,
      color: '#4062BB',
      marginTop: 10,
    },
    tagTextColor: {
      color: '#f9c',
    },
    userRating: {
      fontSize: 10,
      color: 'green',
    },
    priceText: {
      fontSize: 20,
      textAlign: 'right',
      color: theme.accent,
      fontWeight: '600',
    },
    unitPriceText: {
      fontSize: 13,
      fontWeight: '500',
      color: theme.lightBlue,
    },
    titleText: {
      fontSize: 14,
      color: 'black',
      textAlign: 'left',
      alignSelf: 'flex-start',
    },
    tinyLogo: {
      width: 64,
      height: 64,
    },
  });

export default FeedCard;
