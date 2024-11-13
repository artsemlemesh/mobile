import React from 'react';
import {
    StyleSheet,
    View,
    Image,
    Text,
} from 'react-native';
import {
    // Header,
    // Body,
    // Title,
    // Left,
    // Right,
} from 'native-base';
import { ThemeStatic } from '@app/theme';
import { ThemeColors } from '@app/types/theme';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
// import { useNavigation } from 'react-navigation-hooks';
import { Routes } from '@app/constants';
const PaymentSuccess: React.FC = ({navigation}:any) => {
    const { navigate } = navigation;
    return (
        <View style={{ flex: 1 }}>
            {/* <Header
                style={{ backgroundColor: ThemeStatic.headerBackground }}
                androidStatusBarColor={ThemeStatic.accent}
            > */}
                {/* <Left style={styles().leftAndRight} /> */}
                {/* <Body
                    style={styles().center}
                > */}
                    {/* <Title style={{ color: ThemeStatic.headerTitle }}>Order Confirmation</Title> */}
                    <Text style={{ color: ThemeStatic.headerTitle }}>Order Confirmation</Text>
                {/* </Body> */}
                {/* <Right style={styles().leftAndRight}>
                </Right> */}
            {/* </Header> */}
            <View style={styles().mainContainer}>
                <View style={styles().logoContainer}>
                    <Image
                        style={styles().successImage}
                        source={require('@app/assets/images/check.png')}
                    />
                    <View style={styles().successViewtStyle}>
                        <Text style={styles().successTextStyle}>Order Complete</Text>
                        <Text style={styles().successSubTextStyle}>Thank you for your purchase!</Text>
                    </View>
                </View>
                <View style={styles().buttonViewStyle}>
                    <TouchableWithoutFeedback onPress={() => {
                        navigate('CartScreen')
                    }}
                    accessibilityLabel="DoneButton_PaymentScreen"
                    >
                        <Text style={styles().doneButtonStyle}>Done</Text>
                    </TouchableWithoutFeedback>
                </View>
            </View>
        </View >
    );
};

const styles = (theme = {} as ThemeColors) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.base,
        },
        leftAndRight: {
            flex: 1
        },
        center: {
            flex: 2,
            justifyContent: 'center',
            alignItems: 'center'
        },
        mainContainer: {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center'
        },
        logoContainer: {
            alignItems: 'center',
            justifyContent: 'center'
        },
        successImage: {
            height: 150,
            width: 150,
            tintColor: ThemeStatic.accent
        },
        successViewtStyle: {
            paddingVertical: 10,
            justifyContent: 'center',
            alignItems: 'center'
        },
        successTextStyle: {
            fontSize: 25,
            color: ThemeStatic.headerBackground
        },
        successSubTextStyle: {
            fontSize: 16,
            marginVertical: 5, color: "gray"
        },
        buttonViewStyle: {
            width: '90%',
            padding: 10,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: ThemeStatic.accent
        }, doneButtonStyle: { color: ThemeStatic.white, fontSize: 18 }
    });

export default PaymentSuccess;
