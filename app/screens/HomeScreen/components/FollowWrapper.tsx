import React, { useContext, useRef, useEffect, useState } from 'react';
import { IconSizes, Connections } from '@app/constants';
import { AppContext } from '@app/context';
import { ThemeStatic, Typography } from '@app/theme';
import { ThemeColors } from '@app/types/theme';
import { Image, StyleSheet, Text, View } from 'react-native';
const { FontWeights, FontSizes } = Typography;

interface FollowWrapperProps {
  avatar?:any;
  following?: number;
  followers?: number;
}

const FollowWrapper: React.FC<FollowWrapperProps> = ({ followers, following, avatar }) => {
  const { theme } = useContext(AppContext);
  return (
    <View style={styles(theme).subContent}>
      <View style={[styles(theme).centerStyle, { flexDirection: 'column' }]}>
        <Text style={styles(theme).countText}>{following || '0'}</Text>
        <Text style={styles(theme).typeText}>{Connections.FOLLOWING}</Text>
      </View>
      <View style={styles(theme).centerStyle}>
        <Image source={{uri:avatar}} style={styles().avatarImage} />
      </View>
      <View style={[styles(theme).centerStyle, { flexDirection: 'column' }]}>
        <Text style={styles(theme).countText}>{followers || '0'}</Text>
        <Text style={styles(theme).typeText}>{Connections.FOLLOWERS}</Text>
      </View>
    </View>
  );
};

const styles = (theme = {} as ThemeColors) =>
  StyleSheet.create({
    subContent: {
      justifyContent: 'space-between',
      flexDirection: 'row',
    },
    centerStyle: {
      justifyContent: 'center',
      alignItems: 'center'
    },
    avatarImage: {
      width: 100,
      height: 100,
      borderRadius: 50

    },
    countText: {
      ...FontWeights.Bold,
      ...FontSizes.Label,
      color: theme.text01,
      textAlign: 'center'
    },
    typeText: {
      ...FontWeights.Bold,
      ...FontSizes.Caption,
      color: theme.text01,
      textAlign: 'center'
    },

  });

export default FollowWrapper;

