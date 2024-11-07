import React, { useState } from 'react';
import { View, Text, Button, TextInput, TouchableOpacity } from 'react-native';
import { signUp, confirmSignUp } from '../services/authService'; 
import styles from '../styles/SignUpPageStyle.js';

/**
 * SignUpPage-Komponente
 * @param {Object} props - Eigenschaften der Komponente.
 * @param {Object} props.navigation - Navigationseigenschaft zur Navigation zwischen Screens.
 * @returns {JSX.Element} - Eine Komponente für die Benutzerregistrierung und -bestätigung.
 */
const SignUpPage = ({ navigation }) => {
  const [email, setEmail] = useState(''); 
  const [password, setPassword] = useState(''); 
  const [confirmPassword, setConfirmPassword] = useState(''); 
  const [displayName, setDisplayName] = useState(''); 
  const [error, setError] = useState(''); 
  const [confirmationCode, setConfirmationCode] = useState(''); 
  const [isConfirming, setIsConfirming] = useState(false);
  const [showPassword, setShowPassword] = useState(false); 
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); 

  /**
   * Funktion zur Handhabung der Registrierung
   * Überprüft, ob die Passwörter übereinstimmen, und führt dann den Registrierungsprozess aus.
   */
  const handleSignUp = async () => {
    if (password !== confirmPassword) {
      setError('Die Passwörter stimmen nicht überein.'); 
      return;
    }
    try {
      await signUp(email, password, displayName); 
      setIsConfirming(true); 
      setError('');
    } catch (error) {
      console.error('Fehler bei der Registrierung:', error); 
      setError('Registrierung fehlgeschlagen: ' + error.message); 
    }
  };

  /**
   * Funktion zur Handhabung der Bestätigung mit dem Bestätigungscode
   * Navigiert zum Login-Bildschirm bei erfolgreicher Bestätigung.
   */
  const handleConfirmSignUp = async () => {
    try {
      await confirmSignUp(email, confirmationCode); 
      navigation.navigate('Login'); 
    } catch (error) {
      console.error('Fehler bei der Bestätigung:', error); 
      setError('Bestätigung fehlgeschlagen: ' + error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{isConfirming ? 'Bestätigung' : 'Registrierung'}</Text>
      
      {error ? <Text style={styles.error}>{error}</Text> : null}
      
      {!isConfirming ? (
        <>
          <TextInput
            style={styles.input}
            placeholder="E-Mail"
            value={email}
            onChangeText={setEmail}
          />
          
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Passwort"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword} 
            />
            <View style={styles.eyeContainer}>
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Text>{showPassword ? '👁️‍🗨️' : '👁️‍🗨️'}</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Passwort bestätigen"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showConfirmPassword}
            />
            <View style={styles.eyeContainer}>
              <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                <Text>{showConfirmPassword ? '👁️‍🗨️' : '👁️‍🗨️'}</Text>
              </TouchableOpacity>
            </View>
          </View>

          <TextInput
            style={styles.input}
            placeholder="Anzeigename"
            value={displayName}
            onChangeText={setDisplayName}
          />
          <Button title="Registrieren" onPress={handleSignUp} />
        </>
      ) : (
        <>
          <TextInput
            style={styles.input}
            placeholder="Bestätigungscode"
            value={confirmationCode}
            onChangeText={setConfirmationCode}
          />
          <Button title="Bestätigen" onPress={handleConfirmSignUp} />
        </>
      )}
    </View>
  );
};

export default SignUpPage;
