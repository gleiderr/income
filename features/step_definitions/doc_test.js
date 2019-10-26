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

  const inventionSave = (markdown) => {
    this.markdown = markdown;
    callListeners();
  }

  const inventionListener = (setMarkdown) => {
    const newListener = () => setMarkdown(this.markdown);
    newListener();
    listeners.push(newListener);
  }

  const doc = <Doc inventionSave={inventionSave} inventionListener={inventionListener} />
  
  const new_container = document.createElement('div');
  document.body.appendChild(new_container);
  
  act(() => {
    ReactDOM.render(doc, new_container);
  });
});

Given('o markdown:', function (docString) {
  // Write code here that turns the phrase above into concrete actions
  return 'pending';
});