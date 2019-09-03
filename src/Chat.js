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
 *    nomeAutor: 'Gleider Costa',
 *    destinatarios: ['DestinatárioID'],
 *    projetos: ['ProjetoID'],
 *    leituras: { 'DestinatárioID': timestamp }, //objeto para manter flexibilidade
 *    msgRespondida: 'msgResp'
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
  const user_name = firebase.auth().currentUser && firebase.auth().currentUser.displayName;
  const msgsRef = db.collection('conversas').doc(props.context).collection('msgs');
  const msgsQuery = msgsRef.orderBy('timestamp');
                    
  const keyDownHandle = evt => {
    const texto = evt.target.value.trim();
    
    if (evt.key === "Enter" && texto.length > 0) {
      const timestamp = firebase.firestore.FieldValue.serverTimestamp();
      const destinatario = userRole === 'administrador' ? ['comum'] : ['administrador'];
      const nomeAutor = user_name;
      msgsRef.add({texto, timestamp, autor: uid, destinatario, nomeAutor})
        .catch(err => console.error(err));
       
      evt.target.value = ''; //Limpa o campo
    }
  };

  //Atualiza papel do usuário
  useEffect(() => {
    if (uid) {
      return db.collection('usuários').doc(uid).onSnapshot(doc => 
        setRole(doc.data() ? doc.data().papel : 'comum')
      );
    } else {
      setRole('desconectado');
    }
  }, [uid, logged]);

  //Atualiza lista de mensagens
  useEffect(() => {
    return msgsQuery.onSnapshot(
      docs => {
        const data = [];
        docs.forEach(doc => {
          data.push({...doc.data(), id: doc.id});
        });
        newMsg(data);
      },
      error => console.log(error));
  }, []);

  const user = {uid, papel: userRole};
  const divMsgs = msgList.map(msg => <Mensagem key={msg.id} msg={msg} user={user}
                                            msgsRef={msgsRef} />);
  
  return (
    <div style={{maxWidth: 411}}>
      <div>Comunicação ({userRole})</div>
      <SignInChat logged={logged} setLogin={status => setLogin(status)}/>
      {divMsgs}
      <input type="text" onKeyDown={keyDownHandle} />
    </div>
  );
}

function Mensagem(props) {
  const { user, msg , msgsRef} = props;

  const p = v => v < 10 ? '0' + v : v;
  const dataHora = timestamp => {
    if (!timestamp) return 'aguardando';
    const date = timestamp.toDate();
    const [ dia, mes, ano ] = [p(date.getDate()), p(date.getMonth()), date.getFullYear()];
    const [ hora, minuto ] = [p(date.getHours()), p(date.getMinutes())];
    return `${dia}/${mes}/${ano} ${hora}:${minuto}`;
  }

  const destinatario = () => user.papel === msg.destinatario[0] || user.uid === msg.destinatario[0];

  const style = {
    //Alinhamento em função do autor
    textAlign: msg.autor === user.uid ? 'right' : 'left',
    justifyContent: msg.autor === user.uid ? 'flex-end' : 'flex-start',

    //Destaque em função do destinatário
    background: destinatario() ? 'cadetblue' : 'white',
    display: 'flex',

    wordBreak: 'break-all'
  };

  //Marca mensagem como lida;
  useEffect(() => {
    //não lido e destinatário
    const lido = user.uid && msg.leituras && msg.leituras[user.uid];
    if (!lido && destinatario()) {
      const timestamp = firebase.firestore.FieldValue.serverTimestamp();
      msgsRef.doc(msg.id).update({[`leituras.${user.uid}`]: timestamp})
        .then(() => console.log('Msg marcada como lida'))
        .catch((error => console.log("Msg não marcada como lida", error)));
    }
  }, [user.papel, user.uid]);
  
  return (
    <div style={style}>
      <div style={{borderStyle: 'dashed', borderWidth: '1px'}}>
        <div>{msg.nomeAutor}:</div>
        <div>{msg.texto}</div>
        <div>{`Entregue: ${dataHora(msg.timestamp)}`}</div>
        <div>{msg.leituras && JSON.stringify(msg.leituras)}</div>
      </div>
    </div>
  );
}