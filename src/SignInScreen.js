import React, { useState, useEffect } from "react";
import firebase from "firebase";
import firebase_init from "./firebase-local";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";

try {
  firebase.app();
} catch(err) {
  firebase_init();
}

/*const firebaseConfig = {
  apiKey: "AIzaSyCI77PrVU6FyFQN9OQhF8uo2ypHZQTQqSM",
  authDomain: "gleider-dev.firebaseapp.com",
  databaseURL: "https://gleider-dev.firebaseio.com",
  projectId: "gleider-dev",
  storageBucket: "",
  messagingSenderId: "868861057308",
  appId: "1:868861057308:web:72ab5d4b1e875ce7"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);*/

const uiConfig = {
  // Popup signin flow rather than redirect flow.
  signInFlow: "popup",

  // We will display Google and Facebook as auth providers.
  signInOptions: [
    //firebase.auth.FacebookAuthProvider.PROVIDER_ID,
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    firebase.auth.EmailAuthProvider.PROVIDER_ID,
    firebase.auth.GithubAuthProvider.PROVIDER_ID,
    //firebase.auth.AnonymousAuthProvider.PROVIDER_ID,
  ],
  callbacks: {
    // Avoid redirects after sign-in.
    signInSuccessWithAuthResult: () => false
  }
};

export function SignInChat(props) {

  useEffect(() => {
    return firebase.auth().onAuthStateChanged(user => props.setLogin(!!user));
  });

  if (!props.logged) {
    return (
      <>
        <div>Faça seu login com um dos métodos abaixo:</div>
        <StyledFirebaseAuth
          uiConfig={uiConfig}
          firebaseAuth={firebase.auth()}
        />
      </>
    );
  }

  return (
    <>
      <div>Olá {firebase.auth().currentUser.displayName}! Tudo bem?</div>
      <div>
        Você está conectado! 
        <button onClick={() => firebase.auth().signOut()}>Sair</button>
      </div>
      
      
    </>
  );
}