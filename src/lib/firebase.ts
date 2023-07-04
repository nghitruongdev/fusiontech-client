import { initializeApp } from "firebase/app";
import { getAuth, inMemoryPersistence } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyDMEylQD5zSyLBdBPEl0iIyuRxjuIK_RcE",
    authDomain: "fusiontech-vnco4.firebaseapp.com",
    projectId: "fusiontech-vnco4",
    storageBucket: "fusiontech-vnco4.appspot.com",
    messagingSenderId: "175572558295",
    appId: "1:175572558295:web:0d3af8e9c4433dee5bab92",
};

export const app = initializeApp(firebaseConfig, "CLIENT");

export const firebaseAuth = getAuth(app);
firebaseAuth.setPersistence(inMemoryPersistence);
firebaseAuth.useDeviceLanguage();
