import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
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
    // Funktion zum Abrufen des aktuell angemeldeten Benutzers
    const fetchCurrentUser = async () => {
      try {
        const user = await Auth.currentAuthenticatedUser();  // Holt den aktuell angemeldeten Benutzer
        setCurrentUser(user);
        console.log('Aktueller Benutzer:', user);  // Protokollierung des Benutzers

        // Abrufen der Benutzersession
        const session = await Auth.currentSession();  // Hier rufen wir die vollständige Sitzung ab
        console.log('Benutzersession:', session);  // Gibt die vollständige Session zurück, inkl. Tokens

      } catch (err) {
        setError('Fehler beim Laden des Benutzers.');
        console.error('Fehler beim Laden des Benutzers:', err);  // Fehlerprotokollierung
      } finally {
        setLoading(false);  // Ladeanzeige beenden
      }
    };

    fetchCurrentUser();  // Benutzer laden, wenn der Bildschirm geladen wird

    const fetchMessages = async () => {
      try {
        // Abrufen der Nachrichten für den ChatRoom
        const result = await API.graphql(graphqlOperation(getChatRoomMessages, { chatRoomId, limit: 20 }));
        const fetchedMessages = result.data.getChatRoomMessages.items;
        setMessages(fetchedMessages);
      } catch (err) {
        console.error('Fehler beim Abrufen der Nachrichten:', err);
        setError('Fehler beim Laden der Nachrichten.');
      }
    };

    fetchMessages();  // Nachrichten abrufen

    // Echtzeit-Subscription für neue Nachrichten
    const subscription = API.graphql(graphqlOperation(onNewMessage, { chatRoomId })).subscribe({
      next: ({ value }) => {
        const newMessage = value.data.onNewMessage;
        setMessages(prevMessages => [...prevMessages, newMessage]);  // Neue Nachricht zur Liste hinzufügen
      },
      error: (err) => {
        console.error('Fehler bei der Echtzeitnachricht:', err);
        setError('Fehler beim Empfangen von Nachrichten.');
      },
    });

    // Cleanup der Subscription beim Verlassen des Screens
    return () => subscription.unsubscribe();
  }, [chatRoomId]);

  // Sicherstellen, dass die Nachrichten chronologisch sortiert werden
  const sortedMessages = messages.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

  // Funktion zum Senden einer Nachricht
  const sendMessage = async () => {
    if (!messageText.trim()) return;  // Verhindern, dass leere Nachrichten gesendet werden

    const input = {
      chatRoomId,
      username: currentUser.username,  // Username des aktuellen Benutzers
      message: messageText,
      receiverUsername: friendUsername,
      status: 'SENT',
    };

    try {
      await API.graphql(graphqlOperation(createMessage, { input }));
      console.log('Nachricht gesendet');
      setMessageText('');  // Eingabefeld zurücksetzen
    } catch (err) {
      console.error('Fehler beim Senden der Nachricht:', err);
      setError('Fehler beim Senden der Nachricht.');
    }
  };

  // Wenn der Benutzer noch nicht geladen ist, zeige einen Ladeindikator
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  // Wenn ein Fehler aufgetreten ist, zeige den Fehler an
  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('Home')} style={styles.backButton}>
          <AntDesign name="arrowleft" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{friendName || friendUsername}</Text>
      </View>

      {/* Nachrichtenanzeige */}
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

      {/* Eingabefeld für neue Nachricht */}
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
    </View>
  );
};

export default ChatScreen;
