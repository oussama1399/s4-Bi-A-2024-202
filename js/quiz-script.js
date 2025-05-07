document.addEventListener('DOMContentLoaded', function() {
    // Get the quiz container
    const quizContainer = document.getElementById('quiz-container');
    if (!quizContainer) return;

    // Get the current page name from the URL
    const currentPage = window.location.pathname.split('/').pop().replace('.html', '');
    const jsonFile = `qcm/${currentPage}.json`;

    // Variables to keep track of quiz state
    let questions = [];
    let currentQuestionIndex = 0;
    let score = 0;
    let userAnswers = [];

    // Function to load the questions from JSON file
    async function loadQuestions() {
        try {
            const response = await fetch(jsonFile);
            if (!response.ok) throw new Error('Failed to load questions');
            
            questions = await response.json();
            
            // Filter out entries without questions (explanation-only entries)
            questions = questions.filter(q => q.question && q.options && q.answer);
            
            // Limit the number of questions to 20 and shuffle them
            if (questions.length > 20) {
                questions = shuffleArray(questions).slice(0, 20);
            } else {
                questions = shuffleArray(questions);
            }
            
            userAnswers = new Array(questions.length).fill(null);
            
            // Initialize the quiz
            showQuestion(currentQuestionIndex);
            updateProgressBar();
        } catch (error) {
            console.error('Error loading questions:', error);
            quizContainer.innerHTML = `
                <div class="error-message">
                    <p>Impossible de charger les questions. Veuillez réessayer plus tard.</p>
                    <p>Erreur: ${error.message}</p>
                </div>
            `;
        }
    }

    // Function to display a question
    function showQuestion(index) {
        if (!questions.length) return;
        
        const question = questions[index];
        
        // Create HTML for the question
        const questionHTML = `
            <div class="question-container" id="question-${index}">
                <div class="question">
                    <span class="question-number">${index + 1}</span>
                    <div class="question-text">${question.question}</div>
                </div>
                <div class="options-container">
                    ${question.options.map((option, i) => `
                        <div class="option-item" data-index="${i}">
                            <span class="option-label">${String.fromCharCode(65 + i)}</span>
                            <span class="option-text">${option}</span>
                        </div>
                    `).join('')}
                </div>
                <div class="explanation" id="explanation-${index}">
                    <strong>Explication:</strong> ${question.explanation || 'Pas d\'explication disponible.'}
                </div>
            </div>
        `;
        
        // Create HTML for controls
        const controlsHTML = `
            <div class="quiz-controls">
                <button id="btn-prev" class="btn btn-outline" ${index === 0 ? 'disabled' : ''}>Précédent</button>
                <button id="btn-check" class="btn btn-primary">Vérifier ma réponse</button>
                <button id="btn-next" class="btn btn-outline" ${index === questions.length - 1 ? 'disabled' : ''}>Suivant</button>
            </div>
        `;
        
        // Update the quiz container
        quizContainer.innerHTML = questionHTML + controlsHTML;
        
        // Add event listeners to options
        document.querySelectorAll('.option-item').forEach(option => {
            option.addEventListener('click', selectOption);
        });
        
        // Add event listeners to buttons
        document.getElementById('btn-check').addEventListener('click', checkAnswer);
        
        const prevButton = document.getElementById('btn-prev');
        if (prevButton) {
            prevButton.addEventListener('click', () => {
                if (currentQuestionIndex > 0) {
                    currentQuestionIndex--;
                    showQuestion(currentQuestionIndex);
                    updateProgressBar();
                }
            });
        }
        
        const nextButton = document.getElementById('btn-next');
        if (nextButton) {
            nextButton.addEventListener('click', () => {
                if (currentQuestionIndex < questions.length - 1) {
                    currentQuestionIndex++;
                    showQuestion(currentQuestionIndex);
                    updateProgressBar();
                } else {
                    showResults();
                }
            });
        }
        
        // If this question has already been answered, restore the selection
        if (userAnswers[index] !== null) {
            const selectedOption = document.querySelector(`.option-item[data-index="${userAnswers[index]}"]`);
            if (selectedOption) {
                selectedOption.classList.add('selected');
            }
        }
    }

    // Function to handle option selection
    function selectOption(event) {
        // Remove selected class from all options
        document.querySelectorAll('.option-item').forEach(opt => {
            opt.classList.remove('selected');
        });
        
        // Add selected class to the clicked option
        const selectedOption = event.currentTarget;
        selectedOption.classList.add('selected');
        
        // Store the selected answer
        userAnswers[currentQuestionIndex] = parseInt(selectedOption.getAttribute('data-index'));
    }

    // Function to check the answer
    function checkAnswer() {
        const question = questions[currentQuestionIndex];
        const selectedIndex = userAnswers[currentQuestionIndex];
        
        // If no option is selected, alert the user
        if (selectedIndex === null) {
            alert('Veuillez sélectionner une réponse avant de vérifier.');
            return;
        }
        
        const correct = question.options[selectedIndex] === question.answer;
        const selectedOption = document.querySelector(`.option-item[data-index="${selectedIndex}"]`);
        
        // Mark the selected option as correct or incorrect
        selectedOption.classList.add(correct ? 'correct' : 'incorrect');
        
        // If incorrect, highlight the correct answer
        if (!correct) {
            const correctIndex = question.options.indexOf(question.answer);
            const correctOption = document.querySelector(`.option-item[data-index="${correctIndex}"]`);
            correctOption.classList.add('correct');
        } else {
            // Update score if correct
            score++;
        }
        
        // Show the explanation
        document.getElementById(`explanation-${currentQuestionIndex}`).classList.add('show');
        
        // Disable the check button and enable navigation
        document.getElementById('btn-check').disabled = true;
        document.getElementById('btn-check').classList.add('btn-disabled');
        
        // Disable clicking on options
        document.querySelectorAll('.option-item').forEach(option => {
            option.removeEventListener('click', selectOption);
            option.style.cursor = 'default';
        });
    }

    // Function to display final results
    function showResults() {
        const percentage = Math.round((score / questions.length) * 100);
        let resultMessage;
        
        if (percentage >= 80) {
            resultMessage = "Excellent ! Vous maîtrisez parfaitement ce sujet.";
        } else if (percentage >= 60) {
            resultMessage = "Bien ! Vous avez une bonne compréhension du sujet.";
        } else if (percentage >= 40) {
            resultMessage = "Pas mal. Continuez à étudier pour améliorer vos connaissances.";
        } else {
            resultMessage = "Vous devriez approfondir ce sujet pour mieux le comprendre.";
        }
        
        const resultHTML = `
            <div class="quiz-result">
                <h2 class="result-header">Résultat du quiz</h2>
                <div class="result-score">${score}/${questions.length}</div>
                <p class="result-message">${resultMessage}</p>
                <div class="nav-buttons">
                    <button id="btn-retry" class="btn btn-primary">Réessayer</button>
                    <a href="index.html" class="btn btn-outline">Retour à l'accueil</a>
                </div>
            </div>
        `;
        
        quizContainer.innerHTML = resultHTML;
        
        // Add event listener to retry button
        document.getElementById('btn-retry').addEventListener('click', () => {
            currentQuestionIndex = 0;
            score = 0;
            userAnswers = new Array(questions.length).fill(null);
            questions = shuffleArray(questions);
            showQuestion(currentQuestionIndex);
            updateProgressBar();
        });
    }

    // Function to update the progress bar
    function updateProgressBar() {
        const progressContainer = document.querySelector('.progress-container');
        if (!progressContainer) {
            // Create progress bar if it doesn't exist
            const progressHTML = `
                <div class="progress-container">
                    <div class="progress-bar">
                        <div class="progress-fill"></div>
                    </div>
                    <div class="progress-text">Question ${currentQuestionIndex + 1} sur ${questions.length}</div>
                </div>
            `;
            
            quizContainer.insertAdjacentHTML('beforebegin', progressHTML);
        } else {
            // Update existing progress bar
            const progressFill = document.querySelector('.progress-fill');
            const progressText = document.querySelector('.progress-text');
            
            if (progressFill && progressText) {
                const progressPercentage = ((currentQuestionIndex + 1) / questions.length) * 100;
                progressFill.style.width = `${progressPercentage}%`;
                progressText.textContent = `Question ${currentQuestionIndex + 1} sur ${questions.length}`;
            }
        }
    }

    // Utility function to shuffle an array
    function shuffleArray(array) {
        const newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    }

    // Start the quiz
    loadQuestions();
});
