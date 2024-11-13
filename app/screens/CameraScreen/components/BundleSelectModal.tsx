import React, { useContext, useEffect, useCallback } from 'react';
import { StyleSheet, View, Text, Alert } from 'react-native';
import { Icon, Button, Spinner } from 'native-base';
import { Modalize } from 'react-native-modalize';
import { responsiveWidth } from 'react-native-responsive-dimensions';
// import { Button } from '@app/layout';
import { AppContext } from '@app/context';
import { Routes } from '@app/constants';
import {
  ProfileScreenPlaceholder,
  ListEmptyComponent,
  IconButton,
  BottomSheetHeader,
} from '@app/layout';
import { ThemeStatic, Typography } from '@app/theme';
import { ThemeColors } from '@app/types/theme';
import BundleSelectRow from './BundleSelectRow';
import { createNewBundle, getSellingList } from '@app/actions/bundle';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
// import { NavigationActions } from 'react-navigation';
import { openCamera } from 'react-native-image-crop-picker';
import { FontAwesome5 } from '@expo/vector-icons';

const { FontWeights, FontSizes } = Typography;

interface BundleSelectModalProps {
  ref: React.Ref<any>;
  onModalClose?: () => void;
  onBundleItemPress: () => void;
}

const BundleSelectModal: React.FC<BundleSelectModalProps> = React.forwardRef(
  ({ onBundleItemPress, onModalClose }, ref) => {
    const {
      theme,
      toggleSetOpenModal,
      videoStatus,
      videoPlayStatus,
      isBack,
      onAddBackToScreen,
      isBackToScreen,
    } = useContext(AppContext);
    const navigation = useNavigation();
    const dispatch = useDispatch();

    // @ts-ignore
    const { bundles, success, sellingListLoading } = useSelector(
      (state) => state.bundle
    );
    // @ts-ignore
    const initialBundle = useSelector((state) => state.bundle.initialBundle);

    const temp = {
      title: 'My Bundle',
      tags: ['tag1'],
      description: 'No Description',
      seller_price: 0,
    };

    useEffect(() => {
      dispatch(getSellingList());
    }, []);

    useEffect(() => {
      if (!sellingListLoading && success && !(bundles.length > 0)) {
        dispatch(createNewBundle(temp));
      }
    }, [bundles]);

    useEffect(() => {
      if (initialBundle !== null) {
        toggleSetOpenModal(false);
        onDetail(initialBundle, 0);
      }
    }, [initialBundle]);

    const onDetail = (item?: any, index?: number) => {
      if (item) {
        videoPlayStatus(false);
        navigation.navigate('SellingDetail', { data: item, index });
      } else {
        videoPlayStatus(false);
        navigation.navigate('SellingScreen', {
          screen: 'SellingDetail',
          params: {
            data: { title: '', description: '', tags: [] },
            openCamera: true,
            videoStatus: false,
          },
        });
      }
    };

    const _goBack = () => {
      toggleSetOpenModal(false);
      // navigation.dispatch(NavigationActions.back())
      // navigation.dispatch(goBack)

      navigation.goBack();
      // Alert.alert('Ahsan')
    };

    const _cancel = () => {
      toggleSetOpenModal(false);
      navigation.navigate('SellingScreen');
    };

    const onNewBundle = () => {
      onDetail();
    };

    return (
      <Modalize
        //@ts-ignore
        ref={ref}
        keyExtractor={(item: Object) => item.pk.toString()}
        modalStyle={styles(theme).container}
        onBackButtonPress={_goBack}
        onClose={onModalClose}
        scrollViewProps={{ showsVerticalScrollIndicator: false }}
      >
        <BottomSheetHeader
          heading="Post to Bundle"
          subHeading="Are you adding to an existing bundle?"
        />
        <Button
          onPress={() => onNewBundle()}
          activeOpacity={0.5}
          style={styles(theme).newBundle}
          accessible={true}
          accessibilityLabel={'post_createNew'}
        >
          <View style={styles().content}>
            <FontAwesome5
              name="box-open"
              type="FontAwesome5"
              style={{ fontSize: 30, color: theme.white, textAlign: 'center' }}
            />
            <Text style={{ fontSize: 20, color: theme.white }}>Create New</Text>
          </View>
        </Button>
        <View style={{ marginTop: 12 }} />
        {sellingListLoading ? (
          <Spinner color="blue" />
        ) : bundles.length ? (
          bundles.map((item: any, index: number) => (
            <BundleSelectRow
              key={index}
              index={index}
              item={item}
              isSelling={true}
              onBundleItemPress={onBundleItemPress}
            />
          ))
        ) : (
          <ListEmptyComponent
            placeholder="Get selling by adding your first bundle!"
            placeholderStyle={styles().placeholderStyle}
            spacing={10}
          />
        )}
        <Button
          onPress={_cancel}
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: 1,
            borderColor: ThemeStatic.accent,
            marginTop: 20,
            backgroundColor: 'transparent',
            elevation: -2,
          }}
        >
          <Text style={{ color: ThemeStatic.accent }}>{'Cancel'}</Text>
        </Button>
      </Modalize>
    );
  }
);

const styles = (theme = {} as ThemeColors) =>
  StyleSheet.create({
    container: {
      padding: 20,
      backgroundColor: theme.base,
      flex: 0.8,
    },
    content: {
      // paddingTop: 20
    },
    subContent: {
      justifyContent: 'space-between',
      flexDirection: 'row',
    },
    placeholderStyle: {},
    typeText: {
      ...FontWeights.Bold,
      ...FontSizes.Caption,
      color: theme.text01,
      textAlign: 'center',
    },
    buttonStyle: {
      flex: 1,
      marginHorizontal: 5,
      height: 30,
      paddingVertical: 0,
    },
    label: {
      ...FontWeights.Light,
      ...FontSizes.Body,
      width: responsiveWidth(74),
      color: theme.text01,
    },
    subTitle: {
      ...FontWeights.Light,
      ...FontSizes.Body,
      width: responsiveWidth(74),
      color: theme.text01,
    },
    newBundle: {
      height: 120,
      borderWidth: 3,
      borderStyle: 'dotted',
      borderRadius: 12,

      backgroundColor: theme.accent,
      borderColor: 'white',
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });

export default BundleSelectModal;
