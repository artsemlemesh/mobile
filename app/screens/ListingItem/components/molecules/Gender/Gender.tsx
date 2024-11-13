import React from 'react';
import { Text, Icon } from 'native-base';
import { Picker } from '@react-native-picker/picker';
import { genders } from '@app/fake-data';
// import { Node } from 'react-native-reanimated';
import { ThemeStatic } from '@app/theme';
import { View } from 'react-native';
import { Entypo } from '@expo/vector-icons';

interface GenderPickerDefaultProps {
  mode?: string;
  selectedValue?: string;
  onValueChange?: (value: string) => void;
  iosIcon?: any;
  style?: any;
  placeholder?: string;
  placeholderStyle?: any;
  placeholderIconColor?: string;
  textStyle?: any;
}

const GenderPicker: React.FC<GenderPickerDefaultProps> = ({
  selectedValue = genders[0].id.toLowerCase(),
  onValueChange = () => {},
  iosIcon = (
    <Entypo
      name="chevron-down"
      type="Entypo"
      size={20}
      style={{ fontSize: 20, color: ThemeStatic.black }}
    />
  ),
  style = {},
  placeholder = 'Select your Gender',
  placeholderStyle = { color: '#bfc6ea' },
  placeholderIconColor = '#007aff',
  textStyle = {},
}) => {
  selectedValue = selectedValue ? selectedValue : '';
  return (
    <View>
      <Text style={{ flex: 1 }}>{'Gender'}</Text>
      <Picker
        mode="dialog"
        iosIcon={iosIcon}
        style={style}
        // placeholder={placeholder}
        placeholderStyle={placeholderStyle}
        placeholderIconColor={placeholderIconColor}
        selectedValue={selectedValue}
        onValueChange={onValueChange}
        textStyle={textStyle}
      >
        {genders.map((item) => {
          return (
            <Picker.Item label={item.name} value={item.id} key={item.id} />
          );
        })}
      </Picker>
    </View>
  );
};

export default GenderPicker;
