// Real Firebase integration - Use this when you have Firebase SDK installed
// To use: Replace the import in App.tsx from './services/firebase' to './services/firebase-real'

import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  User as FirebaseUser,
  getAdditionalUserInfo
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc,
  collection,
  getDocs,
  query,
  orderBy,
  deleteDoc
} from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyAPZ3dZdaD1W1KO-_YSkqoIUAFj_vffV1Q",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "pythonapp-59423.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "pythonapp-59423",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "pythonapp-59423.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "319551482195",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:319551482195:web:b2661bd8dceef843be59a6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const firestore = getFirestore(app);

// Firebase initialized successfully

// User interface
export interface User {
  uid: string;
  email: string;
  displayName: string;
  createdAt?: string;
  role?: 'user' | 'admin';
}

// Progress interface
export interface UserProgress {
  xp: number;
  streak: number;
  level: number;
  completedExercises: string[];
  completedProjects: string[];
  lastLoginDate: string;
  submittedResponses: { [exerciseId: string]: { code: string; output: string; submittedAt: string } };
}

// Default progress for new users
export const defaultProgress: UserProgress = {
  xp: 0,
  streak: 1,
  level: 1,
  completedExercises: [],
  completedProjects: [],
  lastLoginDate: new Date().toDateString(),
  submittedResponses: {}
};

// Helper functions
export const calculateLevel = (xp: number): number => {
  return Math.floor(xp / 100) + 1;
};

export const getXpForNextLevel = (level: number): number => {
  return level * 100;
};

// Authentication functions
export const signUp = async (email: string, password: string, displayName: string): Promise<User> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Update the user's display name
    await updateProfile(user, { displayName });
    
    const userData: User = {
      uid: user.uid,
      email: user.email!,
      displayName: displayName,
      createdAt: new Date().toISOString()
    };
    
    // Create user profile in Firestore
    await setDoc(doc(firestore, 'users', user.uid), userData);
    
    return userData;
  } catch (error) {
    throw error;
  }
};

export const signIn = async (email: string, password: string): Promise<User> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    const userData: User = {
      uid: user.uid,
      email: user.email!,
      displayName: user.displayName || user.email!.split('@')[0],
      createdAt: user.metadata.creationTime
    };
    
    return userData;
  } catch (error) {
    throw error;
  }
};

export const signOutUser = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error) {
    throw error;
  }
};

// Firestore functions
export const saveUserProgress = async (userId: string, progress: UserProgress): Promise<void> => {
  try {
    await setDoc(doc(firestore, 'userProgress', userId), progress);
  } catch (error) {
    throw error;
  }
};

export const getUserProgress = async (userId: string): Promise<UserProgress | null> => {
  try {
    const docRef = doc(firestore, 'userProgress', userId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data() as UserProgress;
    } else {
      return null;
    }
  } catch (error) {
    throw error;
  }
};

export const createUserProfile = async (user: User): Promise<void> => {
  try {
    await setDoc(doc(firestore, 'users', user.uid), user);
  } catch (error) {
    throw error;
  }
};

// Auth state listener
export const onAuthStateChangedListener = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
    if (firebaseUser) {
      // Fetch user data from Firestore to get role information
      try {
        const userDoc = await getDoc(doc(firestore, 'users', firebaseUser.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data() as User;
          callback(userData);
        } else {
          // Fallback for users without Firestore data
          const user: User = {
            uid: firebaseUser.uid,
            email: firebaseUser.email!,
            displayName: firebaseUser.displayName || firebaseUser.email!.split('@')[0],
            createdAt: firebaseUser.metadata.creationTime,
            role: 'user'
          };
          callback(user);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        // Fallback for users without Firestore data
        const user: User = {
          uid: firebaseUser.uid,
          email: firebaseUser.email!,
          displayName: firebaseUser.displayName || firebaseUser.email!.split('@')[0],
          createdAt: firebaseUser.metadata.creationTime,
          role: 'user'
        };
        callback(user);
      }
    } else {
      callback(null);
    }
  });
};

// Admin functions
export const getAllUsers = async (): Promise<User[]> => {
  try {
    const usersRef = collection(firestore, 'users');
    const snapshot = await getDocs(usersRef);
    
    const users: User[] = [];
    const deletedUserIds: string[] = [];
    
    // Check each user document and verify they still exist in Firebase Auth
    for (const docSnapshot of snapshot.docs) {
      const userData = docSnapshot.data() as User;
      const userId = docSnapshot.id;
      
      
      try {
        // Try to get the user from Firestore to see if they still exist
        // If the user was deleted from Auth, their Firestore data might still exist
        const userDoc = await getDoc(doc(firestore, 'users', userId));
        
        if (userDoc.exists()) {
          // Check if this looks like a valid user (has required fields)
          if (userData.email && userData.displayName) {
            users.push({ ...userData, uid: userId });
          } else {
            // Invalid user data, mark for cleanup
            deletedUserIds.push(userId);
          }
        } else {
          // User document doesn't exist, mark for cleanup
          deletedUserIds.push(userId);
        }
      } catch (error) {
        // If there's an error accessing the user, mark for cleanup
        console.warn(`Error accessing user ${userId}:`, error);
        deletedUserIds.push(userId);
      }
    }
    
    
    // Clean up deleted users' data
    for (const userId of deletedUserIds) {
      try {
        // Delete user document
        await deleteDoc(doc(firestore, 'users', userId));
        // Delete user progress document
        await deleteDoc(doc(firestore, 'userProgress', userId));
      } catch (error) {
        console.warn(`Error cleaning up user ${userId}:`, error);
      }
    }
    
    
    return users.sort((a, b) => {
      const dateA = new Date(a.createdAt || 0);
      const dateB = new Date(b.createdAt || 0);
      return dateB.getTime() - dateA.getTime();
    });
  } catch (error) {
    console.error('Error fetching all users:', error);
    throw error;
  }
};

export const getAllUserProgress = async (): Promise<{ [userId: string]: UserProgress }> => {
  try {
    const progressRef = collection(firestore, 'userProgress');
    const snapshot = await getDocs(progressRef);
    const progressData: { [userId: string]: UserProgress } = {};
    
    // Only include progress data for users that still exist
    const validUsers = await getAllUsers();
    const validUserIds = new Set(validUsers.map(user => user.uid));
    
    snapshot.forEach((doc) => {
      if (validUserIds.has(doc.id)) {
        progressData[doc.id] = doc.data() as UserProgress;
      }
    });
    
    return progressData;
  } catch (error) {
    console.error('Error fetching all user progress:', error);
    throw error;
  }
};

// Admin email from environment variable
const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL || 'admin@pythonlearner.com';

// Manual cleanup function for orphaned documents
export const cleanupOrphanedDocuments = async (): Promise<void> => {
  try {
    const usersRef = collection(firestore, 'users');
    const snapshot = await getDocs(usersRef);
    
    for (const docSnapshot of snapshot.docs) {
      const userData = docSnapshot.data() as User;
      const userId = docSnapshot.id;
      
      
      // Check if this looks like a valid user
      if (!userData.email || !userData.displayName) {
        try {
          await deleteDoc(doc(firestore, 'users', userId));
          await deleteDoc(doc(firestore, 'userProgress', userId));
        } catch (error) {
          console.error(`Error deleting document ${userId}:`, error);
        }
      }
    }
    
  } catch (error) {
    console.error('Error during manual cleanup:', error);
    throw error;
  }
};

export const isAdmin = (user: User | null): boolean => {
  return user?.role === 'admin' || user?.email === ADMIN_EMAIL;
};

export const createAdminUser = async (email: string, password: string, displayName: string): Promise<User> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Update the user's display name
    await updateProfile(user, { displayName });
    
    const userData: User = {
      uid: user.uid,
      email: user.email!,
      displayName: displayName,
      createdAt: new Date().toISOString(),
      role: 'admin'
    };
    
    // Create user profile in Firestore
    await setDoc(doc(firestore, 'users', user.uid), userData);
    
    return userData;
  } catch (error) {
    throw error;
  }
};
