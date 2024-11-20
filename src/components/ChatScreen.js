import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, ActivityIndicator, ImageBackground } from 'react-native';
import { Auth, API, graphqlOperation } from 'aws-amplify';
import { createMessage } from '../graphql/mutations';
import { onNewMessage } from '../graphql/subscriptions';
import { getChatRoomMessages } from '../graphql/queries';
import AntDesign from 'react-native-vector-icons/AntDesign';
import styles from '../styles/ChatScreenStyle';

const ChatScreen = ({ route, navigation }) => {
  const { friendUsername, friendName, chatRoomId } = route.params;

  const [currentUser, setCurrentUser] = useState(null);  // Zustand für den aktuellen Benutzer
  const [messages, setMessages] = useState([]);  // Zustand für Nachrichten
  const [messageText, setMessageText] = useState('');  // Zustand für Text in der Nachricht
  const [loading, setLoading] = useState(true);  // Zustand für Ladeanzeige
  const [error, setError] = useState(null);  // Zustand für Fehlerbehandlung

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const user = await Auth.currentAuthenticatedUser();
        setCurrentUser(user);

        const session = await Auth.currentSession();  
      } catch (err) {
        setError('Fehler beim Laden des Benutzers.');
      } finally {
        setLoading(false); 
      }
    };

    fetchCurrentUser();  

    const fetchMessages = async () => {
      try {
        const result = await API.graphql(graphqlOperation(getChatRoomMessages, { chatRoomId, limit: 20 }));
        const fetchedMessages = result.data.getChatRoomMessages.items;
        setMessages(fetchedMessages);
      } catch (err) {
        setError('Fehler beim Laden der Nachrichten.');
      }
    };

    fetchMessages();

    const subscription = API.graphql(graphqlOperation(onNewMessage, { chatRoomId })).subscribe({
      next: ({ value }) => {
        const newMessage = value.data.onNewMessage;
        setMessages(prevMessages => [...prevMessages, newMessage]);
      },
      error: (err) => {
        setError('Fehler beim Empfangen von Nachrichten.');
      },
    });

    return () => subscription.unsubscribe();
  }, [chatRoomId]);

  const sortedMessages = messages.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

  const sendMessage = async () => {
    if (!messageText.trim()) return;

    const input = {
      chatRoomId,
      username: currentUser.username,
      message: messageText,
      receiverUsername: friendUsername,
      status: 'SENT',
    };

    try {
      await API.graphql(graphqlOperation(createMessage, { input }));
      setMessageText('');
    } catch (err) {
      setError('Fehler beim Senden der Nachricht.');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <ImageBackground source={require('../../assets/background.jpg')} style={styles.container} imageStyle={styles.backgroundImage}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('Home')} style={styles.backButton}>
          <AntDesign name="arrowleft" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{friendName || friendUsername}</Text>
      </View>

      <FlatList
        style={styles.messageList}
        data={sortedMessages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            style={[
              styles.messageBubble,
              item.username === currentUser.username
                ? styles.myMessageBubble
                : styles.theirMessageBubble,
            ]}
          >
            <Text style={styles.messageText}>{item.message}</Text>
          </View>
        )}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Nachricht schreiben..."
          value={messageText}
          onChangeText={setMessageText}
        />
        <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
          <AntDesign name="arrowup" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

export default ChatScreen;
