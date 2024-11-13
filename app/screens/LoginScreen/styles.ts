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
      // backgroundColor: theme.accent,
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
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 25,
    },
    termsView: {
      flex: 0.15,
    },
    termsText: {
      ...FontWeights.Light,
      ...FontSizes.Body,
      color: '#666',
      marginTop: 10,
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
      marginTop: 32,
      paddingTop: 12,
      paddingBottom: 12,
      margin: 7,
    },
    iconStyle: {
      justifyContent: 'center',
      alignItems: 'center',
      position: 'absolute',
      width: 34,
      height: 34,
      zIndex: 99,
      left: 10,
    },
    loginItem: {
      height: 70,
      // backgroundColor:"green"
      width: '100%',
      paddingTop: 10,
    },

    input: {
      paddingLeft: 10,
      // paddingBottom: 5,
      borderColor: ThemeStatic.text02,
      // fontFamily: Fonts.type.base,
      fontSize: 14,
      // backgroundColor:'red'
    },
    inputIcons: { color: '#B1B2B1', fontSize: 24, paddingLeft: 10 },
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
    textField: {
      backgroundColor: '#EFEFEF',
      borderRadius: 5,
      flexDirection: 'row',
      paddingVertical:10,
      alignItems:'center'
    },
    termsTextForgotPassword: {
      ...FontWeights.Light,
      ...FontSizes.Body,
      color: '#846BE2',
      fontWeight: 'bold',
      paddingTop: 10,
    },
    signInContainer: {
      color: 'white',
      fontSize: 25,
      marginTop: 15,
      fontWeight: 'bold',
    },
    signInDescription: {
      color: 'white',
      fontSize: 17,
      marginTop: 15,
      paddingBottom: 25,
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
    socailIcons: {
      color: 'black',
      fontSize: 28,
      backgroundColor: '#666666',
      padding: 6,
      borderRadius: 3,
      marginLeft: 12,
      width: 40,
    },
    skipButton: {
      color: '#6E6E72',
    },
  });
