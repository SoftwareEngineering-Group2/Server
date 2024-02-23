const admin = require('firebase-admin');

// Initialize Firebase Admin with service account
const serviceAccount = require('./firebase-adminsdk.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// Function to create a new user
async function createUserWithEmailAndPassword(email, password) {
  try {
    const userRecord = await admin.auth().createUser({
      email: email,
      password: password,
    });
    console.log('Successfully created new user:', userRecord.uid);
    return userRecord;
  } catch (error) {
    console.error('Error creating new user:', error);
    throw error; // Rethrow the error so it can be caught by the calling function
  }
}

module.exports = { createUserWithEmailAndPassword };
