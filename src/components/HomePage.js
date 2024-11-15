import React, { useEffect, useState } from 'react';
import { 
    View, 
    Text, 
    TextInput, 
    TouchableOpacity, 
    FlatList,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { API, Auth } from 'aws-amplify';
import styles from '../styles/HomePageStyle';
import { listUsers } from '../graphql/queries';

const HomePage = ({ navigation }) => {
    const [chats, setChats] = useState([]); // Hier setzen wir 'chats' auf ein leeres Array
    const [currentUsername, setCurrentUsername] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    const filteredChats = chats.filter(chat => {
        if (!searchQuery) return true;
        const searchLower = searchQuery.toLowerCase();
        return chat.name.toLowerCase().includes(searchLower);
    });

    useEffect(() => {
        getCurrentUser();
    }, []);

    useEffect(() => {
        if (currentUsername) {
            fetchChats();
        }
    }, [currentUsername]);

    const getCurrentUser = async () => {
        try {
            const userInfo = await Auth.currentAuthenticatedUser();
            setCurrentUsername(userInfo.username);
        } catch (error) {
            console.error('Error getting current user:', error);
            navigation.navigate('Login');
        }
    };

    const fetchChats = async () => {
        // Hier entfernen wir das Abrufen der Freunde, damit die Liste leer bleibt
        setChats([]); // Setzt die chats auf ein leeres Array
    };

    return (
        <View style={styles.container}>
            <View style={[styles.header, styles.headerShadow]}>
                <TextInput 
                    style={styles.searchInput} 
                    placeholder="Suche" 
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
                <TouchableOpacity 
                    style={styles.headerIcon}
                    onPress={() => navigation.navigate('NewChat')}
                >
                    <AntDesign name="plus" size={24} color="black" />
                </TouchableOpacity>
                <TouchableOpacity 
                    style={styles.headerIcon}
                    onPress={() => navigation.navigate('Camera')}
                >
                    <MaterialIcons name="camera-alt" size={24} color="black" />
                </TouchableOpacity>
            </View>

            {/* Leere FlatList, da keine Freunde angezeigt werden */}
            {/* 
            <FlatList
                data={filteredChats}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                style={styles.chatList}
            />
            */}

            {/* Das Hauptinhalt-Container nimmt den verbleibenden Platz ein */}
            <View style={{ flex: 1 }} />

            <View style={styles.footer}>
                <TouchableOpacity 
                    style={styles.footerItem} 
                    onPress={() => navigation.navigate('Home')}
                >
                    <MaterialIcons name="chat-bubble-outline" size={24} color="black" />
                    <Text style={styles.footerText}>Chats</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={styles.footerItem} 
                    onPress={() => navigation.navigate('Calls')}
                >
                    <MaterialIcons name="call" size={24} color="black" />
                    <Text style={styles.footerText}>Anrufe</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={styles.footerItem} 
                    onPress={() => navigation.navigate('Settings')}
                >
                    <MaterialIcons name="settings" size={24} color="black" />
                    <Text style={styles.footerText}>Einstellungen</Text>
                </TouchableOpacity>
                {/* Wenn du keine Freunde sehen willst, entferne oder ändere diesen Button */}
                <TouchableOpacity 
                    style={styles.footerItem} 
                    onPress={() => navigation.navigate('FriendsList')}
                >
                    <MaterialIcons name="people" size={24} color="black" />
                    <Text style={styles.footerText}>Freunde</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default HomePage;
