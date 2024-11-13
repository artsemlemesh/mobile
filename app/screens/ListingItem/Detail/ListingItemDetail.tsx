import React, { useContext, useRef, useEffect, useState } from 'react';
import {
  Image,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
  FlatList,
  Dimensions,
  ImageBackground,
  Alert,
  ActionSheetIOS,
} from 'react-native';
import TagInput from 'react-native-tag-input';
import randomstring from 'random-string';
import mimes from 'react-native-mime-types';
import { Button, Text, Card } from 'native-base';
import { ProfileScreenPlaceholder } from '@app/layout';
import { Col, Row, Grid } from 'react-native-easy-grid';
import Carousel, { Pagination } from 'react-native-snap-carousel';
// import { useNavigation, useNavigationParam } from 'react-navigation-hooks';
import { AppContext } from '@app/context';
import { ThemeColors } from '@app/types/theme';
import { ThemeStatic, Typography } from '@app/theme';
import { useDispatch, useSelector } from 'react-redux';
import { ScrollView } from 'react-native-gesture-handler';
import { addItem, updateItem, deleteItem } from '@app/actions/bundle';
import * as ImagePicker from 'expo-image-picker';
import { Camera } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import { ImageInfo } from 'expo-image-picker/build/ImagePicker.types';
import { Routes } from '@app/constants';
import {
  CategoryPicker,
  GenderPicker,
  SizePicker,
  QualityPicker,
  BrandPicker,
} from '../components/molecules/';
import bundle from 'reducers/bundle';
import { Feather, FontAwesome5 } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');
const ratio = width / height;

const ListingItemDetail: React.FC = ({ navigation, route }: any) => {
  const { navigate, goBack } = navigation;
  const bundles: any[] = useSelector((state) => state?.bundle?.bundles);
  const { listingId } = route?.params || '';
  const { id } = route?.params || '';

  const getListingItem = (): any => {
    const filteredBundles = bundles?.filter(
      (bundle) => bundle?.pk === listingId
    );
    if (!filteredBundles) return null;
    const { items } = filteredBundles[0] || {};
    const filteredItems = items?.filter((item) => item?.id === id);
    return filteredItems ? filteredItems[0] : null;
  };

  const [category, setCategory] = useState<string>('');
  const [brand, setBrand] = useState<string>('');
  const [gender, setGender] = useState<string>('');
  const [quality, setQuality] = useState<string>('');
  const [size, setSize] = useState<string>('');
  const [frontImage, setFrontImage] = useState<string>('');
  const [backImage, setBackImage] = useState<string>('');
  const [isFrontUpdated, setIsFrontUpdated] = useState<boolean>(false);
  const [isBackUpdated, setIsBackUpdated] = useState<boolean>(false);
  let updatedFrontImage = {},
    updatedBackImage = {};
  const [formData, setFormData] = useState<FormData>(new FormData());
  const { theme, toggleSetOpenModal } = useContext(AppContext);
  const dispatch = useDispatch();
  const navigateBack = () => goBack();

  useEffect(() => {
    initialize();
  }, [id]);
  const initialize = () => {
    setFormData(new FormData());
    const data = getListingItem();
    setCategory(data?.category);
    setBrand(data?.brand);
    setGender(data?.gender);
    setQuality(data?.quality);
    setSize(data?.size);
    setFrontImage(data?.image_large);
    setBackImage(data?.back_image_large);
  };

  const onDeleteItem = () => {
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
            navigateBack();
            dispatch(deleteItem(listingId, id));
          },
        },
      ],
      { cancelable: false }
    );
  };
  const onUpdateItem = () => {
    formData.append('category', category);
    formData.append('gender', gender);
    formData.append('brand', brand);
    formData.append('size', size);
    formData.append('quality', quality);
    dispatch(updateItem(listingId, id, formData));
    goBack();
  };

  const setImage = (side: string) => {
    if (side == 'front' && frontImage !== '') {
      return (
        <View
          style={{
            flexDirection: 'row',
            height: (width - 40) * ratio,
            width: width - 40,
          }}
        >
          <Image style={styles().imageStyle} source={{ uri: frontImage }} />
        </View>
      );
    } else if (side == 'back' && backImage !== '') {
      return (
        <View
          style={{
            flexDirection: 'row',
            height: (width - 40) * ratio,
            width: width - 40,
          }}
        >
          <Image style={styles().imageStyle} source={{ uri: backImage }} />
        </View>
      );
    }

    return (
      <View
        style={{
          flexDirection: 'row',
          height: (width - 40) * ratio,
          width: width - 40,
        }}
      >
        <Image
          style={styles().imageStyle}
          source={require('@app/assets/images/empty.png')}
        />
      </View>
    );
  };

  const askPermissionsAsync = async () => {
    await Camera.requestCameraPermissionsAsync();
    await MediaLibrary.requestPermissionsAsync();
  };

  const _attachImage = async (
    asset: ImagePicker.ImagePickerAsset,
    side: string
  ) => {
    const dd = {
      uri: asset.uri,
      base64: asset.base64,
      name:
        randomstring() + '.' + mimes.extension(mimes.lookup(asset.uri) || ''),
      type: mimes.lookup(asset.uri),
    };

    if (side === 'front') {
      setFrontImage(asset.uri);
      formData.append('image_large', dd);
    } else {
      setBackImage(asset.uri);
      formData.append('back_image_large', dd);
    }
    return;
  };

  const runGalleryAsync = async (side) => {
    await askPermissionsAsync();
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      base64: true,
    });
    if (!result.canceled && result.assets) {
      await _attachImage(result.assets[0], side);
    }
  };

  const takePhotoAsync = async (side) => {
    await askPermissionsAsync();
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
    });
    if (!result.canceled && result.assets) {
      await _attachImage(result.assets[0], side);
    }
  };

  const onCameraPressed = (side: string) => {
    if (Platform.OS === 'android') {
      Alert.alert('', '', [
        {
          text: 'Take a picture from the folder',
          onPress: () => runGalleryAsync(side),
        },
        {
          text: 'Take photos from the camera',
          onPress: () => takePhotoAsync(side),
        },
      ]);
    } else {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: [
            'Take photos from the camera',
            'Take a picture from the folder',
            'cancel',
          ],
          cancelButtonIndex: 2,
        },
        (buttonIndex: any) => {
          if (buttonIndex === 0) {
            takePhotoAsync(side);
          } else if (buttonIndex === 1) {
            runGalleryAsync(side);
          }
        }
      );
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <ScrollView>
          <View>
            <Card>
              {/* <CardItem header> */}
              <Feather
                onPress={navigateBack}
                type="Feather"
                name="chevron-left"
                size={30}
                style={{
                  fontSize: 30,
                  padding: 5,
                  color: ThemeStatic.accent,
                }}
              />
              <Text>Update Listing Item</Text>
              {/* </CardItem> */}
              {/* <CardItem> */}
              <View>
                <View style={styles().subContainer}>
                  <View
                    style={{
                      flexDirection: 'row',
                      height: (width - 20) * ratio + 20,
                      width: width - 20,
                      backgroundColor: 'rgba(0,0,0,0.3)',
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => {
                        onCameraPressed('front');
                      }}
                      style={{
                        flexDirection: 'column',
                        flex: 1,
                        margin: 5,
                        justifyContent: 'center',
                      }}
                    >
                      <Text style={{ textAlign: 'center', color: 'white' }}>
                        {'Front'}
                      </Text>
                      {setImage('front')}
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        onCameraPressed('back');
                      }}
                      style={{
                        flexDirection: 'column',
                        flex: 1,
                        margin: 5,
                        justifyContent: 'center',
                      }}
                    >
                      <Text style={{ textAlign: 'center', color: 'white' }}>
                        {'Back'}
                      </Text>
                      {setImage('back')}
                    </TouchableOpacity>
                  </View>
                </View>
                <CategoryPicker
                  selectedValue={category}
                  onValueChange={setCategory}
                />
                <GenderPicker
                  selectedValue={gender}
                  onValueChange={setGender}
                />
                <SizePicker selectedValue={size} onValueChange={setSize} />
                <QualityPicker
                  selectedValue={quality}
                  onValueChange={setQuality}
                />
                <BrandPicker selectedValue={brand} onValueChange={setBrand} />
              </View>
              {/* </CardItem> */}
            </Card>
          </View>
        </ScrollView>
        <View style={{ height: 60, backgroundColor: theme.base }}>
          <Row style={styles().bottomButton}>
            <Button danger iconLeft onPress={onDeleteItem}>
              <FontAwesome5
                style={{ fontSize: 16 }}
                type="FontAwesome5"
                name="trash-alt"
                size={16}
              />
              <Text>Delete Item</Text>
            </Button>
            <Button info iconLeft onPress={onUpdateItem}>
              <FontAwesome5
                style={{ fontSize: 16 }}
                type="FontAwesome5"
                size={16}
                name="edit"
              />
              <Text>Update Item</Text>
            </Button>
          </Row>
        </View>
      </View>
    </View>
  );
};

const styles = (theme = {} as ThemeColors) =>
  StyleSheet.create({
    imageStyle: {
      height: (width - 40) * ratio,
      width: (width - 40) / 2,
      resizeMode: 'stretch',
    },
    subContainer: {
      shadowOffset: { height: 5, width: width },
      shadowOpacity: 0.3,
      backgroundColor: 'white',
      paddingVertical: 20,
      marginBottom: 20,
      borderRadius: 5,
      justifyContent: 'center',
      alignItems: 'center',
    },
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

export default ListingItemDetail;
