import { StyleSheet, Dimensions } from 'react-native'
import { ThemeStatic, Typography } from '@app/theme';

import { ThemeColors } from '@app/types/theme';
const { width, height } = Dimensions.get("window");
const ratio = width / height;
export const styles = (theme = {} as ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'transparent',
      flexDirection: 'row',
      height: height,
      paddingBottom: 100
    },
    content: {
      flex: 1,
    },
    fadeView: {
      flex: 1,
    },
    centerContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center'
    },
    textBtn: {
      flex: 0.1,
      alignSelf: 'flex-end',
      alignItems: 'center',
    },
    imageStyle: {
      height: width / (5 * ratio),
      width: (width) / 5,
      resizeMode: 'stretch'
    },
    postButtonStyle: {
      backgroundColor: ThemeStatic.accent,
      height: 40,
      width: '80%',
      borderRadius: 5,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 10,
      marginBottom: 10,
    },
    buttonText: {
      fontSize: 15,
      fontWeight: 'bold',
      color: 'white',
    },
    takeImageBtn: {
      backgroundColor: '#FF0266',
      width: 75,
      height: 75,
      borderRadius: 50,
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    cancelBtn: {
      backgroundColor: '#424242',
      width: 75,
      height: 75,
      borderRadius: 4,
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    subContainer: {
      shadowOffset: { height: 5 }, shadowOpacity: 0.3,
      backgroundColor: 'white',
      paddingVertical: 20, margin: 10,
      borderRadius: 5,
      justifyContent: 'center',
      alignItems: 'center'
    },
    listStyle: {
      //flex: 1,
      // width: width - 20,
      padding: 20
    },
    cellContatiner: {
      marginVertical: 15,
      flexDirection: 'row',
      // justifyContent: 'center'
      alignItems: 'center',
      paddingHorizontal: 20
    },
    inputCaption: {
      fontSize: 14,
      textAlign: 'left',
      lineHeight: 14,
      color: 'black',
      textAlignVertical: 'bottom',
      marginRight: 10,
      flex:2
    },
    inputTextContainer: {
      flex: 5,
      height: 35,
      width: 200,
      borderColor: '#0098E6',
      borderBottomWidth: 1,
      fontSize: 14,
      backgroundColor: 'rgba(255,255,255,0.3)',
      borderRadius: 2,
      textAlign: 'left',
      color: 'black',
    },
  });