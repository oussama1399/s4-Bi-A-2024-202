// Script pour gérer l'affichage et l'interaction avec les QCM

document.addEventListener('DOMContentLoaded', function() {
    // Récupérer l'élément qui contiendra les questions
    const quizContainer = document.getElementById('quiz-container');
    // Le nom du fichier JSON est extrait de l'URL actuelle
    const currentPage = window.location.pathname.split('/').pop().replace('.html', '');
    const jsonFile = `qcm/${currentPage}.json`;
    
    // Fonction pour charger les questions depuis le fichier JSON
    async function loadQuestions() {
        try {
            const response = await fetch(jsonFile);
            if (!response.ok) {
                throw new Error('Impossible de charger les questions');
            }
            
            const questions = await response.json();
            renderQuiz(questions);
        } catch (error) {
            console.error('Erreur lors du chargement des questions:', error);
            quizContainer.innerHTML = `<div class="error-message">Erreur lors du chargement des questions. Veuillez réessayer.</div>`;
        }
    }
    
    // Fonction pour afficher les questions du quiz
    function renderQuiz(questions) {
        // Mélanger les questions pour plus de variété
        const shuffledQuestions = shuffleArray(questions).slice(0, 20); // Limiter à 20 questions
        
        let quizHTML = `<h2>Quiz - ${document.title.replace('QCM - ', '')}</h2>`;
        
        shuffledQuestions.forEach((questionData, index) => {
            const questionNumber = index + 1;
            
            if (!questionData.question) {
                return; // Ignorer les entrées sans question
            }
            
            quizHTML += `
                <div class="question" id="question-${questionNumber}">
                    <h3><span class="question-number">${questionNumber}.</span> ${questionData.question}</h3>
                    <ul class="options">
            `;
            
            // Mélanger les options si elles existent
            if (questionData.options && questionData.options.length > 0) {
                const shuffledOptions = shuffleArray([...questionData.options]);
                
                shuffledOptions.forEach((option, optionIndex) => {
                    quizHTML += `
                        <li class="option" data-index="${optionIndex}" data-value="${option}">
                            <span class="option-letter">${String.fromCharCode(65 + optionIndex)}.</span> 
                            ${option}
                        </li>
                    `;
                });
            }
            
            quizHTML += `
                    </ul>
                    <div class="explanation" id="explanation-${questionNumber}">
                        <strong>Explication:</strong> ${questionData.explanation || 'Aucune explication disponible.'}
                    </div>
                </div>
            `;
        });
        
        quizHTML += `
            <div class="quiz-controls">
                <button id="check-answers" class="btn">Vérifier mes réponses</button>
                <button id="show-all-explanations" class="btn btn-outline">Afficher toutes les explications</button>
            </div>
        `;
        
        quizContainer.innerHTML = quizHTML;
        
        // Ajouter les événements pour l'interactivité
        addQuizInteractivity(shuffledQuestions);
    }
    
    // Fonction pour ajouter l'interactivité au quiz
    function addQuizInteractivity(questions) {
        const optionElements = document.querySelectorAll('.option');
        const checkButton = document.getElementById('check-answers');
        const showExplanationsButton = document.getElementById('show-all-explanations');
        
        // Permettre la sélection des options
        optionElements.forEach(option => {
            option.addEventListener('click', function() {
                // Désélectionner les autres options dans la même question
                const questionElement = this.closest('.question');
                const options = questionElement.querySelectorAll('.option');
                options.forEach(opt => opt.classList.remove('selected'));
                
                // Sélectionner cette option
                this.classList.add('selected');
            });
        });
        
        // Vérifier les réponses
        checkButton.addEventListener('click', function() {
            let score = 0;
            
            questions.forEach((questionData, index) => {
                if (!questionData.question) return;
                
                const questionNumber = index + 1;
                const questionElement = document.getElementById(`question-${questionNumber}`);
                const selectedOption = questionElement.querySelector('.option.selected');
                
                if (selectedOption) {
                    const selectedValue = selectedOption.getAttribute('data-value');
                    
                    if (selectedValue === questionData.answer) {
                        selectedOption.classList.add('correct');
                        score++;
                    } else {
                        selectedOption.classList.add('incorrect');
                        
                        // Mettre en évidence la bonne réponse
                        const options = questionElement.querySelectorAll('.option');
                        options.forEach(opt => {
                            if (opt.getAttribute('data-value') === questionData.answer) {
                                opt.classList.add('correct');
                            }
                        });
                    }
                    
                    // Afficher l'explication
                    const explanation = document.getElementById(`explanation-${questionNumber}`);
                    explanation.classList.add('show');
                }
            });
            
            // Afficher le score
            const scoreMessage = document.createElement('div');
            scoreMessage.className = 'score-message';
            scoreMessage.innerHTML = `
                <h3>Votre score: ${score}/${questions.filter(q => q.question).length}</h3>
                <p>${getScoreMessage(score, questions.filter(q => q.question).length)}</p>
            `;
            
            // Remplacer le bouton par le score
            this.replaceWith(scoreMessage);
        });
        
        // Afficher toutes les explications
        showExplanationsButton.addEventListener('click', function() {
            document.querySelectorAll('.explanation').forEach(exp => {
                exp.classList.add('show');
            });
            
            this.disabled = true;
            this.textContent = 'Explications affichées';
        });
    }
    
    // Fonction pour mélanger un tableau (algorithme de Fisher-Yates)
    function shuffleArray(array) {
        const newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    }
    
    // Fonction pour obtenir un message en fonction du score
    function getScoreMessage(score, total) {
        const percentage = (score / total) * 100;
        
        if (percentage >= 90) return "Excellent ! Vous maîtrisez parfaitement ce sujet !";
        if (percentage >= 75) return "Très bien ! Vous avez de solides connaissances.";
        if (percentage >= 60) return "Bien ! Continuez vos efforts.";
        if (percentage >= 40) return "Vous pouvez faire mieux. Révisez ce sujet.";
        return "Il semble que vous ayez besoin de revoir ce sujet en profondeur.";
    }
    
    // Charger les questions au chargement de la page
    loadQuestions();
});
