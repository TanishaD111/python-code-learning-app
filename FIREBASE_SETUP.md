# Firebase Setup Guide

## Current Status
✅ Your app is working with **mock Firebase** (perfect for development and testing)
✅ Your Firebase project is created: `pythonapp-59423`
✅ Environment variables are configured

## To Switch to Real Firebase (Optional)

### Step 1: Install Firebase SDK
```bash
npm install firebase
```

### Step 2: Enable Authentication in Firebase Console
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `pythonapp-59423`
3. Go to **Authentication** → **Sign-in method**
4. Enable **Email/Password** provider
5. Click **Save**

### Step 3: Create Firestore Database
1. In Firebase Console → **Firestore Database**
2. Click **Create database**
3. Choose **Start in test mode** (for development)
4. Select a location (choose closest to you)
5. Click **Done**

### Step 4: Update Security Rules (Optional)
In Firestore → Rules, you can customize:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow users to read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /userProgress/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### Step 5: Switch to Real Firebase
1. Open `src/App.tsx`
2. Change the import from:
   ```typescript
   import { 
     auth, 
     firestore, 
     defaultProgress, 
     calculateLevel,
     getXpForNextLevel,
     type User,
     type UserProgress 
   } from './services/firebase';
   ```
   
   To:
   ```typescript
   import { 
     auth, 
     firestore, 
     defaultProgress, 
     calculateLevel,
     getXpForNextLevel,
     type User,
     type UserProgress 
   } from './services/firebase-real';
   ```

3. Update the auth state listener in `App.tsx`:
   ```typescript
   // Replace this line:
   const unsubscribe = auth.onAuthStateChanged(async (authUser) => {
   
   // With this:
   const unsubscribe = onAuthStateChangedListener(async (authUser) => {
   ```

4. Add the import:
   ```typescript
   import { onAuthStateChangedListener } from './services/firebase-real';
   ```

### Step 6: Test Real Firebase
1. Restart your development server: `npm run dev`
2. Try creating an account with a real email
3. Check Firebase Console → Authentication to see the user
4. Check Firestore → Data to see user progress

## Benefits of Real Firebase
- ✅ Persistent data across devices
- ✅ Real user authentication
- ✅ Cloud storage of progress
- ✅ Multi-user support
- ✅ Production-ready

## Current Mock Firebase Benefits
- ✅ Works immediately without setup
- ✅ No external dependencies
- ✅ Perfect for development and testing
- ✅ All features work the same

## Your Firebase Project Details
- **Project ID**: pythonapp-59423
- **Auth Domain**: pythonapp-59423.firebaseapp.com
- **Storage Bucket**: pythonapp-59423.firebasestorage.app
- **Web App ID**: 1:319551482195:web:b2661bd8dceef843be59a6

The app works perfectly with mock Firebase, so you can start using it immediately!

