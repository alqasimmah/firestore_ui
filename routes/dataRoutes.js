const express = require('express');
const router = express.Router();
const dataController = require('../controllers/dataController');

// Existing routes for curriculums, levels, and subjects
router.get('/curriculums', dataController.getCurriculums);
router.get('/levels/:curriculumId', dataController.getLevelsByCurriculum);
router.get('/subjects/:levelId', dataController.getSubjectsByLevel);

// New routes for chapters and lessons
router.get('/chapters/:subjectId', dataController.getChaptersBySubject);
router.get('/lessons/:chapterId', dataController.getLessonsByChapter);

// Route for creating a new question
router.post('/questions', dataController.createQuestion);

module.exports = router;
