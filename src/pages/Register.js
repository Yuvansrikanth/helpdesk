import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Form, Button, Card } from 'react-bootstrap';
import axios from 'axios';

const Register = () => {
  const [user, setUser] = useState({ email: '', password: '', role: 'user'});
  const navigate = useNavigate();

const handleRegister = async () => {
  try {
    const response = await axios.post('http://localhost:5000/api/register', user);
    alert('Registered successfully!');
    navigate('/user-login');
  } catch (error) {
    alert(error.response?.data?.message || 'Registration failed');
    console.error(error);
  }
};

  return (
    <Container className="mt-5">
      <Card className="p-4 shadow-sm">
        <h3 className="mb-3">User Registration</h3>
        <Form>
          <Form.Group>
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              value={user.email}
              onChange={e => setUser({ ...user, email: e.target.value })}
            />
          </Form.Group>
          <Form.Group className="mt-2">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              value={user.password}
              onChange={e => setUser({ ...user, password: e.target.value })}
            />
          </Form.Group>
          <Button className="mt-3" onClick={handleRegister}>Register</Button>
        </Form>
      </Card>
    </Container>
  );
};

export default Register;
