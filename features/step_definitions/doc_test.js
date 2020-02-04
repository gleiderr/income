//https://github.com/NguyenAndrew/Enzyme-Cucumber-React
//https://github.com/testing-library/react-testing-library
//import { render, fireEvent } from '@testing-library/react';
//https://github.com/NguyenAndrew/Enzyme-Cucumber-React
import { initDOM } from './utils_test';
import React from 'react';
import ReactDOM from 'react-dom';
import Doc from '../../src/Doc';
import {Given, When, Then, Before, After, BeforeAll} from 'cucumber';
import assert from 'assert';
import { Simulate, act } from 'react-dom/test-utils';

import MockFirebase from 'mock-cloud-firestore';

const firebase = global.firebase = new MockFirebase();

const db = firebase.firestore();
const invencoes = db.collection('invencoes');
const timestamp = firebase.firestore.FieldValue.serverTimestamp();

function inventionListener(invenção, setMarkdown) {
  return invencoes.doc(invenção).onSnapshot( doc => {
    if(doc.data()) setMarkdown(doc.data().markdown);
  }, error => console.log(error));
}

let confirmar;
function inventionSave(markdown, invenção, autor) {
  invencoes.doc(invenção).collection('historico').add({
    markdown, timestamp
  });
  
  const savePromise = invencoes.doc(invenção).set({markdown})
    .catch(error => Promise.reject(<div>error</div>));

  //Resolução seletiva
  return new Promise((resolve, reject) => {
    confirmar = () => resolve(savePromise);
  });
}

Before(function () {
  initDOM();

  //Mock: salvamento seletivo do markdown no banco de dados
  this.markdown = undefined;
});

Given('o seguinte texto markdown:', function (docString) {
  this.texto = docString;
});

When('a documentação for exibida', function () {
  const contexto = 'income';
  const user = 'usuario';

  const doc = <Doc showHeader={true}
                    inventionSave={(markdown) => inventionSave(markdown, contexto, user)} 
                    inventionListener={(setMarkdown) => inventionListener(contexto, setMarkdown)} />

  this.container = document.createElement('div');
  document.body.appendChild(this.container);
  
  act(() => {
    ReactDOM.render(doc, this.container);
  });
});

When('o desenvolvedor {string} a visualização', function (acao) {
  const chave = this.container.querySelector('[data-testid="switch"]');
  const checked = acao === 'desabilitar' ? false : true;
  
  act(() => {
    Simulate.change(chave, { target: {checked} });
  })

  const checkbox = chave.querySelector('#my-switch');
  assert.strictEqual(checkbox.checked, checked, 
                     `O check box deveria conter "${checked}". Checkbox: ${checkbox.outerHTML}`);
});

When('o desenvolvedor digitar o texto markdown', function () {
  const markdown = this.container.querySelector('[data-testid="markdown"]');

  act(() => {
    markdown.innerText = this.texto;
    Simulate.blur(markdown);
  });
   
  assert.strictEqual(markdown.innerText, this.texto, 
                     `O conteúdo deveria ser: ${this.texto}`);
});

When('o desenvolvedor clicar sobre salvar', function () {
  const button = this.container.querySelector('[data-testid="save-button"]');

  act(() => {
    Simulate.click(button);
  });
});

When('o sistema confirmar o salvamento', function () {
  act(() => {
    confirmar();
  });
}); 

Then('o texto deve ser salvo', function () { 
  assert.strictEqual(this.markdown, this.texto, `this.markdown: ${this.markdown} deve ser igual a this.texto ${this.texto}.`);

});

Then('o seguinte conteúdo deve ser exibido:', function (conteudo) {
  const {innerHTML} = this.container.querySelector('[data-testid="view"]');
  assert.strictEqual(conteudo, innerHTML, `conteudo: ${conteudo}, innerHTML: ${innerHTML}.`); 
});

Then('o botão deve ser exibido {string}', function (estado) {
  const {classList} = this.container.querySelector('[data-testid="save-button"]');
  
  if (estado === 'normal') {
    assert.ok(!classList.contains('waiting'), JSON.stringify(classList));
  } else {
    assert.ok(classList.contains('waiting'), JSON.stringify(classList));
  }
});