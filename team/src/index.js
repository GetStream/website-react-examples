import React from 'react';
import ReactDOM from 'react-dom';
import * as Sentry from '@sentry/react';
import App from './App';
import * as serviceWorker from './serviceWorker';

if (process.env.NODE_ENV === 'production') {
  Sentry.init({
    dsn: 'https://cfe9b30508b44e40908da83aee0743e9@o389650.ingest.sentry.io/5556314',
    integrations: [new Sentry.BrowserTracing()],
    tracesSampleRate: 1.0,
  });
}
ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
