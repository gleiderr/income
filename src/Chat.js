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

let model = {
  conversas: { //collection
    id1: { //doc
      assunto: 'Sistema de Projetos',
      timestamp: 123456,
      envolvidos: ['UsuárioID', 'GleiderID'],
      mensagens: { //sub-collection
        id1: {
          autor: "GleiderID",
          timestamp: 123456,
          texto: "minha mensagem"
        }
      }
    }
  }
};

/**
 * @example Modelo de Dados Mensagens
 * //Ponteiro para identificar usuários
 * //Arranjos para manter flexibilidade, mas sem utilidade atual
 *  {
 *    texto: "minha mensagem",
 *    timestamp: timestamp,
 *    autor: 'GleiderID',
 *    destinatarios: ['DestinatárioID'],
 *    projetos: ['ProjetoID'],
 *    leituras: { 'DestinatárioID': timestamp } //objeto para manter flexibilidade
 *  }
 */
export default function Chat(props) {
  const [msgList, newMsg] = useState([]);
  const msgsRef = db.collection('conversas').doc(props.context).collection('msgs');
  const msgsQuery = msgsRef.orderBy('timestamp');
                    
  const keyDownHandle = evt => {
    const texto = evt.target.value.trim();
    const timestamp = firebase.firestore.FieldValue.serverTimestamp();

    if (evt.key === "Enter" && texto.length > 0) {
      msgsRef.add({texto, timestamp})
        .catch(err => console.error(err));
       
      evt.target.value = ''; //Limpa o campo
    }
  };

  //Define referência de mensagens
  useEffect(() => {

  });

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

  const divMsgs = msgList.map(msg => <div key={msg.id}>{msg.texto}</div>);
  
  return (
    <>
      <div>Chat de Contexto</div>
      <SignInChat />
      {divMsgs}
      <input type="text" onKeyDown={keyDownHandle} />
    </>
  );
}
