//https://github.com/NguyenAndrew/Enzyme-Cucumber-React
//https://github.com/testing-library/react-testing-library
//import { render, fireEvent } from '@testing-library/react';
import { JSDOM } from 'jsdom';
import React from 'react';
import ReactDOM from 'react-dom';
import Chat from '../../src/Chat';
import {Given, When, Then, Before, After} from 'cucumber';
import assert from 'assert';
import { Simulate, act } from 'react-dom/test-utils';

//https://github.com/NguyenAndrew/Enzyme-Cucumber-React
const {window} = new JSDOM(`<!DOCTYPE html><body></body></html>`);
global.window = window;
global.document = window.document;
//Polyfill de requestAnimationFrame
global.requestAnimationFrame =  window.requestAnimationFrame = 
  callback => setTimeout(callback, 0);

let mensagens;
let listeners = [];

Before(function (params) {
  this.containers = {};  
  listeners = [];
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
  mensagens = [];
});

When('chat renderizado pelo {string}', function (usuário) {
  const new_container = document.createElement('div');
  this.containers[usuário] = new_container;
  document.body.appendChild(new_container);

  const callbacks = {
    sendMsg, 
    msgsListener: setMsgs => msgsListener(setMsgs)
  };
  const chat = <Chat autor={usuário} destinatários={[this.destinatário]} 
                     alertas={[]} {...callbacks} />;

  act(() => {
    ReactDOM.render(chat, new_container);
  });
});

When('o {string} digitar a mensagem {string}', function (remetente, mensagem) {
  this.input = this.containers[remetente].querySelector('input');
  this.input.value = mensagem;
  Simulate.change(this.input);
});

When('teclar {string}', function (string) {
  act(() => {
    Simulate.keyDown(this.input, {'key': 'Enter'});
  });
});

Then('o texto digitado deve ser limpo', function () {
  assert.strictEqual(this.input.value, '', 'Texto não limpo');
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
 * O chat espera que cada mensagem tenha a estrura mínima abaixo.
 * @example
 * 'auto_id': {
 *    texto: "minha mensagem",
 *    timestamp: timestamp,
 *    autor: 'GleiderID',
 *  }
 * @param {String} texto
 * @param {String} autor
 * @param {String} destinatario
 * @param {Boolean} error utilizado na simulação de testes
 * @returns {Promise<React.Component>} Componente react para ser exibido como alerta em caso de erro.
 */
async function sendMsg(texto, autor) {
    texto = texto.trim();
    
    mensagens.push({
      texto, autor,
      timestamp: null, 
    });

    callListeners();

    return Promise.resolve();
}

function callListeners() {
  listeners.forEach(listener => listener());
}

/**
 * Deve retornar função para cancelar a inscrição do "listener" no servidor.
 * @param {String} leitor - nome do usuário que está logado no chat
 * @callback [setMsgs] recebe nova lista de mensagens.
 */
function msgsListener(setMsgs) {
  const newListener = () => {
    setMsgs(mensagens.map((m, index) => ({
      ...m,
      id: index,
    })));
  };

  newListener();
  listeners.push(newListener);
}