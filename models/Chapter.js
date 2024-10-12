// models/Chapter.js
const DataModel = require('./DataModel');

class Chapter extends DataModel {
  static async getBySubjectId(curriculumId, levelId, subjectId) {
    const data = await this.readData();
    const subject = data.collections.curriculums[curriculumId]?.levels[levelId]?.subjects[subjectId];
    if (subject && subject.chapters) {
      return subject.chapters;
    } else {
      return null;
    }
  }

  static async getById(curriculumId, levelId, subjectId, chapterId) {
    const chapters = await this.getBySubjectId(curriculumId, levelId, subjectId);
    return chapters ? chapters[chapterId] : null;
  }
}

module.exports = Chapter;
