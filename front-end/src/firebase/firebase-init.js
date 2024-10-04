import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { firebaseConfig } from './firebase-config';
var app = initializeApp(firebaseConfig);
export var auth = getAuth(app);
export var firestore = getFirestore(app);
export var db = getFirestore(app);
