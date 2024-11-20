import React, { useEffect, useState } from 'react';
import { 
    View, 
    TextInput, 
    SafeAreaView,
} from 'react-native';
import { Auth } from 'aws-amplify';
import styles from '../styles/HomePageStyle';
import Footer from './Footer';

const HomePage = ({ navigation }) => {
    const [currentUsername, setCurrentUsername] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        // Benutzerinformationen abrufen
        getCurrentUser();
    }, []);

    const getCurrentUser = async () => {
        try {
            const userInfo = await Auth.currentAuthenticatedUser();
            setCurrentUsername(userInfo.username);
        } catch (error) {
            console.error('Error getting current user:', error);
            // Fallback: Benutzer wird zur Login-Seite geleitet
            navigation.navigate('Login');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header mit flexibler Suchleiste */}
            <View style={styles.header}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Suche"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
            </View>

            {/* Footer */}
            <Footer navigation={navigation} />
        </SafeAreaView>
    );
};

export default HomePage;
