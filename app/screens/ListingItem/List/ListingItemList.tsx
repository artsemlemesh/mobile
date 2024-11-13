import React, { useContext, useRef, useEffect, useState } from 'react';
import {
  // Image,
  // Platform,
  StyleSheet,
  // TouchableOpacity,
  View,
  // FlatList,
  Dimensions,
  // ImageBackground,
  Alert,
  // ListView,
} from 'react-native';
// import TagInput from 'react-native-tag-input';
import { Button, Text, Card } from 'native-base';
import { ProfileScreenPlaceholder } from '@app/layout';
import { Col, Row, Grid } from 'react-native-easy-grid';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import { useNavigation, useNavigationParam } from 'react-navigation-hooks';
import { AppContext } from '@app/context';
import { ThemeColors } from '@app/types/theme';
import { ThemeStatic, Typography } from '@app/theme';
import { useDispatch, useSelector } from 'react-redux';
import { ScrollView } from 'react-native-gesture-handler';
import { getSellingDetail, deleteBundle } from '@app/actions/bundle';
import { Routes } from '@app/constants';
import { ListingItemRow } from '../components';
import { Feather, FontAwesome5 } from '@expo/vector-icons';

const screenWidth = Math.round(Dimensions.get('window').width);
const screenHeight = Math.round(Dimensions.get('window').height);

const ListingItemList: React.FC = ({ route, navigation }: any) => {
  const { navigate, goBack } = navigation;
  const { theme, toggleSetOpenModal } = useContext(AppContext);
  const { bundleId } = route?.params || '';
  const bundles = useSelector((state) => state?.bundle?.bundles);
  const getBundle = (id) => {
    const getBundles = bundles.filter((l) => l.pk == id);
    if (getBundles.length !== 0) return getBundles[0];
  };
  const bundle = getBundle(bundleId);
  if (!bundle) {
    console.log('When can this case happen?');
  }

  const { pk, title, description, tags, selling_price, status, items } =
    bundle || '';
  // const { pk, title, description, tags, selling_price, status, items } = bundle;
  const dispatch = useDispatch();

  useEffect(() => {}, []);

  const onDeleteListing = () => {
    Alert.alert(
      'Alert',
      'Are you sure?',
      [
        {
          text: 'Ask me later',
          onPress: () => console.log('Ask me later pressed'),
        },
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: () => {
            () => goBack();
            deleteListing();
          },
        },
      ],
      { cancelable: false }
    );
  };
  const deleteListing = () => {
    dispatch(deleteBundle(bundleId));
  };

  const onEditListingItem = () => {
    navigate('ListingFlow', { item: bundle, type: 'edit' });
  };

  const listingSummaryContent = (
    <Card>
      {/* <CardItem header> */}
      <Feather
        onPress={() => goBack()}
        type="Feather"
        size={30}
        name="chevron-left"
        style={{ fontSize: 30, padding: 5, color: ThemeStatic.accent }}
      />
      <Text>{title}</Text>
      {/* </CardItem> */}
      {/* <CardItem> */}
      {/* <Body> */}
      <Text>{description}</Text>
      {/* </Body> */}
      {/* </CardItem> */}
    </Card>
  );

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <ScrollView>
          <View>
            {listingSummaryContent}
            <Card>
              {/* <CardItem header> */}
              <Text>Items Breakdown</Text>
              {/* </CardItem> */}
              {/* <CardItem> */}
              {/* <Body> */}
              {items?.map((item: any) => (
                <ListingItemRow listingId={bundleId} item={item} />
              ))}
              {/* </Body> */}
              {/* </CardItem> */}
            </Card>
          </View>
        </ScrollView>
      </View>
      <View style={{ height: 60, backgroundColor: theme.base }}>
        <Row style={styles().bottomButton}>
          <Button danger iconLeft onPress={onDeleteListing}>
            <FontAwesome5
              style={{ fontSize: 16 }}
              type="FontAwesome5"
              name="trash-alt"
              size={16}
            />
            <Text>Delete Listing</Text>
          </Button>
          <Button info iconLeft onPress={onEditListingItem}>
            <FontAwesome5
              style={{ fontSize: 16 }}
              type="FontAwesome5"
              name="edit"
              size={16}
            />
            <Text>Edit Listing</Text>
          </Button>
        </Row>
      </View>
    </View>
  );
};

const styles = (theme = {} as ThemeColors) =>
  StyleSheet.create({
    bottomButton: {
      // marginTop: 50,
      alignItems: 'center',
      justifyContent: 'space-evenly',
    },
    iconStyle: {
      justifyContent: 'center',
      alignItems: 'center',
      position: 'absolute',
      //
      width: 34,
      height: 34,
      zIndex: 99,
    },
    share: {
      right: 12,
      top: 15,
    },
    back: {
      left: 10,
      top: 15,
    },
  });

export default ListingItemList;
