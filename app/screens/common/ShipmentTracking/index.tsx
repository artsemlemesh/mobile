import React, {
  Component,
  useContext,
  useState,
  useRef,
  useEffect,
} from 'react';
import { View, SafeAreaView, StyleSheet } from 'react-native';
import { ThemeStatic, Typography } from '@app/theme';
import Timeline from 'react-native-timeline-flatlist';
import moment from 'moment';
import { getListingDetail } from '@app/actions/shop';
import index2 from 'screens/PhoneVerification/index2';
interface ShipmentTrackingProps {
  id: any;
  items: any;
  onPress: (index: number) => void;
}

const ShipmentTracking: React.FC<ShipmentTrackingProps> = ({
  id,
  items,
  onPress,
}) => {
  // const [shipment, setShipment] = useState();

  // const initialize = async () => {
  //   getListingDetail(id)
  //     .then((response) => {
  //       const { statusCode, body } = response;
  //       if (statusCode == 'published') {
  //         setShipment(response.body.shipments);
  //       }
  //     })
  //     .catch((err) => {
  //       return err.response.data;
  //     });
  // };
  // useEffect(() => {
  //   initialize();
  // }, []);

  if (items) {
    let newArray = [];
    return items.map((item, index) => {
      let est_date = item.tracker.est_delivery_date;
      if (
        item.tracker &&
        item.tracker.tracking_details &&
        item.tracker.tracking_details.length > 0
      ) {
        let newData = item.tracker.tracking_details.filter((fitems) => {
          return fitems.status != 'pre_transit';
        });
        newData.map((titem, index) => {
          if (
            (titem.status && titem.status === 'in_transit') ||
            titem.status === 'out_for_delivery'
          ) {
            let title =
              titem.tracking_location.city +
              ', ' +
              titem.tracking_location.state;
            if (index == 0) {
              title = 'Bundle Sent';
            }
            let data = {
              time: moment(titem.datetime).format('DD/MM'),
              title: title,
              description:
                moment(titem.datetime).format('hh:mm A ') + titem.message,
              lineColor:
                newData.length - 2 === index ? '#ccc' : ThemeStatic.accent,
            };
            newArray.push(data);
          } else if (titem.status && titem.status === 'delivered') {
            let data = {
              time: moment(titem.datetime).format('DD/MM'),
              title: 'Expected Delivery',
              description:
                moment(titem.datetime).format('hh:mm A ') + titem.message,
              circleColor: '#ccc',
            };
            newArray.push(data);
          }
        });
      }
      return (
        <Timeline
          data={newArray}
          key={index}
          circleColor={ThemeStatic.accent}
        />
      );
    });
  }

  return <View />;
};
export default ShipmentTracking;
const styles = StyleSheet.create({
  tinyLogo: {
    width: 94,
    height: 94,
  },
  rowSpacing: {
    paddingBottom: 15,
  },
});
