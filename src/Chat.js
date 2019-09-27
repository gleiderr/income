import React, { useState, useEffect } from "react";
//import { SignInChat } from './SignInScreen';
import Card, {
  CardPrimaryContent,
  CardMedia,
  CardActions,
  CardActionButtons,
  CardActionIcons, 
} from "@material/react-card";
import List, {ListItem, ListItemGraphic, ListItemText, ListItemMeta } from '@material/react-list';

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
 
 export default function Chat(props) {
  const {sendMsg, msgsListener, onMsgReaded, alertas} = props || {};
  const {autor, destinatários} = props || {};

  const [msgList, setMsgs] = useState([]);
  const [userRole, setRole] = useState('normal');
  const [logged, setLogin] = useState(false);

  const keyDownHandle = evt => {
    if (evt.key === "Enter") {
      evt.persist();
      sendMsg(evt.target.value, autor, destinatários)
        .then(() => evt.target.value = '') //Limpa o campo
        .catch(console.log); 
    }
  };

  //Atualiza lista de mensagens
  useEffect(() => {
    return msgsListener(setMsgs, autor);
  }, [msgsListener, setMsgs]);
  
  /*const divMsgs = msgList.map(msg => <Mensagem key={msg.id} msg={msg}
                                               onReaded={onMsgReaded} />);*/
  
  return (
    <>
      <div>Comunicação ({userRole})</div>
      {alertas}
      {/*<SignInChat logged={logged} setLogin={status => setLogin(status)}/>*/}
      <MessageList {...{msgList, onReaded: onMsgReaded}}/>
      <input type="text" onKeyDown={keyDownHandle} />
    </>
  );
}

function MessageList({msgList, onReaded}) {
  const divMsgs = msgList.map(msg => <Mensagem key={msg.id} msg={msg}
    onReaded={onReaded} />)

  return (
    <div>
      {divMsgs}
    </div>
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
  
  //<div style={style}></div>
  //<div style={{borderStyle: 'dashed', borderWidth: '1px'}}>
  return (
    <Card outlined={false} style={{margin: '8px', maxWidth: 'fit-content'}}     
          className={'income-theme'} data-testid="mensagem">
      <CardPrimaryContent>
        <div data-testid="autor">{msg.autor}</div>
        <div data-testid="texto">{msg.texto}</div>
        <div>
          <span>Entregue: </span> 
          <span data-testid="entrega">{dataHora(msg.timestamp)}</span>
        </div>
        <div>{msg.leituras && `Lido: ${dataHora(Object.values(msg.leituras)[0])}`}</div>
      </CardPrimaryContent>
    </Card>
  );

  /*return (
    <ListItem>
      <ListItemText primaryText={msg.texto}
                    secondaryText={msg.autor} />
      <ListItemMeta meta={`Entregue: ${dataHora(msg.timestamp)}`}/>
    </ListItem>
  )*/
}