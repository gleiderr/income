//https://github.com/kingofthestack/react-chat-window
//https://github.com/Wolox/react-chat-widget
import React, { useState, useEffect, useRef } from "react";
import firebase from "firebase";
import firebase_init from "./firebase-local";
import { SignInChat } from './SignInScreen';

try {
  firebase.app();
} catch(err) {
  firebase_init();
}

const db = firebase.firestore();

/**
 * @example Modelo de Dados Mensagens
 * //Ponteiro para identificar usuários
 * //Arranjos para manter flexibilidade, mas sem utilidade atual
 *  'auto_id': {
 *    texto: "minha mensagem",
 *    timestamp: timestamp,
 *    autor: 'GleiderID',
 *    destinatarios: ['DestinatárioID'],
 *    projetos: ['ProjetoID'],
 *    leituras: { 'DestinatárioID': timestamp } //objeto para manter flexibilidade
 *  }
 * 
 * @example Modelo de Dados de Usuários 
 * 'uid': {
 *    papel: 'administrador'
 * }
 */
export default function Chat(props) {
  const [msgList, newMsg] = useState([]);
  const [userRole, setRole] = useState('normal');
  const [logged, setLogin] = useState(false);
  const uid = firebase.auth().currentUser && firebase.auth().currentUser.uid;
  const msgsRef = db.collection('conversas').doc(props.context).collection('msgs');
  const msgsQuery = msgsRef.orderBy('timestamp');
                    
  const keyDownHandle = evt => {
    const texto = evt.target.value.trim();
    
    if (evt.key === "Enter" && texto.length > 0) {
      const timestamp = firebase.firestore.FieldValue.serverTimestamp();
      msgsRef.add({texto, timestamp, autor: uid})
        .catch(err => console.error(err));
       
      evt.target.value = ''; //Limpa o campo
    }
  };

  //Atualiza papel do usuário
  useEffect(() => {
    console.log(uid, logged);
    if (uid) {
      db.collection('usuários').doc(uid).get().then(doc =>setRole(doc.data().papel))
    } else {
      setRole('desconectado');
    }
  }, [uid, logged]);

  //Atualiza lista de mensagens
  useEffect(() => {
    return msgsQuery.onSnapshot(docs => {
        const data = [];
        docs.forEach(doc => {
          data.push({...doc.data(), id: doc.id});
        });
        newMsg(data);
      });
  }, []);

  const divMsgs = msgList.map(msg => {
      const style = {textAlign: msg.autor === uid ? 'right' : 'left' };
      return <div key={msg.id} style={style}>{msg.texto}</div>
    }
  );
  
  return (
    <>
      <div>Chat de Contexto ({userRole})</div>
      <SignInChat logged={logged} setLogin={status => setLogin(status)}/>
      {divMsgs}
      <input type="text" onKeyDown={keyDownHandle} />
    </>
  );
}
