import React from 'react';
import {Header, Text, View} from 'native-base';

export default class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { error: null, errorInfo: null };
    }

    componentDidCatch(error, errorInfo) {
        // Catch errors in any child components and re-render with error message
        this.setState({
            error,
            errorInfo
        });
    }

    render() {
        if (this.state.errorInfo) {
            const {error, errorInfo} = this.state;
            // Error path
            return (
                <View>
                    <Header>Error occured</Header>
                    <View>
                        <Text>{error}</Text>
                        <Text>{errorInfo.componentStack}</Text>
                    </View>
                </View>
            );
        }
        // Normally, just render children
        return this.props.children;
    }
}
