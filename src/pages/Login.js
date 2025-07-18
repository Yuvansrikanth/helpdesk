import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Container, Form, Button, Card } from 'react-bootstrap';
import axios from 'axios';

const Login = ({ role }) => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const navigate = useNavigate();
  const location = useLocation();
  const type = role ? role : (location.pathname.includes('institution') ? 'institution' : 'user');
  console.log(type);
  const handleLogin = async () => {
      try {
          const response = await axios.post('http://localhost:5000/api/login', {
              ...credentials,
              role: type
            });
            
            const data = response.data;
            console.log('Login response:', data);

    // Save to localStorage or state
    if (type === 'user') {
      localStorage.setItem('user', JSON.stringify(data));
      console.log('Stored in localStorage (string):', localStorage.getItem('user'));
    } else {
      localStorage.setItem('institution', JSON.stringify(data));
    }

    // Redirect based on role
    navigate(type === 'user' ? '/user-dashboard' : '/institution-dashboard');
  } catch (error) {
    alert(error.response?.data?.message || 'Login failed');
    console.error(error);
  }
};

  return (
  <Container className="mt-5">
    {/* Home Icon Top-Right */}
    <div className="d-flex justify-content-end mb-3">
  <Button
    variant="outline-secondary"
    className="rounded-circle d-flex align-items-center justify-content-center"
    onClick={() => navigate('/')}
    title="Go to Home"
    style={{ width: '50px', height: '50px', fontSize: '24px' }}
  >
    🏠
  </Button>
</div>


    <Card className="p-4 shadow-sm rounded-4">
      <h3 className="mb-3">{type === 'institution' ? 'Institution' : 'User'} Login</h3>
      <Form>
        <Form.Group>
          <Form.Label>Email</Form.Label>
          <Form.Control onChange={e => setCredentials({ ...credentials, email: e.target.value })} />
        </Form.Group>
        <Form.Group className="mt-2">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" onChange={e => setCredentials({ ...credentials, password: e.target.value })} />
        </Form.Group>
        <Button className="mt-3" onClick={handleLogin}>Login</Button>
      </Form>
    </Card>
  </Container>
);
};

export default Login;
