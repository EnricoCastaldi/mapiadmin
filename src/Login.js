import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Login.css'; // Import the CSS file
import logo from './assets/logo.png';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  
  useEffect(() => {
    const sessionData = localStorage.getItem('sessionData');
    if (sessionData) {
      navigate('/admin');
    }
  }, [navigate]);

  const handleLogin = async () => {
    if (email && password) {
      try {
        const response = await fetch('https://mapi-api.onrender.com/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email, password })
        });

        const data = await response.json();
        if (data.success) {
          const { token, user } = data;
          const sessionData = {
            token,
            id: user.id, // Ensure id is stored
            name: user.name,
            surname: user.surname,
            kompania: user.kompania,
            permission: user.permission
          };

          // Store session data in localStorage
          localStorage.setItem('sessionData', JSON.stringify(sessionData));

          // Log session values
          console.log('Session Data:', sessionData);

          // Show success toast
          toast.success('Logowanie zakończone sukcesem! Przekierowanie do panelu administracyjnego...');

          // Navigate to admin page
          setTimeout(() => {
            navigate('/admin');
          }, 2000); // Delay navigation to show the toast
        } else {
          toast.error(data.message || 'Nieprawidłowy e-mail lub hasło');
        }
      } catch (error) {
        console.error('Error logging in:', error);
        toast.error('Wystąpił błąd podczas logowania.');
      }
    } else {
      toast.warn('Proszę podać adres e-mail i hasło');
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <img src={logo} alt="Logo" className="login-logo" />
        <input 
          type="text" 
          placeholder="Email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          className="login-input"
        />
        <input 
          type="password" 
          placeholder="Hasło" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          className="login-input"
        />
        <button onClick={handleLogin} className="login-button">Zaloguj sie</button>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Login;
