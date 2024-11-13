import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  root: {
    height: 38,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    width: '100%'
  },
  navigationButton: {
    width: 70,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  stepperCount: {
    display: 'flex',
    flexDirection: 'row'
  },
  currentPage: {
    fontSize: 14,
    color: 'green',
   // fontFamily: Fonts.type.medium
  },
  pages: {
    fontSize: 14,
    color: 'black',
//fontFamily: Fonts.type.medium
  }
});

export default styles;
