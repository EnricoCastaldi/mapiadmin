import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './AddStudent.css'; // Import the new CSS file

const AddStudent = () => {
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [cardType, setCardType] = useState('legitymacja studencka ELS');
  const [cardID, setCardID] = useState('');
  const [QRCode, setQRCode] = useState('');
  const [status, setStatus] = useState('ACTIVE');
  const [kompania, setKompania] = useState('1');
  const navigate = useNavigate();
  
  useEffect(() => {
    const sessionData = JSON.parse(localStorage.getItem('sessionData'));
    if (!sessionData || (sessionData.permission !== 'Admin' && sessionData.permission !== 'SuperUser')) {
      navigate('/admin');
      toast.error('Brak dostępu');
    }
  }, [navigate]);

  const handleAddStudent = async (e) => {
    e.preventDefault();
    
    if (!name || !surname || !cardType || !cardID || !QRCode || !status || !kompania) {
      toast.error('Proszę wypełnić wszystkie pola');
      return;
    }

    const sessionData = JSON.parse(localStorage.getItem('sessionData'));
    if (!sessionData || !sessionData.token) {
      toast.error('Brak tokenu uwierzytelniającego. Proszę się zalogować.');
      return;
    }

    try {
      const response = await axios.post('https://mapi-api.onrender.com/students', {
        name,
        surname,
        cardType,
        cardID,
        QRCode,
        status,
        kompania
      }, {
        headers: {
          'Authorization': `Bearer ${sessionData.token}`
        }
      });

      toast.success('Student został dodany pomyślnie');
      // Clear form fields
      setName('');
      setSurname('');
      setCardType('legitymacja studencka ELS');
      setCardID('');
      setQRCode('');
      setStatus('ACTIVE');
      setKompania(sessionData.permission === 'SuperUser' ? '1' : sessionData.kompania);
    } catch (error) {
      toast.error('Wystąpił błąd podczas dodawania studenta!');
      console.error('Wystąpił błąd podczas dodawania studenta!', error);
    }
  };

  const sessionData = JSON.parse(localStorage.getItem('sessionData'));

  return (
    <div className="container mt-5">
      <h2>Dodaj Studenta</h2>
      <form onSubmit={handleAddStudent}>
        <div className="form-row">
          <div className="form-group col-md-6">
            <label htmlFor="name">Imię</label>
            <input 
              type="text" 
              className="form-control"
              id="name"
              placeholder="Imię" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              required
            />
          </div>
          <div className="form-group col-md-6">
            <label htmlFor="surname">Nazwisko</label>
            <input 
              type="text" 
              className="form-control"
              id="surname"
              placeholder="Nazwisko" 
              value={surname} 
              onChange={(e) => setSurname(e.target.value)} 
              required
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group col-md-6">
            <label htmlFor="cardType">Typ karty</label>
            <select
              className="form-control"
              id="cardType"
              value={cardType}
              onChange={(e) => setCardType(e.target.value)}
              required
            >
              <option value="legitymacja studencka ELS">legitymacja studencka ELS</option>
              <option value="type1">type1</option>
              <option value="type2">type2</option>
              <option value="type3">type3</option>
            </select>
          </div>
          <div className="form-group col-md-6">
            <label htmlFor="cardID">Karta ID</label>
            <input 
              type="text" 
              className="form-control"
              id="cardID"
              placeholder="Karta ID" 
              value={cardID} 
              onChange={(e) => setCardID(e.target.value)} 
              required
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group col-md-6">
            <label htmlFor="QRCode">Kod QR</label>
            <input 
              type="text" 
              className="form-control"
              id="QRCode"
              placeholder="Kod QR" 
              value={QRCode} 
              onChange={(e) => setQRCode(e.target.value)} 
              required
            />
          </div>
          <div className="form-group col-md-6">
            <label htmlFor="status">Osoba aktywna</label>
            <select
              className="form-control"
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              required
            >
              <option value="ACTIVE">ACTIVE</option>
              <option value="NOT ACTIVE">NOT ACTIVE</option>
            </select>
          </div>
        </div>
        <div className="form-row">
          <div className="form-group col-md-6">
            <label htmlFor="kompania">Kompania</label>
            <select
              className="form-control"
              id="kompania"
              value={kompania}
              onChange={(e) => setKompania(e.target.value)}
              required
              disabled={sessionData.permission !== 'SuperUser'}
            >
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </select>
          </div>
        </div>
        <button type="submit" className="btn btn-primary">Dodaj Studenta</button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default AddStudent;
