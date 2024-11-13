import React, { useEffect, useState, useMemo } from 'react';
import { View, FlatList, Text, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { Auth, API, graphqlOperation } from 'aws-amplify';
import styles from '../styles/HomePageStyle';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Footer from './Footer';
import * as mutations from '../graphql/mutations';
import { getUser } from '../graphql/queries';

const FriendsList = ({ navigation }) => {
    const [friends, setFriends] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch current user and friends list
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
                        .filter(Boolean); // Remove any null values
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

    // Filter friends based on search query
    const filteredFriends = useMemo(() => {
        return friends.filter(friend => 
            (friend.displayName?.toLowerCase().includes(searchQuery.toLowerCase())) ||
            friend.email.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [friends, searchQuery]);

    // Handle unfriend action
    const handleUnfriend = async (friend) => {
        try {
            // Log: Freund, den wir entfreunden wollen
            console.log("Attempting to unfriend friend:", friend);
            console.log("Friend's email:", friend.email);  // Ausgabe der E-Mail des Freundes
    
            // Überprüfen, ob der aktuelle Benutzer und dessen E-Mail vorhanden sind
            if (!currentUser || !currentUser.email) {
                console.error("Current user's email is not available.");
                setError("Current user's email is missing.");
                return;
            }
    
            // Log: Aktueller Benutzer und seine E-Mail
            const currentUserEmail = currentUser.email;
            console.log("Current user:", currentUser);
            console.log("Current user's email:", currentUserEmail);  // Ausgabe der aktuellen Benutzer-E-Mail
    
            // Überprüfen, ob die E-Mail des Freundes vorhanden ist
            if (!friend || !friend.email) {
                console.error("Friend's email is not available.");
                setError("Friend's email is missing.");
                return;
            }
    
            // Log: Daten, die an die Mutation übergeben werden
            console.log("Calling unfriend mutation with the following data:");
            console.log({
                userEmail: currentUserEmail,   // Benutzer-E-Mail
                friendEmail: friend.email      // Freundes-E-Mail
            });
    
            // Mutation aufrufen
            const result = await API.graphql(
                graphqlOperation(mutations.unfriend, { 
                    userEmail: currentUserEmail, 
                    friendEmail: friend.email 
                })
            );
    
            // Log: Ergebnis der Mutation
            console.log("Mutation result:", result); // Zeige das Ergebnis der Mutation an
    
            // Überprüfe das Ergebnis der Mutation
            if (result && result.data && result.data.unfriend) {
                console.log("Successfully unfriended friend:", friend.email);
                setFriends(prevFriends => prevFriends.filter(f => f.id !== friend.id));
            } else {
                console.error("Unexpected response structure:", result);
                setError("Unfriend failed. Please try again.");
            }
        } catch (error) {
            // Fehlerbehandlung
            console.error("Error unfriending:", error);
            setError(`An error occurred: ${error.message || 'Unknown error'}`);
        }
    };
    
    
    

    // Render friend item in the list
    const renderFriendItem = ({ item }) => (
        <View style={styles.chatItem}>
            <TouchableOpacity 
                style={styles.chatDetails}
                onPress={() => navigation.navigate('Chat', {
                    friendUsername: item.username,
                    friendName: item.displayName || item.username,
                    friendEmail: item.email
                })}
            >
                <Text style={styles.chatName}>{item.displayName || item.username}</Text>
                <Text style={styles.lastMessage}>{item.email}</Text>
            </TouchableOpacity>
            {/* Button to unfriend */}
            <TouchableOpacity
                onPress={() => handleUnfriend(item)}
                style={styles.unfriendButton}
            >
                <Text style={styles.unfriendText}>Unfriend</Text>
            </TouchableOpacity>
        </View>
    );

    // Loading state
    if (loading) {
        return (
            <View style={[styles.container, styles.centerContent]}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    // Error state
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
                    onPress={() => navigation.navigate('AddFriend')}
                    style={styles.addFriendButton}
                >
                    <AntDesign name="plus" size={24} color="white" />
                    <Text style={styles.addFriendText}>Freund hinzufügen</Text>
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
