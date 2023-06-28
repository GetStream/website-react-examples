import React from 'react';
import App from './App';
import * as Sentry from '@sentry/react';
import { createRoot } from 'react-dom/client';

import './styles/index.scss';

Sentry.init({
  dsn: 'https://cfe9b30508b44e40908da83aee0743e9@o389650.ingest.sentry.io/5556314',
  integrations: [new Sentry.BrowserTracing()],
  tracesSampleRate: 1.0,
});

createRoot(document.getElementById('root')!).render(
  // <React.StrictMode>
  <App />,
  // </React.StrictMode>,
);
