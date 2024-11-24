import React from 'react';
import { View, Image, Button } from 'react-native';
import styles from '../styles/MainPageStyles';

/**
 * MainPage-Komponente, die die Hauptoberfläche mit Optionen für Login und Registrierung anzeigt.
 * 
 * @param {Object} navigation - Das Navigation-Objekt zum Navigieren zwischen den Bildschirmen.
 */
const MainPage = ({ navigation }) => {
    return (
        <View style={styles.container}>
            {/* Ersetze das Text-Element durch ein Image-Element */}
            <Image 
                source={require('../../assets/Logo.png')} 
                style={styles.logo} 
                resizeMode="contain" 
            />
            <View style={styles.buttonContainer}>
                <View style={styles.button}>
                    <Button title="Login" 
                        onPress={() => navigation.navigate('Login')} 
                    />
                </View>
                <View style={styles.button}>
                    <Button title="Sign Up" 
                        onPress={() => navigation.navigate('SignUp')} 
                    />
                </View>
            </View>
        </View>
    );
};

export default MainPage;
