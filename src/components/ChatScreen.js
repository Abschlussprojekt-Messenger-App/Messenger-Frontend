import React, { useEffect, useState } from 'react';
import { 
    View, 
    FlatList, 
    TextInput, 
    TouchableOpacity, 
    Text, 
    Alert,
    RefreshControl 
} from 'react-native';
import { API, graphqlOperation, Auth } from 'aws-amplify';
import { createMessage } from '../graphql/mutations';
import { onNewMessage } from '../graphql/subscriptions';
import styles from '../styles/ChatScreenStyle';



const ChatScreen = ({ route, navigation }) => {
    const { friendUsername, friendName } = route.params;
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [currentUsername, setCurrentUsername] = useState('');
    const [refreshing, setRefreshing] = useState(false);

    // Initial setup
    useEffect(() => {
        navigation.setOptions({ title: friendName });
        let subscription;

        const initialize = async () => {
            try {
                // Get current user
                const userInfo = await Auth.currentAuthenticatedUser();
                setCurrentUsername(userInfo.username);

                // Fetch existing messages
                await fetchMessages(userInfo.username);

                // Set up subscription
                subscription = await subscribeToNewMessages(userInfo.username);
            } catch (error) {
                console.error('Initialization error:', error);
            }
        };

        initialize();

        return () => {
            if (subscription) {
                subscription.unsubscribe();
            }
        };
    }, []);

    // Fetch messages when returning to screen
    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            if (currentUsername) {
                fetchMessages(currentUsername);
            }
        });

        return unsubscribe;
    }, [navigation, currentUsername]);

    const fetchMessages = async (username) => {
        try {
            const messageData = await API.graphql(
                graphqlOperation(`
                    query GetMessages($receiverUsername: String!, $senderUsername: String!) {
                        listMessages(filter: {
                            or: [
                                { and: [
                                    { receiverUsername: { eq: $receiverUsername } },
                                    { username: { eq: $senderUsername } }
                                ]},
                                { and: [
                                    { receiverUsername: { eq: $senderUsername } },
                                    { username: { eq: $receiverUsername } }
                                ]}
                            ]
                        }) {
                            items {
                                id
                                message
                                username
                                receiverUsername
                                createdAt
                                status
                            }
                        }
                    }
                `, {
                    receiverUsername: friendUsername,
                    senderUsername: username
                })
            );

            const sortedMessages = messageData.data.listMessages.items.sort((a, b) =>
                new Date(b.createdAt) - new Date(a.createdAt)
            );

            setMessages(sortedMessages);
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };

    const subscribeToNewMessages = (username) => {
        console.log('Setting up subscription for:', username);
        
        return API.graphql(
            graphqlOperation(onNewMessage, { receiverUsername: username })
        ).subscribe({
            next: ({ provider, value }) => {
                console.log('Received new message:', value);
                const newMessage = value.data.onNewMessage;
                
                // Only add message if it's from the current chat
                if (newMessage.username === friendUsername || 
                    (newMessage.receiverUsername === friendUsername && 
                     newMessage.username === username)) {
                    setMessages(prevMessages => [newMessage, ...prevMessages]);
                }
            },
            error: error => console.warn('Subscription error:', error)
        });
    };

    const handleSendMessage = async () => {
        if (!newMessage.trim() || !currentUsername) return;

        try {
            const messageInput = {
                input: {
                    username: currentUsername,
                    message: newMessage.trim(),
                    receiverUsername: friendUsername,
                    createdAt: new Date().toISOString(),
                    status: 'SENT'
                }
            };

            console.log('Sending message:', messageInput);

            const result = await API.graphql(
                graphqlOperation(createMessage, messageInput)
            );

            const sentMessage = result.data.createMessage;
            setMessages(prevMessages => [sentMessage, ...prevMessages]);
            setNewMessage('');

            // Notify HomePage to refresh
            navigation.setParams({ 
                refresh: Date.now(),
                previousScreen: 'Chat'
            });

        } catch (error) {
            console.error('Error sending message:', error);
            Alert.alert('Error', 'Failed to send message');
        }
    };

    const renderMessage = ({ item }) => {
        const isCurrentUser = item.username === currentUsername;
        return (
            <View style={isCurrentUser ? styles.userMessage : styles.otherMessage}>
                <Text style={styles.messageText}>{item.message}</Text>
                <Text style={styles.messageTime}>
                    {new Date(item.createdAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                    })}
                </Text>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={messages}
                renderItem={renderMessage}
                keyExtractor={item => item.id}
                inverted
                contentContainerStyle={styles.messageList}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={() => {
                            setRefreshing(true);
                            fetchMessages(currentUsername).finally(() => {
                                setRefreshing(false);
                            });
                        }}
                    />
                }
            />
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Type a message..."
                    value={newMessage}
                    onChangeText={setNewMessage}
                    multiline
                />
                <TouchableOpacity
                    style={styles.sendButton}
                    onPress={handleSendMessage}
                    disabled={!newMessage.trim()}
                >
                    <Text style={styles.sendButtonText}>Send</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default ChatScreen;
