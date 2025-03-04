import {StatusBarStyle} from 'react-native';

export type ThemeStaticType = {
  accent: string;
  accentLight: string;
  secondaryLight: string;
  white: string;
  black: string;
  text01: string;
  text02: string;
  placeholder: string;
  like: string;
  unlike: string;
  translucent: string;
  delete: string;
  badge: string;
  headerBackground: string;
  headerTitle: string;
  lightBlue: string;
};

export type ThemeColors = {
  lightBlue: any | ColorValue | undefined;
  accent: string;
  accentLight: string;
  secondaryLight: string;
  base: string;
  text01: string;
  text02: string;
  placeholder: string;
  white: string;
};

export type ThemeVariantType = {
  light: string;
  dark: string;
};

export type ThemeType = {
  type: string;
  colors: ThemeColors;
};

export type HandleAvailableColorType = {
  true: string;
  false: string;
};

export type OnlineDotColorType = {
  true: string;
  false: string;
};

export type DynamicStatusBarType = {
  [key: string]: {
    barStyle: StatusBarStyle;
    backgroundColor: string;
  };
};
