import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const UserDashboard = () => {
  const [requests, setRequests] = useState([]);
  const [issue, setIssue] = useState('');
  const [location, setLocation] = useState('');
  const [documents, setDocuments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [user, setUser] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user');
      if (!storedUser) {
        navigate('/user-login');
        return;
      }

      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      fetchRequests(parsedUser.email);
    } catch (err) {
      console.error('Error parsing user from localStorage:', err);
      navigate('/user-login');
    }
  }, [navigate]);

  const fetchRequests = async (email) => {
    try {
      const res = await axios.get(`http://localhost:5000/request/user/${email}`);
      setRequests(res.data || []);
    } catch (err) {
      console.error('Error fetching requests:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;

    const formData = new FormData();
    formData.append('name', user.name || user.email);
    formData.append('email', user.email);
    formData.append('issue', issue);
    formData.append('loc', location);

    for (let i = 0; i < documents.length; i++) {
      formData.append('documents', documents[i]);
    }

    try {
      await axios.post('http://localhost:5000/request/submit', formData);
      setShowModal(false);
      setIssue('');
      setLocation('');
      setDocuments([]);
      fetchRequests(user.email);
    } catch (err) {
      console.error('Error submitting request:', err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/user-login');
  };

  if (!user) return <div className="container mt-5">Loading...</div>;

  return (
    <div className="container mt-4">
      {/* Header with Logout */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Welcome, {user.email}</h2>
        <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
      </div>

      <button className="btn btn-primary mb-4" onClick={() => setShowModal(true)}>
        + New Request
      </button>

      <h4 className="mb-4">Your Request History</h4>

      <div className="row row-cols-1 row-cols-md-2 g-4">
        {requests.length > 0 ? (
          requests.map((req) => (
            <div key={req.id} className="col">
              <div className="card shadow-sm border-0 h-100">
                <div className="card-body">
                  <h5 className="card-title text-primary">Issue: {req.issue}</h5>
                  <p className="card-text mb-1"><strong>Location:</strong> {req.loc}</p>
                  <p className="card-text mb-2"><strong>Date:</strong> {new Date(req.timestamp).toLocaleString()}</p>

                  {req.documents && req.documents.length > 0 && (
                    <div className="mt-3">
                      <strong>Documents:</strong>
                      <ul className="list-unstyled mt-2">
                        {req.documents.map((fileName, i) => (
                          <li key={i}>
                            <a
                              href={`http://localhost:5000/${fileName}`}
                              target="_blank"
                              rel="noreferrer"
                              className="btn btn-sm btn-outline-secondary me-2 mb-2"
                            >
                              📄 View Document {i + 1}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col">
            <div className="alert alert-info text-center">No requests found.</div>
          </div>
        )}
      </div>

      {/* Modal for New Request */}
      {showModal && (
        <div className="modal show fade d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <form onSubmit={handleSubmit}>
                <div className="modal-header">
                  <h5 className="modal-title">New Request</h5>
                  <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Issue</label>
                    <input
                      type="text"
                      className="form-control"
                      value={issue}
                      onChange={(e) => setIssue(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Location</label>
                    <input
                      type="text"
                      className="form-control"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Documents (optional, multiple)</label>
                    <input
                      type="file"
                      className="form-control"
                      multiple
                      onChange={(e) => setDocuments([...e.target.files])}
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="submit" className="btn btn-success">Submit</button>
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
