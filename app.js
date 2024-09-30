const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();

// Import routes for curriculums, levels, subjects, and questions
const dataRoutes = require('./routes/dataRoutes');

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Serve static files from the public folder (for the frontend)
app.use(express.static(path.join(__dirname, 'public')));

// Use the API routes for curriculums, levels, and questions
app.use('/api', dataRoutes);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
