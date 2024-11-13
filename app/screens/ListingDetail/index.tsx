import React, { useContext, useEffect, useState } from 'react';
import {
  TouchableOpacity,
  View,
  FlatList,
  Dimensions,
  Modal,
  Share,
  StyleSheet,
  TextInput,
  ImageBackground,
  SectionList,
  InteractionManager,
} from 'react-native';
import { Button, Text, Card } from 'native-base';
import { ProfileScreenPlaceholder } from '@app/layout';
import { Col, Row } from 'react-native-easy-grid';
import ImageViewer from 'react-native-image-zoom-viewer';
import { AppContext } from '@app/context';
import { IconSizes } from '@app/constants';
import { ThemeStatic } from '@app/theme';
import { useDispatch, useSelector } from 'react-redux';
import { addItemToCart, addLocalItemToCart } from '@app/actions/product';
import {
  getListingDetail,
  review,
  orderReceived,
  getPurchasedBundles,
} from '@app/actions/shop';
import { FontAwesome5, EvilIcons, Feather } from '@expo/vector-icons';
import { Rating } from 'react-native-ratings';

import { styles } from './styles';
const screenWidth = Math.round(Dimensions.get('window').width);

import {
  showErrorNotification,
  showSuccessNotification,
} from '@app/utils/notifications';
import TagDisplay from '@app/screens/common/TagDisplay';
import Config from '@app/config';
import { Pressable, ActivityIndicator } from 'react-native';

import { StatusBar, Box, HStack } from 'native-base';
import ImageWithSkeleton from '@app/utils/react-native-images-collage/ImageWithSkeleton';
import { ItemsCarousel } from '../../components';

const ListingDetail: React.FC = ({ navigation, route }: any) => {
  const { navigate, goBack } = navigation;
  // const data = route.params('data', {});
  const data = route.params?.data ?? {};

  const user = useSelector((state) => state.user);
  const cartData = useSelector((state) => state.cart);
  const { carts } = cartData;
  const options = useSelector((state) => state.shop.options);
  const index = route.params?.index ?? 0;
  const [detailData, setDetailData] = useState(data);
  const { title, description, status, buyer_price, tags, items, id } =
    detailData;
  const [isVisible, setisVisible] = useState(false);

  const { theme } = useContext(AppContext);
  const [isChecked, setChecked] = useState(false);
  const [activeIndex, setActiveIndex] = useState(index);
  const [modalVisible, setModalVisible] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);
  const userId = useSelector((state) => state?.user?.profile?.id);
  const [imageZoom, setImageZoom] = useState([]);
  const [zoomItem, setZoomItem] = useState({});

  const dispatch = useDispatch();

  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });

  useEffect(() => {
    if (isChecked) dispatch(getPurchasedBundles(userId));
  }, [isChecked]);
  const priceFormat = formatter.format(buyer_price);
  // const { user_description, name, avatar } = user;
  // const { mail, rating, time } = postInfo;

  const initialize = async () => {
    getListingDetail(id)
      .then((response) => {
        const { statusCode, body } = response;
        if (statusCode == 200) {
          setDetailData(body);
        }
      })
      .catch((err) => {
        console.log('Errrror', err);
      });
  };
  useEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      initialize();
    });
  }, []);

  const navigateBack = () => {
    goBack();
  };
  const onSnaptoIndex = (index: number) => {
    setActiveIndex(index);
  };
  const onAddCart = () => {
    if (
      user.profile !== null &&
      user.profile !== undefined &&
      user.profile !== ''
    ) {
      dispatch(addItemToCart(data));
    } else {
      // navigate(Routes.Auth);
      if (carts.length === 0) {
        dispatch(addLocalItemToCart([{ listing: data }]));
      } else {
        let index = carts.findIndex(
          (cartItem) => cartItem.listing.id === data.id
        );
        if (index === -1) {
          let newCartData = [...carts, ...[{ listing: data }]];
          dispatch(addLocalItemToCart(newCartData));
        } else {
          dispatch(addLocalItemToCart(carts));
        }
      }
    }
    navigate('CartScreen');
  };
  const onReceived = () => {
    setisVisible(true);
  };

  const [ratingData, setRating] = useState();
  const [feedbackData, setFeedback] = useState();

  const ratingCompleted = (rating) => {
    setRating(rating);
  };

  const addReview = () => {
    if (ratingData === 0) {
      showErrorNotification(
        'Ensure this rating value is greater than or equal to 1.'
      );
      setisVisible(false);
      setRating('');
      setFeedback('');
    } else {
      let item = { rating: ratingData, feedback: feedbackData, listing: id };

      let req = {
        data: item,
        isSuccess: (res) => {
          if (res.statusCode == 200 || res.statusCode == 201) {
            showSuccessNotification('This item has been rated successfully.');
            dispatch(orderReceived(id));
            setChecked(true);
          } else if (res.statusCode == 400) {
            showErrorNotification(res.body.non_field_errors[0]);
          }
        },
        isFail: (err) => {
          // alert(err);
        },
      };

      dispatch(review(req));
      setisVisible(false);
      setRating('');
      setFeedback('');
    }
  };

  const onShare = async () => {
    try {
      const result = await Share.share({
        // message: Linking.makeUrl(),
        message: `${Config.base_url}/listing/${detailData.id}/${detailData.slug}`,
      });

      if (result.action === Share.sharedAction) {
      } else if (result.action === Share.dismissedAction) {
        // alert('Post cancelled');
      }
    } catch (error) {
      // alert(error.message);
    }
  };

  const error = false;

  let paginationImages = <ProfileScreenPlaceholder />;
  if (!error) {
    paginationImages = (
      <FlatList
        bounces={false}
        showsVerticalScrollIndicator={false}
        data={items}
        numColumns={5}
        renderItem={({ item, index }) => {
          return (
            <TouchableOpacity
              activeOpacity={0.75}
              onPress={() => onSnaptoIndex(index)}
            >
              <ImageWithSkeleton
                style={{
                  ...styles().paginationImageStyle,
                  opacity: index === activeIndex ? 0.6 : 1,
                }}
                source={{
                  uri: item.images[0]?.image_small,
                }}
                accessibilityLabel={`image${index}_listingDetail`}
              />
            </TouchableOpacity>
          );
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
          />
        </View>
        {paginationImages}
      </>
    );
  }
  let footerContent = <ProfileScreenPlaceholder />;
  if (!error) {
    footerContent = (
      <>
        <View
          style={{
            backgroundColor: theme.base,
            marginHorizontal: 15,
            marginVertical: 5,
            marginBottom: 20,
          }}
        >
          <Modal
            animationType="fade"
            transparent={true}
            visible={isVisible}
            style={{
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <View style={styles().centeredView}>
              <View style={styles().modalView}>
                <View
                  style={{
                    alignSelf: 'flex-end',
                  }}
                >
                  <TouchableOpacity
                    onPress={() => {
                      setisVisible(false);
                    }}
                  >
                    <EvilIcons
                      name="close"
                      size={30}
                      style={{ color: '#846BE2' }}
                    />
                  </TouchableOpacity>
                </View>

                {/* <AirbnbRating defaultRating={5} /> */}
                <Rating
                  type="custom"
                  showRating
                  style={styles().rating}
                  onFinishRating={ratingCompleted}
                  ratingTextColor="#846BE2"
                  minValue={1}
                />

                <View style={styles().feedTextArea}>
                  <TextInput
                    value={feedbackData}
                    onChangeText={(value) => setFeedback(value)}
                    // rowSpan={3}
                    style={styles(theme).inputTextContainer}
                    placeholderTextColor={'#846BE2'}
                    placeholder={'Feedback'}
                  ></TextInput>
                </View>
                <View style={styles().submit}>
                  <TouchableOpacity
                    style={{ padding: 10 }}
                    onPress={() => {
                      addReview();
                    }}
                  >
                    <Text style={{ color: '#fff' }}>Submit</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
          <View>
            {status === 'published' ? (
              <View
                style={{
                  justifyContent: 'space-between',
                  flexDirection: 'row',
                }}
              >
                <TouchableOpacity
                  style={Styles.AddtoCartView}
                  onPress={() => onAddCart()}
                >
                  <FontAwesome5
                    name="cart-arrow-down"
                    size={IconSizes.x5}
                    style={{ color: '#FFEB8F' }}
                  />
                  <Text style={Styles.AddtoCartText}>Add to Cart</Text>
                </TouchableOpacity>
                <View style={{ justifyContent: 'center', marginRight: 10 }}>
                  <Text
                    style={styles(theme).priceText}
                    accessibilityLabel={`${priceFormat}_listingDetail`}
                  >
                    {priceFormat}
                  </Text>
                  <View style={{ flexDirection: 'row' }}>
                    <FontAwesome5
                      name="shipping-fast"
                      size={IconSizes.x2}
                      style={{ fontSize: 12, width: 20, color: '#119822' }}
                    />
                    <Text
                      style={{ fontSize: 12, color: '#119822' }}
                      accessibilityLabel={'freeShip_listingDetail'}
                    >
                      FREE SHIPPING
                    </Text>
                  </View>
                </View>
              </View>
            ) : status === 'received' || isChecked ? (
              <TouchableOpacity disabled={true} style={Styles.button}>
                <Text style={{ color: 'white' }}>Feedback Submitted</Text>
              </TouchableOpacity>
            ) : (
              <Button success iconLeft onPress={onReceived}>
                <FontAwesome5
                  style={{ fontSize: 16 }}
                  type="FontAwesome5"
                  name="check"
                  size={16}
                />
                <Text>Received</Text>
              </Button>
            )}
          </View>
        </View>
      </>
    );
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
          <Pressable onPress={navigateBack}>
            <Feather
              type="Feather"
              name="chevron-left"
              size={30}
              style={{ fontSize: 30, color: ThemeStatic.white }}
            />
          </Pressable>
        </HStack>
        <HStack alignItems="center">
          <Pressable onPress={onShare}>
            <Feather
              type="Feather"
              name="share-2"
              size={24}
              style={{ fontSize: 24, color: ThemeStatic.white }}
            />
          </Pressable>
          {/* <IconButton icon={<Icon size="sm" as={Feather} name="package" color="white" />} />
          <Text color="white" fontSize="20" fontWeight="bold">
            My bundles
          </Text> */}
        </HStack>
      </HStack>
      <SectionList
        sections={[
          {
            data: [
              {
                key: 'listingDetailContent',
                component: (
                  <View
                    style={{
                      flex: 1,
                    }}
                  >
                    {imageContent}
                    <View
                      style={{
                        // borderRadius: 10,
                        marginVertical: 5,
                        // marginHorizontal: 12,
                        backgroundColor: 'white',
                      }}
                    >
                      <Card
                        style={{
                          borderWidth: 1,
                          shadowOpacity: 1,
                          borderRadius: 10,
                          shadowRadius: 12,
                          marginVertical: 5,
                          shadowColor: 'black',
                          marginHorizontal: 12,
                          borderColor: 'lightgray',
                          backgroundColor: 'white',
                          shadowOffset: { width: 1, height: 20 },
                        }}
                      >
                        <Text
                          accessibilityLabel={title}
                          style={{ fontWeight: '600' }}
                        >
                          {title}
                        </Text>
                        <Text accessibilityLabel={description}>
                          {description}
                        </Text>
                      </Card>
                      <Card
                        style={{
                          borderWidth: 1,
                          shadowOpacity: 1,
                          borderRadius: 10,
                          shadowRadius: 12,
                          marginVertical: 5,
                          shadowColor: 'black',
                          marginHorizontal: 12,
                          borderColor: 'lightgray',
                          backgroundColor: 'white',
                          shadowOffset: { width: 1, height: 20 },
                        }}
                      >
                        <Text
                          style={{ fontWeight: '700' }}
                          accessibilityLabel={'bundle_listingDetail'}
                        >
                          Bundle Breakdown
                        </Text>
                        <Col>
                          <Row>
                            <Text
                              accessibilityLabel={`${items?.length}items_listingDetail`}
                            >
                              {items?.length} Items
                            </Text>
                          </Row>
                          <Row>
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
                              tagTextStyle={{ fontSize: 14 }}
                              tagContainerStyle={{
                                height: 30,
                                borderRadius: 6,
                              }}
                              tagTextColor={theme.white}
                              editable={false}
                              onChangeText={(value) => setText(value)}
                            />
                          </Row>
                        </Col>
                      </Card>
                    </View>
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
      {footerContent}
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
                  <View style={Styles.itemDescriptionBackground}>
                    <Text style={Styles.itemDescription}>
                      {zoomItem.size.name}
                    </Text>
                    <Text style={Styles.itemDescription}>
                      {zoomItem.brand.name}
                    </Text>
                    <Text style={Styles.itemDescription}>
                      {zoomItem.quality}
                    </Text>
                  </View>
                </View>
              </ImageBackground>
            )}
          />
        </Modal>
      )}
    </View>
  );
};

const Styles = StyleSheet.create({
  button: {
    display: 'flex',
    flexDirection: 'row',
    width: 180,
    height: 35,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    backgroundColor: '#47cc62',
  },
  AddtoCartText: {
    marginLeft: 10,
    fontWeight: 700,
    color: '#FFFFFF',
  },
  AddtoCartView: {
    flexDirection: 'row',
    backgroundColor: '#5CB85C',
    width: '50%',
    paddingVertical: 20,
    justifyContent: 'center',
    borderRadius: 5,
  },
  container: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    paddingHorizontal: 5,
    width: 'auto',
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
});

export default ListingDetail;
