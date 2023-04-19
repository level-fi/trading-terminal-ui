import '@unocss/reset/eric-meyer.css';

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import 'uno.css';
import 'react-datepicker/dist/react-datepicker.css';
import Modal from 'react-modal';

Modal.setAppElement('#root');
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
