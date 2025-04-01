// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, signOut, onAuthStateChanged, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBIEhATIpM5o0BScRc270g-EGjAHOvzKuA",
  authDomain: "studysync-7965f.firebaseapp.com",
  projectId: "studysync-7965f",
  storageBucket: "studysync-7965f.firebasestorage.app",
  messagingSenderId: "502208866499",
  appId: "1:502208866499:web:40ed7ed5709307f54bda76",
  measurementId: "G-ZS7D3QKBTG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);
const provider = new GoogleAuthProvider();

export { auth, firestore, provider, signOut, onAuthStateChanged };

