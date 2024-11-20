import { StyleSheet, Dimensions } from 'react-native';  // Achte auf den Import

// Holen der Bildschirmbreite
const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f2f2f2',
        paddingBottom: 100, // Platz für den Footer
    },
    searchInput: {
        flex: 1,
        height: 40,
        backgroundColor: '#fff',
        borderRadius: 20,
        paddingHorizontal: 15,
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#ccc',
        width: width * 0.9,  // Verwendung der Bildschirmbreite
        alignSelf: 'center',
    },
    userItem: {
        padding: 15,
        marginVertical: 5,
        backgroundColor: '#fff',
        borderRadius: 8,
        borderColor: '#ddd',
        borderWidth: 1,
    },
    selectedUserItem: {
        backgroundColor: '#dcdcdc',
    },
    buttonContainer: {
        padding: 20,
        alignItems: 'center',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 10,
        backgroundColor: '#fff',
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1,  // Fügt Z-Index hinzu, damit der Footer korrekt angezeigt wird
    },
    footerItem: {
        alignItems: 'center',
    },
    footerText: {
        fontSize: 12,
    },
});

export default styles;
