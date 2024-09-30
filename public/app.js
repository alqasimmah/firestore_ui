document.addEventListener('DOMContentLoaded', function() {
    const curriculumSelect = document.getElementById('curriculum-select');
    const levelSelect = document.getElementById('level-select');
    const subjectSelect = document.getElementById('subject-select');
    const questionTypeSelect = document.getElementById('question-type');
    const mcqOptionsDiv = document.getElementById('mcq-options');
    const saveQuestionBtn = document.getElementById('save-question');

    let selectedSubjectId = null;

    // Fetch curriculums on page load
    fetch('/api/curriculums')
        .then(response => {
            if (!response.ok) throw new Error('Failed to fetch curriculums');
            return response.json();
        })
        .then(data => {
            data.forEach(curriculum => {
                const option = document.createElement('option');
                option.value = curriculum.id;
                option.textContent = curriculum.ar_title; // Show the Arabic title
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
                    data.forEach(level => {
                        const option = document.createElement('option');
                        option.value = level.id;
                        option.textContent = level.ar_title; // Show the Arabic title
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
        subjectSelect.disabled = !levelId;
        subjectSelect.innerHTML = '<option value="">--Select Subject--</option>'; // Reset subjects

        if (levelId) {
            fetch(`/api/subjects/${levelId}`)
                .then(response => {
                    if (!response.ok) throw new Error('Failed to fetch subjects');
                    return response.json();
                })
                .then(data => {
                    data.forEach(subject => {
                        const option = document.createElement('option');
                        option.value = subject.id;
                        option.textContent = subject.ar_title; // Show the Arabic title
                        subjectSelect.appendChild(option);
                    });
                })
                .catch(error => {
                    console.error('Error fetching subjects:', error);
                    alert('Error loading subjects. Please try again later.');
                });
        }
    });

    // Update selected subject ID
    subjectSelect.addEventListener('change', function() {
        selectedSubjectId = subjectSelect.value;
    });

    // Show or hide MCQ options based on question type
    questionTypeSelect.addEventListener('change', function() {
        const selectedType = questionTypeSelect.value;
        mcqOptionsDiv.style.display = selectedType === 'mcq' ? 'block' : 'none';
    });

    // Save the question to the backend
    saveQuestionBtn.addEventListener('click', function() {
        const questionType = questionTypeSelect.value;
        const questionText = document.getElementById('question-text').value;
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
            subjectId: selectedSubjectId,
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
