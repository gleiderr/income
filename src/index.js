import React from "react";
import ReactDOM from "react-dom";
//import firebase from "firebase";
//import SignInScreen from "./SignInScreen";
import Chat from './Chat';
//import './index.css';
//import App from "./App";
//import * as serviceWorker from "./serviceWorker";

const rootElement = document.querySelector("#root");
//ReactDOM.render(<SignInScreen />, rootElement);
ReactDOM.render(<Chat context='Teste' />, rootElement);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
//serviceWorker.unregister();
