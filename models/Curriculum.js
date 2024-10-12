// models/Curriculum.js
const DataModel = require('./DataModel');

class Curriculum extends DataModel {
  static async getAll() {
    const data = await this.readData();
    return data.collections.curriculums || {};
  }

  static async getById(curriculumId) {
    const curriculums = await this.getAll();
    return curriculums[curriculumId] || null;
  }
}

module.exports = Curriculum;
