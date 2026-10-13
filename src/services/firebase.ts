import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app'
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  type Auth,
  type User,
} from 'firebase/auth'

const cleanEnv = (val?: string): string => {
  if (!val) return ''
  return val.trim().replace(/^["']|["']$/g, '').trim()
}

// Official Firebase web configuration for Kietfolio
const firebaseConfig = {
  apiKey: cleanEnv(import.meta.env.VITE_FIREBASE_API_KEY) || 'AIzaSyAa3EAMNqInR8dUigbpLxrNzf5j2Ae1JD4',
  authDomain: cleanEnv(import.meta.env.VITE_FIREBASE_AUTH_DOMAIN) || 'kietfolio-75531.firebaseapp.com',
  projectId: cleanEnv(import.meta.env.VITE_FIREBASE_PROJECT_ID) || 'kietfolio-75531',
  storageBucket: cleanEnv(import.meta.env.VITE_FIREBASE_STORAGE_BUCKET) || 'kietfolio-75531.firebasestorage.app',
  messagingSenderId: cleanEnv(import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID) || '457896302361',
  appId: cleanEnv(import.meta.env.VITE_FIREBASE_APP_ID) || '1:457896302361:web:37228694a461190d581788',
  measurementId: 'G-53Q5JZHW12',
}

export const isFirebaseConfigured = (): boolean => {
  const key = firebaseConfig.apiKey
  return Boolean(
    key &&
      key.startsWith('AIza') &&
      key.length >= 25 &&
      firebaseConfig.authDomain &&
      firebaseConfig.projectId
  )
}

let app: FirebaseApp | null = null
let auth: Auth | null = null
let googleProvider: GoogleAuthProvider | null = null

if (isFirebaseConfigured()) {
  try {
    app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig)
    auth = getAuth(app)
    googleProvider = new GoogleAuthProvider()
    googleProvider.setCustomParameters({
      prompt: 'select_account',
    })
  } catch (err) {
    console.warn('Firebase initialization failed:', err)
  }
}

export {
  app,
  auth,
  googleProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  firebaseSignOut,
  onAuthStateChanged,
}
export type { User }

