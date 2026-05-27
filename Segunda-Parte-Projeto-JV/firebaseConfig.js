import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyDvpY25lmTZTOnqwXKZeLJ8Rd23Twx9nmM',
  authDomain: 'spaceportal-4ad77.firebaseapp.com',
  projectId: 'spaceportal-4ad77',
  storageBucket: 'spaceportal-4ad77.firebasestorage.app',
  messagingSenderId: '425722046504',
  appId: '1:425722046504:web:bf85765dea147bf5c3ed1d',
  measurementId: 'G-VSQ6CQPSPZ',
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;