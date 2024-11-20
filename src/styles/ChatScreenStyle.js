import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window'); // Bildschirmbreite für responsive Elemente

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(242, 242, 242, 0.8)', // Transparente graue Hintergrundfarbe
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007AFF', // Header Hintergrund
    paddingHorizontal: 15,
    paddingVertical: 10,
    elevation: 5,
  },
  backButton: {
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
  },
  messageList: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 10,
    borderRadius: 15,
    marginVertical: 5,
  },
  myMessageBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#A0D5FF', // Helles Blau/Türkis für den aktuellen Benutzer
  },
  theirMessageBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#E6F5D0', // Sehr helles Graugrün für den anderen Benutzer
  },
  messageText: {
    fontSize: 14,
  },
  myMessageText: {
    color: '#FFFFFF', // Weiß für den Text des aktuellen Benutzers
  },
  theirMessageText: {
    color: '#4A4A4A', // Dunkles Grau für den Text des anderen Benutzers
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  input: {
    flex: 1,
    height: 40,
    paddingHorizontal: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#f9f9f9',
  },
  sendButton: {
    marginLeft: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: -1,
    opacity: 0.5, // Leichte Transparenz für den Hintergrund
  },
});

export default styles;
