// Firebase SDK imports
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getAnalytics } from "firebase/analytics"

// Firebase project configuration pulled from environment variables
// Never hard-code these values — use .env file
const firebaseConfig = {
  apiKey: "AIzaSyD180AmG4uZ7JIbWTV9v6IHIB0q0gWpvhY",
  authDomain: "care-hub-2cede.firebaseapp.com",
  projectId: "care-hub-2cede",
  storageBucket: "care-hub-2cede.firebasestorage.app",
  messagingSenderId: "209524679298",
  appId: "1:209524679298:web:9d50419fccb45354020a9b",
  measurementId: "G-HHQWRSS9T7"
};

// Initialize the Firebase app (singleton pattern — safe to import anywhere)
const app = initializeApp(firebaseConfig)
const analytics = getAnalytics(app)

// Export auth and Firestore instances for use throughout the app
export const auth = getAuth(app)
export const db   = getFirestore(app)

export default app