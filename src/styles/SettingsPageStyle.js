import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f2f2f2',
    },
    profileSection: {
        padding: 20,
        alignItems: 'flex-start', 
        backgroundColor: '#fff',
        marginBottom: 20,
    },
    username: {
        fontSize: 24, 
        fontWeight: 'bold',
        textAlign: 'left', 
        color: '#333',
    },
    option: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    optionText: {
        fontSize: 16,
    },
});

export default styles;
