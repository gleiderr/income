import React from 'react';
import { useParams } from 'react-router-dom';

import { Fab } from '@material/react-fab';
import { Cell } from '@material/react-layout-grid';
import MaterialIcon from '@material/react-material-icon';

import Doc from './Doc';
import Chat from './Chat';

export default function DocChat({
  user,
  displayChat,
  setChatDisplay,
  inventionSave,
  inventionListener,
  sendMsg,
  msgsListener,
}) {
  const displayDoc = displayChat == 'none' ? 'flex' : 'none';
  const { contexto = 'income' } = useParams();

  return (
    <>
      <Cell
        id='incomedocs'
        phoneColumns={12}
        tabletColumns={12}
        desktopColumns={8}
        style={{ display: displayDoc }}
      >
        <Doc
          showHeader={!!user && user.papel === 'administrador'}
          inventionSave={markdown => inventionSave(markdown, contexto)}
          inventionListener={setMarkdown =>
            inventionListener(contexto, setMarkdown)
          }
        />

        <Fab
          id='fab-chat'
          textLabel='Chat'
          style={{ display: displayChat === 'none' ? 'block' : 'none' }}
          icon={<MaterialIcon icon='chat' />}
          onClick={() => setChatDisplay('flex')}
        />
      </Cell>
      <Cell
        id='incomechat'
        phoneColumns={12}
        tabletColumns={12}
        desktopColumns={4}
        style={{
          display: displayChat,
          position: 'relative',
        }}
      >
        <Chat
          autor={user}
          sendMsg={(...params) => sendMsg(...params, contexto)}
          msgsListener={(...params) => msgsListener(...params, contexto)}
        />
      </Cell>
    </>
  );
}
