import React, { useState, useEffect } from "react";
import firebase from "firebase";
import firebase_init from "./firebase-local";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";

try {
  firebase.app();
} catch(err) {
  firebase_init();
}

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

export function SignIn() {
  return (
    <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} />
  );
}

export function SignInChat({ user, setUser }) {  
  useEffect(() => {
    return firebase.auth().onAuthStateChanged(user => {
      console.log({user});
      setUser(user)
    });
  });

  if (!user) {
    return (
      <div style={{background: 'var(--mdc-theme-primary)'}}>
        <StyledFirebaseAuth
          uiConfig={uiConfig}
          firebaseAuth={firebase.auth()}
        />
      </div>
    );
  } else {
    return <></>;
  }
}