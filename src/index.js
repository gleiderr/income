import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import firebase from "firebase";
import firebase_init from "./firebase-local";

import '@material/react-layout-grid/dist/layout-grid.css';
import '@material/react-card/dist/card.css';
import '@material/react-list/dist/list.css';
import '@material/react-typography/dist/typography.css';
import "@material/react-switch/dist/switch.css";
import '@material/react-button/dist/button.css';
import '@material/react-text-field/dist/text-field.css';

import './index.css';
import './shadow.css';
import './color.css';

import {Cell, Grid, Row} from '@material/react-layout-grid';
import {Body1} from '@material/react-typography';
import { SignInChat } from './SignInScreen';
import Doc from './Doc';
import Chat from './Chat';
//import App from "./App";
//import * as serviceWorker from "./serviceWorker";

try {
  firebase.app();
} catch(err) {
  firebase_init();
}

const db = firebase.firestore();
const invenções = db.collection('invenções');
const timestamp = firebase.firestore.FieldValue.serverTimestamp();

function Income(props) {
  //Props
  const {sendMsg, userProfile, onLoginChange, msgsListener, onMsgReaded} = props;
  const {inventionListener, inventionSave} = props;

  //Estados
  const [user, setUser] = useState(undefined);
  const [destinatario, setDestinatario] = useState(undefined);
  const [alertas, setAlertas] = useState([]);
  const [contexto, setContexto] = useState('income');
  const [logged, setLogin] = useState(false);

  const callbacks = {
    sendMsg: (texto) => sendMsg(texto, user.uid, destinatario, contexto)
                        .catch((alerta) => setAlertas([alerta, ...alertas])), 
    msgsListener: (setMsgs) => msgsListener(contexto, user, setMsgs), 
    onMsgReaded: (msg) => onMsgReaded(msg, user, contexto)
  };
  const chat = <Chat autor={user && user.id} destinatários={[destinatario]} 
                     alertas={[]} {...callbacks} />;

  return (
    <Body1 tag={'div'}>
      <Grid style={{padding: 0}}>
        <Row style={{gridGap: '0px'}}>
          <Cell phoneColumns={12} tabletColumns={12} desktopColumns={8} style={{height: '100vh', overflow: 'auto', padding: '8px'}}>
            <Doc inventionSave={(markdown) => inventionSave(markdown, contexto, user)}
                  inventionListener={(setMarkdown) => inventionListener(contexto, setMarkdown)} /> 
          </Cell>
          <Cell phoneColumns={12} tabletColumns={12} desktopColumns={4} style={{height: '100vh', display: 'flex', flexDirection: 'column'}}>
            <SignInChat onLoginChange={onLoginChange} userProfile={userProfile} setDestinatario={setDestinatario}
              user={user} setUser={setUser}
              logged={logged} setLogin={status => setLogin(status)}/>
            
            {chat}
          </Cell>
        </Row>
      </Grid>
    </Body1>
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

async function sendMsg(texto, autor, destinatario, contexto) {
  if (!autor || !destinatario) {
    console.log({texto, autor, destinatario, contexto})
    return Promise.reject(<div>Necessário conectar para enviar mensagens</div>);
  }

  texto = texto.trim();
  if (texto.length > 0) {
    return invenções.doc(contexto)
          .collection('msgs')
          .add({texto, timestamp, autor, destinatarios: [destinatario]})
          .catch(error => Promise.reject(<div>error</div>));
  } else {
    return Promise.resolve();
  }
}

function msgsListener(contexto, user, setMsgs) {
  //db.collection('conversas').doc(contexto).delete().then(() => console.log('excluído'));
  const msgsRef = invenções.doc(contexto).collection('msgs');
  const msgsQuery = msgsRef.orderBy('timestamp');
  
  const destinatario = (msg) => {
    return user.papel === msg.destinatarios[0] || user.uid === msg.destinatarios[0];
  }

  const dataHora = timestamp => {
    if (!timestamp) return 'aguardando';
    
    const p = v => v < 10 ? '0' + v : v;
    
    const date = timestamp.toDate();
    const [ dia, mes, ano ] = [p(date.getDate()), p(date.getMonth()), date.getFullYear()];
    const [ hora, minuto ] = [p(date.getHours()), p(date.getMinutes())];
    return `${dia}/${mes}/${ano} ${hora}:${minuto}`;
  }

  const leituras = data => {
    return data.destinatarios.reduce((prev, destinatario) => {
      prev[destinatario] = data.leituras && dataHora(Object.values(data.leituras)[0]);
      return prev;
    }, {});
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
        timestamp: dataHora(doc.data().timestamp),
        leituras: leituras(doc.data()),
      });
    });
    //console.log(data);
    setMsgs(data);
  },
  error => console.log(error));
}

function onMsgReaded(msg, user, contexto) {
  //console.log(msg, user, contexto);
  const msgsRef = invenções.doc(contexto).collection('msgs');
  //não lido e destinatário
  const lido = user.uid && msg.leituras && msg.leituras[user.uid];
  if (!lido && msg.para_mim) {
    msgsRef.doc(msg.id).update({[`leituras.${user.uid}`]: timestamp})
      .then(() => console.log('Msg marcada como lida'))
      .catch((error => console.log("Msg não marcada como lida", error)));
  }
}

function inventionListener(invenção, setMarkdown) {
  return invenções.doc(invenção).onSnapshot( doc => {
    if(doc.data()) setMarkdown(doc.data().markdown);
  }, error => console.log(error));
}

function inventionSave(markdown, invenção, autor) {
  invenções.doc(invenção).collection('historico').add({
    markdown, timestamp
  });
  return invenções.doc(invenção).set({markdown})
    .then((a) => console.log('ok', a))
    .catch(error => Promise.reject(<div>error</div>));
}

ReactDOM.render(<Income sendMsg={sendMsg} msgsListener={msgsListener}
                        onMsgReaded={onMsgReaded} onLoginChange={onLoginChange}
                        userProfile={userProfile}
                        inventionListener={inventionListener}
                        inventionSave={inventionSave}
               />, document.querySelector("#root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
//serviceWorker.unregister();
