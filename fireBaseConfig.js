import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import Constants from "expo-constants";

const firebaseConfig = {
  apiKey: Constants.manifest.extra.FIREBASE_API_KEY,
  authDomain: Constants.manifest.extra.FIREBASE_AUTH_DOMAIN,
  projectId: Constants.manifest.extra.FIREBASE_PROJECT_ID,
  storageBucket: Constants.manifest.extra.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: Constants.manifest.extra.FIREBASE_MESSAGING_SENDER_ID,
  appId: Constants.manifest.extra.FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const firestore = getFirestore(app);
