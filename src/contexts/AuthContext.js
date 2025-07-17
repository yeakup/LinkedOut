import { createContext, useContext, useState, useEffect } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut,
  onAuthStateChanged 
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { useToast } from './ToastContext';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Get user profile from Firestore
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        if (userDoc.exists()) {
          setUser({
            id: firebaseUser.uid,
            ...userDoc.data()
          });
        } else {
          // User exists in Auth but not in Firestore
          setUser({
            id: firebaseUser.uid,
            email: firebaseUser.email,
            name: firebaseUser.displayName || 'Unknown User'
          });
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signUp = async ({ email, password, firstName, lastName, title, company, location }) => {
    try {
      const { user: firebaseUser } = await createUserWithEmailAndPassword(auth, email, password);
      
      // Create user profile in Firestore
      const userData = {
        email: firebaseUser.email,
        name: `${firstName} ${lastName}`,
        title: title || '',
        company: company || '',
        location: location || '',
        createdAt: new Date()
      };
      
      await setDoc(doc(db, 'users', firebaseUser.uid), userData);
      
      setUser({
        id: firebaseUser.uid,
        ...userData
      });
      
      showToast('Account created successfully! Welcome to LinkedOut.', 'success');
      return { user: firebaseUser };
    } catch (error) {
      showToast('Registration failed. Please try again.', 'error');
      throw error;
    }
  };

  const signIn = async ({ email, password }) => {
    try {
      const { user: firebaseUser } = await signInWithEmailAndPassword(auth, email, password);
      showToast('Welcome back! You\'re now signed in.', 'success');
      return { user: firebaseUser };
    } catch (error) {
      showToast('Sign in failed. Please check your credentials.', 'error');
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      setUser(null);
      showToast('You\'ve been signed out successfully.', 'info');
    } catch (error) {
      showToast('Sign out failed. Please try again.', 'error');
      throw error;
    }
  };

  const value = {
    user,
    loading,
    signUp,
    signIn,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};




