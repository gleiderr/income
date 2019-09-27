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

Given('o remetente {string}', function (usuário) {
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
  });  
});

When('o usuário digitar a mensagem {string}', function (mensagem) {
  this.input = document.querySelector('input');
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

Then('uma mensagem deve ser exibida para o usuário', function () {
  this.mensagens = document.querySelectorAll('[data-testid="mensagem"]');
  this.mensagem = this.mensagens[0];

  assert.strictEqual(this.mensagens.length, 1, "Zero ou mais que uma mensagem renderizada");
});

Then('o campo {string} deve ser igual a {string}', function (campo, conteúdo) {
  const {innerHTML} = this.mensagem.querySelector(`[data-testid="${campo}"]`);
  assert.strictEqual(innerHTML, conteúdo, `${campo} diferente de ${conteúdo}`);
});

const mensagens = [];
let updateMsgs = undefined;

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

    updateMsgs();

    return Promise.resolve();
}

/**
 * Deve retornar função para cancelar a inscrição do "listener" no servidor.
 * @param {String} leitor - nome do usuário que está logado no chat
 * @callback [setMsgs] recebe nova lista de mensagens.
 */
function msgsListener(setMsgs, leitor) {
  console.log('msgsListener');
    updateMsgs = () => {
      console.log('updateMsgs');
      console.table(mensagens);

      setMsgs(mensagens.map((m, index) => ({
        id: index, 
        autor: m.autor === leitor ? '' : m.autor,
        texto: m.texto, 
        timestamp: m.timestamp, 
        destinatarios: m.destinatarios
      })));
    }
  updateMsgs();
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