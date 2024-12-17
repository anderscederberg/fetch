import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

export const firebaseConfig = {
    apiKey: "AIzaSyDShBudfMzebjChzrmRVjNubMwsAi_LG4Q",
    authDomain: "fetch-by-dersy.firebaseapp.com",
    projectId: "fetch-by-dersy",
    storageBucket: "fetch-by-dersy.firebasestorage.app",
    messagingSenderId: "422033426571",
    appId: "1:422033426571:ios:b769c163c9b8eeb847ec8e",
  };

  const app = initializeApp(firebaseConfig);

  export const auth = getAuth(app);
  export const firestore = getFirestore(app);
  export const storage = getStorage(app);

