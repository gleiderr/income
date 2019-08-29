//https://github.com/kingofthestack/react-chat-window
//https://github.com/Wolox/react-chat-widget
import React, { useState, useEffect, useRef } from "react";
import firebase from "firebase";
import firebase_init from "./firebase-local";
import { Launcher } from "react-chat-window";

try {
  firebase.app();
} catch(err) {
  firebase_init();
}

const db = firebase.firestore();

export default function Chat(props) {
  const [msgList, newMsg] = useState([]);
  const msgsQuery = db.collection('chats').doc(props.context)
                    .collection('msgs').orderBy('timestamp');
                    
  const keyDownHandle = evt => {
    const texto = evt.target.value.trim();
    const timestamp = firebase.firestore.FieldValue.serverTimestamp();

    if (evt.key === "Enter" && texto.length > 0) {
      db.collection('chats').doc(props.context)
        .collection('msgs').add({texto, timestamp})
        .catch(err => console.error(err));
       
      evt.target.value = '';
    }
  };

  useEffect(() => {
    return msgsQuery.onSnapshot(docs => {
        //console.log({ fromCache: docs.metadata.fromCache });

        const data = [];
        docs.forEach(doc => {
          data.push({...doc.data(), id: doc.id});
        });
        newMsg(data);
        console.log(data);
      });
  }, []);

  const divMsgs = msgList.map(msg => <div key={msg.id}>{msg.texto}</div>);
  
  return (
    <>
      <div>Chat de Contexto</div>
      {divMsgs}
      <input type="text" onKeyDown={keyDownHandle} />
    </>
  );
}

function Chat2(props) {
  const [msgList, newMsg] = useState([]);

  const handleMessageSent = msg => {
    if (msgList.length % 2) {
      msg.author = "gleider";
    }

    console.log(msg);
    //newMsg([...msgList, msg]);
    /*db.collection('chats').doc(props.context)
      .collection('msgs').add(msg);*/
  };

  useEffect(() => {
    db.collection("chats")
      .doc(props.context)
      .collection("msgs")
      .onSnapshot(docs => {
        const data = [];
        docs.forEach(doc => {
          data.push(doc.data());
        });
        console.log(data);

        newMsg(data);
      });
  });

  return (
    <>
      <div>Chat de Contexto</div>
      <Launcher
        agentProfile={{
          teamName: props.context,
          imageUrl:
            "https://a.slack-edge.com/66f9/img/avatars-teams/ava_0001-34.png"
        }}
        onMessageWasSent={handleMessageSent}
        messageList={msgList}
        showEmoji
      />
    </>
  );
}
