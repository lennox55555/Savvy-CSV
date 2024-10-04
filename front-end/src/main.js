import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { BrowserRouter } from 'react-router-dom';
import './firebase/firebase-init';
import { getAuth, setPersistence, browserSessionPersistence } from 'firebase/auth';
var auth = getAuth();
setPersistence(auth, browserSessionPersistence)
    .then(function () {
    ReactDOM.createRoot(document.getElementById('root')).render(React.createElement(React.StrictMode, null,
        React.createElement(BrowserRouter, null,
            React.createElement(App, null))));
})
    .catch(function (error) {
    console.error("Error setting persistence", error);
});
