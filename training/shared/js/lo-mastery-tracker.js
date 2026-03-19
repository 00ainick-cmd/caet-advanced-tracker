/**
 * lo-mastery-tracker.js
 * ACE Avionics Training — Learning Objective Mastery Tracker
 *
 * Tracks per-LO mastery across all activity types (flashcards, drill, jeopardy, final).
 * Stores in localStorage and optionally syncs to Supabase.
 *
 * Mastery levels (based on cumulative correct %):
 *   'not_started' — no attempts
 *   'learning'    — < 60% correct
 *   'proficient'  — 60-84% correct
 *   'mastered'    — ≥ 85% correct
 *
 * Exposes: window.LOMasteryTracker
 *
 * API:
 *   LOMasteryTracker.record(lessonId, loId, isCorrect, format)
 *   LOMasteryTracker.getAll(lessonId)          → { [loId]: { correct, total, pct, level } }
 *   LOMasteryTracker.get(lessonId, loId)        → { correct, total, pct, level }
 *   LOMasteryTracker.getSummary(lessonId)       → { total, mastered, proficient, learning, notStarted, overallPct }
 *   LOMasteryTracker.getWeakest(lessonId, n)    → [ { loId, correct, total, pct, level } ] (sorted worst-first)
 */

(function () {
  'use strict';

  // ── LocalStorage key ──────────────────────────────────────────────────────
  const LS_PREFIX = 'ace_lo_mastery_';

  // ── Mastery thresholds ────────────────────────────────────────────────────
  function getLevel(pct) {
    if (pct >= 85) return 'mastered';
    if (pct >= 60) return 'proficient';
    return 'learning';
  }

  // ── Storage helpers ───────────────────────────────────────────────────────
  function _load(lessonId) {
    try {
      const raw = localStorage.getItem(LS_PREFIX + lessonId);
      return raw ? JSON.parse(raw) : {};
    } catch (e) { return {}; }
  }

  function _save(lessonId, data) {
    try {
      localStorage.setItem(LS_PREFIX + lessonId, JSON.stringify(data));
    } catch (e) { console.warn('[LO Mastery] Could not save:', e); }
  }

  // ── Core API ──────────────────────────────────────────────────────────────

  /**
   * Record a single LO attempt.
   * @param {string}  lessonId  - e.g. 'cat-1-maintenance-regs'
   * @param {string}  loId      - learning objective text or ID
   * @param {boolean} isCorrect - whether the attempt was correct
   * @param {string}  [format]  - 'drill'|'flashcard'|'jeopardy'|'final' (for breakdown)
   */
  function record(lessonId, loId, isCorrect, format) {
    if (!lessonId || !loId) return;

    const data = _load(lessonId);
    const key = String(loId).trim();

    if (!data[key]) {
      data[key] = { correct: 0, total: 0, pct: 0, level: 'learning', formats: {} };
    }

    const entry = data[key];
    entry.total += 1;
    entry.correct += isCorrect ? 1 : 0;
    entry.pct = Math.round((entry.correct / entry.total) * 100);
    entry.level = getLevel(entry.pct);
    entry.lastAttempt = Date.now();

    // Track per-format breakdown
    if (format) {
      if (!entry.formats[format]) entry.formats[format] = { correct: 0, total: 0 };
      entry.formats[format].total += 1;
      entry.formats[format].correct += isCorrect ? 1 : 0;
    }

    _save(lessonId, data);
  }

  /**
   * Get all LO mastery data for a lesson.
   * @param {string} lessonId
   * @returns {Object} { [loId]: { correct, total, pct, level, formats } }
   */
  function getAll(lessonId) {
    return _load(lessonId);
  }

  /**
   * Get mastery data for a specific LO.
   * @param {string} lessonId
   * @param {string} loId
   * @returns {{ correct: number, total: number, pct: number, level: string }}
   */
  function get(lessonId, loId) {
    const data = _load(lessonId);
    return data[String(loId).trim()] || { correct: 0, total: 0, pct: 0, level: 'not_started' };
  }

  /**
   * Get summary stats for all LOs in a lesson.
   * @param {string} lessonId
   * @returns {{ total, mastered, proficient, learning, notStarted, overallPct }}
   */
  function getSummary(lessonId) {
    const data = _load(lessonId);
    const entries = Object.values(data);
    const totalLOs = entries.length;
    let mastered = 0, proficient = 0, learning = 0;
    let totalCorrect = 0, totalAttempts = 0;

    entries.forEach(e => {
      if (e.level === 'mastered') mastered++;
      else if (e.level === 'proficient') proficient++;
      else learning++;
      totalCorrect += e.correct;
      totalAttempts += e.total;
    });

    return {
      total: totalLOs,
      mastered,
      proficient,
      learning,
      notStarted: 0, // can't know total LOs without question bank
      overallPct: totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 0
    };
  }

  /**
   * Get the weakest LOs (lowest mastery) for targeted review.
   * @param {string} lessonId
   * @param {number} [n=5] - number of LOs to return
   * @returns {Array<{ loId, correct, total, pct, level }>}
   */
  function getWeakest(lessonId, n) {
    n = n || 5;
    const data = _load(lessonId);
    return Object.entries(data)
      .map(([loId, entry]) => ({ loId, ...entry }))
      .filter(e => e.total > 0)
      .sort((a, b) => a.pct - b.pct)
      .slice(0, n);
  }

  /**
   * Clear all LO mastery data for a lesson (for reset/testing).
   * @param {string} lessonId
   */
  function clear(lessonId) {
    try { localStorage.removeItem(LS_PREFIX + lessonId); } catch (e) {}
  }

  // ── Public API ─────────────────────────────────────────────────────────────
  window.LOMasteryTracker = {
    record:     record,
    getAll:     getAll,
    get:        get,
    getSummary: getSummary,
    getWeakest: getWeakest,
    clear:      clear
  };

  console.log('[ACE] LO Mastery Tracker initialized');

})();
