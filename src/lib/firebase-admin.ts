"server-only";

import { applicationDefault } from "firebase-admin/app";

import admin from "firebase-admin";

try {
    admin.initializeApp({
        credential: applicationDefault(),
    });
    console.log("Initialized.");
} catch (err) {
    const error = err as Error;
    /*
     * We skip the "already exists" message which is
     * not an actual error when we're hot-reloading.
     */
    if (!/already exists/u.test(error.message)) {
        console.error("Firebase admin initialization error", error.stack);
    }
}

export default admin;
