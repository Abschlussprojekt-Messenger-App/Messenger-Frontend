import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 10,
        backgroundColor: '#fff',
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
    },
    footerItem: {
        alignItems: 'center',
    },
    footerText: {
        fontSize: 12,
    },
});

export default styles;
