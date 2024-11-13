import { hp, wp } from '../../constants';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Theme } from './../../theme';

const Separator: React.FC = ({ navigation }: any) => {
  return (
    <View style={styles.container}>
      <View style={styles.leftRightView} />
      <View style={styles.centerView}>
        <Text>{'Or connect using'}</Text>
      </View>
      <View style={styles.leftRightView} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: wp(76),
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  leftRightView: { flex: wp(10), height: hp(0.001), borderWidth: 0.5 },
  centerView: { flex: wp(20), justifyContent: 'center', alignItems: 'center' },
});

export default Separator;
