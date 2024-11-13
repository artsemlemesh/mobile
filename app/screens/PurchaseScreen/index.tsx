import React, { useEffect } from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  Dimensions,
  RefreshControl,
} from 'react-native';
import {
  ProfileScreenPlaceholder,
  ListEmptyComponent,
  ProfileHeader,
} from '@app/layout';
import FeedCard from '../common/FeedCard';
import { ThemeStatic, Typography } from '@app/theme';
import { ThemeColors } from '@app/types/theme';
import { useDispatch, useSelector } from 'react-redux';
import { getPurchasedBundles } from '@app/actions/shop';

const { height } = Dimensions.get('window');
const { FontWeights, FontSizes } = Typography;

const PurchaseScreen: React.FC = ({ navigation }: any) => {
  const { navigate, goBack } = navigation;
  const dispatch = useDispatch();

  const data = useSelector((state) => state?.shop);
  const userId = useSelector((state) => state?.user?.profile?.id);
  const isRefreshing = useSelector((state) => state?.shop?.shopListLoading);

  useEffect(() => {
    dispatch(getPurchasedBundles(userId));
  }, []);

  const { purchasedBundles, error } = data;

  const onListingDetail = (item: any, index: number) => {
    navigate('ListingDetail', { data: item, index });
  };
  const onRefresh = () => {
    dispatch(getPurchasedBundles(userId));
  };

  let content = <ProfileScreenPlaceholder />;
  if (!error) {
    content = (
      <>
        <FlatList
          data={purchasedBundles}
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
          }
          renderItem={({ item, index }) => (
            <FeedCard
              isSelling={false}
              item={item}
              key={index}
              onFavorite={() => {}}
              onAddCart={() => {}}
              onDetail={onListingDetail}
            />
          )}
          style={styles().listStyle}
          ListEmptyComponent={() => (
            <ListEmptyComponent
              placeholder="No Purchased Bundles"
              placeholderStyle={styles().placeholderStyle}
              spacing={10}
            />
          )}
          keyExtractor={(item, index) => index.toString()}
          // Need to add back
          // onEndReached={() => dispatch(getShopList())}
          // onEndReachedThreshold={0.1}
        />
      </>
    );
  }
  return (
    <View style={styles().container}>
      <ProfileHeader title={'Purchase History'} goBack={goBack} />
      <View style={styles().container}>{content}</View>
    </View>
  );
};

const styles = (theme = {} as ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.base,
    },
    subContent: {
      flex: 1,
      flexDirection: 'row',
    },
    centerStyle: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    avatarImage: {
      width: 100,
      height: 100,
      borderRadius: 50,
    },
    countText: {
      ...FontWeights.Bold,
      ...FontSizes.Label,
      color: theme.text01,
      textAlign: 'center',
    },
    typeText: {
      ...FontWeights.Regular,
      ...FontSizes.Caption,
      color: ThemeStatic.black,
      textAlign: 'center',
    },
    buttonStyle: {
      flex: 1,
      marginHorizontal: 5,
      height: 30,
      paddingVertical: 0,
    },
    aboutStyle: {
      height: 80,
      backgroundColor: ThemeStatic.accent,
      marginTop: 20,
      borderRadius: 10,
      flexDirection: 'column',
      justifyContent: 'flex-start',
      padding: 10,
    },
    navbarFilter: {
      color: ThemeStatic.accent,
      fontSize: 26,
    },
    fitlerItemContainer: {
      flexDirection: 'row',
      backgroundColor: ThemeStatic.accentLight,
      marginHorizontal: 3,
      marginVertical: 9,
      paddingHorizontal: 0,
      borderRadius: 10,
    },
    fitlerItemContainerClose: {
      flexDirection: 'row',
      backgroundColor: ThemeStatic.secondaryLight,
      marginHorizontal: 3,
      marginVertical: 9,
      paddingHorizontal: 0,
      borderRadius: 10,
    },
    favoriteFilterContainer: {
      flexDirection: 'row',
      backgroundColor: ThemeStatic.accentLight,
      margin: 8,
      width: 98,
      borderRadius: 10,
    },
    listStyle: {
      marginBottom: height * 0.087,
      // height: height - 130
    },
    placeholderStyle: {
      ...FontSizes.Body,
    },
  });

export default PurchaseScreen;
