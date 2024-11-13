import { View } from 'native-base';
import React, { useEffect, useState } from 'react';
import { Alert, Animated, Image, TouchableOpacity } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Text } from 'react-native-paper';
import { styles } from '../styles';

interface ShippingCardProps {
  setStep: (index: number) => void;
  onNext: (n: number, values: any) => void;
  step: number;
}

const ShippingCard: React.FC<ShippingCardProps> = ({
  step,
  onNext,
  setStep,
}) => {
  const [shippingType, setShippingType] = useState<number>(0);

  const opacity = new Animated.Value(0);
  const uspsEnvelope = require('@app/assets/images/usps-envelope.jpg');
  const uspsMediumSide = require('@app/assets/images/usps-medium-side.jpg');
  const uspsMediumTop = require('@app/assets/images/usps-medium-top.jpg');
  const uspsLarge = require('@app/assets/images/usps-large.jpg');

  const shippingTypes = {
    PADDED_FLAT_RATE_ENVELOPE: 1,
    MEDIUM_FLAT_RATE_BOX: 2,
    LARGE_FLAT_RATE_BOX: 3,
  };

  const handleSelect = (box: string) => {
    setShippingType(shippingTypes[box]);
  };

  useEffect(() => {
    // onBundleSelectModalOpen();
    Animated.timing(opacity, {
      toValue: step == 2 ? 1 : 0,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, [step]);

  const saveButtonTranslationX = opacity.interpolate({
    inputRange: [0, 1],
    outputRange: [100, 0],
  });
  return (
    <Animated.View
      style={[
        styles().subContainer,
        {
          opacity: opacity,
          // transform: [{ translateX: saveButtonTranslationX }]
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
                {/* 
                BUY: https://store.usps.com/store/product/shipping-supplies/priority-mail-padded-flat-rate-envelope-P_EP14PE
                  DIMENSIONS:   9-1/2"(L) x 12-1/2"(W)
                */}
                <View style={{ flex: 1 }}>
                  <Text>Padded Flat Rate Envelope</Text>
                  <Image source={uspsEnvelope} style={styles().uspsBoxImage} />
                </View>
                <View style={{ flex: 1, alignItems: 'flex-end' }}>
                  {/* <RadioButton
                    onPress={() => setShipping('small')}
                    value="small"
                    status={shipping === 'small' ? 'checked' : 'unchecked'}
                  /> */}
                  {shippingType === 1 && (
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
                {/* 
                Top
                https://store.usps.com/store/product/shipping-supplies/priority-mail-medium-flat-rate-box-1-P_O_FRB1
                Outside: 11 1/4″ x 8 3/4″ x 6″
                Inside: 11″ x 8 1/2″ x 5 1/2″

                Side
                https://store.usps.com/store/product/shipping-supplies/priority-mail-medium-flat-rate-box-2-P_O_FRB2
                Outside: 14″ x 12″ x 3 1/2″
                Inside: 13 5/8″ x 11 7/8″ x 3 3/8″
               */}
                <View>
                  <Text>Medium Flat Rate Box</Text>
                  <Image
                    source={uspsMediumSide}
                    style={styles().uspsBoxImage}
                  />
                  <Image source={uspsMediumTop} style={styles().uspsBoxImage} />
                </View>
                <View style={{ flex: 1, alignItems: 'flex-end' }}>
                  {/* <RadioButton
                    value="medium"
                    onPress={() => setShipping('medium')}
                    status={shipping === 'medium' ? 'checked' : 'unchecked'}
                  /> */}
                  {shippingType === 2 && (
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
                {/* 
                https://store.usps.com/store/product/shipping-supplies/priority-mail-large-flat-rate-box-largefrb-P_LARGE_FRB#moreinfofooter
                Outside: 24 1/16″ x 11 7/8″ x 3 1/8″
                Inside: 23 11/16″ x 11 3/4″ x 3″
                */}
                <View>
                  <Text>Large Flat Rate Box</Text>
                  <Image source={uspsLarge} style={styles().uspsBoxImage} />
                </View>
                <View style={{ flex: 1, alignItems: 'flex-end' }}>
                  {/* <RadioButton
                    onPress={() => setShipping('large')}
                    value="large"
                    status={shipping === 'large' ? 'checked' : 'unchecked'}
                  /> */}
                  {shippingType === 3 && (
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
                onPress={() => {
                  if (shippingType === 0) {
                    Alert.alert('Please select a shipping type');
                    return;
                  }
                  setStep(3);
                  onNext(3, {
                    shipping_type: shippingType,
                  });
                }}
                accessibilityLabel={'shippingCard_next'}
              >
                <Text style={styles().buttonText}>Next</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Animated.View>
  );
};

export default ShippingCard;
