const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const multer = require('multer');

// Configure multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '..', 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

const upload = multer({ storage: storage });

// POST /request/submit
router.post('/submit', upload.array('documents', 5), (req, res) => {
  const { email, issue, loc } = req.body;

  const documentPaths = req.files ? req.files.map(file => `uploads/${file.filename}`) : [];

  const request = {
    id: Date.now(),
    email,
    issue,
    loc,
    status: 'pending',
    documents: documentPaths,
    timestamp: new Date().toISOString()
  };

  const dataPath = path.join(__dirname, '..', 'data', 'requests.json');
  let requests = [];

  if (fs.existsSync(dataPath)) {
    const fileData = fs.readFileSync(dataPath, 'utf-8');
    if (fileData) {
      requests = JSON.parse(fileData);
    }
  }

  requests.push(request);
  fs.writeFileSync(dataPath, JSON.stringify(requests, null, 2));

  res.status(201).json({ message: 'Request submitted successfully', request });
});

// GET /request/user/:email - Get requests by email
router.get('/user/:email', (req, res) => {
  const userEmail = req.params.email;
  const dataPath = path.join(__dirname, '..', 'data', 'requests.json');

  // Check if file exists
  if (!fs.existsSync(dataPath)) {
    return res.status(200).json([]);
  }

  try {
    const fileData = fs.readFileSync(dataPath, 'utf-8');
    const allRequests = JSON.parse(fileData);

    // Filter requests by email
    const userRequests = allRequests.filter(req => req.email === userEmail);

    res.status(200).json(userRequests);
  } catch (error) {
    console.error('Error reading requests:', error);
    res.status(500).json({ error: 'Failed to fetch user requests' });
  }
});

// GET /request/all - Gets all requests
router.get('/all', (req, res) => {
  const dataPath = path.join(__dirname, '..', 'data', 'requests.json');

  // Check if file exists
  if (!fs.existsSync(dataPath)) {
    return res.status(200).json([]);
  }

  try {
    const fileData = fs.readFileSync(dataPath, 'utf-8');
    const allRequests = JSON.parse(fileData);

    // Filter requests by email
    const userRequests = allRequests;

    res.status(200).json(userRequests);
  } catch (error) {
    console.error('Error reading requests:', error);
    res.status(500).json({ error: 'Failed to fetch user requests' });
  }
});
module.exports = router;
