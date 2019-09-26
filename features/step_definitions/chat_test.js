//https://github.com/NguyenAndrew/Enzyme-Cucumber-React
//https://github.com/testing-library/react-testing-library
//import { render, fireEvent } from '@testing-library/react';
import { JSDOM } from 'jsdom';
import React from 'react';
import ReactDOM from 'react-dom';
import Chat from '../../src/Chat';
import {Given, When, Then, } from 'cucumber';
import assert from 'assert';
import { Simulate, act } from 'react-dom/test-utils';

//https://github.com/NguyenAndrew/Enzyme-Cucumber-React
const {window} = new JSDOM(`<!DOCTYPE html><body></body></html>`);
global.window = window;
global.document = window.document;

const container = document.createElement('div');
document.body.appendChild(container);

Given('o usuário {string} conectado', function (usuário) {
  this.usuário = usuário;
});

Given('o destinatário {string}', function (destinatário) {
  this.destinatário = destinatário;
});

Given('o chat renderizado', function () {
  act(() => {
    ReactDOM.render(<Chat autor={this.usuário} destinatários={[this.destinatário]}
      sendMsg={(...params) => sendMsg(...params, false)}
      {...{msgsListener, onMsgReaded, alertas:[]}} />, container);
  })
  /*this.chat = render(<Chat autor={this.usuário} destinatários={[this.destinatário]}
                           sendMsg={(...params) => sendMsg(...params, false)}
                          {...{msgsListener, onMsgReaded, alertas:[]}} />);*/
  
});

When('o usuário digitar a mensagem {string}', function (mensagem) {
  this.input = document.querySelector('input');
  this.input.value = mensagem;
  Simulate.change(this.input);
});

When('teclar {string}', function (string) {
  Simulate.keyDown(this.input, {'key': 'Enter'});
});

Then('o texto digitado deve estar limpo', function () {
  assert.strictEqual(this.input.value, '', 'Texto não limpo');
});

const mensagens = [];

/**
 * O chat espera que cada mensagem tenha a estrura mínima abaixo.
 * @example
 * 'auto_id': {
 *    texto: "minha mensagem",
 *    timestamp: timestamp,
 *    autor: 'GleiderID',
 *    destinatarios: ['DestinatárioID'],
 *    leituras: { 'DestinatárioID': timestamp }, //objeto para manter flexibilidade
 *    //projetos: ['ProjetoID'],
 *    //msgRespondida: 'msgResp'
 *  }
 * @param {String} texto
 * @param {String} autor
 * @param {String} destinatario
 * @param {Boolean} error utilizado na simulação de testes
 * @returns {Promise<React.Component>} Componente react para ser exibido como alerta em caso de erro.
 */
async function sendMsg(texto, autor, destinatario, error = false) {
    texto = texto.trim();
    if(error) return Promise.reject(<div>error</div>);
    
    mensagens.push({texto, timestamp: null, autor, destinatarios: [destinatario]});
    return Promise.resolve();
}

/**
 * Recebe função setMsgs que recebe nova lista de mensagens.
 * Deve retornar função para deseescrever sistema de auditoria de mensagens.
 * @callback setMsgs
 */
function msgsListener(setMsgs) {
  //db.collection('conversas').doc(contexto).delete().then(() => console.log('excluído'));
  /*const msgsRef = invenções.doc(contexto).collection('msgs');
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
  error => console.log(error));*/
}

/**
 * Função a ser executada quando uma mensagem é lida.
 * Recebe objeto da mensagem lida
 */
function onMsgReaded(msg) {
  //console.log(msg, user, contexto);
  /*const msgsRef = invenções.doc(contexto).collection('msgs');
  //não lido e destinatário
  const lido = user.uid && msg.leituras && msg.leituras[user.uid];
  if (!lido && msg.para_mim) {
    msgsRef.doc(msg.id).update({[`leituras.${user.uid}`]: timestamp})
      .then(() => console.log('Msg marcada como lida'))
      .catch((error => console.log("Msg não marcada como lida", error)));
  }*/
}