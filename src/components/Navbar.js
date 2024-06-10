import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaUserPlus, FaUserEdit, FaUser, FaUserGraduate, FaCalendarAlt } from 'react-icons/fa';
import logo from '../assets/logo.png';
import './Navbar.css'; // Assuming you have separate CSS for Navbar

const Navbar = ({ sessionData, handleLogout, userId, token }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const userName = sessionData ? sessionData.name : 'User';
  
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const renderMenuItem = (to, icon, text) => (
    <li><Link to={`${to}?userId=${userId}&token=${token}`} onClick={toggleMenu}>{icon} {text}</Link></li>
  );

  return (
    <nav className="navbar">
      <div className="navbar-section logo">
        <Link to="/">
          <img src={logo} alt="Logo" className="logo-img" />
        </Link>
      </div>
      <div className={`navbar-section links ${menuOpen ? 'open' : ''}`}>
        <ul>
          {sessionData.permission !== 'User' && (
            <>
              {renderMenuItem("add-user", <FaUserPlus />, "Dodaj User")}
              {renderMenuItem("manage-users", <FaUserEdit />, "Zarządzaj User")}
              {renderMenuItem("add-student", <FaUserGraduate />, "Dodaj Studenta")}
              {renderMenuItem("manage-students", <FaUser />, "Zarządzaj Studentami")}
            </>
          )}
          {renderMenuItem("plan-student-meals", <FaCalendarAlt />, "Plan Kalendarz")}
        </ul>
      </div>
      <div className="navbar-section user-info">
        <span className="user-name">{`Witam, ${userName}`}</span>
        <button className="logout-btn" onClick={handleLogout}>Wyloguj</button>
      </div>
      <div className="burger-menu" onClick={toggleMenu}>
        <div></div>
        <div></div>
      </div>
    </nav>
  );
};

export default Navbar;
