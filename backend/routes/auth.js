const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const usersFile = path.join(__dirname, '../data/users.json');
const instiFile = path.join(__dirname, '../data/institutions.json');

// Utility: Read users from file
const readUsers = () => {
  if (!fs.existsSync(usersFile)) return [];
  const data = fs.readFileSync(usersFile);
  return JSON.parse(data);
};

const readInsti = () => {
  if (!fs.existsSync(instiFile)) return [];
  const data = fs.readFileSync(instiFile);
  return JSON.parse(data);
};

// Utility: Save users to file
const saveUsers = (users) => {
  fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
};

// POST /api/register
router.post('/register', (req, res) => {
  const { email, password, role } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  const users = readUsers();
  if (users.find(u => u.email === email && u.role === role)) {
    return res.status(409).json({ message: 'User already exists.' });
  }

  users.push({ email, password, role });
  saveUsers(users);

  return res.status(201).json({ message: 'User registered successfully.' });
});

// POST /api/login
router.post('/login', (req, res) => {
  const { email, password, role } = req.body;

  if (!email || !password || !role) {
    return res.status(400).json({ message: 'All fields are required.' });
  }
  if(role === "user")
  {
      const users = readUsers();
      const user = users.find(u => u.email === email && u.password === password && u.role === role);
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials.' });
      }
      return res.status(200).json({ email: user.email });
  }
  else if(role === "institution")
  {
      console.log("ok");
      const institutions = readInsti();
      const institution = institutions.find(i => i.email === email && i.password === password && i.role === role);
      if (!institution) {
        return res.status(401).json({ message: 'Invalid credentials.' });
      }
      return res.status(200).json({ email: institution.email });
  }
  else
  {
      return res.status(400).json({ message: 'Invalid role.' });
  }
});

module.exports = router;
