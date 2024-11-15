import React, { useEffect, useState } from 'react';
import { View, Text, Button, ActivityIndicator, TextInput, FlatList, TouchableOpacity } from 'react-native';
import { Auth, API, graphqlOperation } from 'aws-amplify';
import { createMessage } from '../graphql/mutations'; // Mutation zum Senden von Nachrichten
import { onNewMessage } from '../graphql/subscriptions'; // Subscription für Echtzeitnachrichten

const ChatScreen = ({ route, navigation }) => {
    const { friendUsername, friendName, chatRoomId } = route.params;

    const [currentUser, setCurrentUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [messageText, setMessageText] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                const user = await Auth.currentAuthenticatedUser();
                setCurrentUser(user);
                console.log('Aktueller Benutzer:', user);
            } catch (err) {
                setError('Fehler beim Laden des Benutzers.');
                console.error('Fehler beim Laden des Benutzers:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchCurrentUser();

        const subscription = API.graphql(graphqlOperation(onNewMessage, { chatRoomId }))
            .subscribe({
                next: ({ value }) => {
                    const newMessage = value.data.onNewMessage;
                    setMessages(prevMessages => [...prevMessages, newMessage]);
                },
                error: (err) => {
                    console.error('Fehler bei der Echtzeitnachricht:', err);
                    setError('Fehler beim Empfangen von Nachrichten.');
                },
            });

        // Clean-up der Subscription bei Verlassen des Screens
        return () => subscription.unsubscribe();
    }, [chatRoomId]);

    // Funktion zum Senden von Nachrichten
    const sendMessage = async () => {
        if (!messageText.trim()) return; // Leere Nachrichten vermeiden

        const input = {
            chatRoomId,
            username: currentUser.username,
            message: messageText,
            receiverUsername: friendUsername,
            status: 'SENT',
        };

        try {
            await API.graphql(graphqlOperation(createMessage, { input }));
            console.log('Nachricht gesendet');
            setMessageText(''); // Nachricht zurücksetzen
        } catch (err) {
            console.error('Fehler beim Senden der Nachricht:', err);
            setError('Fehler beim Senden der Nachricht.');
        }
    };

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    if (error) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>{error}</Text>
            </View>
        );
    }

    return (
        <View style={{ flex: 1, justifyContent: 'flex-end', padding: 10 }}>
            <Text style={{ fontSize: 20, marginBottom: 10 }}>Chat mit {friendName || friendUsername}</Text>

            {/* Nachrichtenanzeige */}
            <FlatList
                data={messages}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={{ marginBottom: 10 }}>
                        <Text>{item.username}: {item.message}</Text>
                    </View>
                )}
            />

            {/* Eingabefeld für neue Nachricht */}
            <TextInput
                style={{
                    height: 40,
                    borderColor: 'gray',
                    borderWidth: 1,
                    marginBottom: 10,
                    paddingLeft: 10,
                    borderRadius: 5,
                }}
                placeholder="Nachricht schreiben..."
                value={messageText}
                onChangeText={setMessageText}
            />

            {/* Button zum Senden der Nachricht */}
            <TouchableOpacity
                style={{
                    backgroundColor: '#0084ff',
                    paddingVertical: 10,
                    paddingHorizontal: 20,
                    borderRadius: 5,
                    alignItems: 'center',
                }}
                onPress={sendMessage}
            >
                <Text style={{ color: 'white' }}>Senden</Text>
            </TouchableOpacity>
        </View>
    );
};

export default ChatScreen;
