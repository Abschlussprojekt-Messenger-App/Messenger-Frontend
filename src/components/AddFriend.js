import React, { useState, useEffect, useCallback } from 'react';
import { View, TextInput, FlatList, TouchableOpacity, Text, Alert, Button } from 'react-native';
import { Auth, API, graphqlOperation } from 'aws-amplify';
import { listUsers } from '../graphql/queries';
import { addFriend } from '../graphql/mutations';
import styles from '../styles/HomePageStyle';

const AddFriend = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [users, setUsers] = useState([]);
    const [currentUserEmail, setCurrentUserEmail] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);

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
            console.log('Mutation response:', JSON.stringify(response, null, 2));
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
            if (error.errors) {
                console.error('GraphQL errors:', error.errors);
            }
            Alert.alert('Error', 'Fehler beim Hinzufügen des Freundes.');
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
                <Button
                    title={`Freund hinzufügen: ${selectedUser.email}`}
                    onPress={addFriendMutation}
                    disabled={!selectedUser}
                />
            )}
        </View>
    );
};

export default AddFriend;
