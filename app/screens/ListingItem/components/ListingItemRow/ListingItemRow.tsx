import React, { useState, useContext } from 'react';
import { Row, Col, Text, Card, CardItem, Body, Icon } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import { Routes } from '@app/constants';
import { FontAwesome5 } from '@expo/vector-icons';

interface ItemRowDefaultProps {
  listingId: number;
  item: any;
}

const ListingItemRow: React.FC<ItemRowDefaultProps> = ({ listingId, item }) => {
  const { id, category, gender, size, quality } = item;
  const { navigate, goBack } = useNavigation();

  const onPress = () => {
    navigate('ListingItemDetail', { listingId, id, data: item });
  };

  return (
    <Row>
      <Card style={{ flex: 1 }}>
        <CardItem header>
          <FontAwesome5
            onPress={onPress}
            style={{ fontSize: 16 }}
            type="FontAwesome5"
            name="edit"
            size={16}
          />
          <Text>
            {category} for {gender}
          </Text>
        </CardItem>
        <CardItem>
          <Body>
            <Row>
              <Col>
                <Text>{size}</Text>
              </Col>
              <Col>
                <Text>{quality}</Text>
              </Col>
            </Row>
          </Body>
        </CardItem>
      </Card>
    </Row>
  );
};

export default ListingItemRow;
