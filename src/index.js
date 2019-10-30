import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import firebase from "firebase";
import firebase_init from "./firebase-local";
import {setVH} from './height';

import './index.css';
import './shadow.css';
import './color.css';
import './height.css';
import './docs.css';

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

import {Cell, Grid, Row} from '@material/react-layout-grid';
import MaterialIcon from '@material/react-material-icon';
import { Fab } from '@material/react-fab';
import {Body1} from '@material/react-typography';
import { SignInChat } from './SignInScreen';
import Doc from './Doc';
import Chat from './Chat';
import { Button } from '@material/react-button';
import TopAppBar, {
  TopAppBarRow,
  /*TopAppBarFixedAdjust, 
  TopAppBarIcon,
  TopAppBarSection,
  TopAppBarTitle,*/
} from '@material/react-top-app-bar';
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

setVH();

function Income(props) {
  //Props
  const {sendMsg, msgsListener} = props;
  const {inventionListener, inventionSave} = props;

  const user_profile = {
    get_set: user => {
      const doc = db.collection('usuários').doc(user.uid);
      const unsub = doc.onSnapshot({ includeMetadataChanges: true }, get);

      async function get(snapshot) {
        if (!snapshot.metadata.fromCache) {
          if (!snapshot.data()) await set();
          console.log('profile setted');
          unsub();
        }
      }

      async function set() {
        return doc.set({
            nome: user.displayName,
            papel: 'comum',
        })
        .catch(e => {
          console.error(e);
        });
      }
    }
  }

  //Estados
  const [user, setUser] = useState(undefined);
  const [contexto, setContexto] = useState('income');
  const [connecting, initLogin] = useState(false);

  const callbacks = { sendMsg, msgsListener, };
  
  const signIn = <SignInChat user={user} setUser={setUser} user_profile={user_profile} />

  return (
    <Body1 tag={'div'}>
      <Grid style={{padding: 0}}>
        <Row style={{gridGap: '0px'}}>
          <Cell id='incomedocs' className='vh100' phoneColumns={12} tabletColumns={12} desktopColumns={8} 
                style={{display: 'flex', flexDirection: 'column', position: 'relative'}}>
            <Doc inventionSave={(markdown) => inventionSave(markdown, contexto, user)}
                  inventionListener={(setMarkdown) => inventionListener(contexto, setMarkdown)} />
            
            <a id='fab-chat' style={{margin: '16px', position: 'absolute', bottom: '0px', right: '0px'}} href='#incomechat'>
              <Fab icon={<MaterialIcon icon="chat"/> } style={{
                color: 'var(--mdc-theme-on-primary, #fff)',
                background: 'var(--mdc-theme-primary, #6200ee)'
                }} />
            </a>
          </Cell>
          <Cell id='incomechat' className='vh100' phoneColumns={12} tabletColumns={12} desktopColumns={4} 
                style={{display: 'flex', flexDirection: 'column', position: 'relative'}}>
           <ChatHeader logged={!!user} connecting={connecting} initLogin={initLogin} signIn={signIn} />
            {connecting ? signIn : null}
            <Chat autor={user && user.uid} alertas={[]} {...callbacks} />
          </Cell>
        </Row>
      </Grid>
    </Body1>
  );

  function ChatHeader({logged, connecting, initLogin, signIn}) {
    const docLink = <Button id='fab-docs' href='#incomedocs'
                      style={{
                        margin: 'auto 8px auto auto',
                        marginLeft: 'auto',
                        background: 'var(--mdc-theme-secondary)',
                        color: 'var(--mdc-theme-on-secondary)',
                        borderColor: 'var(--mdc-theme-on-primary, #ffffff)',
                      }}
                      icon={<MaterialIcon icon="description"/>}>
      Documentação
    </Button>

    const style = {
      color: 'var(--mdc-theme-on-primary, #ffffff)',
      borderColor: 'var(--mdc-theme-on-primary, #ffffff)',
      margin: 'auto 8px'
    };
    const button = logged ? <Button outlined style={style} onClick={() => firebase.auth().signOut()}>Desconectar</Button> :
                            <Button outlined style={style} onClick={() => initLogin(!connecting)}
                              trailingIcon={<MaterialIcon icon={connecting ? "arrow_drop_up" : "arrow_drop_down"}/>}>
                              Conectar
                            </Button>

    
    return (
      <TopAppBar style={{position: 'static'}}>
        <TopAppBarRow>
          {button}
          {docLink}
        </TopAppBarRow>
      </TopAppBar>
    );
  }
}

async function sendMsg(texto, autor) {
  // if (!autor || !destinatario) {
  //   console.log({texto, autor, destinatario, contexto})
  //   return Promise.reject(<div>Necessário conectar para enviar mensagens</div>);
  // }

  texto = texto.trim();
  if (texto.length > 0) {
    return invenções.doc('income')
          .collection('msgs')
          .add({texto, timestamp, autor})
          .catch(error => Promise.reject(<div>error</div>));
  } else {
    return Promise.resolve();
  }
}

function msgsListener(setMsgs) {
  //db.collection('conversas').doc(contexto).delete().then(() => console.log('excluído'));
  const msgsRef = invenções.doc('income').collection('msgs');
  const msgsQuery = msgsRef.orderBy('timestamp');

  return msgsQuery.onSnapshot( docs => {
    //console.log('msgsListener');
    const data = [];
    docs.forEach(doc => {
      data.push({
        ...doc.data(), 
        id: doc.id,
      });
    });
    setMsgs(data);
  },
  error => console.log(error));
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
  console.log('salvando...');
  return invenções.doc(invenção).set({markdown})
    .then((a) => console.log('salvo', a))
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
