import React, { useContext, useRef, useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  StyleProp,
  TextStyle,
  ViewStyle,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AppContext } from '@app/context';
import { ThemeColors } from '@app/types/theme';
import { ThemeStatic, Typography } from '@app/theme';
import { Text, Button } from 'native-base';
import { ResizeMode, Video } from 'expo-av';

const { FontWeights, FontSizes } = Typography;

interface SellingScreenEmptyProps {
  listType?: string;
  spacing: number;
  style?: StyleProp<ViewStyle>;
  placeholder?: string;
  placeholderStyle?: StyleProp<TextStyle>;
  videoStatus: boolean;
}

enum VideoState {
  LOADING = 'loading',
  LOADED = 'loaded',
  ERROR = 'error',
}

const SellingScreenEmpty: React.FC<SellingScreenEmptyProps> = ({
  listType,
  spacing,
  style,
  placeholder,
  placeholderStyle,
  videoStatus,
}) => {
  const { theme, videoPlayStatus } = useContext(AppContext);
  const { navigate, addListener } = useNavigation();
  const [videoState, setVideoState] = useState<VideoState>(VideoState.LOADING);
  const [isPaused, setIsPaused] = useState(videoStatus);

  let video = useRef<any>(null);

  let content = `No ${listType} yet`;
  if (placeholder) {
    content = placeholder;
  }

  const onPlayPress = async () => {
    Promise.all(await video?.current?.playAsync());
    setIsPaused(false);
  };

  const onPausePress = async () => {
    Promise.all(await video?.current?.pauseAsync());
    setIsPaused(true);
  };

  useEffect(() => {
    if (videoState === VideoState.LOADED) {
      if (isPaused) onPlayPress();
      else onPausePress();
    }
  }, [videoState]);

  const onDetail = () => {
    navigate('SellingDetail', {
      data: { title: '', description: '', tags: [] },
      openCamera: true,
      loader: true,
    });
  };

  useEffect(() => {
    addListener('blur', () => {
      setIsPaused(true);
      setTimeout(async () => {
        if (video.current) {
          Promise.all(await video.current?.pauseAsync());
        }
      }, 100);
    });
  });
  return (
    <ScrollView>
      <Text style={styles().headerText}>Selling your clothes is easy!</Text>
      <View
        style={{
          height: 1,
          backgroundColor: '#BBBBBB',
          marginVertical: 15,
          marginLeft: 30,
        }}
      />
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginRight: 60,
        }}
      >
        <Text style={styles().boldText}>1</Text>
        <View>
          <Text style={{ fontWeight: '500', fontSize: 16 }}>
            Order your supplies
          </Text>
          <Text
            style={{ color: '#999', textAlign: 'justify' }}
            numberOfLines={3}
          >
            Visit USPS.com to order free priority boxes: Flat Rate Padded
            Envelope, Medium Flat Rate Boxes, Large Flat Rate Boxes
          </Text>
        </View>
      </View>
      <View
        style={{
          height: 1,
          backgroundColor: '#BBBBBB',
          marginVertical: 15,
          marginLeft: 40,
        }}
      />
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginRight: 60,
        }}
      >
        <Text style={styles().boldText}>2</Text>
        <View>
          <Text style={{ fontWeight: '500', fontSize: 16 }}>
            List clothing bundles
          </Text>
          <Text
            style={{ color: '#999', textAlign: 'justify' }}
            numberOfLines={2}
          >
            Arrange clothing bundles to fit into one of the three box types
          </Text>
        </View>
      </View>
      <View
        style={{
          height: 1,
          backgroundColor: '#BBBBBB',
          marginVertical: 15,
          marginLeft: 40,
        }}
      />
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginRight: 60,
        }}
      >
        <Text style={styles().boldText}>3</Text>
        <View>
          <Text style={{ fontWeight: '500', fontSize: 16 }}>
            Take photos of each item
          </Text>
          <Text
            style={{ color: '#999', textAlign: 'justify' }}
            numberOfLines={2}
          >
            Snap a picture front and back right from your phone
          </Text>
        </View>
      </View>

      {videoState === VideoState.LOADING ? (
        <View style={styles().videoPlaceholder}>
          <ActivityIndicator size="large" />
        </View>
      ) : videoState === VideoState.ERROR ? (
        <View style={{ ...styles().videoPlaceholder, alignItems: 'center' }}>
          <Text style={{ fontWeight: '500', fontSize: 16 }}>
            Video Loading Failed
          </Text>
        </View>
      ) : (
        <></>
      )}
      <View style={videoState === VideoState.LOADED ? {} : { display: 'none' }}>
        <Video
          ref={video}
          source={{
            uri: 'https://bynde-staging.s3.amazonaws.com/frontend/assets/video/BundleUp_Shipping_Video.mp4',
          }}
          rate={1.0}
          volume={1}
          isMuted={false}
          resizeMode={ResizeMode.COVER}
          style={styles().videoPlay}
          isLooping
          onReadyForDisplay={() => setVideoState(VideoState.LOADED)}
          onError={() => setVideoState(VideoState.ERROR)}
        />
        <View style={styles().playPauseContainer}>
          {isPaused ? (
            <TouchableOpacity onPress={onPlayPress}>
              <Image
                source={require('../../../assets/images/play.png')}
                style={styles().playPauseIcon}
              />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={onPausePress}>
              <Image
                source={require('../../../assets/images/pause.png')}
                style={styles().playPauseIcon}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
      <Button
        style={{
          backgroundColor: ThemeStatic.accent,
          marginHorizontal: 15,
          display: 'block',
        }}
        onPress={onDetail}
      >
        <Text>Get Started</Text>
      </Button>
    </ScrollView>
  );
};

const styles = (theme = {} as ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      marginHorizontal: 10,
    },
    placeholderText: {
      ...FontWeights.Light,
      ...FontSizes.Label,
      color: theme.text02,
    },
    videoPlaceholder: {
      margin: 15,
      height: 250,
      justifyContent: 'center',
      backgroundColor: '#E9EDF6',
    },
    videoPlay: {
      margin: 15,
      height: 250,
    },
    boldText: {
      ...FontWeights.Bold,
      ...FontSizes.Label,
      color: ThemeStatic.accentLight,
      textAlign: 'center',
      marginHorizontal: 15,
    },
    headerText: {
      ...FontWeights.Bold,
      ...FontSizes.Label,
      color: ThemeStatic.black,
      marginTop: 20,
      marginLeft: 30,
    },
    playPauseContainer: {
      position: 'absolute',
      bottom: 15,
      left: 15,
    },
    playPauseIcon: {
      height: 25,
      width: 25,
      tintColor: '#fff',
    },
  });

export default SellingScreenEmpty;
