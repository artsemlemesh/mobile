import React, { useEffect, useState } from 'react';
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
import { getSellingList } from '@app/actions/bundle';

const { height } = Dimensions.get('window');
const { FontWeights, FontSizes } = Typography;

const PurchaseScreen: React.FC = ({ navigation }: any) => {
  const { navigate, goBack } = navigation;
  const dispatch = useDispatch();
  const { bundles, sellingListLoading: isRefreshing } = useSelector(
    (state) => state.bundle
  );

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    let obj = {
      onSuccess: () => setIsLoading(false),
      onFail: () => setIsLoading(false),
    };
    dispatch(getSellingList(obj));
  }, []);

  const onDetail = (item?: any, index?: number) => {
    if (item) {
      navigate('SellingDetail', { data: item, index });
    } else {
      navigate('SellingDetail', {
        data: { title: '', description: '', tags: [] },
        openCamera: true,
        loader: true,
      });
    }
  };

  const onRefresh = () => {
    dispatch(getSellingList());
  };

  let content = <ProfileScreenPlaceholder />;
  if (!isLoading) {
    content = (
      <>
        <FlatList
          data={bundles}
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
          }
          renderItem={({ item, index }) => (
            <FeedCard
              isSelling={true}
              item={item}
              key={index}
              onDetail={onDetail}
            />
          )}
          ListEmptyComponent={() => (
            <ListEmptyComponent
              placeholder="No Listed Bundles"
              placeholderStyle={styles().placeholderStyle}
              spacing={10}
            />
          )}
          keyExtractor={(item, index) => index.toString()}
        />
      </>
    );
  }

  return (
    <View style={styles().container}>
      <ProfileHeader title={'Selling Details'} goBack={goBack} />
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
    placeholderStyle: {
      ...FontSizes.Body,
    },
  });

export default PurchaseScreen;
