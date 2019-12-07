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
  const callListeners = () => listeners.foreach(listener => listener());

  this.inventionSave = (markdown) => {
    this.markdown = markdown;
    callListeners();
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

When('o desenvolvedor habilitar a edição', function () {
  let chave = this.container.querySelector('[data-testid="switch"]');
  let checkbox = chave.querySelector('#my-switch');
  act(() => {
    Simulate.change(chave, {target: {checked: true}});
  })

  assert.strictEqual(checkbox.checked, true, `O check box deveria conter "true". Checkbox: ${checkbox.outerHTML}`);
});

When('digitar o texto markdown', function () {
  console.log({texto: this.container.innerHTML});
  return 'pending';
});