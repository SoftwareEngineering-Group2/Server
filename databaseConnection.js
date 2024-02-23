const firebase = require('firebase/app');
require('firebase/auth');
require('firebase/database');

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBMbxHDxnmklkCuAVybMwdkIu1Xvd7s5zw",
  authDomain: "smart-home-7ba6c.firebaseapp.com",
  databaseURL: "https://smart-home-7ba6c-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "smart-home-7ba6c",
  storageBucket: "smart-home-7ba6c.appspot.com",
  messagingSenderId: "789831944832",
  appId: "1:789831944832:web:ebbc9835251ec3cc9af465",
  measurementId: "G-H8839RQRCM"
};

firebase.initializeApp(firebaseConfig);



// Function for handling log in
async function signInWithEmailAndPassword(email, password) {
    try {
        const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);
        return userCredential.user;
    } catch (error) {
        throw error;
    }
}


// Function to create a new user with email and password
async function createUserWithEmailAndPassword(email, password) {
    try {
      const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
      return userCredential.user;
    } catch (error) {
      throw error;
    }
  }


// Access Firebase Realtime Database
//const database = firebase.database();
//const ref = database.ref('path/to/your/data');

// Read data
/*ref.once('value', (snapshot) => {
  const data = snapshot.val();
  console.log(data);
});*/

module.exports = { signInWithEmailAndPassword, createUserWithEmailAndPassword }