// models/Subject.js
const DataModel = require('./DataModel');

class Subject extends DataModel {
  static async getByLevelId(curriculumId, levelId) {
    const data = await this.readData();
    const level = data.collections.curriculums[curriculumId]?.levels[levelId];
    if (level && level.subjects) {
      return level.subjects;
    } else {
      return null;
    }
  }

  static async getById(curriculumId, levelId, subjectId) {
    const subjects = await this.getByLevelId(curriculumId, levelId);
    return subjects ? subjects[subjectId] : null;
  }
}

module.exports = Subject;
