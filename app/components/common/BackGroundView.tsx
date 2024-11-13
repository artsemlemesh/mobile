import React from 'react';
import { ImageBackground, StyleSheet } from 'react-native';

const BackgroundView: React.FC = ({ contentView }: any) => {
    return (
        <ImageBackground source={require('@app/assets/images/app-auth-bg.png')} style={style.backgroundImage} >
            {contentView}
        </ImageBackground>
    );
};

const style = StyleSheet.create({
    backgroundImage: {
        flex: 1,
        resizeMode: 'cover',
        justifyContent: 'center',
    }
})
export default BackgroundView;
