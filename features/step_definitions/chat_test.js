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

let mensagens;
let listeners = [];

BeforeAll(function () {
  initDOM();
})

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

Then('deve ser emitido alerta {string}', function (alerta) {
  const [container] = Object.values(this.containers);
  const { innerHTML } = container.querySelector('.alerta');
  assert.strictEqual(innerHTML, alerta, `${alerta} diferente de ${innerHTML}`);
});

/**
 * @param {String} texto
 * @param {String} autor
 * @returns {Promise<React.Component>}
 */
async function sendMsg(texto, autor) {  
  if (!autor) {
    return Promise.reject(<div className='alerta'>Conecte-se para enviar mensagens</div>);
  }

  mensagens.push({
    texto: texto.trim(), 
    autor,
    timestamp: null, 
  });

  callListeners();

  return Promise.resolve();
}

function callListeners() {
  listeners.forEach(listener => listener());
}

/**
 * @callback [setMsgs] ação ao receber novas mensagens
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