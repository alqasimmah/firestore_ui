const express = require('express');
const router = express.Router();
const dataController = require('../controllers/dataController');

// Existing routes for curriculums, levels, subjects, chapters, and lessons
router.get('/curriculums', dataController.getCurriculums);
router.get('/levels/:curriculumId', dataController.getLevelsByCurriculum);
router.get('/subjects/:curriculumId/:levelId', dataController.getSubjectsByLevel);
router.get('/chapters/:curriculumId/:levelId/:subjectId', dataController.getChaptersBySubject);
router.get('/lessons/:curriculumId/:levelId/:subjectId/:chapterId', dataController.getLessonsByChapter);

// New route for fetching all questions
router.get('/questions', dataController.getQuestions);

// Route for creating a new question
router.post('/questions', dataController.createQuestion);

module.exports = router;
