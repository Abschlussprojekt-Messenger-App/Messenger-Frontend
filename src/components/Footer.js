import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import styles from '../styles/FooterStyle'; 

const Footer = ({ navigation }) => {
    return (
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
        </View>
    );
};

export default Footer;
