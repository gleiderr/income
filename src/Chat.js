const React = require("react");
const { useState, useEffect } = React;
//import { SignInChat } from './SignInScreen';

/**
 * @example Modelo de Dados Mensagens
 * //Ponteiro para identificar usuários
 * //Arranjos para manter flexibilidade, mas sem utilidade atual
 *  'auto_id': {
 *    texto: "minha mensagem",
 *    timestamp: timestamp,
 *    autor: 'GleiderID',
 *    destinatarios: ['DestinatárioID'],
 *    projetos: ['ProjetoID'],
 *    leituras: { 'DestinatárioID': timestamp }, //objeto para manter flexibilidade
 *    msgRespondida: 'msgResp'
 *  }
 * 
 * @example Modelo de Dados de Usuários 
 * 'uid': {
 *    papel: 'administrador'
 * }
 */
module.exports = Chat;
function Chat(props) {
  const {sendMsg, msgsListener, onMsgReaded, alertas} = props || {};

  const [msgList, setMsgs] = useState([]);
  const [userRole, setRole] = useState('normal');
  const [logged, setLogin] = useState(false);

  const keyDownHandle = evt => {
    if (evt.key === "Enter") {
      evt.persist();
      sendMsg(evt.target.value)
        .then(() => evt.target.value = '') //Limpa o campo
        .catch(console.log); 
    }
  };

  //Atualiza lista de mensagens
  useEffect(() => {
    console.log('oi');
    return msgsListener(setMsgs);
  }, [msgsListener, setMsgs]);
  
  const divMsgs = msgList.map(msg => <Mensagem key={msg.id} msg={msg}
                                               onReaded={onMsgReaded} />);
  
  return (
    <>
      <div>Comunicação ({userRole})</div>
      {alertas}
      {/*<SignInChat logged={logged} setLogin={status => setLogin(status)}/>*/}
      {divMsgs}
      <input type="text" onKeyDown={keyDownHandle} />
    </>
  );
}

function Mensagem(props) {
  const {msg, onReaded} = props;

  const p = v => v < 10 ? '0' + v : v;
  const dataHora = timestamp => {
    if (!timestamp) return 'aguardando';
    const date = timestamp.toDate();
    const [ dia, mes, ano ] = [p(date.getDate()), p(date.getMonth()), date.getFullYear()];
    const [ hora, minuto ] = [p(date.getHours()), p(date.getMinutes())];
    return `${dia}/${mes}/${ano} ${hora}:${minuto}`;
  }

  const style = {
    //Alinhamento em função do autor
    textAlign: msg.minha ? 'right' : 'left',
    justifyContent: msg.minha ? 'flex-end' : 'flex-start',

    //Destaque em função do destinatário
    background: msg.para_mim ? 'cadetblue' : 'white',
    display: 'flex',

    wordBreak: 'break-all'
  };

  //Marca mensagem como lida;
  useEffect(() => onReaded(msg), [onReaded, msg]);
  
  return (
    <div style={style}>
      <div style={{borderStyle: 'dashed', borderWidth: '1px'}}>
        <div>{msg.autor}:</div>
        <div>{msg.texto}</div>
        <div>{`Entregue: ${dataHora(msg.timestamp)}`}</div>
        <div>{msg.leituras && JSON.stringify(msg.leituras)}</div>
      </div>
    </div>
  );
}