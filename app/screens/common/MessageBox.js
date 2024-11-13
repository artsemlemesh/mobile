import React from 'react';
import {View, Text} from 'react-native';
import {convertToString} from "../../utils/common";


const MessageBox = (props) => {
    const {message, type} = props;
    if (type === 'error'){
        return (
            <View style={[style.messageBox, style.errorBox]} >
                <Text style={style.errorText}>{convertToString(message)}</Text>
            </View>
        )
    }

    if (type === 'success'){
        return (
            <View style={[style.messageBox, style.successBox]} >
                <Text style={style.successText}>{convertToString(message)}</Text>
            </View>
        )
    }
};

export default MessageBox;

const style = {

    messageBox: {
        paddingTop: 5,
        paddingBottom: 10,
    },

    errorBox: {

    },

    errorText: {
        textAlign: 'center',
        color: 'red'
    },

    successBox: {

    },

    successText: {
        textAlign: 'center',
        color: 'grey'
    }
}
