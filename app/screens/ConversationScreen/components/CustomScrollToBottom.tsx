import React from 'react';
// import Entypo from 'react-native-vector-icons/Entypo';
import { IconSizes } from '@app/constants';
import { ThemeStatic } from '@app/theme';
import { Entypo } from '@expo/vector-icons';

const CustomScrollToBottom = () => <Entypo
  name='chevron-down'
  color={ThemeStatic.black}
  size={IconSizes.x4}
/>;

export default CustomScrollToBottom;