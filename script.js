// Information repository for volcano features
const information = {
    crater: "🕳️ CRATER: The bowl-shaped opening at the top of a volcano where magma, ash, and gases break through to the surface during an eruption.",
    magma: "🔥 MAGMA: Extremely hot molten rock stored beneath Earth's crust. When pressure builds up, it rises toward volcanic vents.",
    lava: "🌋 LAVA: Molten rock that has burst out onto Earth's surface. It can flow at temperatures ranging from 700°C to 1,200°C!",
    ash: "💨 ASH & GAS: Superheated clouds of pulverized rock particles, steam, carbon dioxide, and sulfur dioxide blasted into the atmosphere."
};

// Volcano Quiz Dataset
const quizData = [
    {
        question: "What is molten rock called while it is beneath Earth's surface?",
        options: [
            { text: "A. Volcanic ash", correct: false },
            { text: "B. Magma", correct: true },
            { text: "C. Lava", correct: false }
        ],
        explanation: "Magma is molten rock stored under the surface. Once it erupts, it becomes lava."
    },
    {
        question: "What is the bowl-shaped opening at the top of a volcano called?",
        options: [
            { text: "A. Crater", correct: true },
            { text: "B. Fault line", correct: false },
            { text: "C. Trench", correct: false }
        ],
        explanation: "The crater is the opening at the summit through which eruption materials emerge."
    },
    {
        question: "What is magma called after it erupts onto Earth's surface?",
        options: [
            { text: "A. Basalt dust", correct: false },
            { text: "B. Obsidian", correct: false },
            { text: "C. Lava", correct: true }
        ],
        explanation: "Lava is the term for molten rock flowing across Earth's surface."
    },
    {
        question: "Which gas makes up the majority of volcanic gas emissions?",
        options: [
            { text: "A. Water Vapour (H₂O)", correct: true },
            { text: "B. Oxygen (O₂)", correct: false },
            { text: "C. Methane (CH₄)", correct: false }
        ],
        explanation: "Water vapour accounts for over 60% to 90% of all gases released during eruptions!"
    }
];

let currentQuestionIndex = 0;
let userScore = 0;
let answerSubmitted = false;
let hudVisible = true;

// Tab Switching (Explorer vs Quiz)
function switchTab(tabName) {
    const controlsCard = document.getElementById('tab-controls');
    const quizCard = document.getElementById('tab-quiz');
    const controlsBtn = document.getElementById('nav-controls-btn');
    const quizBtn = document.getElementById('nav-quiz-btn');

    if (tabName === 'controls') {
        controlsCard.classList.add('active');
        quizCard.classList.remove('active');
        controlsBtn.classList.add('active');
        quizBtn.classList.remove('active');
    } else if (tabName === 'quiz') {
        controlsCard.classList.remove('active');
        quizCard.classList.add('active');
        controlsBtn.classList.remove('active');
        quizBtn.classList.add('active');
    }
    hudVisible = true;
}

// Toggle HUD overlay visibility for camera view
function toggleHudVisibility() {
    const activeCard = document.querySelector('.hud-card.active');
    const toggleBtn = document.getElementById('nav-toggle-btn');
    
    if (!activeCard) {
        // If none active, show controls
        switchTab('controls');
        toggleBtn.innerText = '👁️ HUD';
        return;
    }

    if (activeCard.style.display === 'none') {
        activeCard.style.display = 'block';
        toggleBtn.innerText = '👁️ HUD';
    } else {
        activeCard.style.display = 'none';
        toggleBtn.innerText = '🙈 Hide';
    }
}

// Show Volcano Feature Info
function showInfo(part) {
    const infoElem = document.getElementById("info");
    if (infoElem && information[part]) {
        infoElem.innerText = information[part];
        infoElem.style.borderLeftColor = "#ff6b4a";
    }

    // Optional camera target focus on 3D model viewer
    const viewer = document.getElementById('volcano-viewer');
    if (viewer && viewer.cameraTarget) {
        if (part === 'crater') viewer.cameraTarget = '0m 1.5m 0m';
        else if (part === 'magma') viewer.cameraTarget = '0m 0.2m 0m';
        else if (part === 'lava') viewer.cameraTarget = '0.5m 0.8m 0m';
        else if (part === 'ash') viewer.cameraTarget = '0m 2.2m 0m';
    }
}

// Trigger Eruption Animation
function erupt() {
    const info = document.getElementById("info");
    if (info) {
        info.innerText = "💥 ERUPTION IN PROGRESS! Pressure forces molten magma upward, blasting gas clouds and lava!";
        info.style.borderLeftColor = "#ff2a6d";
    }

    document.body.classList.add("eruption-active");

    setTimeout(function () {
        document.body.classList.remove("eruption-active");
    }, 2000);
}

// Quiz System Functions
function loadQuestion() {
    const qData = quizData[currentQuestionIndex];
    const questionElem = document.getElementById('question');
    const optionsContainer = document.getElementById('quiz-options');
    const progressBadge = document.getElementById('quiz-progress');
    const feedbackElem = document.getElementById('quiz-feedback');
    const nextBtn = document.getElementById('next-btn');
    const scoreDisplay = document.getElementById('quiz-score-display');

    answerSubmitted = false;
    questionElem.innerText = qData.question;
    progressBadge.innerText = `Q ${currentQuestionIndex + 1}/${quizData.length}`;
    scoreDisplay.innerText = `Score: ${userScore}/${quizData.length}`;

    feedbackElem.className = 'quiz-feedback hidden';
    feedbackElem.innerText = '';
    nextBtn.classList.add('hidden');

    optionsContainer.innerHTML = '';

    qData.options.forEach((opt, idx) => {
        const btn = document.createElement('button');
        btn.className = 'quiz-option-btn';
        btn.innerText = opt.text;
        btn.onclick = () => selectAnswer(idx);
        optionsContainer.appendChild(btn);
    });
}

function selectAnswer(selectedIndex) {
    if (answerSubmitted) return;
    answerSubmitted = true;

    const qData = quizData[currentQuestionIndex];
    const optionBtns = document.querySelectorAll('.quiz-option-btn');
    const feedbackElem = document.getElementById('quiz-feedback');
    const nextBtn = document.getElementById('next-btn');

    optionBtns.forEach((btn, idx) => {
        btn.disabled = true;
        if (qData.options[idx].correct) {
            btn.classList.add('correct-opt');
        } else if (idx === selectedIndex) {
            btn.classList.add('wrong-opt');
        }
    });

    const isCorrect = qData.options[selectedIndex].correct;

    if (isCorrect) {
        userScore++;
        feedbackElem.className = 'quiz-feedback correct';
        feedbackElem.innerText = `✅ Correct! ${qData.explanation}`;
    } else {
        feedbackElem.className = 'quiz-feedback wrong';
        feedbackElem.innerText = `❌ Not quite! ${qData.explanation}`;
    }

    document.getElementById('quiz-score-display').innerText = `Score: ${userScore}/${quizData.length}`;
    nextBtn.classList.remove('hidden');

    if (currentQuestionIndex === quizData.length - 1) {
        nextBtn.innerText = 'See Summary 🏆';
    } else {
        nextBtn.innerText = 'Next Question ➔';
    }
}

function nextQuestion() {
    currentQuestionIndex++;
    if (currentQuestionIndex < quizData.length) {
        loadQuestion();
    } else {
        showQuizSummary();
    }
}

function showQuizSummary() {
    const questionElem = document.getElementById('question');
    const optionsContainer = document.getElementById('quiz-options');
    const feedbackElem = document.getElementById('quiz-feedback');
    const nextBtn = document.getElementById('next-btn');
    const progressBadge = document.getElementById('quiz-progress');

    progressBadge.innerText = 'Finished!';
    questionElem.innerText = `🎉 Quiz Completed! You scored ${userScore} out of ${quizData.length}!`;

    optionsContainer.innerHTML = '';
    feedbackElem.className = 'quiz-feedback correct';
    feedbackElem.innerText = userScore === quizData.length 
        ? "🌟 Perfect score! You're a true Volcanologist!" 
        : "Great effort! Tap below to restart and try for a top score.";

    nextBtn.innerText = 'Restart Quiz 🔄';
    nextBtn.classList.remove('hidden');
    nextBtn.onclick = restartQuiz;
}

function restartQuiz() {
    currentQuestionIndex = 0;
    userScore = 0;
    const nextBtn = document.getElementById('next-btn');
    nextBtn.onclick = nextQuestion;
    loadQuestion();
}

// Initialize quiz & WebXR event handling
document.addEventListener('DOMContentLoaded', () => {
    loadQuestion();

    const viewer = document.getElementById('volcano-viewer');
    const overlay = document.getElementById('ar-overlay-container');
    const arMount = document.getElementById('ar-slot-mount');
    const mainContainer = document.querySelector('.main-container');

    // Handle AR status changes (WebXR session start / end)
    if (viewer && overlay) {
        viewer.addEventListener('ar-status', (event) => {
            const status = event.detail.status;
            if (status === 'session-started' || status === 'object-placed') {
                if (arMount && !arMount.contains(overlay)) {
                    arMount.appendChild(overlay);
                }
                overlay.classList.remove('mode-2d');
                overlay.classList.add('mode-ar');
            } else if (status === 'not-presenting') {
                if (mainContainer && !mainContainer.contains(overlay)) {
                    mainContainer.appendChild(overlay);
                }
                overlay.classList.remove('mode-ar');
                overlay.classList.add('mode-2d');
            }
        });
    }

    // Prevent WebXR model placement gestures from swallowing button taps
    if (overlay) {
        ['beforexrselect', 'touchstart', 'touchend', 'click'].forEach(eventType => {
            overlay.addEventListener(eventType, (e) => {
                if (e.target.closest('button, .hud-card, .ar-hud-nav')) {
                    e.stopPropagation();
                }
            }, true);
        });
    }
});