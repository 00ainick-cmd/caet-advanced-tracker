/**
 * CAET Adaptive Onboarding Logic
 * Handles 3-step flow: Profile Setup -> Diagnostic Test -> Results & Study Plan
 */

document.addEventListener('DOMContentLoaded', () => {

    // --- State & DOM Elements ---
    const state = {
        name: '',
        background: '',
        branch: '',
        mos: '',
        employer: '',
        experience: '',
        certs: [],
        targetDate: '',
        currentView: 1,
        questions: [],
        currentQIndex: 0,
        userAnswers: {}, // index -> choice Index
        results: {} // category -> score obj
    };

    // Views & Stepper
    const views = {
        1: document.getElementById('view-1'),
        2: document.getElementById('view-2'),
        3: document.getElementById('view-3'),
        4: document.getElementById('view-4')
    };
    const dots = [
        document.getElementById('dot-1'),
        document.getElementById('dot-2'),
        document.getElementById('dot-3'),
        document.getElementById('dot-4')
    ];
    const lines = [
        document.getElementById('line-1'),
        document.getElementById('line-2'),
        document.getElementById('line-3')
    ];

    // Intro Step 1
    const btnNextIntro = document.getElementById('btn-next-intro');

    // Inputs Step 2
    const radioCards = document.querySelectorAll('.radio-card');
    const militaryFields = document.getElementById('military-fields');
    const nameInput = document.getElementById('student-name');
    const employerInput = document.getElementById('employer-name');
    const experienceSelect = document.getElementById('experience-years');
    const certCheckboxes = document.querySelectorAll('input[name="certs"]');
    const branchInput = document.getElementById('military-branch');
    const mosInput = document.getElementById('military-mos');
    const dateInput = document.getElementById('target-date');
    const btnNext1 = document.getElementById('btn-next-1');

    // Topbar
    const userGreeting = document.getElementById('user-greeting');

    // Test Step 2
    const testLoading = document.getElementById('test-loading');
    const testContainer = document.getElementById('test-container');
    const qCurrentEl = document.getElementById('q-current');
    const qTotalEl = document.getElementById('q-total');
    const qCatNameEl = document.getElementById('q-cat-name');
    const qCatIconEl = document.getElementById('q-cat-icon');
    const qTextEl = document.getElementById('q-text');
    const qOptionsContainer = document.getElementById('q-options');
    const progFill = document.getElementById('test-progress-fill');

    const btnPrevQ = document.getElementById('btn-prev-q');
    const btnNextQ = document.getElementById('btn-next-q');
    const btnFinish = document.getElementById('btn-finish-test');

    // Results Step 3
    const resultsChart = document.getElementById('results-chart');
    const militaryCallout = document.getElementById('military-callout-box');
    const militaryCalloutText = document.getElementById('military-callout-text');
    const studyPlanList = document.getElementById('study-plan-list');


    // ==========================================
    // STEP 1: WELCOME LOGIC
    // ==========================================
    btnNextIntro.addEventListener('click', () => {
        goToView(2);
    });

    // ==========================================
    // STEP 2: PROFILE LOGIC & VALIDATION
    // ==========================================

    radioCards.forEach(card => {
        card.addEventListener('click', () => {
            radioCards.forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            state.background = card.dataset.val;

            if (state.background === 'military') {
                militaryFields.classList.add('show');
            } else {
                militaryFields.classList.remove('show');
                state.branch = '';
                state.mos = '';
                branchInput.value = '';
                mosInput.value = '';
            }
            validateStep1();
        });
    });

    [nameInput, branchInput, mosInput].forEach(el => {
        el.addEventListener('input', validateStep1);
        el.addEventListener('change', validateStep1);
    });

    function validateStep1() {
        let isValid = nameInput.value.trim() !== '' && state.background !== '';

        if (state.background === 'military') {
            if (branchInput.value.trim() === '' || mosInput.value.trim() === '') {
                isValid = false;
            }
        }

        // Remove disabled state instead of adding it, as JS controls the flow.
        // Or we can just manage a toast if they click without valid data.
        // For now, if invalid, clicking does nothing or shows alert.
    }

    btnNext1.addEventListener('click', () => {
        // Run validation
        let isValid = nameInput.value.trim() !== '' &&
            employerInput.value.trim() !== '' &&
            state.background !== '';

        if (state.background === 'military') {
            if (branchInput.value === '' || mosInput.value.trim() === '') {
                isValid = false;
            }
        }

        if (!isValid) {
            alert('Please fill out all required fields: Name, Employer, and Background.');
            return;
        }

        // Save State
        state.name = nameInput.value.trim();
        state.employer = employerInput.value.trim();
        state.experience = experienceSelect.value;

        // Collect checkboxes
        state.certs = [];
        certCheckboxes.forEach(cb => {
            if (cb.checked) state.certs.push(cb.value);
        });

        state.branch = branchInput.value;
        state.mos = mosInput.value.trim();
        state.targetDate = dateInput.value;

        // Update top greeting globally
        localStorage.setItem('caet-userName', state.name);
        userGreeting.textContent = `AVN.TECH / ${state.name.toUpperCase()}`;
        userGreeting.style.display = 'block';

        goToView(3);
        loadDiagnosticTest();
    });


    // ==========================================
    // STEP 3: TEST ENGINE
    // ==========================================

    async function loadDiagnosticTest() {
        testContainer.style.display = 'none';
        testLoading.style.display = 'flex';

        try {
            const resp = await fetch('master-bank.json');
            const data = await resp.json();

            // Extract 3 questions per category (Easy, Medium, Hard)
            const catMap = {}; // catId -> { easy:[], medium:[], hard:[] }

            // Group everything
            data.questions.forEach(q => {
                if (!catMap[q.category]) catMap[q.category] = { easy: [], medium: [], hard: [] };
                const diff = q.difficulty || 'medium'; // default if missing
                if (catMap[q.category][diff]) {
                    catMap[q.category][diff].push(q);
                } else {
                    catMap[q.category]['medium'].push(q);
                }
            });

            const selectedQuestions = [];
            const cats = data.categories || [];

            // Generate map of cat details for UI
            window.caetCategories = {};
            cats.forEach(c => window.caetCategories[c.id] = c);

            // Pick questions
            cats.forEach(cat => {
                const group = catMap[cat.id] || { easy: [], medium: [], hard: [] };
                // randomly pick 1 from each
                if (group.easy.length) selectedQuestions.push(pickRandom(group.easy));
                if (group.medium.length) selectedQuestions.push(pickRandom(group.medium));
                if (group.hard.length) selectedQuestions.push(pickRandom(group.hard));
            });

            // If we somehow didn't get 24, pad it (edge case protection)
            // But we should shuffle first
            shuffleArray(selectedQuestions);

            // Cap at 24 just to be safe
            state.questions = selectedQuestions.slice(0, 24);
            state.currentQIndex = 0;
            state.userAnswers = {};

            // Render
            qTotalEl.textContent = state.questions.length;
            renderCurrentQuestion();

            setTimeout(() => {
                testLoading.style.display = 'none';
                testContainer.style.display = 'block';
            }, 1000); // UI Polish delay

        } catch (e) {
            console.error("Failed to load test:", e);
            alert("Error loading test data.");
        }
    }

    function renderCurrentQuestion() {
        const q = state.questions[state.currentQIndex];
        const catInfo = window.caetCategories[q.category] || { name: q.category, icon: '❔' };

        qCurrentEl.textContent = state.currentQIndex + 1;
        qCatNameEl.textContent = catInfo.name;
        qCatIconEl.textContent = catInfo.icon;

        let headerText = '';
        let mcData = null;

        if (q.multipleChoice) mcData = q.multipleChoice;
        else if (q.practice) mcData = q.practice;
        else if (q.jeopardy) mcData = q.jeopardy; // Fallback
        else if (q.preassessment) mcData = q.preassessment;

        if (mcData) {
            headerText = mcData.question;
            qTextEl.innerHTML = headerText; // Using innerHTML in case of tags in json

            qOptionsContainer.innerHTML = '';
            mcData.choices.forEach((choiceText, index) => {
                const letter = String.fromCharCode(65 + index); // A, B, C, D

                const optEl = document.createElement('div');
                optEl.className = 'mc-option';
                optEl.dataset.idx = index;
                if (state.userAnswers[state.currentQIndex] === index) {
                    optEl.classList.add('selected');
                }

                optEl.innerHTML = `
                    <div class="mc-letter">${letter}</div>
                    <div class="mc-text">${choiceText}</div>
                `;

                optEl.addEventListener('click', () => {
                    // Visually select
                    document.querySelectorAll('.mc-option').forEach(el => el.classList.remove('selected'));
                    optEl.classList.add('selected');
                    // Save state
                    state.userAnswers[state.currentQIndex] = index;
                    // Enable next
                    btnNextQ.disabled = false;
                    btnFinish.disabled = false;
                });

                qOptionsContainer.appendChild(optEl);
            });

            // Progress Bar
            const pct = ((state.currentQIndex + 1) / state.questions.length) * 100;
            progFill.style.width = pct + '%';

            // Check if next is enabled
            const hasAnswered = state.userAnswers[state.currentQIndex] !== undefined;
            btnNextQ.disabled = !hasAnswered;
            btnFinish.disabled = !hasAnswered;

            // Buttons display
            btnPrevQ.style.visibility = state.currentQIndex > 0 ? 'visible' : 'hidden';

            if (state.currentQIndex === state.questions.length - 1) {
                btnNextQ.style.display = 'none';
                btnFinish.style.display = 'flex';
            } else {
                btnNextQ.style.display = 'flex';
                btnFinish.style.display = 'none';
            }

        } else {
            qTextEl.textContent = "Error: Question format unsupported.";
        }
    }

    btnPrevQ.addEventListener('click', () => {
        if (state.currentQIndex > 0) {
            state.currentQIndex--;
            renderCurrentQuestion();
        }
    });

    btnNextQ.addEventListener('click', () => {
        if (state.currentQIndex < state.questions.length - 1) {
            state.currentQIndex++;
            renderCurrentQuestion();
        }
    });

    btnFinish.addEventListener('click', () => {
        calculateResults();
        goToView(4);
    });

    // ==========================================
    // STEP 4: RESULTS CALCULATION & SYNC
    // ==========================================

    async function calculateResults() {
        // 1. Tally scores per category
        const catStats = {};

        state.questions.forEach((q, idx) => {
            if (!catStats[q.category]) {
                catStats[q.category] = { correct: 0, total: 0, id: q.category };
            }

            catStats[q.category].total++;

            // Get correct answer index
            let correctIdx = 0;
            if (q.multipleChoice) correctIdx = q.multipleChoice.correctIndex;
            else if (q.practice) correctIdx = q.practice.correctIndex;
            else if (q.jeopardy) correctIdx = q.jeopardy.correctIndex;
            else if (q.preassessment) correctIdx = q.preassessment.correctIndex;

            if (state.userAnswers[idx] === correctIdx) {
                catStats[q.category].correct++;
            }
        });

        // 2. Format array and calc %
        const resultsArray = Object.values(catStats).map(stat => {
            const pct = stat.total > 0 ? (stat.correct / stat.total) * 100 : 0;
            const catInfo = window.caetCategories[stat.id] || { name: stat.id, icon: '' };
            return {
                ...stat,
                pct: Math.round(pct),
                name: catInfo.name,
                icon: catInfo.icon
            }
        });

        // 3. Sort ascending (Weakest first)
        resultsArray.sort((a, b) => a.pct - b.pct);

        // 4. Render Chart
        resultsChart.innerHTML = '';
        studyPlanList.innerHTML = '';

        resultsArray.forEach((r, idx) => {
            let colorClass = 'green';
            if (r.pct < 60) colorClass = 'red';
            else if (r.pct < 80) colorClass = 'yellow';

            const row = document.createElement('div');
            row.className = 'bar-row';
            row.innerHTML = `
                <div class="bar-label">${r.icon} ${r.name}</div>
                <div class="bar-track-wrap">
                    <div class="bar-track">
                        <div class="bar-fill ${colorClass}" style="width: 0%" data-target="${r.pct}%"></div>
                    </div>
                    <div class="bar-score">${r.pct}%</div>
                </div>
            `;
            resultsChart.appendChild(row);

            // Animate bar width lazily
            setTimeout(() => {
                const fill = row.querySelector('.bar-fill');
                fill.style.width = fill.dataset.target;
            }, 100);

            // Render Study Plan Mockup (Ordered list)
            const planItem = document.createElement('div');
            planItem.style.padding = "16px";
            planItem.style.background = "var(--surface-2)";
            planItem.style.border = "1px solid var(--border)";
            planItem.style.marginBottom = "8px";
            planItem.style.borderRadius = "8px";
            planItem.style.display = "flex";
            planItem.style.alignItems = "center";
            planItem.style.gap = "16px";
            planItem.innerHTML = `
                <div style="width: 30px; height: 30px; border-radius: 50%; background: var(--surface-3); display: flex; align-items: center; justify-content: center; font-family: var(--font-mono); font-weight: 700;">${idx + 1}</div>
                <div style="flex: 1; font-weight: 600;">Mod ${idx + 1}: ${r.name}</div>
                <div style="font-size: 13px; color: var(--text-muted);">Priority: ${colorClass === 'red' ? 'High' : (colorClass === 'yellow' ? 'Medium' : 'Review')}</div>
            `;
            studyPlanList.appendChild(planItem);
        });

        // 5. Military Callout
        if (state.background === 'military' && state.branch && state.mos) {
            try {
                const r = await fetch('military-crosswalk.json');
                const crosswalk = await r.json();

                // Lookup Branch -> MOS
                const branchData = crosswalk[state.branch];
                if (branchData) {
                    const mosData = branchData[state.mos.toUpperCase()];
                    if (mosData) {
                        militaryCalloutText.innerHTML = `
                            <strong>As a former ${state.branch} ${mosData.title}</strong>, we've identified likely strengths in certain modules. <br><br>
                            ${mosData.note}
                        `;
                        militaryCallout.style.display = 'block';
                    } else {
                        // generic fallback
                        militaryCalloutText.innerHTML = `As a former ${state.branch} service member, we salute you. Your study plan has been tailored to bridge military avionics experience to civilian FAA requirements.`;
                        militaryCallout.style.display = 'block';
                    }
                }
            } catch (e) {
                console.error("Failed to load military crosswalk:", e);
            }
        }

        // 6. Sync Data to Python SQLite Server
        await syncToDatabase(resultsArray);
        localStorage.setItem('caet-onboarding-complete', 'true');
    }

    async function syncToDatabase(resultsArray) {
        const payload = {
            profile: {
                name: state.name,
                background: state.background,
                employer: state.employer,
                experience: state.experience,
                certs: state.certs,
                branch: state.branch,
                mos: state.mos
            },
            scores: resultsArray.map(r => ({ category: r.id, score_percent: r.pct }))
        };

        try {
            console.log("Syncing onboarding payload to local DB...", payload);
            const response = await fetch('/api/students', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) throw new Error("Server responded with " + response.status);

            const result = await response.json();
            console.log("Successfully saved student data. Server ID:", result.student_id);

        } catch (error) {
            console.error("Warning: Could not sync data to local server:", error);
            // We do not block the UI if backend is down for the student.
        }
    }


    // ==========================================
    // HELPERS
    // ==========================================

    function goToView(stepNum) {
        state.currentView = stepNum;

        // Update Sections
        Object.values(views).forEach(v => v.classList.remove('active'));
        views[stepNum].classList.add('active');

        // Update Stepper
        dots.forEach((d, i) => {
            const num = i + 1;
            if (num < stepNum) {
                d.classList.add('completed');
                d.classList.remove('active');
                d.innerHTML = '✓';
            } else if (num === stepNum) {
                d.classList.add('active');
                d.classList.remove('completed');
                d.innerHTML = num;
            } else {
                d.classList.remove('active');
                d.classList.remove('completed');
                d.innerHTML = num;
            }
        });

        lines.forEach((l, i) => {
            if (i < stepNum - 1) {
                l.classList.add('active');
            } else {
                l.classList.remove('active');
            }
        });
    }

    function pickRandom(arr) {
        if (!arr || arr.length === 0) return null;
        return arr[Math.floor(Math.random() * arr.length)];
    }

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

});
