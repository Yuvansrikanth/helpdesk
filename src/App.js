import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import UserLogin from './pages/UserLogin';
import InstitutionLogin from './pages/InstitutionLogin';
import Register from './pages/Register';
import HomeSelector from './pages/HomeSelector';
import UserDashboard from './pages/UserDashboard';
import NewRequest from './pages/NewRequest';
import InstitutionDashboard from './pages/InstitutionDashboard';
import RequestDetail from './pages/RequestDetail';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomeSelector />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/user-dashboard" element={<UserDashboard />} />
        <Route path="/user-login" element={<UserLogin />} />
        <Route path="/institution-login" element={<InstitutionLogin />} />
        <Route path="/new-request" element={<NewRequest />} />
        <Route path="/institution-dashboard" element={<InstitutionDashboard />} />
        <Route path="/request/:id" element={<RequestDetail />} />
      </Routes>
    </Router>
  );
}

export default App;
