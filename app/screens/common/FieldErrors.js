import React from 'react';
import { View,Text } from 'native-base';

class FieldErrors extends React.Component {
  render() {
    if (this.props.formSubmitted && this.props.errors.hasOwnProperty(this.props.fieldName)){
      if (this.props.fieldType==='radio'){
        return(
          <View>
            <Text style={style.error}>
              {this.props.errors[this.props.fieldName]}
            </Text>
          </View>)
      }
      else{
        return(
          <View>
            <Text style={style.error}>
              {this.props.errors[this.props.fieldName]}
            </Text>
          </View>);
      }
    }

    return null
  }
}

export default FieldErrors;

const style = {
  error: {
    color: 'red',
    marginLeft: 15
  },
}
