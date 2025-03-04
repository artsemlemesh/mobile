import { StyleSheet, Dimensions } from 'react-native';
import { ThemeStatic, Typography } from '@app/theme';
import {
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
const { FontWeights, FontSizes } = Typography;
import { ThemeColors } from '@app/types/theme';
const { width, height } = Dimensions.get('window');
const ratio = width / height;
export const styles = (theme = {} as ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
    },
    backgroundImage: {
      flex: 1,
      resizeMode: 'cover',
      justifyContent: 'center',
      width: width,
    },
    content: {
      flex: 1,
    },
    roundedView: {
      borderRadius: 50,
      width: responsiveWidth(90),
      height: responsiveHeight(60),
      backgroundColor: 'white',
      alignSelf: 'center',
      alignContent: 'center',
    },
    roundedViewInner: {
      width: responsiveWidth(80),
      flex: 1,
      flexDirection: 'column',
      alignSelf: 'center',
      alignContent: 'center',
      textAlign: 'center',
      justifyContent: 'center',
      margin: 20,
    },
    titleText: {
      ...FontWeights.Bold,
      ...FontSizes.Label,
      color: '#666',
      textAlign: 'center',
    },
    fadeView: {
      flex: 1,
    },
    centerContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 10,
    },
    textBtn: {
      flex: 0.1,
      alignSelf: 'flex-end',
      alignItems: 'center',
    },
    imageStyle: {
      height: width / (5 * ratio),
      width: width / 5,
      resizeMode: 'stretch',
    },
    postButtonStyle: {
      backgroundColor: ThemeStatic.accent,
      height: 40,
      width: '95%',
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
      shadowOpacity: 0.3,
      backgroundColor: 'white',
      padding: 10,
      paddingTop: 30,
      marginVertical: 40,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
    },
    listStyle: {
      //flex: 1,
      // width: width - 20,
      padding: 20,
    },
    cellContatiner: {
      marginVertical: 20,
      flexDirection: 'column',
      // justifyContent: 'center'
      // alignItems: 'center',
      justifyContent: 'space-between',
      // paddingHorizontal: 20,
    },
    inputCaption: {
      fontSize: 14,
      textAlign: 'left',
      lineHeight: 14,
      color: 'black',
      textAlignVertical: 'bottom',
      marginRight: 10,
      flex: 2,
    },
    inputTextContainer: {
      flex: 5,
      // height: 35,
      width: 200,
      borderColor: '#0098E6',
      borderBottomWidth: 1,
      fontSize: 14,
      backgroundColor: 'rgba(255,255,255,0.3)',
      borderRadius: 2,
      textAlign: 'left',
      color: 'black',
    },
    section: {
      marginBottom: 15,
      position: 'relative',
      height: 50,
      marginHorizontal: 7,
      width: responsiveWidth(70),
    },
    description: {
      marginBottom: 15,
      position: 'relative',
      marginHorizontal: 7,
      width: responsiveWidth(70),
    },
    sectionText: {
      fontSize: 12,
      color: ThemeStatic.text02,
      paddingLeft: 10,
    },
    input: {
      paddingLeft: 10,
      borderBottomWidth: 0.5,
      borderColor: ThemeStatic.accent,
      color: ThemeStatic.text01,
      //fontFamily: Fonts.type.base,
      fontSize: 14,
      paddingBottom: 6,
    },
    uspsBoxImage: {
      resizeMode: 'contain',
      height: 60,
      width: '100%',
      // margin: 10,
      alignSelf: 'center',
    },
    shippingSelection: {
      flexDirection: 'row',
      borderWidth: 1,
      borderRadius: 10,
      borderColor: ThemeStatic.accentLight,
      margin: 5,
      padding: 10,
    },
  });
