import { View } from 'native-base';
import React, { useState } from 'react';
import { Animated, Image, TouchableOpacity } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Text } from 'react-native-paper';
import { styles } from '../styles';

const ShippingCard: React.FC<any> = ({ onSubmit }) => {
  const [shippingBoxes, setShippingBoxes] = useState<string[]>([
    'PADDED_FLAT_RATE_ENVELOPE',
    'MEDIUM_FLAT_RATE_BOX',
    'LARGE_FLAT_RATE_BOX',
  ]);

  const uspsEnvelope = require('@app/assets/images/usps-envelope.jpg');
  const uspsMediumSide = require('@app/assets/images/usps-medium-side.jpg');
  const uspsMediumTop = require('@app/assets/images/usps-medium-top.jpg');
  const uspsLarge = require('@app/assets/images/usps-large.jpg');

  const handleSelect = (box: string) => {
    if (shippingBoxes.includes(box)) {
      setShippingBoxes(shippingBoxes.filter((b) => b !== box));
    } else {
      setShippingBoxes([...shippingBoxes, box]);
    }
  };

  return (
    <Animated.View
      style={[
        styles().subContainer,
        {
          opacity: 1,
        },
      ]}
    >
      <View style={[styles().centerContainer, { marginTop: 20 }]}>
        <Text>USPS Priority Flat Rate Options</Text>
      </View>
      <View
        style={[
          styles().centerContainer,
          { marginTop: 10, flexDirection: 'column' },
        ]}
      >
        <View style={styles().cellContatiner}>
          <ScrollView showsVerticalScrollIndicator={false} accessible={false}>
            <View
              style={{ flex: 1, flexDirection: 'column' }}
              accessible={false}
            >
              <TouchableOpacity
                onPress={() => {
                  handleSelect('PADDED_FLAT_RATE_ENVELOPE');
                }}
                activeOpacity={0.95}
                style={styles().shippingSelection}
                accessibilityLabel={'shippingCard_small'}
              >
                <View style={{ flex: 1 }}>
                  <Text>Padded Flat Rate Envelope</Text>
                  <Image source={uspsEnvelope} style={styles().uspsBoxImage} />
                </View>
                <View style={{ flex: 1, alignItems: 'flex-end' }}>
                  {shippingBoxes.includes('PADDED_FLAT_RATE_ENVELOPE') && (
                    <Image
                      source={require('@app/assets/images/checkIcon.png')}
                      style={{ height: 20, width: 20, marginRight: 10 }}
                    />
                  )}
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  handleSelect('MEDIUM_FLAT_RATE_BOX');
                }}
                activeOpacity={0.95}
                style={styles().shippingSelection}
                accessibilityLabel={'shippingCard_medium'}
              >
                <View>
                  <Text>Medium Flat Rate Box</Text>
                  <Image
                    source={uspsMediumSide}
                    style={styles().uspsBoxImage}
                  />
                  <Image source={uspsMediumTop} style={styles().uspsBoxImage} />
                </View>
                <View style={{ flex: 1, alignItems: 'flex-end' }}>
                  {shippingBoxes.includes('MEDIUM_FLAT_RATE_BOX') && (
                    <Image
                      source={require('@app/assets/images/checkIcon.png')}
                      style={{ height: 20, width: 20, marginRight: 10 }}
                    />
                  )}
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  handleSelect('LARGE_FLAT_RATE_BOX');
                }}
                activeOpacity={0.95}
                style={styles().shippingSelection}
                accessibilityLabel={'shippingCard_large'}
              >
                <View>
                  <Text>Large Flat Rate Box</Text>
                  <Image source={uspsLarge} style={styles().uspsBoxImage} />
                </View>
                <View style={{ flex: 1, alignItems: 'flex-end' }}>
                  {shippingBoxes.includes('LARGE_FLAT_RATE_BOX') && (
                    <Image
                      source={require('@app/assets/images/checkIcon.png')}
                      style={{ height: 20, width: 20, marginRight: 10 }}
                    />
                  )}
                </View>
              </TouchableOpacity>
            </View>
            <View style={[styles().centerContainer]}>
              <TouchableOpacity
                activeOpacity={0.75}
                style={[styles().postButtonStyle]}
                onPress={() => onSubmit(shippingBoxes)}
              >
                <Text style={styles().buttonText}>Order Supplies</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Animated.View>
  );
};

export default ShippingCard;
