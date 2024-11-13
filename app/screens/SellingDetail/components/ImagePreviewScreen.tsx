import React, { useContext, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  Image,
  Pressable,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { responsiveWidth } from 'react-native-responsive-dimensions';
import { AppContext } from '@app/context';
import { ThemeStatic, Typography } from '@app/theme';
import { ThemeColors } from '@app/types/theme';
import { Spinner } from 'native-base';
import { SafeAreaView } from 'react-native';
import { Icon } from 'native-base';
import { Modalize } from 'react-native-modalize';
import { ActivityIndicator } from 'react-native-paper';
import { getImageUrl } from '../../../utils/common';
import { Feather } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

const maskRowHeightInner = Math.round(0.6 * height);
const ratio = width / height;

const { FontWeights, FontSizes } = Typography;

interface ImagePreviewScreenProps {
  ref: React.Ref<any>;
  imageDataProp: any;
  imageDataWithRB: any;
  onApprove: (imageData: any) => any;
  onSheetClose: () => void;
  onClose: () => void;
  removeBackground: () => void;
  loader: boolean;
}

const ImagePreviewScreen: React.FC<ImagePreviewScreenProps> = React.forwardRef(
  (
    {
      imageDataProp,
      imageDataWithRB,
      onApprove,
      onSheetClose,
      onClose,
      removeBackground,
      loader,
    },
    ref
  ) => {
    const { theme } = useContext(AppContext);
    const content = () => {
      const imageUrl = imageDataWithRB
        ? getImageUrl(imageDataWithRB)
        : imageDataProp?.uri;
      return (
        <SafeAreaView style={styles().cameraContainer}>
          <View style={{ flex: 1, justifyContent: 'flex-start' }}>
            <View style={styles().maskOuter}>
              <View
                style={[
                  { flex: 1, justifyContent: 'center' },
                  styles().maskRow,
                  styles().maskFrame,
                ]}
              >
                <View style={styles().cameraHeader}>
                  <Text style={{ fontSize: 14, color: 'white' }}>
                    Preview Image
                  </Text>
                </View>
              </View>
              <View
                style={[{ height: maskRowHeightInner }, styles().maskCenter]}
              >
                {imageDataProp && imageUrl ? (
                  <Image
                    style={styles().imageStyle}
                    source={{ uri: imageUrl }}
                  />
                ) : (
                  <Image
                    style={styles().imageStyle}
                    source={require('@app/assets/images/empty.png')}
                  />
                )}
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
                    <TouchableOpacity
                      style={styles().cancelBtn}
                      onPress={() => {
                        onClose();
                      }}
                      disabled={loader}
                    >
                      <Feather
                        style={{ color: 'white' }}
                        name="x"
                        type="Feather"
                        size={20}
                        accessibilityLabel={'imagePreview_cancel'}
                      />
                    </TouchableOpacity>
                    {/* <TouchableOpacity
                    >
                      <Pressable
                      onPress={() => {
                        removeBackground()
                      }}
                      style={styles().button}
                      accessibilityLabel={'imagePreview_rBackground'}
                      >
                        <Text style={styles().text}>Remove Background</Text>
                        </Pressable>
                    </TouchableOpacity> */}
                    <TouchableOpacity
                      style={styles().takeImageBtn}
                      // onPress={() =>
                      //   console.log('imageDataWithRB', imageDataWithRB)
                      // }
                      onPress={() => {
                        if (imageDataWithRB) {
                          imageDataWithRB.uri = getImageUrl(imageDataWithRB);
                        }
                        onApprove(
                          imageDataWithRB ? imageDataWithRB : imageDataProp
                        );
                        onSheetClose();
                      }}
                      disabled={loader}
                    >
                      <Feather
                        style={{ color: 'white' }}
                        name="check"
                        type="Feather"
                        size={20}
                        accessibilityLabel={'imagePreview_done'}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          </View>
          {loader && (
            <View
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                top: 0,
                bottom: 0,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ActivityIndicator size="large" />
            </View>
          )}
        </SafeAreaView>
      );
    };

    return (
      <Modalize
        //@ts-ignore
        ref={ref}
        scrollViewProps={{ showsVerticalScrollIndicator: false }}
        modalStyle={styles(theme).container}
      >
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
    imageStyle: {
      // height: width * 1.5 * ratio,
      // width: width,
      flex: 0.9,
      resizeMode: 'contain',
    },
    cameraContainer: {
      flex: 1,
      height: height * 0.92,
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
    },
    cameraControls: {
      flex: 1,
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-around',
      backgroundColor: 'transparent',
    },
    takeImageBtn: {
      backgroundColor: 'black',
      width: 100,
      height: 50,
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    cancelBtn: {
      width: 100,
      height: 50,
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
    maskFrame: {
      backgroundColor: 'rgba(1,1,1,0.6)',
    },
    maskRow: {
      width: '100%',
    },
    button: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 9,
      borderRadius: 10,
      elevation: 3,
      backgroundColor: '#846BE2',
      width: 185,
      top: 3,
    },
    text: {
      fontSize: 14.5,
      lineHeight: 21,
      fontWeight: 'bold',
      letterSpacing: 0.25,
      color: 'white',
    },
    maskCenter: { flexDirection: 'row' },
  });

export default ImagePreviewScreen;
