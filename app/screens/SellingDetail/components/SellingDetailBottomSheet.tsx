import React, { useContext, useRef, useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  Alert,
  Image,
  FlatList,
  ScrollView,
} from 'react-native';
import { Spinner } from 'native-base';
import SectionedMultiSelect from 'react-native-sectioned-multi-select';
import { Modalize } from 'react-native-modalize';
import { responsiveWidth } from 'react-native-responsive-dimensions';
import { Button } from '@app/layout';
import { Button as NativeBaseBtn } from 'native-base';
import { AppContext } from '@app/context';
import { BottomSheetHeader } from '@app/layout';
import { ThemeStatic, Typography } from '@app/theme';
import { ThemeColors } from '@app/types/theme';
import * as ImagePicker from 'expo-image-picker';
import { ImageInfo } from 'expo-image-picker/build/ImagePicker.types';
import { Camera } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import mimes from 'react-native-mime-types';
import randomstring from 'random-string';
import { useDispatch, useSelector } from 'react-redux';
import {
  createNewBundle,
  removeBackground,
  addSuggestBrand,
  listingImageID,
  poolForRemoveBackground,
  emptyRemoveBackgroundState,
} from '@app/actions/bundle';
import { showErrorNotification } from '@app/utils/notifications';
import { genders, qualities } from '@app/fake-data';
import { CameraBottomSheet, ImagePreviewScreen } from '../components';
import { useNavigation } from '@react-navigation/native';
import { applyFilter } from '../../../actions/shop';
import { getImageUrl } from '../../../utils/common';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { Quality, Category, Size, Brand } from 'types/filterList';
import { getBundleProperties } from './properties';
import {
  BOTTOM_SHEET_TYPE,
  BUTTON_LABEL,
  ERROR_MESSAGE,
  SHEET_HEADER,
} from '@app/utils/constants';

const { width, height } = Dimensions.get('window');
const ratio = width / height;
const screenWidth = Math.round(Dimensions.get('window').width);

const { FontWeights, FontSizes } = Typography;

interface BottomSheetProps {
  ref: React.Ref<any>;
  onSheetlose: () => void;
  onAdd: (pk: any, item: any) => void;
  onAddAnother: (item: any) => void;
  onUpdate: (updatedItem: any, listingId: number) => void;
  onBundleItemPress?: () => void;
  setInitialType: () => void;
  type: string;
  selectedItem: any;
  bundleItems: any;
  backImg: any;
  frontImg: any;
  screen: string;
  id: any;
  currentItem: any;
  currentImage: any;
  firstImage: any;
}

const SellingDetailBottomSheet: React.FC<BottomSheetProps> = React.forwardRef(
  (
    {
      setInitialType,
      onSheetlose,
      onAdd,
      onAddAnother,
      type,
      selectedItem,
      bundleItems,
      onUpdate,
      firstImage,
      screen,
      id,
      currentItem,
    },
    ref
  ) => {
    const { theme, isBack, isBackToScreen, isAddBack, onAddBackToScreen } =
      useContext(AppContext);

    const removeBackgroundState = useSelector(
      (state) => state.removeBackground
    );
    const brandRef = useRef(null);

    const [frontImage, setFrontImage] = useState<any>('');
    const [candidateImage, setCandidateImage] = useState<any>(null);
    const [candidateImageRB, setCandidateImageWithRB] = useState<any>(null);
    const [editImage, setEditImage] = useState<any>(false);
    const [loadingRemoveBackground, setloadingRemoveBackground] =
      useState(false);
    const [formData, setFormdata] = useState<FormData>(new FormData());
    const { navigate, goBack } = useNavigation();

    const options = useSelector((state) => state.shop.options);

    const [selectedBrand, setSelectedBrand] = useState<Brand | undefined>();
    const [selectedCategory, setSelectedCategory] = useState<
      Category | undefined
    >();
    const [selectedGender, setSelectedGender] = useState<string | undefined>();
    const [selectedSize, setSelectedSize] = useState<Size | undefined>();
    const [quality, setQuality] = useState<Quality | undefined>();

    const [activeIndex, setActiveIndex] = useState<number>(1);
    const CameraSheetRef = useRef<any>();
    const onCameraSheetRefOpen = () => CameraSheetRef.current.open();
    const onCameraSheetRefClose = () => CameraSheetRef.current.close();
    const ImagePreviewRef = useRef<any>();
    const onImagePreviewOpen = () => ImagePreviewRef.current.open();
    const onImagePreviewClose = () => ImagePreviewRef.current.close();

    const [imageSide, setImageSide] = useState<string>('FRONT');
    const [selectItem, setselectedItem] = useState<any>();
    const [selectedImage, setSelectedImage] = useState<any>('');

    const [items, setItems] = useState([]);
    const bundleProperties = getBundleProperties(bundleItems, options);

    const temp = {
      title: 'My Bundle',
      tags: [],
      description: 'No Description',
      seller_price: 0,
    };

    const dispatch = useDispatch();

    const [shoesSizes, setShoesSizes] = useState([]);
    const [clothingSizes, setClothingSizes] = useState([]);
    useEffect(() => {
      if (options && options.sizes && options.sizes.length !== 0) {
        const shoes = [];
        const clothings = [];

        options.sizes.map((item) => {
          if (item.name === 'Shoes') {
            shoes.push(item);
          }
          if (item.name === 'Clothing') {
            clothings.push(item);
          }
        });
        setShoesSizes(shoes);
        setClothingSizes(clothings);
      }
    }, [options, items]);

    const [loading, setLoading] = useState(false);
    const [addLoding, setAddLoading] = useState(false);

    useEffect(() => {
      setFormdata(new FormData());
      if (type == BOTTOM_SHEET_TYPE.EDIT) {
        if (selectedItem) {
          const { brand, gender, category, size, quality, images } =
            selectedItem;
          images.length > 0 &&
            setSelectedImage({
              uri: getImageUrl(images[0]),
              id: images[0]?.id,
            });
          if (
            category &&
            category.name &&
            brand &&
            brand.name &&
            size &&
            size.name
          ) {
            setSelectedBrand(brand);
            setSelectedCategory(category);
            setSelectedSize(size);
          } else {
            let filterSize = [];
            options &&
              options.sizes &&
              options.sizes.length > 0 &&
              options.sizes.map((item) => {
                if (item.id === size) {
                  filterSize.push(item);
                } else {
                  item.children.map((children_item) => {
                    if (children_item.id === size) {
                      filterSize.push(children_item);
                    }
                  });
                }
              });
            setSelectedSize(filterSize[0]);
            const currentBrand = bundleProperties.brands.find(
              (item) => item.id == brand
            );
            const currentCategory = bundleProperties.categories.find(
              (item) => item.id == category
            );
            setSelectedBrand(currentBrand);
            setSelectedCategory(currentCategory);
          }
          // setFrontImage(image_large || front_image_small);
          // setBackImage(back_image_large || back_image_small);
          setItems(images);
          setSelectedGender(gender);
          const selectedQuality = qualities.find((q) => q.id === quality);
          setQuality(selectedQuality);
        }
      } else {
        setSelectedBrand(undefined);
        setSelectedCategory(undefined);
        setSelectedGender(undefined);
        setSelectedSize(undefined);
        setQuality(undefined);
      }
    }, [type, options]);

    useEffect(() => {
      let data = {
        image_large: firstImage?.base64,
        uri: firstImage?.uri,
      };

      if (firstImage && firstImage.id) {
        data.id = firstImage.id;
      }

      if (data && !data.uri) {
        data.uri = getImageUrl(data);
      }

      if (data.image_large !== '' || data.id) {
        setSelectedImage({
          uri: data.uri,
          base64: data.image_large,
        });
        setItems([data]);
      }
    }, [firstImage]);

    const initialize = () => {
      setSelectedImage('');
      setItems([]);
      setInitialType();
    };

    const showNotification = () => {
      if (selectedGender === undefined) {
        showErrorNotification(ERROR_MESSAGE.SELECT_GENDER);
      } else if (selectedCategory === undefined) {
        showErrorNotification(ERROR_MESSAGE.SELECT_CATEGORY);
      } else if (selectedSize === undefined) {
        showErrorNotification(ERROR_MESSAGE.SELECT_SIZE);
      } else if (selectedBrand === undefined) {
        showErrorNotification(ERROR_MESSAGE.SELECT_BRAND);
      } else if (quality === undefined) {
        showErrorNotification(ERROR_MESSAGE.SELECT_CONDITION);
      } else {
        return false;
      }
      return true;
    };
    const addAnother = () => {
      isBackToScreen(true);
      if (!showNotification()) {
        const data = {
          category: selectedCategory?.id,
          brand: selectedBrand?.id,
          size: selectedSize?.id,
          gender: selectedGender,
          quality: quality?.id,
          images: createListingImageJson(items),
        };

        if (screen && id) {
          onAddAnother(id, data);
          setAddLoading(false);
        } else {
          setAddLoading(true);
          let req = {
            data: temp,
            onSuccess: (res) => {
              onAddAnother(res.id, data);
              setAddLoading(false);
            },
            onFail: (err) => {
              console.log('Fail', err);
              setAddLoading(false);
            },
          };
          dispatch(createNewBundle(req));
        }

        initialize();
      }
    };

    const createListingImageJson = (items) => {
      return items.map((each) => {
        const { id, image_large } = each;
        return id ? { id } : { image_large };
      });
    };

    const add = (pk) => {
      const data = {
        category: selectedCategory?.id,
        brand: selectedBrand?.id,
        size: selectedSize?.id,
        gender: selectedGender,
        quality: quality?.id,
        images: createListingImageJson(items),
      };

      onAdd(pk, data);
      initialize();
    };

    const createNewBundleData = async () => {
      setCandidateImage(null);
      setCandidateImageWithRB(null);
      isBackToScreen(true);
      if (!showNotification()) {
        if (screen && id) {
          add(id);
        } else {
          setLoading(true);
          let req = {
            data: temp,
            onSuccess: (res) => {
              add(res.id);
              setLoading(false);
            },
            onFail: (err) => {
              console.log('Fail', err);
              setLoading(false);
            },
          };
          dispatch(createNewBundle(req));
        }
      }
    };

    const onClose = () => {
      initialize();
      onSheetlose();
    };
    const update = () => {
      isBackToScreen(true);

      const { id } = selectedItem;

      const data = {
        category: selectedCategory?.id,
        brand: selectedBrand?.id,
        size: selectedSize?.id,
        gender: selectedGender,
        quality: quality?.id,
        images: createListingImageJson(items),
      };
      onUpdate(data, id);
      initialize();
    };
    const askPermissionsAsync = async () => {
      await Camera.requestCameraPermissionsAsync();
      await MediaLibrary.requestPermissionsAsync();
    };

    const _attachImage = async (asset: any, side: string) => {
      const dd = {
        uri: asset.uri,
        base64: asset.base64,
        name:
          randomstring() + '.' + mimes.extension(mimes.lookup(asset.uri) || ''),
        type: mimes.lookup(asset.uri),
      };

      setSelectedImage({
        uri: asset.uri ? asset.uri : getImageUrl(asset),
        base64: asset.base64,
      });
      let data;
      if (asset.base64) {
        data = {
          image_large: asset.base64,
          uri: asset.uri,
        };
      } else if (asset.id) {
        data = {
          id: asset.id,
          uri: getImageUrl(asset),
        };
      }
      if (editImage) {
        const index = items.findIndex((ele) => ele?.uri === selectedImage.uri);
        const arr = [...items];
        arr.splice(index, 1, data);
        setItems(arr);
        setEditImage(false);
      } else {
        const arr = [...items, data];
        setItems(arr);
      }
    };

    const removeBackgroundImage = async () => {
      setloadingRemoveBackground(true);
      const data = {
        image_large: undefined,
        pk: selectedItem.id,
        id: candidateImage.id,
      };

      if (!data.id) {
        data.image_large = candidateImage.base64;
      }
      let req = {
        data,
        onSuccess: (res) => {
          console.log(res);
          dispatch(poolForRemoveBackground(res.id));
          console.log('success');
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
        console.log(
          'removeBackgroundState.image_id',
          removeBackgroundState.image_id
        );
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
    }, [
      removeBackgroundState.imageIDSucess,
      removeBackgroundState.imageIDData,
    ]);

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
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        base64: false,
      });
      if (!result.canceled && result.assets) {
        await _attachImage(result.assets[0], side);
      }
    };
    const onCameraPressed = (side: string) => {
      onCameraSheetRefOpen();
      // if (Platform.OS === 'android') {
      //   Alert.alert('', '', [
      //     {
      //       text: 'Take a picture from the folder',
      //       onPress: () => runGalleryAsync(side),
      //     },
      //     {
      //       text: 'Take photos from the camera',
      //       onPress: () => takePhotoAsync(side),
      //     },
      //   ]);
      // } else {
      //   ActionSheetIOS.showActionSheetWithOptions(
      //     {
      //       options: [
      //         'Take photos from the camera',
      //         'Take a picture from the folder',
      //         'cancel',
      //       ],
      //       cancelButtonIndex: 2,
      //     },
      //     (buttonIndex: any) => {
      //       if (buttonIndex === 0) {
      //         takePhotoAsync(side);
      //       } else if (buttonIndex === 1) {
      //         runGalleryAsync(side);
      //       }
      //     }
      //   );
      // }
    };

    const onNext = (imageData: any) => {
      setCandidateImage(imageData);
      setCandidateImageWithRB(null);
      onImagePreviewOpen();
    };

    const changePic = (uri: string, base_64: string, id?: number) => {
      setSelectedImage({
        uri: uri,
        base64: base_64,
        id: id,
      });
    };
    const setImage = () => {
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
            source={
              selectedImage?.uri
                ? { uri: selectedImage.uri }
                : require('@app/assets/images/empty.png')
            }
          />
        </View>
      );
    };
    const addBrandData = (brandName) => {
      let brandObj = {
        item: brandName,
        onSuccess: (res) => {
          if ((res && res.statusCode === 201) || res.statusCode === 200) {
            Alert.alert(
              'Brand Under Review.',
              'Your suggested brand is under review and our team will review',
              [
                {
                  text: 'Cancel',
                  onPress: () => {
                    setSelectedBrand(undefined);
                    brandRef &&
                      brandRef.current &&
                      brandRef.current._toggleSelector();
                    dispatch(applyFilter());
                  },
                  style: 'destructive',
                },
              ],
              { cancelable: false }
            );
          } else if (res && res.statusCode === 400) {
            Alert.alert(
              'Already Added.',
              'A brand with that name already exists and is in review',
              [
                {
                  text: 'Cancel',
                  onPress: () => console.log('Cancel Pressed'),
                  style: 'destructive',
                },
              ],
              { cancelable: false }
            );
          }
        },
        onFail: (err) => {},
      };
      dispatch(addSuggestBrand(brandObj));
    };

    const onSanptoIndex = (index: number) => {
      setActiveIndex(loading ? items.length : index);
    };

    const handleAddSearchTerm = (searchTerm) => {
      var RandomNumber = Math.floor(Math.random() * 100) + 1;
      let brandObj = {
        // id: RandomNumber,
        name: searchTerm,
      };
      Alert.alert(
        'Alert',
        'Do you want to suggest?',
        [
          {
            text: 'Yes',
            onPress: () => {
              addBrandData(brandObj);
            },
          },
          {
            text: 'No',
            onPress: () => console.log('Cancel Pressed'),
            style: 'destructive',
          },
        ],
        { cancelable: false }
      );

      // use endpoint: /items/options/brands/suggest
      // this is not how you'd want to generate an id in a real scenario.
      // const id = (this.termId += 1);
      // if (
      //   searchTerm.length &&
      //   !(this.state.items || []).some((item) => item.title.includes(searchTerm))
      // ) {
      //   const newItem = { id, title: searchTerm };
      //   this.setState((prevState) => ({ items: [...(prevState.items || []), newItem] }));
      //   this.onSelectedItemsChange([...this.state.selectedItems, id]);
      //   this.SectionedMultiSelect._submitSelection();
      // }
    };

    const onDeleteItem = () => {
      const ind = items.findIndex((ele) => ele?.uri === selectedImage.uri);
      items.splice(ind, 1);
      setselectedItem(items);
      var last = items.slice(-1)[0];
      setSelectedImage({ uri: last?.uri, base64: last?.image_large });
    };

    const onEditItem = () => {
      setCandidateImage(selectedImage);
      onImagePreviewOpen();
    };

    const searchAdornment = (searchTerm) => {
      return searchTerm.length ? (
        <TouchableOpacity
          style={{ alignItems: 'center', justifyContent: 'center' }}
          onPress={() => handleAddSearchTerm(searchTerm)}
        >
          <View style={{ flex: 1, flexDirection: 'row', margin: 5 }}>
            <Text style={{ fontSize: 24, color: ThemeStatic.accent }}>
              Add missing brand
            </Text>
            <FontAwesome
              name="plus-circle"
              type="FontAwesome"
              size={24}
              style={{ fontSize: 24, color: ThemeStatic.accent }}
            />
          </View>
        </TouchableOpacity>
      ) : null;
    };

    // includes +1 for the add image button
    let rendered_items = [...items, {}];
    let paginationImages = (
      <FlatList
        bounces={false}
        showsVerticalScrollIndicator={false}
        data={rendered_items}
        numColumns={4}
        extraData={rendered_items}
        renderItem={({ index, item }) => {
          if (index < rendered_items.length - 1) {
            let uri = item.uri;
            let base_64 = item.image_large;
            if (!uri) {
              uri = getImageUrl(item);
            }
            return (
              <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity
                  style={[
                    styles().paginationImageStyle,
                    {
                      justifyContent: 'center',
                      alignItems: 'center',
                    },
                  ]}
                  activeOpacity={0.75}
                  onPress={() => changePic(uri, base_64, item.id)}
                >
                  <Image
                    style={[styles().paginationImageStyle]}
                    source={
                      uri ? { uri } : require('@app/assets/images/empty.png')
                    }
                  />
                </TouchableOpacity>
              </View>
            );
          } else {
            return (
              <>
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
                      <Text style={{ color: 'white', fontSize: 11 }}>
                        Add photo
                      </Text>
                      <Text style={{ color: 'white', fontSize: 11 }}>
                        (same item)
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
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
                    onPress={
                      type !== BOTTOM_SHEET_TYPE.EDIT ? addAnother : update
                    }
                    accessibilityLabel={'Add Image'}
                  >
                    <MaterialIcons
                      name="arrow-forward"
                      size={18}
                      style={{
                        padding: 2,
                        fontSize: 28,
                        color: 'white',
                      }}
                    />
                    <View style={{ alignItems: 'center' }}>
                      <Text style={{ color: 'white', fontSize: 11 }}>
                        List next
                      </Text>
                      <Text style={{ color: 'white', fontSize: 11 }}>
                        bundle item
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </>
            );
          }
        }}
        style={{}}
        keyExtractor={(item, index) => index.toString()}
      />
    );

    useEffect(() => {
      if (editImage) {
        onEditItem();
      }
    }, [editImage]);

    let content = (
      <>
        <View style={styles().subContainer}>
          <View
            style={{
              flexDirection: 'row',
              height: (width - 20) * ratio + 20,
              width: width - 20,
            }}
          >
            <TouchableOpacity
              style={{
                flexDirection: 'column',
                flex: 1,
                margin: 5,
                justifyContent: 'center',
              }}
            >
              {setImage()}
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles().editIcon,
                styles().iconStyle,
                items.length > 0 ? styles().displayFlex : styles().displayNone,
              ]}
              onPress={() => {
                items.length > 0 && setEditImage(true);
              }}
            >
              <FontAwesome
                name="edit"
                type="FontAwesome"
                size={30}
                style={{ fontSize: 20, color: ThemeStatic.accent }}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onDeleteItem}
              style={[
                styles().deleteIcon,
                styles().iconStyle,
                items.length > 0 ? styles().displayFlex : styles().displayNone,
              ]}
              accessibilityLabel={'sellingBottom_delete'}
            >
              <FontAwesome
                name="trash"
                type="FontAwesome"
                size={30}
                style={{ fontSize: 20, color: ThemeStatic.accent }}
              />
            </TouchableOpacity>
          </View>
        </View>

        {paginationImages}
        <View>
          {/* <Form> */}
          <View>
            <Text style={styles().dropDownText}>Gender</Text>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-around',
                marginVertical: 5,
              }}
            >
              {genders.map((item) => {
                return (
                  <NativeBaseBtn
                    key={item.id}
                    size="sm"
                    colorScheme={item.color}
                    variant={selectedGender === item.id ? 'solid' : 'outline'}
                    style={{
                      borderRadius: 7,
                    }}
                    _text={{
                      fontWeight: 'bold',
                      paddingX: 2,
                    }}
                    onPress={() => setSelectedGender(item.id)}
                  >
                    {item.name}
                  </NativeBaseBtn>
                );
              })}
            </View>
          </View>
          {/* </Form>
          <Form> */}
          <View>
            <SectionedMultiSelect
              IconRenderer={MaterialIcons}
              single={true}
              items={
                options && options.categories && options.categories.length > 0
                  ? options.categories
                  : []
              }
              uniqueKey="name"
              subKey="children"
              selectText="Category"
              renderSelectText={() => (
                <View
                  style={[
                    styles().dropDown,
                    {
                      alignItems:
                        selectedCategory === undefined
                          ? 'flex-start'
                          : 'flex-end',
                    },
                  ]}
                  accessibilityLabel={'sellingBottom_category'}
                >
                  <Text style={styles().dropDownText}>Category</Text>
                  <Text
                    style={[
                      styles().dropDownText,
                      { marginRight: 25, textAlign: 'right' },
                    ]}
                  >
                    {selectedCategory?.name ?? null}
                  </Text>
                </View>
              )}
              showDropDowns={true}
              readOnlyHeadings={true}
              onSelectedItemsChange={(obj) => {
                setSelectedCategory(obj[0]);
              }}
              onSelectedItemObjectsChange={(obj) => {
                setSelectedCategory(obj[0]);
              }}
              selectedItems={[selectedCategory]}
              colors={{ primary: ThemeStatic.accent }}
              modalWithSafeAreaView
              hideConfirm
              modalWithTouchable
              searchPlaceholderText="Search Category"
              styles={{
                selectToggle: {
                  borderBottomColor: ThemeStatic.accentLight,
                  borderBottomWidth: 0.8,
                  paddingVertical: 12,
                  alignItems: 'center',
                  alignContent: 'center',
                },
              }}
            />
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}
            >
              {bundleProperties?.categories?.map((category) => {
                if (category.id !== selectedCategory?.id)
                  return (
                    <Button
                      key={category.id}
                      labelStyle={[{ color: '#eee', fontSize: 14 }]}
                      label={category.name}
                      containerStyle={{
                        ...styles().buttonSmallStyle,
                        backgroundColor: '#FF6520',
                      }}
                      onPress={() => setSelectedCategory(category)}
                    />
                  );
              })}
            </ScrollView>
          </View>
          {/* </Form>
          <Form> */}
          <View>
            <SectionedMultiSelect
              IconRenderer={MaterialIcons}
              single={true}
              items={
                selectedCategory?.name === 'Baby Shoes'
                  ? shoesSizes
                  : clothingSizes
              }
              uniqueKey="name"
              subKey="children"
              selectText="Size"
              showDropDowns={true}
              readOnlyHeadings={false}
              onSelectedItemsChange={(obj) => setSelectedSize(obj[0])}
              renderSelectText={() => (
                <View
                  style={[
                    styles().dropDown,
                    {
                      alignItems: 'flex-start',
                    },
                  ]}
                  accessibilityLabel={'sellingBottom_size'}
                >
                  <Text style={styles().dropDownText}>Size</Text>
                  <Text
                    style={[
                      styles().dropDownText,
                      { marginRight: 25, textAlign: 'right' },
                    ]}
                  >
                    {selectedSize?.name ?? null}
                  </Text>
                </View>
              )}
              selectedItems={[selectedSize]}
              onSelectedItemObjectsChange={(obj) => {
                setSelectedSize(obj[0]);
              }}
              colors={{ primary: ThemeStatic.accent }}
              expandDropDowns
              hideConfirm
              hideSearch
              modalWithTouchable
              modalWithSafeAreaView
              itemNumberOfLines={2}
              styles={{
                selectToggle: {
                  borderBottomColor: ThemeStatic.accentLight,
                  borderBottomWidth: 0.8,
                  paddingVertical: 12,
                },
                selectToggleText: {
                  textAlign: 'right',
                  marginRight: 10,
                },
              }}
            />
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}
            >
              {bundleProperties?.sizes?.map((size) => {
                if (size.id !== selectedSize?.id)
                  return (
                    <Button
                      key={size.id}
                      labelStyle={[{ color: '#222', fontSize: 14 }]}
                      label={size.name}
                      containerStyle={{
                        ...styles().buttonSmallStyle,
                        backgroundColor: '#FFD620',
                      }}
                      onPress={() => setSelectedSize(size)}
                    />
                  );
              })}
            </ScrollView>
          </View>
          {/* </Form>
          <Form> */}
          <View accessibilityLabel={'sellingBottom_brand'} accessible={true}>
            <SectionedMultiSelect
              ref={brandRef}
              IconRenderer={MaterialIcons}
              single={true}
              items={
                options && options.brands && options.brands.length > 0
                  ? (() => {
                      let selectedBrands = [
                        'Unknown',
                        'SelectedBrand2',
                        'SelectedBrand3',
                        'SelectedBrand4',
                      ]; // Add the selected brands in the preferred display order
                      let selectedBrandsDict = {}; // Dictionary for constant-time lookup

                      // Automatically assign order for brands based on their appearance in the selectedBrands array
                      selectedBrands.forEach((brand, index) => {
                        selectedBrandsDict[brand] = index;
                      });
                      let selectedBrandsObjects: Brand[] = [];
                      let otherBrandsObjects: Brand[] = [];

                      options.brands.forEach((brand: Brand) => {
                        const modifiedBrand: Brand = {
                          ...brand,
                          name: brand.suggested
                            ? brand.name + ' (pending review)'
                            : brand.name,
                        };

                        // Check if the brand's name is in the dictionary
                        if (brand.name in selectedBrandsDict) {
                          selectedBrandsObjects.push(modifiedBrand);
                        } else {
                          otherBrandsObjects.push(modifiedBrand);
                        }
                      });
                      // Sort selectedBrands based on the order
                      selectedBrandsObjects.sort((a, b) => {
                        const aName =
                          a.name in selectedBrandsDict
                            ? a.name
                            : getOriginalName(a.name);
                        const bName =
                          b.name in selectedBrandsDict
                            ? b.name
                            : getOriginalName(b.name);
                        return (
                          selectedBrandsDict[aName] - selectedBrandsDict[bName]
                        );
                      });

                      function getOriginalName(name) {
                        return name.replace(' (pending review)', '');
                      }
                      return [...selectedBrandsObjects, ...otherBrandsObjects];
                    })()
                  : []
              }
              uniqueKey="name"
              subKey="children"
              selectText="Brand"
              showDropDowns={true}
              readOnlyHeadings={false}
              onSelectedItemsChange={(obj) => {
                setSelectedBrand(obj[0]);
              }}
              onSelectedItemObjectsChange={(obj) => {
                setSelectedBrand(obj[0]);
              }}
              renderSelectText={() => (
                <View
                  style={[
                    styles().dropDown,
                    {
                      alignItems:
                        selectedBrand === undefined ? 'flex-start' : 'flex-end',
                    },
                  ]}
                >
                  <Text style={styles().dropDownText}>Brand</Text>
                  <Text
                    style={[
                      styles().dropDownText,
                      { marginRight: 25, textAlign: 'right' },
                    ]}
                  >
                    {selectedBrand?.name ?? null}
                  </Text>
                </View>
              )}
              selectedItems={[selectedBrand]}
              colors={{ primary: ThemeStatic.accent }}
              expandDropDowns
              modalWithSafeAreaView
              hideConfirm
              modalWithTouchable
              searchPlaceholderText="Search Brands"
              searchAdornment={(searchTerm) => searchAdornment(searchTerm)}
              styles={{
                selectToggle: {
                  borderBottomColor: ThemeStatic.accentLight,
                  borderBottomWidth: 0.8,
                  paddingVertical: 12,
                },
                selectToggleText: {
                  textAlign: 'right',
                  marginRight: 10,
                },
              }}
            />
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}
            >
              {bundleProperties?.brands?.map((brand) => {
                if (brand.id !== selectedBrand?.id)
                  return (
                    <Button
                      key={brand.id}
                      labelStyle={[{ color: '#eee', fontSize: 14 }]}
                      label={brand.name}
                      containerStyle={{
                        ...styles().buttonSmallStyle,
                        backgroundColor: '#17BC7E',
                      }}
                      onPress={() => setSelectedBrand(brand)}
                    />
                  );
              })}
            </ScrollView>
          </View>
          {/* </Form>
          <Form> */}
          <View
            accessibilityLabel={'sellingBottom_condition'}
            accessible={true}
          >
            <SectionedMultiSelect
              IconRenderer={MaterialIcons}
              single={true}
              items={qualities}
              uniqueKey="id"
              subKey="children"
              selectText={'Condition'}
              selectedText=""
              showDropDowns={true}
              selectChildren={true}
              readOnlyHeadings={false}
              onSelectedItemsChange={(obj) => {
                setQuality(obj[0]);
              }}
              selectedItems={[quality]}
              renderSelectText={() => (
                <View
                  style={[
                    styles().dropDown,
                    {
                      alignItems:
                        quality === undefined ? 'flex-start' : 'flex-end',
                    },
                  ]}
                  accessibilityLabel={'sellingBottom_condition'}
                >
                  <Text style={styles().dropDownText}>Condition</Text>
                  <Text
                    style={[
                      styles().dropDownText,
                      { marginRight: 25, textAlign: 'right' },
                    ]}
                  >
                    {quality?.name ?? null}
                  </Text>
                </View>
              )}
              onSelectedItemObjectsChange={(obj) => {
                setQuality(obj[0]);
              }}
              colors={{ primary: ThemeStatic.accent }}
              expandDropDowns
              hideConfirm
              hideSearch
              modalWithTouchable
              styles={{
                selectToggle: {
                  borderBottomColor: ThemeStatic.accentLight,
                  borderBottomWidth: 0.8,
                  paddingVertical: 12,
                },
                selectToggleText: {
                  textAlign: 'right',
                  marginRight: 10,
                },
                modalWrapper: { justifyContent: 'center' },
                container: { flex: 0.3, flexDirection: 'row' },
              }}
            />
          </View>
          {/* </Form> */}
        </View>
      </>
    );
    const modalComponent = [
      {
        data: [
          {
            key: 'modalComponent',
            component: (
              <>
                <BottomSheetHeader
                  heading={
                    type == BOTTOM_SHEET_TYPE.NEW
                      ? SHEET_HEADER.NEW
                      : SHEET_HEADER.EDIT
                  }
                  subHeading=""
                />
                <View>{content}</View>
                <View style={[styles(theme).subContent, { marginTop: 20 }]}>
                  {addLoding ? (
                    <Spinner
                      color={ThemeStatic.accent}
                      style={[styles().buttonStyle]}
                    />
                  ) : (
                    <>
                      <Button
                        label={
                          type !== BOTTOM_SHEET_TYPE.EDIT
                            ? BUTTON_LABEL.ADD_ANOTHER
                            : BUTTON_LABEL.UPDATE
                        }
                        labelStyle={[
                          styles().typeText,
                          { color: ThemeStatic.white },
                        ]}
                        onPress={
                          type !== BOTTOM_SHEET_TYPE.EDIT ? addAnother : update
                        }
                        containerStyle={[styles().buttonStyle]}
                      />
                    </>
                  )}
                </View>
                <View style={[styles(theme).subContent, { marginTop: 0 }]}>
                  {loading ? (
                    <Spinner
                      color={ThemeStatic.accent}
                      style={[styles().buttonStyle]}
                    />
                  ) : (
                    <>
                      <Button
                        label={
                          type !== BOTTOM_SHEET_TYPE.EDIT
                            ? BUTTON_LABEL.DONE
                            : BUTTON_LABEL.CANCEL
                        }
                        labelStyle={[
                          styles().typeText,
                          { color: ThemeStatic.white },
                        ]}
                        onPress={
                          type !== BOTTOM_SHEET_TYPE.EDIT
                            ? createNewBundleData
                            : onClose
                        }
                        containerStyle={[styles().buttonStyle]}
                      />
                    </>
                  )}
                </View>
              </>
            ),
          },
        ],
      },
    ];
    return (
      <>
        <Modalize
          //@ts-ignore
          ref={ref}
          sectionListProps={{
            sections: modalComponent,
            renderItem: ({ item }) => item.component,
            showsVerticalScrollIndicator: false,
          }}
          modalStyle={styles(theme).container}
          onClosed={() => {
            if (isAddBack && !isBack) {
              goBack();
              onAddBackToScreen(false);
              isBackToScreen(false);
            } else {
              initialize();
            }
          }}
        />
        <CameraBottomSheet
          ref={CameraSheetRef}
          onSheetClose={() => {
            onCameraSheetRefClose();
          }}
          onNext={onNext}
          setInitialSide={(type: string) => setImageSide(type)}
          currentItem={currentItem}
          currentImage={items.length + 1}
          visible={true}
          callComponent={'SellingDetailBottomSheet'}
        />
        <ImagePreviewScreen
          ref={ImagePreviewRef}
          imageDataProp={candidateImage}
          imageDataWithRB={candidateImageRB}
          onApprove={(imageData: any) => {
            _attachImage(imageData, 'front');
            setFrontImage(imageData);
            setCandidateImageWithRB(null);
            onCameraSheetRefClose();
          }}
          onSheetClose={() => {
            onImagePreviewClose();
            setCandidateImage(null);
            setCandidateImageWithRB(null);
            if (editImage) {
              setEditImage(false);
            }
          }}
          onClose={() => {
            onImagePreviewClose();
            setCandidateImage(null);
            setCandidateImageWithRB(null);
            if (editImage) {
              setEditImage(false);
            }
          }}
          removeBackground={() => {
            removeBackgroundImage();
          }}
          loader={loadingRemoveBackground}
        />
      </>
    );
  }
);

const styles = (theme = {} as ThemeColors) =>
  StyleSheet.create({
    container: {
      padding: 20,
      marginTop: 70,
      backgroundColor: theme.base,
      flex: 1,
    },
    subContent: {
      justifyContent: 'space-between',
      flexDirection: 'row',
    },
    typeText: {
      ...FontWeights.Bold,
      ...FontSizes.Caption,
      color: theme.text01,
      textAlign: 'center',
    },
    buttonStyle: {
      flex: 1,
      marginHorizontal: 5,
      height: 30,
      paddingVertical: 0,
      marginBottom: 16,
    },
    buttonSmallStyle: {
      width: undefined,
      borderRadius: 4,
      borderWidth: 0,
      height: 20,
      backgroundColor: ThemeStatic.accent,
      paddingVertical: 2,
      paddingHorizontal: 6,
      margin: 2,
    },
    label: {
      ...FontWeights.Light,
      ...FontSizes.Body,
      width: responsiveWidth(74),
      color: theme.text01,
    },
    subTitle: {
      ...FontWeights.Light,
      ...FontSizes.Body,
      width: responsiveWidth(74),
      color: theme.text01,
    },
    imageStyle: {
      height: (width - 40) * ratio,
      width: width - 40,
      resizeMode: 'contain',
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
    dropDown: {
      width: '90%',
      flexDirection: 'row',
    },
    dropDownText: {
      flex: 1,
      fontSize: 16,
    },
    paginationImageStyle: {
      width: screenWidth / 5 - 4,
      height: screenWidth / 5 + 4,
      margin: 2,
      resizeMode: 'contain',
    },
    deleteIcon: {
      right: 5,
      width: 50,
      height: 20,
      bottom: -4,
    },
    editIcon: {
      left: 5,
      width: 50,
      height: 20,
      bottom: -4,
    },
    iconStyle: {
      justifyContent: 'center',
      alignItems: 'center',
      position: 'absolute',
    },
    displayNone: {
      display: 'none',
    },
    displayFlex: {
      display: 'flex',
    },
  });

export default SellingDetailBottomSheet;
