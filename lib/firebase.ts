import { initializeApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// Nantinya, masukkan nilai API keys Anda di sini
const firebaseConfig = {
  apiKey: "AIzaSyDJ0taKd9bt9HxhFAlX4Pfph2DDNTHq19w",
  authDomain: "gen-lang-client-0292015512.firebaseapp.com",
  projectId: "gen-lang-client-0292015512",
  storageBucket: "gen-lang-client-0292015512.firebasestorage.app",
  messagingSenderId: "350124280674",
  appId: "1:350124280674:web:e5e3a3cb0d47aef3aefa3b"
};

// Initialize Firebase only if it hasn't been initialized yet
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);

export default app;
