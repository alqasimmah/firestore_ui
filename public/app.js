// public/app.js

document.addEventListener('DOMContentLoaded', function() {
    // Initialize Quill editor
    const quill = new Quill('#question-text-editor', {
      theme: 'snow',
    });
  
    // Form elements
    const curriculumSelect = document.getElementById('curriculum-select');
    const levelSelect = document.getElementById('level-select');
    const subjectSelect = document.getElementById('subject-select');
    const chapterSelect = document.getElementById('chapter-select');
    const lessonSelect = document.getElementById('lesson-select');
    const questionTypeSelect = document.getElementById('question-type');
    const mcqOptionsDiv = document.getElementById('mcq-options');
    const saveQuestionBtn = document.getElementById('save-question');
    const correctAnswerInput = document.getElementById('correct-answer');
  
    // Validation flags
    let isCurriculumValid = false;
    let isLevelValid = false;
    let isSubjectValid = false;
    let isChapterValid = false;
    let isLessonValid = false;
    let isQuestionTextValid = false;
    let isCorrectAnswerValid = false;
    let areOptionsValid = true;
  
    // Fetch curriculums on page load
    fetch('/api/curriculums')
      .then(handleErrors)
      .then(data => populateSelect(curriculumSelect, data))
      .catch(displayError('Error loading curriculums.'));
  
    // Event listeners for select changes
    curriculumSelect.addEventListener('change', onCurriculumChange);
    levelSelect.addEventListener('change', onLevelChange);
    subjectSelect.addEventListener('change', onSubjectChange);
    chapterSelect.addEventListener('change', onChapterChange);
    lessonSelect.addEventListener('change', onLessonChange);
  
    // Question type change
    questionTypeSelect.addEventListener('change', function() {
      const selectedType = questionTypeSelect.value;
      mcqOptionsDiv.style.display = selectedType === 'mcq' ? 'block' : 'none';
    });
  
    // Save question button click
    saveQuestionBtn.addEventListener('click', onSaveQuestion);
  
    // Helper functions
    function populateSelect(selectElement, data) {
      selectElement.innerHTML = '<option value="">--Select--</option>';
      Object.values(data).forEach(item => {
        const option = document.createElement('option');
        option.value = item.id;
        option.textContent = item.ar_title || item.name;
        selectElement.appendChild(option);
      });
      selectElement.disabled = false;
    }
  
    function handleErrors(response) {
      if (!response.ok) throw new Error(response.statusText);
      return response.json();
    }
  
    function displayError(message) {
      return error => {
        console.error(error);
        alert(message);
      };
    }
  
    // Select change handlers
    function onCurriculumChange() {
      resetSelect(levelSelect);
      resetSelect(subjectSelect);
      resetSelect(chapterSelect);
      resetSelect(lessonSelect);
      isCurriculumValid = validateSelect(curriculumSelect);
      if (curriculumSelect.value) {
        fetch(`/api/curriculums/${curriculumSelect.value}/levels`)
          .then(handleErrors)
          .then(data => populateSelect(levelSelect, data))
          .catch(displayError('Error loading levels.'));
      }
    }
  
    function onLevelChange() {
      resetSelect(subjectSelect);
      resetSelect(chapterSelect);
      resetSelect(lessonSelect);
      isLevelValid = validateSelect(levelSelect);
      if (levelSelect.value) {
        fetch(`/api/curriculums/${curriculumSelect.value}/levels/${levelSelect.value}/subjects`)
          .then(handleErrors)
          .then(data => populateSelect(subjectSelect, data))
          .catch(displayError('Error loading subjects.'));
      }
    }
  
    function onSubjectChange() {
      resetSelect(chapterSelect);
      resetSelect(lessonSelect);
      isSubjectValid = validateSelect(subjectSelect);
      if (subjectSelect.value) {
        fetch(`/api/curriculums/${curriculumSelect.value}/levels/${levelSelect.value}/subjects/${subjectSelect.value}/chapters`)
          .then(handleErrors)
          .then(data => populateSelect(chapterSelect, data))
          .catch(displayError('Error loading chapters.'));
      }
    }
  
    function onChapterChange() {
      resetSelect(lessonSelect);
      isChapterValid = validateSelect(chapterSelect);
      if (chapterSelect.value) {
        fetch(`/api/curriculums/${curriculumSelect.value}/levels/${levelSelect.value}/subjects/${subjectSelect.value}/chapters/${chapterSelect.value}/lessons`)
          .then(handleErrors)
          .then(data => populateSelect(lessonSelect, data))
          .catch(displayError('Error loading lessons.'));
      }
    }
  
    function onLessonChange() {
      isLessonValid = validateSelect(lessonSelect);
      // If needed, you can fetch lesson details here
    }
  
    function resetSelect(selectElement) {
      selectElement.innerHTML = '<option value="">--Select--</option>';
      selectElement.disabled = true;
      validateSelect(selectElement);
    }
  
    function validateSelect(selectElement) {
      if (selectElement.value) {
        selectElement.classList.remove('is-invalid');
        return true;
      } else {
        selectElement.classList.add('is-invalid');
        return false;
      }
    }
  
    function onSaveQuestion() {
      // Validate question text
      const questionText = quill.root.innerHTML.trim();
      isQuestionTextValid = questionText !== '<p><br></p>' && questionText !== '';
      if (!isQuestionTextValid) {
        document.querySelector('#question-text-editor').classList.add('is-invalid');
      } else {
        document.querySelector('#question-text-editor').classList.remove('is-invalid');
      }
  
      // Validate correct answer
      isCorrectAnswerValid = correctAnswerInput.value.trim() !== '';
      if (!isCorrectAnswerValid) {
        correctAnswerInput.classList.add('is-invalid');
      } else {
        correctAnswerInput.classList.remove('is-invalid');
      }
  
      // Validate MCQ options if applicable
      if (questionTypeSelect.value === 'mcq') {
        const options = [
          document.getElementById('option-1').value.trim(),
          document.getElementById('option-2').value.trim(),
          document.getElementById('option-3').value.trim(),
          document.getElementById('option-4').value.trim(),
        ];
        areOptionsValid = options.every(option => option !== '');
        if (!areOptionsValid) {
          mcqOptionsDiv.classList.add('is-invalid');
        } else {
          mcqOptionsDiv.classList.remove('is-invalid');
        }
      } else {
        areOptionsValid = true;
      }
  
      // Check all validations
      if (
        isCurriculumValid &&
        isLevelValid &&
        isSubjectValid &&
        isChapterValid &&
        isLessonValid &&
        isQuestionTextValid &&
        isCorrectAnswerValid &&
        areOptionsValid
      ) {
        // Prepare question data
        const questionData = {
          curriculumId: curriculumSelect.value,
          levelId: levelSelect.value,
          subjectId: subjectSelect.value,
          chapterId: chapterSelect.value,
          lessonId: lessonSelect.value,
          type: questionTypeSelect.value,
          text: questionText,
          correctAnswer: correctAnswerInput.value.trim(),
        };
  
        if (questionTypeSelect.value === 'mcq') {
          questionData.options = [
            document.getElementById('option-1').value.trim(),
            document.getElementById('option-2').value.trim(),
            document.getElementById('option-3').value.trim(),
            document.getElementById('option-4').value.trim(),
          ];
        }
  
        // Send POST request
        fetch('/api/questions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(questionData),
        })
          .then(handleErrors)
          .then(data => {
            alert('Question saved successfully!');
            // Optionally, reset the form or perform other actions
          })
          .catch(displayError('Error saving the question.'));
      } else {
        alert('Please fix the errors in the form.');
      }
    }
  });
  