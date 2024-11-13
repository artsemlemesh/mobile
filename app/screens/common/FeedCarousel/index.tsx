import React, { useState, useRef, useEffect } from 'react';
import { Dimensions, View } from 'react-native';
import Carousel from 'react-native-snap-carousel';
import { BUNDLE_ITEMS_PER_PAGE } from '@app/utils/constants';
import FeedCarouselPagination from './components/FeedCarouselPagination';
import FeedCarouselImages from './components/FeedCarouselImages';

const screenWidth = Math.round(Dimensions.get('window').width);

interface FeedCarouselProps {
  items: any;
  onPress: (index: number) => void;
}

const FeedCarousel: React.FC<FeedCarouselProps> = ({ items, onPress }) => {
  const carouselRef = useRef();
  const [activeIndex, setActiveIndex] = useState(0);
  const [dotLength, setDotLength] = useState(0);
  const [paginationItems, setPaginationItems] = useState<number[]>([]);

  useEffect(() => {
    let itemLength = items?.length;
    let dotsLength = Math.ceil(itemLength / BUNDLE_ITEMS_PER_PAGE);
    setDotLength(dotsLength);
    let datas: number[] = [];
    for (let i = 0; i < dotsLength; i++) {
      let temp = 0;
      if (i !== dotsLength - 1) {
        temp = BUNDLE_ITEMS_PER_PAGE;
      } else {
        temp = itemLength - (dotsLength - 1) * BUNDLE_ITEMS_PER_PAGE;
      }
      datas = [...datas, temp];
    }
    setPaginationItems(datas);
  }, [items]);

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
      }}
    >
      <Carousel
        layout={'default'}
        ref={carouselRef}
        data={paginationItems}
        sliderWidth={screenWidth}
        itemWidth={screenWidth}
        renderItem={({ item, index }) => (
          <FeedCarouselImages
            {...{
              number: item,
              items: items,
              activeIndex,
              pageIndex: index,
              onPress,
            }}
          />
        )}
        onSnapToItem={(index) => setActiveIndex(index)}
      />
      <FeedCarouselPagination activeIndex={activeIndex} dotLength={dotLength} />
    </View>
  );
};
export default FeedCarousel;
