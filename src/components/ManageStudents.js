import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './ManageStudents.css'; // Import the CSS file

const ManageStudents = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [editStudentId, setEditStudentId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: '',
    surname: '',
    cardType: '',
    cardID: '',
    QRCode: '',
    status: '',
    kompania: ''
  });
  const [filters, setFilters] = useState({
    name: '',
    status: '',
    kompania: ''
  });
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  const sessionData = JSON.parse(localStorage.getItem('sessionData'));

  useEffect(() => {
    if (!sessionData || !sessionData.token) {
      toast.error('Brak tokenu uwierzytelniającego. Proszę się zalogować.');
      return;
    }

    axios.get('https://mapi-api.onrender.com/students', {
      headers: {
        'Authorization': `Bearer ${sessionData.token}`
      }
    })
    .then(response => {
      let studentsData = response.data;
      if (sessionData.permission === 'Admin') {
        studentsData = studentsData.filter(student => student.kompania === sessionData.kompania);
      }
      setStudents(studentsData);
      setFilteredStudents(studentsData);
    })
    .catch(error => {
      console.error('Wystąpił błąd podczas pobierania studentów!', error);
      toast.error('Wystąpił błąd podczas pobierania studentów!');
    });
  }, [sessionData]);

  useEffect(() => {
    applyFilters();
  }, [filters, students]);

  const applyFilters = () => {
    let filtered = students;
    if (filters.name) {
      filtered = filtered.filter(student => student.name.toLowerCase().includes(filters.name.toLowerCase()));
    }
    if (filters.status) {
      filtered = filtered.filter(student => student.status === filters.status);
    }
    if (filters.kompania) {
      filtered = filtered.filter(student => student.kompania === filters.kompania);
    }
    setFilteredStudents(filtered);
  };

  const handleEditClick = (student) => {
    setEditStudentId(student._id); // Use _id if that's the key in MongoDB
    setEditFormData({
      name: student.name,
      surname: student.surname,
      cardType: student.cardType,
      cardID: student.cardID,
      QRCode: student.QRCode,
      status: student.status,
      kompania: student.kompania
    });
  };

  const handleCancelClick = () => {
    setEditStudentId(null);
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setEditFormData({
      ...editFormData,
      [name]: value
    });
  };

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters({
      ...filters,
      [name]: value
    });
  };

  const handleSaveClick = (id) => {
    if (!sessionData || !sessionData.token) {
      toast.error('Brak tokenu uwierzytelniającego. Proszę się zalogować.');
      return;
    }

    axios.put(`https://mapi-api.onrender.com/students/${id}`, editFormData, {
      headers: {
        'Authorization': `Bearer ${sessionData.token}`
      }
    })
    .then(response => {
      const updatedStudents = students.map(student => {
        if (student._id === id) {
          return { ...student, ...editFormData };
        }
        return student;
      });
      setStudents(updatedStudents);
      setEditStudentId(null);
      toast.success('Student został zaktualizowany pomyślnie');
    })
    .catch(error => {
      console.error('Wystąpił błąd podczas aktualizacji studenta!', error);
      toast.error('Wystąpił błąd podczas aktualizacji studenta!');
    });
  };

  const handleDelete = (id) => {
    if (window.confirm('Czy na pewno chcesz usunąć tego studenta?')) {
      if (!sessionData || !sessionData.token) {
        toast.error('Brak tokenu uwierzytelniającego. Proszę się zalogować.');
        return;
      }

      axios.delete(`https://mapi-api.onrender.com/students/${id}`, {
        headers: {
          'Authorization': `Bearer ${sessionData.token}`
        }
      })
      .then(response => {
        setStudents(students.filter(student => student._id !== id));
        toast.success('Student został usunięty pomyślnie');
      })
      .catch(error => {
        console.error('Wystąpił błąd podczas usuwania studenta!', error);
        toast.error('Wystąpił błąd podczas usuwania studenta!');
      });
    }
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedStudents = [...filteredStudents].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  return (
    <div className="">
      <h2>Zarządzaj Studentami</h2>
      <div className="filters">
        <div className="">
          <label>Imię</label>
          <input
            type="text"
            placeholder="Imię"
            name="name"
            value={filters.name}
            onChange={handleFilterChange}
            className="form-control"
          />
        </div>
        <div className="">
          <label>Status</label>
          <select
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
            className="form-control"
          >
            <option value="">Wszystkie</option>
            <option value="ACTIVE">ACTIVE</option>
            <option value="NOT ACTIVE">NOT ACTIVE</option>
          </select>
        </div>
        <div className="">
          <label>Kompania</label>
          <select
            name="kompania"
            value={filters.kompania}
            onChange={handleFilterChange}
            className="form-control"
          >
            <option value="">Wszystkie</option>
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
            <th onClick={() => handleSort('cardType')}>Typ karty</th>
            <th onClick={() => handleSort('cardID')}>Karta ID</th>
            <th onClick={() => handleSort('QRCode')}>Kod QR</th>
            <th onClick={() => handleSort('status')}>Status</th>
            <th onClick={() => handleSort('kompania')}>Kompania</th>
            <th>Akcje</th>
          </tr>
        </thead>
        <tbody>
          {sortedStudents.map((student) => (
            <tr key={student._id}>
              {editStudentId === student._id ? (
                <>
                  <td><input type="text" name="name" value={editFormData.name} onChange={handleFormChange} /></td>
                  <td><input type="text" name="surname" value={editFormData.surname} onChange={handleFormChange} /></td>
                  <td>
                    <select name="cardType" value={editFormData.cardType} onChange={handleFormChange}>
                      <option value="legitymacja studencka ELS">legitymacja studencka ELS</option>
                      <option value="type1">type1</option>
                      <option value="type2">type2</option>
                      <option value="type3">type3</option>
                    </select>
                  </td>
                  <td><input type="text" name="cardID" value={editFormData.cardID} onChange={handleFormChange} /></td>
                  <td><input type="text" name="QRCode" value={editFormData.QRCode} onChange={handleFormChange} /></td>
                  <td>
                    <select name="status" value={editFormData.status} onChange={handleFormChange}>
                      <option value="ACTIVE">ACTIVE</option>
                      <option value="NOT ACTIVE">NOT ACTIVE</option>
                    </select>
                  </td>
                  <td>
                    <select name="kompania" value={editFormData.kompania} onChange={handleFormChange} disabled={sessionData.permission === 'Admin'}>
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                      <option value="5">5</option>
                    </select>
                  </td>
                  <td>
                    <button className="btn btn-success btn-sm mr-2" onClick={() => handleSaveClick(student._id)}>Zapisz</button>
                    <button className="btn btn-secondary btn-sm" onClick={handleCancelClick}>Anuluj</button>
                  </td>
                </>
              ) : (
                <>
                  <td>{student.name}</td>
                  <td>{student.surname}</td>
                  <td>{student.cardType}</td>
                  <td>{student.cardID}</td>
                  <td>{student.QRCode}</td>
                  <td>{student.status}</td>
                  <td>{student.kompania}</td>
                  <td>
                    <button 
                      className="btn btn-warning btn-sm mr-2"
                      onClick={() => handleEditClick(student)}
                    >
                      Edytuj
                    </button>
                    <button 
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(student._id)}
                    >
                      Usuń
                    </button>
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

export default ManageStudents;
