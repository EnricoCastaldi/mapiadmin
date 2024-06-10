import React, { useState, useEffect, useRef } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import AddStudent from './components/AddStudent';
import ManageStudents from './components/ManageStudents';
import PlanStudentMeals from './components/PlanStudentMeals';
import AddUser from './components/AddUser';
import ManageUsers from './components/ManageUsers';
import ProtectedRoute from './components/ProtectedRoute';
import MealPlansLog from './components/MealPlansLog';
import Navbar from './components/Navbar'; // Import the Navbar component
import './AdminPanel.css'; // Import the CSS file for styling

const AdminPanel = () => {
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const sessionData = JSON.parse(localStorage.getItem('sessionData'));
  const userName = sessionData ? sessionData.name : 'User';
  const userKompania = sessionData ? sessionData.kompania : 'N/A'; // Updated greeting
  const userId = sessionData ? sessionData.id : '';
  const token = sessionData ? sessionData.token : '';
  const [currentTime, setCurrentTime] = useState(new Date());
  const inactivityTimeoutRef = useRef(null);

  const INACTIVITY_TIMEOUT = 600000; // 10 minutes in milliseconds

  useEffect(() => {
    if (!sessionData) {
      navigate('/login');
    }
  }, [navigate, sessionData]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const resetInactivityTimeout = () => {
    if (inactivityTimeoutRef.current) {
      clearTimeout(inactivityTimeoutRef.current);
    }

    inactivityTimeoutRef.current = setTimeout(() => {
      handleLogout();
    }, INACTIVITY_TIMEOUT);
  };

  const handleLogout = () => {
    localStorage.removeItem('sessionData');
    navigate('/login');
  };

  useEffect(() => {
    const events = ['mousemove', 'keydown', 'click', 'scroll'];

    const handleUserActivity = () => {
      resetInactivityTimeout();
    };

    events.forEach((event) => {
      window.addEventListener(event, handleUserActivity);
    });

    resetInactivityTimeout(); // Initialize the timeout when the component mounts

    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, handleUserActivity);
      });

      if (inactivityTimeoutRef.current) {
        clearTimeout(inactivityTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="admin-panel">
      <Navbar sessionData={sessionData} handleLogout={handleLogout} userId={userId} token={token} />
      <div className="content">
        {message && <div className="message">{message}</div>}
        <Routes>
          <Route path="/" element={
            <>
              <h1 className="welcome-message">
                Witam, <span className="user-value">{userName}</span> - Kompania: <span className="user-value">{userKompania}</span>
                <p className="current-time">
                  {currentTime.toLocaleDateString()} {currentTime.toLocaleTimeString()}
                </p>
              </h1>
              <MealPlansLog />
            </>
          } />
          <Route path="add-student" element={<ProtectedRoute element={AddStudent} sessionData={sessionData} allowedRoles={['Admin', 'SuperUser']} setMessage={setMessage} />} />
          <Route path="add-user" element={<ProtectedRoute element={AddUser} sessionData={sessionData} allowedRoles={['Admin','SuperUser']} setMessage={setMessage} />} />
          <Route path="manage-users" element={<ProtectedRoute element={ManageUsers} sessionData={sessionData} allowedRoles={['Admin', 'SuperUser']} setMessage={setMessage} />} />
          <Route path="manage-students" element={<ProtectedRoute element={ManageStudents} sessionData={sessionData} allowedRoles={['Admin', 'SuperUser']} setMessage={setMessage} />} />
          <Route path="plan-student-meals" element={<ProtectedRoute element={PlanStudentMeals} sessionData={sessionData} allowedRoles={['Admin', 'SuperUser', 'User']} setMessage={setMessage} />} />
        </Routes>
      </div>
    </div>
  );
};

export default AdminPanel;
