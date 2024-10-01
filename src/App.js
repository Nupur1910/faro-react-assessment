import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import AssetList from './components/AssetList';

// Protected Route Component
const ProtectedRoute = ({ element: Component, isAuth, ...rest }) => {
  return isAuth ? <Component {...rest} /> : <Navigate to="/" />;
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
        <Route
          path="/assets"
          element={<ProtectedRoute isAuth={isAuthenticated} element={AssetList} />}
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
