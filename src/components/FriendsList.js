import React, { useEffect, useState, useMemo } from 'react';
import { View, FlatList, Text, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { Auth, API, graphqlOperation } from 'aws-amplify';
import styles from '../styles/HomePageStyle';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Footer from './Footer';
import { mutations } from '../graphql/mutations';

// Import the necessary GraphQL query
import { getUser } from '../graphql/queries';

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
                    // Modified to handle array of usernames instead of IDs
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

    const filteredFriends = useMemo(() => {
        return friends.filter(friend => 
            (friend.displayName?.toLowerCase().includes(searchQuery.toLowerCase())) ||
            friend.email.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [friends, searchQuery]);

    const handleUnfriend = async (friend) => {
        try {
          console.log("Attempting to unfriend:", friend.email);
          const result = await API.graphql(
            graphqlOperation(mutations.unfriend, { friendEmail: friend.email })
          );
          console.log("Full unfriend result:", JSON.stringify(result, null, 2));
          if (result.data && result.data.unfriend === true) {
            console.log("Successfully unfriended");
            setFriends(prevFriends => prevFriends.filter(f => f.id !== friend.id));
            console.log(`You have unfriended ${friend.displayName || friend.username}.`);
          } else {
            console.error("Failed to unfriend. Result:", JSON.stringify(result, null, 2));
            console.log("Failed to unfriend. Please try again.");
          }
        } catch (error) {
          console.error("Error unfriending:", JSON.stringify(error, null, 2));
          console.error("Error name:", error.name);
          console.error("Error message:", error.message);
          console.error("Error stack:", error.stack);
          if (error.errors) {
            console.error("GraphQL errors:", JSON.stringify(error.errors, null, 2));
          }
          console.log("An error occurred while trying to unfriend. Please try again.");
        }
      };
      
      
      
    

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
            <TouchableOpacity 
                style={styles.unfriendButton}
                onPress={() => handleUnfriend(item)}
            >
                <AntDesign name="close" size={24} color="red" />
            </TouchableOpacity>
        </View>
    );
    
    
    

    if (loading) {
        return (
            <View style={[styles.container, styles.centerContent]}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    if (error) {

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
