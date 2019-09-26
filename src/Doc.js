import React, { useState, useEffect, useMemo, useRef } from "react";
import showdown from 'showdown';

export default function Doc(props) {
  const {inventionListener, inventionSave} = props;
  const [view, setView] = useState(true)
  const [markdown, setMarkdown] = useState(
``);

  useEffect(() => inventionListener(setMarkdown), [inventionListener,setMarkdown])
  
  return (
    <>
      <div style={{position: 'absolute', right: 0}}>
        <button onClick={() => setView(v => !v)} >
          {view ? 'Markdown' : 'Visualizar'}
        </button>
        <button onClick={() => inventionSave(markdown)} >
          Salvar
        </button>
      </div>
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