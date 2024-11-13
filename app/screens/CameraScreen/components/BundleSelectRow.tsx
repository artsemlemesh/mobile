import 'intl';
import React, { useContext } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Platform,
  Dimensions,
  Image,
  TouchableWithoutFeedback,
} from 'react-native';
import { useSelector } from 'react-redux';
import { Card, Text, Button, View, Icon, Spinner } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import { Routes } from '@app/constants';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { ThemeColors } from '@app/types/theme';
import { ThemeStatic } from '@app/theme';

import { AppContext } from '@app/context';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { IconSizes } from '@app/constants';
import {SHIPPING_TYPES} from '@app/utils/constants';


if (Platform.OS === 'android') {
  // See https://github.com/expo/expo/issues/6536 for this issue.
  if (typeof (Intl as any).__disableRegExpRestore === 'function') {
    (Intl as any).__disableRegExpRestore();
  }
}
import 'intl/locale-data/jsonp/en';
import TagDisplay from '@app/screens/common/TagDisplay';

const screenWidth = Math.round(Dimensions.get('window').width);

interface FeedCardProps {
  item: any;
  isSelling?: boolean;
  index: number;
  onBundleItemPress?: (item: any) => void;
}
const BundleSelectRow: React.FC<FeedCardProps> = ({
  item,
  isSelling,
  onBundleItemPress,
  index,
}) => {
  const { theme } = useContext(AppContext);
  const { navigate } = useNavigation();
  const options = useSelector((state) => state.shop.options);
  const { pk, title, tags, seller_price, items, shipping_type } = item;
 
  
  var formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });
  const priceFormat = formatter.format(seller_price);
  const priceOfPerItem = items.length
    ? formatter.format(seller_price / items.length)
    : formatter.format(0);

  const onDetail = (item: any) => {
    navigate('SellingScreen', {
      screen: 'SellingDetail',
      params: { data: item, index, openCamera: true },
    });
  };
  const navigateToScreen = () => {
    onDetail(item);
  };

  return (
    <TouchableOpacity onPress={navigateToScreen} activeOpacity={0.75}>
      <Card
        style={{
          borderWidth: 1,
          shadowOpacity: 1,
          borderRadius: 10,
          shadowRadius: 12,
          marginVertical: 5,
          shadowColor: 'black',
          alignItems: 'center',
          borderColor: 'lightgray',
          backgroundColor: 'white',
          shadowOffset: { width: 1, height: 20 },
        }}
      >
        {/* <CardItem header bordered> */}
        <Text style={styles(theme).titleText}>{title}</Text>
        {/* </CardItem> */}
        {/* <CardItem bordered> */}
        <>
          <View style={styles(theme).imageContainer}>
            {items.length
              ? items.map(
                  (item: any, index: number) =>
                    item.front_image_thumbnail && (
                      <Image
                        key={index}
                        style={styles().paginationImageStyle}
                        source={{ uri: item.front_image_thumbnail }}
                      />
                    )
                )
              : null}
          </View>
          <TagDisplay
            items={items}
            options={options}
            value={tags}
            onChange={(tags) => {}}
            labelExtractor={(tag) => tag}
            text={''}
            inputProps={{
              placeholder: '',
              //   returnKeyType: "done",
              placeholderTextColor: 'blue',
              //   style: styles(theme).input,
              //   onSubmitEditing: onAddTag,
            }}
            tagColor={theme.accent}
            tagTextStyle={{ fontSize: 11 }}
            tagContainerStyle={{ height: 26, borderRadius: 6 }}
            tagTextColor={theme.white}
            editable={false}
            onChangeText={(value) => setText(value)}
          />
        </>
        {/* </CardItem> */}
        {/* <CardItem footer> */}
        <Grid>
          <Col>
            <Row>
              <Text style={styles(theme).itemCountText}>
                {items.length} items{' '}
              </Text>
            </Row>
            <Row>
              <Text style={styles(theme).unitPriceText}>
                {priceOfPerItem} / item
              </Text>
              {/* <StackedBar /> */}
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
                  <Text style={styles(theme).priceText}>{priceFormat}</Text>
                </Row>
                <Row>
                  <FontAwesome5
                    name="box-open"
                    size={IconSizes.x2}
                    style={{ fontSize: 12, width: 20, color: '#119822' }}
                  />
                  <Text style={{ fontSize: 10, color: '#119822' }}>
                    {SHIPPING_TYPES[shipping_type]}
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
                  >
                    <FontAwesome5
                      name="cart-arrow-down"
                      size={IconSizes.x5}
                      style={{ color: '#FA9F42' }}
                    />
                  </Button>
                </Col>
              )}
            </Row>
          </Col>
        </Grid>
        {/* </CardItem> */}
      </Card>
    </TouchableOpacity>
  );
};

const styles = (theme = {} as ThemeColors) =>
  StyleSheet.create({
    itemCountText: {
      fontSize: 20,
      color: '#4062BB',
    },
    imageContainer: {
      width: '100%',
      flexDirection: 'row',
      flexWrap: 'wrap',
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
    },
    unitPriceText: {
      fontSize: 13,
      color: '#59C3C3',
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
    paginationImageStyle: {
      width: screenWidth / 5,
      height: screenWidth / 5,
      aspectRatio: 1,
      resizeMode: 'contain',
    },
  });
export default BundleSelectRow;
