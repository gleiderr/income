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
 *  }
 * 
 * @example Modelo de Dados de Usuários 
 * 'uid': {
 *    papel: 'administrador'
 * }
 */
 
 export default function Chat(props) {
  const {sendMsg, msgsListener} = props || {};
  const {autor} = props || {};

  const [msgList, setMsgs] = useState([]);
  const [texto, escrever] = useState('');
  const [alertas, setAlertas] = useState([]);

  const keyDownHandle = evt => {
    if (evt.key === "Enter") {
      evt.persist();
      sendMsg(evt.target.value, autor)
        .then(escrever('')) //Limpa o campo
        .catch(alerta => {
          console.log('alertou');
          setAlertas(a => a.push(alerta))}); 
    }
  };

  //Atualiza lista de mensagens
  useEffect(() => {
    return msgsListener(setMsgs);
  }, [msgsListener, setMsgs]);
  
  return (
    <>
      {alertas}
      <MessageList {...{msgList}} />
      <TextField label='Sua mensagem' outlined style={{height: '40px', margin: '8px'}}>
        <Input style={{height: '40px'}} onKeyDown={keyDownHandle}
              value={texto} onChange={(e) => escrever(e.currentTarget.value)} />
      </TextField>
      
    </>
  );
}

function MessageList({msgList}) {
  const divMsgs = msgList.map(msg => 
    <Mensagem key={msg.id} msg={msg} />
  );

  return (
    <div className={'teste'} style={{flexGrow: 1, overflow: 'auto'}}>
      {divMsgs}
    </div>
  );
}

function Mensagem({msg}) {
  return (
    <Card outlined={false} style={{margin: '8px', maxWidth: 'fit-content'}}     
          className={'income-theme'} data-testid="mensagem">
      <CardPrimaryContent>
        <div data-testid="autor">{msg.autor}</div>
        <div data-testid="texto">{msg.texto}</div>
      </CardPrimaryContent>
    </Card>
  );
}