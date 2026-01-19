// firebaseConfig.js
import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your config from Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAF7cq1jTU6AW2brUbfImsqHsQJ-HZeT-s",
  authDomain: "valert-3fe65.firebaseapp.com",
  projectId: "valert-3fe65",
  storageBucket: "valert-3fe65.appspot.com",
  messagingSenderId: "7056062732",
  appId: "1:7056062732:web:c4136c8731b315b3e42039"
};

// initialize app once
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig); // <-- FIXED spelling!!
} else {
  app = getApp();
}

// export services to use in screens
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;