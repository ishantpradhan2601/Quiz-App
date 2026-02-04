// Elements
const startScreen = document.querySelector('.start-screen');
const container = document.querySelector('.container');
const questionBox = document.querySelector('.question');
const choicesBox = document.querySelector('.choices');
const nextBtn = document.querySelector('.nextBtn');
const restartBtn = document.querySelector('.restartBtn');
const scoreScreen = document.querySelector('.score-screen');
const quizBody = document.querySelector('.quiz-body');
const footer = document.querySelector('footer');
const header = document.querySelector('header');
const alertBox = document.querySelector('.alert');
const startBtn = document.querySelector('.startBtn');
const timeText = document.querySelector('.time-text');
const currentQSpan = document.getElementById('current-q');
const totalQSpan = document.getElementById('total-q');
const userScoreSpan = document.getElementById('user-score');
const totalScoreSpan = document.getElementById('total-score');
const loader = document.querySelector('.loader-container');

// Quiz State
let quiz = [];
let currentQuestionIndex = 0;
let score = 0;
let timeLeft = 15;
let timerID = null;
let isQuestionAnswered = false;

// Helper: Decode HTML Entities (API returns encoded strings)
const decodeHTML = (html) => {
    const txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value;
};

// Fetch Questions from API
const fetchQuestions = async () => {
    try {
        loader.style.display = 'flex';
        const res = await fetch('https://opentdb.com/api.php?amount=10&type=multiple');
        const data = await res.json();

        // Transform API data to our format
        quiz = data.results.map((item) => {
            const formattedQuestion = {
                question: decodeHTML(item.question),
                choices: [...item.incorrect_answers.map(decodeHTML), decodeHTML(item.correct_answer)],
                answer: decodeHTML(item.correct_answer)
            };
            // Shuffle choices for this question
            for (let i = formattedQuestion.choices.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [formattedQuestion.choices[i], formattedQuestion.choices[j]] = [formattedQuestion.choices[j], formattedQuestion.choices[i]];
            }
            return formattedQuestion;
        });

        loader.style.display = 'none';
        startQuiz();

    } catch (error) {
        console.error("Failed to fetch questions:", error);
        loader.style.display = 'none';
        displayAlert("Failed to load questions. Please try again.", "danger");
        startScreen.style.display = 'block'; // return to start
    }
};

// Start Button Listener
startBtn.addEventListener('click', () => {
    startScreen.style.display = "none";
    fetchQuestions();
});

const startQuiz = () => {
    currentQuestionIndex = 0;
    score = 0;

    // Update Total Question Count in UI
    totalQSpan.textContent = quiz.length;

    container.style.display = "block";
    quizBody.style.display = "block";
    footer.style.display = "flex";
    header.style.display = "flex";
    scoreScreen.style.display = "none";

    showQuestions();
};

// Show Question
const showQuestions = () => {
    isQuestionAnswered = false;
    const questionDetails = quiz[currentQuestionIndex];
    questionBox.textContent = questionDetails.question;
    choicesBox.innerHTML = ""; // Clear previous choices

    // Update Progress
    currentQSpan.textContent = currentQuestionIndex + 1;

    // Create Options
    questionDetails.choices.forEach(choiceText => {
        const choiceDiv = document.createElement('div');
        choiceDiv.textContent = choiceText;
        choiceDiv.classList.add('choice');
        choicesBox.appendChild(choiceDiv);

        choiceDiv.addEventListener('click', () => selectChoice(choiceDiv));
    });

    startTimer();
};

// Select Choice logic
const selectChoice = (choiceDiv) => {
    if (isQuestionAnswered) return; // Prevent multiple selections

    // Remove 'selected' from all others
    const allChoices = document.querySelectorAll('.choice');
    allChoices.forEach(c => c.classList.remove('selected'));

    choiceDiv.classList.add('selected');
};

// Check Answer (Triggered by Next Button)
nextBtn.addEventListener('click', () => {
    if (isQuestionAnswered) {
        nextQuestion();
        return;
    }

    const selectedChoice = document.querySelector('.choice.selected');

    if (!selectedChoice) {
        displayAlert("Please select an answer!");
        return;
    }

    checkAnswer(selectedChoice);
});

const checkAnswer = (selectedChoice) => {
    isQuestionAnswered = true;
    clearInterval(timerID);

    const correctAnswer = quiz[currentQuestionIndex].answer;

    if (selectedChoice.textContent === correctAnswer) {
        selectedChoice.classList.add('correct');
        score++;
        displayAlert("Correct Answer!", "success");
    } else {
        selectedChoice.classList.add('wrong');
        displayAlert(`Wrong! Correct: ${correctAnswer}`, "danger");

        // Highlight the correct one
        const allChoices = document.querySelectorAll('.choice');
        allChoices.forEach(choice => {
            if (choice.textContent === correctAnswer) {
                choice.classList.add('correct');
            }
        });
    }

    // Delay before moving to next question
    setTimeout(() => {
        nextQuestion();
    }, 2000);
};

const nextQuestion = () => {
    currentQuestionIndex++;
    if (currentQuestionIndex < quiz.length) {
        timeLeft = 15;
        showQuestions();
    } else {
        showScore();
    }
};

const showScore = () => {
    container.style.display = "block";
    quizBody.style.display = "none";
    footer.style.display = "none";
    header.style.display = "none";
    scoreScreen.style.display = "block";

    userScoreSpan.textContent = score;
    totalScoreSpan.textContent = quiz.length;
};

// Timer Logic
const startTimer = () => {
    clearInterval(timerID);
    timeLeft = 15;
    timeText.textContent = timeLeft;

    timerID = setInterval(() => {
        timeLeft--;
        timeText.textContent = timeLeft;

        if (timeLeft <= 0) {
            clearInterval(timerID);
            displayAlert("Time Up! Moving to next...", "danger");

            // Highlight correct answer and move on
            const correctAnswer = quiz[currentQuestionIndex].answer;
            const allChoices = document.querySelectorAll('.choice');
            allChoices.forEach(choice => {
                if (choice.textContent === correctAnswer) {
                    choice.classList.add('correct');
                }
            });

            setTimeout(nextQuestion, 2000);
        }
    }, 1000);
};

// Alert/Toast Notification
const displayAlert = (msg, type = 'normal') => {
    alertBox.style.display = "block";
    alertBox.textContent = msg;

    // Style based on type
    if (type === 'success') {
        alertBox.style.background = "rgba(0, 184, 148, 0.9)";
        alertBox.style.borderColor = "#00b894";
    } else if (type === 'danger') {
        alertBox.style.background = "rgba(255, 118, 117, 0.9)";
        alertBox.style.borderColor = "#ff7675";
    } else {
        alertBox.style.background = "rgba(255, 255, 255, 0.1)";
    }

    setTimeout(() => {
        alertBox.style.display = "none";
    }, 2000);
};

// Restart Game
restartBtn.addEventListener('click', () => {
    scoreScreen.style.display = "none";
    startScreen.style.display = "block";
    container.style.display = "none";
});