import Constants from 'expo-constants';
import { Platform } from 'react-native';

// import { ENV_NAME } from '@env';
const {
  author: { name, email, url },
  repository: { url: repository },
  version,
} = require('../../package.json');

const codepush = {
  staging: Platform.select({
    ios: '<private>',
    android: '<private>',
  }),
  production: Platform.select({
    ios: '<private>',
    android: '<private>',
  }),
};


const STRIPE_PK = 'pk_test_51Mw5SEL57dGnBnScUFqGMHdOgUaFVUUCDTDMTcjFZ9fSGhJVx80ao3xOD5zJ5Az6yCfzZeOFfFjiUS0CyQUJjvha00TQ474QWO';
const STRIPE_PK_PROD = 'pk_live_51Mw5SEL57dGnBnScBtGE4XBe2KfHsDOiqHtW1D5VUmOWj7NC4KmF6xCR7rmX4mSbvang4qIYdctarVQU7A9n9RzH004kJlhNzV';
const GOOGLE_PLACE_API_KEY = 'AIzaSyCw7O8ydcHBvr2psYkmYhavwCkxZ-wUiuY';
const AMPLITUDE_API_KEY = '148f693b4f2b695801a34e9288f12b29';
const SENTRY_DSN = 'https://997d0d7d3e47430a8b17257b634b6924@o399095.ingest.sentry.io/5444218';


// default - use staging db for backend
// dev - local debug => use .env > ENV_NAME=development
// staging => release channel
// prod => release

// const ENV_NAME = 'production';
// const ENV_NAME = 'development';
const ENV_NAME = process.env.EXPO_PUBLIC_ENV;
// get value from env

console.log('ENV_NAME', ENV_NAME);


function getEnvironment() {

  switch (ENV_NAME) {
    case 'staging':
      return {
        ENV_NAME: 'STAGING',
        API_BASE_URL: 'https://api-uat.bundleup.co',
        BASE_URL: 'https://uat.bundleup.co',
        STRIPE_PK: STRIPE_PK,
      };
    case 'production':
      return {
        ENV_NAME: 'PRODUCTION',
        API_BASE_URL: 'https://api-prod.bundleup.co',
        BASE_URL: 'https://www.bundleup.co',
        STRIPE_PK: STRIPE_PK_PROD,
      };
    default:// case 'development':
      return {
        ENV_NAME: 'DEVELOPMENT',
        API_BASE_URL: 'http://localhost:8000',
        BASE_URL: 'https://localhost:3000',
        STRIPE_PK: STRIPE_PK,
      };
  }
}

const env = getEnvironment();

const Config = {
  author: { name, email, url },
  repository,
  version,
  codepush,
  url: {
    https: 'https://',
    wss: 'wss://',
  },

  env: env.ENV_NAME,
  api_base_url: env.API_BASE_URL,
  // api_base_url: 'https://api-prod.bundleup.co',
  base_url: env.BASE_URL,
  stripe_pk: env.STRIPE_PK,

  sentry_dsn: SENTRY_DSN,
  amplitude_api_key: AMPLITUDE_API_KEY,
  rudderstack_data_plane_url: 'https://bundleupigrwiv.dataplane.rudderstack.com',
  rudderstack_write_key: '2YS1dighiT6Cj2Sbr6h2DWYEu7A',
  google_place_api_key: GOOGLE_PLACE_API_KEY,
};

export default Config;
