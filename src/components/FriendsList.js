import React, { useEffect, useState, useMemo } from 'react';
import { View, FlatList, Text, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { Auth, API, graphqlOperation } from 'aws-amplify';
import styles from '../styles/HomePageStyle';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Footer from './Footer';
import { getUser } from '../graphql/queries';
import { createRoom } from '../graphql/mutations'; 

const FriendsList = ({ navigation }) => {
    const [friends, setFriends] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCurrentUserAndFriends = async () => {
            setLoading(true);
            setError(null);
            try {
                const user = await Auth.currentAuthenticatedUser();
                const userData = await API.graphql(graphqlOperation(getUser, { id: user.username }));
                setCurrentUser(userData.data.getUser);

                if (userData.data.getUser.friends && userData.data.getUser.friends.length > 0) {
                    const friendPromises = userData.data.getUser.friends.map(friendUsername =>
                        API.graphql(graphqlOperation(getUser, { id: friendUsername }))
                    );
                    const friendsData = await Promise.all(friendPromises);
                    const friendsList = friendsData
                        .map(friend => friend.data.getUser)
                        .filter(Boolean);
                    setFriends(friendsList);
                } else {
                    setFriends([]);
                }
            } catch (err) {
                console.error('Error fetching user and friends:', err);
                setError('Failed to load friends. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchCurrentUserAndFriends();
    }, []);

    const filteredFriends = useMemo(() => {
        return friends.filter(friend => 
            (friend.displayName?.toLowerCase().includes(searchQuery.toLowerCase())) ||
            friend.email.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [friends, searchQuery]);


    
    const createChatRoomInDatabase = async (friendUsername) => {
        if (!currentUser) {
            console.log("Kein aktueller Benutzer gefunden.");
            return;
        }
    
        console.log("Aktueller Benutzer:", currentUser.username);
        console.log("Freund-Username:", friendUsername);
    
        // Generiere die ChatRoomId
        const chatRoomId = `${currentUser.username}-${friendUsername}`;
        console.log(`ChatRoomId generiert: ${chatRoomId}`);
    
        // Überprüfen, ob die ChatRoomId gültig ist
        if (!chatRoomId) {
            console.error("Fehler: ChatRoomId ist leer oder undefiniert.");
            return;
        }
    
        // Überprüfen, ob die Variablen korrekt gesetzt sind
        if (!friendUsername || !currentUser.username) {
            console.error("Fehler: Einer der Benutzernamen ist undefiniert.");
            return;
        }
    
        // API-Aufruf-Input vorbereiten
        const input = {
            chatRoomId,       // ID des Chatraums
            user1: currentUser.username,  // Aktueller Benutzer
            user2: friendUsername,  // Freund
        };
    
        // Loggen des Inputs, bevor er an die API übergeben wird
        console.log("API-Aufruf Input:", JSON.stringify(input, null, 2));
    
        // Überprüfen, ob alle Werte im Input definiert sind
        if (!input.chatRoomId || !input.user1 || !input.user2) {
            console.error("Fehler: Einer der Input-Werte ist undefiniert oder leer.");
            return;
        }
    
        // Stellen Sie sicher, dass `graphqlOperation` korrekt funktioniert
        console.log("Bereite API-Aufruf vor...");
    
        try {
            // API-Aufruf an die GraphQL-Mutation
            console.log("Führe API.graphql Operation aus...");
            const result = await API.graphql(graphqlOperation(createRoom, { input }));
    
            // Erfolgreiche Antwort von der API
            console.log("ChatRoom erfolgreich erstellt. Ergebnis:", JSON.stringify(result, null, 2));
    
        } catch (err) {
            // Fehler im API-Aufruf loggen
            console.error("Fehler beim Erstellen des ChatRooms:", err);
    
            // Detailierte Fehlerbehandlung und Rückgabe des Fehlers
            if (err.response) {
                console.error("Fehlerantwort vom Server:", JSON.stringify(err.response, null, 2));
            }
            setError('Fehler beim Erstellen des Chatrooms.');
        }
    };
    
    
    
    
    
    const renderFriendItem = ({ item }) => {
        if (!currentUser || !item) {
            console.error('currentUser or item is undefined.');
            return null;
        }

        const chatRoomId = `${currentUser.username}-${item.username}`;
        console.log('Generated chatRoomId:', chatRoomId);

        return (
            <View style={styles.chatItem}>
                <TouchableOpacity
                    style={styles.chatDetails}
                    onPress={async () => {
                        console.log('Navigating to Chat with:', item.username, chatRoomId);
                        // Erstelle den Chatraum in der Datenbank und navigiere danach zum Chat
                        await createChatRoomInDatabase(item.username);
                    }}
                >
                    <Text style={styles.chatName}>{item.displayName || item.username}</Text>
                    <Text style={styles.lastMessage}>{item.email}</Text>
                </TouchableOpacity>
            </View>
        );
    };

    if (loading) {
        return (
            <View style={[styles.container, styles.centerContent]}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>{error}</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Freunde suchen..."
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
                <TouchableOpacity
                    onPress={() => navigation.navigate('FriendSettings')}
                    style={styles.addFriendButton}
                >
                    <AntDesign name="plus" size={24} color="white" />
                    <AntDesign name="minus" size={24} color="white" />
                    <Text style={styles.addFriendText}>Freunde bearbeiten</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                style={styles.chatList}
                data={filteredFriends}
                renderItem={renderFriendItem}
                keyExtractor={(item) => item.id}
                ListEmptyComponent={
                    <Text style={styles.emptyListText}>Keine Freunde gefunden</Text>
                }
            />

            <Footer navigation={navigation} />
        </View>
    );
};

export default FriendsList;
