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
 * AppNavigator component that manages navigation between screens.
 * 
 * @returns {JSX.Element} - The NavigationContainer with StackNavigator.
 */
const AppNavigator = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator 
                initialRouteName="Main"
                screenOptions={{
                    headerShown: true,
                    headerStyle: {
                        backgroundColor: '#ffffff',
                    },
                    headerTintColor: '#000000',
                    headerTitleStyle: {
                        fontWeight: 'bold',
                    },
                }}
            >
                <Stack.Screen 
                    name="Main" 
                    component={MainPage}
                    options={{ headerShown: false }}
                />
                
                <Stack.Screen 
                    name="Login" 
                    component={LoginPage}
                    options={{ title: 'Login' }}
                />
                
                <Stack.Screen 
                    name="SignUp" 
                    component={SignUpPage}
                    options={{ title: 'Sign Up' }}
                />
                
                <Stack.Screen 
                    name="Home" 
                    component={HomePage}
                    options={{ 
                        headerShown: false,
                        headerLeft: null // Disable back button
                    }}
                />
                
                <Stack.Screen 
                    name="Chat" 
                    component={ChatScreen}
                    options={({ route }) => ({ 
                        title: route.params?.friendName || 'Chat',
                        headerBackTitle: 'Back'
                    })}
                    listeners={({ navigation, route }) => ({
                        blur: () => {
                            // Refresh home screen when leaving chat
                            navigation.navigate('Home', { 
                                refresh: Date.now(),
                                previousScreen: 'Chat'
                            });
                        },
                        focus: () => {
                            // Refresh chat when returning
                            if (route.params?.refresh) {
                                // Your refresh logic here
                            }
                        }
                    })}
                />
                
                <Stack.Screen 
                    name="Settings" 
                    component={SettingsPage}
                    options={{ title: 'Settings' }}
                />
                
                <Stack.Screen 
                    name="NewChat" 
                    component={NewChatPage}
                    options={{ title: 'New Chat' }}
                />
                
                <Stack.Screen 
                    name="FriendsList" 
                    component={FriendsList}
                    options={{ title: 'Friends' }}
                />
                
                <Stack.Screen 
                    name="AddFriend" 
                    component={AddFriend}
                    options={{ title: 'Add Friend' }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;
