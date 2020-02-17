import firebase from 'firebase';

/**Arquivo json no formato:
 * {
 *   "uid": "sssss",
 *   "nome": "aaaaa"
 * }
 */
import user from './test/user.json';
/** aguardando uma próxima versão que trabalhe do lado do cliente e não somente
 * do lado do servidor como essa versão 0.16.8 */
//import {initializeTestApp} from "@firebase/testing";

let app = undefined;
export default function firebase_init() {
  if (app) return app;

  const firebaseConfig = {
    apiKey: 'AIzaSyCI77PrVU6FyFQN9OQhF8uo2ypHZQTQqSM',
    authDomain: 'gleider-dev.firebaseapp.com',
    databaseURL: 'https://gleider-dev.firebaseio.com',
    projectId: 'gleider-dev',
    storageBucket: '',
    messagingSenderId: '868861057308',
    appId: '1:868861057308:web:72ab5d4b1e875ce7',
  };

  // Initialize Firebase
  app = firebase.initializeApp(firebaseConfig);

  /**
   * $ npm install -g firebase-tools
   * $ firebase loging
   * $ firebase emulators:start --only firestore,functions
   *
   * https://firebase.google.com/docs/rules/unit-tests
   * https://firebase.google.com/docs/firestore/security/test-rules-emulator
   * https://github.com/firebase/quickstart-nodejs/tree/master/firestore-emulator/javascript-quickstart
   */
  if (window.location.hostname !== 'gleider.ml') {
    app.firestore().settings({
      host: 'localhost:3081',
      ssl: false,
    });

    criarUsuárioAdministrador();

    function criarUsuárioAdministrador() {
      app
        .firestore()
        .collection('usuarios')
        .doc(user.uid)
        .set(user);
    }
  }
  return app;
}
