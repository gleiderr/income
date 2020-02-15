import React, { useState, useEffect, useRef } from 'react';
import showdown from 'showdown';
import Switch from '@material/react-switch';
import Button from '@material/react-button';

export default function Doc(props) {
  const { inventionListener, inventionSave, showHeader } = props;
  const [view, setView] = useState(true);
  const [markdown, setMarkdown] = useState(``);
  const [waiting, wait] = useState('');

  useEffect(() => inventionListener(setMarkdown), [
    inventionListener,
    setMarkdown,
  ]);

  const header = !showHeader ? null : (
    <div style={{ display: 'flex', padding: '8px' }}>
      <label htmlFor='my-switch' style={{ marginRight: '12px' }}>
        Visualizar
      </label>
      <Switch
        checked={view}
        nativeControlId='my-switch'
        data-testid='switch'
        onChange={e => setView(e.target.checked)}
      />
      <Button
        data-testid='save-button'
        className={waiting}
        raised
        style={{ marginLeft: 'auto' }}
        onClick={() => {
          wait('waiting');
          inventionSave(markdown).then(() => wait(''));
        }}
      >
        Salvar
      </Button>
    </div>
  );

  return (
    <>
      {header}
      <div id='doc-container'>
        {view ? (
          <View {...{ markdown }} />
        ) : (
          <Markdown {...{ markdown, setMarkdown }} />
        )}
      </div>
    </>
  );
}

function Markdown(props) {
  const { markdown, setMarkdown } = props;
  const input = useRef(null);
  return (
    <div
      id='markdown-editor'
      contentEditable
      suppressContentEditableWarning
      ref={input}
      data-testid='markdown'
      onBlur={evt => setMarkdown(evt.target.innerText)}
    >
      {markdown}
    </div>
  );
}

function View(props) {
  const { markdown } = props;
  const converter = new showdown.Converter({ strikethrough: true });
  converter.setFlavor('github');
  const html = converter.makeHtml(markdown);
  //console.log('render view', html);
  return (
    <div
      className='income-doc'
      data-testid='view'
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
