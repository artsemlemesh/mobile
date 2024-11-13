import React, {
  useContext,
  useRef,
  useEffect,
  useState,
  createRef,
} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  Alert,
  ActionSheetIOS,
  Platform,
  Image,
} from 'react-native';
import { Modalize } from 'react-native-modalize';
import { responsiveWidth } from 'react-native-responsive-dimensions';
import { Button } from '@app/layout';
import { AppContext } from '@app/context';
import { BottomSheetHeader } from '@app/layout';
import { ThemeStatic, Typography } from '@app/theme';
import { ThemeColors } from '@app/types/theme';
import * as ImagePicker from 'expo-image-picker';
import { ImageInfo } from 'expo-image-picker/build/ImagePicker.types';
import { Camera } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import {
  SizePicker,
  GenderPicker,
  CategoryPicker,
  BrandPicker,
} from '../../ListingItem/components/molecules';
const { width, height } = Dimensions.get('window');
const ratio = width / height;

const { FontWeights, FontSizes } = Typography;

interface BottomSheetProps {
  ref: React.Ref<any>;
  item: any;
  onSheetlose: () => void;
  onAdd: (item: any) => void;
}

const BottomSheet: React.FC<BottomSheetProps> = React.forwardRef(
  ({ onSheetlose, item, onAdd }, ref) => {
    const { theme } = useContext(AppContext);
    const [frontImage, setFrontImage] = useState(item.frontImage || '');
    const [backImage, setBackImage] = useState('');
    const [category, setCategory] = useState('');
    const [selectedGender, setGender] = useState('');
    const [selectedBrand, setBrand] = useState('');
    const [selectedSize, setSize] = useState('');

    const initialize = () => {
      setFrontImage('');
      setBackImage('');
    };
    const onChangeCategory = (item: string) => {
      setCategory(item);
    };
    const onChangeGender = (item: string) => {
      setGender(item);
    };
    const onChangeBrand = (item: string) => {
      setBrand(item);
    };
    const onChangeSize = (item: string) => {
      setSize(item);
    };
    const add = () => {
      let item = {
        category: category,
        brand: selectedBrand,
        condition: selectedSize,

        image_front: frontImage,
        image_back: backImage,
      };
      onAdd(item);
      initialize();
    };
    const askPermissionsAsync = async () => {
      await Camera.requestCameraPermissionsAsync();
      await MediaLibrary.requestPermissionsAsync();
    };
    const _attachImage = async (
      asset: ImagePicker.ImagePickerAsset,
      side: string
    ) => {
      if (side === 'front') setFrontImage(asset.uri);
      else setBackImage(asset.uri);
      //this.props.updateProfilePhotos(asset.uri)
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
            {/* {componentDelete(index)} */}
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
            {/* {componentDelete(index)} */}
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
            source={require('@app/assets/images/tshirt.png')}
          />
          {/* {componentDelete(index)} */}
        </View>
      );
    };
    let content = (
      <>
        <View style={styles().subContainer}>
          <View
            style={{
              flexDirection: 'row',
              height: (width - 20) * ratio + 20,
              width: width - 20,
              backgroundColor: 'gray',
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
        <View style={[styles().subContainer, { padding: 20 }]}>
          <CategoryPicker
            selectedValue={category}
            onValueChange={onChangeCategory}
          />
          <GenderPicker
            selectedValue={selectedGender}
            onValueChange={onChangeGender}
          />
          <BrandPicker
            selectedValue={selectedBrand}
            onValueChange={onChangeBrand}
          />
          <SizePicker
            selectedValue={selectedSize}
            onValueChange={onChangeSize}
          />
        </View>
      </>
    );
    return (
      <Modalize
        //@ts-ignore
        ref={ref}
        scrollViewProps={{ showsVerticalScrollIndicator: false }}
        modalStyle={styles(theme).container}
      >
        <BottomSheetHeader heading="Add New Item to Bundle" subHeading="" />
        <View style={styles().content}>{content}</View>
        <View
          style={[
            styles(theme).subContent,
            { marginTop: 20, paddingBottom: 50 },
          ]}
        >
          <Button
            label={'Cancel'}
            labelStyle={[styles().typeText, { color: ThemeStatic.white }]}
            onPress={onSheetlose}
            containerStyle={[styles().buttonStyle]}
          />
          <Button
            label={'Add'}
            labelStyle={[styles().typeText, { color: ThemeStatic.white }]}
            onPress={add}
            containerStyle={[styles().buttonStyle]}
          />
        </View>
      </Modalize>
    );
  }
);

const styles = (theme = {} as ThemeColors) =>
  StyleSheet.create({
    container: {
      padding: 20,
      backgroundColor: theme.base,
    },
    content: {
      paddingTop: 20,
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
      width: (width - 40) / 2,
      resizeMode: 'stretch',
    },
    subContainer: {
      shadowOffset: { height: 5 },
      shadowOpacity: 0.3,
      backgroundColor: 'white',
      paddingVertical: 20,
      marginBottom: 20,
      borderRadius: 5,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });

export default BottomSheet;
