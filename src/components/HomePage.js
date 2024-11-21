import React, { useEffect, useState, useMemo } from 'react';
import { View, FlatList, Text, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { Auth, API, graphqlOperation } from 'aws-amplify';
import styles from '../styles/HomePageStyle';
import Footer from './Footer';
import { listChatRooms } from '../graphql/queries'; // Importiere die GraphQL-Query
import { getUser } from '../graphql/queries'; // Importiere die getUser Query

const HomePage = ({ navigation }) => {
  const [currentUsername, setCurrentUsername] = useState('');
  const [chatRooms, setChatRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [usersDisplayNames, setUsersDisplayNames] = useState({});

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

  // Hole alle ChatRooms des aktuellen Benutzers und ihre DisplayNames
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

      // Holen der DisplayName für user1 und user2
      const displayNamesPromises = rooms.map(async (room) => {
        const otherUser = room.user1 === currentUsername ? room.user2 : room.user1;
        const userData = await API.graphql(graphqlOperation(getUser, { id: otherUser }));
        return { [otherUser]: userData.data.getUser.displayName };
      });

      const displayNames = await Promise.all(displayNamesPromises);
      const displayNamesObj = displayNames.reduce((acc, item) => ({ ...acc, ...item }), {});

      setUsersDisplayNames(displayNamesObj);
      setChatRooms(rooms); // Setze die gefundenen Räume in den Zustand
    } catch (error) {
      console.error('Error fetching chat rooms:', error);
      setError('Error fetching chat rooms');
    } finally {
      setLoading(false);
    }
  };

  // Funktion zur Handhabung des Klicks auf einen ChatRoom
  const handleChatRoomPress = (chatRoomId, user1, user2) => {
    // Navigiere zum ChatRoom mit der chatRoomId
    const friendUsername = user1 === currentUsername ? user2 : user1;
    const friendName = usersDisplayNames[friendUsername] || friendUsername; // Wenn DisplayName nicht vorhanden, den Username verwenden

    navigation.navigate('Chat', { chatRoomId, friendUsername, friendName });
  };

  return (
    <View style={styles.container}>
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
          renderItem={({ item }) => {
            const friendUsername = item.user1 === currentUsername ? item.user2 : item.user1;
            const friendDisplayName = usersDisplayNames[friendUsername] || friendUsername; // Anzeige des DisplayName, Fallback auf Username

            return (
              <TouchableOpacity onPress={() => handleChatRoomPress(item.chatRoomId, item.user1, item.user2)}>
                <View style={styles.chatRoomItem}>
                  <Text style={styles.chatRoomName}>
                    {friendDisplayName}
                  </Text>
                  <Text style={styles.chatRoomDate}>
                    Erstellt am: {new Date(item.createdAt).toLocaleDateString('de-DE')}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          }}
          keyExtractor={(item) => item.chatRoomId}
          ListEmptyComponent={
            <Text style={styles.emptyListText}>Keine ChatRooms vorhanden</Text>
          }
        />
      )}

      <Footer navigation={navigation} />
    </View>
  );
};

export default HomePage;
