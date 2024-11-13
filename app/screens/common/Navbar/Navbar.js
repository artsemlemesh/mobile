import React from 'react';
import { Footer, FooterTab, Button, Text, Icon } from 'native-base';
import styles from './navbar.style';
import * as actionType from '../../../actions/constants';
import connect from 'react-redux/es/connect/connect';
import * as SendBird from 'sendbird';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';

const mapStateToProps = (state) => {
  return {
    navIndex: state.common.navIndex,
    profile: state.account.user.profile,
  };
};

const dispatchToProps = (dispatch) => {
  return {
    logout: () => dispatch({ type: actionType.USER_LOGOUT }),
    setNavIndex: (index) =>
      dispatch({ type: actionType.NAV_INDEX, value: index }),
  };
};

class Navbar extends React.Component {
  constructor(props) {
    super(props);
  }

  navigateToScreen = (screenName, index) => {
    this.props.navigation.navigate(screenName);
    this.props.setNavIndex(index);
  };

  logout = () => {
    this.props.logout();

    let sb = SendBird.getInstance();
    if (sb !== null) {
      sb.removeChannelHandler('channel');
    }

    this.props.navigation.navigate('Login');
  };

  renderTalentNavs = () => {
    return (
      <FooterTab>
        <Button
          vertical
          active={this.props.navIndex === 0}
          onPress={() => this.navigateToScreen('JobsTalent', 0)}
        >
          <FontAwesome
            size={25}
            type="FontAwesome"
            name="list-alt"
            style={styles.footerIcon}
          />
          <Text style={styles.footerText}>Jobs</Text>
        </Button>
        <Button
          vertical
          active={this.props.navIndex === 1}
          onPress={() => this.navigateToScreen('BookingsTalent', 1)}
        >
          <FontAwesome
            size={25}
            type="FontAwesome"
            name="calendar-check-o"
            style={styles.footerIcon}
          />
          <Text style={styles.footerText}>Bookings</Text>
        </Button>
        <Button
          vertical
          active={this.props.navIndex === 2}
          onPress={() => this.navigateToScreen('MessagingTalent', 2)}
        >
          <FontAwesome
            type="FontAwesome"
            name="comments"
            style={styles.footerIcon}
          />
          <Text style={styles.footerText}>Messages</Text>
        </Button>
        <Button
          vertical
          active={this.props.navIndex === 3}
          onPress={() => this.navigateToScreen('GiftedApp', 3)}
        >
          <FontAwesome
          size={25}
            type="FontAwesome"
            name="money"
            style={styles.footerIcon}
          />
          <Text style={styles.footerText}>GiftChat</Text>
        </Button>
        <Button
          vertical
          active={this.props.navIndex === 4}
          onPress={() => this.navigateToScreen('ProfileTalent', 4)}
        >
          <FontAwesome
          size={25}
            type="FontAwesome"
            name="user-circle"
            style={styles.footerIcon}
          />
          <Text style={styles.footerText}>Profile</Text>
        </Button>
        <Button vertical onPress={() => this.logout()}>
          <MaterialIcons
          size={25}
            type="MaterialIcons"
            name="exit-to-app"
            style={styles.footerIcon}
          />
          <Text style={styles.footerText}>Logout</Text>
        </Button>
      </FooterTab>
    );
  };

  renderCompanyNavs = () => {
    return (
      <FooterTab>
        <Button
          vertical
          active={this.props.navIndex === 0}
          onPress={() => this.navigateToScreen('EventsCompany', 0)}
        >
          <FontAwesome
            type="FontAwesome"
            name="list-alt"
            style={styles.footerIcon}
          />
          <Text style={styles.footerText}>Events</Text>
        </Button>
        <Button
          vertical
          active={this.props.navIndex === 1}
          onPress={() => this.navigateToScreen('BookingsCompany', 1)}
        >
          <FontAwesome
          size={25}
            type="FontAwesome"
            name="calendar-check-o"
            style={styles.footerIcon}
          />
          <Text style={styles.footerText}>Bookings</Text>
        </Button>
        <Button
          vertical
          active={this.props.navIndex === 2}
          onPress={() => this.navigateToScreen('MessagingTalent', 2)}
        >
          <FontAwesome
          size={25}
            type="FontAwesome"
            name="comments"
            style={styles.footerIcon}
          />
          <Text style={styles.footerText}>Messages</Text>
        </Button>
        <Button
          vertical
          active={this.props.navIndex === 3}
          onPress={() => this.navigateToScreen('GiftedApp', 3)}
        >
          <FontAwesome
          size={25}
            type="FontAwesome"
            name="money"
            style={styles.footerIcon}
          />
          <Text style={styles.footerText}>Payments</Text>
        </Button>
        <Button
          vertical
          active={this.props.navIndex === 4}
          onPress={() => this.navigateToScreen('ProfileCompanyUser', 4)}
        >
          <FontAwesome
          size={25}
            type="FontAwesome"
            name="user-circle"
            style={styles.footerIcon}
          />
          <Text style={styles.footerText}>Profile</Text>
        </Button>
        <Button vertical onPress={() => this.logout()}>
          <MaterialIcons
          size={25}
            type="MaterialIcons"
            name="exit-to-app"
            style={styles.footerIcon}
          />
          <Text style={styles.footerText}>Logout</Text>
        </Button>
      </FooterTab>
    );
  };

  render() {
    return (
      <Footer>
        {this.props.profile.type === 'talent' && this.renderTalentNavs()}
        {this.props.profile.type === 'company' && this.renderCompanyNavs()}
      </Footer>
    );
  }
}

export default connect(mapStateToProps, dispatchToProps)(Navbar);
