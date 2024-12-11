import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

export const firebaseConfig = {
    apiKey: "AIzaSyDShBudfMzebjChzrmRVjNubMwsAi_LG4Q",
    authDomain: "fetch-by-dersy.firebaseapp.com",
    projectId: "fetch-by-dersy",
    storageBucket: "fetch-by-dersy.appspot.com",
    messagingSenderId: "422033426571",
    appId: "1:422033426571:ios:b769c163c9b8eeb847ec8e",
  };

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const firestore = getFirestore(app);

  export { auth, firestore };
