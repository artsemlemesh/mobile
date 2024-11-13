import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { ThemeStatic } from '@app/theme';
import { BUNDLE_STATUS } from '@app/utils/constants';

interface StatusFilterProps {
  status: string;
  setStatus: (status: string) => void;
  bundles: Array<any>;
}

const StatusFilter: React.FC<StatusFilterProps> = ({
  status,
  setStatus,
  bundles,
}) => {
  return (
    <View style={styles().container}>
      {Object.values(BUNDLE_STATUS).map((item) => (
        <TouchableOpacity
          key={item}
          onPress={() => setStatus(item)}
          style={[styles().status, { opacity: status === item ? 1 : 0.7 }]}
        >
          <Text style={styles().statusText}>
            {item.charAt(0).toUpperCase() + item.slice(1)} (
            {item === BUNDLE_STATUS.ALL
              ? bundles.length
              : bundles.filter((bundle) => bundle.status === item).length}
            )
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = () =>
  StyleSheet.create({
    container: {
      flex: 1,
      marginVertical: 8,
      flexDirection: 'row',
      justifyContent: 'space-around',
    },
    status: {
      alignSelf: 'flex-end',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: ThemeStatic.accent,
      borderRadius: 8,
    },
    statusText: {
      color: 'white',
      paddingVertical: 6,
      paddingHorizontal: 15,
    },
  });

export default StatusFilter;
