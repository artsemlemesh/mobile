import React, { useContext, useRef, useEffect } from 'react';
import { View } from 'react-native';
import { AppContext } from '@app/context';
import BundleSelectModal from '../../screens/CameraScreen/components/BundleSelectModal';

const CameraScreen: React.FC = ({ navigation }: any) => {
  const { setOpen, toggleSetOpenModal } = useContext(AppContext);

  const BundleSelectModalRef = useRef();
  // @ts-ignore
  const onBundleSelectModalOpen = () => BundleSelectModalRef.current.open();
  // @ts-ignore
  const onBundleSelectModalClose = () => BundleSelectModalRef.current.close();
  useEffect(() => {
    if (setOpen) {
      onBundleSelectModalOpen();
    } else {
      onBundleSelectModalClose();
    }
  }, [setOpen]);

  const modalClose = () => {
    toggleSetOpenModal(false);
  };

  const onBundleItemPress = (data) => {
    navigation.navigate('ListingItemList', { data });
  };

  useEffect(() => {
    if (!setOpen) {
      navigation.navigate('SellingScreen', {
        params: {
          loader: true,
        },
      });
    }
  }, [!setOpen]);

  return (
    <View style={{ backgroundColor: 'rgba(226, 226, 234, 1)', flex: 1 }}>
      <BundleSelectModal
        ref={BundleSelectModalRef}
        onModalClose={modalClose}
        onBundleItemPress={() => onBundleItemPress}
      />
    </View>
  );
};
export default CameraScreen;
