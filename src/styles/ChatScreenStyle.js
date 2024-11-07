import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#e5ddd5',
    },
    messageList: {
        paddingBottom: 10,
        paddingHorizontal: 10,
    },
    userMessage: {
        alignSelf: 'flex-end',
        backgroundColor: '#dcf8c6',
        borderRadius: 15,
        padding: 10,
        marginVertical: 5,
        maxWidth: '80%',
    },
    otherMessage: {
        alignSelf: 'flex-start',
        backgroundColor: '#fff', 
        borderRadius: 15,
        padding: 10,
        marginVertical: 5,
        maxWidth: '80%',
    },
    messageText: {
        fontSize: 16,
        color: '#000', 
    },
    messageTime: {
        fontSize: 12,
        color: '#777',
        alignSelf: 'flex-end',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#ccc',
    },
    input: {
        flex: 1,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginRight: 10,
        backgroundColor: '#f0f0f0',
    },
    sendButton: {
        backgroundColor: '#007AFF',
        borderRadius: 20,
        padding: 10,
    },
    sendButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});

export default styles;
