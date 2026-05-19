// src/firebase.js
// ⚠️  INSTRUCCIONES DE CONFIGURACIÓN:
// 1. Ve a https://console.firebase.google.com
// 2. Crea un proyecto llamado "vortice-battles"
// 3. Activa Authentication > Google Sign-In
// 4. Activa Firestore Database
// 5. Crea una app web y copia tu config aquí
// 6. En Firestore Rules, aplica las reglas del archivo firestore.rules

import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

// 🔧 REEMPLAZA CON TU CONFIGURACIÓN DE FIREBASE
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "TU_API_KEY",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "TU_PROJECT.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "TU_PROJECT_ID",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "TU_PROJECT.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "TU_SENDER_ID",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "TU_APP_ID"
}

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const db = getFirestore(app)
export const googleProvider = new GoogleAuthProvider()

// Admin email — reemplaza con tu correo real
export const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL || 'admin@vortice.com'
