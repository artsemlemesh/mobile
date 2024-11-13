// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');
const { getSentryExpoConfig } = require('@sentry/react-native/metro');

// extra config is needed to enable `react-native-svg-transformer`
module.exports = (async () => {
  const {
    resolver: { sourceExts, assetExts },
  } = getDefaultConfig(__dirname);
  const config = getSentryExpoConfig(__dirname);

  return {
    transformer: {
      babelTransformerPath: require.resolve('react-native-svg-transformer'),
      assetPlugins: ['expo-asset/tools/hashAssetFiles'],
    },
    resolver: {
      assetExts: assetExts.filter((ext) => ext !== 'svg'),
      sourceExts: [...sourceExts, 'svg'],
    },
    ...config,
  };
})();
