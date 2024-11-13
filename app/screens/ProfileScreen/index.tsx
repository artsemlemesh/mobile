// import {useMutation, useQuery} from '@apollo/react-hooks';
import React, {
  useEffect,
  useState,
  useRef,
  Fragment,
  useContext,
} from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  View,
  Alert,
  ImageBackground,
  ActionSheetIOS,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { Badge, Text } from 'native-base';
// import { useNavigation } from 'react-navigation-hooks';
import * as ImagePicker from 'expo-image-picker';
import { ImageInfo } from 'expo-image-picker/build/ImagePicker.types';
import { Camera } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import mimes from 'react-native-mime-types';
import randomstring from 'random-string';
import { ThemeStatic } from '@app/theme';
import { useSelector, useDispatch } from 'react-redux';
import { removeToken } from '@app/utils/reduxStore';
import { logoutUser, getUserProfile, updateProfile } from '@app/actions/login';
import { connectStripe } from '@app/actions/signup';
import { getPurchasedBundles, getShopList } from '@app/actions/shop';
import StripeConnectSheet from '../../screens/common/StripeConnectSheet';
import WebViewSheet from '../../screens/common/WebViewSheet';
import {
  expressDashboard,
  stripeAccountLink,
  getStripeBalance,
  deleteProfile,
} from '@app/actions/login';
import { AppContext } from '@app/context';
import { profileDeletedNotification } from '@app/utils/notifications';
import { MaterialIcons } from '@expo/vector-icons';
import FeedbackBottomSheet from './components/FeedbackBottomSheet';

var formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

const ProfileScreen: React.FC = ({ navigation }: any) => {
  const user = useSelector((state) => state.user);
  const { updateSize, updateBrand, updateCategory, updateGender } =
    useContext(AppContext);

  const purchasedBundles = useSelector((state) => state.shop.purchasedBundles);
  const dashboard = useSelector((state) => state.user.dashboard);

  const { profile } = user;

  // const avatarBackground = 'https://randomuser.me/api/portraits/women/65.jpg'
  const avatarBackground = require('@app/assets/images/canvaspurple.png');
  const defaultAvatar = require('@app/assets/images/default_user.jpg');

  const { navigate } = navigation;
  const dispatch = useDispatch();
  const logOut = async () => {
    await removeToken();
    dispatch(logoutUser());
    navigate('Auth');
    updateGender([]);
    updateCategory([]);
    updateSize([]);
    updateBrand([]);
  };

  useEffect(() => {
    dispatch(getShopList());
    if (user.profile) {
      let userProfile = {
        onSuccess: (res) => {
          if (res) {
            dispatch(getPurchasedBundles());
          }
        },
        onFail: () => {},
      };
      dispatch(getUserProfile(userProfile));
      dispatch(getStripeBalance());
    }
  }, []);

  const { first_name, last_name, email, photo, account, is_stripe_connected } =
    profile !== null ? profile : {};

  const [profileFormData, setProfileFormData] = useState<FormData>(
    new FormData()
  );
  const [avatar, setAvatar] = useState<any>(photo ? photo : defaultAvatar);
  const [attachedImage, setAttachedImage] = useState<any>();
  const [avatarUpdated, setAvatarUpdated] = useState<boolean>(false);
  const BottomSheetRef = useRef();
  const ResolutionCenterSheetRef = useRef();
  const feedBackBottomSheetRef = useRef<any>();
  const expressUrlRef = useRef();
  const stripeAccountLinkRef = useRef();
  // @ts-ignore
  const onBottomSheetRefOpen = () => BottomSheetRef.current.open();
  // @ts-ignore
  const onBottomSheetRefClose = () => BottomSheetRef.current.close();
  // @ts-ignore
  const onResolutionSheetRefOpen = () =>
    ResolutionCenterSheetRef.current.open();
  // @ts-ignore
  const onResolutionSheetRefClose = () =>
    ResolutionCenterSheetRef.current.close();
  const onFeedBackBottomSheetRefOpen = () =>
    feedBackBottomSheetRef.current.open();

  const onExpressDashboardOpen = () => expressUrlRef.current.open();
  // @ts-ignore
  const onExpressDashboardClose = () => expressUrlRef.current.close();

  const onStripeAccountLinkOpen = () => stripeAccountLinkRef.current.open();
  // @ts-ignore
  const onStripeAccountLinkClose = () => stripeAccountLinkRef.current.close();

  const modalClose = () => {
    onBottomSheetRefClose();
  };

  const onCameraPressed = () => {
    if (Platform.OS === 'android') {
      Alert.alert('', '', [
        {
          text: 'Take a picture from the folder',
          onPress: () => runGalleryAsync(),
        },
        {
          text: 'Take photos from the camera',
          onPress: () => takePhotoAsync(),
        },
      ]);
    } else {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: [
            'Take photos from the camera',
            'Take a picture from the folder',
            'cancel',
          ],
          cancelButtonIndex: 2,
        },
        (buttonIndex: any) => {
          if (buttonIndex === 0) {
            takePhotoAsync();
          } else if (buttonIndex === 1) {
            runGalleryAsync();
          }
        }
      );
    }
  };

  const deleteCurrentUserProfile = () => {
    if (
      user.profile !== null &&
      user.profile !== undefined &&
      user.profile !== ''
    ) {
      dispatch(deleteProfile());
      logOut();
      profileDeletedNotification();
    }
  };

  const openDeleteConfirmation = () => {
    Alert.alert('Alert', 'Are you sure you want to delete your profile?', [
      {
        text: 'Cancel',
        onPress: () => {},
        style: 'cancel',
      },
      {
        text: 'Yes',
        style: 'destructive',
        onPress: () => {
          deleteCurrentUserProfile();
        },
      },
    ]);
  };

  const checkNameValue = (name: string | string[]) => {
    if (typeof name === 'string' && !name.startsWith('This field')) {
      return name;
    }
  };

  const onPressConnectStripe = () => {
    const data = {
      country: 'US',
      type: 'custom',
      email: email,
      capabilities: {
        card_payments: {
          requested: true,
        },
        transfers: {
          requested: true,
        },
      },
    };
    dispatch(connectStripe(data));
    onBottomSheetRefOpen();
  };
  const runGalleryAsync = async () => {
    await askPermissionsAsync();
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      base64: true,
    });
    if (!result.canceled && result.assets) {
      await _attachImage(result.assets[0]);
    }
  };

  const takePhotoAsync = async () => {
    await askPermissionsAsync();
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
    });
    if (!result.canceled && result.assets) {
      await _attachImage(result.assets[0]);
    }
  };

  const askPermissionsAsync = async () => {
    await Camera.requestCameraPermissionsAsync();
    await MediaLibrary.requestPermissionsAsync();
  };

  const _attachImage = async (asset: ImagePicker.ImagePickerAsset) => {
    const dd = {
      uri: asset.uri,
      base64: asset.base64,
      name:
        randomstring() + '.' + mimes.extension(mimes.lookup(asset.uri) || ''),
      type: mimes.lookup(asset.uri),
    };

    setAvatar(asset.uri);
    setAttachedImage(dd);
    setAvatarUpdated(true);
  };

  const onSaveProfile = () => {
    if (avatarUpdated) {
      profileFormData.append('photo', attachedImage);
    }

    let profile = {
      item: profileFormData,
    };

    dispatch(updateProfile(profile));
    setProfileFormData(new FormData());
    setAvatarUpdated(false);
  };

  const expressDashboardData = () => {
    dispatch(expressDashboard());
    onExpressDashboardOpen();
  };

  const stripeAccountLinkModal = () => {
    dispatch(stripeAccountLink());
    onStripeAccountLinkOpen();
  };

  const sellingDetailsRequired = () => {
    if (profile && profile.account && profile.account.requirements) {
      const requirements = profile.account.requirements;
      if (requirements.errors.length > 0) {
        return requirements.errors[0].reason;
      } else if (requirements.pending_verification.length > 0) {
        return 'Pending Verification';
      } else if (
        requirements.past_due.length == 1 &&
        requirements.past_due[0] == 'external_account'
      ) {
        return false;
      } else if (requirements.past_due.length > 0) {
        return 'Missing info required';
      } else {
        return false;
      }
    }
    return 'Attention needed';
  };

  const bankAccountLinked = () => {
    if (profile && profile.account && profile.account.requirements) {
      const requirements = profile.account.requirements;
      if (!requirements.past_due.includes('external_account')) {
        return true;
      }
    }
    return false;
  };

  const bankInfo = () => {
    if (!bankAccountLinked()) {
      return 'Add an account for payouts';
    } else {
      return 'Connected!';
    }
  };

  // TODO: Update this to User Address
  const stripeAddress = () => {
    if (
      profile &&
      profile.account &&
      profile.account.company &&
      profile.account.company.address
    ) {
      const address = profile.account.company.address;
      let result;
      result = address.line1 + '\n';
      result += address.line2 ? address.line2 : '';
      // result += "\n"
      result += address.city + ', ' + address.state + ' ' + address.postal_code;

      return result;
    }
  };

  const stripeAvailableBalance = () => {
    if (profile && profile.stripe_balance) {
      return formatter.format(profile.stripe_balance.available.amount);
    } else if (
      profile &&
      profile.balance &&
      profile.balance?.available?.length
    ) {
      return formatter.format(profile.balance.available[0].amount / 100);
    }
    return formatter.format(0);
  };
  const stripePendingBalance = () => {
    if (profile && profile.stripe_balance) {
      return formatter.format(profile.stripe_balance.pending.amount);
    }
    return false;
  };

  const renderHeader = () => {
    if (profile !== null) {
      return (
        <View style={styles().headerContainer}>
          <ImageBackground
            style={[styles().headerBackgroundImage, { backgroundColor: 'red' }]}
            blurRadius={10}
            source={
              avatarBackground
              //   {
              //   uri: avatarBackground,
              // }
            }
          >
            <View style={styles().headerColumn}>
              <TouchableOpacity>
                {/* <TouchableOpacity onPress={() => onCameraPressed()}> */}
                <Image style={styles().userImage} source={avatar} />
              </TouchableOpacity>
              <Text style={styles().userNameText}>{`${
                checkNameValue(first_name) ?? 'New'
              } ${checkNameValue(last_name) ?? 'User'}`}</Text>
              <View style={styles().userAddressRow}>
                <View style={styles().userCityRow}>
                  <Text style={styles().usernameText}>{email}</Text>
                </View>
              </View>
            </View>
            {/* <View
              style={{
                alignSelf: 'flex-end',
                position: 'absolute',
                right: 2,
                bottom: 2
              }}>
              <Button
                onPress={() => onSaveProfile()}
                disabled={!avatarUpdated}
              >
                <Icon
                  type="FontAwesome"
                  name={"check"}
                  style={{ color: ThemeStatic.accent }}
                />
              </Button>
            </View> */}
          </ImageBackground>
        </View>
      );
    }
  };

  const Divider = () => (
    <View
      style={{
        height: 0.5,
        width: '100%',
        marginVertical: 12,
        backgroundColor: 'lightgray',
      }}
    />
  );

  const content = (
    <Fragment>
      <ScrollView>
        <View style={{ padding: 15 }}>
          <Text style={styles().noteText}>SELLING</Text>
          <Divider />
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}
          >
            <Text style={{ marginStart: 10, fontSize: 16 }}>Balance</Text>
            <Text style={styles().balanceText}>{stripeAvailableBalance()}</Text>
          </View>
          <Divider />
          {stripePendingBalance > 0 && (
            <>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}
              >
                <Text style={{ marginStart: 10, fontSize: 16 }}>
                  Pending Credit
                </Text>
                <Text style={styles().balanceText}>
                  {stripePendingBalance()}
                </Text>
              </View>
              <Divider />
            </>
          )}
          <TouchableOpacity
            onPress={() =>
              is_stripe_connected
                ? stripeAccountLinkModal()
                : onPressConnectStripe()
            }
            style={{
              alignItems: 'center',
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}
          >
            <View style={{ marginStart: 10 }}>
              <Text style={styles().balanceText}>Update Selling Details</Text>
              <Text style={styles().noteText}>
                {sellingDetailsRequired()
                  ? sellingDetailsRequired()
                  : 'Ready to sell!'}
              </Text>
            </View>
            {sellingDetailsRequired() != false ? (
              <Badge
                backgroundColor={'red.600'}
                style={styles().centeredBadgeText}
              >
                <MaterialIcons name="error-outline" size={25} color={'#fff'} />
              </Badge>
            ) : (
              <Badge
                backgroundColor={'green.500'}
                style={styles().centeredBadgeText}
              >
                <MaterialIcons name="check" size={25} color={'#fff'} />
              </Badge>
            )}
          </TouchableOpacity>
          <Divider />

          {is_stripe_connected && (
            <>
              <TouchableOpacity
                onPress={() => stripeAccountLinkModal()}
                style={{
                  alignItems: 'center',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}
              >
                <View style={{ marginStart: 10 }}>
                  <Text style={styles().balanceText}>Bank Information</Text>
                  <Text style={styles().noteText}>{bankInfo()}</Text>
                </View>
                {bankAccountLinked() ? (
                  <Badge
                    backgroundColor={'green.500'}
                    style={styles().centeredBadgeText}
                  >
                    <MaterialIcons name="check" size={25} color={'#fff'} />
                  </Badge>
                ) : (
                  <Badge
                    backgroundColor={'red.600'}
                    style={styles().centeredBadgeText}
                  >
                    <MaterialIcons
                      size={25}
                      color={'#fff'}
                      name="error-outline"
                    />
                  </Badge>
                )}
              </TouchableOpacity>
              <Divider />
            </>
          )}

          {is_stripe_connected && (
            <>
              <TouchableOpacity
                onPress={() => navigate('AddressFlow')}
                style={{
                  alignItems: 'center',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}
              >
                <View style={{ marginStart: 10 }}>
                  <Text style={styles().balanceText}>
                    Update Ship From Address
                  </Text>
                  <Text style={styles().noteText}>
                    {(profile && profile.address_line_1) || ''}{' '}
                  </Text>
                </View>
                {profile && profile.address_line_1 !== null ? (
                  <Badge
                    backgroundColor={'green.500'}
                    style={styles().centeredBadgeText}
                  >
                    <MaterialIcons name="check" size={25} color={'#fff'} />
                  </Badge>
                ) : (
                  <Badge
                    backgroundColor={'red.600'}
                    style={styles().centeredBadgeText}
                  >
                    <MaterialIcons
                      name="error-outline"
                      size={25}
                      color={'#fff'}
                    />
                  </Badge>
                )}
              </TouchableOpacity>
              <Divider />
            </>
          )}

          <>
            <TouchableOpacity onPress={() => navigate('SuppliesScreen')}>
              <Text style={[{ marginStart: 10 }, styles().balanceText]}>
                Order More Supplies
              </Text>
            </TouchableOpacity>
            <Divider />
          </>

          {is_stripe_connected !== false && (
            <>
              <TouchableOpacity onPress={() => expressDashboardData()}>
                <Text style={[{ marginStart: 10 }, styles().balanceText]}>
                  Sales Dashboard
                </Text>
              </TouchableOpacity>
              <Divider />
            </>
          )}
          {/* {is_stripe_connected > 0 && <Text>Sales Dashboard</Text>} */}

          <Text style={styles().noteText}>BUYING</Text>
          <Divider />
          <TouchableOpacity
            onPress={() => navigate('PurchaseScreen')}
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
            accessibilityLabel="Purchase History"
          >
            <Text style={[{ marginStart: 10 }, styles().balanceText]}>
              Purchase History
            </Text>
            <Badge backgroundColor={'blue.400'} borderRadius={40}>
              <Text style={{ color: '#fff' }}>
                {purchasedBundles.length || 0}
              </Text>
            </Badge>
          </TouchableOpacity>
          <Divider />

          <>
            <TouchableOpacity onPress={() => navigate('SellingPurchaseScreen')}>
              <Text style={[{ marginStart: 10 }, styles().balanceText]}>
                Sellings Details
              </Text>
            </TouchableOpacity>
            <Divider />
          </>

          <Text style={styles().noteText}>SUPPORT</Text>
          <Divider />

          <>
            <TouchableOpacity onPress={onResolutionSheetRefOpen}>
              <Text style={[{ marginStart: 10 }, styles().balanceText]}>
                Resoultion Center
              </Text>
            </TouchableOpacity>
            <Divider />
          </>

          <>
            <TouchableOpacity onPress={onFeedBackBottomSheetRefOpen}>
              <Text style={[{ marginStart: 10 }, styles().balanceText]}>
                Feedback
              </Text>
            </TouchableOpacity>
            <Divider />
          </>

          <>
            <TouchableOpacity onPress={logOut}>
              <Text style={[{ marginStart: 10 }, styles().balanceText]}>
                Sign Out
              </Text>
            </TouchableOpacity>
            <Divider />
          </>

          <Text style={styles().noteText}>ACCOUNT</Text>
          <Divider />

          <>
            <TouchableOpacity onPress={openDeleteConfirmation}>
              <Text
                style={[
                  { marginStart: 10 },
                  styles().balanceText,
                  { color: '#E30303' },
                ]}
              >
                Delete Profile
              </Text>
            </TouchableOpacity>
            <Divider />
          </>
        </View>
        {/* </List> */}
      </ScrollView>
    </Fragment>
  );

  if (profile !== null) {
    return (
      <View style={{ flex: 1 }}>
        <ScrollView style={styles().scroll}>
          {renderHeader()}
          {content}
        </ScrollView>
        <StripeConnectSheet ref={BottomSheetRef} onSheetlose={modalClose} />
        <WebViewSheet
          ref={ResolutionCenterSheetRef}
          onSheetlose={onResolutionSheetRefClose}
          webViewUrl={'https://bynde.freshdesk.com/support/home'}
        />
        <WebViewSheet
          ref={expressUrlRef}
          onSheetlose={onExpressDashboardClose}
          webViewUrl={
            dashboard && dashboard.express_dashboard
              ? dashboard.express_dashboard
              : null
          }
        />
        <StripeConnectSheet
          ref={stripeAccountLinkRef}
          onSheetlose={onStripeAccountLinkClose}
        />
        <FeedbackBottomSheet ref={feedBackBottomSheetRef} />
      </View>
    );
  }
  return <Text></Text>;
};

const styles = (theme = {}) =>
  StyleSheet.create({
    balanceText: {
      fontSize: 16,
      // color: 'black',
    },
    aboutText: {
      fontSize: 14,
      color: 'black',
    },
    aboutTextHeader: {
      fontSize: 20,
      color: '#666',
    },
    userRating: {
      fontSize: 10,
      color: 'green',
      textAlign: 'right',
    },

    titleText: {
      fontSize: 16,
      alignItems: 'flex-end',
      color: 'black',
    },
    bottomButton: {
      marginTop: 50,
      alignContent: 'space-around',
      alignItems: 'center',
    },
    userLogo: {
      height: 128,
      width: 128,
      borderRadius: 128,
    },
    userContainer: {
      flex: 1,
      alignItems: 'center',
    },
    cardContainer: {
      backgroundColor: '#FFF',
      borderWidth: 0,
      flex: 1,
      margin: 0,
      padding: 0,
    },
    container: {
      flex: 1,
    },
    emailContainer: {
      backgroundColor: '#FFF',
      flex: 1,
      paddingTop: 30,
    },
    headerBackgroundImage: {
      paddingBottom: 20,
      paddingTop: 35,
    },
    headerContainer: {},
    headerColumn: {
      backgroundColor: 'transparent',
      ...Platform.select({
        ios: {
          alignItems: 'center',
          elevation: 1,
          marginTop: -1,
        },
        android: {
          alignItems: 'center',
        },
      }),
    },
    placeIcon: {
      color: 'white',
      fontSize: 26,
    },
    scroll: {
      backgroundColor: '#FFF',
    },
    telContainer: {
      backgroundColor: '#FFF',
      flex: 1,
      paddingTop: 30,
    },
    userAddressRow: {
      alignItems: 'center',
      flexDirection: 'row',
    },
    userCityRow: {
      backgroundColor: 'transparent',
    },
    usernameText: {
      color: ThemeStatic.accent,
      fontSize: 15,
      fontWeight: '600',
      textAlign: 'center',
    },
    userImage: {
      borderColor: ThemeStatic.accent,
      borderRadius: 85,
      borderWidth: 0,
      height: 100,
      marginBottom: 10,
      marginTop: 10,
      width: 100,
    },
    userNameText: {
      color: '#FFF',
      fontSize: 22,
      fontWeight: 'bold',
      paddingBottom: 8,
      textAlign: 'center',
    },
    centeredBadgeText: {
      height: 48,
      justifyContent: 'center',
      alignContent: 'center',
      textAlign: 'center',
      borderRadius: 14,
    },
    noteText: {
      color: 'darkgray',
      fontWeight: '300',
    },
  });

export default ProfileScreen;
