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

const getAllDevicesTest = async(uid) => {
  // First, get the user's authorization level
  const userRef = db.ref('members');
  const userSnapshot = await userRef.once('value');
  const users = userSnapshot.val();

  // Find the user with the matching uid and get their authorization level
  let userAuthLevel = null;
  for (const key in users) {
    if (users[key].uid === uid) {
      userAuthLevel = users[key].authorizationLevel;
      break; // Stop the loop once we find the user
    }
  }
  // Then, filter devices based on this authorization level
  const devicesRef = db.ref('devices');
  const devicesSnapshot = await devicesRef.once('value');
  const devices = devicesSnapshot.val();
  const authorizedDevices = Object.entries(devices)
    .filter(([id, device]) => device.deviceAuthorizationLevel <= userAuthLevel)
    .map(([id, device]) => ({
      id, // The device ID
      deviceName: device.deviceName,
      deviceState: device.deviceState
    }));

  return authorizedDevices;
}

const updateUserNames = async (uid, firstName, lastName) => {
  try {
    const usersRef = db.ref('members');
    const snapshot = await usersRef.once('value');
    const users = snapshot.val();
    let userExists = false;
    let userKey;

    // Search for the user with the matching UID
    for (const key in users) {
      if (users[key].uid === uid) {
        userExists = true;
        userKey = key;
        break;
      }
    }

    if (userExists) {
      // Update the first and last name of the specific user
      await usersRef.child(userKey).update({ firstName, lastName });
      console.log(`User names updated for UID: ${uid} - First Name: ${firstName}, Last Name: ${lastName}`);
    } else {
      // Create a new user with the provided UID and names
      const newUserRef = usersRef.push(); // This creates a new user entry with a unique key
      await newUserRef.set({
        uid,
        firstName,
        lastName,
        authorizationLevel: 'Adult'
      });
      console.log(`New user created with UID: ${uid} - First Name: ${firstName}, Last Name: ${lastName}`);
    }
  } catch (error) {
    console.error('Error updating user names:', error);
    throw error;
  }
}


const getUserNamesByUid = async (uid) => {
  try {
    const usersRef = db.ref('members');
    const snapshot = await usersRef.once('value');
    const users = snapshot.val();
    let userNames = null;

    // Iterate over the users to find the one with the matching UID
    for (const key in users) {
      if (users.hasOwnProperty(key) && users[key].uid === uid) {
        userNames = {
          firstName: users[key].firstName,
          lastName: users[key].lastName
        };
        break;
      }
    }

    if (!userNames) {
      throw new Error(`User with UID: ${uid} not found.`);
    }

    console.log(`User found - First Name: ${userNames.firstName}, Last Name: ${userNames.lastName}`);
    return userNames;
  } catch (error) {
    console.error('Error getting user names:', error);
    throw error;
  }
}

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


module.exports = { updateDeviceState, readDeviceState, readDeviceImage, getAllDevices, updateSpecificInformation, updateUserNames, getUserNamesByUid, getAllDevicesTest};
