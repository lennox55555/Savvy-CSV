import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { BrowserRouter } from 'react-router-dom';
import './firebase/firebase-init';
import { getAuth, setPersistence, browserLocalPersistence } from 'firebase/auth';

const auth = getAuth();
setPersistence(auth, browserLocalPersistence)
  .then(() => {

    ReactDOM.createRoot(document.getElementById('root')!).render(
      <React.StrictMode>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </React.StrictMode>,
    )
  })
  .catch((error) => {
    console.error("Error setting persistence", error)
  })
