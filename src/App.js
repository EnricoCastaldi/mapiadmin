import React from 'react';
import { Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  <ToastContainer />
  return <Navigate to="/login" />;
}

export default App;
