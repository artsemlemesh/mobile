import React from 'react';
import { Text } from 'native-base';
import { Picker } from '@react-native-picker/picker';
import { sizes } from '@app/fake-data';
import { View } from 'react-native';
import { Entypo } from '@expo/vector-icons';

interface SizePickerDefaultProps {
  items?: [];
  selectedValue?: string;
  onValueChange?: (value: string) => void;
}

const SizePicker: React.FC<SizePickerDefaultProps> = ({
  items,
  selectedValue,
  onValueChange,
}) => {
  selectedValue = selectedValue
    ? selectedValue?.toLowerCase()
    : items?.[0]?.name?.toLowerCase();
  return (
    <View>
      <Text style={{ flex: 1 }}>{'Size'}</Text>
      <Picker
        mode="dialog"
        iosIcon={<Entypo name="chevron-down" type="Entypo" size={25} />}
        style={{}}
        placeholder="Select your Size"
        placeholderStyle={{ color: '#bfc6ea' }}
        placeholderIconColor="#007aff"
        selectedValue={selectedValue}
        onValueChange={onValueChange}
      >
        {items
          ? items?.map((item) => {
              return (
                <Picker.Item
                  label={item?.name}
                  value={item?.name.toLowerCase()}
                />
              );
            })
          : null}
      </Picker>
    </View>
  );
};

export default SizePicker;
