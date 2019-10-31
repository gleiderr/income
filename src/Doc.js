import React, { useState, useEffect, useMemo, useRef } from "react";
import showdown from 'showdown';
import Switch from '@material/react-switch';
import Button from '@material/react-button';

export default function Doc(props) {
  const {inventionListener, inventionSave, showHeader} = props;
  const [view, setView] = useState(true)
  const [markdown, setMarkdown] = useState(``);

  useEffect(() => inventionListener(setMarkdown), [inventionListener,setMarkdown])

  const header = !showHeader ? null : (
    <div style={{display: 'flex', padding: '8px', }}>
      <label htmlFor='my-switch' style={{marginRight: '12px'}}>Visualizar</label>
      <Switch checked={view} nativeControlId='my-switch'
        onChange={(e) => setView(e.target.checked)} />
      <Button raised style={{marginLeft: 'auto'}}
        onClick={() => inventionSave(markdown)} >
        Salvar
      </Button>
    </div>
  );
  
  return (
    <>
      {header}
      <div style={{flexGrow: 1, overflow: 'auto', padding: '8px',}}>
        {view ? <View {...{markdown}} /> : <Markdown {...{markdown, setMarkdown}} />}
      </div>
    </>
  );
}

function Markdown(props) {
  const {markdown, setMarkdown} = props;
  return (
    <div contentEditable suppressContentEditableWarning 
      onBlur={(evt) => setMarkdown(evt.target.innerText)}
      style={{
        whiteSpace:'pre-wrap', 
        WebkitUserModify: 'read-write', 
        overflowWrap: 'break-word', 
        lineBreak: 'after-white-space',
        lineHeight: '1em',
        fontFamily: 'monospace',
        display: 'inline-block',
      }}>
      {markdown}
    </div>
  );
}

function View(props) {
  const {markdown} = props;
  const converter = new showdown.Converter({strikethrough: true});
  converter.setFlavor('github');
  const html = converter.makeHtml(markdown);
  return <div className='income-doc' dangerouslySetInnerHTML={{__html: html}} />;
}