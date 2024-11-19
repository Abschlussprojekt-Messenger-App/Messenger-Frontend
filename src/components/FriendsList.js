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
            console.error("Current user not found.");
            return;
        }
    
        try {
            // Erstelle den ChatRoom in der Datenbank
            const result = await API.graphql(graphqlOperation(createRoom, {
                user1: currentUser.username,
                user2: friendUsername,
            }));
    
            const chatRoom = result.data.createRoom;
            console.log("ChatRoom created successfully:", chatRoom);
    
            // Navigiere zum ChatScreen und übergebe den ChatRoomId und FriendInfo
            navigation.navigate('ChatScreen', {
                chatRoomId: chatRoom.chatRoomId,  // Die ID des ChatRaums
                friendUsername: friendUsername,   // Username des Freundes
                friendName: chatRoom.user2 === friendUsername ? chatRoom.user1 : chatRoom.user2, // Name des Freundes (je nach Benutzer)
            });
        } catch (err) {
            console.error("Error creating ChatRoom:", err);
            setError('Error creating chat room.');
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
                        // Navigiere zum ChatScreen mit den richtigen Parametern
                        navigation.navigate('Chat', {
                            chatRoomId, 
                            friendUsername: item.username, 
                            friendName: item.displayName || item.username
                        });
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
