import Config from '@app/config';

// Amplitude (deprecated)
// import * as Amplitude from '@amplitude/react-native';

// Rudderstack
import rudderClient from '@rudderstack/rudder-sdk-react-native';

const rudderInitialize = async () => {
  try {
    await rudderClient.setup(Config.rudderstack_write_key, {
      dataPlaneUrl: Config.rudderstack_data_plane_url,
      trackAppLifecycleEvents: true,
      recordScreenViews: false,
      autoSessionTracking: true, // Set to false to disable automatic session tracking
      sessionTimeout: 10 * 60 * 1000,
    });
  } catch (err) {
    console.log(err);
  }
};

export function initialize() {
  rudderInitialize();
}

const defaultProperties = {
  env: Config.env
};

export function track(event, properties = {}, options = {}) {
  try {
    if (!rudderClient.isInitialized) {
      initialize();
    }
    properties = {...properties, ...defaultProperties};
    rudderClient.track(event, properties, options);
  } catch (err) {
    console.log(err);
  }
  
  
}

export function screen(name, properties = {}, options = {}) {
  try {
    // Automatically being captured from recordScreenViews: true
    if (!rudderClient.isInitialized) {
      initialize();
    }
    properties = {...properties, ...defaultProperties};
    rudderClient.screen(name, properties, options);
  } catch (err) {
    console.log(err);
  }
  
}

export function identify(id, properties = {}, options = {}) {
  try {
    if (!rudderClient.isInitialized) {
      initialize();
    }
    // ID being used is the backend user ID
    // Use the current environment variable with the properties
    properties = {...properties, ...defaultProperties};
    const envUserId = Config.env + '_' + id;
    rudderClient.identify(envUserId, properties, options);

    // rudderClient.identify(id, properties, options);

    // Example for options
    // const options = {
    //   externalIds: [
    //     {
    //       id: "some_external_id_1",
    //       type: "brazeExternalId",
    //     },
    //   ],
    // }

    // Example for properties
    // {
    //   email: "alex@example.com",
    //   location: "UK",
    // },
  } catch (err) {
    console.log(err);
  }

}

export function reset() {
  try {
    if (!rudderClient.isInitialized) {
      initialize();
    }
    rudderClient.reset(false);
  } catch (err) {
    console.log(err);
  }
}

export default {
  initialize,
  track,
  screen,
  identify,
  reset,
};
