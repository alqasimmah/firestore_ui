// controllers/dataController.js
const Curriculum = require('../models/Curriculum');
const Level = require('../models/Level');
const Subject = require('../models/Subject');
const Chapter = require('../models/Chapter');
const Lesson = require('../models/Lesson');
const Question = require('../models/Question');
const createError = require('http-errors');

// Get all curriculums
exports.getCurriculums = async (req, res, next) => {
  try {
    const curriculums = await Curriculum.getAll();
    res.json(curriculums);
  } catch (error) {
    next(error);
  }
};

// Get levels by curriculum ID
exports.getLevelsByCurriculum = async (req, res, next) => {
  try {
    const { curriculumId } = req.params;
    const levels = await Level.getByCurriculumId(curriculumId);
    if (levels) {
      res.json(levels);
    } else {
      throw createError(404, 'Levels not found for the given curriculum.');
    }
  } catch (error) {
    next(error);
  }
};

// Get subjects by level ID
exports.getSubjectsByLevel = async (req, res, next) => {
  try {
    const { curriculumId, levelId } = req.params;
    const subjects = await Subject.getByLevelId(curriculumId, levelId);
    if (subjects) {
      res.json(subjects);
    } else {
      throw createError(404, 'Subjects not found for the given level.');
    }
  } catch (error) {
    next(error);
  }
};

// Get chapters by subject ID
exports.getChaptersBySubject = async (req, res, next) => {
  try {
    const { curriculumId, levelId, subjectId } = req.params;
    const chapters = await Chapter.getBySubjectId(curriculumId, levelId, subjectId);
    if (chapters) {
      res.json(chapters);
    } else {
      throw createError(404, 'Chapters not found for the given subject.');
    }
  } catch (error) {
    next(error);
  }
};

// Get lessons by chapter ID
exports.getLessonsByChapter = async (req, res, next) => {
  try {
    const { curriculumId, levelId, subjectId, chapterId } = req.params;
    const lessons = await Lesson.getByChapterId(curriculumId, levelId, subjectId, chapterId);
    if (lessons) {
      res.json(lessons);
    } else {
      throw createError(404, 'Lessons not found for the given chapter.');
    }
  } catch (error) {
    next(error);
  }
};

// Create a new question
exports.createQuestion = async (req, res, next) => {
    try {
      const questionData = req.body;
      const newQuestion = await Question.create(questionData);
      res.status(201).json({ message: 'Question added successfully', question: newQuestion });
    } catch (error) {
      next(error);
    }
  };

// Get all questions
exports.getQuestions = async (req, res, next) => {
  try {
    const questions = await Question.getAll();
    res.json(questions);
  } catch (error) {
    next(error);
  }
};
