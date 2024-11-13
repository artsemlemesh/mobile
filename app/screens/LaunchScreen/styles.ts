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
      height: 102,
      width: 102,
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
      borderRadius: 50,
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
      borderRadius: 30,
      justifyContent: 'center',
      alignItems: 'center',
      paddingTop: 14,
      paddingBottom: 14,
      margin: 7,
    },
  });
