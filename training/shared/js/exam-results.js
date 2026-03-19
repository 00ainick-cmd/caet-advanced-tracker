/**
 * exam-results.js
 * Parses the local storage results from final-exam.js to generate 
 * a Spider Chart and targeted study recommendations.
 */

document.addEventListener('DOMContentLoaded', async () => {
    const rawData = localStorage.getItem('ace_final_result');
    if (!rawData) {
        document.body.innerHTML = `
            <div style="text-align:center; padding: 100px; color:var(--text-primary);">
                <h2>No Exam Data Found</h2>
                <p>It looks like you haven't taken the Final Mock Exam recently.</p>
                <a href="dashboard.html" class="btn-dashboard" style="margin-top:20px;display:inline-block;">Return to Dashboard</a>
            </div>
        `;
        return;
    }

    const results = JSON.parse(rawData);

    // 1. Render Top Level Score
    renderHeroScore(results);

    // 2. Render Spider Chart
    renderSpiderChart(results);

    // 3. Render Recommendations
    await renderRecommendations(results);
});

function renderHeroScore(results) {
    const gradeEl = document.getElementById('gradeLetter');
    const detailsEl = document.getElementById('scoreDetails');

    // Define Grade Letter
    let letter = 'F';
    let gradeClass = 'grade-F';

    if (results.scorePct >= 90) { letter = 'A'; gradeClass = 'grade-A'; }
    else if (results.scorePct >= 80) { letter = 'B'; gradeClass = 'grade-B'; }
    else if (results.scorePct >= 70) { letter = 'C'; gradeClass = 'grade-C'; }
    else if (results.scorePct >= 60) { letter = 'D'; gradeClass = 'grade-D'; }

    gradeEl.innerText = letter;
    gradeEl.className = `score-grade ${gradeClass}`;

    const mins = Math.floor(results.timeSpent / 60);
    const secs = results.timeSpent % 60;
    const timeFormatted = `${mins}m ${secs}s`;

    detailsEl.innerHTML = `Score: <strong>${results.scorePct}%</strong> (${results.correctCount} / ${results.totalQuestions}) <br> <span style="font-size:0.9rem; opacity:0.8;">Time: ${timeFormatted}</span>`;
}

function renderSpiderChart(results) {
    // Group by Module Title
    const moduleStats = {};

    results.questions.forEach(q => {
        const mod = q.moduleTitle.replace('CAET M', 'M').replace('FIA: ', ''); // Simplify names for chart
        if (!moduleStats[mod]) {
            moduleStats[mod] = { correct: 0, total: 0 };
        }
        moduleStats[mod].total++;
        if (q.isCorrect) moduleStats[mod].correct++;
    });

    const labels = [];
    const dataPoints = [];

    for (const [mod, stats] of Object.entries(moduleStats)) {
        labels.push(mod.length > 25 ? mod.substring(0, 25) + '...' : mod);
        // Calculate percentage for that module
        const pct = Math.round((stats.correct / stats.total) * 100);
        dataPoints.push(pct);
    }

    const ctx = document.getElementById('spiderChart').getContext('2d');

    new Chart(ctx, {
        type: 'radar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Module Mastery %',
                data: dataPoints,
                backgroundColor: 'rgba(212, 168, 83, 0.2)',
                borderColor: '#D4A853',
                pointBackgroundColor: '#D4A853',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: '#D4A853',
                borderWidth: 2,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                r: {
                    angleLines: { color: 'rgba(255, 255, 255, 0.1)' },
                    grid: { color: 'rgba(255, 255, 255, 0.1)' },
                    pointLabels: {
                        color: '#d0d8f0',
                        font: { family: "'JetBrains Mono', monospace", size: 10 }
                    },
                    ticks: {
                        display: false, // hide the 0-100 numbers on the web rings
                        min: 0,
                        max: 100,
                        stepSize: 25
                    }
                }
            },
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            return ` ${context.raw}% Pass Rate`;
                        }
                    }
                }
            }
        }
    });
}

async function renderRecommendations(results) {
    const recList = document.getElementById('recList');

    // Find missed LOs
    const missedLOs = new Set();
    const missedDetails = {}; // Map lo_id -> count of missed questions

    results.questions.forEach(q => {
        if (!q.isCorrect && q.lo_id && q.lo_id !== 'unknown' && q.lo_id !== 'exam:unknown') {
            missedLOs.add(q.lo_id);
            if (!missedDetails[q.lo_id]) missedDetails[q.lo_id] = 0;
            missedDetails[q.lo_id]++;
        }
    });

    if (missedLOs.size === 0) {
        recList.innerHTML = `
            <div class="empty-state">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-bottom:16px;">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
                <br>
                Flawless victory! No specific learning objectives require remediation.
            </div>
        `;
        return;
    }

    try {
        // Fetch course index to lookup Node URLs
        const res = await fetch('course_index.json');
        const courseIndex = await res.json();

        let html = '';

        // Sort missed LOs by frequency (most missed first)
        const sortedMissed = Array.from(missedLOs).sort((a, b) => missedDetails[b] - missedDetails[a]);

        sortedMissed.forEach(loId => {
            const mapping = courseIndex[loId];
            if (mapping) {
                const mistakes = missedDetails[loId];
                const msg = mistakes > 1 ? `${mistakes} missed questions` : `1 missed question`;

                html += `
                    <div class="rec-item">
                        <div class="rec-info">
                            <span class="rec-module">${mapping.node_id} — ${msg}</span>
                            <span class="rec-title">${mapping.node_title}</span>
                        </div>
                        <a href="training_modules/${mapping.node_id}_training.html" class="rec-btn">Review Module</a>
                    </div>
                `;
            }
        });

        if (html === '') {
            html = '<div style="color:var(--text-secondary); text-align:center;">Could not map missed questions to specific modules.</div>';
        }

        recList.innerHTML = html;

    } catch (err) {
        console.error("Failed to load course index for recommendations", err);
        recList.innerHTML = '<div style="color:var(--error); text-align:center;">Error loading study plan mapping.</div>';
    }
}
