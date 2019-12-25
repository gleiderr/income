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
 
 export default function Chat({sendMsg, msgsListener, autor} = {}) {
  const [texto, escrever] = useState('');
  const [autoScroll, setAutoScroll] = useState(true); 

  const input = useRef(null);
  const autoResize = () => {
    //Posterga alterações na altura para próximos eventloops
    Promise.resolve()
      .then(() => {
        const {inputElement} = input.current;
        inputElement.style.height = 'auto'; //necessário para diminuição da caixa de texto
      }).then(() => {
        const {inputElement} = input.current;
        inputElement.style.height = inputElement.scrollHeight + 'px';
      });
  };
  const changeInput = value => {
    escrever(value);
    autoResize();
  };

  const send = () => {
    setAutoScroll(true);

    const textoEnviado = texto; //memorização do texto enviado
    changeInput(''); //limpeza do campo
    sendMsg(texto, autor)
      .catch(() => changeInput(textoEnviado)); //restaura texto enviado se erro
  }
  
  //Atualiza lista de mensagens
  const [msgList, setMsgs] = useState([]);
  useEffect(() => {
    return msgsListener(setMsgs);
  }, [msgsListener, setMsgs]);

  const lineHeight = 20;
  const padding = 0; 
  
  return (
    <>
      <MessageList key={''} {...{msgList, autoScroll, setAutoScroll}} />
      <div style={{display: 'flex'}}>
        <TextField id='MessageInput' className='MessageInput' label='Sua mensagem' outlined textarea style={{ flex: 1, height: 'auto', margin: '8px'}} >
          <Input rows='1' value={texto} ref={input}
                 data-testid="input" 
                style={{
                  margin: '8px',
                  padding: `${padding}px`,
                  lineHeight: `${lineHeight}px`,
                  height: `${padding + lineHeight}px`, 
                  maxHeight: `${padding + 4 * lineHeight}px`,
                  resize: 'none',
                }}
                onChange={(e) => changeInput(e.currentTarget.value)} />
        </TextField>
        <Fab mini icon={<MaterialIcon icon="send"/> }
             data-testid="send"
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

function MessageList({msgList, autoScroll, setAutoScroll}) {
  const fim = useRef(null);
  const lista = useRef(null);

  const divMsgs = msgList.map((msg) => {
    return <Mensagem key={msg.id} msg={msg} />
  });

  const scrollDown = () => {
    fim.current && 
        fim.current.scrollIntoView && 
        fim.current.scrollIntoView({behavior: "smooth"});
  };

  useEffect(() => {
    if (autoScroll)
      scrollDown();
  });

  useEffect(() => {
    //exibir botão nova mensagem abaixo
  }, [msgList]);

  return (
    <div className={'teste'} data-testid="msg-list" ref={lista} 
         style={{
           flexGrow: 1, overflow: 'auto', position: 'relative'
         }}
         onScroll={({target}) => {
           const {bottom: bottomList} = target.getBoundingClientRect();
           const { bottom: bottomFim } = fim.current.previousSibling.getBoundingClientRect();
           setAutoScroll(Math.abs(bottomFim - bottomList) < 20);
         }}
         >
      {divMsgs}
      <div ref={fim}></div>
      <Fab id="scroll-down" mini 
           icon={<MaterialIcon icon="expand_more"/> }
           onClick={() => scrollDown()} />
    </div>
  );
}

function Mensagem({msg}) {
  return (
    <Card outlined={false} style={{margin: '8px'}} data-testid="mensagem">
      <CardPrimaryContent style={{padding: '0px 4px'}}>
        <div data-testid="autor" style={{fontWeight: 'bold'}} >{msg.autor}</div>
        <div className="msg-text" data-testid="texto">{msg.texto}</div>
      </CardPrimaryContent>
    </Card>
  );
}