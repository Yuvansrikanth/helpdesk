const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const reqRoutes = require('./routes/req');
const path = require('path');

const app = express();
const PORT = 5000;


app.use(cors());
app.use(express.json());

app.get('/test', (req, res) => {
  res.json({ message: 'API working' });
});

app.use('/api', authRoutes);
app.use('/request', reqRoutes);

// Static file serving
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
