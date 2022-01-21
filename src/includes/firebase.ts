import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyB4N26mwovQqiJepD7PCBzmpgVOoKmlgm4',
  authDomain: 'music-de9dc.firebaseapp.com',
  projectId: 'music-de9dc',
  storageBucket: 'music-de9dc.appspot.com',
  messagingSenderId: '415984025618',
  appId: '1:415984025618:web:e191f08d80693affd098cb',
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

db.enablePersistence().catch((error) => {
  console.log(`Firebase persistence error ${error.code}`);
});

const usersCollection = db.collection('users');
const songsCollection = db.collection('songs');
const commentsCollection = db.collection('comments');

export {
  auth,
  db,
  usersCollection,
  songsCollection,
  commentsCollection,
  storage,
};
