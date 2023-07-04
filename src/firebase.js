// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyA6CCcEiPUgBxbrM9hGeIJ6dO74EqVGOF0",
    authDomain: "reacttutorial-654fe.firebaseapp.com",
    projectId: "reacttutorial-654fe",
    storageBucket: "reacttutorial-654fe.appspot.com",
    messagingSenderId: "982376386214",
    appId: "1:982376386214:web:809d851c1f873fcb212e67",
    measurementId: "G-0GX4S15GM8",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth();
export const firestore = getFirestore(app);
export const storage = getStorage(app);
