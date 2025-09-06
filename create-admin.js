// Script to create your admin account
// Run this with: node create-admin.js

const { initializeApp } = require('firebase/app');
const { getAuth, createUserWithEmailAndPassword, updateProfile, signInWithEmailAndPassword } = require('firebase/auth');
const { getFirestore, doc, setDoc, updateDoc } = require('firebase/firestore');
const fs = require('fs');
const path = require('path');

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAPZ3dZdaD1W1KO-_YSkqoIUAFj_vffV1Q",
  authDomain: "pythonapp-59423.firebaseapp.com",
  projectId: "pythonapp-59423",
  storageBucket: "pythonapp-59423.firebasestorage.app",
  messagingSenderId: "319551482195",
  appId: "1:319551482195:web:b2661bd8dceef843be59a6"
};

// Load environment variables from .env.local
function loadEnvFile() {
  const envPath = path.join(__dirname, '.env.local');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const envVars = {};
    
    envContent.split('\n').forEach(line => {
      const [key, value] = line.split('=');
      if (key && value) {
        envVars[key.trim()] = value.trim();
      }
    });
    
    return envVars;
  }
  return {};
}

const env = loadEnvFile();

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);

async function createAdminAccount() {
  try {
    console.log('🚀 Setting up your admin account...');
    
    // Get admin email from environment variable
    const adminEmail = env.VITE_ADMIN_EMAIL || 'admin@pythonlearner.com';
    const adminPassword = 'AdminPassword123!';      // Change this to your password
    const adminName = 'Tanisha Damle';                      // Change this to your name
    
    if (!env.VITE_ADMIN_EMAIL) {
      console.log('⚠️  Warning: VITE_ADMIN_EMAIL not found in .env.local, using default');
    }
    
    console.log(`📧 Email: ${adminEmail}`);
    console.log(`👤 Name: ${adminName}`);
    
    let user;
    
    try {
      // Try to create a new account first
      const userCredential = await createUserWithEmailAndPassword(auth, adminEmail, adminPassword);
      user = userCredential.user;
      console.log('✅ New admin account created!');
    } catch (createError) {
      if (createError.code === 'auth/email-already-in-use') {
        console.log('📝 Account already exists, signing in to update...');
        // Sign in to existing account
        const signInCredential = await signInWithEmailAndPassword(auth, adminEmail, adminPassword);
        user = signInCredential.user;
        console.log('✅ Signed in to existing account!');
      } else {
        throw createError;
      }
    }
    
    // Update the user's display name
    await updateProfile(user, { displayName: adminName });
    
    // Create or update user profile in Firestore with admin role
    const userData = {
      uid: user.uid,
      email: user.email,
      displayName: adminName,
      createdAt: user.metadata.creationTime || new Date().toISOString(),
      role: 'admin'
    };
    
    // Use setDoc to create or update the document
    await setDoc(doc(firestore, 'users', user.uid), userData, { merge: true });
    
    console.log('✅ Admin privileges granted successfully!');
    console.log('🎉 You can now sign in with your admin credentials');
    console.log('👑 You will see the admin dashboard when you sign in');
    
  } catch (error) {
    console.error('❌ Error setting up admin account:', error.message);
  }
}

// Run the script
createAdminAccount();
