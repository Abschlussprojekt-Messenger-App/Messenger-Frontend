import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 40,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
        paddingBottom: 45,
    },
    buttonContainer: {
        flexDirection: 'column',
        width: '80%',        
    },
    button: {
        marginVertical: 5,
    }
});

export default styles;
