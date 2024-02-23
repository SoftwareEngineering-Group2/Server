// Require the Firebase Admin SDK
const admin = require('firebase-admin');

// Initialize the app with a service account, granting admin privileges
admin.initializeApp({
  credential: admin.credential.cert(require('./firebase-adminsdk.json')),
  databaseURL: 'https://smart-home-7ba6c-default-rtdb.europe-west1.firebasedatabase.app' // replace with your Realtime Database URL
});

// Get a database reference
const db = admin.database();

// Function to update the white LED state
const updateWhiteLed = async (state) => {
  try {
    // Define the path to the white LED's state in the database
    // Assuming the LED is the first device in your database structure with id "1"
    const ref = db.ref('devices/0/deviceState');
    
    // Set the new state of the white LED
    await ref.set(state);
    console.log(`White LED state updated to: ${state}`);
  } catch (error) {
    console.error('Error updating the white LED state:', error);
    throw error; // Rethrow the error so it can be handled by the caller
  }
};

const updateYellowLed = async (state) => {
  try {
    // Define the path to the white LED's state in the database
    // Assuming the LED is the first device in your database structure with id "1"
    const ref = db.ref('devices/1/deviceState');
    
    // Set the new state of the white LED
    await ref.set(state);
    console.log(`yellow LED state updated to: ${state}`);
  } catch (error) {
    console.error('Error updating the yellow LED state:', error);
    throw error; // Rethrow the error so it can be handled by the caller
  }
};

module.exports = { updateWhiteLed, updateYellowLed };
