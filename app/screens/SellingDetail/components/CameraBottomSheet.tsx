import React, { useContext, useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  Platform,
  Image,
  TouchableHighlight,
} from 'react-native';
import { Modalize } from 'react-native-modalize';
import { responsiveWidth } from 'react-native-responsive-dimensions';

import { AppContext } from '@app/context';
import mimes from 'react-native-mime-types';
import { ThemeStatic, Typography } from '@app/theme';
import { ThemeColors } from '@app/types/theme';
import * as ImagePicker from 'expo-image-picker';

import * as MediaLibrary from 'expo-media-library';
import * as ImageManipulator from 'expo-image-manipulator';
const images: {
  uri: string;
  base64: string | undefined;
  name: string;
  type: any;
}[] = [];

import randomstring from 'random-string';
import { Camera, CameraView } from 'expo-camera';

import { Feather, FontAwesome5 } from '@expo/vector-icons';
const { width, height } = Dimensions.get('window');

const maskRowHeightInner = Math.round(0.6 * height);
const aspectRatio = 3 / 4;
const ratio = width / height;

const { FontWeights, FontSizes } = Typography;

interface BottomSheetProps {
  ref: React.Ref<any>;
  onSheetClose: () => void;
  onNext: (imageData: any) => void;
  setInitialSide: (type: string) => void;
  currentItem: number | undefined;
  currentImage: number | undefined;
  visible: any;
  callComponent: string;
}

const CameraBottomSheet: React.FC<BottomSheetProps> = React.forwardRef(
  (
    {
      setInitialSide,
      onSheetClose,
      onNext,
      currentItem,
      currentImage,
      visible,
      callComponent,
    },
    ref
  ) => {
    const { theme } = useContext(AppContext);
    const [imageData, setImageData] = useState<any>(null);
    const [cameraRef, setCameraRef] = useState<any>(null);
    const [hasPermission, setHasPermission] = useState<boolean>(false);
    const [isCameraReady, setIsCameraReady] = useState<boolean>(false);
    const [cameraHeight, setCameraHeight] = useState<any>(null);
    const [cameraWidth, setCameraWidth] = useState<any>(null);
    const [cameraCroppedHeight, setCameraCroppedHeight] = useState<any>(null);
    const [cameraCroppedWidth, setCameraCroppedWidth] = useState<any>(null);
    const [cameraCroppedX, setCameraCroppedX] = useState<any>(null);
    const [cameraCroppedY, setCameraCroppedY] = useState<any>(null);
    const [isvisible, setisVisible] = useState<any>(visible);

    const onCameraReady = () => {
      setIsCameraReady(true);
    };

    useEffect(() => {
      (async () => {
        setImageData(null);
        const result = await Camera.requestCameraPermissionsAsync();
        setHasPermission(result.status === 'granted');
      })();
    }, [callComponent]);

    const initialize = () => {
      setInitialSide('FRONT');
    };

    const onClose = () => {
      // if (currentItem === 1) {
      //   deleteEmptyBundle();
      // }
      initialize();
      onSheetClose();
    };
    const askPermissionsAsync = async () => {
      await Camera.requestCameraPermissionsAsync();
      await MediaLibrary.requestPermissionsAsync();
    };

    const attachImage = async (asset: ImagePicker.ImagePickerAsset) => {
      const dd = {
        uri: asset.uri,
        base64: asset.base64,
        name:
          randomstring() + '.' + mimes.extension(mimes.lookup(asset.uri) || ''),
        type: mimes.lookup(asset.uri),
      };

      setImageData(dd);
      onNext(dd);
      return;
    };

    const runGalleryAsync = async () => {
      await askPermissionsAsync();
      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        base64: true,
      });
      if (!result.canceled && result.assets) {
        await attachImage(result.assets[0]);
      }
    };

    const cropImage = async (img) => {
      const originXRatio = (cameraWidth - cameraCroppedWidth) / 2 / cameraWidth;
      const originYRatio =
        (cameraHeight - cameraCroppedHeight) / 2 / cameraHeight;
      const widthRatio = cameraCroppedWidth / cameraWidth;
      const heightRatio = cameraCroppedHeight / cameraHeight;
      // if running on ios
      if (Platform.OS === 'ios') {
        const manipResult = await ImageManipulator.manipulateAsync(
          img.uri,
          [
            {
              crop: {
                originX: img.width
                  ? originXRatio * img.width
                  : originXRatio * cameraWidth,
                originY: img.height
                  ? originYRatio * img.height
                  : originYRatio * cameraHeight,
                width: img.width ? widthRatio * img.width : cameraCroppedWidth,
                height: img.height
                  ? heightRatio * img.height
                  : cameraCroppedHeight,
              },
            },
            { resize: { width: 600, height: 800 } },
          ],
          { compress: 1, format: ImageManipulator.SaveFormat.PNG, base64: true }
        );
        return manipResult;
      } else if (Platform.OS === 'android') {
        const manipResult = await ImageManipulator.manipulateAsync(
          img.uri,
          [
            {
              crop: {
                // originX: originXRatio * img.height,
                // originY: originYRatio * img.width,
                // width: widthRatio * img.height,
                // height: heightRatio * img.width

                originX: img.height
                  ? originXRatio * img.height
                  : originXRatio * cameraWidth,
                originY: img.width
                  ? originYRatio * img.width
                  : originYRatio * cameraHeight,
                width: img.height
                  ? widthRatio * img.height
                  : cameraCroppedWidth,
                height: img.width
                  ? heightRatio * img.width
                  : cameraCroppedHeight,
              },
            },
            { resize: { width: 600, height: 800 } },
          ],
          { compress: 1, format: ImageManipulator.SaveFormat.PNG, base64: true }
        );

        return manipResult;
      }
    };

    const onTakePhotoAsync = async () => {
      if (cameraRef) {
        let image = await cameraRef.takePictureAsync({
          quality: 1,
          exif: true,
          base64: true,
          skipProcessing: true,
        });
        image = await cropImage(image as any);
        await attachImage(image as any);
      }
    };

    useEffect(() => {
      if (imageData && imageData.length > 0) {
        setImage();
      }
    }, [imageData]);

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
              imageData.uri
                ? { uri: imageData.uri }
                : require('@app/assets/images/empty.png')
            }
          />
        </View>
      );
    };
    const measureView = (event) => {
      // console.log('measureView', event.nativeEvent.layout);
      setCameraHeight(Math.round(event.nativeEvent.layout.height));
      setCameraWidth(Math.round(event.nativeEvent.layout.width));
    };

    const measureViewCropped = (event) => {
      // console.log('measureViewCropped', event.nativeEvent.layout);
      setCameraCroppedX(Math.round(event.nativeEvent.layout.x));
      setCameraCroppedY(Math.round(event.nativeEvent.layout.y));
      setCameraCroppedHeight(Math.round(event.nativeEvent.layout.height));
      setCameraCroppedWidth(Math.round(event.nativeEvent.layout.width));
    };

    const content = () => {
      if (hasPermission == null) {
        return <View />;
      }
      if (hasPermission == false) {
        return <Text>No access to camera</Text>;
      }
      return (
        <View
          style={styles().cameraContainer}
          onLayout={(event) => measureView(event)}
        >
          <CameraView
            ref={(ref) => setCameraRef(ref)}
            onCameraReady={onCameraReady}
            style={{ flex: 1, justifyContent: 'flex-start' }}
          >
            <View style={styles().maskOuter}>
              <View
                style={[
                  { flex: 1, justifyContent: 'center' },
                  styles().maskRow,
                  styles().maskFrame,
                ]}
              >
                <View style={styles().cameraHeader}>
                  <Text
                    style={{ fontSize: 17, fontWeight: 'bold', color: 'white' }}
                  >
                    Photo {currentImage} of Item {currentItem}
                  </Text>
                  <Text style={{ fontSize: 12, color: 'white', marginTop: 6 }}>
                    {/* if first photo */}
                    {currentImage === 1 && (
                      <Text>Take a photo of the front of the item.</Text>
                    )}
                    {currentImage === 2 && (
                      <Text>Take a photo of the back of the item.</Text>
                    )}
                    {currentImage > 2 && (
                      <Text>Highlight any item details.</Text>
                    )}
                  </Text>
                  <Text style={{ fontSize: 12, color: 'white', marginTop: 3 }}>
                    Do not add multiple items in a photo.
                  </Text>
                </View>
              </View>
              <View
                style={[{ height: maskRowHeightInner }, styles().maskCenter]}
              >
                <View
                  style={[
                    { width: (width - maskRowHeightInner / 2) * aspectRatio },
                    styles().maskFrame,
                  ]}
                />
                <View
                  style={[
                    { width: maskRowHeightInner * aspectRatio },
                    styles().maskInner,
                  ]}
                  onLayout={(event) => measureViewCropped(event)}
                />
                <View
                  style={[
                    { width: (width - maskRowHeightInner / 2) * aspectRatio },
                    styles().maskFrame,
                  ]}
                />
              </View>
              <View
                style={[
                  { flex: 1, justifyContent: 'center' },
                  styles().maskRow,
                  styles().maskFrame,
                ]}
              >
                <View style={styles().cameraControlsContainer}>
                  <View style={styles().cameraControls}>
                    {visible ? (
                      <TouchableHighlight
                        style={styles().file}
                        onPress={() => {
                          runGalleryAsync();
                        }}
                        accessibilityLabel={'cameraBottom_gallery'}
                      >
                        <FontAwesome5
                          style={{ color: 'gray' }}
                          name="file-image"
                          type="FontAwesome5"
                          size={20}
                        />
                      </TouchableHighlight>
                    ) : (
                      <View style={styles().file} />
                    )}
                    <TouchableHighlight
                      style={styles().takeImageBtn}
                      onPress={() => onTakePhotoAsync()}
                      accessibilityLabel={'cameraBottom_capture'}
                    >
                      <Text
                        style={{
                          fontSize: 16,
                          color: 'white',
                          fontWeight: 'bold',
                        }}
                      >
                        <Feather
                          style={{ color: 'white' }}
                          name="check"
                          type="Feather"
                          size={20}
                        />
                      </Text>
                    </TouchableHighlight>
                    <TouchableHighlight
                      style={styles().cancelBtn}
                      onPress={onClose}
                      accessibilityLabel={'cameraBottom_cancel'}
                    >
                      <Text style={{ fontSize: 16, color: 'gray' }}>
                        Cancel
                      </Text>
                    </TouchableHighlight>
                  </View>
                </View>
              </View>
            </View>
          </CameraView>
        </View>
      );
    };

    return (
      <Modalize
        //@ts-ignore
        ref={ref}
        scrollViewProps={{ showsVerticalScrollIndicator: false }}
        modalStyle={styles(theme).container}
        // Need to distinguish between user close or ref close
        // onClose={() => {
        //   if (currentItem === 1 && type === 'FRONT') {
        //     deleteEmptyBundle()
        //   }
        // }}
      >
        {/* <BottomSheetHeader
        heading={"Item"}
        subHeading={type == ''? 'Front':type}
      /> */}
        <View style={styles().content}>{content()}</View>
      </Modalize>
    );
  }
);

const styles = (theme = {} as ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    content: {
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
      shadowOffset: { height: 5, width: width },
      shadowOpacity: 0.3,
      backgroundColor: 'white',
      paddingVertical: 20,
      marginBottom: 20,
      borderRadius: 5,
      justifyContent: 'center',
      alignItems: 'center',
    },
    cameraContainer: {
      // zIndex: 100,
      flex: 1,
      height: height * 0.95,
      flexDirection: 'column',
      backgroundColor: '#000',
    },
    cameraHeader: {
      alignSelf: 'center',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    },
    cameraControlsContainer: {
      flexDirection: 'row',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 36,
    },
    cameraControls: {
      flex: 1,
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-around',
      backgroundColor: 'transparent',
    },
    file: {
      width: 65,
      height: 65,
      borderRadius: 16,
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    takeImageBtn: {
      backgroundColor: 'white',
      width: 65,
      height: 65,
      borderRadius: 50,
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 36,
    },
    cancelBtn: {
      // backgroundColor: '#424242',
      width: 65,
      height: 65,
      borderRadius: 16,
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    maskOuter: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      alignItems: 'center',
      justifyContent: 'space-around',
    },
    maskInner: {
      backgroundColor: 'transparent',
      borderWidth: 2,
      borderStyle: 'solid',
      borderRadius: 5,
      borderColor: ThemeStatic.accent,
    },
    maskFrame: {
      backgroundColor: 'rgba(1,1,1,0.6)',
    },
    maskRow: {
      width: '100%',
    },
    maskCenter: { flexDirection: 'row' },
  });

export default CameraBottomSheet;
