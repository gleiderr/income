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

  const [nenhumUsuário] = useState({
    uid: undefined,
    nome: undefined,
    papel: 'desconectado',
  })

  //Estados
  const [user, setUser] = useState(nenhumUsuário);
  const [destinatario, setDestinatario] = useState(undefined);
  const [alertas, setAlertas] = useState([]);
  const [contexto, setContexto] = useState('Geral');
  
  //Id do usuário
  useEffect(() => {
    return onLoginChange(setUser, nenhumUsuário)
  }, [onLoginChange, nenhumUsuário]);
  
  //Atualiza perfil do usuário
  useEffect(() => {
    if (user.uid) {
      const unsubscribe = userProfile(user, setUser);
      setDestinatario(user.papel === 'administrador' ? 'comum' : 'administrador');
      return unsubscribe;
    } else {
      setUser(nenhumUsuário);
      setDestinatario(undefined);
    }
  }, [user, nenhumUsuário, userProfile]);
                              
  return (
    <>
    {alertas}
    <Chat sendMsg={(texto) => sendMsg(texto, user.uid, destinatario, contexto)
                              .catch((alerta) => setAlertas([alerta, ...alertas]))}
              msgsListener={(setMsgs) => msgsListener(contexto, user, setMsgs)}
              onMsgReaded={(msg) => onMsgReaded(msg, user, contexto)}
              alertas={alertas}/>
    </>
  );
}

function onLoginChange(setUser, nenhumUsuário) {
  return firebase.auth().onAuthStateChanged(user => {
    console.log('onLoginChange');
    if (user) {
      setUser({uid: user.uid, nome: user.displayName});
    } else {
      setUser(nenhumUsuário);
    }
  });
}

function userProfile({uid, nome}, setUser) {
  return db.collection('usuários').doc(uid).onSnapshot(doc => {
    if (!doc.metadata.fromCache) {
      let newProfile;
      if (doc.data() === undefined) { //Se usuário não cadastrado
        doc.ref.set({papel: 'comum', nome}); //atribui-o como comum no banco
        newProfile = {papel: 'comum'}; 
      } else {
        newProfile = {papel: doc.data().papel};
      }
      //console.log('userProfile', newProfile);
      setUser(user => {return {...user, ...newProfile}});
    }
  }, error => console.error(error));
}

function sendMsg(texto, autor, destinatario, contexto) {
  if (!autor || !destinatario) {
    console.log({texto, autor, destinatario, contexto})
    return Promise.reject(<div>Necessário conectar para enviar mensagens</div>);
  }

  texto = texto.trim();
  if (texto.length > 0) {
    return db.collection('conversas').doc(contexto)
          .collection('msgs')
          .add({texto, timestamp, autor, destinatarios: [destinatario]})
          .catch(error => Promise.reject(<div>error</div>));
  } else {
    return Promise.resolve();
  }
}

function msgsListener(contexto, user, setMsgs) {
  //db.collection('conversas').doc(contexto).delete().then(() => console.log('excluído'));
  const msgsRef = db.collection('conversas').doc(contexto).collection('msgs');
  const msgsQuery = msgsRef.orderBy('timestamp');
  const destinatario = (msg) => {
    console.log(msg);
    return user.papel === msg.destinatarios[0] || user.uid === msg.destinatarios[0];
  }
  return msgsQuery.onSnapshot( docs => {
    //console.log('msgsListener');
    const data = [];
    docs.forEach(doc => {
      data.push({
        ...doc.data(), 
        id: doc.id,
        minha: doc.data().autor === user.uid,
        para_mim: destinatario(doc.data()),
      });
    });
    //console.log(data);
    setMsgs(data);
  },
  error => console.log(error));
}

function onMsgReaded(msg, user, contexto) {
  //console.log(msg, user, contexto);
  const msgsRef = db.collection('conversas').doc(contexto).collection('msgs');
  //não lido e destinatário
  const lido = user.uid && msg.leituras && msg.leituras[user.uid];
  if (!lido && msg.para_mim) {
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
