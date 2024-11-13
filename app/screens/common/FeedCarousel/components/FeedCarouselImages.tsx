import React from 'react';
import { StaticCollage } from '@app/utils/react-native-images-collage';
import { LayoutData } from '../Layouts';
import { getImageUrl } from '@app/utils/common';
import { Dimensions, View, StyleSheet } from 'react-native';
import { BUNDLE_ITEMS_PER_PAGE } from '@app/utils/constants';

const screenHeight = Math.round(Dimensions.get('window').height);

interface FeedCarouselImagesProps {
  number: number;
  activeIndex: number;
  pageIndex: number;
  items: any;
  onPress: (index: number) => void;
}

const FeedCarouselImages: React.FC<FeedCarouselImagesProps> = ({
  number,
  activeIndex,
  pageIndex,
  items,
  onPress,
}) => {
  let num = Number(number);
  let imgArray = [];
  items.map((item) => {
    if (item.images) {
      imgArray.push(getImageUrl(item, true));
    }
  });
  const photos = imgArray.slice(
    pageIndex * BUNDLE_ITEMS_PER_PAGE,
    pageIndex * BUNDLE_ITEMS_PER_PAGE + num
  );

  return (
    <View style={{ flex: 1, height: screenHeight * 0.4 }}>
      <StaticCollage
        images={photos}
        onPress={(i) => {
          onPress(activeIndex * BUNDLE_ITEMS_PER_PAGE + i);
        }}
        matrix={LayoutData[num][0].matrix}
        direction={LayoutData[num][0].direction}
      />
    </View>
  );
};

export default FeedCarouselImages;
