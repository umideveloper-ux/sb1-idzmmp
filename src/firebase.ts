import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, onValue, off, push } from 'firebase/database';
import { getAuth } from 'firebase/auth';
import { School, Message } from './types';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

console.log('Firebase config:', firebaseConfig);

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export const auth = getAuth(app);

export const listenToSchoolsData = (callback: (schools: School[]) => void) => {
  const schoolsRef = ref(db, 'schools');
  console.log('Listening to schools data...');
  const listener = onValue(schoolsRef, (snapshot) => {
    const data = snapshot.val();
    console.log('Raw data from Firebase:', data);
    if (data) {
      const schoolsArray: School[] = Object.entries(data).map(([id, school]: [string, any]) => ({
        id: id, // Burada string olarak ID'yi kullanıyoruz
        name: school.name,
        email: school.email,
        candidates: school.candidates
      }));
      console.log('Processed schools data:', schoolsArray);
      callback(schoolsArray);
    } else {
      console.log('No data available');
      callback([]);
    }
  }, (error) => {
    console.error('Error fetching schools data:', error);
    callback([]);
  });

  return () => {
    console.log('Unsubscribing from schools data');
    off(schoolsRef, 'value', listener);
  };
};

export const updateCandidates = (schoolId: string, updatedCandidates: School['candidates']) => {
  const schoolRef = ref(db, `schools/${schoolId}/candidates`);
  return set(schoolRef, updatedCandidates);
};

export const sendMessage = (message: Omit<Message, 'id' | 'timestamp'>) => {
  const messagesRef = ref(db, 'messages');
  return push(messagesRef, {
    ...message,
    timestamp: Date.now()
  });
};