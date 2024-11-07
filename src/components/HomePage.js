import React from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import styles from '../styles/HomePageStyle';

const HomePage = ({ navigation }) => {
    const chats = [
        { id: 1, name: 'Max Mustermann', lastMessage: 'Wie geht\'s?', time: '10:30' },
        { id: 2, name: 'Anna Schmidt', lastMessage: 'Bis später!', time: '09:15' },
        { id: 3, name: 'Tom Müller', lastMessage: 'Lass uns morgen treffen!', time: '08:50' },
        { id: 4, name: 'Lisa Becker', lastMessage: 'Danke für die Info!', time: '08:30' },
        { id: 5, name: 'Paul Weber', lastMessage: 'Hast du das Dokument?', time: '07:45' },
    ];

    const renderItem = ({ item }) => (
        <TouchableOpacity 
            style={styles.chatItem} 
            onPress={() => navigation.navigate('Chat', { chatId: item.id })} 
        >
            <View style={styles.chatDetails}>
                <Text style={styles.chatName}>{item.name || 'Unbekannter Kontakt'}</Text>
                <Text style={styles.lastMessage}>{item.lastMessage || 'Keine Nachricht'}</Text>
            </View>
            <Text style={styles.chatTime}>{item.time || '00:00'}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TextInput style={styles.searchInput} placeholder="Suche" />
                <TouchableOpacity onPress={() => navigation.navigate('NewChat')}>
                    <AntDesign name="plus" size={24} color="black" />
                </TouchableOpacity>
                <View style={styles.headerSpacer} />
                <TouchableOpacity onPress={() => navigation.navigate('Camera')}>
                    <MaterialIcons name="camera-alt" size={24} color="black" />
                </TouchableOpacity>
            </View>

            <FlatList
                data={chats}
                renderItem={renderItem} 
                keyExtractor={item => item.id.toString()}
                style={styles.chatList}
            />

            <View style={styles.footer}>
                <TouchableOpacity onPress={() => navigation.navigate('Home')} style={styles.footerItem}>
                    <MaterialIcons name="chat-bubble-outline" size={24} color="black" />
                    <Text style={styles.footerText}>Chats</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('Calls')} style={styles.footerItem}>
                    <MaterialIcons name="call" size={24} color="black" />
                    <Text style={styles.footerText}>Anrufe</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('Settings')} style={styles.footerItem}>
                    <MaterialIcons name="settings" size={24} color="black" />
                    <Text style={styles.footerText}>Einstellungen</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('FriendsList')} style={styles.footerItem}>
                    <MaterialIcons name="people" size={24} color="black" />
                    <Text style={styles.footerText}>Freunde</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default HomePage;
