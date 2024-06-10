import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ element: Element, sessionData, allowedRoles, setMessage, ...rest }) => {
  const [isAllowed, setIsAllowed] = useState(null);
  const [redirectTo, setRedirectTo] = useState(null);

  useEffect(() => {
    const handleAccess = async () => {
      if (!sessionData) {
        setMessage('Dostęp do tej trasy jest zablokowany.');
        setIsAllowed(false);
      } else if (!allowedRoles.includes(sessionData.permission)) {
        setMessage('Dostęp do tej trasy jest zablokowany.');
        setIsAllowed(false);
      } else {
        setIsAllowed(true);
      }

      if (!sessionData || !allowedRoles.includes(sessionData.permission)) {
        // Wait for a moment before redirecting
        await new Promise((resolve) => setTimeout(resolve, 3000));
        setRedirectTo(sessionData ? "/" : "/login");
      }
    };

    handleAccess();
  }, [sessionData, allowedRoles, setMessage]);

  if (redirectTo) {
    return <Navigate to={redirectTo} />;
  }

  if (isAllowed === null) {
    return null; // Render nothing while checking permissions
  }

  return isAllowed ? <Element {...rest} sessionData={sessionData} setMessage={setMessage} /> : null;
};

export default ProtectedRoute;
