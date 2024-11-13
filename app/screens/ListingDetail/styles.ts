import { StyleSheet, Dimensions } from 'react-native';
import { ThemeStatic, Typography } from '@app/theme';
import { isIphoneX } from '@app/utils/common';
import { ThemeColors } from '@app/types/theme';
const { width, height } = Dimensions.get('window');
const ratio = width / height;
export const styles = (theme = {} as ThemeColors) =>
  StyleSheet.create({
    userText: {
      fontSize: 10,
      color: 'black',
    },
    aboutText: {
      fontSize: 14,
      color: 'black',
    },
    aboutTextHeader: {
      fontSize: 12,
      color: '#666',
    },
    userRating: {
      fontSize: 10,
      color: 'green',
    },
    priceText: {
      fontSize: 19,
      textAlign: 'right',
      color: ThemeStatic.accent,
    },
    postedTime: {
      fontSize: 10,
      color: 'gray',
      textAlign: 'right',
    },
    titleText: {
      fontSize: 16,
      alignItems: 'flex-end',
      color: 'black',
    },
    bottomButton: {
      // marginTop: 50,
      alignItems: 'center',
      justifyContent: 'space-evenly',
    },
    userLogo: {
      height: 72,
      width: 72,
      borderRadius: 72,
    },
    userContainer: {
      flex: 1,
      alignItems: 'center',
    },
    iconStyle: {
      justifyContent: 'center',
      alignItems: 'center',
      position: 'absolute',
      width: 34,
      height: 34,
      zIndex: 99,
      top: 15
    },
    closeIcon: {
      justifyContent: 'center',
      alignItems: 'center',
      position: 'absolute',
      width: 34,
      height: 34,
      top: isIphoneX ? 60 : 10,
      zIndex: 99,
    },
    share: {
      right: 12,
      top: 15,
    },
    wish: {
      right: 40,
      top: 15,
    },
    back: {
      left: 10,
      top: 15,
    },
    carouselItem: {
      // width: width,
      // height: height / 2 + 25,
      flex: 1,
      aspectRatio: 1,
      resizeMode: 'contain',
    },
    exChange: {
      left: 20,
      top: -30,
      width: 34,
      height: 34,
    },
    paginationImageStyle: {
      width: width / 5 - 4,
      height: width / 5 + 4,
      // aspectRatio: 1,
      margin: 2,
      resizeMode: 'contain'
    },
    centeredView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalView: {
      width: '90%',
      margin: 10,
      backgroundColor: 'white',
      borderRadius: 5,
      padding: 30,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    textStyle: {
      color: 'white',
      fontWeight: 'bold',
      textAlign: 'center',
    },
    inputTextContainer: {
      flex: 5,
      // height: 35,
      width: 50,
      fontSize: 14,
      backgroundColor: 'rgba(255,255,255,0.3)',
      borderRadius: 2,
      textAlign: 'left',
      color: 'black',
    },
    rating: {
      margin: 5,
      borderColor: '#846BE2',
      borderWidth: 1,
      borderRadius: 8,
      width: '100%',
      padding: 10,
    },
    feedTextArea: {
      flexDirection: 'row-reverse',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 15,
      borderColor: '#846BE2',
      borderRadius: 8,
      borderWidth: 1,
      marginTop: 15,
    },
    submit: {
      backgroundColor: '#846BE2',
      width: '100%',
      alignItems: 'center',
      borderRadius: 8,
    },
  });
