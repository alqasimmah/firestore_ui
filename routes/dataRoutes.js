const express = require('express');
const router = express.Router();
const dataController = require('../controllers/dataController');

// Curriculum, Level, and Subject Routes
router.get('/curriculums', dataController.getCurriculums);
router.get('/levels/:curriculumId', dataController.getLevelsByCurriculum);
router.get('/subjects/:levelId', dataController.getSubjectsByLevel);

// Question Routes
router.post('/questions', dataController.createQuestion);  // Create a new question

module.exports = router;
