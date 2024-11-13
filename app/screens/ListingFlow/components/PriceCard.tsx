import React, { useContext, useState, useEffect } from 'react';
import { TouchableOpacity, Animated } from 'react-native';
import {
  Text,
  View,
  Card,
  Input,
  InputGroup,
  InputLeftAddon,
  InputRightAddon,
} from 'native-base';
import { AppContext } from '@app/context';
import { styles } from '../styles';
import { ThemeStatic } from '@app/theme';
import { Entypo } from '@expo/vector-icons';

interface PriceCardProps {
  onPublish: (price: number) => void;
  step: number;
  price: number;
  bundleDetails: any;
  itemsCount: number;
}
const PriceCard: React.FC<PriceCardProps> = ({
  step,
  onPublish,
  price,
  bundleDetails,
  itemsCount,
}) => {
  const { theme } = useContext(AppContext);
  // const [listingDetails, setListingDetails] = useState<any>(bundleDetails);
  const [listingDetails, setListingDetails] = useState<any>(bundleDetails);
  // const [itemCount, setItemCount] = useState<any>(bundleDetails.items.length);
  const itemCount = itemsCount;
  const [listingPrice, setListingPrice] = useState(
    parseFloat(price).toFixed(2).toString()
  );
  const [unitCost, setUnitCost] = useState(
    listingPrice ? (parseFloat(listingPrice) / itemCount).toString() : ''
  );

  const handleUnitCostChange = (text) => {
    setUnitCost(text);
    // Calculate the price based on the unit cost
    const calculatedPrice = parseFloat(text) * itemCount || '';
    setListingPrice(calculatedPrice.toString());
  };

  const handlePriceChange = (text) => {
    setListingPrice(text);
    // Calculate the unit cost based on the price
    const calculatedUnitCost = parseFloat(text) / itemCount || '';
    setUnitCost(calculatedUnitCost.toString());
  };

  const opacity = new Animated.Value(0);
  useEffect(() => {
    // onBundleSelectModalOpen();
    Animated.timing(opacity, {
      toValue: step == 3 ? 1 : 0,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, [step]);

  const [isPrice, setisPrice] = useState(false);

  const saveButtonTranslationX = opacity.interpolate({
    inputRange: [0, 1],
    outputRange: [100, 0],
  });
  return (
    <Animated.View
      style={[
        styles().roundedView,
        {
          opacity: opacity,
          // flex: 1,
          // transform: [{ translateX: saveButtonTranslationX }],
        },
      ]}
    >
      <View style={styles(theme).roundedViewInner}>
        <Card
          style={{
            // elevation: 12,
            // borderWidth: 1,
            shadowOpacity: 1,
            borderRadius: 10,
            shadowRadius: 12,
            marginVertical: 5,
            shadowColor: 'black',
            alignItems: 'center',
            marginHorizontal: 12,
            borderColor: 'lightgray',
            backgroundColor: 'white',
            shadowOffset: { width: 1, height: 20 },
            flexDirection: 'column',
            flex: 1,
            justifyContent: 'center',
          }}
        >
          <View style={[styles().centerContainer]}>
            <Text style={styles(theme).titleText}>Price your bundle</Text>
          </View>
          <View style={[styles().centerContainer]}>
            <Text style={styles(theme).sectionText}>
              There are {itemCount} items in your bundle. How much do you want
              to earn?
            </Text>
          </View>
          <View
            style={[
              styles().centerContainer,
              { marginTop: 20, flexDirection: 'column' },
            ]}
          >
            {isPrice && !listingPrice && (
              <View>
                <Text
                  style={[
                    styles(theme).sectionText,
                    { color: ThemeStatic.badge, fontSize: 15 },
                  ]}
                >
                  {'Please enter the price!'}
                </Text>
              </View>
            )}

            <View style={styles().cellContatiner}>
              <InputGroup>
                {/* <Entypo
                size={25}
                type="Entypo"
                name="price-tag"
                style={{ color: ThemeStatic.accent }}
              /> */}
                <InputLeftAddon children={'$'} />
                <Input
                  // getRef={(input) => {
                  //   this.firstNameRef = input;
                  // }}
                  returnKeyType={'next'}
                  onSubmitEditing={() => {
                    // lastNameRef.current._root.focus();
                  }}
                  autoFocus
                  blurOnSubmit={false}
                  defaultValue={listingPrice}
                  onChangeText={(text) => handlePriceChange(text)}
                  value={listingPrice}
                  style={[
                    styles(theme).input,
                    { color: styles(theme).input, fontSize: 16 },
                  ]}
                  placeholderTextColor={ThemeStatic.text02}
                  w={100}
                  placeholder={'100'}
                  keyboardType="decimal-pad"
                  accessibilityLabel={'priceCard_price'}
                  value={listingPrice}
                />
                <InputRightAddon children={'total'} />
              </InputGroup>
            </View>
            <View style={styles().cellContatiner}>
              <InputGroup>
                <InputLeftAddon children={'$'} />
                <Input
                  // getRef={(input) => {
                  //   this.firstNameRef = input;
                  // }}
                  returnKeyType={'next'}
                  onSubmitEditing={() => {
                    // lastNameRef.current._root.focus();
                  }}
                  blurOnSubmit={false}
                  defaultValue={listingPrice}
                  onChangeText={(text) => handleUnitCostChange(text)}
                  value={unitCost}
                  style={[
                    styles(theme).input,
                    { color: styles(theme).input, fontSize: 16 },
                  ]}
                  placeholderTextColor={ThemeStatic.text02}
                  placeholder={'10'}
                  keyboardType={'decimal-pad'}
                  accessibilityLabel={'priceCard_price'}
                  w={100}
                />
                <InputRightAddon children={'/ item'} />
              </InputGroup>
            </View>
          </View>
          <View style={styles().centerContainer}>
            <TouchableOpacity
              activeOpacity={0.75}
              style={[styles().postButtonStyle]}
              onPress={() => {
                if (listingPrice.length === 0) {
                  setisPrice(true);
                } else {
                  onPublish(Number(parseFloat(listingPrice).toFixed(2)));
                }
              }}
              accessibilityLabel={'priceCard_publish'}
            >
              <Text style={styles().buttonText}>Publish</Text>
            </TouchableOpacity>
          </View>
        </Card>
      </View>
    </Animated.View>
  );
};

export default PriceCard;
