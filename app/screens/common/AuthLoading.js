import React from 'react';
import {Spinner} from 'native-base';
import { isAuthenticated } from "../../utils/common";

export default class AuthLoadingScreen extends React.Component {
    constructor(props) {
        super(props);
        this.bootstrapAsync();
    }

    // Fetch the token from storage then navigate to our appropriate place
    bootstrapAsync = async () => {
        const isLoggedIn = await isAuthenticated();
        // This will switch to the App screen or Auth screen and this loading
        // screen will be unmounted and thrown away.
        this.props.navigation.navigate(isLoggedIn ? 'App' : 'Auth');
    };

    render() {
        return <Spinner active />
    }
}
