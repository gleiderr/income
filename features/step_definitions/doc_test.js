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

Given('o texto markdown:', function (docString) {
  this.markdown = docString;
});

Given('a documentação renderizada {string} o cabeçalho', function (cabeçalho) {
  const doc = <Doc showHeader={cabeçalho === 'exibindo'}
                    inventionSave={this.inventionSave} 
                    inventionListener={this.inventionListener} />

  this.container = document.createElement('div');
  document.body.appendChild(this.container);
  
  act(() => {
    ReactDOM.render(doc, this.container);
  });
});

When('habilitar a edição', function () {
  const chave = this.container.querySelector('[data-testid="switch"]');
  act(() => {
    Simulate.click(chave);
  })
});

When('digitar o texto', function () {
  console.log({texto: this.container.innerHTML});
  return 'pending';
});