import React from 'react';
import { Header, Left, Body, Title, Right } from 'native-base';

class HeaderComponent extends React.Component {
  render() {
    return (
      <Header>
        <Left />
        <Body>
          <Title>BundleUp</Title>
        </Body>
        <Right />
      </Header>
    );
  }
}

export default HeaderComponent;
