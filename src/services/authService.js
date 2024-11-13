import { Auth } from 'aws-amplify';


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


export const confirmSignUp = async (email, confirmationCode) => {
  try {
    await Auth.confirmSignUp(email, confirmationCode); 
  } catch (error) {
    console.error('Fehler bei der Bestätigung:', error);
    throw error; 
  }
};


export const signOut = async () => {
  try {
    await Auth.signOut(); 
    console.log("Erfolgreich abgemeldet");
  } catch (error) {
    console.error('Fehler beim Abmelden:', error);
    throw error; 
  }
};
