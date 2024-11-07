import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MainPage from '../components/MainPage'; 
import LoginPage from '../components/LoginPage'; 
import SignUpPage from '../components/SignUpPage';
import HomePage from '../components/HomePage';
import ChatScreen from '../components/ChatScreen'; 
import SettingsPage from '../components/SettingsPage'; 
import NewChatPage from '../components/NewChatPage';
import FriendsList from '../components/FriendsList';
import AddFriend from '../components/AddFriend';

const Stack = createNativeStackNavigator();

/**
 * AppNavigator-Komponente, die die Navigation zwischen den Bildschirmen verwaltet.
 * 
 * @returns {JSX.Element} - Das NavigationContainer mit dem StackNavigator.
 */
const AppNavigator = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Main">
                <Stack.Screen name="Main" component={MainPage} />
                <Stack.Screen name="Login" component={LoginPage} />
                <Stack.Screen name="SignUp" component={SignUpPage} />
                <Stack.Screen name="Home" component={HomePage} />
                <Stack.Screen name="Chat" component={ChatScreen} /> 
                <Stack.Screen name="Settings" component={SettingsPage} />
                <Stack.Screen name="NewChat" component={NewChatPage} />
                <Stack.Screen name="FriendsList" component={FriendsList} />
                <Stack.Screen name="AddFriend" component={AddFriend} />

            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;
