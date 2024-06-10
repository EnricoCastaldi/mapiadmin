import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './AddUser.css'; // Reuse the same CSS file

const AddUser = () => {
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [permission, setPermission] = useState('User'); // Default permission can be 'User'
  const [kompania, setKompania] = useState('1'); // Default to '1'

  const sessionData = JSON.parse(localStorage.getItem('sessionData'));
  console.log('Session Data:', sessionData);

  useEffect(() => {
    if (sessionData && sessionData.permission === 'Admin') {
      setKompania(sessionData.kompania);
      setPermission('User'); // Admins can only add users
    }
  }, [sessionData]);

  const handleAddUser = () => {
    console.log('Adding User with details:', { name, surname, email, password, permission, kompania });

    if (!name || !surname || !email || !password || !permission || !kompania) {
      console.log('Validation Error: All fields are required.');
      toast.error('Wszystkie pola są wymagane!');
      return;
    }

    if (!sessionData || !sessionData.token) {
      console.log('Validation Error: No authentication token found.');
      toast.error('Brak tokenu uwierzytelniającego. Proszę się zalogować.');
      return;
    }

    axios.post('https://mapi-api.onrender.com/users', {
      name,
      surname,
      email,
      password,
      permission,
      kompania
    }, {
      headers: {
        'Authorization': `Bearer ${sessionData.token}`
      }
    }).then(response => {
      console.log('User added successfully:', response.data);
      toast.success('Użytkownik został dodany pomyślnie');
      // Clear form after success
      setName('');
      setSurname('');
      setEmail('');
      setPassword('');
      setPermission('User');
      setKompania('1');
    }).catch(error => {
      console.error('Error adding user:', error);
      toast.error('Wystąpił błąd podczas dodawania użytkownika!');
    });
  };

  return (
    <div className="container">
      <h2>Dodaj Użytkownika</h2>
      <div className="form-row">
        <div className="form-group">
          <label>Imię</label>
          <input 
            type="text" 
            placeholder="Imię" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            className="form-control"
            required
          />
        </div>
        <div className="form-group">
          <label>Nazwisko</label>
          <input 
            type="text" 
            placeholder="Nazwisko" 
            value={surname} 
            onChange={(e) => setSurname(e.target.value)} 
            className="form-control"
            required
          />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input 
            type="email" 
            placeholder="Email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            className="form-control"
            required
          />
        </div>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label>Hasło</label>
          <input 
            type="password" 
            placeholder="Hasło" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            className="form-control"
            required
          />
        </div>
        <div className="form-group">
          <label>Uprawnienia</label>
          <select 
            value={permission} 
            onChange={(e) => setPermission(e.target.value)}
            className="form-control"
            required
            disabled={sessionData && sessionData.permission === 'Admin'}
          >
            <option value="SuperUser">SuperUser</option>
            <option value="User">User</option>
            <option value="Admin">Admin</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="kompania">Kompania</label>
          <select
            className="form-control"
            id="kompania"
            value={kompania}
            onChange={(e) => setKompania(e.target.value)}
            required
            disabled={sessionData && sessionData.permission === 'Admin'}
          >
            <option value="Wszystkie">Wszystkie</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
          </select>
        </div>
      </div>
      <button onClick={handleAddUser} className="btn btn-primary">Dodaj Użytkownika</button>
      <ToastContainer />
    </div>
  );
};

export default AddUser;
