const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();

// Import routes for curriculums, levels, subjects, and questions
const dataRoutes = require('./routes/dataRoutes');

// Middleware
// Enable CORS with more specific settings
app.use(cors({
  origin: 'http://localhost:3000', // Allow requests only from this origin
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow these methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allow these headers
}));

// Middleware to set Content-Security-Policy (CSP) headers
app.use((req, res, next) => {
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; connect-src 'self' http://localhost:3000"
  );
  next();
});

// Middleware for parsing incoming requests with JSON payloads
app.use(bodyParser.json());

// Serve static files from the public folder (for the frontend)
app.use(express.static(path.join(__dirname, 'public')));

// Use the API routes for curriculums, levels, and questions
app.use('/api', dataRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
