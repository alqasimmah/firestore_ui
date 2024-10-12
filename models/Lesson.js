// models/Lesson.js
const DataModel = require('./DataModel');

class Lesson extends DataModel {
  static async getByChapterId(curriculumId, levelId, subjectId, chapterId) {
    const data = await this.readData();
    const chapter = data.collections.curriculums[curriculumId]?.levels[levelId]?.subjects[subjectId]?.chapters[chapterId];
    if (chapter && chapter.lessons) {
      return chapter.lessons;
    } else {
      return null;
    }
  }

  static async getById(curriculumId, levelId, subjectId, chapterId, lessonId) {
    const lessons = await this.getByChapterId(curriculumId, levelId, subjectId, chapterId);
    return lessons ? lessons[lessonId] : null;
  }
}

module.exports = Lesson;
