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

  //Mock: salvamento seletivo do markdown no banco de dados
  this.markdown = undefined;
  this.confirmar = undefined;
  this.inventionSave = (markdown) => {
    this.markdown = markdown;
    callListeners();
    return new Promise((resolve, reject) => {
      this.confirmar = resolve;
    });
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

When('a documentação for exibida', function () {
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
    this.confirmar();
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