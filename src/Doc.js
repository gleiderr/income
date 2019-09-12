import React, { useState, useEffect, useMemo, useRef } from "react";
import showdown from 'showdown';

export default function Doc(pros) {
  const [view, setView] = useState(false)
  const [markdown, setMarkdown] = useState(
`# INCOME (11%)
INvention & COmunication gaME

**Características:**
- Login de usuários (80%)
- Chat de contexto (75%)
- Painel de valores (60%)
- Layout Responsivo (Celular, desktop e tablet, nessa ordem) (60%)
- Documentação MarkDown (50%) ~~(fazer diretament com HTML no banco de dados agora)~~
  - https://github.com/showdownjs/showdown
- ~Documentação HTML no banco de dados (50%)~
- ~Contagem de Estrelas e Cliques (50%)~(o que importa realmente é o engajamento na comunicação)
- ~Edição de projetos pelo administrador (50%)~(fazer diretamente no banco de dados)

Os percentuais são qualitativos e referem-se ao sentimento probabilidade de entrega.
A probabilidade geral refere-se ao produto das probabilidades.

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).`);
  
  return (
    <>
      <button onClick={() => setView(v => !v)} style={{position: 'absolute', right: 0}}>
        {view ? 'Markdown' : 'Visualisar'}
      </button>
      {view ? <View {...{markdown}} /> : <Markdown {...{markdown, setMarkdown}} />}
    </>
  );
}

function Markdown(props) {
  const {markdown, setMarkdown} = props;
  return (
    <div contentEditable suppressContentEditableWarning
      onBlur={(evt) => setMarkdown(evt.target.innerText)}
      style={{whiteSpace:'pre-wrap', 
              WebkitUserModify: 'read-write', 
              overflowWrap: 'break-word', 
              lineBreak: 'after-white-space', 
              fontFamily: 'monospace'}}>
      {markdown}
    </div>
  );
}

function View(props) {
  const {markdown} = props;
  const converter = new showdown.Converter({strikethrough: true});
  converter.setFlavor('github');
  const html = converter.makeHtml(markdown);
  return <div dangerouslySetInnerHTML={{__html: html}} />;
}