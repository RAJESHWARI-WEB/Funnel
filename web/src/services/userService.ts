import { db, auth } from '../lib/firebase';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { UserProfile } from '../store/useStore';

export async function saveUserProfile(profile: UserProfile): Promise<void> {
    if (!db || !auth) throw new Error("Firebase not initialized");
    
    const user = auth.currentUser;
    if (!user) throw new Error("No authenticated user found");

    const userRef = doc(db, 'users', user.uid);
    
    // Merge the new profile data with any existing document
    await setDoc(userRef, {
        ...profile,
        updatedAt: new Date()
    }, { merge: true });
}

export async function loadUserProfile(): Promise<UserProfile | null> {
    if (!db || !auth) return null;

    const user = auth.currentUser;
    if (!user) return null;

    const userRef = doc(db, 'users', user.uid);
    const docSnap = await getDoc(userRef);

    if (docSnap.exists()) {
        return docSnap.data() as UserProfile;
    }
    return null;
}
