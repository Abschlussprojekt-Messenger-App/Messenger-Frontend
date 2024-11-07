import { Auth } from 'aws-amplify';

/**
 * Registriert einen neuen Benutzer.
 *
 * @param {string} email - Die E-Mail-Adresse des Benutzers.
 * @param {string} password - Das Passwort des Benutzers.
 * @param {string} displayName - Der Anzeigename des Benutzers.
 * @returns {Promise} - Ein Promise, das den Registrierungsstatus oder einen Fehler zurückgibt.
 * @param {string} username: email, // Der Benutzername ist die E-Mail-Adresse
 * @param {string} name: displayName, // Der Anzeigename des Benutzers
 */
export const signUp = async (email, password, displayName) => {
  try {
    const { user } = await Auth.signUp({
      username: email,
      password,
      attributes: {
        email,
        name: displayName,
      },
    });
    return user;
  } catch (error) {
    console.error('Fehler bei der Registrierung:', error);
    throw error;
  }
};

/**
 * Bestätigt die Registrierung des Benutzers mit dem Bestätigungscode.
 *
 * @param {string} email - Die E-Mail-Adresse des Benutzers.
 * @param {string} confirmationCode - Der Bestätigungscode.
 * @returns {Promise} - Ein Promise, das den Bestätigungserfolg oder einen Fehler zurückgibt.
 */
export const confirmSignUp = async (email, confirmationCode) => {
  try {
    await Auth.confirmSignUp(email, confirmationCode); 
  } catch (error) {
    console.error('Fehler bei der Bestätigung:', error);
    throw error; 
  }
};

/**
 * Meldet den aktuellen Benutzer ab.
 *
 * @returns {Promise} - Ein Promise, das den Abmeldestatus oder einen Fehler zurückgibt.
 */
export const signOut = async () => {
  try {
    await Auth.signOut(); 
    console.log("Erfolgreich abgemeldet");
  } catch (error) {
    console.error('Fehler beim Abmelden:', error);
    throw error; 
  }
};
