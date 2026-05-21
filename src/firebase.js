
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAL12iHy5m3sTlsOxH3klp0fn4kH2QxW_s",
  authDomain: "college-cf0d2.firebaseapp.com",
  projectId: "college-cf0d2",
  storageBucket: "college-cf0d2.firebasestorage.app",
  messagingSenderId: "593486819564",
  appId: "1:593486819564:web:5bdeef58f7c958ef4875c9"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const provider = new GoogleAuthProvider();
provider.setCustomParameters({ prompt: 'select_account' });

export const loginWithGoogle = async () => {
  const result = await signInWithPopup(auth, provider);
  return result;
};

export const logout = () => signOut(auth);
