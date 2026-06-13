import React from 'react';
<<<<<<< HEAD
import { createRoot } from 'react-dom/client';
import App from './App';
import { AuthProvider } from './context/AuthContext';

createRoot(document.getElementById('root')).render(
=======
import ReactDOM from 'react-dom';
import App from './App';
import { AuthProvider } from './context/AuthContext';

ReactDOM.render(
>>>>>>> d61fee6a42e4e5bd62def9e14e836c4c40be724b
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
<<<<<<< HEAD
  </React.StrictMode>
=======
  </React.StrictMode>,
  document.getElementById('root')
>>>>>>> d61fee6a42e4e5bd62def9e14e836c4c40be724b
);
