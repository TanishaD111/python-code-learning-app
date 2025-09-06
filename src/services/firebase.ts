// Firebase configuration and services
// Note: Replace these with your actual Firebase config values

interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

// Firebase config from environment variables
const firebaseConfig: FirebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyAPZ3dZdaD1W1KO-_YSkqoIUAFj_vffV1Q",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "pythonapp-59423.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "pythonapp-59423",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "pythonapp-59423.firebasestorage.app", 
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "319551482195",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:319551482195:web:b2661bd8dceef843be59a6"
};

// User interface
export interface User {
  uid: string;
  email: string;
  displayName: string;
  createdAt?: string;
}

// Progress interface
export interface UserProgress {
  xp: number;
  streak: number;
  level: number;
  completedExercises: string[];
  completedProjects: string[];
  lastLoginDate: string;
}

// Mock Firebase services - In a real app, replace these with actual Firebase SDK calls
class MockFirebaseAuth {
  private currentUser: User | null = null;
  private authStateListeners: ((user: User | null) => void)[] = [];

  // Simulate async operations with delays
  private delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async signUp(email: string, password: string, displayName: string): Promise<User> {
    await this.delay(1000); // Simulate network delay
    
    // Simulate validation
    if (!email.includes('@')) {
      throw new Error('Invalid email address');
    }
    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters');
    }

    const user: User = {
      uid: `user_${Date.now()}`,
      email,
      displayName,
      createdAt: new Date().toISOString()
    };

    this.currentUser = user;
    localStorage.setItem('mockFirebaseUser', JSON.stringify(user));
    
    // Notify listeners
    this.authStateListeners.forEach(listener => listener(user));
    
    return user;
  }

  async signIn(email: string, password: string): Promise<User> {
    await this.delay(1000); // Simulate network delay
    
    // Simulate validation
    if (!email.includes('@')) {
      throw new Error('Invalid email address');
    }
    if (password.length < 6) {
      throw new Error('Invalid password');
    }

    // For demo purposes, create a user or retrieve from localStorage
    const savedUser = localStorage.getItem('mockFirebaseUser');
    let user: User;
    
    if (savedUser) {
      user = JSON.parse(savedUser);
    } else {
      user = {
        uid: `user_${Date.now()}`,
        email,
        displayName: email.split('@')[0],
        createdAt: new Date().toISOString()
      };
      localStorage.setItem('mockFirebaseUser', JSON.stringify(user));
    }

    this.currentUser = user;
    
    // Notify listeners
    this.authStateListeners.forEach(listener => listener(user));
    
    return user;
  }

  async signOut(): Promise<void> {
    await this.delay(500);
    this.currentUser = null;
    localStorage.removeItem('mockFirebaseUser');
    
    // Notify listeners
    this.authStateListeners.forEach(listener => listener(null));
  }

  getCurrentUser(): User | null {
    if (!this.currentUser) {
      const savedUser = localStorage.getItem('mockFirebaseUser');
      if (savedUser) {
        this.currentUser = JSON.parse(savedUser);
      }
    }
    return this.currentUser;
  }

  onAuthStateChanged(listener: (user: User | null) => void): () => void {
    this.authStateListeners.push(listener);
    
    // Immediately call with current user
    listener(this.getCurrentUser());
    
    // Return unsubscribe function
    return () => {
      const index = this.authStateListeners.indexOf(listener);
      if (index > -1) {
        this.authStateListeners.splice(index, 1);
      }
    };
  }
}

class MockFirestore {
  private delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async saveUserProgress(userId: string, progress: UserProgress): Promise<void> {
    await this.delay(500);
    localStorage.setItem(`progress_${userId}`, JSON.stringify(progress));
  }

  async getUserProgress(userId: string): Promise<UserProgress | null> {
    await this.delay(500);
    const saved = localStorage.getItem(`progress_${userId}`);
    return saved ? JSON.parse(saved) : null;
  }

  async createUserProfile(user: User): Promise<void> {
    await this.delay(500);
    localStorage.setItem(`profile_${user.uid}`, JSON.stringify(user));
  }
}

// Export mock services
export const auth = new MockFirebaseAuth();
export const firestore = new MockFirestore();

// Default progress for new users
export const defaultProgress: UserProgress = {
  xp: 0,
  streak: 1,
  level: 1,
  completedExercises: [],
  completedProjects: [],
  lastLoginDate: new Date().toDateString()
};

// Helper functions
export const calculateLevel = (xp: number): number => {
  return Math.floor(xp / 100) + 1;
};

export const getXpForNextLevel = (level: number): number => {
  return level * 100;
};

/*
TO INTEGRATE WITH REAL FIREBASE:

1. Install Firebase SDK:
   npm install firebase

2. Replace the mock classes above with real Firebase imports:

import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc 
} from 'firebase/firestore';

3. Initialize Firebase:
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const firestore = getFirestore(app);

4. Replace mock methods with real Firebase calls:
- auth.signUp -> createUserWithEmailAndPassword + updateProfile
- auth.signIn -> signInWithEmailAndPassword  
- auth.signOut -> signOut
- firestore.saveUserProgress -> setDoc/updateDoc
- firestore.getUserProgress -> getDoc

5. Update your Firebase console:
- Enable Email/Password authentication
- Create Firestore database
- Set up security rules for user data
*/