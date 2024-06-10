import React from 'react';
import { createRoot } from 'react-dom/client'; // Import createRoot from react-dom/client
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import App from './App';
import Login from './Login';
import AdminPanel from './AdminPanel';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

const container = document.getElementById('root');
const root = createRoot(container); // Create a root

root.render(
  <Router>
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/admin/*" element={<AdminPanel />} />
      <Route path="/" element={<App />} />
    </Routes>
  </Router>
);
