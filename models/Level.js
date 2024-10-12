// models/Level.js
const DataModel = require('./DataModel');

class Level extends DataModel {
  static async getByCurriculumId(curriculumId) {
    const data = await this.readData();
    const curriculum = data.collections.curriculums[curriculumId];
    if (curriculum && curriculum.levels) {
      return curriculum.levels;
    } else {
      return null;
    }
  }

  static async getById(curriculumId, levelId) {
    const levels = await this.getByCurriculumId(curriculumId);
    return levels ? levels[levelId] : null;
  }
}

module.exports = Level;
