import React, { useState, useEffect } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaFilePdf, FaFileExport } from 'react-icons/fa'; // Added FaFileExport for JSON button icon
import './MealPlansLog.css'; // Zachowaj swoje własne style, jeśli są

const MealPlansLog = () => {
  const [mealPlans, setMealPlans] = useState([]);
  const [filteredMealPlans, setFilteredMealPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchSurname, setSearchSurname] = useState('');
  const [searchMealType, setSearchMealType] = useState('');
  const [searchKompania, setSearchKompania] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);

  useEffect(() => {
    const fetchMealPlans = async () => {
      try {
        const sessionData = JSON.parse(localStorage.getItem('sessionData'));
        const token = sessionData ? sessionData.token : null;
        const kompania = sessionData ? sessionData.kompania : null;

        if (!token) {
          throw new Error('Nie znaleziono tokena');
        }

        const response = await axios.get('https://mapi-api.onrender.com/mealPlans', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: { kompania },
        });

        console.log('Pobrane plany posiłków:', response.data); // Log the fetched data

        const sortedData = response.data.sort((a, b) => new Date(b.date) - new Date(a.date));
        setMealPlans(sortedData);
        setFilteredMealPlans(sortedData);
      } catch (err) {
        setError(err.response ? err.response.data : err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMealPlans();
  }, []);

  const handleSearchSurname = (e) => {
    const value = e.target.value;
    setSearchSurname(value);
    filterData(value, searchMealType, searchKompania);
  };

  const handleSearchMealType = (e) => {
    const value = e.target.value;
    setSearchMealType(value);
    filterData(searchSurname, value, searchKompania);
  };

  const handleSearchKompania = (e) => {
    const value = e.target.value;
    setSearchKompania(value);
    filterData(searchSurname, searchMealType, value);
  };

  const filterData = (surname, mealType, kompania) => {
    const filteredData = mealPlans.filter(plan =>
      plan.studentDetails.surname.toLowerCase().includes(surname.toLowerCase()) &&
      plan.mealType.toLowerCase().includes(mealType.toLowerCase()) &&
      plan.studentDetails.kompania.toLowerCase().includes(kompania.toLowerCase())
    );
    setFilteredMealPlans(filteredData);
    setCurrentPage(1);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredMealPlans.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredMealPlans.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [['ID', 'Imię i nazwisko', 'Data', 'Rodzaj posiłku', 'Kompania', 'Utworzono']],
      body: filteredMealPlans.map(plan => [
        plan._id,
        `${plan.studentDetails.name} ${plan.studentDetails.surname}`,
        plan.date,
        plan.mealType,
        plan.studentDetails.kompania,
        plan.createdAt,
      ]),
    });
    doc.save('meal-plans-log.pdf');
  };

  const generateJSON = () => {
    const json = JSON.stringify(filteredMealPlans, null, 2); // Convert data to JSON string
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'meal-plans-log.json';
    link.click();
  };

  if (loading) {
    return <p>Ładowanie...</p>;
  }

  if (error) {
    return <p>Błąd: {error}</p>;
  }

  return (
    <div className="container mt-5">
      <h2 className="text-center">Raport dotyczący planowania</h2>
      <div className="row mb-4">
        <div className="col-md-4">
          <input
            type="text"
            className="form-control"
            placeholder="Filtruj według nazwiska"
            value={searchSurname}
            onChange={handleSearchSurname}
          />
        </div>
        <div className="col-md-4">
          <input
            type="text"
            className="form-control"
            placeholder="Filtruj według rodzaju posiłku"
            value={searchMealType}
            onChange={handleSearchMealType}
          />
        </div>
        <div className="col-md-4">
          <input
            type="text"
            className="form-control"
            placeholder="Filtruj według kompanii"
            value={searchKompania}
            onChange={handleSearchKompania}
          />
        </div>
      </div>
      <div className="row mb-4">
        <div className="col-md-3">
          <button className="btn btn-primary" onClick={generatePDF}>
            <FaFilePdf /> Generuj PDF
          </button>
        </div>
        <div className="col-md-3">
          <button className="btn btn-primary" onClick={generateJSON}>
            <FaFileExport /> Generuj JSON
          </button>
        </div>
        <div className="col-md-6">
          <ul className="pagination justify-content-end">
            {[...Array(totalPages).keys()].map(number => (
              <li key={number + 1} className={`page-item ${currentPage === number + 1 ? 'active' : ''}`}>
                <button
                  onClick={() => paginate(number + 1)}
                  className="page-link"
                  disabled={currentPage === number + 1}
                >
                  {number + 1}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
      {currentItems.length === 0 ? (
        <p className="text-center">Brak dostępnych planów posiłków.</p>
      ) : (
        <table className="table table-striped table-bordered">
          <thead>
            <tr><th>ID</th><th>Imię i nazwisko</th><th>Data</th><th>Rodzaj posiłku</th><th>Kompania</th><th>Utworzono</th></tr>
          </thead>
          <tbody>
            {currentItems.map((plan, index) => (
              <tr key={plan._id || index}>
                <td>{plan._id}</td>
                <td>{`${plan.studentDetails.name} ${plan.studentDetails.surname}`}</td>
                <td>{plan.date}</td>
                <td>{plan.mealType}</td>
                <td>{plan.studentDetails.kompania || 'Unknown'}</td>
                <td>{new Date(plan.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <div className="row">
        <div className="col-12">
          <ul className="pagination justify-content-center">
            {[...Array(totalPages).keys()].map(number => (
              <li key={number + 1} className={`page-item ${currentPage === number + 1 ? 'active' : ''}`}>
                <button
                  onClick={() => paginate(number + 1)}
                  className="page-link"
                  disabled={currentPage === number + 1}
                >
                  {number + 1}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MealPlansLog;
