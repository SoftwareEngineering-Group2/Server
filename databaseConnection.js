// databaseOperations.js
const admin = require('firebase-admin');
const deviceConfig = require('./deviceConfig');

admin.initializeApp({
  credential: admin.credential.cert(require('./firebase-adminsdk.json')),
  databaseURL: 'https://smart-home-7ba6c-default-rtdb.europe-west1.firebasedatabase.app'
});

const db = admin.database();

const updateDeviceState = async (deviceType, state) => {
  try {
    const ref = db.ref(deviceConfig[deviceType].stateRef);
    await ref.set(state);
    console.log(`${deviceType} state updated to: ${state}`);
  } catch (error) {
    console.error(`Error updating the ${deviceType} state:`, error);
    throw error;
  }
};

const readDeviceState = async (deviceType) => {
  try {
    const ref = db.ref(deviceConfig[deviceType].stateRef);
    const snapshot = await ref.once('value');
    const state = snapshot.val();
    console.log(`${deviceType} state is: ${state}`);
    return state;
  } catch (error) {
    console.error(`Error reading the ${deviceType} state:`, error);
    throw error;
  }
};

const readDeviceImage = async (deviceType) => {
  try {
    const ref = db.ref(deviceConfig[deviceType].imageRef);
    const snapshot = await ref.once('value');
    const imageUrl = snapshot.val();
    console.log(`${deviceType} imageUrl is: ${imageUrl}`);
    return imageUrl;
  } catch (error) {
    console.error(`Error reading the ${deviceType} image:`, error);
    throw error;
  }
};

module.exports = { updateDeviceState, readDeviceState, readDeviceImage };
