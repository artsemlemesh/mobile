import React, { useContext, useRef, useEffect, useState, createRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
} from 'react-native';
import { Modalize } from 'react-native-modalize';
import { responsiveWidth } from 'react-native-responsive-dimensions';
import { AppContext } from '@app/context';
import { ThemeStatic, Typography } from '@app/theme';
import { useSelector, useDispatch } from 'react-redux';
import { WebView } from 'react-native-webview';
import { ThemeColors } from '@app/types/theme';
const { width, height } = Dimensions.get("window");
const { FontWeights, FontSizes } = Typography;

interface BottomSheetProps {
  ref: React.Ref<any>,
  onSheetlose: () => void,
  webViewUrl: string
};

const BottomSheet: React.FC<BottomSheetProps> = React.forwardRef(({ onSheetlose, webViewUrl }, ref) => {
  const { theme } = useContext(AppContext);
  const dispatch = useDispatch();
  const user = useSelector(state => state.user);

  let content = (
    <>

      <WebView
        source={{ uri: webViewUrl }}
        style={{ flex: 1, width: width - 40, height: height }} />

    </>
  );
  return (
    <Modalize
      //@ts-ignore
      ref={ref}
      scrollViewProps={{ showsVerticalScrollIndicator: false }}
      modalStyle={styles(theme).container}
    >
      <View style={styles().content}>
        {content}
      </View>
    </Modalize>
  );
});

const styles = (theme = {} as ThemeColors) => StyleSheet.create({
  container: {
    marginTop: 50,
    padding: 20,
    backgroundColor: theme.base,
  },
  content: {
    // paddingTop: 20
    flex: 1
  },
  subContent: {
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  typeText: {
    ...FontWeights.Bold,
    ...FontSizes.Caption,
    color: theme.text01,
    textAlign: 'center'
  },
  buttonStyle: {
    flex: 1,
    marginHorizontal: 5,
    height: 30,
    paddingVertical: 0
  },
  label: {
    ...FontWeights.Light,
    ...FontSizes.Body,
    width: responsiveWidth(74),
    color: theme.text01
  },
  subTitle: {
    ...FontWeights.Light,
    ...FontSizes.Body,
    width: responsiveWidth(74),
    color: theme.text01
  },


});

export default BottomSheet;