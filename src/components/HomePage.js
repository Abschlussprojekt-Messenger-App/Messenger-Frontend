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
    fetchChatRooms();
  }, []);

  const getCurrentUser = async () => {
    try {
      const userInfo = await Auth.currentAuthenticatedUser();
      setCurrentUsername(userInfo.username);
    } catch (error) {
      console.error('Error getting current user:', error);
      navigation.navigate('Login');
    }
  };

  const fetchChatRooms = async () => {
    setLoading(true);
    try {
      // Verwende listChatRooms-Query, um ChatRooms des Benutzers zu holen
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
      setChatRooms(rooms);
    } catch (error) {
      console.error('Error fetching chat rooms:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChatRoomPress = (chatRoomId) => {
    // Navigiere zum ChatRoom mit der chatRoomId
    navigation.navigate('Chat', { chatRoomId });
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
            <TouchableOpacity onPress={() => handleChatRoomPress(item.chatRoomId)}>
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
        />
      )}

      <Footer navigation={navigation} />
    </SafeAreaView>
  );
};

export default HomePage;
