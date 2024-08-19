// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "politicsapp-ffb44.firebaseapp.com",
  projectId: "politicsapp-ffb44",
  storageBucket: "politicsapp-ffb44.appspot.com",
  messagingSenderId: "30503527990",
  appId: "1:30503527990:web:110f7d8d42e0513b52da97"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);