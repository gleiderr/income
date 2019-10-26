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
  TopAppBarFixedAdjust, 
  TopAppBarIcon,
  TopAppBarRow,
  TopAppBarSection,
  TopAppBarTitle,
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
  const {sendMsg, userProfile, onLoginChange, msgsListener} = props;
  const {inventionListener, inventionSave} = props;

  //Estados
  const [user, setUser] = useState(undefined);
  const [destinatario, setDestinatario] = useState(undefined);
  const [alertas, setAlertas] = useState([]);
  const [contexto, setContexto] = useState('income');
  const [logged, setLogin] = useState(false);
  const [connecting, initLogin] = useState(false);

  const callbacks = {
    sendMsg: (texto) => sendMsg(texto, user.uid, destinatario, contexto)
                        .catch((alerta) => setAlertas([alerta, ...alertas])), 
    msgsListener: (setMsgs) => msgsListener(contexto, setMsgs),
  };
  const chat = <Chat autor={user && user.id} destinatários={[destinatario]} 
                     alertas={[]} {...callbacks} />;
  
  const signIn = <SignInChat onLoginChange={onLoginChange} userProfile={userProfile} setDestinatario={setDestinatario}
                    user={user} setUser={setUser}
                    logged={logged} setLogin={status => setLogin(status)}/>

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
           <ChatHeader logged={logged} connecting={connecting} initLogin={initLogin} signIn={signIn} />
            {connecting ? signIn : null}
            {chat}
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

function msgsListener(contexto, setMsgs) {
  //db.collection('conversas').doc(contexto).delete().then(() => console.log('excluído'));
  const msgsRef = invenções.doc(contexto).collection('msgs');
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
                        onLoginChange={onLoginChange}
                        userProfile={userProfile}
                        inventionListener={inventionListener}
                        inventionSave={inventionSave}
               />, document.querySelector("#root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
//serviceWorker.unregister();
