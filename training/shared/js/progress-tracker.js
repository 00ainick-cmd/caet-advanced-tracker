/**
 * progress-tracker.js
 * ACE Avionics Training — Local + Cloud Progress Tracker
 *
 * Used by: shared/practice.html, shared/final.html
 *
 * Tracks per-question answer history in localStorage for local stats/LO mastery,
 * AND sends events to Supabase (via AceSupabase) for cloud analytics.
 *
 * Exposes: window.ProgressTracker
 *
 * API:
 *   ProgressTracker.recordAnswer(lessonId, format, questionId, isCorrect, loId, category, selectedIndex, correctIndex)
 *   ProgressTracker.save()
 *   ProgressTracker.getStats(lessonId)        → { seen, correct, pct }
 *   ProgressTracker.getLOStats(lessonId)       → { [loId]: { correct, total, pct } }
 *   ProgressTracker.reportSession(summary)     → sends session summary to Supabase
 */

(function () {
  'use strict';

  // ── LocalStorage keys ──────────────────────────────────────────────────────
  const LS_PREFIX  = 'ace_progress_';
  const LS_LO_PRE  = 'ace_lo_';

  // ── In-memory buffer ───────────────────────────────────────────────────────
  let _pendingEvents = [];  // events buffered before async flush

  /**
   * Record a single answer event.
   * Saves to localStorage immediately and queues Supabase event.
   */
  function recordAnswer(lessonId, format, questionId, isCorrect, loId, category, selectedIndex, correctIndex) {
    if (!lessonId || !questionId) return;

    // ── 1. Update localStorage question history ──────────────────────────────
    const lsKey = LS_PREFIX + lessonId;
    let history = {};
    try {
      const raw = localStorage.getItem(lsKey);
      if (raw) history = JSON.parse(raw);
    } catch (e) {}

    if (!history[questionId]) {
      history[questionId] = { correct: 0, total: 0, lastCorrect: null };
    }
    history[questionId].total   += 1;
    history[questionId].correct += isCorrect ? 1 : 0;
    history[questionId].lastCorrect = isCorrect;

    try {
      localStorage.setItem(lsKey, JSON.stringify(history));
    } catch (e) {}

    // ── 2. Update localStorage LO mastery ────────────────────────────────────
    if (loId) {
      const loKey = LS_LO_PRE + lessonId + '_' + btoa(String(loId).slice(0, 60)).slice(0, 24);
      let loData = { correct: 0, total: 0, lastPct: 0 };
      try {
        const raw = localStorage.getItem(loKey);
        if (raw) loData = JSON.parse(raw);
      } catch (e) {}
      loData.total   += 1;
      loData.correct += isCorrect ? 1 : 0;
      loData.lastPct  = Math.round((loData.correct / loData.total) * 100);
      try {
        localStorage.setItem(loKey, JSON.stringify(loData));
      } catch (e) {}
    }

    // ── 3. Queue Supabase event ───────────────────────────────────────────────
    _pendingEvents.push({
      lessonId:      lessonId,
      questionId:    questionId,
      format:        format || 'unknown',
      loId:          loId    || null,
      category:      category || null,
      selectedIndex: typeof selectedIndex === 'number' ? selectedIndex : -1,
      correctIndex:  typeof correctIndex  === 'number' ? correctIndex  : -1,
      isCorrect:     Boolean(isCorrect),
      points:        0
    });
  }

  /**
   * Flush pending events to Supabase.
   * Call after each answer (or in batches).
   */
  async function save() {
    if (!window.AceSupabase || _pendingEvents.length === 0) return;
    const batch = _pendingEvents.splice(0); // take all, clear array
    for (const ev of batch) {
      await window.AceSupabase.trackQuestionEvent(ev);
    }
  }

  /**
   * Get aggregate stats for a lesson from localStorage.
   * @param {string} lessonId
   * @returns {{ seen: number, correct: number, pct: number }}
   */
  function getStats(lessonId) {
    let history = {};
    try {
      const raw = localStorage.getItem(LS_PREFIX + lessonId);
      if (raw) history = JSON.parse(raw);
    } catch (e) {}
    let seen = 0, correct = 0;
    for (const q of Object.values(history)) {
      seen    += q.total   || 0;
      correct += q.correct || 0;
    }
    return {
      seen:    seen,
      correct: correct,
      pct:     seen > 0 ? Math.round((correct / seen) * 100) : 0
    };
  }

  /**
   * Report a completed session summary to Supabase.
   * @param {{ lessonId: string, format: string, questionsSeen: number, questionsCorrect: number, durationSec?: number }} summary
   */
  async function reportSession(summary) {
    if (!window.AceSupabase) return;
    await window.AceSupabase.trackSessionSummary(summary);
  }

  // ── Public API ─────────────────────────────────────────────────────────────
  window.ProgressTracker = {
    recordAnswer:  recordAnswer,
    save:          save,
    getStats:      getStats,
    reportSession: reportSession
  };

})();
