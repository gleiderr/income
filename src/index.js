import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import firebase from "firebase";
import firebase_init from "./firebase-local";
import {setVH} from './height';
import {ChatHeader} from './Header';

import '@material/react-layout-grid/dist/layout-grid.css';
import '@material/react-card/dist/card.css';
import '@material/react-list/dist/list.css';
import '@material/react-typography/dist/typography.css';
import "@material/react-switch/dist/switch.css";
import '@material/react-button/dist/button.css';
import '@material/react-text-field/dist/text-field.css';
import '@material/react-fab/dist/fab.css';
import '@material/react-material-icon/dist/material-icon.css';
import '@material/react-top-app-bar/dist/top-app-bar.css';
import '@material/react-drawer/dist/drawer.css';

import './index.css';
import './shadow.css';
import './color.css';
import './height.css';
import './docs.css';
import './styles/Chat.css';

import {Cell, Grid, Row} from '@material/react-layout-grid';
import MaterialIcon from '@material/react-material-icon';
import { Fab } from '@material/react-fab';
import {Body1} from '@material/react-typography';

//import { SignInChat } from './SignInScreen';
import Doc from './Doc';
import Chat from './Chat';
//import App from "./App";
//import * as serviceWorker from "./serviceWorker";

const app = firebase_init();
const db = app.firestore();

const invencoes = db.collection('invencoes');
const timestamp = firebase.firestore.FieldValue.serverTimestamp();

setVH();

function Income(props) {
  //Props
  const {sendMsg, msgsListener} = props;
  const {inventionListener, inventionSave} = props;

  //Estados
  const [user, setUser] = useState(undefined);
  const [contexto, setContexto] = useState('income');
  const [sign_in, open_sign_in] = useState(false);
  //const [connecting, initLogin] = useState(false);

  useEffect(() => {
    let unsubProfileGetter = undefined;
    return app.auth().onAuthStateChanged(user => {
      if (!user) {
        setUser(undefined);
        if(unsubProfileGetter) {
          unsubProfileGetter();
          unsubProfileGetter = undefined;
        }
        console.log('desconectado');
        console.timeEnd('logging');
      } else { //ao fazer login
        console.time('logging');

        //Atribui usuário sem definição do papel
        setUser({
          uid: user.uid,
          nome: user.displayName,
        });

        const doc = db.collection('usuarios').doc(user.uid);
        unsubProfileGetter = doc.onSnapshot({ includeMetadataChanges: true }, get);

        async function get(snapshot) {
          if (!snapshot.metadata.fromCache) {
           //Atribui usuário com definições gravadas no banco, se usuário permanecer conectado
            setUser(snapshot.data() ||  await set());
            unsubProfileGetter(); //desescreve snapshot listener quando acabar
            unsubProfileGetter = undefined;
            console.timeEnd('logging');
          }
        }

        async function set() {
          const newUser = {
            uid: user.uid,
            nome: user.displayName,
            papel: 'comum',
          };
          await doc.set(newUser);
          return newUser;
        }
      }
    });
  }, []);

  const callbacks = {
    sendMsg: (...params) => {
      if (user) return sendMsg(...params);

      open_sign_in(true);
      return Promise.reject('Usuário não conectado');
    },
    msgsListener,
  };

  const [displayDocs, setDocsDisplay] = useState('flex');
  const [displayChat, setChatDisplay] = useState( window.innerWidth <= 840 ? 'none' : 'flex');
  return (
    <Body1 tag={'div'}>
      <Grid style={{padding: 0}}>
        <Row style={{gridGap: '0px'}}>
          <Cell id='incomedocs' className='vh100' phoneColumns={12} tabletColumns={12} desktopColumns={8}
                style={{display: displayDocs, flexDirection: 'column', position: 'relative'}}>
            <Doc showHeader={!!user && user.papel === 'administrador'}
                  inventionSave={(markdown) => inventionSave(markdown, contexto, user)}
                  inventionListener={(setMarkdown) => inventionListener(contexto, setMarkdown)} />

            <Fab id='fab-chat' icon={<MaterialIcon icon="chat"/>}
                  onClick={() => setChatDisplay('flex')}
                  textLabel='Chat'
                   style={{
                     margin: '16px', position: 'absolute', bottom: '0px', right: '0px',
                     zIndex: 0,
                     color: 'var(--mdc-theme-on-primary, #fff)',
                     background: 'var(--mdc-theme-primary, #6200ee)'
                   }} />
          </Cell>
          <Cell id='incomechat' className='vh100' phoneColumns={12} tabletColumns={12} desktopColumns={4}
                style={{display: displayChat, flexDirection: 'column', background: 'white', width: '100%'}}>
            <ChatHeader user={user} sign_in={sign_in} open_sign_in={open_sign_in} hideChat={() => setChatDisplay('none')}/>
            <Chat autor={user} alertas={[]} {...callbacks} />
          </Cell>
        </Row>
      </Grid>
    </Body1>);
}

async function sendMsg(texto, autor) {
  if (!autor) {
     return Promise.reject('Conecte-se para enviar mensagens');
  }

  //await demorar(5000);

  texto = texto.trim();

  if (texto.length > 0) {
    return invencoes.doc('income')
          .collection('msgs')
          .add({texto, timestamp, autor});
  } else {
    return Promise.resolve();
  }

  /*function demorar(t) {
    return new Promise((resolve, reject) => {
      setTimeout(() => reject(), t)
    })
  }*/
}

function msgsListener(setMsgs) {
  //db.collection('conversas').doc(contexto).delete().then(() => console.log('excluído'));
  const msgsRef = invencoes.doc('income').collection('msgs');
  const msgsQuery = msgsRef.orderBy('timestamp');

  return msgsQuery.onSnapshot( docs => {
    //console.log('msgsListener');
    const data = [];
    docs.forEach(doc => {
      data.push({
        ...doc.data(),
        id: doc.id,
        autor: doc.data().autor.nome,
      });
    });
    setMsgs(data);
  },
  error => console.log(error));
}

function inventionListener(invenção, setMarkdown) {
  return invencoes.doc(invenção).onSnapshot( doc => {
    if(doc.data()) setMarkdown(doc.data().markdown);
  }, error => console.log(error));
}

function inventionSave(markdown, invenção, autor) {
  invencoes.doc(invenção).collection('historico').add({
    markdown, timestamp
  });

  return invencoes.doc(invenção).set({markdown})
    .catch(error => Promise.reject(<div>error</div>));
}

ReactDOM.render(<Income sendMsg={sendMsg} msgsListener={msgsListener}
                        inventionListener={inventionListener}
                        inventionSave={inventionSave}
               />, document.querySelector("#root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
//serviceWorker.unregister();
