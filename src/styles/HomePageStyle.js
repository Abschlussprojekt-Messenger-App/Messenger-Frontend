import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window'); // Dynamische Breite und Höhe

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2', // Helles Hintergrund, das gut mit anderen Screens harmoniert
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // Etwas Platz zwischen den Elementen (z.B. Titel und Icon)
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: '#ffffff', // Weiß für die Kopfzeile
    elevation: 2, // Schatten für den Header
    borderBottomWidth: 1,
    borderBottomColor: '#ddd', // Hellerer Border für den Header
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
    width: width * 0.85, // Etwas schmaler, damit es optisch besser zum Layout passt
    alignSelf: 'center', // Zentrieren des Inputs im Header
  },
  chatRoomItem: {
    backgroundColor: '#fff',
    marginVertical: 10,
    marginHorizontal: 20,
    padding: 15,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3, // Leichter Schatten für die Chat-Elemente
  },
  chatRoomName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333', // Dunklere Farbe für den Benutzernamen
  },
  chatRoomDate: {
    fontSize: 14,
    color: '#888', // Hellerer Text für das Erstellungsdatum
    marginTop: 5,
  },
  emptyListText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#888',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    paddingVertical: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
});

export default styles;
