import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { getFirestore, doc, setDoc, getDoc, collection, onSnapshot, query, orderBy } from 'firebase/firestore'

// REEMPLAZA CON TU CONFIGURACIÓN DE FIREBASE
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

// Admin email – reemplaza con tu correo real
export const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL || 'admin@vortice.com'

// Función para iniciar sesión con Google Popup
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    await createUserProfile(result.user);
    return result;
  } catch (error) {
    console.error("Error al iniciar sesión con Google:", error);
    throw error;
  }
};

// Función para crear o actualizar el perfil del usuario en Firestore
export const createUserProfile = async (user, additionalData = {}) => {
  if (!user) return;

  const userRef = doc(db, 'users', user.uid);
  const snapshot = await getDoc(userRef);

  if (!snapshot.exists()) {
    const { displayName, email, photoURL } = user;
    const createdAt = new Date();

    try {
      await setDoc(userRef, {
        displayName,
        email,
        photoURL,
        createdAt,
        role: email === ADMIN_EMAIL ? 'admin' : 'user',
        ...additionalData
      });
    } catch (error) {
      console.error('Error creando el perfil de usuario:', error);
    }
  }

  return userRef;
};

// Función para obtener el perfil del usuario de Firestore
export const getUserProfile = async (uid) => {
  if (!uid) return null;
  try {
    const docRef = doc(db, 'users', uid);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
  } catch (error) {
    console.error('Error obteniendo el perfil de usuario:', error);
    return null;
  }
};

// Función para suscribirse a los Reels (Muro oficial) en tiempo real
export const subscribeToReels = (callback) => {
  try {
    const q = query(collection(db, 'reels'), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snapshot) => {
      const reels = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      callback(reels);
    }, (error) => {
      console.error("Error en tiempo real con Reels:", error);
    });
  } catch (error) {
    console.error("Error al suscribirse a reels:", error);
  }
};

// NUEVA: Función para suscribirse a la tabla de posiciones (Ranking) en tiempo real
export const subscribeToRanking = (callback) => {
  try {
    // Ordena a los competidores por puntos de mayor a menor
    const q = query(collection(db, 'ranking'), orderBy('points', 'desc'));
    return onSnapshot(q, (snapshot) => {
      const ranking = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      callback(ranking);
    }, (error) => {
      console.error("Error en tiempo real con el Ranking:", error);
    });
  } catch (error) {
    console.error("Error al suscribirse al ranking:", error);
  }
};
