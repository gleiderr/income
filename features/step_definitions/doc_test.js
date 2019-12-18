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

Before(function () {
  initDOM();

  const listeners = [];
  const callListeners = () => listeners.forEach(listener => listener());

  this.markdown = undefined;
  this.inventionSave = (markdown) => {
    this.markdown = markdown;
    callListeners();
    return Promise.resolve();
  }

  this.inventionListener = (setMarkdown) => {
    const newListener = () => setMarkdown(this.markdown);
    newListener();
    listeners.push(newListener);
  }
});

Given('o seguinte texto markdown:', function (docString) {
  this.texto = docString;
});

Given('a documentação exibindo o cabeçalho', function () {
  const doc = <Doc showHeader={true}
                    inventionSave={this.inventionSave} 
                    inventionListener={this.inventionListener} />

  this.container = document.createElement('div');
  document.body.appendChild(this.container);
  
  act(() => {
    ReactDOM.render(doc, this.container);
  });
});

When('o desenvolvedor {string} a visualização', function (acao) {
  const chave = this.container.querySelector('[data-testid="switch"]');
  const checked = acao === 'desabilitar' ? false : true;

  //console.log(this.container.innerHTML);
  act(() => {
    Simulate.change(chave, { target: {checked} });
  })

  const checkbox = chave.querySelector('#my-switch');
  assert.strictEqual(checkbox.checked, checked, 
                     `O check box deveria conter "${checked}". Checkbox: ${checkbox.outerHTML}`);
});

When('digitar o texto markdown', function () {
  const markdown = this.container.querySelector('[data-testid="markdown"]');

  act(() => {
    markdown.innerText = this.texto;
    Simulate.blur(markdown);
  });
   
  assert.strictEqual(markdown.innerText, this.texto, 
                     `O conteúdo deveria ser: ${this.texto}`);
});

When('clicar sobre salvar', function () {
  const button = this.container.querySelector('[data-testid="save-button"]');

  act(() => {
    Simulate.click(button);
  });
});

Then('o texto deve ser salvo', function () {
  const {markdown, texto} = this;
  assert.strictEqual(this.markdown, this.texto, `this.markdown: ${this.markdown} deve ser igual a this.texto ${this.texto}.`);

});

Then('o seguinte conteúdo deve ser exibido:', function (conteudo) {
  
});