import React, { useMemo } from 'react';
import firebase from 'firebase';

import { Button } from '@material/react-button';
import MaterialIcon from '@material/react-material-icon';
import TopAppBar, {
  TopAppBarRow,
  /*TopAppBarFixedAdjust,
  TopAppBarIcon,
  TopAppBarSection,
  TopAppBarTitle,*/
} from '@material/react-top-app-bar';
import { SignInChat } from './SignInScreen';

export function ChatHeader({ user, sign_in, open_sign_in, hideChat }) {
  const docLink = (
    <Button
      id='fab-docs'
      onClick={() => hideChat()}
      style={{
        margin: 'auto 8px auto auto',
        marginLeft: 'auto',
        background: 'var(--mdc-theme-secondary)',
        color: 'var(--mdc-theme-on-secondary)',
        borderColor: 'var(--mdc-theme-on-primary, #ffffff)',
      }}
      icon={<MaterialIcon icon='description' />}
    >
      Documentação
    </Button>
  );

  const style = {
    color: 'var(--mdc-theme-on-primary, #ffffff)',
    borderColor: 'var(--mdc-theme-on-primary, #ffffff)',
    margin: 'auto 8px',
  };
  const button = !!user ? (
    <Button outlined style={style} onClick={() => firebase.auth().signOut()}>
      Desconectar
    </Button>
  ) : (
    <Button
      outlined
      style={style}
      onClick={() => open_sign_in(!sign_in)}
      trailingIcon={
        <MaterialIcon icon={sign_in ? 'arrow_drop_up' : 'arrow_drop_down'} />
      }
    >
      {sign_in ? 'Cancelar' : 'Conectar'}
    </Button>
  );

  //const sigInChat = useMemo(() => <SignInChat user={user} />, [user]) ;

  return (
    <TopAppBar style={{ position: 'static' }}>
      <TopAppBarRow>
        {button}
        {docLink}
      </TopAppBarRow>
      {sign_in && !user ? <SignInChat user={user} /> : null}
    </TopAppBar>
  );
}
