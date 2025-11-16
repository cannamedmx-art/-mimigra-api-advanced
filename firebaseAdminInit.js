import admin from "firebase-admin";

import serviceAccount from "./mimigraai-firebase-adminsdk.json" assert { type: "json" };

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export const db = admin.firestore();
