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

When('o desenvolvedor desabilitar a visualização', function () {
  const chave = this.container.querySelector('[data-testid="switch"]');
  act(() => {
    Simulate.change(chave, { target: {checked: false} });
  })
  
  const checkbox = chave.querySelector('#my-switch');
  assert.strictEqual(checkbox.checked, false, 
                     `O check box deveria conter "false". Checkbox: ${checkbox.outerHTML}`);
});

When('digitar o texto markdown', function () {
  const markdown = this.container.querySelector('[data-testid="markdown"]');
  const texto = this.texto;

  act(() => {
    markdown.innerHTML = texto;
    Simulate.blur(markdown);
  });
  
  
  console.log({
    texto,
    markdown: markdown.outerHTML
  });
});