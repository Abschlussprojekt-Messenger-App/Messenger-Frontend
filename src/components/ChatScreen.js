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

  const [currentUser, setCurrentUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [nextToken, setNextToken] = useState(null);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const user = await Auth.currentAuthenticatedUser();
        setCurrentUser(user);
      } catch (err) {
        setError('Fehler beim Laden des Benutzers.');
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();
  }, []);

  useEffect(() => {
    if (!chatRoomId) {
      setError('Ungültige Chatroom-ID.');
      return;
    }

    const fetchMessages = async () => {
      try {
        const result = await API.graphql(graphqlOperation(getChatRoomMessages, { chatRoomId, limit: 20, nextToken }));
        const fetchedMessages = result.data.getChatRoomMessages.items;
        setMessages(prevMessages => [...prevMessages, ...fetchedMessages]);
        setNextToken(result.data.getChatRoomMessages.nextToken);
      } catch (err) {
        console.error("Fehler beim Abrufen der Nachrichten:", err);
        setError(`Fehler beim Laden der Nachrichten: ${err.message || err}`);
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
        data={messages.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))}
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
        onEndReached={() => {
          if (nextToken) {
            setNextToken(nextToken);
          }
        }}
        onEndReachedThreshold={0.5}
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
