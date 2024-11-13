import React from 'react';
import {  Text } from 'native-base';
import { Picker } from '@react-native-picker/picker';
import { shippings } from '@app/fake-data';
import { Entypo } from '@expo/vector-icons';

interface ShippingPickerDefaultProps {
  selectedValue?: string;
  onValueChange?: (value: string) => void;
}

const ShippingPicker: React.FC<ShippingPickerDefaultProps> = ({
  selectedValue,
  onValueChange,
}) => {
  selectedValue = selectedValue ? selectedValue : shippings[0];
  return (
    <Item picker>
      <Text style={{ flex: 1 }}>{'Shipping'}</Text>
      <Picker
        mode="dialog"
        iosIcon={<Entypo type="Entypo" name="chevron-down" size={25} />}
        style={{}}
        placeholder="Select your Shipping"
        placeholderStyle={{ color: '#bfc6ea' }}
        placeholderIconColor="#007aff"
        selectedValue={selectedValue}
        onValueChange={onValueChange}
      >
        {shippings.map((item) => {
          return <Picker.Item label={item} value={item} />;
        })}
      </Picker>
    </Item>
  );
};

export default ShippingPicker;
