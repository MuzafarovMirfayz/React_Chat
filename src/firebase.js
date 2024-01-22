import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

  const firebaseConfig = {
    apiKey: "AIzaSyDvaMYoSjwjkgz3sXmZbudQxX2XB3WSPbk",
    authDomain: "chat-432ff.firebaseapp.com",
    projectId: "chat-432ff",
    storageBucket: "chat-432ff.appspot.com",
    messagingSenderId: "325692135817",
    appId: "1:325692135817:web:7769134caa8d561928e958"
  };

export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore()
