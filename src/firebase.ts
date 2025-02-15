// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBpBHh0oyZNuJa8NAskr8w0kxusSKJMGJA",
  authDomain: "genesis-7ba9c.firebaseapp.com",
  projectId: "genesis-7ba9c",
  storageBucket: "genesis-7ba9c.appspot.com",
  messagingSenderId: "942043259540",
  appId: "1:942043259540:web:1a1273eda2f5be3f494a81",
  measurementId: "G-E3XXCJH7WQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Authentication and Google Provider
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
