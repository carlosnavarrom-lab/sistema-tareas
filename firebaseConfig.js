// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyBW_HrXffYMrqZ0kYssJ4RRkhjVLWuI6rQ",
  authDomain: "tareas-9d6f4.firebaseapp.com",
  projectId: "tareas-9d6f4",
  storageBucket: "tareas-9d6f4.appspot.com",
  messagingSenderId: "409360747783",
  appId: "1:409360747783:web:a10bf8c2074a27958e09a2",
  measurementId: "G-Y557DJYWL9"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();

// Autenticación anónima
auth.signInAnonymously().catch((error) => {
  console.error("Error de autenticación:", error);
});

console.log("Firebase iniciado correctamente");
