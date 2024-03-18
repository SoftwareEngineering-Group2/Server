const admin = require('firebase-admin');

admin.initializeApp({
  credential: admin.credential.cert(require('./firebase-adminsdk.json')),
  databaseURL: 'https://smart-home-7ba6c-default-rtdb.europe-west1.firebasedatabase.app'
});

const db = admin.database();

const getDeviceByName = async (deviceName) => {
  const ref = db.ref('devices');
  const snapshot = await ref.once('value');
  const devices = snapshot.val();
  const deviceEntry = Object.entries(devices).find(([, value]) => value.deviceName === deviceName);

  if (!deviceEntry) {
    throw new Error(`Device with name ${deviceName} not found.`);
  }

  const [id, deviceDetails] = deviceEntry;
  return { id, ...deviceDetails };
};

const getAllDevices = async () => {
  const ref = db.ref('devices');
  const snapshot = await ref.once('value');
  const devices = snapshot.val();

  const allDevices = Object.entries(devices).map(([id, device]) => ({
    id, // Include the device ID
    deviceName: device.deviceName,
    deviceState: device.deviceState
  }));
  return allDevices;
};



const updateDeviceState = async (deviceName, state) => {
  try {
    const device = await getDeviceByName(deviceName);
    const stateRef = db.ref(`devices/${device.id}/deviceState`);
    await stateRef.set(state);
    console.log(`${deviceName} state updated to: ${state}`);
  } catch (error) {
    console.error(`Error updating the ${deviceName} state:`, error);
    throw error;
  }
};

const readDeviceState = async (deviceName) => {
  try {
    const device = await getDeviceByName(deviceName);
    const stateRef = db.ref(`devices/${device.id}/deviceState`);
    const snapshot = await stateRef.once('value');
    const state = snapshot.val();
    console.log(`${deviceName} state is: ${state}`);
    return state;
  } catch (error) {
    console.error(`Error reading the ${deviceName} state:`, error);
    throw error;
  }
};

const readDeviceImage = async (deviceName) => {
  try {
    const device = await getDeviceByName(deviceName);
    const imageRef = db.ref(`devices/${device.id}/deviceIcon`);
    const snapshot = await imageRef.once('value');
    const imageUrl = snapshot.val();
    console.log(`${deviceName} imageUrl is: ${imageUrl}`);
    return imageUrl;
  } catch (error) {
    console.error(`Error reading the ${deviceName} image:`, error);
    throw error;
  }
};

const updateSpecificInformation = async (deviceName, rowToBeUpdated, newInformation) => {
  try {
    console.log(deviceName)
    const device = await getDeviceByName(deviceName);
    console.log(deviceName, device.id)
    const rowRef = db.ref(`devices/${device.id}/${rowToBeUpdated}`)
    await rowRef.set(newInformation);
    console.log(`${deviceName} updated ${rowToBeUpdated} to ${newInformation}`)
  } catch (error) {
    console.error(`Error updating the ${deviceName} ${rowToBeUpdated}:`, error);
    throw error;
  }
}


module.exports = { updateDeviceState, readDeviceState, readDeviceImage, getAllDevices, updateSpecificInformation};
