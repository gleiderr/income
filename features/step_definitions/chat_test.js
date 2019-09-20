//https://github.com/NguyenAndrew/Enzyme-Cucumber-React
//https://github.com/testing-library/react-testing-library
import { JSDOM } from 'jsdom';
import React from 'react';
import Chat from '../../src/Chat';
import { render } from '@testing-library/react';
import {Given, When} from 'cucumber';

//https://github.com/NguyenAndrew/Enzyme-Cucumber-React
const {window} = new JSDOM(`<!DOCTYPE html><body></body></html>`);
global.window = window;
global.document = window.document;

/**
 * @param {String} texto
 * @returns {Promise<React.Component>} componente react para ser exibido como alerta em caso de erro.
 */
function sendMsg(texto) {
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

/**
 * Recebe função setMsgs que recebe nova lista de mensagens.
 * Deve retornar função para deseescrever sistema de auditoria de mensagens.
 * @callback setMsgs
 */
function msgsListener(setMsgs) {
  //db.collection('conversas').doc(contexto).delete().then(() => console.log('excluído'));
  const msgsRef = invenções.doc(contexto).collection('msgs');
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

/**
 * Função a ser executada quando uma mensagem é lida.
 * Recebe objeto da mensagem lida
 */
function onMsgReaded(msg) {
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

Given('que o usuário está conectado', function () {
    // Write code here that turns the phrase above into concrete actions
    //const div = document.createElement('div');
    const a = render(<Chat {...{sendMsg, msgsListener, onMsgReaded, alertas:[]}} />);

    return 'pending';
});

When('o digitar a mensagem {string}', function (string) {
    // Write code here that turns the phrase above into concrete actions
    return 'pending';
});