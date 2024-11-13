import React, { useContext, useRef, useEffect, useState } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  FlatList,
  Dimensions,
  Alert,
  ActivityIndicator,
  ImageBackground,
  Pressable,
  Modal,
  SectionList,
} from 'react-native';

import {
  BOTTOM_SHEET_TYPE,
  BUNDLE_STATUS,
  BUTTON_LABEL,
  ERROR_MESSAGE,
  SHIPPING_TYPES,
  MINUMUM_ITEMS_IN_BUNDLE,
} from '@app/utils/constants';
import { Text, Card, Badge, Spinner, Button } from 'native-base';
import { ProfileScreenPlaceholder } from '@app/layout';
import { LeftArrow } from '../../utils/commonFuntions';
import { AppContext } from '@app/context';
import { ThemeColors } from '@app/types/theme';
import { ThemeStatic } from '@app/theme';
import { EvilIcons, FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import {
  getSellingDetail,
  deleteBundle,
  unpublishBundle,
  addItem,
  deleteItem,
  updateItem,
  removeBackground,
  listingImageID,
  poolForRemoveBackground,
  emptyRemoveBackgroundState,
} from '@app/actions/bundle';
import { IconSizes } from '@app/constants';

import {
  SellingDetailBottomSheet,
  CameraBottomSheet,
  ImagePreviewScreen,
} from './components';
import StripeConnectSheet from '../common/StripeConnectSheet';
import {
  showErrorNotification,
  showSuccessNotification,
} from '@app/utils/notifications';
import TagDisplay from '@app/screens/common/TagDisplay';
import { getImageUrl, isIphoneX } from '../../utils/common';

import { StatusBar, Box, HStack } from 'native-base';
import ImageViewer from 'react-native-image-zoom-viewer';
import { ItemsCarousel } from '../../components';
import ImageWithSkeleton from '@app/utils/react-native-images-collage/ImageWithSkeleton';

const imageTimeInterval = 2000;
const screenWidth = Math.round(Dimensions.get('window').width);

const SellingDetail: React.FC = ({ navigation, route }: any) => {
  const { navigate, goBack } = navigation;

  const data = route.params?.data ?? {};
  const index = route.params?.index ?? 0;
  let isOpenCamera = route.params?.openCamera ?? false;

  const isNewItem = route.params?.isNewItem ?? false;

  // @ts-ignore
  const bundles = useSelector((state) => state.bundle.bundles);

  // @ts-ignore
  const loading = useSelector((state) => state.bundle.sellingListLoading);
  // @ts-ignore
  const user = useSelector((state) => state.user);
  // @ts-ignore
  const { bundlePublished, bundlePublishError } = useSelector(
    (state: any) => state.bundle
  );
  const { theme, toggleSetOpenModal } = useContext(AppContext);
  const { options, errorFilter } = useSelector((state) => state.shop);

  const bundlesDetails = useSelector((state) => state.bundle.bundlesDetails);

  const removeBackgroundState = useSelector((state) => state.removeBackground);

  const { profile } = user;
  const { pk, tags, videoStatus } = data;
  const loader = route.params?.loader;

  const getBundle = (id) => {
    const getBundles = bundles.filter((l: any) => {
      return l.pk == id;
    });
    if (getBundles.length !== 0) return getBundles[0];
    return { items: [] };
  };
  const [imageLoading, setImageLoading] = useState(false);

  useEffect(() => {
    if (loader) setImageLoading(true);
  }, [loader]);

  const detailData = getBundle(data && data.pk ? pk : '');
  const { items } = detailData;

  const BottomSheetRef = useRef<any>();
  const [bottomSheetType, setBottomSheetType] = useState<string>('');
  const [imageSide, setImageSide] = useState<string>('FRONT');
  const [frontImage, setFrontImage] = useState<any>(null);
  const [candidateImage, setCandidateImage] = useState<any>(null);
  const [candidateImageRB, setCandidateImageWithRB] = useState<any>(null);
  const [backImage, setBackImage] = useState<any>(null);
  const [activeIndex, setActiveIndex] = useState<number>(index);
  const [isPublished, setPublish] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [openCamera, setOpenCamera] = useState<boolean>(false);
  const [imageZoom, setImageZoom] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);
  const [zoomItem, setZoomItem] = useState({});
  const [loadingRemoveBackground, setloadingRemoveBackground] = useState(false);
  const [imageLoader, setImageLoader] = useState<boolean>(false);
  const dispatch = useDispatch();
  const onSheetOpen = () => BottomSheetRef.current.open();
  const onSheetlose = () => BottomSheetRef.current.close();

  const StripeConnectSheetRef = useRef<any>();
  const onStripeConnectSheetRefOpen = () =>
    StripeConnectSheetRef.current.open();

  const onStripeConnectSheetRefClose = () =>
    StripeConnectSheetRef.current.close();

  const CameraSheetRef = useRef<any>();
  const onCameraSheetRefOpen = () => CameraSheetRef.current.open();
  const onCameraSheetRefClose = () => {
    CameraSheetRef.current.close();
    setOpenCamera(false);
  };

  const ImagePreviewRef = useRef<any>();
  const onImagePreviewOpen = () => ImagePreviewRef.current.open();
  const onImagePreviewClose = () => ImagePreviewRef.current.close();
  const modalClose = () => {
    onStripeConnectSheetRefClose();
  };

  const [selectedItem, setselectedItem] = useState<any>();
  const navigateBack = () => {
    setImageLoading(false);
    goBack();
  };

  const timeClearImage = useRef<any>(null);

  var formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });

  const priceFormat = formatter.format(bundlesDetails.seller_price || 0);
  const priceOfPerItem = items.length
    ? formatter.format(bundlesDetails.seller_price / items.length)
    : formatter.format(0);

  const initialize = async () => {
    if (pk) {
      dispatch(getSellingDetail(pk));
    }
  };

  useEffect(() => {
    initialize();
  }, []);

  useEffect(() => {
    if (route.params?.openCamera) {
      setOpenCamera(true);
    }
  }, [route.params]);

  useEffect(() => {
    if (openCamera) {
      setOpenCamera(false);
      onCameraSheetRefOpen();
    }
    if (items.length > 0) setselectedItem(items[index]);
    if (isNewItem) {
      onNewItem();
    }
  }, [items, openCamera]);

  useEffect(() => {
    bundlesDetails &&
    bundlesDetails.status &&
    bundlesDetails.status === BUNDLE_STATUS.PUBLISHED
      ? setPublish(true)
      : setPublish(false);
  }, [bundlesDetails]);

  useEffect(() => {
    if (!bundlePublished && bundlePublishError) {
      showErrorNotification(bundlePublishError);
      setPublish(false);
    }
    if (bundlePublished) {
      showSuccessNotification('Bundle Published');
    }
  }, [bundlePublished, bundlePublishError]);

  const onSnaptoIndex = (index: number) => {
    setActiveIndex(index);
  };

  const onDeleteBundle = () => {
    Alert.alert(
      'Delete Bundle',
      'This action cannot be undone. Are you sure?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: deleteBundleByID,
        },
      ],
      { cancelable: false }
    );
  };

  const deleteBundleByID = (): void => {
    dispatch(deleteBundle(pk));
    navigateBack();
  };

  const onEdit = () => {
    if (
      bundlesDetails?.status &&
      [BUNDLE_STATUS.PUBLISHED, BUNDLE_STATUS.SOLD].includes(
        bundlesDetails.status
      )
    ) {
      if (bundlesDetails.status === BUNDLE_STATUS.PUBLISHED)
        showErrorNotification(ERROR_MESSAGE.BUNDLE_PUBLISHED);
      if (bundlesDetails.status === BUNDLE_STATUS.SOLD)
        showErrorNotification(ERROR_MESSAGE.BUNDLE_SOLD);
      return;
    }
    setBottomSheetType(BOTTOM_SHEET_TYPE.EDIT);
    if (items.length === 1) {
      setselectedItem(items[0]);
    } else {
      setselectedItem(items[activeIndex]);
    }
    onSheetOpen();
  };

  const onNewItem = () => {
    setBottomSheetType(BOTTOM_SHEET_TYPE.NEW);
    setselectedItem(items[activeIndex]);
    onSheetOpen();
  };

  const clearImageData = (pk: any, itemId: any) => {
    // setImageLoader(true);
    // timeClearImage.current = setInterval(() => {
    //   let req = {
    //     pk: pk,
    //     data: itemId,
    //     onSuccess: (res) => {
    //       setImageLoader(false)
    //       // if (res.body.progress === 'done' || res.body.progress === 'failed') {
    //       //   clearInterval(timeClearImage.current);
    //       //   setImageLoader(false);
    //       //   dispatch(getSellingList());
    //       //   dispatch(getSellingDetail(pk));
    //       // }
    //     },
    //     onFail: () => {
    //       setImageLoader(false);
    //     },
    //   };
    //   // dispatch(clearImage(req));
    // }, imageTimeInterval);
  };

  useEffect(() => {
    return () => {
      clearInterval(timeClearImage.current);
    };
  }, []);

  const onAdd = (pk: any, item: any) => {
    onSheetlose();
    let req = {
      pk: pk,
      data: item,
      onSuccess: (res) => {
        clearImageData(pk, res.data.pk);
      },
      onFail: (err) => {
        console.log('Fail', err);
      },
    };
    dispatch(addItem(req));
    onCameraSheetRefClose();
  };

  const onAddAnother = (pk: any, item: any) => {
    let req = {
      pk: pk,
      data: item,
      onSuccess: (res) => {
        clearImageData(pk, res.data.pk);
      },
      onFail: (err) => {
        console.log('Fail', err);
      },
    };
    dispatch(addItem(req));
    onSheetlose();
    onCameraSheetRefOpen();
  };
  const onBundleItemPress = () => {
    navigation.navigatce('ListingItemList');
  };

  const onUpdate = (updatedItem: any, listingId: number) => {
    onSheetlose();
    dispatch(updateItem(pk, listingId, updatedItem));
  };

  const onEditBundle = () => {
    navigation.navigate('ListingFlow', {
      item: data,
      type: 'edit',
      itemsCount: items.length,
    });
  };

  const onPublish = () => {
    setImageLoading(false);
    if (profile && profile.address_line_1 === null) {
      navigation.navigate('AddressFlow');
    } else {
      if (items.length >= MINUMUM_ITEMS_IN_BUNDLE) {
        onEditBundle();
      } else {
        showErrorNotification(ERROR_MESSAGE.BUNDLE_MINIMUM_ITEMS);
      }
    }
  };

  const onUnpublish = () => {
    dispatch(unpublishBundle(pk));
  };

  // const onCancel = () => {
  //   dispatch(cancelOrder(pk));
  // };

  const onDeleteItem = () => {
    if (
      bundlesDetails?.status &&
      [BUNDLE_STATUS.PUBLISHED, BUNDLE_STATUS.SOLD].includes(
        bundlesDetails.status
      )
    ) {
      if (bundlesDetails.status === BUNDLE_STATUS.PUBLISHED)
        showErrorNotification(ERROR_MESSAGE.BUNDLE_PUBLISHED);
      if (bundlesDetails.status === BUNDLE_STATUS.SOLD)
        showErrorNotification(ERROR_MESSAGE.BUNDLE_SOLD);
      return;
    }
    Alert.alert(
      'Alert',
      'Are you sure?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: () => {
            dispatch(deleteItem(pk, items[activeIndex].id));
          },
        },
      ],
      { cancelable: true }
    );
  };

  const changePic = (uri: string) => {
    setSelectedImage(uri);
  };

  const onNext = (imageData: any) => {
    setCandidateImage(imageData);
    onImagePreviewOpen();
  };

  const removeBackgroundImage = async () => {
    setloadingRemoveBackground(true);
    let req = {
      data: { image_large: candidateImage.base64 },
      pk: pk,
      onSuccess: (res) => {
        dispatch(poolForRemoveBackground(res.id));
      },
      onFail: (err) => {
        console.log('Fail', err);
      },
    };
    const action = removeBackground(req);
    dispatch(action);
  };

  useEffect(() => {
    if (removeBackgroundState.imageCLoading === false) {
      const req = {
        data: removeBackgroundState.image_id,
      };
      dispatch(listingImageID(req));
    }

    return () => {
      dispatch(emptyRemoveBackgroundState());
    };
  }, [removeBackgroundState.RemoveBCSucess]);

  useEffect(() => {
    if (removeBackgroundState.imageIDSucess === true) {
      setloadingRemoveBackground(false);
      setCandidateImageWithRB(removeBackgroundState.imageIDData);
    }

    return () => {
      dispatch(emptyRemoveBackgroundState());
    };
  }, [removeBackgroundState.imageIDSucess, removeBackgroundState.imageIDData]);

  const error = false;

  let rendered_items = [...items];
  // TODO: Quick fix to add an empty item which gives out + button for adding new items in draft, think for a better solution
  if (bundlesDetails && bundlesDetails.status == BUNDLE_STATUS.DRAFT) {
    rendered_items.push({});
  }

  let paginationImages = <ProfileScreenPlaceholder />;
  if (!error) {
    paginationImages = (
      <FlatList
        bounces={false}
        showsVerticalScrollIndicator={false}
        data={rendered_items}
        numColumns={5}
        renderItem={({ index, item }) => {
          if (Object.keys(item).length > 0) {
            let uri = item.uri;
            if (!uri) {
              uri = getImageUrl(item, true);
            }
            return (
              <TouchableOpacity
                activeOpacity={0.75}
                onPress={() => onSnaptoIndex(index)}
              >
                <ImageWithSkeleton
                  style={[
                    styles().paginationImageStyle,
                    { opacity: index === activeIndex ? 0.6 : 1 },
                  ]}
                  source={{ uri }}
                  accessibilityLabel={`image${index}_listingDetail`}
                />
              </TouchableOpacity>
            );
          } else {
            return (
              <View style={{ flexDirection: 'row' }} accessible={true}>
                <TouchableOpacity
                  style={[
                    styles().paginationImageStyle,
                    {
                      justifyContent: 'center',
                      alignItems: 'center',
                      backgroundColor: 'rgba(0,0,0,.5)',
                    },
                  ]}
                  activeOpacity={0.75}
                  onPress={() => {
                    onCameraSheetRefOpen();
                  }}
                  accessibilityLabel={'Add Image'}
                >
                  <MaterialIcons
                    name="add-a-photo"
                    size={18}
                    style={{
                      padding: 2,
                      fontSize: 28,
                      color: 'white',
                    }}
                  />
                  <View>
                    <Text style={{ color: 'white' }}>Add</Text>
                  </View>
                </TouchableOpacity>
              </View>
            );
          }
        }}
        style={{}}
        keyExtractor={(item, index) => index.toString()}
      />
    );
  }

  let imageContent = <ProfileScreenPlaceholder />;
  if (!error) {
    imageContent = (
      <>
        <View>
          <ItemsCarousel
            items={items}
            activeIndex={activeIndex}
            setModalVisible={setModalVisible}
            setActiveIndex={setActiveIndex}
            setImageZoom={setImageZoom}
            setZoomItem={setZoomItem}
            setImageIndex={setImageIndex}
            onDeleteItem={onDeleteItem}
          />
        </View>
        {paginationImages}
      </>
    );
  }

  const badgeStatus = (status) => {
    switch (status) {
      case BUNDLE_STATUS.DRAFT:
        return (
          <View
            style={{
              alignSelf: 'flex-end',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#62B1F6',
              borderRadius: 15,
            }}
          >
            <Text
              style={{
                paddingHorizontal: 10,
                marginVertical: 5,
                color: '#FFFFFF',
              }}
            >
              {status}
            </Text>
          </View>
        );
      case BUNDLE_STATUS.PUBLISHED:
        return (
          <View
            style={{
              alignSelf: 'flex-end',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#5CB85C',
              borderRadius: 15,
            }}
          >
            <Text
              style={{
                paddingHorizontal: 10,
                marginVertical: 5,
                color: '#FFFFFF',
              }}
            >
              {status}
            </Text>
          </View>
        );
      default:
        return (
          <Badge
            primary
            style={{
              alignSelf: 'flex-end',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text>{status}</Text>
          </Badge>
        );
    }
  };

  const renderDescriptionBox = (bundlesDetails) => {
    return (
      <>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View
              style={{
                marginRight: 10,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#2D7AFF',
                borderRadius: 20,
              }}
            >
              <Text style={{ paddingHorizontal: 8, paddingVertical: 2 }}>
                {items.length}
              </Text>
            </View>

            <Text>
              {bundlesDetails && bundlesDetails.title !== 'My Bundle'
                ? bundlesDetails.title
                : ''}
            </Text>
          </View>

          <View>
            {bundlesDetails &&
              bundlesDetails.status &&
              badgeStatus(bundlesDetails.status)}
          </View>
        </View>
        <Text style={{ marginVertical: 10 }}>
          {bundlesDetails && bundlesDetails.description !== 'No Description'
            ? bundlesDetails.description
            : ''}
        </Text>
      </>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <StatusBar bg="#6E5ABA" barStyle="light-content" />
      <Box safeAreaTop bg="#6E5ABA" />

      <HStack bg="#6E5ABA" px="3" py="2" alignItems="center" w="100%">
        <TouchableOpacity onPress={() => goBack()} style={{ flex: 1 }}>
          <LeftArrow />
        </TouchableOpacity>
        <HStack alignItems="center" style={{ margin: 'auto' }}>
          <Text color="white" fontSize="20" fontWeight="bold">
            Bundle Builder
          </Text>
        </HStack>
        <View style={{ flex: 1 }}></View>

        {items.length > 0 && (
          <HStack alignItems="center">
            <Pressable onPress={onEdit}>
              <FontAwesome5
                name="edit"
                type="FontAwesome5"
                style={{ fontSize: 23, color: ThemeStatic.white }}
              />
            </Pressable>
          </HStack>
        )}
      </HStack>
      <View style={{ flex: 1 }}>
        <SectionList
          sections={[
            {
              data: [
                {
                  key: 'sellingDetailContent',
                  component: (
                    <View style={{ flex: 1 }}>
                      {imageContent}
                      <Card
                        style={{
                          borderWidth: 1,
                          shadowOpacity: 1,
                          borderRadius: 10,
                          shadowRadius: 12,
                          marginVertical: 5,
                          shadowColor: 'black',
                          marginHorizontal: 6,
                          borderColor: 'lightgray',
                          backgroundColor: 'white',
                          shadowOffset: { width: 1, height: 20 },
                          // bottom: Platform.OS === 'ios' ? -18 : 0,
                        }}
                      >
                        {/* <CardItem header> */}
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                          }}
                        >
                          <View
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                            }}
                          >
                            <View
                              style={{
                                marginRight: 10,
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: '#2D7AFF',
                                borderRadius: 20,
                              }}
                            >
                              <Text
                                style={{
                                  paddingHorizontal: 8,
                                  paddingVertical: 2,
                                  color: 'white'
                                }}
                              >
                                {items.length} items
                              </Text>
                            </View>
                            <Text>
                              {bundlesDetails && bundlesDetails.title
                                ? bundlesDetails.title
                                : ''}
                            </Text>
                          </View>
                          <View>
                            {bundlesDetails &&
                              bundlesDetails.status &&
                              badgeStatus(bundlesDetails.status)}
                          </View>
                        </View>
                        {/* </CardItem>
                            <CardItem> */}
                        {/* <Body> */}
                        <Text style={{ marginVertical: 10 }}>
                          {bundlesDetails && bundlesDetails.description
                            ? bundlesDetails.description
                            : ''}
                        </Text>
                        {errorFilter ? (
                          Alert.alert(
                            'Filter Error',
                            "Sorry can't apply filter due to server error "
                          )
                        ) : (
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
                            tagColor={'#DDD'}
                            tagTextStyle={{ fontSize: 10 }}
                            tagContainerStyle={{ height: 26, borderRadius: 6 }}
                            tagTextColor={'black'}
                            editable={false}
                            onChangeText={(value) => {}}
                          />
                        )}
                        {/* </Body> */}
                        {/* </CardItem> */}
                      </Card>
                      <Button
                        onPress={onDeleteBundle}
                        style={styles().deleteButton}
                        accessibilityLabel="Delete Bundle"
                      >
                        <Text style={styles().deleteButtonText}>Delete Bundle</Text>
                      </Button>

                    </View>
                  ),
                },
              ],
            },
          ]}
          renderItem={({ item }) => item.component}
          renderSectionHeader={() => null}
          keyExtractor={(item, index) => item.key + index}
        />
        {modalVisible && (
          <Modal visible={modalVisible} statusBarTranslucent>
            <Box safeAreaTop bg="#000" />
            <TouchableOpacity
              style={[styles().share, styles().closeIcon]}
              hitSlop={{ top: 5, right: 5, left: 5, bottom: 5 }}
              onPress={() => {
                setModalVisible(false);
              }}
            >
              <EvilIcons
                name="close"
                style={{
                  fontSize: 32,
                  fontWeight: '900',
                  color: ThemeStatic.white,
                  alignSelf: 'center',
                }}
              />
            </TouchableOpacity>
            <ImageViewer
              enableSwipeDown={true}
              index={imageIndex}
              imageUrls={imageZoom}
              onSwipeDown={() => {
                setModalVisible(false);
              }}
              enablePreload={true}
              loadingRender={() => <ActivityIndicator />}
              renderImage={(props) => (
                <ImageBackground
                  {...props}
                  resizeMode="contain"
                  style={{ flex: 1, width: screenWidth, aspectRatio: 1 }}
                >
                  <View style={{ flexDirection: 'row' }}>
                    <View style={styles(theme).itemDescriptionBackground}>
                      <Text style={styles(theme).itemDescription}>
                        {zoomItem.size.name}
                      </Text>
                      <Text style={styles(theme).itemDescription}>
                        {zoomItem.brand.name}
                      </Text>
                      <Text style={styles(theme).itemDescription}>
                        {zoomItem.quality}
                      </Text>
                    </View>
                  </View>
                </ImageBackground>
              )}
            />
          </Modal>
        )}
        <View>
          <View
            style={{
              justifyContent: 'space-between',
              flexDirection: 'row',
              marginHorizontal: 18,
            }}
          >
            {bundlesDetails?.status && (
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  backgroundColor:
                    bundlesDetails.status === BUNDLE_STATUS.DRAFT
                      ? '#5CB85C'
                      : bundlesDetails.status === BUNDLE_STATUS.PUBLISHED
                      ? '#D9534F'
                      : ThemeStatic.accent,
                  width: '50%',
                  paddingVertical: 15,
                  justifyContent: 'center',
                  borderRadius: 5,
                }}
                onPress={
                  bundlesDetails.status === BUNDLE_STATUS.DRAFT
                    ? onPublish
                    : bundlesDetails.status === BUNDLE_STATUS.PUBLISHED
                    ? onUnpublish
                    : () => {}
                }
                disabled={
                  loading || bundlesDetails.status === BUNDLE_STATUS.SOLD
                }
                accessibilityLabel={'sellingDetail_publish'}
              >
                {loading ? (
                  <Spinner color="white" />
                ) : (
                  <>
                    <FontAwesome5
                      name={
                        bundlesDetails.status === BUNDLE_STATUS.DRAFT
                          ? 'check'
                          : bundlesDetails.status === BUNDLE_STATUS.PUBLISHED
                          ? 'times'
                          : 'dollar-sign'
                      }
                      size={IconSizes.x5}
                      style={{ color: '#FFFFFF' }}
                    />
                    <Text style={{ marginLeft: 10, color: '#FFFFFF' }}>
                      {bundlesDetails.status === BUNDLE_STATUS.DRAFT
                        ? BUTTON_LABEL.PUBLISH
                        : bundlesDetails.status === BUNDLE_STATUS.PUBLISHED
                        ? BUTTON_LABEL.UNPUBLISH
                        : BUTTON_LABEL.SOLD}
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            )}
            <View style={{ marginRight: 10, justifyContent: 'center' }}>
              <View style={{ flexDirection: 'row' }}>
                <Text style={styles(theme).priceText}>{priceFormat}&nbsp;</Text>
                <Text style={styles(theme).unitPriceText}>
                  ({priceOfPerItem} / item)
                </Text>
              </View>
              <View style={{ flexDirection: 'row', alignSelf: 'flex-end' }}>
                <View style={{ marginTop: 5 }}>
                  <FontAwesome5
                    name="shipping-fast"
                    size={12}
                    style={{ fontSize: 12, color: '#119822' }}
                  />
                </View>
                <Text
                  style={{
                    fontSize: 12,
                    color: '#119822',
                    marginLeft: 5,
                  }}
                >
                  {SHIPPING_TYPES[bundlesDetails.shipping_type]}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      <SellingDetailBottomSheet
        ref={BottomSheetRef}
        onSheetlose={onSheetlose}
        onAdd={onAdd}
        onAddAnother={onAddAnother}
        onUpdate={onUpdate}
        onBundleItemPress={onBundleItemPress}
        type={bottomSheetType}
        selectedItem={selectedItem}
        bundleItems={items}
        setInitialType={() => setBottomSheetType('')}
        frontImg={frontImage}
        firstImage={frontImage}
        backImg={backImage}
        screen={'details'}
        id={pk}
        currentItem={items.length + 1}
        currentImage={1}
      />

      <CameraBottomSheet
        ref={CameraSheetRef}
        onSheetClose={() => {
          onCameraSheetRefClose();
          if (!timeClearImage.current) {
            goBack();
          }
        }}
        onNext={onNext}
        setInitialSide={(type: string) => setImageSide(type)}
        currentItem={items.length + 1}
        currentImage={1}
        visible={true}
        callComponent={'InitialCall'}
      />
      <ImagePreviewScreen
        ref={ImagePreviewRef}
        imageDataProp={candidateImage}
        imageDataWithRB={candidateImageRB}
        onApprove={(imageData: any) => {
          setFrontImage(imageData);
          onCameraSheetRefClose();
          onNewItem();
        }}
        onSheetClose={() => {
          onImagePreviewClose();
          setCandidateImage(null);
          setCandidateImageWithRB(null);
        }}
        onClose={() => {
          onImagePreviewClose();
          setCandidateImage(null);
          setCandidateImageWithRB(null);
          setloadingRemoveBackground(false);
        }}
        removeBackground={() => {
          removeBackgroundImage();
        }}
        loader={loadingRemoveBackground}
      />

      <StripeConnectSheet
        ref={StripeConnectSheetRef}
        onSheetlose={modalClose}
      />
    </View>
  );
};

const styles = (theme = {} as ThemeColors) =>
  StyleSheet.create({
    userText: {
      fontSize: 10,
      color: 'black',
    },
    aboutText: {
      fontSize: 14,
      color: 'black',
    },
    aboutTextHeader: {
      fontSize: 12,
      color: '#666',
    },
    userRating: {
      fontSize: 10,
      color: 'green',
    },
    priceText: {
      fontSize: 17,
      textAlign: 'right',
      color: ThemeStatic.accent,
    },
    unitPriceText: {
      fontSize: 14,
      textAlign: 'right',
      color: ThemeStatic.lightBlue,
    },
    postedTime: {
      fontSize: 10,
      color: 'gray',
      textAlign: 'right',
    },
    titleText: {
      fontSize: 16,
      alignItems: 'flex-end',
      color: 'black',
    },
    bottomButton: {
      // marginTop: 50,
      alignItems: 'center',
      justifyContent: 'space-evenly',
    },
    userLogo: {
      height: 72,
      width: 72,
      borderRadius: 72,
    },
    userContainer: {
      flex: 1,
      alignItems: 'center',
    },
    iconStyle: {
      justifyContent: 'center',
      alignItems: 'center',
      position: 'absolute',
      zIndex: 99,
    },
    share: {
      right: 15,
      top: 15,
    },
    exChange: {
      left: 15,
      top: -30,
      width: 34,
      height: 34,
    },
    deleteIcon: {
      right: 15,
      top: -30,
      width: 34,
      height: 34,
    },
    back: {
      left: 15,
      top: 15,
    },
    carouselItem: {
      // width: screenWidth,
      // height: screenHeight / 2 + 25,
      flex: 1,
      aspectRatio: 1,
      resizeMode: 'contain',
    },
    paginationImageStyle: {
      width: screenWidth / 5 - 4,
      height: screenWidth / 5 + 4,
      margin: 2,
      resizeMode: 'contain',
    },
    badge: {
      backgroundColor: 'black',
      justifyContent: 'center',
      height: 12,
    },
    badgeText: {
      color: 'white',
      lineHeight: 8,
      fontSize: 8,
    },
    buttonPublish: {
      // minWidth: '29%',
      alignItems: 'center',
      justifyContent: 'center',
    },
    largeImageView: {
      height: 300,
      alignItems: 'center',
      justifyContent: 'center',
      display: 'flex',
    },
    itemDescription: {
      backgroundColor: '#ffffff66',
      fontSize: 14,
      fontVariant: ['small-caps'],
    },
    itemDescriptionBackground: {
      backgroundColor: 'rgba(255, 255, 255, 0)',
      padding: 7,
    },
    closeIcon: {
      justifyContent: 'center',
      alignItems: 'center',
      position: 'absolute',
      width: 34,
      height: 34,
      top: isIphoneX ? 60 : 10,
      zIndex: 99,
    },
    deleteButton: {
      backgroundColor: '#D9534F',
      marginHorizontal: 6,
      marginTop: 5,
      marginBottom: 10,
      borderRadius: 5,
    },
    deleteButtonText: {
      color: 'white',
      fontWeight: 'bold'
    },
  });

export default SellingDetail;
