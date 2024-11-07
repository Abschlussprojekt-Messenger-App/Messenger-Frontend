import React from 'react';
import { View, Text, Button } from 'react-native';
import styles from '../styles/MainPageStyles';

/**
 * MainPage-Komponente, die die Hauptoberfläche mit Optionen für Login und Registrierung anzeigt.
 * 
 * @param {Object} navigation - Das Navigation-Objekt zum Navigieren zwischen den Bildschirmen.
 */
const MainPage = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Keys</Text>
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
