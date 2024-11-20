import React, { useState, useEffect, useCallback } from 'react';
import { View, TextInput, FlatList, TouchableOpacity, Text, Alert, Button } from 'react-native';
import { Auth, API, graphqlOperation } from 'aws-amplify';
import { listUsers } from '../graphql/queries';
import { addFriend, unfriend } from '../graphql/mutations';
import styles from '../styles/FriendSettingsStyle';  // Achte auf den richtigen Import
import Footer from '../components/Footer';

const FriendSettings = ({ navigation }) => {  // Navigation als Prop erhalten
    const [searchTerm, setSearchTerm] = useState('');
    const [users, setUsers] = useState([]);
    const [currentUserEmail, setCurrentUserEmail] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);

    // Get current user's email
    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                const user = await Auth.currentAuthenticatedUser();
                setCurrentUserEmail(user.attributes.email);
                console.log('Current user email:', user.attributes.email);
            } catch (error) {
                console.error('Error fetching current user:', error);
            }
        };
        fetchCurrentUser();
    }, []);

    // Fetch users based on search term
    const fetchUsers = useCallback(async (term) => {
        if (term) {
            try {
                console.log('Fetching users with search term:', term);
                const response = await API.graphql(graphqlOperation(listUsers, {
                    filter: {
                        or: [
                            { username: { contains: term.toLowerCase() } },
                            { email: { contains: term.toLowerCase() } }
                        ]
                    }
                }));
                console.log('Users fetched:', response.data.listUsers.items);
                setUsers(response.data.listUsers.items);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        } else {
            setUsers([]);
        }
    }, []);

    useEffect(() => {
        fetchUsers(searchTerm);
    }, [searchTerm, fetchUsers]);

    // Function to add friend
    const addFriendMutation = async () => {
        if (!selectedUser || !currentUserEmail) {
            Alert.alert('Error', 'Bitte wählen Sie zuerst einen Benutzer aus.');
            return;
        }
        try {
            console.log('Adding friend:', selectedUser.email);
            const response = await API.graphql(graphqlOperation(addFriend, {
                userEmail: currentUserEmail,
                friendEmail: selectedUser.email
            }));
            console.log('Add friend mutation response:', response);
            if (response.data && response.data.addFriend === true) {
                Alert.alert('Success', 'Freund hinzugefügt!');
                setSelectedUser(null);
                setSearchTerm('');
            } else {
                console.error('Error details:', response.errors);
                Alert.alert('Error', 'Freund konnte nicht hinzugefügt werden.');
            }
        } catch (error) {
            console.error('Error adding friend:', error);
            Alert.alert('Error', 'Fehler beim Hinzufügen des Freundes.');
        }
    };

    // Function to remove friend
    const removeFriendMutation = async () => {
        if (!selectedUser || !currentUserEmail) {
            Alert.alert('Error', 'Bitte wählen Sie zuerst einen Freund zum Entfernen aus.');
            return;
        }
        try {
            console.log('Removing friend:', selectedUser.email);
            const response = await API.graphql(graphqlOperation(unfriend, {
                userEmail: currentUserEmail,
                friendEmail: selectedUser.email
            }));
            console.log('Remove friend mutation response:', response);
            if (response.data && response.data.unfriend === true) {
                Alert.alert('Success', 'Freund entfernt!');
                setSelectedUser(null);
                setSearchTerm('');
            } else {
                console.error('Error details:', response.errors);
                Alert.alert('Error', 'Freund konnte nicht entfernt werden.');
            }
        } catch (error) {
            console.error('Error removing friend:', error);
            Alert.alert('Error', 'Fehler beim Entfernen des Freundes.');
        }
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.searchInput}
                placeholder="Suche nach Freunden (E-Mail)"
                value={searchTerm}
                onChangeText={setSearchTerm}
            />
            <FlatList
                data={users}
                renderItem={({ item }) => (
                    <TouchableOpacity 
                        onPress={() => setSelectedUser(item)}
                        style={[
                            styles.userItem,
                            selectedUser && selectedUser.id === item.id && styles.selectedUserItem
                        ]}
                    >
                        <Text>{item.email || 'Keine E-Mail verfügbar'}</Text>
                    </TouchableOpacity>
                )}
                keyExtractor={item => item.id}
            />
            {selectedUser && (
                <View style={styles.buttonContainer}>
                    <Button
                        title={`Freund hinzufügen: ${selectedUser.email}`}
                        onPress={addFriendMutation}
                        disabled={!selectedUser}
                    />
                    <Button
                        title={`Freund entfernen: ${selectedUser.email}`}
                        onPress={removeFriendMutation}
                        color="red"
                        disabled={!selectedUser}
                    />
                </View>
            )}
            {/* Footer */}
            <Footer navigation={navigation} />
        </View>
    );
};

export default FriendSettings;
