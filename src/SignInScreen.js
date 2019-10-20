import React, { useState, useEffect } from "react";
import firebase from "firebase";
import firebase_init from "./firebase-local";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import { Button } from '@material/react-button';

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

export function SignInChat({ onLoginChange, userProfile, user, setUser, logged, setLogin, setDestinatario }) {
  const [nenhumUsuário] = useState({
    uid: undefined,
    nome: undefined,
    papel: 'desconectado',
  });
  
  useEffect(() => {
    return firebase.auth().onAuthStateChanged(user => setLogin(!!user));
  }, [setLogin]);

  useEffect(() => {
    setUser(nenhumUsuário);
    return onLoginChange(setUser, nenhumUsuário)
  }, [onLoginChange, setUser, nenhumUsuário]);

  //Atualiza perfil do usuário
  useEffect(() => {
    if (user && user.uid) {
      const unsubscribe = userProfile(user, setUser);
      setDestinatario(user.papel === 'administrador' ? 'comum' : 'administrador');
      return unsubscribe;
    } else {
      setUser(nenhumUsuário);
      setDestinatario(undefined);
    }
  }, [user, setDestinatario, setUser, nenhumUsuário, userProfile]);

  if (!logged) {
    return (
      <div>
        <div>Conecte-se para enviar mensagens</div>
        <StyledFirebaseAuth
          uiConfig={uiConfig}
          firebaseAuth={firebase.auth()}
        />
      </div>
    );
  } else {
    return (
      <div style={{display: 'flex'}}>
        <div style={{flex: 1}}>
          {firebase.auth().currentUser ? firebase.auth().currentUser.displayName : ''}
        </div>
      </div>
    );
  }
}