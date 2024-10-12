// models/Question.js
const DataModel = require('./DataModel');
const createError = require('http-errors');

class Question extends DataModel {
  // Create a new question
  static async create(questionData) {
    const {
      curriculumId,
      levelId,
      subjectId,
      chapterId,
      lessonId,
      ...question
    } = questionData;

    // Validation: Check if required fields are present
    if (!question.text || !question.correctAnswer) {
      throw createError(400, 'Question text and correct answer are required.');
    }

    const data = await this.readData();

    // Navigate to the lesson
    const lesson =
      data.collections.curriculums[curriculumId]?.levels[levelId]?.subjects[subjectId]?.chapters[chapterId]?.lessons[lessonId];

    if (!lesson) {
      throw createError(
        404,
        'Invalid path for the question. Please check the curriculum, level, subject, chapter, or lesson IDs.'
      );
    }

    // Extract the required fields from the lesson object
    const { lessonArTitle1, lessonArTitle2, topic01, topic02 } = lesson;

    // Initialize the questions object if it doesn't exist
    if (!lesson.questions) {
      lesson.questions = {};
    }

    // Create a new question ID
    const questionId = `question_${Object.keys(lesson.questions).length + 1}`;

    // Add the new question to the lesson
    lesson.questions[questionId] = {
      id: questionId,
      curriculumId,
      levelId,
      subjectId,
      chapterId,
      lessonId,
      lessonArTitle1, // New field
      lessonArTitle2, // New field
      topic01,        // New field
      topic02,        // New field
      ...question,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Write updated data to the JSON file
    await this.writeData(data);

    return lesson.questions[questionId];
  }

  // Get all questions
  static async getAll() {
    const data = await this.readData();
    let questionsList = [];

    // Traverse through the data structure to collect all questions
    for (const curriculum of Object.values(data.collections.curriculums || {})) {
      for (const level of Object.values(curriculum.levels || {})) {
        for (const subject of Object.values(level.subjects || {})) {
          for (const chapter of Object.values(subject.chapters || {})) {
            for (const lesson of Object.values(chapter.lessons || {})) {
              if (lesson.questions) {
                questionsList = questionsList.concat(Object.values(lesson.questions));
              }
            }
          }
        }
      }
    }

    return questionsList;
  }
}

module.exports = Question;
