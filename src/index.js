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
  const {sendMsg, userProfile, onLoginChange, msgsListener, onMsgReaded} = props;

  const nenhumUsuário = {
    uid: undefined,
    nome: undefined,
    papel: 'desconectado',
  }

  //Estados
  const [user, setUser] = useState(nenhumUsuário);
  const [destinatario, setDestinatario] = useState(undefined);
  const [alertas, setAlertas] = useState([]);
  const [contexto, setContexto] = useState('');

  
  //Id do usuário
  useEffect(() => onLoginChange(setUser), [onLoginChange]);
  
  //Atualiza papel do usuário
  useEffect(() => {
    if (user.uid) {
      return userProfile(user, setUser);
    } else {
      setUser(nenhumUsuário);
    }
  }, [user, user.id, nenhumUsuário, userProfile]);
  
  //Destinatário
  useEffect(() => {
    if (!user.papel) {
      setDestinatario(undefined);
    } else if (!destinatario) {
      setDestinatario(user.papel === 'administrador' ? 'comum' : 'administrador');
    }
  }, [user.papel, destinatario]);
  
  //Funções
  const onSend = (texto) => sendMsg(texto, user.uid, destinatario, contexto)
                              .catch((alerta) => {
                                setAlertas((alertas) => [alerta, ...alertas]);
                                return Promise.reject('Não enviada');
                              });
                              
  return <Chat sendMsg={onSend}
              msgsListener={(setMsgs) => msgsListener(contexto, user, setMsgs)}
              onMsgReaded={(msg) => onMsgReaded(msg, user, contexto)}
              alertas={alertas}
        />;
}

function sendMsg(texto, autor, destinatario, contexto) {
  if (!autor || !destinatario) {
    return Promise.reject(<div>Necessário conectar para enviar mensagens</div>);
  }

  texto = texto.trim();
  if (texto.length > 0) {
    return db.collection('conversas').doc(contexto)
          .collection('msgs')
          .add({texto, timestamp, autor, destinatario})
          .catch(error => Promise.reject(<div>error</div>));
  } else {
    return Promise.resolve();
  }
}

function onLoginChange(setUser) {
  return firebase.auth().onAuthStateChanged(user => {
    if (user) setUser({uid: user.uid, nome: user.displayName});
  });
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

function msgsListener(contexto, user, setMsgs) {
  const msgsRef = db.collection('conversas').doc(contexto).collection('msgs');
  const msgsQuery = msgsRef.orderBy('timestamp');
  const destinatario = (msg) => user.papel === msg.destinatario[0] || user.uid === msg.destinatario[0];
  return msgsQuery.onSnapshot( docs => {
    const data = [];
    docs.forEach(doc => {
      data.push({
        ...doc.data(), 
        id: doc.id,
        minha: doc.data().autor === user.uid,
        para_mim: destinatario(doc.data()),
      });
    });
    setMsgs(data);
  },
  error => console.log(error));
}

function onMsgReaded(msg, user, contexto) {
  const msgsRef = db.collection('conversas').doc(contexto).collection('msgs');
  //não lido e destinatário
  const destinatario = () => user.papel === msg.destinatario[0] || user.uid === msg.destinatario[0];
  const lido = user.uid && msg.leituras && msg.leituras[user.uid];
  if (!lido && destinatario()) {
    msgsRef.doc(msg.id).update({[`leituras.${user.uid}`]: timestamp})
      .then(() => console.log('Msg marcada como lida'))
      .catch((error => console.log("Msg não marcada como lida", error)));
  }
}

ReactDOM.render(<Income sendMsg={sendMsg}
                        msgsListener={msgsListener}
                        onMsgReaded={onMsgReaded}
                        onLoginChange={onLoginChange}
                        userProfile={userProfile}
               />, document.querySelector("#root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
//serviceWorker.unregister();
