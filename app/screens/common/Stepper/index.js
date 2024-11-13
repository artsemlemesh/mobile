import React from 'react';
import { Text, TouchableOpacity, View, Image } from 'react-native';
import styles from './styles';
import { Icon } from 'native-base';
import { Feather } from '@expo/vector-icons';
class Stepper extends React.Component {
  render() {
    const { prevAction, nextAction, steps, currentPage } = this.props;

    return (
      <View style={styles.root}>
        <TouchableOpacity
          onPress={prevAction ? prevAction : () => {}}
          style={styles.navigationButton}
        >
          <Feather
            type="Feather"
            name="chevron-left"
            size={25}
            style={{ color: prevAction ? 'black' : 'gray' }}
          />
        </TouchableOpacity>
        <View style={styles.stepperCount}>
          <Text style={styles.currentPage}>
            {'step'} {currentPage}
          </Text>
          <Text style={styles.pages}>
            {' '}
            {'of'} {steps}
          </Text>
        </View>

        <TouchableOpacity
          onPress={nextAction ? nextAction : () => {}}
          style={styles.navigationButton}
        >
          <Feather
            type="Feather"
            size={25}
            name="chevron-right"
            style={{ color: nextAction ? 'black' : 'gray' }}
          />
        </TouchableOpacity>
      </View>
    );
  }
}

export default Stepper;
