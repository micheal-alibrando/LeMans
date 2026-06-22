// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// Firebase Analytics non è supportato da React Native/Expo con il SDK Web standard

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBnWgUOYrbLhpaJzmo4Rub_gD-BHlOWNdU",
  authDomain: "lemans-6b146.firebaseapp.com",
  projectId: "lemans-6b146",
  storageBucket: "lemans-6b146.firebasestorage.app",
  messagingSenderId: "520780905624",
  appId: "1:520780905624:web:060dabc026ac04697c24ed",
  measurementId: "G-HCPEGCFFS2",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
