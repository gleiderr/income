import React, { useState, useEffect } from "react";
import Card, {
  CardPrimaryContent,
  CardMedia,
  CardActions,
  CardActionButtons,
  CardActionIcons, 
} from "@material/react-card";
import TextField, {HelperText, Input} from '@material/react-text-field';

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
  const [texto, escrever] = useState('');

  const keyDownHandle = evt => {
    if (evt.key === "Enter") {
      evt.persist();
      sendMsg(evt.target.value, autor, destinatários)
        .then(escrever('')) //Limpa o campo
        .catch(console.log); 
    }
  };

  //Atualiza lista de mensagens
  useEffect(() => {
    return msgsListener(setMsgs, autor);
  }, [msgsListener, setMsgs, autor]);
  
  return (
    <>
      {/*<div>Comunicação ({userRole})</div>*/}
      {alertas}
      {/*<SignInChat logged={logged} setLogin={status => setLogin(status)}/>*/}
      <MessageList {...{msgList, onReaded: onMsgReaded, usuário: autor}} />
      <TextField label='Sua mensagem' outlined style={{height: '40px', margin: '8px'}}>
        <Input style={{height: '40px'}} onKeyDown={keyDownHandle}
              value={texto} onChange={(e) => escrever(e.currentTarget.value)} />
      </TextField>
      
    </>
  );
}

function MessageList({msgList, onReaded, usuário}) {
  const divMsgs = msgList.map(msg => 
    <Mensagem key={msg.id} msg={msg} onReaded={onReaded} usuário={usuário} />
  );

  return (
    //flex-grow: 1
    <div className={'teste'} style={{flexGrow: 1, overflow: 'auto'}}>
      {divMsgs}
    </div>
  );
}

function Mensagem({msg, onReaded, usuário}) {
  const [lida, ler] = useState(msg.leituras && msg.leituras[usuário]);

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
  useEffect(() => {
    if (msg.autor && !lida) {
      onReaded(msg, usuário);
      ler(true);
    }
  }, [onReaded, msg, usuário, lida]);
  
  //console.log(msg);

  return (
    <Card outlined={false} style={{margin: '8px', maxWidth: 'fit-content'}}     
          className={'income-theme'} data-testid="mensagem">
      <CardPrimaryContent>
        <div data-testid="autor">{msg.autor}</div>
        <div data-testid="texto">{msg.texto}</div>
        <div>
          <span>Entregue: </span> 
          <span data-testid="entrega">{msg.timestamp}</span>
        </div>
        <div data-testid="leitura">
          {msg.leituras && `${msg.destinatarios[0]} leu em ${Object.values(msg.leituras)[0]}`}
        </div>
      </CardPrimaryContent>
    </Card>
  );
}