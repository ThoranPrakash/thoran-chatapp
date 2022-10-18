// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDNKCtMJo92-hnNCoZq6FLgDZZj9_cwl2w",
  authDomain: "chatapp-stp22.firebaseapp.com",
  projectId: "chatapp-stp22",
  storageBucket: "chatapp-stp22.appspot.com",
  messagingSenderId: "196489830932",
  appId: "1:196489830932:web:052e9fbb806d6294e23d01"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore();