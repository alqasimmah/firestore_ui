// routes/dataRoutes.js
const express = require('express');
const router = express.Router();
const dataController = require('../controllers/dataController');

// RESTful routes
router.get('/curriculums', dataController.getCurriculums);
router.get('/curriculums/:curriculumId/levels', dataController.getLevelsByCurriculum);
router.get('/curriculums/:curriculumId/levels/:levelId/subjects', dataController.getSubjectsByLevel);
router.get('/curriculums/:curriculumId/levels/:levelId/subjects/:subjectId/chapters', dataController.getChaptersBySubject);
router.get('/curriculums/:curriculumId/levels/:levelId/subjects/:subjectId/chapters/:chapterId/lessons', dataController.getLessonsByChapter);

// Questions routes
router.get('/questions', dataController.getQuestions);
router.post('/questions', dataController.createQuestion);

module.exports = router;
