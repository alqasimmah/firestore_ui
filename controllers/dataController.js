const fs = require('fs');
const path = require('path');

// Utility function to read and write JSON files
const readJSONFile = (filePath) => {
    try {
        const fileContent = fs.readFileSync(filePath, 'utf8');
        return fileContent ? JSON.parse(fileContent) : {}; // Updated to return an empty object if file is empty
    } catch (err) {
        console.error('Error reading file:', filePath, err);
        return {}; // Return empty object if an error occurs
    }
};

const writeJSONFile = (filePath, data) => fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

// Get curriculums
exports.getCurriculums = (req, res) => {
    const curriculumsFilePath = path.join(__dirname, '../data/questions.json');
    const data = readJSONFile(curriculumsFilePath);

    if (data.collections && data.collections.curriculums) {
        res.json(data.collections.curriculums);
    } else {
        console.error('Error: Invalid curriculums data structure');
        res.status(500).json({ message: 'Error loading curriculums data' });
    }
};

// Get levels by curriculum ID
exports.getLevelsByCurriculum = (req, res) => {
    const { curriculumId } = req.params;
    const questionsFilePath = path.join(__dirname, '../data/questions.json');
    const data = readJSONFile(questionsFilePath);

    if (data.collections && data.collections.curriculums && data.collections.curriculums[curriculumId]) {
        const levels = data.collections.curriculums[curriculumId].levels;
        if (levels) {
            res.json(levels);
        } else {
            res.status(404).json({ message: 'Levels not found for the given curriculum.' });
        }
    } else {
        console.error('Error: Invalid curriculums data structure');
        res.status(500).json({ message: 'Error loading levels data' });
    }
};

// Get subjects by level ID
exports.getSubjectsByLevel = (req, res) => {
    const { curriculumId, levelId } = req.params;
    const questionsFilePath = path.join(__dirname, '../data/questions.json');
    const data = readJSONFile(questionsFilePath);

    // Validate data structure
    if (data.collections && typeof data.collections.curriculums === 'object') {
        const curriculum = data.collections.curriculums[curriculumId];
        if (curriculum && curriculum.levels && curriculum.levels[levelId]) {
            const level = curriculum.levels[levelId];
            if (level.subjects) {
                res.json(level.subjects);
            } else {
                console.error('Error: Subjects not found for level', levelId);
                res.status(404).json({ message: 'Subjects not found for the given level.' });
            }
        } else {
            console.error('Error: Level not found for curriculum', curriculumId);
            res.status(404).json({ message: 'Level not found for the given curriculum.' });
        }
    } else {
        console.error('Error: Invalid curriculums data structure in questions.json');
        res.status(500).json({ message: 'Error loading subjects data. Invalid curriculums structure.' });
    }
};

// Get chapters by subject ID
exports.getChaptersBySubject = (req, res) => {
    const { curriculumId, levelId, subjectId } = req.params;
    const questionsFilePath = path.join(__dirname, '../data/questions.json');
    const data = readJSONFile(questionsFilePath);

    // Check if the curriculums data structure is valid
    if (data.collections && data.collections.curriculums && data.collections.curriculums[curriculumId]) {
        const subject = data.collections.curriculums[curriculumId].levels[levelId]?.subjects[subjectId];
        if (subject && subject.chapters) {
            res.json(subject.chapters);
        } else {
            res.status(404).json({ message: 'Chapters not found for the given subject.' });
        }
    } else {
        console.error('Error: Invalid curriculums data structure');
        res.status(500).json({ message: 'Error loading chapters data' });
    }
};

// Get lessons by chapter ID
exports.getLessonsByChapter = (req, res) => {
    const { curriculumId, levelId, subjectId, chapterId } = req.params;
    const questionsFilePath = path.join(__dirname, '../data/questions.json');
    const data = readJSONFile(questionsFilePath);

    // Check if the curriculums data structure is valid
    if (data.collections && data.collections.curriculums && data.collections.curriculums[curriculumId]) {
        const chapter = data.collections.curriculums[curriculumId].levels[levelId]?.subjects[subjectId]?.chapters[chapterId];
        if (chapter && chapter.lessons) {
            res.json(chapter.lessons);
        } else {
            res.status(404).json({ message: 'Lessons not found for the given chapter.' });
        }
    } else {
        console.error('Error: Invalid curriculums data structure');
        res.status(500).json({ message: 'Error loading lessons data' });
    }
};

// Create a new question
exports.createQuestion = (req, res) => {
    try {
        const { curriculumId, levelId, subjectId, chapterId, lessonId, ...question } = req.body;
        console.log('Received question:', question); // Debug log

        // Validation: Check if required fields are present
        if (!question.text || !question.correctAnswer) {
            return res.status(400).json({ message: 'Question text and correct answer are required.' });
        }

        const questionsFilePath = path.join(__dirname, '../data/questions.json');
        let data = readJSONFile(questionsFilePath);

        // Check if all parent levels (curriculum, level, subject, chapter, lesson) exist
        if (
            !data.collections ||
            !data.collections.curriculums ||
            !data.collections.curriculums[curriculumId] ||
            !data.collections.curriculums[curriculumId].levels[levelId] ||
            !data.collections.curriculums[curriculumId].levels[levelId].subjects[subjectId] ||
            !data.collections.curriculums[curriculumId].levels[levelId].subjects[subjectId].chapters[chapterId] ||
            !data.collections.curriculums[curriculumId].levels[levelId].subjects[subjectId].chapters[chapterId].lessons[lessonId]
        ) {
            return res.status(404).json({ message: 'Invalid path for the question. Please check the curriculum, level, subject, chapter, or lesson IDs.' });
        }

        // Add the new question
        const lesson = data.collections.curriculums[curriculumId].levels[levelId].subjects[subjectId].chapters[chapterId].lessons[lessonId];
        if (!lesson.questions) {
            lesson.questions = {};
        }
        const questionId = `question_${Object.keys(lesson.questions).length + 1}`;
        lesson.questions[questionId] = {
            id: questionId,
            ...question,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        // Write updated data to the JSON file
        writeJSONFile(questionsFilePath, data);

        res.status(201).json({ message: 'Question added successfully', question: lesson.questions[questionId] });
    } catch (error) {
        console.error('Error saving the question:', error);
        res.status(500).json({ message: 'Error saving the question', error });
    }
};

exports.getQuestions = (req, res) => {
    const questionsFilePath = path.join(__dirname, '../data/questions.json');
    const data = readJSONFile(questionsFilePath);

    // Validate the data structure
    if (data.collections && data.collections.curriculums) {
        let questionsList = [];

        // Traverse through the entire data structure to collect all questions
        Object.values(data.collections.curriculums).forEach(curriculum => {
            Object.values(curriculum.levels || {}).forEach(level => {
                Object.values(level.subjects || {}).forEach(subject => {
                    Object.values(subject.chapters || {}).forEach(chapter => {
                        Object.values(chapter.lessons || {}).forEach(lesson => {
                            if (lesson.questions) {
                                questionsList = questionsList.concat(
                                    Object.values(lesson.questions)
                                );
                            }
                        });
                    });
                });
            });
        });

        res.json(questionsList);
    } else {
        console.error('Error: Invalid curriculums data structure');
        res.status(500).json({ message: 'Error loading questions data' });
    }
};

