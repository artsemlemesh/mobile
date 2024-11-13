import React, { useMemo } from 'react'
import { WebView } from 'react-native-webview';
import { Dimensions } from 'react-native';
import { Label, View } from 'native-base';

function WebViewConponent({navigation ,  url}) {
  const { width, height } = Dimensions.get('window');
  return (
    <WebView
        onNavigationStateChange={navigation}
        source = {{uri:url}}
        style={{ flex: 1, width: width - 40, height: 1200 }}
        />
  )
}

export default React.memo(WebViewConponent)