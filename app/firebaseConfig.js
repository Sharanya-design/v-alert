// firebaseConfig.js
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAFA7cjiqTU6AW2brUbImsqHsQj-HZeT-s", // your real key
  authDomain: "valert-3fe65.firebaseapp.com",
  projectId: "valert-3fe65",
  storageBucket: "valert-3fe65.appspot.com",
  messagingSenderId: "70506620732",
  appId: "1:70506620732:web:c4143c8731b815b3e42039",
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;