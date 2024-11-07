import React, { useEffect, useState } from 'react';
import { View, FlatList, TextInput, TouchableOpacity, Text, Alert } from 'react-native';
import { API, graphqlOperation } from 'aws-amplify';
import { createMessage } from '../graphql/mutations';
import styles from '../styles/ChatScreenStyle';

const ChatScreen = ({ route }) => {
    const { chatId } = route.params;
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        // WebSocket-Verbindung herstellen
        const ws = new WebSocket('wss://<dein-websocket-endpoint>');

        ws.onopen = () => {
            console.log('WebSocket connection opened');
        };

        ws.onmessage = (event) => {
            const message = JSON.parse(event.data);
            setMessages(prevMessages => [...prevMessages, message]);
        };

        ws.onclose = () => {
            console.log('WebSocket connection closed');
        };

        setSocket(ws);

        return () => {
            ws.close();
        };
    }, []);

    const handleSendMessage = async () => {
        if (!newMessage.trim()) return; // Leere Nachrichten ignorieren

        const message = {
            id: Date.now().toString(),
            username: 'user', // Setze den Benutzernamen hier
            message: newMessage,
        };

        try {
            // Nachricht in DynamoDB speichern
            await API.graphql(graphqlOperation(createMessage, { input: message }));

            // Nachricht über WebSocket senden
            socket.send(JSON.stringify(message));

            // Eingabefeld leeren
            setNewMessage('');
        } catch (error) {
            console.error('Error sending message:', error);
            Alert.alert('Fehler', 'Nachricht konnte nicht gesendet werden.');
        }
    };

    const renderMessage = ({ item }) => (
        <View style={item.username === 'user' ? styles.userMessage : styles.otherMessage}>
            <Text style={styles.messageText}>{item.message}</Text>
            <Text style={styles.messageTime}>{item.time}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={messages}
                renderItem={renderMessage}
                keyExtractor={item => item.id}
                inverted
                contentContainerStyle={styles.messageList}
            />
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Nachricht schreiben..."
                    value={newMessage}
                    onChangeText={setNewMessage}
                />
                <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
                    <Text style={styles.sendButtonText}>Senden</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default ChatScreen;
