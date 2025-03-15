import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyA2rDRL1vjjzWZdQt56xlO4BK0L1plNUTg",
  authDomain: "openroom-a5af6.firebaseapp.com",
  projectId: "openroom-a5af6",
  storageBucket: "openroom-a5af6.firebasestorage.app",
  messagingSenderId: "1082941864962",
  appId: "1:1082941864962:web:993c06ee6a8232731cbb1b",
  measurementId: "G-HC6S2NQJRB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

export { db }

