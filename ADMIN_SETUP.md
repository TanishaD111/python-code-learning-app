# 🔐 Admin Setup Guide

## How to Create Your Admin Account

You have **two secure options** to create your admin account:

### Option 1: Use the Script (Recommended)
1. **Edit the script** `create-admin.js`:
   - Change `adminEmail` to your email address
   - Change `adminPassword` to your desired password
   - Change `adminName` to your name

2. **Run the script**:
   ```bash
   node create-admin.js
   ```

3. **Sign in** with your admin credentials in the app

### Option 2: Hardcode Your Email
1. **Edit** `src/services/firebase-real.ts`
2. **Find line 241** and change:
   ```typescript
   const ADMIN_EMAIL = 'admin@pythonlearner.com'; // Change this to your actual email
   ```
3. **Replace** with your actual email address
4. **Create a regular account** with that email address
5. **Sign in** - you'll automatically have admin access

## 🔒 Security Features

- **No public admin creation** - Only you can have admin access
- **Email-based admin detection** - Your email automatically gets admin privileges
- **Secure admin dashboard** - Only visible to admin users
- **Full user activity monitoring** - See all users, progress, and statistics

## 👑 Admin Features

Once you're signed in as admin, you'll see:
- **Crown icon** 👑 in the header
- **Admin Dashboard** with:
  - All user accounts and their details
  - User progress (XP, level, completed exercises)
  - Activity statistics across all users
  - Leaderboard of top performers
  - Real-time data refresh

## 🚀 Quick Start

1. **Choose one of the options above** to create your admin account
2. **Sign in** to the app with your admin credentials
3. **Look for the crown icon** 👑 in the top-right corner
4. **Click "Admin"** to access the dashboard
5. **Monitor all user activity** and progress!

Your admin account is now secure and only accessible to you! 🎉
