import React, { useEffect, useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';

import {
  createStackNavigator,
  TransitionPresets,
} from '@react-navigation/stack';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { StackRoutes, TabBarRoutes, ProfileRoutes } from './Routes';
import TabBarComponent from './TabBarComponent';

import Analytics from '@app/utils/Analytics';
import { ThemeStatic } from '@app/theme';

import {
  LoginScreen,
  AddressFlow,
  ForgotScreen,
  LaunchScreen,
  ListingDetail,
  RegisterScreen,
  ListingItemList,
  ListingItemDetail,
  SuppliesScreen,
} from '@app/screens';

import { useSelector } from 'react-redux';
import { CommonActions } from '@react-navigation/native';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function HomeStack() {
  return (
    <Stack.Navigator
      initialRouteName="HomeScreen"
      screenOptions={{ ...TransitionPresets.SlideFromRightIOS }}
      headerMode="none"
    >
      <Stack.Screen name="HomeScreen" component={TabBarRoutes.HomeScreen} />
      <Stack.Screen name="Profile" component={TabBarRoutes.ProfileScreen} />
    </Stack.Navigator>
  );
}

function CartStack() {
  return (
    <Stack.Navigator
      initialRouteName="CartScreen"
      screenOptions={{ ...TransitionPresets.SlideFromRightIOS }}
      headerMode="none"
    >
      <Stack.Screen name="CartScreen" component={TabBarRoutes.CartScreen} />
      {/* <Stack.Screen
        name="CheckoutScreen"
        component={StackRoutes.CheckoutScreen}
      /> */}
      <Stack.Screen
        name="PaymentSuccess"
        component={StackRoutes.PaymentSuccess}
      />
    </Stack.Navigator>
  );
}

function SellingStack() {
  return (
    <Stack.Navigator
      // initialRouteName="AddressFlow"
      initialRouteName="SellingScreen"
      screenOptions={{ ...TransitionPresets.SlideFromRightIOS }}
      headerMode="none"
    >
      <Stack.Screen
        name="SellingScreen"
        component={TabBarRoutes.SellingScreen}
      />
      <Stack.Screen
        name="SellingSingleScreen"
        component={ProfileRoutes.SellingSingleDetail}
      />
      <Stack.Screen
        name="SellingDetail"
        component={StackRoutes.SellingDetail}
      />
      <Stack.Screen name="ListingFlow" component={StackRoutes.ListingFlow} />
      <Stack.Screen name="AddressFlow" component={AddressFlow} />
    </Stack.Navigator>
  );
}

function ProfileStack() {
  return (
    <Stack.Navigator
      initialRouteName="ProfileScreen"
      screenOptions={{ ...TransitionPresets.SlideFromRightIOS }}
      headerMode="none"
    >
      <Stack.Screen
        name="ProfileScreen"
        component={TabBarRoutes.ProfileScreen}
      />
      <Stack.Screen
        name="PurchaseScreen"
        component={ProfileRoutes.PurchaseScreen}
      />
      <Stack.Screen
        name="SellingPurchaseScreen"
        component={ProfileRoutes.SellingPurchaseScreen}
      />

      <Stack.Screen
        name="SellingSingleScreen"
        component={ProfileRoutes.SellingSingleDetail}
      />
      <Stack.Screen
        name="SellingDetail"
        component={StackRoutes.SellingDetail}
      />
      <Stack.Screen name="OrderDetails" component={StackRoutes.OrderDetails} />
      <Stack.Screen name="AddressFlow" component={ProfileRoutes.AddressFlow} />
    </Stack.Navigator>
  );
}

function TabNavigator() {
  return (
    <Tab.Navigator
      lazy={true}
      tabBarOptions={{
        showLabel: false,
        activeTintColor: ThemeStatic.accent,
      }}
      tabBar={(props) => <TabBarComponent {...props} />}
    >
      <Tab.Screen name="HomeScreen" component={HomeStack} />
      <Tab.Screen name="CartScreen" component={CartStack} />
      <Tab.Screen name="SellingScreen" component={SellingStack} />
      <Tab.Screen name="CameraScreen" component={TabBarRoutes.CameraScreen} />
      <Tab.Screen name="ProfileScreen" component={ProfileStack} />
    </Tab.Navigator>
  );
}

function AuthStack() {
  return (
    <Stack.Navigator headerMode="none">
      <Stack.Screen name="LaunchScreen" component={LaunchScreen} />
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
      <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
      <Stack.Screen name="ForgotScreen" component={ForgotScreen} />
      {/* <Stack.Screen
        name="RegisterScreen"
        component={StackRoutes.RegisterScreen}
      />
      <Stack.Screen name="LoginScreen" component={StackRoutes.LoginScreen} />
      <Stack.Screen name="ForgotScreen" component={StackRoutes.ForgotScreen} /> */}
    </Stack.Navigator>
  );
}

function AppStack() {
  return (
    <Stack.Navigator
      screenOptions={{ ...TransitionPresets.SlideFromRightIOS }}
      headerMode="none"
    >
      <Stack.Screen name="TabNavigator" component={TabNavigator} />
      <Stack.Screen name="ListingDetail" component={ListingDetail} />
      <Stack.Screen name="ListingItemList" component={ListingItemList} />
      <Stack.Screen name="ListingItemDetail" component={ListingItemDetail} />
      <Stack.Screen name="SuppliesScreen" component={SuppliesScreen} />
    </Stack.Navigator>
  );
}

function getActiveRouteName(navigationState) {
  if (!navigationState) {
    return null;
  }
  const route = navigationState.routes[navigationState.index];
  // Dive into nested navigators
  if (route.state) {
    return getActiveRouteName(route.state);
  }
  return route.name;
}

export default ({ initialScreen }) => {
  const routeNameRef = useRef();
  const navigationRef = useRef();

  const user = useSelector((state) => state?.user);
  const isLoggedIn = !!user?.profile?.email;

  useEffect(() => {
    if (!isLoggedIn) {
      // Reset the navigation state after logout
      navigationRef.current?.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'Auth' }],
        })
      );
    }
  }, [isLoggedIn]);

  return (
    <NavigationContainer
      ref={navigationRef}
      onStateChange={() => {
        const previousRouteName = routeNameRef.current;
        const currentRouteName = getActiveRouteName(
          navigationRef?.current?.getRootState()
        );

        if (previousRouteName !== currentRouteName) {
          // The line below uses the `console.log` function to log out the current route name.
          console.log('Current route name:', currentRouteName);
          // If you have an analytics service, you can call it here too.
          Analytics.screen(currentRouteName);
        }

        // Save the current route name for later comparison
        routeNameRef.current = currentRouteName;
      }}
    >
      <Stack.Navigator headerMode="none">
        <>
          {!isLoggedIn && (
            <>
              <Stack.Screen name="Auth" component={AuthStack} />
              <Tab.Screen name="ProfileScreen" component={ProfileStack} />
              <Stack.Screen name="SellingScreen" component={SellingStack} />
            </>
          )}
          <Stack.Screen name="App" component={AppStack} />
          <Stack.Screen
            name="CheckoutScreen"
            component={StackRoutes.CheckoutScreen}
          />
        </>
      </Stack.Navigator>
    </NavigationContainer>
  );
};
