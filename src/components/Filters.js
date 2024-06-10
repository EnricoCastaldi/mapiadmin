import React, { useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import 'bootstrap/dist/css/bootstrap.min.css';

const Filters = ({
  surnameFilter,
  setSurnameFilter,
  kodQRFilter,
  setKodQRFilter,
  statusFilter,
  setStatusFilter,
  scrollToDate,
  setScrollToDate,
  handleScrollLeft,
  handleScrollRight,
  handleScrollToDate,
  handleDisplayWeek,
  handleDisplayMonth,
  handleDisplayYear,
}) => {
  const [selectedButton, setSelectedButton] = useState('week');

  const handleButtonClick = (button) => {
    setSelectedButton(button);
    if (button === 'week') handleDisplayWeek();
    if (button === 'month') handleDisplayMonth();
    if (button === 'year') handleDisplayYear();
  };

  const buttonClass = (button) => `btn ${selectedButton === button ? 'btn-primary' : 'btn-outline-primary'}`;

  return (
    <div className="filters">
      <label>
        Nazwisko:
        <input
          type="text"
          value={surnameFilter}
          onChange={(e) => setSurnameFilter(e.target.value)}
          className="form-control"
        />
      </label>
      <label>
        Kod QR:
        <input
          type="text"
          value={kodQRFilter}
          onChange={(e) => setKodQRFilter(e.target.value)}
          className="form-control"
        />
      </label>
      <label>
        Osoba aktywna:
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="form-select"
        >
          <option value="">Wszystkie</option>
          <option value="ACTIVE">ACTIVE</option>
          <option value="NOT ACTIVE">NOT ACTIVE</option>
        </select>
      </label>
    

      <div className="scroll-controls mt-3">
        
        <button
          onClick={() => handleButtonClick('week')}
          className={buttonClass('week')}
        >
          Wyświetl tydzień
        </button>
        <button
          onClick={() => handleButtonClick('month')}
          className={buttonClass('month')}
        >
          Wyświetl miesiąc
        </button>
        <button
          onClick={() => handleButtonClick('year')}
          className={buttonClass('year')}
        >
          Wyświetl rok
        </button>
        <button onClick={handleScrollLeft} className="btn btn-secondary"><FaChevronLeft /></button>
        <button onClick={handleScrollRight} className="btn btn-secondary"><FaChevronRight /></button>
        <button onClick={handleScrollToDate} className="btn btn-secondary">Przejdź do daty</button>
      </div>
    </div>
  );
};

export default Filters;
