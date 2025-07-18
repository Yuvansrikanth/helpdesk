import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Button, Row, Col, Card } from 'react-bootstrap';

const HomeSelector = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-light min-vh-100 d-flex justify-content-center align-items-center w-100">
      <Card 
        className="p-5 shadow-lg border-0"
        style={{
          width: '100%',
          maxWidth: '600px',
          borderRadius: '20px',
          background: 'linear-gradient(135deg, #f8f9fa, #e9ecef)',
        }}
      >
        <h2 className="text-center mb-4" style={{ fontWeight: '600' }}>
          Welcome to <span className="text-primary">HelpDesk</span>
        </h2>

        <Row className="mb-4">
          <Col className="d-grid mb-2">
            <Button variant="primary" size="lg" onClick={() => navigate('/user-login')}>
              👤 User Login
            </Button>
          </Col>
          <Col className="d-grid mb-2">
            <Button variant="success" size="lg" onClick={() => navigate('/institution-login')}>
              🏛️ Institution Login
            </Button>
          </Col>
        </Row>

        <div className="text-center mt-3">
          <Button variant="outline-dark" onClick={() => navigate('/register')}>
            📝 New User? Register
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default HomeSelector;
