import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import firebase from "firebase";
import firebase_init from "./firebase-local";
//import SignInScreen from "./SignInScreen";
import Chat from './Chat';
//import './index.css';
//import App from "./App";
//import * as serviceWorker from "./serviceWorker";

try {
  firebase.app();
} catch(err) {
  firebase_init();
}

const db = firebase.firestore();
const timestamp = firebase.firestore.FieldValue.serverTimestamp();

function Income(props) {
  //Props
  const {sendMsg, userProfile} = props;

  const nenhumUsuário = {
    uid: undefined,
    nome: undefined,
    role: 'desconectado',
  }

  //Estados
  const [user, changeUser] = useState(nenhumUsuário);
  const [destinatario, changeDestinatario] = useState(undefined);
  const [alertas, setAlertas] = useState([]);

  //Id do usuário
  useEffect(() => {
    return firebase.auth().onAuthStateChanged(user => {
      if (user) changeUser({uid: user.uid, nome: user.displayName});
    });
  }, []);

  //Atualiza papel do usuário
  useEffect(() => {
    if (user.uid) {
      return userProfile(user, changeUser);
    } else {
      changeUser(nenhumUsuário);
    }
  }, [user, user.id, nenhumUsuário, userProfile]);

  //Destinatário
  useEffect(() => {
    if (!destinatario && !!user.papel) {
      changeDestinatario(user.papel === 'administrador' ? 'comum' : 'administrador');
    }
  }, [user.papel, destinatario])

  //Funções
  const onSend = (texto) => sendMsg(texto, user.uid, destinatario)
                            .catch((alerta) => {
                              setAlertas((alertas) => [alerta, ...alertas]);
                              return Promise.reject('Não enviada');
                            });

  return <Chat context='Teste' 
              onSend={onSend} 
              alertas={alertas}
        />
}

function sendMsg(texto, autor, destinatario, contexto) {
  if (!autor || !destinatario) {
    return Promise.reject(<div>Necessário conectar para enviar mensagens</div>);
  }
  
  if (texto.length > 0) {
    return db.collection('conversas').doc(contexto)
            .collection('msgs')
            .add({texto, timestamp, autor, destinatario})
            .catch(error => Promise.reject(<div>error</div>));
  }
}

function onLoginChange(f) {
  return firebase.auth().onAuthStateChanged(user => {f({uid: user && user.uid});});
}

function userProfile({uid, nome}, changeUser) {
  return db.collection('usuários').doc(uid).onSnapshot(doc => {
    if (!doc.metadata.fromCache) {
      let newProfile;
      if (doc.data() === undefined) { //Se usuário não cadastrado
        doc.ref.set({papel: 'comum', nome}); //atribui-o como comum no banco
        newProfile = {papel: 'comum'}; 
      } else {
        newProfile = {papel: doc.data().papel};
      }
      changeUser(user => {return {...user, ...newProfile}});
    }
  }, error => console.error(error));
}

ReactDOM.render(<Income sendMsg={sendMsg} 
                      onLoginChange={onLoginChange}
                      userProfile={userProfile}
               />, document.querySelector("#root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
//serviceWorker.unregister();
