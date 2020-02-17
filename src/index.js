import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import firebase from 'firebase';
import firebase_init from './firebase-local';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import { setVH } from './height';
import { ChatHeader } from './Header';
import DocChat from './DocChat';

import '@material/react-layout-grid/dist/layout-grid.css';
import '@material/react-card/dist/card.css';
import '@material/react-list/dist/list.css';
import '@material/react-typography/dist/typography.css';
import '@material/react-switch/dist/switch.css';
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

import { Body1 } from '@material/react-typography';
import { Grid, Row } from '@material/react-layout-grid';

const app = firebase_init();
const db = app.firestore();

const invencoes = db.collection('invencoes');
const timestamp = firebase.firestore.FieldValue.serverTimestamp();

setVH();

function Income({ sendMsg, msgsListener, inventionListener, inventionSave }) {
  //Estados
  const [user, setUser] = useState(undefined);
  const [sign_in, open_sign_in] = useState(false);
  const [displayChat, setChatDisplay] = useState(
    window.innerWidth <= 840 ? 'none' : 'flex'
  );

  useEffect(() => {
    let unsubProfileGetter = undefined;
    return app.auth().onAuthStateChanged(user => {
      if (!user) {
        setUser(undefined);
        if (unsubProfileGetter) {
          unsubProfileGetter();
          unsubProfileGetter = undefined;
        }
        console.log('desconectado');
        console.timeEnd('logging');
      } else {
        //ao fazer login
        console.time('logging');

        //Atribui usuário sem definição do papel
        setUser({
          uid: user.uid,
          nome: user.displayName,
        });

        const doc = db.collection('usuarios').doc(user.uid);
        unsubProfileGetter = doc.onSnapshot(
          { includeMetadataChanges: true },
          get
        );

        /** Bug-alert: em situações específicas ocorre um erro no comando unsubProfileGetter(), informando
         * que unsubProfileGetter não é uma função */
        async function get(snapshot) {
          if (!snapshot.metadata.fromCache) {
            //Atribui usuário com definições gravadas no banco, se usuário permanecer conectado
            setUser(snapshot.data() || (await set()));
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

  return (
    <Body1 tag={'div'}>
      <Grid
        className='vh100'
        style={{ padding: 0, display: 'flex', flexDirection: 'column' }}
      >
        <ChatHeader
          user={user}
          sign_in={sign_in}
          open_sign_in={open_sign_in}
          hideChat={() => setChatDisplay('none')}
        />
        <Row style={{ gridGap: '0px', flex: 1 }}>
          <DocChat
            user={user}
            displayChat={displayChat}
            setChatDisplay={setChatDisplay}
            inventionSave={inventionSave}
            inventionListener={inventionListener}
            msgsListener={msgsListener}
            sendMsg={(...params) => {
              if (user) return sendMsg(...params);

              open_sign_in(true);
              return Promise.reject('Usuário não conectado');
            }}
          />
        </Row>
      </Grid>
    </Body1>
  );
}

async function sendMsg(texto, autor, contexto) {
  if (!autor) {
    return Promise.reject('Conecte-se para enviar mensagens');
  }

  //await demorar(5000);

  texto = texto.trim();

  if (texto.length > 0) {
    return invencoes
      .doc(contexto)
      .collection('msgs')
      .add({ texto, timestamp, autor });
  } else {
    return Promise.resolve();
  }

  /*function demorar(t) {
    return new Promise((resolve, reject) => {
      setTimeout(() => reject(), t)
    })
  }*/
}

function msgsListener(setMsgs, contexto) {
  const msgsRef = invencoes.doc(contexto).collection('msgs');
  const msgsQuery = msgsRef.orderBy('timestamp');

  return msgsQuery.onSnapshot(
    docs => {
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
    error => console.log(error)
  );
}

function inventionListener(invenção, setMarkdown) {
  return invencoes.doc(invenção).onSnapshot(
    doc => {
      if (doc.data()) setMarkdown(doc.data().markdown);
    },
    error => console.log(error)
  );
}

function inventionSave(markdown, invenção, autor) {
  invencoes
    .doc(invenção)
    .collection('historico')
    .add({
      markdown,
      timestamp,
    });

  return invencoes
    .doc(invenção)
    .set({ markdown })
    .catch(error => Promise.reject(<div>error</div>));
}

const callbacks = {
  sendMsg,
  msgsListener,
  inventionListener,
  inventionSave,
};

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path='/:contexto?'>
          <Income {...callbacks} />
        </Route>
      </Switch>
    </BrowserRouter>
  );
}

ReactDOM.render(<App />, document.querySelector('#root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
//serviceWorker.unregister();
