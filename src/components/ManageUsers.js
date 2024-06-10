import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './ManageUsers.css'; // Use appropriate CSS file

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [editingUserId, setEditingUserId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: '',
    surname: '',
    email: '',
    password: '',
    permission: '',
    kompania: ''
  });

  // Filter state
  const [filterEmail, setFilterEmail] = useState('');
  const [filterPermission, setFilterPermission] = useState('');
  const [filterKompania, setFilterKompania] = useState('');

  // Sorting state
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  const sessionData = JSON.parse(localStorage.getItem('sessionData'));

  useEffect(() => {
    if (!sessionData || !sessionData.token) {
      toast.error('Brak tokenu uwierzytelniającego. Proszę się zalogować.');
      return;
    }

    axios.get('https://mapi-api.onrender.com/users', {
      headers: {
        'Authorization': `Bearer ${sessionData.token}`
      }
    })
    .then(response => {
      let usersData = response.data;
      if (sessionData.permission === 'Admin') {
        usersData = usersData.filter(user => user.kompania === sessionData.kompania && user.permission === 'User');
      }
      setUsers(usersData);
    })
    .catch(error => {
      toast.error('Wystąpił błąd podczas pobierania użytkowników!');
      console.error('Wystąpił błąd podczas pobierania użytkowników!', error);
    });
  }, [sessionData]);

  const handleEditClick = (user) => {
    setEditingUserId(user._id); // Use _id if that's the key in MongoDB
    setEditFormData({
      name: user.name,
      surname: user.surname,
      email: user.email,
      password: '', // Do not load password
      permission: user.permission,
      kompania: user.kompania
    });
  };

  const handleCancelClick = () => {
    setEditingUserId(null);
    setEditFormData({
      name: '',
      surname: '',
      email: '',
      password: '',
      permission: '',
      kompania: ''
    });
  };

  const handleSaveClick = (id) => {
    if (!sessionData || !sessionData.token) {
      toast.error('Brak tokenu uwierzytelniającego. Proszę się zalogować.');
      return;
    }
  
    if (sessionData.permission === 'Admin' && (editFormData.kompania !== sessionData.kompania || editFormData.permission !== 'User')) {
      toast.error('Admin może zarządzać tylko użytkownikami w swojej kompanii.');
      return;
    }
  
    const userData = {
      name: editFormData.name,
      surname: editFormData.surname,
      email: editFormData.email,
      permission: editFormData.permission,
      kompania: editFormData.kompania
    };
  
    if (editFormData.password) {
      userData.password = editFormData.password;
    }
  
    axios.put(`https://mapi-api.onrender.com/users/${id}`, userData, {
      headers: {
        'Authorization': `Bearer ${sessionData.token}`
      }
    })
    .then(response => {
      setUsers(prevUsers => prevUsers.map(user => user._id === id ? { ...user, ...userData } : user));
      setEditingUserId(null);
      toast.success('Użytkownik został zaktualizowany pomyślnie');
    })
    .catch(error => {
      toast.error('Wystąpił błąd podczas aktualizacji użytkownika!');
      console.error('Wystąpił błąd podczas aktualizacji użytkownika!', error);
    });
  };
  

  const handleDeleteClick = (id) => {
    if (window.confirm('Czy na pewno chcesz usunąć tego użytkownika?')) {
      if (!sessionData || !sessionData.token) {
        toast.error('Brak tokenu uwierzytelniającego. Proszę się zalogować.');
        return;
      }

      axios.delete(`https://mapi-api.onrender.com/users/${id}`, {
        headers: {
          'Authorization': `Bearer ${sessionData.token}`
        }
      })
      .then(response => {
        setUsers(prevUsers => prevUsers.filter(user => user._id !== id));
        toast.success('Użytkownik został usunięty pomyślnie');
      })
      .catch(error => {
        toast.error('Wystąpił błąd podczas usuwania użytkownika!');
        console.error('Wystąpił błąd podczas usuwania użytkownika!', error);
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({ ...editFormData, [name]: value });
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedUsers = [...users].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  // Apply filters
  const filteredUsers = sortedUsers.filter(user => {
    return (
      (filterEmail === '' || user.email.includes(filterEmail)) &&
      (filterPermission === '' || user.permission === filterPermission) &&
      (filterKompania === '' || user.kompania === filterKompania)
    );
  });

  return (
    <div className="manage-users-container">
      <h2>Zarządzaj Użytkownikami</h2>

      {/* Filter Inputs */}
      <div className="filters">
        <div className="filter-item">
          <label>Email</label>
          <input
            type="text"
            value={filterEmail}
            onChange={(e) => setFilterEmail(e.target.value)}
            className="form-control"
            placeholder="Filtruj według email"
          />
        </div>
        <div className="filter-item">
          <label>Uprawnienia</label>
          <select
            value={filterPermission}
            onChange={(e) => setFilterPermission(e.target.value)}
            className="form-control"
          >
            <option value="">Wszystkie</option>
            <option value="SuperUser">SuperUser</option>
            <option value="User">User</option>
            <option value="Admin">Admin</option>
          </select>
        </div>
        <div className="filter-item">
          <label>Kompania</label>
          <select
            value={filterKompania}
            onChange={(e) => setFilterKompania(e.target.value)}
            className="form-control"
          >
            <option value="">No filter</option>
            <option value="Wszystkie">Wszystkie</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
          </select>
        </div>
      </div>

      <table className="table table-striped">
        <thead>
          <tr>
            <th onClick={() => handleSort('name')}>Imię</th>
            <th onClick={() => handleSort('surname')}>Nazwisko</th>
            <th onClick={() => handleSort('email')}>Email</th>
            <th onClick={() => handleSort('permission')}>Uprawnienia</th>
            <th onClick={() => handleSort('kompania')}>Kompania</th>
            <th>Akcje</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map(user => (
            <tr key={user._id}>
              {editingUserId === user._id ? (
                <>
                  <td><input type="text" name="name" value={editFormData.name} onChange={handleInputChange} className="form-control" /></td>
                  <td><input type="text" name="surname" value={editFormData.surname} onChange={handleInputChange} className="form-control" /></td>
                  <td><input type="email" name="email" value={editFormData.email} onChange={handleInputChange} className="form-control" /></td>
                  <td>
                    <select name="permission" value={editFormData.permission} onChange={handleInputChange} className="form-control" disabled={sessionData.permission === 'Admin'}>
                      <option value="SuperUser">SuperUser</option>
                      <option value="User">User</option>
                      <option value="Admin">Admin</option>
                    </select>
                  </td>
                  <td>
                    <select name="kompania" value={editFormData.kompania} onChange={handleInputChange} className="form-control" disabled={sessionData.permission === 'Admin'}>
                      <option value="Wszystkie">Wszystkie</option>
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                      <option value="5">5</option>
                    </select>
                  </td>
                  <td>
                    <button onClick={() => handleSaveClick(user._id)} className="btn btn-success btn-sm">Zapisz</button>
                    <button onClick={handleCancelClick} className="btn btn-secondary btn-sm">Anuluj</button>
                  </td>
                </>
              ) : (
                <>
                  <td>{user.name}</td>
                  <td>{user.surname}</td>
                  <td>{user.email}</td>
                  <td>{user.permission}</td>
                  <td>{user.kompania}</td>
                  <td>
                    <button onClick={() => handleEditClick(user)} className="btn btn-warning btn-sm">Edytuj</button>
                    <button onClick={() => handleDeleteClick(user._id)} className="btn btn-danger btn-sm">Usuń</button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      <ToastContainer />
    </div>
  );
};

export default ManageUsers;
