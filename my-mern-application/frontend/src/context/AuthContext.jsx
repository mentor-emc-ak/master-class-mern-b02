import { createContext, useContext, useState, useEffect } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from 'firebase/auth';
import { auth } from '../config/firebase';
import api from '../api/axios';

const AuthContext = createContext(null);

async function fetchMongoProfile() {
  const { data } = await api.get('/api/auth/me');
  return data;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [mongoUser, setMongoUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        try {
          const profile = await fetchMongoProfile();
          setMongoUser(profile);
        } catch {
          setMongoUser(null);
        }
      } else {
        setMongoUser(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const login = (email, password) => signInWithEmailAndPassword(auth, email, password);

  const register = async (name, email, password) => {
    const credential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(credential.user, { displayName: name });
    // Force token refresh so the backend receives the updated displayName
    await credential.user.getIdToken(true);
    const profile = await fetchMongoProfile();
    setMongoUser(profile);
    return credential.user;
  };

  const logout = async () => {
    setMongoUser(null);
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, mongoUser, login, register, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
