// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCFoak47jdE8nON74UgyILVZh2B11WXrC4",
  authDomain: "redcross-kiosk.firebaseapp.com",
  projectId: "redcross-kiosk",
  storageBucket: "redcross-kiosk.firebasestorage.app",
  messagingSenderId: "247408374376",
  appId: "1:247408374376:web:4292171a040ca582fa81dd",
  measurementId: "G-LV8C6ZGDF5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);