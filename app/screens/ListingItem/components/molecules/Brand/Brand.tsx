import React from 'react';
import { Text } from 'native-base';
import { Picker } from '@react-native-picker/picker';
import { brands } from '@app/fake-data';
import { View } from 'react-native';
import { Entypo } from '@expo/vector-icons';

interface BrandPickerDefaultProps {
  items?: [];
  selectedValue?: string;
  onValueChange?: (value: string) => void;
}

const BrandPicker: React.FC<BrandPickerDefaultProps> = ({
  items,
  selectedValue,
  onValueChange,
}) => {
  selectedValue = selectedValue
    ? selectedValue?.toLowerCase()
    : items?.[0]?.name?.toLowerCase();
  return (
    <View>
      <Text style={{ flex: 1 }}>{'Brand'}</Text>
      <Picker
        mode="dialog"
        iosIcon={<Entypo name="chevron-down" size={25} type="Entypo" />}
        style={{}}
        placeholder="Select your Brand"
        placeholderStyle={{ color: '#bfc6ea' }}
        placeholderIconColor="#007aff"
        selectedValue={selectedValue}
        onValueChange={onValueChange}
      >
        {items
          ? items?.map((item) => {
              return <Picker.Item label={item?.name} value={item?.name} />;
            })
          : null}
      </Picker>
    </View>
  );
};

export default BrandPicker;
