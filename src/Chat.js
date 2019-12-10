import React, { useState, useEffect, useRef } from "react";
import { Button } from '@material/react-button';
import MaterialIcon from '@material/react-material-icon';
import { Fab } from '@material/react-fab';
import Card, {
  CardPrimaryContent,
  /*CardMedia,
  CardActions,
  CardActionButtons,
  CardActionIcons, */
} from "@material/react-card";
import TextField, {/*HelperText, */Input} from '@material/react-text-field';

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

  const [texto, escrever] = useState('');

  const send = () => {
    sendMsg(texto, autor)
      .then(() => escrever('')) //Limpa o campo
      .catch(console.error); 
  }
  
  const keyDownHandle = evt => {
    if (evt.key === "Enter") {
      evt.persist();
      send();
    }
  };
  
  //Atualiza lista de mensagens
  const [msgList, setMsgs] = useState([]);
  useEffect(() => {
    return msgsListener(setMsgs);
  }, [msgsListener, setMsgs]);

  const lineHeight = 20;
  const padding = 0;
  
  return (
    <>
      <MessageList {...{msgList}} />
      <div style={{display: 'flex'}}>
        <TextField id='MessageInput' className='MessageInput' label='Sua mensagem' outlined textarea style={{ flex: 1, height: 'auto', margin: '8px'}} >
          <Input rows='1' value={texto} onKeyDown={keyDownHandle}
                style={{
                  margin: '8px',
                  padding: `${padding}px`,
                  lineHeight: `${lineHeight}px`,
                  height: `${padding + lineHeight}px`, 
                  maxHeight: `${padding + 4 * lineHeight}px`,
                  resize: 'none',
                }}
                onChange={(e) => {
                  escrever(e.currentTarget.value);

                  let t = e.currentTarget;
                  t.style.height = 'auto'; //necessário para diminuição da caixa de texto
                  t.style.height = t.scrollHeight + 'px';
                }} />
        </TextField>
        <Fab mini icon={<MaterialIcon icon="send"/> }
             onClick={send}
             style={{
               margin: 'auto',
               marginRight: '8px',
               color: 'var(--mdc-theme-on-primary, #fff)',
               background: 'var(--mdc-theme-primary, #6200ee)'
             }} />
      </div>
    </>
  );
}

function MessageList({msgList}) {
  const fim = useRef(null);
  const lista = useRef(null);
  const [a, as] = useState(true);

  const divMsgs = msgList.map(msg => 
    <Mensagem key={msg.id} msg={msg} />
  );

  //Rolagem das mensagens do chat em função da posição do scroll
  useEffect(() => {
    if (fim.current.previousSibling) {
      const { bottom: bottomList } = lista.current.getBoundingClientRect();
      const { top: topFim } = fim.current.previousSibling.getBoundingClientRect();
      
      console.log(fim.current);
      console.log({bottomList, topFim, a});
      if(a) {
        as(false);
        fim.current.scrollIntoView();
      } else if (topFim - bottomList < 100) {
        fim.current.scrollIntoView({behavior: "smooth"});
      }
    }
  }, [msgList, a]);

  return (
    <div className={'teste'}
         style={{flexGrow: 1, overflow: 'auto', position: 'relative'}}
         ref={lista} >
      {divMsgs}
      <div ref={fim}></div>
      {/*<Fab mini icon={<MaterialIcon icon="expand_more"/> }
          onClick={() => fim.current.scrollIntoView({behavior: "smooth"})}
             style={{
               position: 'absolute',
               bottom: '4px',
               right: '4px',
               background: 'darkgray',
               mixBlendMode: 'multiply',
             }} />*/}
    </div>
  );
}

function Mensagem({msg}) {
  return (
    <Card outlined={false} style={{margin: '8px'}} data-testid="mensagem">
      <CardPrimaryContent style={{padding: '0px 4px'}}>
        <div data-testid="autor" style={{fontWeight: 'bold'}} >{msg.autor}</div>
        <div data-testid="texto">{msg.texto}</div>
      </CardPrimaryContent>
    </Card>
  );
}