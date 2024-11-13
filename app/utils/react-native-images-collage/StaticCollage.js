import React from 'react';
import { View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import ImageWithSkeleton from './ImageWithSkeleton';

const StaticCollage = ({
  matrix,
  direction,
  seperatorStyle,
  onPress,
  images,
}) => {
  const renderMatrix = () => {
    const reducer = (accumulator, currentValue) => accumulator + currentValue;
    const sectionDirection = direction === 'row' ? 'column' : 'row';

    return matrix.map((element, m, array) => {
      const startIndex = m ? array.slice(0, m).reduce(reducer) : 0;
      const renderedImages = images
        .slice(startIndex, startIndex + element)
        .map((image, i) => {
          // Determines if the source is a URL, or local asset
          const source = !Number.isInteger(image)
            ? { uri: image }
            : Image.resolveAssetSource(image);

          return (
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => onPress(i + startIndex)}
              key={source.uri}
            >
              <ImageWithSkeleton
                source={source}
                style={{
                  aspectRatio: 0.8,
                  height: images.length > 4 ? '55%' : '67%',
                }}
                index={i}
              />
            </TouchableOpacity>
          );
        });

      return (
        <View
          key={m}
          style={[
            {
              flex: 1,
              height: '100%',
              width: '100%',
              flexDirection: 'column',
              justifyContent: 'space-around',
              alignItems: 'center',
              alignSelf: 'flex-start',
              alignContent: 'space-around',
              margin: 5,
            },
            seperatorStyle,
          ]}
        >
          {renderedImages}
        </View>
      );
    });
  };
  return (
    <View
      style={{
        flex: 1,
        flexDirection: 'column',
        alignSelf: 'center',
        alignItems: 'center',
      }}
    >
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          alignSelf: 'center',
          alignItems: 'center',
        }}
      >
        {renderMatrix()}
      </View>
    </View>
  );
};

StaticCollage.defaultProps = {
  // VARIABLES
  direction: 'column',
  // STYLE OF SEPERATORS ON THE COLLAGE
  seperatorStyle: {
    borderWidth: 0,
    borderColor: 'white',
  },

  // STYLE
  containerStyle: {
    // borderWidth: 4,
    // borderColor: 'black',
    // backgroundColor: 'green'
  },
  imageStyle: {}, // DEFAULT IMAGE STYLE
};

StaticCollage.propTypes = {
  images: PropTypes.array,
  matrix: PropTypes.array,
  onPress: PropTypes.func,
  direction: PropTypes.oneOf(['row', 'column']),
};

export { StaticCollage };

const styles = StyleSheet.create({
  hideComponent: {
    width: 0,
    height: 0,
    opacity: 0,
  },
});
