//https://github.com/NguyenAndrew/Enzyme-Cucumber-React
//https://github.com/testing-library/react-testing-library
const { JSDOM } = require('jsdom');
const React = require('react');
const ReactDOM = require("react-dom");
const Chat = require('../../src/Chat');
const { render } = require('@testing-library/react');
const {Given, When} = require('cucumber');

//https://github.com/NguyenAndrew/Enzyme-Cucumber-React
const {window} = new JSDOM(`<!DOCTYPE html><body></body></html>`);
global.window = window;
global.document = window.document;

Given('que o usuário está conectado', function () {
    // Write code here that turns the phrase above into concrete actions
    //const div = document.createElement('div');
    const a = render(<Chat />);

    return 'pending';
});

When('o digitar a mensagem {string}', function (string) {
    // Write code here that turns the phrase above into concrete actions
    return 'pending';
});