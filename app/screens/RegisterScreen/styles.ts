import { StyleSheet, Dimensions, Platform } from 'react-native';
import { ThemeStatic, Typography } from '@app/theme';
import { isIphoneX } from '@app/utils/common';
import { ThemeColors } from '@app/types/theme';
import {
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
const { FontWeights, FontSizes } = Typography;
const { width, height } = Dimensions.get('window');
const ratio = width / height;
export const styles = (theme = {} as ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.accent,
      alignItems: 'center',
    },
    content: {
      marginTop: responsiveHeight(6),
      marginBottom: responsiveHeight(6),
      marginHorizontal: 20,
      flexDirection: 'column',
      alignSelf: 'flex-start',
      flex: 1,
    },
    titleText: {
      ...FontWeights.Bold,
      ...FontSizes.Label,
      color: '#666',
      textAlign: 'center',
    },
    termsTitleText: {
      ...FontWeights.Regular,
      ...FontSizes.Label,
      marginVertical: 10,
      color: theme.text01,
    },
    subtitleText: {
      ...FontWeights.Light,
      ...FontSizes.Caption,

      color: '#888',
      textAlign: 'center',
      marginBottom: 20,
    },
    banner: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingTop: responsiveHeight(Platform.select({ ios: 10, android: 12 })),
      paddingBottom: 40,
    },
    logo: {
      flex: 1,
      alignItems: 'center',
    },
    loginButton: {
      height: 44,
      width: responsiveWidth(90),
      alignSelf: 'center',
      marginBottom: 10,
      borderWidth: Platform.select({
        ios: StyleSheet.hairlineWidth,
        android: 0.8,
      }),
      borderColor: theme.accent,
      backgroundColor: theme.base,
    },
    loginButtonText: {
      ...FontWeights.Regular,
      ...FontSizes.Body,
      marginLeft: 10,
      color: theme.accent,
    },
    appleSignIn: {
      height: 44,
      width: responsiveWidth(90),
      marginBottom: 10,
    },
    loadingAppleLogin: {
      height: 44,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 10,
    },
    terms: {
      display: 'flex', flexDirection: 'row', alignSelf: 'center'
    },
    termsView: {
      flex: 0.15,
    },
    termsText: {
      fontSize: 14,
      color: 'black',
      display: 'flex',
      flexDirection: 'row'
    },
    termsCall:{
      display: 'flex',
      flexDirection: 'row'
    },
    resendText: {
      color: '#7876DF',
    },
    socialContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    logoImage: {
      height: 64,
      width: 64,
      resizeMode: 'stretch',
      marginBottom: 20,
      alignSelf: 'center',
    },
    backgroundImage: {
      flex: 1,
      width: width,
      resizeMode: 'cover',
      justifyContent: 'center',
    },
    roundedView: {
      borderRadius: 23,
      width: responsiveWidth(90),
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
    roundedContent: {
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'space-evenly',
      // backgroundColor: 'green'
    },
    button: {
      borderRadius: 7,
      justifyContent: 'center',
      alignItems: 'center',
      paddingTop: 12,
      paddingBottom: 12,
      margin: 7,

      marginTop: 30,
    },
    iconStyle: {
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
      zIndex: 99,
      left: 10,
    },
    loginItem: {
      marginHorizontal: 7,
      marginBottom: 15,
      height: 50,
      //backgroundColor:"green"
      //width: '100%'
    },

    input: {
      color: ThemeStatic.text01,
      // fontFamily: Fonts.type.base,
      fontSize: 14,
      backgroundColor: '#EFEFEF',
      borderRadius: 5,
      flex:1
    },
    placeholderIcon: {
      position: 'absolute',
      bottom: 16,
    },
    sectionText: {
      // fontFamily: Fonts.type.base,
      fontSize: 12,
      color: ThemeStatic.text02,
      paddingLeft: 32,
    },
    sectionRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    halfCol: {
      width: '47%',
      height: 50,
      marginHorizontal: 7,
    },

    twoThreeCol: {
      width: '63%',
      height: 50,
      marginHorizontal: 7,
    },
    oneThreeCol: {
      width: '30%',
      height: 50,
      marginHorizontal: 7,
    },
    section: {
      marginBottom: 15,
      position: 'relative',
      height: 50,
      marginHorizontal: 7,
    },
    registerInContainer: {
      color: 'white',
      fontSize: 25,
      marginTop: 15,
      fontWeight: 'bold',
    },
    registerInDescription: {
      color: 'white',
      fontSize: 17,
      marginTop: 15,
      paddingBottom: 25,
    },
    icons: {
      borderRadius: 5,
      fontSize: 24,
      color: '#B1B2B1',
      padding: 10,
    },
    textField: {
      backgroundColor: '#EFEFEF',
      borderRadius: 5,
      flexDirection:'row',
      marginTop:10
      
    },
    fullName: {
      width: '100%',
      display: 'flex', 
      flexDirection: 'row',
    },
    EmailField: {
      width: '100%',
    },
    PasswordField: {
      width: '100%',
    },
    color: {
      color: '#7876DF',
      fontWeight: 'bold'
    },
    textcolor:{
      color: '#7876DF',
      fontSize: 14,
      display: 'flex',
    },
    separatorStyle: {
      marginTop: 30,
      justifyContent: 'center',
      alignItems: 'center',
      paddingBottom: 20,
    },
    cardViewStyle: {
      paddingTop: 20,
      paddingBottom: 20,
      flex: 1,
      marginTop: 1.5,
      alignItems: 'center',
      justifyContent: 'center',
    },
    skipButton: {
      color: '#6E6E72',
    },
    root: { flex: 1,},
    codeFieldRoot: { color: 'black', padding: 30 },
    cell: {
      width: 50,
      height: 50,
      lineHeight: 38,
      fontSize: 24,
      borderWidth: 2,
      borderColor: '#EFEFEF',
      textAlign: 'center',
      color: 'black',
      backgroundColor: '#EFEFEF',
      paddingTop: 5
    },
    focusCell: {
      borderColor: '#EFEFEF',
    },
  });
