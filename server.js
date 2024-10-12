// server.js
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

// Import routes
const dataRoutes = require('./routes/dataRoutes');
const errorHandler = require('./middleware/errorHandler');

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

// Use the API routes
app.use('/api', dataRoutes);

// Use the error-handling middleware
app.use(errorHandler);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
