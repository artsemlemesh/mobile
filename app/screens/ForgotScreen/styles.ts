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
    forgotButton: {
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
    forgotButtonText: {
      ...FontWeights.Regular,
      ...FontSizes.Body,
      marginLeft: 10,
      color: theme.accent,
    },
    terms: {
      alignItems: 'center',
      justifyContent: 'center',
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
    termsTextForgotPassword: {
      ...FontWeights.Light,
      ...FontSizes.Body,
      color: '#666',
      textDecorationLine: 'underline',
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
      marginTop: 25,
      marginBottom: 25,
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
    forgotItem: {
      marginHorizontal: 7,
      marginBottom: 15,
      height: 50,
    },

    input: {
      color: ThemeStatic.text01,
      fontSize: 14,
      paddingLeft: 10,
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
    recoverInContainer: {
      color: 'white',
      fontSize: 25,
      marginTop: 15,
      fontWeight: 'bold',
    },
    recoverInDescription: {
      color: 'white',
      fontSize: 17,
      marginTop: 15,
      paddingBottom: 25,
    },
    textField: {
      backgroundColor: '#EFEFEF',
      borderRadius: 5,
      flexDirection: 'row',
      paddingVertical:10,
      alignItems:'center'
    },
    inputIcons: { color: '#B1B2B1', fontSize: 24, paddingLeft: 10 },
  });
