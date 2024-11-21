import React, { useEffect, useState } from 'react';
import { View, TextInput, FlatList, Text, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native';
import { API, graphqlOperation } from 'aws-amplify';
import { Auth } from 'aws-amplify';
import styles from '../styles/HomePageStyle';
import Footer from './Footer';
import { listChatRooms } from '../graphql/queries'; // Importiere die GraphQL-Query

const HomePage = ({ navigation }) => {
  const [currentUsername, setCurrentUsername] = useState('');
  const [chatRooms, setChatRooms] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getCurrentUser();
  }, []);

  useEffect(() => {
    if (currentUsername) {
      fetchChatRooms();
    }
  }, [currentUsername]);

  // Hole den aktuellen Benutzer
  const getCurrentUser = async () => {
    try {
      const userInfo = await Auth.currentAuthenticatedUser();
      console.log("Fetched current username:", userInfo.username);
      setCurrentUsername(userInfo.username);
    } catch (error) {
      console.error('Error getting current user:', error);
      navigation.navigate('Login');
    }
  };

  // Hole alle ChatRooms des aktuellen Benutzers
  const fetchChatRooms = async () => {
    if (!currentUsername) {
      console.log("Waiting for currentUsername...");
      return;
    }

    setLoading(true);
    try {
      const response = await API.graphql(
        graphqlOperation(listChatRooms, {
          filter: {
            or: [
              { user1: { eq: currentUsername } },
              { user2: { eq: currentUsername } },
            ],
          },
        })
      );
      console.log("API response:", response);
      const rooms = response.data.listChatRooms.items;
      console.log("Fetched chat rooms:", rooms);

      setChatRooms(rooms); // Setze die gefundenen Räume in den Zustand
    } catch (error) {
      console.error('Error fetching chat rooms:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handler für den Klick auf einen ChatRoom
  const handleChatRoomPress = (chatRoomId, user1, user2) => {
    // Navigiere zum ChatRoom mit der chatRoomId
    const friendUsername = user1 === currentUsername ? user2 : user1;
    const friendName = friendUsername === user1 ? user2 : user1;

    navigation.navigate('Chat', { chatRoomId, friendUsername, friendName });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TextInput
          style={styles.searchInput}
          placeholder="Suche"
        />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={chatRooms}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleChatRoomPress(item.chatRoomId, item.user1, item.user2)}>
              <View style={styles.chatRoomItem}>
                <Text style={styles.chatRoomName}>
                  {item.user1 === currentUsername ? item.user2 : item.user1}
                </Text>
                <Text style={styles.chatRoomDate}>
                  Erstellt am: {item.createdAt}
                </Text>
              </View>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.chatRoomId}
          ListEmptyComponent={
            <Text style={styles.emptyListText}>Keine ChatRooms vorhanden</Text>
          }
        />
      )}

      <Footer navigation={navigation} />
    </SafeAreaView>
  );
};

export default HomePage;
