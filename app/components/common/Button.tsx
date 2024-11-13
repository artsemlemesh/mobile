import { hp, wp } from '../../constants';
import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';


interface Props {
  title: string;
  loading: boolean;
  buttonStyle: any;
  buttonTextStyle: any;
  onPress: () => void;
  testIDs?: any;
}

const Button: React.FC<Props> = ({ title, loading, buttonStyle, buttonTextStyle, onPress, testIDs}) => (
  <TouchableWithoutFeedback onPress={onPress} accessibilityLabel={testIDs}  >
    <View style={[styles.ButtonStyle, { ...buttonStyle }]}>
      {loading ? (
        <ActivityIndicator size={25} />
      ) : (
        <Text style={[styles.ButtonTextStyle, { ...buttonTextStyle }]}>
          {title}
        </Text>
      )}
    </View>
  </TouchableWithoutFeedback>
);

const styles = StyleSheet.create({
  ButtonStyle: {
    alignItems: 'center',
    justifyContent: 'center',
    width: wp(78),
    padding: hp(1),
    backgroundColor: 'red',
    borderRadius: 5
  },
  ButtonTextStyle: {
    alignSelf: 'stretch',
    textAlign: 'center',
    fontWeight: 'bold',
    color: "#fff"
  },
});

export default Button;
