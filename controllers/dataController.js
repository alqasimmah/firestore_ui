const fs = require('fs');
const path = require('path');

// Utility function to read and write JSON files
const readJSONFile = (filePath) => {
    try {
        return JSON.parse(fs.readFileSync(filePath, 'utf8'));
    } catch (error) {
        console.error('Error reading JSON file:', error);
        throw error;
    }
};

const writeJSONFile = (filePath, data) => {
    try {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    } catch (error) {
        console.error('Error writing to JSON file:', error);
        throw error;
    }
};

// Get curriculums
exports.getCurriculums = (req, res) => {
    try {
        const curriculumsFilePath = path.join(__dirname, '../data/curriculums.json');
        const curriculums = readJSONFile(curriculumsFilePath);
        res.json(curriculums);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching curriculums', error });
    }
};

// Get levels by curriculum ID
exports.getLevelsByCurriculum = (req, res) => {
    try {
        const { curriculumId } = req.params;
        const levelsFilePath = path.join(__dirname, '../data/levels.json');
        const levels = readJSONFile(levelsFilePath);
        const filteredLevels = levels.filter(level => level.curriculumId === curriculumId);
        res.json(filteredLevels);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching levels', error });
    }
};

// Get subjects by level ID
exports.getSubjectsByLevel = (req, res) => {
    try {
        const { levelId } = req.params;
        const subjectsFilePath = path.join(__dirname, '../data/subjects.json');
        const subjects = readJSONFile(subjectsFilePath);
        const filteredSubjects = subjects.filter(subject => subject.levelId === levelId);
        res.json(filteredSubjects);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching subjects', error });
    }
};

// Create a new question
exports.createQuestion = (req, res) => {
    try {
        const question = req.body;
        console.log('Received question:', question); // Debug log

        // Validation: Check if required fields are present
        if (!question.text || !question.correctAnswer) {
            return res.status(400).json({ message: 'Question text and correct answer are required.' });
        }

        const questionsFilePath = path.join(__dirname, '../data/questions.json');
        
        // Check if file exists, if not create it
        let questions = [];
        if (fs.existsSync(questionsFilePath)) {
            questions = readJSONFile(questionsFilePath);
        }

        // Add new question
        questions.push(question);
        writeJSONFile(questionsFilePath, questions);

        res.status(201).json({ message: 'Question added successfully', question });
    } catch (error) {
        console.error('Error saving the question:', error);
        res.status(500).json({ message: 'Error saving the question', error });
    }
};
