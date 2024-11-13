/* @flow */
import {createTheming} from '@callstack/react-theme-provider';

import type {ThemingType} from '@callstack/react-theme-provider';

export type Theme = {
  primaryColor: string,
  accentColor: string,
  backgroundColor: string,
  textColor: string,
  secondaryColor: string,
};

export const themes: {[key: string]: Theme} = {
  default: {
    primaryColor: '#171d2b',
    secondaryColor: '#505a7b',
    backgroundColor: '#262f4a', //content bg
    textColor: '#f7f7f7',
    accentColor: '#5f8559',
  },
};

const {
  ThemeProvider,
  withTheme,
}: ThemingType<Theme, $Shape<Theme>> = createTheming(themes.default);

export {ThemeProvider, withTheme};
