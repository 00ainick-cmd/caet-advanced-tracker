/**
 * ace-gamification.js
 * ACE Avionics Training — Gamification Engine
 *
 * Pulls the user's event history from Supabase, calculates Readiness Grade, XP, 
 * Streak, and identifies the lowest-performing Learning Objective (LO) to 
 * provide a targeted study recommendation in ACE's speech bubble.
 */

window.AceGamification = {
    async initDashboard() {
        if (!window.AceSupabase) {
            console.warn('[Gamification] ACE Supabase client not found.');
            return;
        }

        const client = window.AceSupabase.getClient();
        const sessionId = window.AceSupabase.getSessionId();

        if (!client) return;

        try {
            // Fetch the last 1000 events for this user to calculate stats
            const { data: events, error } = await client
                .from('ace_question_events')
                .select('created_at, lo_id, is_correct, points, lesson_id, format')
                .eq('session_id', sessionId)
                .order('created_at', { ascending: false })
                .limit(1000);

            if (error) throw error;

            let finalEvents = events || [];

            // If brand new user with 0 events, dashboard will show starter state
            if (finalEvents.length === 0) {
                console.log("[Gamification] No events found yet. Complete some drills or jeopardy rounds to start tracking your progress!");
            }

            this.processAndRenderStats(finalEvents);

        } catch (err) {
            console.error('[Gamification] Error fetching stats:', err.message);
            // We might want to alert the user that they need to add a SELECT policy
            if (err.message.includes('row-level security') || err.message.includes('policy')) {
                console.warn('[Gamification] Note: Supabase RLS policies may be blocking SELECT access for the anon role.');
            }
        }
    },

    processAndRenderStats(events) {
        let totalXp = 0;
        let totalQuestions = 0;
        let correctQuestions = 0;
        const daysActive = new Set();
        const loStats = {};

        // Parse events
        events.forEach(e => {
            // XP
            totalXp += (e.points || 0);
            if (e.is_correct && e.points === 0 && e.format !== 'journey-read') {
                // Fallback XP for drills if points weren't explicitly set
                totalXp += 5;
            }

            // Readiness
            if (e.format === 'drill' || e.format === 'jeopardy' || e.format === 'final' || e.format === 'flashcard') {
                totalQuestions++;
                if (e.is_correct) correctQuestions++;
            }

            // Streak 
            if (e.created_at) {
                const dateSplit = e.created_at.split('T')[0]; // YYYY-MM-DD
                daysActive.add(dateSplit);
            }

            // LO Mastery Tracking
            if (e.lo_id && e.format !== 'journey-read') {
                if (!loStats[e.lo_id]) loStats[e.lo_id] = { correct: 0, total: 0 };
                loStats[e.lo_id].total++;
                if (e.is_correct) loStats[e.lo_id].correct++;
            }
        });

        // Calculate Level
        const level = Math.floor(totalXp / 500) + 1;
        const xpForNextLevel = 500;
        const currentLevelXp = totalXp % 500;
        const progressPct = Math.min(100, (currentLevelXp / xpForNextLevel) * 100);

        // Calculate Streak (consecutive days looking backwards)
        let currentStreak = 0;
        const today = new Date();
        const tzOffset = today.getTimezoneOffset() * 60000; // local timezone adjusting
        // Check days backwards
        for (let i = 0; i < 365; i++) {
            const checkDate = new Date(today - i * 86400000 - tzOffset);
            const dateStr = checkDate.toISOString().split('T')[0];

            if (daysActive.has(dateStr)) {
                currentStreak++;
            } else if (i === 0) {
                // If they haven't played today, we don't break the streak immediately, 
                // we just check yesterday
                continue;
            } else {
                break; // Streak broken
            }
        }

        // Calculate Grade
        let scorePct = 0;
        if (totalQuestions > 0) {
            scorePct = (correctQuestions / totalQuestions) * 100;
        }
        let grade = 'F';
        let gradeClass = 'grade-f';
        let hoursLeft = '~50 hrs to exam-ready';

        if (totalQuestions === 0) {
            grade = '—';
            gradeClass = 'grade-f';
            hoursLeft = 'Start practicing to unlock';
        } else if (scorePct >= 90) {
            grade = 'A'; gradeClass = 'grade-a'; hoursLeft = 'Exam-Ready!';
        } else if (scorePct >= 80) {
            grade = 'B'; gradeClass = 'grade-b'; hoursLeft = '~5 hrs to exam-ready';
        } else if (scorePct >= 70) {
            grade = 'C'; gradeClass = 'grade-c'; hoursLeft = '~15 hrs to exam-ready';
        } else if (scorePct >= 60) {
            grade = 'D'; gradeClass = 'grade-d'; hoursLeft = '~25 hrs to exam-ready';
        }

        // Render to DOM
        this.updateElement('xpBarFill', el => el.style.width = `${progressPct}%`);
        this.updateElement('xpBarLabel', el => el.innerText = `${totalXp} XP`);
        this.updateElement('lvlBadge', el => el.innerText = `LVL ${level}`);
        this.updateElement('heroXP', el => el.innerText = `${totalXp} XP`);
        this.updateElement('heroStreak', el => el.innerText = currentStreak.toString());

        this.updateElement('heroGrade', el => {
            el.innerText = grade;
            el.className = `hero-stat-value ${gradeClass}`;
        });
        this.updateElement('heroTimeEstimate', el => el.innerText = hoursLeft);

        // Find weakest LO and update ACE's speech bubble
        this.updateTargetedCoaching(loStats);
    },

    async updateTargetedCoaching(loStats) {
        // We only care about LOs that have been attempted at least 3 times
        let weakestLO = null;
        let lowestPct = 101;

        for (const [loId, stats] of Object.entries(loStats)) {
            if (stats.total >= 3) {
                const pct = (stats.correct / stats.total) * 100;
                if (pct < lowestPct) {
                    lowestPct = pct;
                    weakestLO = loId;
                }
            }
        }

        const speechWrapper = document.getElementById('aceSpeech');
        const speechText = document.getElementById('aceSpeechText');

        if (!weakestLO || lowestPct >= 80) {
            if (speechWrapper) {
                speechText.innerHTML = `You're crushing it! Keep up the great work in the <span style="color:var(--gold);">Practice Area</span>.`;
                speechWrapper.style.display = 'flex';
                setTimeout(() => speechWrapper.classList.add('visible'), 500);
            }
            return;
        }

        // Fetch course index to find the learning recommendation
        try {
            const res = await fetch('course_index.json');
            if (!res.ok) throw new Error('Failed to load course_index');
            const courseIndex = await res.json();

            const mapping = courseIndex[weakestLO];
            if (mapping) {
                if (speechWrapper && speechText) {
                    // Update this to point directly to the specific Learner's Journey Node HTML file
                    const directNodeUrl = `training_modules/${mapping.node_id}_training.html`;
                    speechText.innerHTML = `I noticed you're struggling with <strong>${mapping.node_title}</strong> (${lowestPct.toFixed(0)}% pass rate). <br><br>I highly recommend reviewing <a href="${directNodeUrl}" style="color:var(--gold); text-decoration:underline;">this Learner's Journey Node</a> before you take another quiz.`;
                    speechWrapper.style.display = 'flex';
                    setTimeout(() => speechWrapper.classList.add('visible'), 500);
                }
            }

        } catch (e) {
            console.warn('[Gamification] Could not map weakest LO to recommendation.', e);
        }
    },

    updateElement(id, callback) {
        const el = document.getElementById(id);
        if (el) callback(el);
    }
};

// Auto-init on dashboard
if (window.location.pathname.includes('dashboard.html')) {
    document.addEventListener('DOMContentLoaded', () => {
        window.AceGamification.initDashboard();
    });
}
