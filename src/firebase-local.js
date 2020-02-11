import firebase from "firebase";

let app = undefined;
export default function firebase_init() {
  if (app) return app;

  const firebaseConfig = {
    apiKey: "AIzaSyCI77PrVU6FyFQN9OQhF8uo2ypHZQTQqSM",
    authDomain: "gleider-dev.firebaseapp.com",
    databaseURL: "https://gleider-dev.firebaseio.com",
    projectId: "gleider-dev",
    storageBucket: "",
    messagingSenderId: "868861057308",
    appId: "1:868861057308:web:72ab5d4b1e875ce7"
  };
  // Initialize Firebase
  return app = firebase.initializeApp(firebaseConfig);
}