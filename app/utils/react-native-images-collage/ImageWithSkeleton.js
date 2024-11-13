import React, { useState } from 'react';
import FastImage from 'react-native-fast-image';
import { Skeleton } from 'native-base';
import { InteractionManager } from 'react-native';

const ImageWithSkeleton = ({
  source,
  style,
  accessibilityLabel = '',
  index = 0,
}) => {
  const hiddenStyle = {
    height: 250,
    width: 250,
    opacity: 0,
    position: 'absolute',
  };

  const [isLoaded, setIsLoaded] = useState(false);

  const onLoad = () => {
    InteractionManager.runAfterInteractions(() => {
      setIsLoaded(true);
    });
  };

  return (
    <>
      {!isLoaded && (
        <Skeleton
          startColor={'#eee'}
          endColor={'#ccc'}
          style={{
            margin: 2,
            height: 80,
            width: 80,
            ...style,
          }}
          isLoaded={isLoaded}
        />
      )}
      {source?.uri && (
        <FastImage
          style={isLoaded ? style : hiddenStyle}
          source={{ ...source, priority: FastImage.priority.normal }}
          resizeMode={FastImage.resizeMode.contain}
          accessibilityLabel={accessibilityLabel ?? `image${index}`}
          onLoadEnd={onLoad}
          onError={onLoad}
        />
      )}
    </>
  );
};
export default ImageWithSkeleton;
