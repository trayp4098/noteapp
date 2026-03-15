const firebaseConfig = {
  apiKey:            "AIzaSyDqcTkryI5UHWyBb2RRvwsK7gdE3-TG3u8",
  authDomain:        "noteapp-42731.firebaseapp.com",
  projectId:         "noteapp-42731",
  storageBucket:     "noteapp-42731.firebasestorage.app",
  messagingSenderId: "165141703301",
  appId:             "1:165141703301:web:ada8f2230e632609a957ec",
};

// CDN compat — firebase глобальний об'єкт із <script> тегів в index.html
firebase.initializeApp(firebaseConfig);

export const auth           = firebase.auth();
export const db             = firebase.firestore();
export const googleProvider = new firebase.auth.GoogleAuthProvider();

googleProvider.setCustomParameters({ prompt: 'select_account' });
