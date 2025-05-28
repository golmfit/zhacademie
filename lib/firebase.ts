// lib/firebase.ts
import { initializeApp, getApps, getApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage" // Add this import if not already there

const firebaseConfig = {
  apiKey: "AIzaSyB_fl8oWnZIbdwm9_l0NGlMflO4YiwrLrs",
  authDomain: "zhacademi-15b42.firebaseapp.com",
  projectId: "zhacademi-15b42",
  storageBucket: "zhacademi-15b42.firebasestorage.app", // Make sure this is correct
  messagingSenderId: "753477630767",
  appId: "1:753477630767:web:6850037747f7a699553fda",
  measurementId: "G-2YEHWJFGGP",
}

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp()
const auth = getAuth(app)
const db = getFirestore(app)
const storage = getStorage(app) // Add this line if not already there

export { app, auth, db, storage }
