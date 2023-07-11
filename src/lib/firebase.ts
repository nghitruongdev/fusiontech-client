import { FirestoreDatabase } from "@/providers/firestore-data-provider/FirestoreDatabase";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_APP_ID,
};

export const firebaseApp = initializeApp(firebaseConfig, "CLIENT");

export const firebaseAuth = getAuth(firebaseApp);
// export const storage = getStorage(app);
export const firestoreInstance = getFirestore(firebaseApp);
export const firestoreDatabase = new FirestoreDatabase(
    undefined,
    firestoreInstance,
);
export const firestoreProvider = firestoreDatabase.getDataProvider();
