// models/DataModel.js
const fs = require('fs').promises;
const path = require('path');

const dataFilePath = path.join(__dirname, '../data/questions.json');

class DataModel {
  static async readData() {
    try {
      const fileContent = await fs.readFile(dataFilePath, 'utf8');
      return fileContent ? JSON.parse(fileContent) : {};
    } catch (err) {
      console.error('Error reading data file:', err);
      throw err;
    }
  }

  static async writeData(data) {
    try {
      await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2));
    } catch (err) {
      console.error('Error writing data file:', err);
      throw err;
    }
  }
}

module.exports = DataModel;