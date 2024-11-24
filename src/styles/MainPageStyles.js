import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        width: 350, 
        height: 175, 
        marginBottom: 20, 
    },
    buttonContainer: {
        flexDirection: 'column',
        width: '80%',
    },
    button: {
        marginVertical: 5,
    },
});

export default styles;
