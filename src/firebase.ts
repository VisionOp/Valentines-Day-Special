import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyA6RoEt8YubwgR90IYNkBBN-HEzg4SxA-w",
  authDomain: "valentine-37b1b.firebaseapp.com",
  projectId: "valentine-37b1b",
  databaseURL: "https://valentine-37b1b-default-rtdb.asia-southeast1.firebasedatabase.app",
  storageBucket: "valentine-37b1b.appspot.com",
  messagingSenderId: "342867043134",
  appId: "1:342867043134:web:f8dbb22f0d34c398cdc26f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Realtime Database
const db = getDatabase(app);

// Initialize Auth
const auth = getAuth(app);

export { db, auth };
export default app;