//https://github.com/NguyenAndrew/Enzyme-Cucumber-React
//https://github.com/testing-library/react-testing-library
//import { render, fireEvent } from '@testing-library/react';
import React from 'react';
import ReactDOM from 'react-dom';
import {Given, When, Then, Before, After, BeforeAll} from 'cucumber';
import assert from 'assert';
import { Simulate, act } from 'react-dom/test-utils';
import { initDOM } from "./utils_test";
import Chat from '../../src/Chat';

import MockFirebase from 'mock-cloud-firestore';
const firebase = global.firebase = new MockFirebase({}, {isNaiveSnapshotListenerEnabled: true});

const db = firebase.firestore();
const invencoes = db.collection('invencoes');
const timestamp = firebase.firestore.FieldValue.serverTimestamp();

async function sendMsg(texto, autor) {
  if (!autor) {
     return Promise.reject('Conecte-se para enviar mensagens');
  }

  texto = texto.trim();

  if (texto.length > 0) {
    return invencoes.doc('income')
          .collection('msgs')
          .add({texto, timestamp, autor});
  } else {
    return Promise.resolve();
  }
}

function msgsListener(setMsgs) {
  const msgsRef = invencoes.doc('income').collection('msgs');
  const msgsQuery = msgsRef.orderBy('timestamp');

  return msgsQuery.onSnapshot( docs => {
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

//let mensagens;
//let listeners = [];

BeforeAll(function () {
  initDOM();
})

Before(function (params) {
  this.containers = {};  
});

const desmonta = (container) => {
  ReactDOM.unmountComponentAtNode(container);
  container.remove();
}

After(function() {
  Object.values(this.containers).forEach(desmonta);
});

Given('o remetente {string}', function (usuário) {
  this.usuário = usuário;
});

Given('nenhuma mensagem enviada', function () {
});

Given('Callbacks padrão', function () {
  
})

Given('chat renderizado pelo {string}', function (usuário) {
  const callbacks = { sendMsg, msgsListener };
  const chat = <Chat autor={usuário} destinatários={[this.destinatário]} 
                     alertas={[]} {...callbacks} />;

  const new_container = document.createElement('div');
  this.containers[usuário] = new_container;
  document.body.appendChild(new_container);

  act(() => {
    ReactDOM.render(chat, new_container);
  });
});

When('o {string} digitar a mensagem {string}', function (remetente, mensagem) {
  this.input = this.containers[remetente].querySelector('[data-testid="input"]');
  this.send = this.containers[remetente].querySelector('[data-testid="send"]');
  
  act(() => {
    this.input.value = mensagem;
    Simulate.change(this.input);
  }); 
});

When('enviar mensagem', function () { 
  act(() => {
    Simulate.click(this.send); 
  }); 
});

Then('o texto digitado deve ser igual a {string}', function (expected) {
  assert.strictEqual(this.input.value, expected, 
    `Input "${this.input.value}" diferente de "${expected}"`);
});

Then('uma mensagem deve ser exibida para o {string}', function (usuário) {
  const container = this.containers[usuário];
  this.mensagens = container.querySelectorAll('[data-testid="mensagem"]');
  this.mensagem = this.mensagens[0];
  
  assert.strictEqual(this.mensagens.length, 1, "Zero ou mais que uma mensagem renderizada");
});

Then('nessa mensagem {string} contém {string}', function (campo, conteúdo) {
  const {innerHTML} = this.mensagem.querySelector(`[data-testid="${campo}"]`);
  assert.strictEqual(innerHTML, conteúdo, `${campo} diferente de ${conteúdo}`);
});

/**
 * @param {String} texto
 * @param {String} autor
 * @returns {Promise<React.Component>}
 */
/*async function sendMsg(texto, autor) {  
  if (!autor) {
    return Promise.reject('Conecte-se para enviar mensagens');
  }
  mensagens = [...mensagens, {
    texto: texto.trim(), 
    autor,
    timestamp: null, 
  }];

  callListeners(); 

  return Promise.resolve();
}

function callListeners() {
  listeners.forEach(listener => listener());
}*/

/**
 * @callback [setMsgs] ação ao receber novas mensagens
 */
/*function msgsListener(setMsgs) {
  const newListener = () => { 
    setMsgs(mensagens.map((m, index) => ({
      ...m,
      id: index,
    })));
  };

  newListener();
  listeners.push(newListener);
}*/