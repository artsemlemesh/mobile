import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  InteractionManager,
} from 'react-native';
import Carousel from 'react-native-snap-carousel';
import { FontAwesome } from '@expo/vector-icons';
import { ThemeStatic } from '@app/theme';
import ImageWithSkeleton from '@app/utils/react-native-images-collage/ImageWithSkeleton';
import { Skeleton } from 'native-base';

const screenWidth = Math.round(Dimensions.get('window').width);

const ItemsCarousel = ({
  items,
  activeIndex,
  setModalVisible,
  setActiveIndex,
  setZoomItem,
  setImageZoom,
  setImageIndex,
  onDeleteItem = undefined,
}) => {
  const [flatArray, setFlatArray] = useState([]);
  const [localActiveIndex, setLocalActiveIndex] = useState(-1);

  useEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      const tempFlatArray: any = [];
      for (let i = 0; i < items.length; i++) {
        for (let j = 0; j < items[i].images.length; j++) {
          tempFlatArray.push({
            image_small: items[i].images[j]?.image_small,
            size: items[i].size,
            brand: items[i].brand,
            quality: items[i].quality,
            id: `${items[i].id ?? items[i].pk} - ${items[i].images[j].id}`,
            itemsIdx: i,
            imageIndex: j,
          });
        }
      }
      setFlatArray(tempFlatArray);
    });
  }, [items]);

  useEffect(() => {
    const current = flatArray.findIndex(
      (item) => item.itemsIdx === activeIndex
    );
    if (
      items[flatArray[localActiveIndex]?.itemsIdx] !==
      items[flatArray[current]?.itemsIdx]
    )
      setLocalActiveIndex(current);
  }, [activeIndex, flatArray]);

  const onSnapToItem = (index: number) => {
    setLocalActiveIndex(index);
    setActiveIndex(flatArray[index].itemsIdx);
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        height: screenWidth,
      }}
    >
      {!flatArray.length || localActiveIndex === -1 ? (
        <Skeleton
          style={{ width: screenWidth - 20, height: screenWidth - 20 }}
          startColor={'#eee'}
          endColor={'#ddd'}
        />
      ) : (
        <Carousel
          firstItem={localActiveIndex}
          layout={'default'}
          data={flatArray}
          sliderWidth={screenWidth}
          itemWidth={screenWidth}
          renderItem={({ item }) => (
            <>
              <TouchableOpacity
                style={{
                  margin: 10,
                }}
                onPress={() => {
                  setImageZoom(
                    items[item.itemsIdx].images.map((imageItem) => ({
                      url: imageItem?.image_small,
                    }))
                  );
                  setZoomItem(items[item.itemsIdx]);
                  setImageIndex(item.imageIndex);
                  setModalVisible(true);
                }}
              >
                <ImageWithSkeleton
                  style={{
                    width: screenWidth - 20,
                    height: screenWidth - 20,
                    aspectRatio: 1,
                  }}
                  source={{ uri: item.image_small }}
                />
                <View
                  style={{
                    position: 'absolute',
                    top: 10,
                    left: 5,
                    zIndex: 1,
                  }}
                >
                  <View style={styles().itemDescriptionBackground}>
                    <Text style={styles().itemDescription}>
                      {item.size.name}
                    </Text>
                    <Text style={styles().itemDescription}>
                      {item.brand.name}
                    </Text>
                    <Text style={styles().itemDescription}>{item.quality}</Text>
                  </View>
                </View>
                {onDeleteItem && (
                  <View
                    style={{
                      position: 'absolute',
                      bottom: 10,
                      right: 0,
                      zIndex: 1,
                    }}
                  >
                    <TouchableOpacity
                      onPress={onDeleteItem}
                      style={[styles().deleteIcon, styles().iconStyle]}
                    >
                      <FontAwesome
                        name="trash"
                        type="FontAwesome"
                        style={{ fontSize: 30, color: ThemeStatic.accent }}
                        accessibilityLabel={'sellingDetail_delete'}
                      />
                    </TouchableOpacity>
                  </View>
                )}
              </TouchableOpacity>
            </>
          )}
          keyExtractor={(item: { id: string }) => item.id}
          onSnapToItem={onSnapToItem}
        />
      )}
    </View>
  );
};

const styles = () =>
  StyleSheet.create({
    itemDescription: {
      fontSize: 14,
      fontVariant: ['small-caps'],
      textShadowColor: 'rgba(0, 0, 0, 0.25)',
      textShadowOffset: { width: -1, height: 1 },
      textShadowRadius: 10,
    },
    itemDescriptionBackground: {
      backgroundColor: 'rgba(255, 255, 255, 0)',
      padding: 7,
    },
    deleteIcon: {
      right: 15,
      top: -30,
      width: 34,
      height: 34,
    },
    iconStyle: {
      justifyContent: 'center',
      alignItems: 'center',
      position: 'absolute',
      zIndex: 99,
    },
  });

export default ItemsCarousel;
