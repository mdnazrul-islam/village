import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAOwQgpC4ebDiRpogM3AJMJBmjshS8DzNA",
  authDomain: "nazrul-islam1.firebaseapp.com",
  databaseURL: "https://nazrul-islam1-default-rtdb.firebaseio.com",
  projectId: "nazrul-islam1",
  storageBucket: "nazrul-islam1.appspot.com",
  messagingSenderId: "84306575668",
  appId: "1:84306575668:web:a35617eda51ec990932561"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);
export const storage = getStorage(app);
