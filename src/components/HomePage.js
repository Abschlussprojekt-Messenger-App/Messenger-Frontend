import React, { useEffect, useState } from 'react';
import { 
    View, 
    Text, 
    TextInput, 
    TouchableOpacity, 
    FlatList,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { API, Auth } from 'aws-amplify';
import styles from '../styles/HomePageStyle';
import { listUsers } from '../graphql/queries';

const HomePage = ({ navigation }) => {
    const [chats, setChats] = useState([]);
    const [currentUsername, setCurrentUsername] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    const filteredChats = chats.filter(chat => {
        if (!searchQuery) return true;
        const searchLower = searchQuery.toLowerCase();
        return chat.name.toLowerCase().includes(searchLower);
    });

    useEffect(() => {
        getCurrentUser();
    }, []);

    useEffect(() => {
        if (currentUsername) {
            fetchChats();
        }
    }, [currentUsername]);

    const getCurrentUser = async () => {
        try {
            const userInfo = await Auth.currentAuthenticatedUser();
            setCurrentUsername(userInfo.username);
        } catch (error) {
            console.error('Error getting current user:', error);
            navigation.navigate('Login');
        }
    };

    const fetchChats = async () => {
        try {
            const usersResult = await API.graphql({
                query: listUsers,
                authMode: 'AMAZON_COGNITO_USER_POOLS'
            });

            const chatList = usersResult.data.listUsers.items
                .filter(user => user.username !== currentUsername)
                .map(user => ({
                    id: user.username,
                    name: user.displayName || user.username
                }));

            setChats(chatList);
        } catch (error) {
            console.error('Error fetching chats:', error);
        }
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity 
            style={styles.chatItem} 
            onPress={() => navigation.navigate('Chat', { 
                friendUsername: item.id,
                friendName: item.name
            })} 
        >
            <Text style={styles.chatName}>{item.name}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <View style={[styles.header, styles.headerShadow]}>
                <TextInput 
                    style={styles.searchInput} 
                    placeholder="Suche" 
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
                <TouchableOpacity 
                    style={styles.headerIcon}
                    onPress={() => navigation.navigate('NewChat')}
                >
                    <AntDesign name="plus" size={24} color="black" />
                </TouchableOpacity>
                <TouchableOpacity 
                    style={styles.headerIcon}
                    onPress={() => navigation.navigate('Camera')}
                >
                    <MaterialIcons name="camera-alt" size={24} color="black" />
                </TouchableOpacity>
            </View>

            <FlatList
                data={filteredChats}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                style={styles.chatList}
            />

            <View style={styles.footer}>
                <TouchableOpacity 
                    style={styles.footerItem} 
                    onPress={() => navigation.navigate('Home')}
                >
                    <MaterialIcons name="chat-bubble-outline" size={24} color="black" />
                    <Text style={styles.footerText}>Chats</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={styles.footerItem} 
                    onPress={() => navigation.navigate('Calls')}
                >
                    <MaterialIcons name="call" size={24} color="black" />
                    <Text style={styles.footerText}>Anrufe</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={styles.footerItem} 
                    onPress={() => navigation.navigate('Settings')}
                >
                    <MaterialIcons name="settings" size={24} color="black" />
                    <Text style={styles.footerText}>Einstellungen</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={styles.footerItem} 
                    onPress={() => navigation.navigate('FriendsList')}
                >
                    <MaterialIcons name="people" size={24} color="black" />
                    <Text style={styles.footerText}>Freunde</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default HomePage;
