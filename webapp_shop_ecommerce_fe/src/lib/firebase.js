// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from 'firebase/storage'

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCC_if9q0jKsiV5ftMiaWOoEuKWzYXyQGM",
  authDomain: "webapp-ecomerce.firebaseapp.com",
  projectId: "webapp-ecomerce",
  storageBucket: "webapp-ecomerce.appspot.com",
  messagingSenderId: "849962700477",
  appId: "1:849962700477:web:155f59af022b1d95beb1d4",
  measurementId: "G-CQSBYD38HE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const storage = getStorage(app)