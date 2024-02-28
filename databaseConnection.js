// Require the Firebase Admin SDK
const admin = require('firebase-admin');

// Initialize the app with a service account, granting admin privileges
admin.initializeApp({
  credential: admin.credential.cert(require('./firebase-adminsdk.json')),
  databaseURL: 'https://smart-home-7ba6c-default-rtdb.europe-west1.firebasedatabase.app' // replace with your Realtime Database URL
});

// Get a database reference
const db = admin.database();

// Strings for database refences
const whiteLedDeviceState = "devices/0/deviceState";
const yellowLedDeviceState = "devices/1/deviceState"

const updateWhiteLed = async (state) => {
  try {
    const ref = db.ref(whiteLedDeviceState);
    await ref.set(state);
    console.log(`White LED state updated to: ${state}`);
  } catch (error) {
    console.error('Error updating the white LED state:', error);
    throw error; // Rethrow the error so it can be handled by the caller
  }
};

const readWhiteLedState = async () => {
  try {
    const ref = db.ref(whiteLedDeviceState);
    const snapshot = await ref.once('value'); // Use once('value') to read the data at the path
    const state = snapshot.val(); // Extracting the state value from the snapshot
    console.log(`White LED state is: ${state}`);
    return state; // Return the state
  } catch (error) {
    console.error('Error reading the white LED state:', error);
    throw error; // Rethrow the error so it can be handled by the caller
  }
};

const updateYellowLed = async (state) => {
  try {
    const ref = db.ref(yellowLedDeviceState);
    await ref.set(state);
    console.log(`yellow LED state updated to: ${state}`);
  } catch (error) {
    console.error('Error updating the yellow LED state:', error);
    throw error; // Rethrow the error so it can be handled by the caller
  }
};

const readYellowLedState = async () => {
  try {
    const ref = db.ref(yellowLedDeviceState);
    const snapshot = await ref.once('value'); // Use once('value') to read the data at the path
    const state = snapshot.val(); // Extracting the state value from the snapshot
    console.log(`White LED state is: ${state}`);
    return state; // Return the state
  } catch (error) {
    console.error('Error reading the white LED state:', error);
    throw error; // Rethrow the error so it can be handled by the caller
  }
};

module.exports = { updateWhiteLed, readWhiteLedState, updateYellowLed, readYellowLedState };
