import { hp, wp } from '../../constants';
import React from 'react';
import {
  TouchableWithoutFeedback,
  Image,
  StyleSheet,
  View,
} from 'react-native';

interface Props {
  image: any;
  imageStyle: any;
  buttonViewStyle: any;
  onPress: () => void;
  testIDs?: string;
}

const SocialButton: React.FC<Props> = ({
  image,
  imageStyle,
  buttonViewStyle,
  onPress,
  testIDs,
}) => (
  <TouchableWithoutFeedback onPress={onPress} testID={testIDs}>
    <View style={[styles.container, { ...buttonViewStyle }]}>
      <Image
        source={image}
        style={[
          { height: wp(4), width: wp(4), tintColor: '#fff' },
          { ...imageStyle },
        ]}
        resizeMode="contain"
      />
    </View>
  </TouchableWithoutFeedback>
);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#705FDE',
    borderRadius: 3,
    height: hp(5),
    width: hp(5.3),
    marginHorizontal: hp(1),
  },
});

export default SocialButton;
