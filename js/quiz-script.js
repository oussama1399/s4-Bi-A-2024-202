document.addEventListener('DOMContentLoaded', function() {
    // Get the quiz container
    const quizContainer = document.getElementById('quiz-container');
    if (!quizContainer) return;

    // Get the current page name from the URL
    const currentPage = window.location.pathname.split('/').pop().replace('.html', '');
    const jsonFile = `qcm/${currentPage}.json`;

    // Constants for app settings
    const QUIZ_SETTINGS = {
        MAX_QUESTIONS: 20,
        STORAGE_PREFIX: 'quiz_',
        TIMER_INTERVAL: 1000 // ms
    };

    // Variables to keep track of quiz state
    let questions = [];
    let currentQuestionIndex = 0;
    let score = 0;
    let userAnswers = [];
    let quizTimer = null;
    let quizTimeElapsed = 0;
    let reviewMode = false;

    // Create local storage key specific to this quiz
    const storageKey = `${QUIZ_SETTINGS.STORAGE_PREFIX}${currentPage}`;

    // Function to load the questions from JSON file
    async function loadQuestions() {
        try {
            // Show loading indicator
            quizContainer.innerHTML = `
                <div class="loading">
                    <div class="spinner"></div>
                    <p>Chargement des questions...</p>
                </div>
            `;

            // Check for cached questions to prevent unnecessary network requests
            const cachedQuestions = sessionStorage.getItem(`${storageKey}_questions`);
            
            // If we have cached questions that are less than 1 hour old, use them
            if (cachedQuestions) {
                try {
                    const cached = JSON.parse(cachedQuestions);
                    if (cached.timestamp > Date.now() - 3600000) { // 1 hour cache
                        questions = cached.data;
                        initializeQuiz();
                        return;
                    }
                } catch (e) {
                    console.warn('Failed to parse cached questions, fetching fresh data.');
                    // Continue to fetch fresh data
                }
            }

            const response = await fetch(jsonFile);
            if (!response.ok) throw new Error('Failed to load questions');
            
            const allQuestions = await response.json();
            
            // Filter out entries without questions (explanation-only entries)
            questions = allQuestions.filter(q => q.question && q.options && q.answer);
            
            // Cache the questions for future use
            sessionStorage.setItem(`${storageKey}_questions`, JSON.stringify({
                timestamp: Date.now(),
                data: questions
            }));
            
            initializeQuiz();
        } catch (error) {
            console.error('Error loading questions:', error);
            quizContainer.innerHTML = `
                <div class="error-message">
                    <p>Impossible de charger les questions. Veuillez réessayer plus tard.</p>
                    <p>Erreur: ${error.message}</p>
                    <button id="btn-retry-load" class="btn btn-primary">Réessayer</button>
                </div>
            `;
            
            // Add retry button listener
            document.getElementById('btn-retry-load').addEventListener('click', loadQuestions);
        }
    }

    // Function to initialize the quiz
    function initializeQuiz() {
        // Check for saved progress
        const savedProgress = localStorage.getItem(storageKey);
        
        if (savedProgress) {
            try {
                const progress = JSON.parse(savedProgress);
                // Only restore if within 24 hours
                if (progress.timestamp > Date.now() - 86400000) { // 24 hours
                    showRestoreProgressPrompt(progress);
                    return;
                }
            } catch (e) {
                console.warn('Failed to parse saved progress, starting new quiz.');
                // Continue to start a new quiz
            }
        }
        
        startNewQuiz();
    }

    // Function to show prompt for restoring previous progress
    function showRestoreProgressPrompt(progress) {
        const lastSession = new Date(progress.timestamp).toLocaleString();
        
        quizContainer.innerHTML = `
            <div class="restore-progress">
                <h2>Session précédente détectée</h2>
                <p>Vous avez une session non terminée du ${lastSession}.</p>
                <p>Question: ${progress.currentQuestion + 1}/${progress.totalQuestions}</p>
                <p>Score actuel: ${progress.score}/${progress.currentQuestion}</p>
                <div class="restore-buttons">
                    <button id="btn-restore" class="btn btn-primary">Continuer cette session</button>
                    <button id="btn-new" class="btn btn-outline">Démarrer une nouvelle session</button>
                </div>
            </div>
        `;
        
        document.getElementById('btn-restore').addEventListener('click', () => {
            restoreProgress(progress);
        });
        
        document.getElementById('btn-new').addEventListener('click', () => {
            localStorage.removeItem(storageKey);
            startNewQuiz();
        });
    }

    // Function to restore previous quiz progress
    function restoreProgress(progress) {
        userAnswers = progress.userAnswers;
        score = progress.score;
        currentQuestionIndex = progress.currentQuestion;
        quizTimeElapsed = progress.timeElapsed || 0;
        
        // Ensure we're using the same questions
        if (progress.questionIds && progress.questionIds.length > 0) {
            // Reconstruct question order based on saved IDs
            const orderedQuestions = [];
            progress.questionIds.forEach(id => {
                const question = questions.find(q => q.id === id);
                if (question) orderedQuestions.push(question);
            });
            
            if (orderedQuestions.length === progress.totalQuestions) {
                questions = orderedQuestions;
            } else {
                // If reconstruction fails, select new random questions
                if (questions.length > QUIZ_SETTINGS.MAX_QUESTIONS) {
                    questions = shuffleArray(questions).slice(0, QUIZ_SETTINGS.MAX_QUESTIONS);
                } else {
                    questions = shuffleArray(questions);
                }
            }
        } else {
            // Legacy: just shuffle if no IDs were saved
            if (questions.length > QUIZ_SETTINGS.MAX_QUESTIONS) {
                questions = shuffleArray(questions).slice(0, QUIZ_SETTINGS.MAX_QUESTIONS);
            } else {
                questions = shuffleArray(questions);
            }
        }
        
        showQuestion(currentQuestionIndex);
        updateProgressBar();
        startTimer();
    }

    // Function to start a new quiz
    function startNewQuiz() {
        // Limit the number of questions to MAX_QUESTIONS and shuffle them
        if (questions.length > QUIZ_SETTINGS.MAX_QUESTIONS) {
            questions = shuffleArray(questions).slice(0, QUIZ_SETTINGS.MAX_QUESTIONS);
        } else {
            questions = shuffleArray(questions);
        }
        
        // Add unique IDs to questions if they don't have them
        questions.forEach((q, index) => {
            if (!q.id) q.id = `q${index}_${Date.now()}`;
        });
        
        userAnswers = new Array(questions.length).fill(null);
        currentQuestionIndex = 0;
        score = 0;
        quizTimeElapsed = 0;
        reviewMode = false;
        
        showQuestion(currentQuestionIndex);
        updateProgressBar();
        startTimer();
    }

    // Function to start the quiz timer
    function startTimer() {
        if (quizTimer) clearInterval(quizTimer);
        
        // Update timer display
        updateTimerDisplay();
        
        // Start timer interval
        quizTimer = setInterval(() => {
            quizTimeElapsed += 1;
            updateTimerDisplay();
            // Save progress every minute
            if (quizTimeElapsed % 60 === 0) saveProgress();
        }, QUIZ_SETTINGS.TIMER_INTERVAL);
    }

    // Function to update timer display
    function updateTimerDisplay() {
        const timerContainer = document.querySelector('.timer-container');
        if (!timerContainer) return;
        
        const minutes = Math.floor(quizTimeElapsed / 60);
        const seconds = quizTimeElapsed % 60;
        
        timerContainer.querySelector('.timer-value').textContent = 
            `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    // Function to save quiz progress
    function saveProgress() {
        const progress = {
            userAnswers: userAnswers,
            currentQuestion: currentQuestionIndex,
            score: score,
            totalQuestions: questions.length,
            timeElapsed: quizTimeElapsed,
            timestamp: Date.now(),
            questionIds: questions.map(q => q.id)
        };
        
        localStorage.setItem(storageKey, JSON.stringify(progress));
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
                        <div class="option-item ${userAnswers[index] === i ? 'selected' : ''}" 
                             data-index="${i}" 
                             role="button" 
                             tabindex="0"
                             aria-pressed="${userAnswers[index] === i ? 'true' : 'false'}">
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
                <button id="btn-check" class="btn btn-primary" ${userAnswers[index] !== null && !reviewMode ? '' : 'disabled'}>Vérifier ma réponse</button>
                <button id="btn-next" class="btn btn-outline" ${index === questions.length - 1 ? 'disabled' : ''}>Suivant</button>
            </div>
        `;
        
        // Create timer and progress display
        const headerHTML = `
            <div class="quiz-header-info">
                <div class="progress-container">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${((index + 1) / questions.length) * 100}%"></div>
                    </div>
                    <div class="progress-text">Question ${index + 1} sur ${questions.length}</div>
                </div>
                <div class="timer-container">
                    <span class="timer-label"><i class="fas fa-clock"></i></span>
                    <span class="timer-value">00:00</span>
                </div>
            </div>
        `;
        
        // Update the quiz container
        quizContainer.innerHTML = headerHTML + questionHTML + controlsHTML;
        
        // If in review mode, show explanations and answers
        if (reviewMode) {
            showReviewState(index);
        } else {
            // Add event listeners to options
            document.querySelectorAll('.option-item').forEach(option => {
                option.addEventListener('click', selectOption);
                option.addEventListener('keypress', (event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                        selectOption(event);
                    }
                });
            });
            
            // Add event listeners to buttons
            const checkButton = document.getElementById('btn-check');
            if (checkButton) {
                checkButton.addEventListener('click', checkAnswer);
                
                // Enable check button if an answer is already selected
                if (userAnswers[index] !== null) {
                    checkButton.disabled = false;
                }
            }
        }
        
        const prevButton = document.getElementById('btn-prev');
        if (prevButton) {
            prevButton.addEventListener('click', () => {
                if (currentQuestionIndex > 0) {
                    currentQuestionIndex--;
                    showQuestion(currentQuestionIndex);
                    updateProgressBar();
                    saveProgress();
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
                    saveProgress();
                } else {
                    showResults();
                }
            });
        }
        
        // Update timer display
        updateTimerDisplay();
    }

    // Function to show review state for a question
    function showReviewState(index) {
        const selectedIndex = userAnswers[index];
        if (selectedIndex === null) return;
        
        const question = questions[index];
        const selectedOption = document.querySelector(`.option-item[data-index="${selectedIndex}"]`);
        const correctIndex = question.options.indexOf(question.answer);
        const correct = selectedIndex === correctIndex;
        
        // Mark the selected option as correct or incorrect
        if (selectedOption) {
            selectedOption.classList.add(correct ? 'correct' : 'incorrect');
        }
        
        // If incorrect, highlight the correct answer
        if (!correct) {
            const correctOption = document.querySelector(`.option-item[data-index="${correctIndex}"]`);
            if (correctOption) {
                correctOption.classList.add('correct');
            }
        }
        
        // Show the explanation
        document.getElementById(`explanation-${index}`).classList.add('show');
        
        // Disable clicking on options
        document.querySelectorAll('.option-item').forEach(option => {
            option.removeEventListener('click', selectOption);
            option.style.cursor = 'default';
        });
        
        // Hide check button if in review mode
        const checkButton = document.getElementById('btn-check');
        if (checkButton) {
            checkButton.style.display = 'none';
        }
    }

    // Function to handle option selection
    function selectOption(event) {
        // Remove selected class from all options
        document.querySelectorAll('.option-item').forEach(opt => {
            opt.classList.remove('selected');
            opt.setAttribute('aria-pressed', 'false');
        });
        
        // Add selected class to the clicked option
        const selectedOption = event.currentTarget;
        selectedOption.classList.add('selected');
        selectedOption.setAttribute('aria-pressed', 'true');
        
        // Store the selected answer
        userAnswers[currentQuestionIndex] = parseInt(selectedOption.getAttribute('data-index'));
        
        // Enable check button
        const checkButton = document.getElementById('btn-check');
        if (checkButton) {
            checkButton.disabled = false;
        }
        
        // Save progress 
        saveProgress();
    }

    // Function to check the answer
    function checkAnswer() {
        const question = questions[currentQuestionIndex];
        const selectedIndex = userAnswers[currentQuestionIndex];
        
        // If no option is selected, alert the user
        if (selectedIndex === null || selectedIndex === undefined) {
            alert('Veuillez sélectionner une réponse avant de vérifier.');
            return;
        }
        
        const correctIndex = question.options.indexOf(question.answer);
        const correct = selectedIndex === correctIndex;
        const selectedOption = document.querySelector(`.option-item[data-index="${selectedIndex}"]`);
        
        // Mark the selected option as correct or incorrect
        selectedOption.classList.add(correct ? 'correct' : 'incorrect');
        
        // If incorrect, highlight the correct answer
        if (!correct) {
            const correctOption = document.querySelector(`.option-item[data-index="${correctIndex}"]`);
            correctOption.classList.add('correct');
        } else {
            // Update score if correct
            score++;
        }
        
        // Show the explanation with animation
        const explanation = document.getElementById(`explanation-${currentQuestionIndex}`);
        explanation.classList.add('show');
        explanation.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        
        // Disable the check button and enable navigation
        document.getElementById('btn-check').disabled = true;
        document.getElementById('btn-check').classList.add('btn-disabled');
        
        // Disable clicking on options
        document.querySelectorAll('.option-item').forEach(option => {
            option.removeEventListener('click', selectOption);
            option.style.cursor = 'default';
        });
        
        // Auto move to next question after delay if not the last question
        if (currentQuestionIndex < questions.length - 1) {
            const nextButton = document.getElementById('btn-next');
            nextButton.classList.add('btn-highlight'); // Add highlight effect
            
            // Don't auto-advance on mobile devices
            if (window.innerWidth > 768) {
                setTimeout(() => {
                    if (nextButton && !nextButton.disabled) {
                        nextButton.click();
                    }
                }, 3000);
            }
        }
        
        // Save progress after checking answer
        saveProgress();
    }

    // Function to display final results
    function showResults() {
        // Stop the timer
        if (quizTimer) clearInterval(quizTimer);
        
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
        
        // Format time display
        const minutes = Math.floor(quizTimeElapsed / 60);
        const seconds = quizTimeElapsed % 60;
        const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        const resultHTML = `
            <div class="quiz-result">
                <h2 class="result-header">Résultat du quiz</h2>
                <div class="result-details">
                    <div class="result-score">${score}/${questions.length}</div>
                    <div class="result-percentage">${percentage}%</div>
                </div>
                <p class="result-message">${resultMessage}</p>
                <p class="result-time">Temps total: ${timeString}</p>
                <div class="result-chart">
                    <div class="chart-bar">
                        <div class="chart-fill" style="width: ${percentage}%"></div>
                    </div>
                </div>
                <div class="nav-buttons">
                    <button id="btn-review" class="btn btn-outline">Revoir mes réponses</button>
                    <button id="btn-retry" class="btn btn-primary">Réessayer</button>
                    <a href="resume-viewer.html?file=resume/${currentPage}.md&subject=${document.title.replace('QCM - ', '')}" class="btn btn-outline">Voir le résumé</a>
                    <a href="index.html" class="btn btn-outline">Retour à l'accueil</a>
                </div>
            </div>
        `;
        
        quizContainer.innerHTML = resultHTML;
        
        // Save the result to local storage
        const resultData = {
            quiz: currentPage,
            score: score,
            total: questions.length,
            percentage: percentage,
            date: new Date().toISOString(),
            time: quizTimeElapsed
        };
        
        // Save in history (up to 10 entries per quiz)
        const historyKey = `${storageKey}_history`;
        let history = JSON.parse(localStorage.getItem(historyKey) || '[]');
        history.unshift(resultData);
        history = history.slice(0, 10); // Keep only the 10 most recent
        localStorage.setItem(historyKey, JSON.stringify(history));
        
        // Clear current progress since quiz is complete
        localStorage.removeItem(storageKey);
        
        // Add event listener to retry button
        document.getElementById('btn-retry').addEventListener('click', () => {
            currentQuestionIndex = 0;
            score = 0;
            userAnswers = new Array(questions.length).fill(null);
            questions = shuffleArray(questions);
            quizTimeElapsed = 0;
            reviewMode = false;
            showQuestion(currentQuestionIndex);
            updateProgressBar();
            startTimer();
        });
        
        // Add event listener to review button
        document.getElementById('btn-review').addEventListener('click', () => {
            reviewMode = true;
            currentQuestionIndex = 0;
            showQuestion(currentQuestionIndex);
            updateProgressBar();
        });
    }

    // Function to update the progress bar
    function updateProgressBar() {
        const progressContainer = document.querySelector('.progress-container');
        if (!progressContainer) {
            // Create progress bar if it doesn't exist - this should not happen now
            // as we're creating it in showQuestion
            return;
        }
        
        // Update existing progress bar
        const progressFill = document.querySelector('.progress-fill');
        const progressText = document.querySelector('.progress-text');
        
        if (progressFill && progressText) {
            const progressPercentage = ((currentQuestionIndex + 1) / questions.length) * 100;
            progressFill.style.width = `${progressPercentage}%`;
            progressText.textContent = `Question ${currentQuestionIndex + 1} sur ${questions.length}`;
        }
    }

    // Utility function to shuffle an array using Fisher-Yates algorithm
    function shuffleArray(array) {
        const newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    }

    // Add keyboard navigation support
    function setupKeyboardNavigation() {
        document.addEventListener('keydown', (event) => {
            // Don't handle keyboard if an input is focused
            if (document.activeElement.tagName === 'INPUT' || 
                document.activeElement.tagName === 'TEXTAREA') {
                return;
            }
            
            switch (event.key) {
                case 'ArrowRight':
                    const nextBtn = document.getElementById('btn-next');
                    if (nextBtn && !nextBtn.disabled) nextBtn.click();
                    break;
                case 'ArrowLeft':
                    const prevBtn = document.getElementById('btn-prev');
                    if (prevBtn && !prevBtn.disabled) prevBtn.click();
                    break;
                case 'Enter':
                    const checkBtn = document.getElementById('btn-check');
                    if (checkBtn && !checkBtn.disabled) checkBtn.click();
                    break;
                case '1': case '2': case '3': case '4': case '5': case '6': case '7': case '8': case '9':
                    const num = parseInt(event.key) - 1;
                    const options = document.querySelectorAll('.option-item');
                    if (options && num < options.length) {
                        options[num].click();
                    }
                    break;
            }
        });
    }

    // Setup resize handler for mobile optimizations
    function setupResizeHandler() {
        const handleResize = () => {
            if (window.innerWidth <= 768) {
                document.body.classList.add('mobile-view');
            } else {
                document.body.classList.remove('mobile-view');
            }
        };
        
        // Initial call
        handleResize();
        
        // Set up listener
        window.addEventListener('resize', handleResize);
    }

    // Check if browser supports required features
    function checkBrowserCompatibility() {
        const features = ['localStorage', 'sessionStorage', 'fetch'];
        const missing = features.filter(feature => !(feature in window));
        
        if (missing.length > 0) {
            console.warn(`Your browser doesn't support: ${missing.join(', ')}`);
            alert("Votre navigateur ne supporte pas certaines fonctionnalités nécessaires. Les fonctionnalités de sauvegarde peuvent ne pas fonctionner correctement.");
        }
    }

    // Initialize everything
    function init() {
        checkBrowserCompatibility();
        setupKeyboardNavigation();
        setupResizeHandler();
        loadQuestions();
        
        // Add event listener for beforeunload to warn about leaving
        window.addEventListener('beforeunload', (event) => {
            // Only show warning if quiz is in progress and not in review mode
            if (!reviewMode && currentQuestionIndex > 0 && currentQuestionIndex < questions.length - 1) {
                event.preventDefault();
                event.returnValue = '';
                return '';
            }
        });
    }

    // Start the quiz
    init();
});
