import { firebase } from '@firebase/app';
import '@firebase/firestore';



const firebaseConfig = {
  apiKey: "AIzaSyDIVvnkrm1zySf8tpfq-kMLYZWITJTduVM",
  authDomain: "lab7-8-f980f.firebaseapp.com",
  projectId: "lab7-8-f980f",
  storageBucket: "lab7-8-f980f.appspot.com",
  messagingSenderId: "370578131588",
  appId: "1:370578131588:web:db6ebaed646f612c3d10d1"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

var firestore = firebase.firestore();

export default firestore;


