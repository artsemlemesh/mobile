import React from 'react';
import { Text, Icon } from 'native-base';
import { Picker } from '@react-native-picker/picker';
import { qualities } from '@app/fake-data';
import { ThemeStatic } from '@app/theme';
import { View } from 'react-native';
import { Entypo } from '@expo/vector-icons';

interface QualityPickerDefaultProps {
  selectedValue?: string;
  onValueChange?: (value: string) => void;
}

const QualityPicker: React.FC<QualityPickerDefaultProps> = ({
  selectedValue,
  onValueChange,
}) => {
  selectedValue = selectedValue ? selectedValue : '';
  return (
    <View>
      <Text style={{ flex: 1 }}>{'Quality'}</Text>
      <Picker
        mode="dialog"
        iosIcon={
          <Entypo
            name="chevron-down"
            type="Entypo"
            size={20}
            style={{ fontSize: 20, color: ThemeStatic.black }}
          />
        }
        style={{}}
        // placeholder="Select your Quality"
        // placeholderStyle={{ color: '#bfc6ea' }}
        placeholderStyle={{ color: ThemeStatic.black }}
        placeholderIconColor="#007aff"
        selectedValue={selectedValue}
        onValueChange={onValueChange}
      >
        {qualities?.map((item) => {
          return <Picker.Item label={item.name} value={item.id} />;
        })}
      </Picker>
    </View>
  );
};

export default QualityPicker;
