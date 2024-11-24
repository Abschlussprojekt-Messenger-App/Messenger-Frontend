import React, { useEffect, useState, useMemo } from 'react';
import { View, FlatList, Text, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { Auth, API, graphqlOperation } from 'aws-amplify';
import styles from '../styles/FriendsListStyle';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Footer from './Footer';
import { getUser } from '../graphql/queries';
import { createOrGetChatRoom } from '../graphql/mutations';

const FriendsList = ({ navigation }) => {
    const [friends, setFriends] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Funktion zum Abrufen von Benutzerdaten und Freunden
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
            setError('Failed to load friends. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Lade die Liste beim ersten Rendern und wenn der Fokus zurückkehrt
    useEffect(() => {
        // Initiale Datenabfrage
        fetchCurrentUserAndFriends();

        // Den Fokuslistener hinzufügen, um beim Zurückkehren die Daten neu zu laden
        const focusListener = navigation.addListener('focus', () => {
            fetchCurrentUserAndFriends();
        });

        // Entfernen des Event-Listeners, wenn der Bildschirm nicht mehr im Fokus ist
        return () => {
            focusListener();
        };
    }, [navigation]);

    const filteredFriends = useMemo(() => {
        return friends.filter(friend => 
            (friend.displayName?.toLowerCase().includes(searchQuery.toLowerCase())) ||
            friend.email.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [friends, searchQuery]);

    const createOrGetChatRoomInDatabase = async (friendUsername) => {
        if (!currentUser) {
            console.error("Current user not found.");
            return;
        }

        try {
            const result = await API.graphql(graphqlOperation(createOrGetChatRoom, {
                user1: currentUser.username,
                user2: friendUsername,
            }));

            const chatRoom = result.data.createOrGetChatRoom;

            // Get friend's displayName
            const friend = friends.find(f => f.username === friendUsername);
            const friendName = friend ? friend.displayName : friendUsername;

            navigation.navigate('Chat', {
                chatRoomId: chatRoom.chatRoomId,
                friendUsername,
                friendName,
            });

        } catch (err) {
            console.error("Error creating or fetching ChatRoom:", err);
            setError('Error handling chat room. ' + err.message);
        }
    };

    const renderFriendItem = ({ item }) => {
        return (
            <View style={styles.chatItem}>
                <TouchableOpacity
                    style={styles.chatDetails}
                    onPress={async () => {
                        await createOrGetChatRoomInDatabase(item.username);
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
