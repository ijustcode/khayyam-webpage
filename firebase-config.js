// Firebase configuration — will be populated after project creation
const firebaseConfig = {
    apiKey: "AIzaSyCZPfUqWPS3qGY-zDfJanI61aVRdHhNlx0",
    authDomain: "khayyam-poetry.firebaseapp.com",
    projectId: "khayyam-poetry",
    storageBucket: "khayyam-poetry.firebasestorage.app",
    messagingSenderId: "637012987120",
    appId: "1:637012987120:web:092d1deb2cec6b2c438635"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
