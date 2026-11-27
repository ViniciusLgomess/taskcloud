import React from 'react';
import ReactDOM from 'react-dom/client';
import { Amplify } from 'aws-amplify';
import { I18n } from 'aws-amplify/utils';
import { Authenticator, translations } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import outputs from '../amplify_outputs.json';
import App from './App';
import './styles.css';

Amplify.configure(outputs);
I18n.putVocabularies(translations);
I18n.setLanguage('pt');

const Header = () => (
  <div className="auth-header">
    <div className="logo-mark">✓</div>
    <h1>TaskCloud</h1>
    <p>Gerenciador inteligente de tarefas</p>
  </div>
);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <div className="auth-wrap">
      <Authenticator components={{ Header }}>
        {({ signOut, user }) => <App signOut={() => signOut?.()} email={user?.signInDetails?.loginId ?? ''} />}
      </Authenticator>
    </div>
  </React.StrictMode>,
);
