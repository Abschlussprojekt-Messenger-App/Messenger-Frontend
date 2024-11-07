import React, { useState, useEffect } from 'react';
import { View, Text, Image, Switch, TouchableOpacity, Alert } from 'react-native';
import styles from '../styles/SettingsPageStyle';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Auth } from 'aws-amplify'; 
import { useNavigation } from '@react-navigation/native'; 
import Footer from './Footer';

/**
 * SettingsPage-Komponente
 * Ermöglicht dem Benutzer das Anpassen von Benachrichtigungs- und Kontoeinstellungen.
 */
const SettingsPage = () => {
    // Zustand für Benachrichtigungs- und Soundeinstellungen sowie das Benutzerprofil
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    const [showNotifications, setShowNotifications] = useState(true);
    const [playSound, setPlaySound] = useState(true);
    const [userProfile, setUserProfile] = useState(null);
    const navigation = useNavigation(); 

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const user = await Auth.currentAuthenticatedUser();
                const profile = {
                    username: user.username,
                    displayName: user.attributes.name,
                    status: 'Ich bin erreichbar!',
                    email: user.attributes.email,
                    profileImage: 'https://via.placeholder.com/150', 
                };
                setUserProfile(profile);
            } catch (error) {
                console.error('Fehler beim Abrufen des Benutzerprofils:', error);
            }
        };

        fetchUserProfile();
    }, []);

    const toggleNotifications = () => {
        setNotificationsEnabled(previousState => !previousState);
    };

    const toggleShowNotifications = () => {
        setShowNotifications(previousState => !previousState);
    };

    const togglePlaySound = () => {
        setPlaySound(previousState => !previousState);
    };

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
        {/* Ladebildschirm, wenn das Benutzerprofil noch nicht geladen ist */}
    if (!userProfile) {
        return (
            <View style={styles.container}>
                <Text>Loading...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Profilabschnitt */}
            <View style={styles.profileSection}>
                <Image source={{ uri: userProfile.profileImage }} style={styles.profileImage} />
                <View style={styles.profileInfo}>
                    <Text style={styles.username}>{userProfile.displayName}</Text>
                    <Text style={styles.status}>{userProfile.status}</Text>
                </View>
            </View>

            {/* Option für Favoriten */}
            <TouchableOpacity style={styles.option} onPress={() => alert('Favoriten')}>
                <Text style={styles.optionText}>Favoriten</Text>
                <MaterialIcons name="chevron-right" size={24} color="#aaa" />
            </TouchableOpacity>

            {/* Einstellungen für Benachrichtigungen */}
            <View style={styles.option}>
                <Text style={styles.optionText}>Benachrichtigungen</Text>
                <Switch
                    value={notificationsEnabled}
                    onValueChange={toggleNotifications}
                />
            </View>
            <View style={styles.subOption}>
                <Text style={styles.subOptionText}>Benachrichtigungen anzeigen</Text>
                <Switch
                    value={showNotifications}
                    onValueChange={toggleShowNotifications}
                />
            </View>
            <View style={styles.subOption}>
                <Text style={styles.subOptionText}>Ton abspielen</Text>
                <Switch
                    value={playSound}
                    onValueChange={togglePlaySound}
                />
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
