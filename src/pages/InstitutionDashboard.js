import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const InstituteDashboard = () => {
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [error, setError] = useState('');
  const [insti, setInsti] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    try{
    const storedInstitution = localStorage.getItem('institution');
    if (!storedInstitution) {
      navigate('/institution-login');
      return;
    }
    const parsedInsti = JSON.parse(storedInstitution);
    setInsti(parsedInsti);
    fetchAllRequests();
    } catch (err) {
      console.error('Error parsing user from localStorage:', err);
      navigate('/institution-login');
    }
}, [navigate]);

  const fetchAllRequests = async () => {
    try {
      const res = await axios.get('http://localhost:5000/request/all');
      setRequests(res.data || []);
    } catch (err) {
      console.error('Error fetching requests:', err);
      setError('Failed to load requests.');
    }
  };

  const openRequestDetails = (request) => {
    setSelectedRequest(request);
  };

  const closeModal = () => {
    setSelectedRequest(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('institution');
    navigate('/institution-login');
  };
  
  if (!insti) return <div className="container mt-5">Loading...</div>;

  return (
    <div className="container mt-5">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">
          📋 Institution Dashboard, {insti.email}
        </h2>
        <button className="btn btn-outline-danger rounded-pill px-4" onClick={handleLogout}>Logout</button>
      </div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5 className="fw">
          All Requests
        </h5>
      </div>
      {/* Error Message */}
      {error && <div className="alert alert-danger rounded-4">{error}</div>}

      {/* Requests List */}
      <div className="d-flex flex-column gap-3">
        {requests.length > 0 ? (
          requests.map((req) => (
            <div key={req.id} className="card shadow-sm border-0 rounded-4 p-3">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <h5 className="text-primary mb-2">🛠️ Issue: {req.issue}</h5>
                  <p className="mb-1"><strong>User:</strong> {req.email}</p>
                  <p className="mb-1"><strong>Location:</strong> {req.loc}</p>
                  <p className="mb-1"><strong>Date:</strong> {new Date(req.timestamp).toLocaleString()}</p>
                </div>
                <button className="btn btn-outline-primary btn-sm mt-1 rounded-pill px-3" onClick={() => openRequestDetails(req)}>
                  🔍 View Details
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="alert alert-info text-center rounded-4">
            No requests submitted yet.
          </div>
        )}
      </div>

      {/* Modal for request details */}
      {selectedRequest && (
        <div className="modal show fade d-block" tabIndex="-1">
          <div className="modal-dialog modal-lg">
            <div className="modal-content rounded-4 border-0 shadow">
              <div className="modal-header">
                <h5 className="modal-title">Request Details</h5>
                <button type="button" className="btn-close" onClick={closeModal}></button>
              </div>
              <div className="modal-body py-4 px-5">
                <p><strong>User:</strong> {selectedRequest.email}</p>
                <p><strong>Issue:</strong> {selectedRequest.issue}</p>
                <p><strong>Location:</strong> {selectedRequest.loc}</p>
                <p><strong>Status:</strong> {selectedRequest.status}</p>
                <p><strong>Submitted on:</strong> {new Date(selectedRequest.timestamp).toLocaleString()}</p>

                {selectedRequest.documents?.length > 0 && (
                  <div className="mt-3">
                    <strong>Documents:</strong>
                    <ul className="list-unstyled mt-2">
                      {selectedRequest.documents.map((fileName, i) => (
                        <li key={i}>
                          <a
                            href={`http://localhost:5000/${fileName}`}
                            target="_blank"
                            rel="noreferrer"
                            className="btn btn-sm btn-outline-secondary me-2 mb-2 rounded-pill"
                          >
                            📄 Document {i + 1}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary rounded-pill px-4" onClick={closeModal}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InstituteDashboard;
