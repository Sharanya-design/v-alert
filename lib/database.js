// database.js
import { getFirestore } from "firebase/firestore";
import { app } from "../app/firebaseConfig";

export const db = getFirestore(app);