# Firebase Implementation

Replace `localStorage` counters and saved recipes with Firebase Firestore + Anonymous Auth.

## Architecture

```
Firebase project
├── Firestore
│   ├── made_it_events/{docId}   — { timestamp, anonymousUid }
│   └── users/{uid}/recipes/{id} — SavedRecipe documents
└── Auth (Anonymous)             — session identity, no sign-up required
```

## SDK Install

```bash
npm install firebase@^11
```

## Firebase Config

```typescript
// src/lib/firebase.ts
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, signInAnonymously } from 'firebase/auth';

const app = initializeApp({
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
});

export const db = getFirestore(app);
export const auth = getAuth(app);

export const ensureAuth = () => signInAnonymously(auth);
```

## Firestore Security Rules

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /made_it_events/{docId} {
      allow read: if true;
      allow create: if request.auth != null
        && request.resource.data.uid == request.auth.uid;
      allow update, delete: if false;
    }
    match /users/{uid}/recipes/{recipeId} {
      allow read, write: if request.auth != null && request.auth.uid == uid;
    }
  }
}
```

## FirebaseStorageService Skeleton

Implement the same interface as `StorageService`:

```typescript
// src/services/FirebaseStorageService.ts
import { collection, addDoc, getDocs, deleteDoc, doc, getCountFromServer } from 'firebase/firestore';
import { db, ensureAuth } from '../lib/firebase';
import type { SavedRecipe } from '../types/Recipe';

export class FirebaseStorageService {
  async getMadeCount(): Promise<number> {
    const snapshot = await getCountFromServer(collection(db, 'made_it_events'));
    return snapshot.data().count;
  }

  async incrementMadeCount(): Promise<void> {
    const user = await ensureAuth();
    await addDoc(collection(db, 'made_it_events'), {
      uid: user.user.uid,
      timestamp: Date.now(),
    });
  }

  async getSavedRecipes(): Promise<SavedRecipe[]> {
    const user = await ensureAuth();
    const snap = await getDocs(collection(db, `users/${user.user.uid}/recipes`));
    return snap.docs.map((d) => ({ id: d.id, ...d.data() } as SavedRecipe));
  }

  // ... deleteRecipe, getFavoriteIds, toggleFavorite analogous
}
```

## Migration Checklist

1. Create Firebase project at console.firebase.google.com
2. Enable Firestore + Anonymous Auth
3. Deploy security rules above
4. `npm install firebase@^11`
5. Create `src/lib/firebase.ts` with your config
6. Implement `FirebaseStorageService` implementing same interface
7. Add feature flag: `VITE_USE_FIREBASE=true` in `.env.local`
8. In `StorageService.getInstance()`: return `FirebaseStorageService` when flag set
9. Add `VITE_FIREBASE_*` env vars to GitHub Actions secrets
10. Test: make-it counter increments globally; saved recipes sync across browsers

## Estimated Implementation Effort

~1 day for a developer familiar with Firebase. ~2–3 days if new to Firestore.

## Cost

Free tier (Spark plan) covers Gazpachator traffic indefinitely:
- Firestore: 50k reads + 20k writes/day free
- Auth: 10k/month free
