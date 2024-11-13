import React, { useContext, useState } from 'react';
import {
  Dimensions,
  Keyboard,
  Platform,
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import posed from 'react-native-pose';

import { AppContext } from '@app/context';
import { Typography, ThemeStatic } from '@app/theme';
import { ThemeColors } from '@app/types/theme';
import { MaterialIcons } from '@expo/vector-icons';

const { FontWeights, FontSizes } = Typography;
const { width, height } = Dimensions.get('window');
interface AnimatedSearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onFocus?: any;
  onBlur?: any;
  placeholder: string;
  style?: StyleProp<ViewStyle>;
  visible: boolean;

  isClearTrue?: () => void;
  isClearFalse?: () => void;
}

const TransitionInput = posed(TextInput)({
  focused: { width: width * 0.63 - 70 },
  notFocused: { width: width * 0.63 },
});

const TransitionTouchableOpacity = posed(TouchableOpacity)({
  focused: { width: 70 },
  notFocused: { width: 0 },
});

const AnimatedSearchBar: React.FC<AnimatedSearchBarProps> = ({
  value,
  onChangeText,
  onFocus,
  onBlur,
  placeholder,
  style,
  visible
}) => {
  const { theme } = useContext(AppContext);

  const onOpen = () => {
    onFocus();
  };

  const onCancel = () => {
    Keyboard.dismiss();
    onChangeText('');
    onBlur();
  };

  const pose = visible ? 'focused' : 'notFocused';

  return (
    <View style={styles().container}>
      <View style={styles().searchSection}>
        <MaterialIcons
          as={MaterialIcons}
          name="search"
          size={25}
          color="black"
          style={{ marginLeft: 15 }}
        />

        <TransitionInput
          pose={pose}
          onFocus={onOpen}
          style={[styles(theme).animatedSearchBar, styles().input, style]}
          value={value}
          placeholder={placeholder}
          placeholderTextColor={ThemeStatic.black}
          onChangeText={onChangeText}
        />

      <TransitionTouchableOpacity
        pose={pose}
        activeOpacity={0.9}
        onPress={onCancel}
        style={[styles().cancel]}
      >
        <MaterialIcons name="close" style={{ fontSize: 24, color: ThemeStatic.black }} />
        {/* <Text style={styles(theme).cancelText}>Cancel</Text> */}
      </TransitionTouchableOpacity>
      </View>
      {/* if open, cancel icon */}
      
      
    </View>
  );
};

const styles = (theme = {} as ThemeColors) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'transparent',
    },
    animatedSearchBar: {
      ...FontWeights.Light,
      ...FontSizes.Body,
      flex: 1,
      // marginLeft: 20,
      // paddingVertical: Platform.select({ ios: 10, android: 5 }),

      // backgroundColor: theme.placeholder,
      //marginVertical: 5
    },
    cancel: {
      height: 20,
      alignItems: 'flex-end',
      justifyContent: 'center',
      paddingHorizontal: 12,
    },
    cancelText: {
      height: 20,
      ...FontWeights.Light,
      ...FontSizes.Body,
      color: ThemeStatic.black,
    },
    searchSection: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.1)',
      color: theme.white,
      borderRadius: 20,
    },
    searchIcon: {
      padding: 2,
      marginLeft: 10,
    },
    input: {
      paddingTop: 10,
      paddingRight: 10,
      paddingBottom: 10,
      paddingLeft: 10,
      color: '#424242',
    },
  });

export default AnimatedSearchBar;
