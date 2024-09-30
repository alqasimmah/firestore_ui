const fs = require('fs');
const path = require('path');

// Utility function to read and write JSON files
const readJSONFile = (filePath) => JSON.parse(fs.readFileSync(filePath, 'utf8'));
const writeJSONFile = (filePath, data) => fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

// Get curriculums, levels, and subjects (existing code)
exports.getCurriculums = (req, res) => { /* existing code */ };
exports.getLevelsByCurriculum = (req, res) => { /* existing code */ };
exports.getSubjectsByLevel = (req, res) => { /* existing code */ };

// Create a new question
exports.createQuestion = (req, res) => {
    const question = req.body;
    const questionsFilePath = path.join(__dirname, '../data/questions.json');

    let questions = [];
    if (fs.existsSync(questionsFilePath)) {
        questions = readJSONFile(questionsFilePath);
    }

    questions.push(question);
    writeJSONFile(questionsFilePath, questions);

    res.status(201).json({ message: 'Question added successfully', question });
};
