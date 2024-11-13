import React from 'react';
import { Pagination } from 'react-native-snap-carousel';

interface FeedCarouselPaginationProps {
  activeIndex: number;
  dotLength: number;
}

const FeedCarouselPagination: React.FC<FeedCarouselPaginationProps> = ({
  activeIndex,
  dotLength,
}) => (
  <Pagination
    dotsLength={dotLength}
    activeDotIndex={activeIndex}
    containerStyle={{
      backgroundColor: 'rgba(255, 255, 255, 0.75)',
      paddingVertical: 5,
      marginBottom: 5,
      // backgroundColor: 'red',
    }}
    dotStyle={{
      width: 15,
      height: 15,
      borderRadius: 15,
      marginHorizontal: 8,
      backgroundColor: 'green',
      // backgroundColor: 'rgba(0, 0, 0, 0.92)',
    }}
    inactiveDotStyle={
      {
        // Define styles for inactive dots here
      }
    }
    animatedFriction={2}
    inactiveDotOpacity={0.4}
    inactiveDotScale={0.6}
  />
);

export default FeedCarouselPagination;
