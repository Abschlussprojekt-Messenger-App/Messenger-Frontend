import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import styles from '../styles/SettingsPageStyle';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Auth } from 'aws-amplify'; 
import { useNavigation } from '@react-navigation/native'; 
import Footer from './Footer';

/**
 * SettingsPage-Komponente
 * Ermöglicht dem Benutzer das Anpassen von Kontoeinstellungen.
 */
const SettingsPage = () => {
    const [userProfile, setUserProfile] = useState(null);
    const navigation = useNavigation(); 

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const user = await Auth.currentAuthenticatedUser();
                const profile = {
                    displayName: user.attributes.name,
                };
                setUserProfile(profile);
            } catch (error) {
                console.error('Fehler beim Abrufen des Benutzerprofils:', error);
            }
        };

        fetchUserProfile();
    }, []);

    /**
     * Funktion zur Abmeldung des Benutzers
     * Zeigt einen Bestätigungsdialog an und navigiert bei erfolgreicher Abmeldung zum Login-Screen.
     */
    const handleLogout = () => {
        Alert.alert(
            "Abmelden",
            "Möchten Sie sich wirklich abmelden?",
            [
                {
                    text: "Nein",
                    onPress: () => console.log("Abmeldung abgebrochen"),
                    style: "cancel"
                },
                {
                    text: "Ja",
                    onPress: async () => {
                        try {
                            await Auth.signOut(); 
                            console.log("Erfolgreich abgemeldet");
                            navigation.navigate('Login'); 
                        } catch (error) {
                            console.error('Fehler beim Abmelden:', error);
                            Alert.alert("Fehler", "Fehler beim Abmelden. Bitte versuchen Sie es erneut.");
                        }
                    }
                }
            ]
        );
    };

    // Ladebildschirm, wenn das Benutzerprofil noch nicht geladen ist
    if (!userProfile) {
        return (
            <View style={styles.container}>
                <Text>Loading...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Profilabschnitt mit Displaynamen */}
            <View style={styles.profileSection}>
                <Text style={styles.username}>{userProfile.displayName}</Text>
            </View>

            {/* Abmeldeoption */}
            <TouchableOpacity style={styles.option} onPress={handleLogout}>
                <Text style={styles.optionText}>Abmelden</Text>
                <MaterialIcons name="chevron-right" size={24} color="#aaa" />
            </TouchableOpacity>

            <Footer navigation={navigation} />
        </View>
    );
};

export default SettingsPage;
