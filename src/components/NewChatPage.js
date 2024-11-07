import React from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import styles from '../styles/HomePageStyle';

{/* Daten für die Kontaktliste */}
const contacts = [
    { id: 1, name: 'Max Mustermann' },
    { id: 2, name: 'Anna Schmidt' },
    { id: 3, name: 'Tom Müller' },
    { id: 4, name: 'Lisa Becker' },
    { id: 5, name: 'Paul Weber' },
];

/**
 * NewChatPage-Komponente
 * Zeigt eine Liste der Kontakte an, bei deren Auswahl ein neuer Chat gestartet wird.
 * @param {Object} props - Eigenschaften der Komponente.
 * @param {Object} props.navigation - Navigationseigenschaft zur Steuerung der Navigation zwischen Screens.
 * @returns {JSX.Element} - Eine Komponente, die Kontakte für den Start eines neuen Chats anzeigt.
 */
const NewChatPage = ({ navigation }) => {

    /**
     * Rendert ein einzelnes Kontakt-Element in der Liste.
     * @param {Object} item - Das Datenobjekt des Kontakts.
     * @returns {JSX.Element} - Ein TouchableOpacity-Element, das den Kontaktnamen anzeigt.
     */
    const renderContactItem = ({ item }) => (
        <TouchableOpacity 
            style={styles.chatItem} 
            onPress={() => navigation.navigate('Chat', { chatId: item.id })} 
        >
            <Text style={styles.chatName}>{item.name}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            {/* FlatList zur Anzeige der Kontaktliste */}
            <FlatList
                data={contacts} 
                renderItem={renderContactItem} 
                keyExtractor={item => item.id.toString()} 
                style={styles.chatList} 
            />
        </View>
    );
};

export default NewChatPage;
