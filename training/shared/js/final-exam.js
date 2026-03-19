/**
 * final-exam.js
 * Logic for the 60-question CAET Mock Exam with Premium UI & Admin Simulator
 */

const EXAM_TIME_SECONDS = 90 * 60; // 90 minutes
const QUESTION_COUNT = 60;
const POINTS_PER_QUESTION = 10;

const MODULE_PATHS = [
    'training/caet/mod1-maintenance-regs/data/jeopardy.json',
    'training/caet/mod2-basic-electrical/data/jeopardy.json',
    'training/caet/mod3-cns-systems/data/jeopardy.json',
    'training/caet/mod4-flight-instruments/data/jeopardy.json',
    'training/caet/mod5-digital-databus/data/jeopardy.json',
    'training/caet/mod6-aircraft-wiring/data/jeopardy.json',
    'training/caet/mod7-tools-test-equipment/data/jeopardy.json',
    'training/caet/mod8-shop-safety/data/jeopardy.json',
    'training/caet/final/data/caet-mock-exam.json'
];

let examPool = [];
let currentQuestions = [];
let userAnswers = new Array(QUESTION_COUNT).fill(null);
let currentIndex = 0;
let timeRemaining = EXAM_TIME_SECONDS;
let timerInterval = null;

// UI Elements
const loadingOverlay = document.getElementById('loadingOverlay');
const examUI = document.getElementById('examUI');
const navGrid = document.getElementById('navGrid');
const questionCategory = document.getElementById('questionCategory');
const questionCounter = document.getElementById('questionCounter');
const timeDisplay = document.getElementById('timeDisplay');
const btnPrev = document.getElementById('btnPrev');
const btnNext = document.getElementById('btnNext');
const btnSubmit = document.getElementById('btnSubmit');
const btnSubmitTop = document.getElementById('btnSubmitTop');
const questionText = document.getElementById('questionText');
const optionsContainer = document.getElementById('optionsContainer');
const contentScroll = document.getElementById('contentScroll');

async function initExam() {
    try {
        // Fetch course index to map valid LO IDs
        let courseIndex = {};
        const loMap = {};
        try {
            // Adjust path to course_index.json based on location relative to index root
            const indexRes = await fetch('../../../course_index.json');
            if (indexRes.ok) {
                courseIndex = await indexRes.json();
                for (const [loId, mapping] of Object.entries(courseIndex)) {
                    if (mapping.rise_url) {
                        const match = mapping.rise_url.match(/mod\d+/);
                        if (match) {
                            const modKey = match[0];
                            if (!loMap[modKey]) loMap[modKey] = [];
                            loMap[modKey].push(loId);
                        }
                    } else if (mapping.node_id) {
                        // Fallback fallback if rise_url is missing
                        const modKey = 'mod' + mapping.node_id.charAt(1);
                        if (!loMap[modKey]) loMap[modKey] = [];
                        loMap[modKey].push(loId);
                    }
                }
            } else {
                // Fallback for root path just in case
                const fallbackRes = await fetch('course_index.json');
                if (fallbackRes.ok) {
                    courseIndex = await fallbackRes.json();
                    for (const [loId, mapping] of Object.entries(courseIndex)) {
                        if (mapping.rise_url) {
                            const match = mapping.rise_url.match(/mod\d+/);
                            if (match) {
                                const modKey = match[0];
                                if (!loMap[modKey]) loMap[modKey] = [];
                                loMap[modKey].push(loId);
                            }
                        }
                    }
                }
            }
        } catch (e) {
            console.warn("Could not load course index for LO mapping", e);
        }

        let loadedModules = 0;
        for (const path of MODULE_PATHS) {
            try {
                const res = await fetch(path);
                if (!res.ok) continue;
                const data = await res.json();

                const modMatch = path.match(/mod\d+/);
                const modKey = modMatch ? modMatch[0] : null;

                if (data.categories) {
                    for (const catName in data.categories) {
                        const questions = data.categories[catName];
                        questions.forEach(q => {
                            let mappedLoId = q.id;
                            // Assign a valid LO for the recommendation engine
                            if (modKey && loMap[modKey] && loMap[modKey].length > 0) {
                                mappedLoId = loMap[modKey][Math.floor(Math.random() * loMap[modKey].length)];
                            }

                            examPool.push({
                                ...q,
                                moduleTitle: data.metadata?.title || 'Unknown Module',
                                category: catName,
                                mapped_lo_id: mappedLoId
                            });
                        });
                    }
                }
                if (data.final) {
                    data.final.forEach(q => {
                        let mappedLoId = q.id;
                        if (modKey && loMap[modKey] && loMap[modKey].length > 0) {
                            mappedLoId = loMap[modKey][Math.floor(Math.random() * loMap[modKey].length)];
                        }

                        examPool.push({
                            ...q,
                            moduleTitle: data.metadata?.title || 'Unknown Module',
                            category: 'Final Challenge',
                            mapped_lo_id: mappedLoId
                        });
                    });
                }
            } catch (e) {
                console.error(`Failed to load ${path}:`, e);
            }
            loadedModules++;
            document.getElementById('compilingText').innerText = `SECURE CONNECTION... ${loadedModules}/8`;
        }

        if (examPool.length < QUESTION_COUNT) {
            currentQuestions = shuffleArray([...examPool]);
        } else {
            currentQuestions = shuffleArray([...examPool]).slice(0, QUESTION_COUNT);
        }

        userAnswers = new Array(currentQuestions.length).fill(null);

        // Build Nav Grid
        navGrid.innerHTML = '';
        currentQuestions.forEach((_, i) => {
            const cell = document.createElement('div');
            cell.className = 'nav-cell';
            cell.innerText = i + 1;
            cell.onclick = () => renderQuestion(i);
            navGrid.appendChild(cell);
        });

        // Start UI
        loadingOverlay.style.display = 'none';
        examUI.style.display = 'flex';

        startTimer();
        renderQuestion(0);

    } catch (err) {
        console.error('Error initializing exam:', err);
        loadingOverlay.innerHTML = '<div style="color:#ef4444;font-size:1rem;font-family:monospace;">ERROR: CONNECTION FAILED</div>';
    }
}

function startTimer() {
    updateTimerDisplay();
    timerInterval = setInterval(() => {
        timeRemaining--;
        updateTimerDisplay();

        if (timeRemaining <= 300) {
            timeDisplay.classList.add('warning');
        }

        if (timeRemaining <= 0) {
            clearInterval(timerInterval);
            timeRemaining = 0;
            updateTimerDisplay();
            autoSubmitExam();
        }
    }, 1000);
}

function updateTimerDisplay() {
    const mins = Math.floor(timeRemaining / 60);
    const secs = timeRemaining % 60;
    timeDisplay.innerText = `${mins}:${secs.toString().padStart(2, '0')}`;
}

function renderQuestion(index) {
    currentIndex = index;
    const q = currentQuestions[index];

    // Update Meta
    questionCategory.innerText = q.moduleTitle.replace('CAET M', 'M');
    questionCounter.innerText = `Q ${index + 1} / ${currentQuestions.length}`;
    questionText.innerHTML = q.clue;

    // Render options
    optionsContainer.innerHTML = '';

    q.choices.forEach((choiceText, i) => {
        const row = document.createElement('div');
        row.className = 'option-row';
        if (userAnswers[index] === i) {
            row.classList.add('selected');
        }

        row.innerHTML = `
            <div class="option-column-left">
                <div class="radio-circle">
                    <div class="radio-dot"></div>
                </div>
            </div>
            <div class="option-column-right">
                ${choiceText}
            </div>
        `;

        row.onclick = () => selectOption(i);
        optionsContainer.appendChild(row);
    });

    // Update Sidebar Grid active state
    Array.from(navGrid.children).forEach((cell, i) => {
        if (i === index) cell.classList.add('active');
        else cell.classList.remove('active');

        if (userAnswers[i] !== null) cell.classList.add('answered');
        else cell.classList.remove('answered');
    });

    // Handle Buttons
    btnPrev.disabled = (index === 0);

    if (index === currentQuestions.length - 1) {
        btnNext.style.display = 'none';
        btnSubmit.style.display = 'block';
    } else {
        btnNext.style.display = 'block';
        btnSubmit.style.display = 'none';
    }

    // Scroll to top of question area
    contentScroll.scrollTop = 0;
}

function selectOption(choiceIndex) {
    userAnswers[currentIndex] = choiceIndex;

    // Update active visual state
    const rows = optionsContainer.querySelectorAll('.option-row');
    rows.forEach((r, i) => {
        if (i === choiceIndex) r.classList.add('selected');
        else r.classList.remove('selected');
    });

    // Mark current sidebar cell as answered
    navGrid.children[currentIndex].classList.add('answered');
}

btnPrev.addEventListener('click', () => {
    if (currentIndex > 0) renderQuestion(currentIndex - 1);
});

btnNext.addEventListener('click', () => {
    if (currentIndex < currentQuestions.length - 1) renderQuestion(currentIndex + 1);
});

function handleExamSubmit() {
    const unansweredCount = userAnswers.filter(a => a === null).length;
    let msg = 'Are you sure you want to submit your certification exam?';
    if (unansweredCount > 0) {
        msg = `WARNING: You have ${unansweredCount} unanswered questions.\n\nAre you sure you want to finalize your submission?`;
    }

    if (confirm(msg)) {
        finishExam(true); // true = push to supabase
    }
}

btnSubmit.addEventListener('click', handleExamSubmit);
if (btnSubmitTop) btnSubmitTop.addEventListener('click', handleExamSubmit);

function autoSubmitExam() {
    alert("Time is up! Your exam has been automatically submitted.");
    finishExam(true);
}

// Admin Simulator Hotkey
document.addEventListener('keydown', (e) => {
    // Ctrl+K
    if (e.ctrlKey && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        document.getElementById('adminModal').style.display = 'flex';
    }
});

// Admin Func
window.simulateExamScore = function (mode) {
    document.getElementById('adminModal').style.display = 'none';

    let targetPct = 0;
    if (mode === 'high') targetPct = 0.95;
    if (mode === 'medium') targetPct = 0.75;
    if (mode === 'low') targetPct = 0.45;

    // Fill answers based on probability
    currentQuestions.forEach((q, i) => {
        if (Math.random() < targetPct) {
            userAnswers[i] = q.correctIndex;
        } else {
            // Pick a random incorrect answer
            let bogus = q.correctIndex;
            while (bogus === q.correctIndex) {
                bogus = Math.floor(Math.random() * q.choices.length);
            }
            userAnswers[i] = bogus;
        }
    });

    // We skip Supabase logging for simulated scores so as not to poison data
    alert(`Simulated a ${mode} score. Proceeding to results and skipping Supabase telemetry...`);
    finishExam(false);
};

async function finishExam(logToSupabase = true) {
    clearInterval(timerInterval);

    // Show Loading state
    examUI.style.opacity = '0.3';
    examUI.style.pointerEvents = 'none';

    // Setup Supabase
    const client = window.AceSupabase?.getClient();
    const sessionId = window.AceSupabase?.getSessionId();

    const timestamp = new Date().toISOString();
    const resultsPayload = [];

    // Tally
    let correctCount = 0;
    currentQuestions.forEach((q, i) => {
        const userAnswer = userAnswers[i];
        const isCorrect = (userAnswer === q.correctIndex);
        if (isCorrect) correctCount++;

        if (client && sessionId && logToSupabase) {
            resultsPayload.push({
                session_id: sessionId,
                created_at: timestamp,
                module_id: 'final_exam',
                lo_id: q.mapped_lo_id || q.id || q.learningObjective || 'exam:unknown',
                action: 'answer',
                is_correct: isCorrect,
                points: isCorrect ? POINTS_PER_QUESTION : 0,
                format: 'final'
            });
        }
    });

    const scorePct = Math.round((correctCount / currentQuestions.length) * 100);

    // Save report data
    const reportData = {
        scorePct,
        correctCount,
        totalQuestions: currentQuestions.length,
        timeSpent: EXAM_TIME_SECONDS - timeRemaining,
        questions: currentQuestions.map((q, i) => ({
            moduleTitle: q.moduleTitle,
            category: q.category,
            clue: q.clue,
            userAnswer: userAnswers[i],
            correctIndex: q.correctIndex,
            isCorrect: userAnswers[i] === q.correctIndex,
            explanation: q.explanation,
            lo_id: q.mapped_lo_id || q.id || 'unknown'
        }))
    };

    localStorage.setItem('ace_final_result', JSON.stringify(reportData));

    // Push to Supabase
    if (logToSupabase && client && resultsPayload.length > 0) {
        try {
            const { error } = await client.from('ace_question_events').insert(resultsPayload);
            if (error) console.error("Error saving final exam telemetry:", error);
        } catch (e) {
            console.error("Failed to push telemetry:", e);
        }
    }

    window.location.href = 'exam-results.html';
}

// Utility
function shuffleArray(array) {
    let curId = array.length;
    while (0 !== curId) {
        let randId = Math.floor(Math.random() * curId);
        curId -= 1;
        let tmp = array[curId];
        array[curId] = array[randId];
        array[randId] = tmp;
    }
    return array;
}

// Init
document.addEventListener('DOMContentLoaded', initExam);
