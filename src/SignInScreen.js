import React, {useEffect} from "react";
import firebase from "firebase";
import firebase_init from "./firebase-local";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
//import firebaseui from 'firebaseui';
//const firebaseui = require('firebaseui');

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

export function SignInChat({ user }) {
  useEffect(() => {
    const {AuthUI} = global.firebaseui.auth;
    const ui = AuthUI.getInstance() || new AuthUI(firebase.auth());
    ui.start('#firebaseui-auth-container', uiConfig);
  });
  
  return (
    <div style={{background: 'var(--mdc-theme-primary)', alignSelf: 'center'}}>
      Conecte-se para enviar mensagens
      {/* <StyledFirebaseAuth
        uiConfig={uiConfig}
        firebaseAuth={firebase.auth()}
      /> */}
      <div id='firebaseui-auth-container'></div>
    </div>
  );
}