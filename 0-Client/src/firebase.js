// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// Your web app's Firebase configuration
import { getDatabase, ref, set } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyDlppyRO84GLZHVlOAoinc9YVgBFN4mY-A",
  authDomain: "monjoor-2025-ea947.firebaseapp.com",
  databaseURL: "https://monjoor-2025-ea947-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "monjoor-2025-ea947",
  storageBucket: "monjoor-2025-ea947.firebasestorage.app",
  messagingSenderId: "746846396198",
  appId: "1:746846396198:web:d30e32a74959755d7eebe7"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const realtimeDb = getDatabase(app);

console.log('here')
console.log(realtimeDb); // Print realtimeDb to the console

export { auth, realtimeDb }; 