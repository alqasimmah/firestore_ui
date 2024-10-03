const fs = require('fs');
const path = require('path');

// Utility function to read and write JSON files
const readJSONFile = (filePath) => {
    try {
        const fileContent = fs.readFileSync(filePath, 'utf8');
        return fileContent ? JSON.parse(fileContent) : []; // Return an empty array if file is empty
    } catch (err) {
        console.error('Error reading file:', filePath, err);
        return []; // Return empty array if an error occurs
    }
};
const writeJSONFile = (filePath, data) => fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

// Get curriculums
exports.getCurriculums = (req, res) => {
    const curriculumsFilePath = path.join(__dirname, '../data/curriculums.json');
    const curriculums = readJSONFile(curriculumsFilePath);
    res.json(curriculums);
};

// Get levels by curriculum ID
exports.getLevelsByCurriculum = (req, res) => {
    const { curriculumId } = req.params;
    const levelsFilePath = path.join(__dirname, '../data/levels.json');
    const levels = readJSONFile(levelsFilePath);
    const filteredLevels = levels.filter(level => level.curriculumId === curriculumId);
    res.json(filteredLevels);
};

// Get subjects by level ID
exports.getSubjectsByLevel = (req, res) => {
    const { levelId } = req.params;
    const subjectsFilePath = path.join(__dirname, '../data/subjects.json');
    const subjects = readJSONFile(subjectsFilePath);
    const filteredSubjects = subjects.filter(subject => subject.levelId === levelId);
    res.json(filteredSubjects);
};

// Get chapters by subject ID
exports.getChaptersBySubject = (req, res) => {
    const { subjectId } = req.params;
    const chaptersFilePath = path.join(__dirname, '../data/chapters.json');
    const chapters = readJSONFile(chaptersFilePath);
    const filteredChapters = chapters.filter(chapter => chapter.subjectId === subjectId);
    res.json(filteredChapters);
};

// Get lessons by chapter ID
exports.getLessonsByChapter = (req, res) => {
    const { chapterId } = req.params;
    const lessonsFilePath = path.join(__dirname, '../data/lessons.json');
    const lessons = readJSONFile(lessonsFilePath);
    const filteredLessons = lessons.filter(lesson => lesson.chapterId === chapterId);
    res.json(filteredLessons);
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
