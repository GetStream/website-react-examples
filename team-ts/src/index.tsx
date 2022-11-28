import React from 'react';
import App from './App';
import { createRoot } from 'react-dom/client';

import './styles/index.scss';

createRoot(document.getElementById('root')!).render(
  // <React.StrictMode>
    <App />
  // </React.StrictMode>,
);