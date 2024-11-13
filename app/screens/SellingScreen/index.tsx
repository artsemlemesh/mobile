import React, { useContext, useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  SafeAreaView,
  Pressable,
} from 'react-native';
import {
  // Header,
  // Icon,
  // Body,
  // Title,
  // Left,
  // Right,
  Button,
  Text,
} from 'native-base';
// import { useNavigation } from 'react-navigation-hooks';
import { AppContext } from '@app/context';
import {
  ExploreScreenPlaceholder,
  ListEmptyComponent,
  SellingScreenEmpty,
} from '@app/layout';
import FeedCard from '../common/FeedCard';
import { ThemeStatic, Typography } from '@app/theme';
import { ThemeColors } from '@app/types/theme';
import { useDispatch, useSelector } from 'react-redux';
import { createNewBundle, getSellingList } from '@app/actions/bundle';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import { StatusBar, Box, HStack, IconButton, Icon } from 'native-base';
import { BUNDLE_STATUS } from '@app/utils/constants';
import StatusFilter from './components/StatusFilter';
const { FontWeights, FontSizes } = Typography;

const SellingScreen: React.FC = ({ navigation }: any) => {
  const {
    theme,
    toggleSetOpenModal,
    videoPlayStatus,
    videoStatus,
    isBack,
    onAddBackToScreen,
    isBackToScreen,
  } = useContext(AppContext);
  const { navigate, addListener } = navigation;
  const dispatch = useDispatch();

  // @ts-ignore
  const {
    bundles,
    success,
    sellingListLoading: isRefreshing,
  } = useSelector((state) => state.bundle);
  const bundleData = useSelector((state) => state.bundle.bundleData);
  // @ts-ignore
  const initialBundle = useSelector((state) => state.bundle.initialBundle);

  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState(BUNDLE_STATUS.ALL);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    let obj = {
      onSuccess: () => setIsLoading(false),
      onFail: () => setIsLoading(false),
    };
    dispatch(getSellingList(obj));
  }, []);

  useEffect(() => {
    if (initialBundle !== null) onDetail(initialBundle, 0);
  }, [initialBundle]);

  useEffect(() => {
    const didBlurSubscription = addListener('didBlur', (payload) => {
      videoPlayStatus(false);
    });
    const willFocusSubscription = addListener('didFocus', (payload) => {
      let obj = {
        onSuccess: () => setIsLoading(false),
        onFail: () => setIsLoading(false),
      };
      dispatch(getSellingList(obj));
      videoPlayStatus(true);
    });

    // Remove the listener when you are done
    return () => {
      didBlurSubscription.remove;
      willFocusSubscription.remove;
    };
  }, []);

  const onRefresh = () => {
    dispatch(getSellingList());
  };

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

  const onNewBundle = () => {
    // navigate(Routes.ListingFlow, { data: { title: '', description: '', tags: [] }, type: 'new' });
    // dispatch(createNewBundle(temp));

    onDetail();
  };

  const onEndReachedListing = () => {
    if (bundleData?.next !== null && !isLoadingMore) {
      setIsLoadingMore(true);
      let obj = {
        url: bundleData.next,
        onSuccess: () => {
          setIsLoadingMore(false);
        },
        onFail: () => {
          setIsLoadingMore(false);
        },
      };
      dispatch(getSellingList(obj));
    }
  };

  let content = <ExploreScreenPlaceholder />;
  if (!isLoading) {
    if (bundles.length > 0) {
      content = (
        <>
          <FlatList
            refreshControl={
              <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
            }
            ListHeaderComponent={() => (
              <StatusFilter
                status={status}
                setStatus={setStatus}
                bundles={bundles}
              />
            )}
            showsVerticalScrollIndicator={false}
            data={
              status === BUNDLE_STATUS.ALL
                ? bundles
                : bundles.filter((item) => item.status === status)
            }
            renderItem={({ item }) => (
              <FeedCard
                key={item.pk}
                isSelling
                item={item}
                onDetail={onDetail}
              />
            )}
            style={styles().listStyle}
            ListEmptyComponent={() => (
              <ListEmptyComponent
                placeholder={
                  status === BUNDLE_STATUS.ALL
                    ? 'Add your first bundle!'
                    : `No ${status} bundles!`
                }
                spacing={60}
              />
            )}
            keyExtractor={(item) => item.pk?.toString()}
            onEndReached={() => onEndReachedListing()}
            onEndReachedThreshold={0.5}
            ListFooterComponent={() => (
              <View>
                {isLoadingMore && (
                  <ActivityIndicator size={'large'} color={theme.accent} />
                )}
              </View>
            )}
          />
        </>
      );
    } else {
      content = (
        <SellingScreenEmpty
          placeholder="Get selling by adding your first bundle!"
          placeholderStyle={styles().placeholderStyle}
          spacing={10}
          videoStatus={videoStatus}
        />
      );
    }
  }

  return (
    <View style={{ flex: 1 }}>
      <StatusBar bg="#6E5ABA" barStyle="light-content" />
      <Box safeAreaTop bg="#6E5ABA" />
      <HStack
        bg="#6E5ABA"
        px="3"
        py="2"
        justifyContent="space-between"
        alignItems="center"
        w="100%"
      >
        <HStack alignItems="center">
          <IconButton
            icon={<Icon size="sm" as={Feather} name="package" color="white" />}
          />
          <Text color="white" fontSize="20" fontWeight="bold">
            My bundles
          </Text>
        </HStack>
        <HStack>
          <Pressable
            onPress={() => {
              onNewBundle();
              onAddBackToScreen(true);
              isBack && isBackToScreen(false);
            }}
            style={styles().headerRightContent}
          >
            <Text style={{ color: ThemeStatic.lightBlue, alignSelf: 'center' }}>
              Create New
            </Text>
            <IconButton
              icon={
                <Icon
                  as={MaterialIcons}
                  name="open-in-new"
                  size="sm"
                  color={ThemeStatic.lightBlue}
                />
              }
            />
          </Pressable>
          {/* <IconButton icon={<Icon as={MaterialIcons} name="search" size="sm" color="white" />} />
          <IconButton icon={<Icon as={MaterialIcons} name="more-vert" size="sm" color="white" />} /> */}
        </HStack>
      </HStack>
      <View style={{ flex: 1 }}>{content}</View>
    </View>
  );
};

const styles = (theme = {} as ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.base,
    },
    contentStyle: {
      flex: 1,
      paddingHorizontal: 40,
    },
    subContent: {
      flex: 1,
      flexDirection: 'row',
    },
    centerStyle: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    postGrid: {
      flex: 1,
      marginHorizontal: 10,
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
      ...FontWeights.Bold,
      ...FontSizes.Caption,
      color: ThemeStatic.white,
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
      backgroundColor: ThemeStatic.accent,
      margin: 8,
      paddingHorizontal: 8,
      borderRadius: 10,
    },
    favoriteFilterContainer: {
      flexDirection: 'row',
      backgroundColor: ThemeStatic.accent,
      margin: 8,
      width: 98,
      borderRadius: 10,
    },
    listStyle: {
      marginBottom: 10,
    },
    placeholderStyle: {
      ...FontSizes.Body,
    },
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
      flexDirection: 'row',
    },
  });

export default SellingScreen;
