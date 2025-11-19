
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase Console'dan aldığınız yapılandırma bilgileri
const firebaseConfig = {
  apiKey: "AIzaSyADAW6AwX28OHbJbkmEgc6GJq-YJEwVH1Y",
  authDomain: "avukatagigemini3.firebaseapp.com",
  projectId: "avukatagigemini3",
  storageBucket: "avukatagigemini3.firebasestorage.app",
  messagingSenderId: "481203531266",
  appId: "1:481203531266:web:17afb3337355736df0811b",
  measurementId: "G-DQCBL0FK92"
};

// Firebase uygulamasını başlat
const app = initializeApp(firebaseConfig);

// Authentication ve Firestore servislerini dışa aktar
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
