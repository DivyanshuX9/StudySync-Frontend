import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, onAuthStateChanged, signOut } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey:            process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain:        process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId:         process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket:     process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId:             process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId:     process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

// Check if Firebase config is complete
const isFirebaseConfigured = Object.values(firebaseConfig).every(val => val !== undefined && val !== '');

// Initialize Firebase
let app, auth, firestore, provider;

if (isFirebaseConfigured) {
  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    firestore = getFirestore(app);
    provider = new GoogleAuthProvider();
  } catch (error) {
    console.error('Firebase initialization error:', error);
    auth = null;
    firestore = null;
    provider = null;
  }
} else {
  console.warn('Firebase configuration incomplete. Using guest mode.');
  auth = null;
  firestore = null;
  provider = null;
}

// Fallback for onAuthStateChanged if Firebase is not initialized
const safeOnAuthStateChanged = (authInstance, callback) => {
  if (!authInstance) {
    // If Firebase not initialized, treat user as guest (null)
    callback(null);
    return () => {};
  }
  return onAuthStateChanged(authInstance, callback);
};

export { auth, firestore, isFirebaseConfigured, safeOnAuthStateChanged as onAuthStateChanged, provider, safeOnAuthStateChanged, signOut };

