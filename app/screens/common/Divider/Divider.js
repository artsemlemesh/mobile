import React from 'react';
import {View} from 'native-base';

class Divider extends React.Component{
  render(){
    return(
      <View style={{borderBottomColor: 'gray', borderBottomWidth: 1, marginTop: 7, marginBottom: 7}}/>
    )
  }
}

export default Divider;
