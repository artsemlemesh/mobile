import React from 'react';
import {View} from 'native-base';
import {StackedBarChart, Grid} from 'react-native-svg-charts';

const StackedBar: React.FC = () => {
  const data = [
    {
      //   month: new Date(2015, 0, 1),
      new: 5,
      excellent: 18,
      play: 2,
    },
  ];

  const colors = ['blue', 'green', 'orange'];
  const keys = ['new', 'excellent', 'play'];

  return (
    <View>
      <StackedBarChart
        style={{height: 25}}
        keys={keys}
        colors={colors}
        data={data}
        showGrid={false}
        contentInset={{top: 10, bottom: 10}}
        horizontal={true}>
        <Grid />
      </StackedBarChart>
    </View>
  );
};
export default StackedBar;
