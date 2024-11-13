import React from 'react';
import { View } from 'react-native';
import { DotIndicator } from 'react-native-indicators';
import { ThemeStatic, Typography } from '@app/theme';
import { IconSizes } from '@app/constants';


interface LoadingIndicatorProps {
  size: number,
  color?: string,
  count?: number
};

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ size, color, count }) =>
  <View style={{ flex: 1, flexDirection: 'row', backgroundColor: 'rgba(255, 255, 255, 0.8)' }}>
    <DotIndicator size={IconSizes.x2} color={ThemeStatic.accent} count={count || 3} />
  </View>

export default LoadingIndicator;