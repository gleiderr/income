import React, { useState, useEffect } from "react";
import firebase from "firebase";
import firebase_init from "./firebase-local";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import firebaseui from 'firebaseui';

try {
  firebase.app();
} catch(err) {
  firebase_init();
}

//https://github.com/firebase/firebaseui-web/
const uiConfig = {
  // Popup signin flow rather than redirect flow.
  signInFlow: "popup",
  credentialHelper: firebaseui.auth.CredentialHelper.NONE,

  // We will display Google and Facebook as auth providers.
  signInOptions: [
    //firebase.auth.FacebookAuthProvider.PROVIDER_ID,
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    {
      provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
      requireDisplayName: true,
    },
    //firebase.auth.GithubAuthProvider.PROVIDER_ID,
    //firebase.auth.AnonymousAuthProvider.PROVIDER_ID,
  ],
  callbacks: {
    // Avoid redirects after sign-in.
    signInSuccessWithAuthResult: () => false
  }
};

export function SignIn() {
  return (
    <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} />
  );
}

export function SignInChat({ user, setUser, user_profile }) {
  // Se usuário conectado, elemento é processado para que conexão seja 
  // verificada, mas não é renderizado
  if (!!user) return null; 
  
  return (
    <div style={{background: 'var(--mdc-theme-primary)'}}>
      <StyledFirebaseAuth
        uiConfig={uiConfig}
        firebaseAuth={firebase.auth()}
      />
    </div>
  );
}