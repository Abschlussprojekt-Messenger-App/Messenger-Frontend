import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { Auth, API, graphqlOperation } from 'aws-amplify';
import { useFocusEffect } from '@react-navigation/native';
import styles from '../styles/HomePageStyle';
import Footer from './Footer';
import { listChatRooms } from '../graphql/queries'; 
import { getUser } from '../graphql/queries'; 
import { onCreateChatRoom } from '../graphql/subscriptions'; 

const HomePage = ({ navigation }) => {
  const [currentUsername, setCurrentUsername] = useState('');
  const [chatRooms, setChatRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [usersDisplayNames, setUsersDisplayNames] = useState({});

  // Hole den aktuellen Benutzer
  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const userInfo = await Auth.currentAuthenticatedUser();
        console.log('Fetched current username:', userInfo.username);
        setCurrentUsername(userInfo.username);
      } catch (error) {
        console.error('Error getting current user:', error);
        navigation.navigate('Login');
      }
    };

    getCurrentUser();
  }, []);

  // Funktion zum Abrufen der ChatRooms und Benutzernamen
  const fetchChatRooms = async () => {
    if (!currentUsername) return;

    setLoading(true);
    console.log('Fetching chat rooms for user:', currentUsername);
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
      const rooms = response.data.listChatRooms.items;
      console.log('Fetched chat rooms:', rooms);

      const displayNamesPromises = rooms.map(async (room) => {
        const otherUser = room.user1 === currentUsername ? room.user2 : room.user1;
        const userData = await API.graphql(graphqlOperation(getUser, { id: otherUser }));
        return { [otherUser]: userData.data.getUser.displayName };
      });

      const displayNames = await Promise.all(displayNamesPromises);
      const displayNamesObj = displayNames.reduce((acc, item) => ({ ...acc, ...item }), {});

      setUsersDisplayNames(displayNamesObj);
      setChatRooms(rooms);
    } catch (error) {
      console.error('Error fetching chat rooms:', error);
      setError('Error fetching chat rooms');
    } finally {
      setLoading(false);
    }
  };

  // `useFocusEffect` sorgt dafür, dass fetchChatRooms bei jedem Fokussieren der Seite ausgeführt wird
  useFocusEffect(
    React.useCallback(() => {
      fetchChatRooms();
    }, [currentUsername])
  );

  // Subscription für neue ChatRooms
  useEffect(() => {
    const subscription = API.graphql(graphqlOperation(onCreateChatRoom)).subscribe({
      next: (eventData) => {
        console.log('New chat room received from subscription:', eventData);
        const newChatRoom = eventData.value.data.onCreateChatRoom;

        const otherUser = newChatRoom.user1 === currentUsername ? newChatRoom.user2 : newChatRoom.user1;
        API.graphql(graphqlOperation(getUser, { id: otherUser }))
          .then((userData) => {
            const friendDisplayName = userData.data.getUser.displayName;
            setUsersDisplayNames((prevState) => ({
              ...prevState,
              [otherUser]: friendDisplayName,
            }));
          })
          .catch((err) => console.error('Error fetching display name for user:', err));

        setChatRooms((prevChatRooms) => [newChatRoom, ...prevChatRooms]);
      },
      error: (err) => console.error('Error with subscription:', err),
    });

    return () => subscription.unsubscribe();
  }, [currentUsername]);

  // Funktion zur Handhabung des Klicks auf einen ChatRoom
  const handleChatRoomPress = (chatRoomId, user1, user2) => {
    console.log(`Navigating to chat room ${chatRoomId} between ${user1} and ${user2}`);
    const friendUsername = user1 === currentUsername ? user2 : user1;
    const friendName = usersDisplayNames[friendUsername] || friendUsername;

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
            const friendDisplayName = usersDisplayNames[friendUsername] || friendUsername;

            return (
              <TouchableOpacity onPress={() => handleChatRoomPress(item.chatRoomId, item.user1, item.user2)}>
                <View style={styles.chatRoomItem}>
                  <Text style={styles.chatRoomName}>{friendDisplayName}</Text>
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
