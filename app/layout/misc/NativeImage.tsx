import React from 'react';
import { View, Image } from 'react-native';
import FastImage from 'react-native-fast-image';
// import FastImage from 'react-native-fast-image';

interface NativeImageProps {
  uri: string,
  style: any
};

const NativeImage: React.FC<NativeImageProps> = ({ uri, style }) => {

  if (!uri) return <View style={style} />
  return <Image style={style} source={{ uri }} />
  // return <FastImage style={style} source={{ uri, priority: FastImage.priority.normal }} />
};

export default NativeImage;