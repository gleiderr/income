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

let mensagens;
let listeners = {};
let data_hora;

Before(function (params) {
  this.containers = {};  
  listeners = {};
  data_hora = undefined;
})

After(function() {
  for (const container of Object.values(this.containers)) {
      ReactDOM.unmountComponentAtNode(container);
      container.remove();
  }
});

Given('o remetente {string}', function (usuário) {
  this.usuário = usuário;
});

Given('o destinatário {string}', function (destinatário) {
  this.destinatário = destinatário;
});

Given('nenhuma mensagem enviada', function () {
  mensagens = [];
});

Given('chat renderizado ao {string}', function (usuário) {
  const new_container = document.createElement('div');
  this.containers[usuário] = new_container;
  document.body.appendChild(new_container);

  const callbacks = {sendMsg, msgsListener, onMsgReaded};
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

When('data-hora igual a {string}', function (p_data_hora) {
  data_hora = p_data_hora;
  console.log({data_hora});
  
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
async function sendMsg(texto, autor, destinatario) {
    //console.log(texto, autor, destinatario);
    texto = texto.trim();
    
    mensagens.push({
      texto, autor, 
      destinatarios: [destinatario],
      timestamp: null, 
    });

    callListeners();

    return Promise.resolve();
}

function callListeners() {
  const lis = Object.values(listeners);
  for (const listener of lis) {
    listener();
  }
}

/**
 * Deve retornar função para cancelar a inscrição do "listener" no servidor.
 * @param {String} leitor - nome do usuário que está logado no chat
 * @callback [setMsgs] recebe nova lista de mensagens.
 */
function msgsListener(setMsgs, leitor) {
  //console.log('msgsListener', {leitor}, );
  listeners[leitor] = () => {
    //console.log('updateMsgs');
    //console.table(mensagens);

    setMsgs(mensagens.map((m, index) => ({
      id: index, 
      autor: m.autor === leitor ? '' : m.autor,
      texto: m.texto, 
      timestamp: m.timestamp, 
      leituras: m.leituras,
      destinatarios: m.destinatarios,
    })));
  };

  listeners[leitor]();
}

/**
 * Função a ser executada quando uma mensagem é lida.
 * Recebe objeto da mensagem lida
 */
function onMsgReaded(msg, leitor) {
  if (!mensagens[msg.id].leituras) {
    mensagens[msg.id].leituras = {};
  }
  mensagens[msg.id].leituras[leitor] = data_hora;

  callListeners();  
  
  //console.log('onMsgReaded', mensagens[msg.id]);

  /*const msgsRef = invenções.doc(contexto).collection('msgs');
  //não lido e destinatário
  const lido = user.uid && msg.leituras && msg.leituras[user.uid];
  if (!lido && msg.para_mim) {
    msgsRef.doc(msg.id).update({[`leituras.${user.uid}`]: timestamp})
      .then(() => console.log('Msg marcada como lida'))
      .catch((error => console.log("Msg não marcada como lida", error)));
  }*/
}