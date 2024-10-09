document.addEventListener('DOMContentLoaded', function() {
    // Initialize Quill
    const quill = new Quill('#question-text-editor', {
        theme: 'snow'  // Use the 'snow' theme
    });
    
    const curriculumSelect = document.getElementById('curriculum-select');
    const levelSelect = document.getElementById('level-select');
    const subjectSelect = document.getElementById('subject-select');
    const chapterSelect = document.getElementById('chapter-select');
    const lessonSelect = document.getElementById('lesson-select');
    const questionTypeSelect = document.getElementById('question-type');
    const mcqOptionsDiv = document.getElementById('mcq-options');
    const saveQuestionBtn = document.getElementById('save-question');
        
    let selectedLessonId = null;

    // Fetch curriculums on page load
    fetch('/api/curriculums')
        .then(response => {
            if (!response.ok) throw new Error('Failed to fetch curriculums');
            return response.json();
        })
        .then(data => {
            Object.keys(data).forEach(curriculumKey => {
                const curriculum = data[curriculumKey];
                const option = document.createElement('option');
                option.value = curriculum.id;
                option.textContent = curriculum.ar_title;
                curriculumSelect.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Error fetching curriculums:', error);
            alert('Error loading curriculums. Please try again later.');
        });

    // Fetch levels when a curriculum is selected
    curriculumSelect.addEventListener('change', function() {
        const curriculumId = curriculumSelect.value;
        levelSelect.disabled = !curriculumId;
        levelSelect.innerHTML = '<option value="">--Select Level--</option>'; // Reset levels

        if (curriculumId) {
            fetch(`/api/levels/${curriculumId}`)
                .then(response => {
                    if (!response.ok) throw new Error('Failed to fetch levels');
                    return response.json();
                })
                .then(data => {
                    Object.keys(data).forEach(levelKey => {
                        const level = data[levelKey];
                        const option = document.createElement('option');
                        option.value = level.id;
                        option.textContent = level.ar_title;
                        levelSelect.appendChild(option);
                    });
                })
                .catch(error => {
                    console.error('Error fetching levels:', error);
                    alert('Error loading levels. Please try again later.');
                });
        }
    });

    // Fetch subjects when a level is selected
    levelSelect.addEventListener('change', function() {
        const levelId = levelSelect.value;
        const curriculumId = curriculumSelect.value;
        subjectSelect.disabled = !levelId;
        subjectSelect.innerHTML = '<option value="">--Select Subject--</option>'; // Reset subjects

        if (levelId) {
            fetch(`/api/subjects/${curriculumId}/${levelId}`)
                .then(response => {
                    if (!response.ok) throw new Error('Failed to fetch subjects');
                    return response.json();
                })
                .then(data => {
                    Object.keys(data).forEach(subjectKey => {
                        const subject = data[subjectKey];
                        const option = document.createElement('option');
                        option.value = subject.id;
                        option.textContent = subject.ar_title;
                        subjectSelect.appendChild(option);
                    });
                })
                .catch(error => {
                    console.error('Error fetching subjects:', error);
                    alert('Error loading subjects. Please try again later.');
                });
        }
    });

    // Fetch chapters when a subject is selected
    subjectSelect.addEventListener('change', function() {
        const subjectId = subjectSelect.value;
        const curriculumId = curriculumSelect.value;
        const levelId = levelSelect.value;
        chapterSelect.disabled = !subjectId;
        chapterSelect.innerHTML = '<option value="">--Select Chapter--</option>'; // Reset chapters

        if (subjectId) {
            fetch(`/api/chapters/${curriculumId}/${levelId}/${subjectId}`)
                .then(response => {
                    if (!response.ok) throw new Error('Failed to fetch chapters');
                    return response.json();
                })
                .then(data => {
                    Object.keys(data).forEach(chapterKey => {
                        const chapter = data[chapterKey];
                        const option = document.createElement('option');
                        option.value = chapter.id;
                        option.textContent = chapter.ar_title;
                        chapterSelect.appendChild(option);
                    });
                })
                .catch(error => {
                    console.error('Error fetching chapters:', error);
                    alert('Error loading chapters. Please try again later.');
                });
        }
    });

    // Fetch lessons when a chapter is selected
    chapterSelect.addEventListener('change', function() {
        const chapterId = chapterSelect.value;
        const curriculumId = curriculumSelect.value;
        const levelId = levelSelect.value;
        const subjectId = subjectSelect.value;
        lessonSelect.disabled = !chapterId;
        lessonSelect.innerHTML = '<option value="">--Select Lesson--</option>'; // Reset lessons

        if (chapterId) {
            fetch(`/api/lessons/${curriculumId}/${levelId}/${subjectId}/${chapterId}`)
                .then(response => {
                    if (!response.ok) throw new Error('Failed to fetch lessons');
                    return response.json();
                })
                .then(data => {
                    Object.keys(data).forEach(lessonKey => {
                        const lesson = data[lessonKey];
                        const option = document.createElement('option');
                        option.value = lesson.id;
                        option.textContent = lesson.ar_title;
                        lessonSelect.appendChild(option);
                    });
                })
                .catch(error => {
                    console.error('Error fetching lessons:', error);
                    alert('Error loading lessons. Please try again later.');
                });
        }
    });

    // Update selected lesson ID
    lessonSelect.addEventListener('change', function() {
        selectedLessonId = lessonSelect.value;
    });

    // Show or hide MCQ options based on question type
    questionTypeSelect.addEventListener('change', function() {
        const selectedType = questionTypeSelect.value;
        mcqOptionsDiv.style.display = selectedType === 'mcq' ? 'block' : 'none';
    });

    // Save the question to the backend
    saveQuestionBtn.addEventListener('click', function () {
        const questionType = questionTypeSelect.value;
        const questionText = document.querySelector('.ql-editor').innerHTML; // Get HTML from Quill editor
        const correctAnswer = document.getElementById('correct-answer').value;

        let options = [];
        if (questionType === 'mcq') {
            options = [
                document.getElementById('option-1').value,
                document.getElementById('option-2').value,
                document.getElementById('option-3').value,
                document.getElementById('option-4').value
            ];
        }

        const questionData = {
            curriculumId: curriculumSelect.value,
            levelId: levelSelect.value,
            subjectId: subjectSelect.value,
            chapterId: chapterSelect.value,
            lessonId: lessonSelect.value,
            type: questionType,
            text: questionText,
            options: options,
            correctAnswer: correctAnswer
        };

        // Validation
        if (!questionText || !correctAnswer || (questionType === 'mcq' && options.some(option => !option))) {
            alert('Please fill out all required fields.');
            return;
        }

        // Post the question data to the backend
        fetch('/api/questions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(questionData)
        })
            .then(response => {
                if (!response.ok) throw new Error('Failed to save question');
                return response.json();
            })
            .then(data => {
                alert('Question saved successfully!');
                // Optionally reset the form here if needed
            })
            .catch(error => {
                console.error('Error saving question:', error);
                alert('Error saving the question. Please try again later.');
            });
    });


});