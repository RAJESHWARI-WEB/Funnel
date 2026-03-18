import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyBd5hxkd7GycCAfml2m1pouVgUhzGQxTiU",
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "funnelclient.firebaseapp.com",
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "funnelclient",
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "funnelclient.firebasestorage.app",
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "637561157982",
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:637561157982:web:cba67a4ea023b2bcb6b7cf"
};

let app: any = null;
let db: any = null;
let auth: any = null;

// Initialize Firebase only if the API key exists (prevents Next.js crash before setup)
if (firebaseConfig.apiKey) {
    app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    db = getFirestore(app);
    auth = getAuth(app);
}

export { app, db, auth };
