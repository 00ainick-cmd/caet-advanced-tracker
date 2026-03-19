/**
 * assessment-tracker.js
 * ACE Avionics Training — Jeopardy & Final Assessment Cloud Tracker
 *
 * Used by: shared/jeopardy.html (via window.jeopardyTracker)
 *          shared/final.html    (via window.assessmentTracker)
 *
 * Wraps AceSupabase to provide format-specific tracker objects expected by
 * the consumer HTML files.
 *
 * Exposes:
 *   window.jeopardyTracker    — used by jeopardy.html
 *   window.assessmentTracker  — used by final.html
 */

(function () {
  'use strict';

  // ── Derive lesson ID from the page URL ────────────────────────────────────
  // URL format: .../cat-4-flight-instruments/index.html or via ?data= param
  function _getLessonId() {
    // Try data= param first (most reliable)
    const params = new URLSearchParams(window.location.search);
    const dataParam = params.get('data') || '';
    // Extract cat folder name from path like '../cat-4-flight-instruments/data/questions.json'
    const match = dataParam.match(/cat-\d+-[\w-]+/);
    if (match) return match[0];
    // Fallback: parse from window.location.pathname
    const pathMatch = window.location.pathname.match(/cat-\d+-[\w-]+/);
    if (pathMatch) return pathMatch[0];
    return 'unknown-lesson';
  }

  // ── Jeopardy Tracker ──────────────────────────────────────────────────────
  /**
   * window.jeopardyTracker
   *
   * Expected call from jeopardy.html:
   *   window.jeopardyTracker.recordQuestion({
   *     questionId, loId, isCorrect, userAnswer, correctAnswer, points
   *   })
   */
  window.jeopardyTracker = {
    _lessonId: null,

    _ensureLessonId() {
      if (!this._lessonId) this._lessonId = _getLessonId();
      return this._lessonId;
    },

    /**
     * @param {Object} q
     * @param {string}  q.questionId
     * @param {string}  [q.loId]
     * @param {boolean} q.isCorrect
     * @param {number}  q.userAnswer     - selected index (0-3 or -1)
     * @param {number}  q.correctAnswer  - correct index (0-3)
     * @param {number}  [q.points]
     */
    async recordQuestion(q) {
      if (!window.AceSupabase) return;
      await window.AceSupabase.trackQuestionEvent({
        lessonId: this._ensureLessonId(),
        questionId: q.questionId || 'unknown',
        format: 'jeopardy',
        loId: q.loId || null,
        category: q.category || null,
        selectedIndex: typeof q.userAnswer === 'number' ? q.userAnswer : -1,
        correctIndex: typeof q.correctAnswer === 'number' ? q.correctAnswer : -1,
        isCorrect: Boolean(q.isCorrect),
        points: q.points || 0
      });
    },

    /**
     * Call at game end to record session summary.
     * @param {{ questionsAnswered: number, questionsCorrect: number, durationSec?: number }} stats
     */
    async recordGameEnd(stats) {
      if (!window.AceSupabase) return;
      await window.AceSupabase.trackSessionSummary({
        lessonId: this._ensureLessonId(),
        format: 'jeopardy',
        questionsSeen: stats.questionsAnswered || 0,
        questionsCorrect: stats.questionsCorrect || 0,
        durationSec: stats.durationSec || null
      });
    }
  };

  // ── Assessment (Final Test) Tracker ───────────────────────────────────────
  /**
   * window.assessmentTracker
   *
   * Used by final.html to record each answer and the final session summary.
   *
   * Call:
   *   window.assessmentTracker.recordAnswer({ questionId, loId, category, selectedIndex, correctIndex, isCorrect })
   *   window.assessmentTracker.recordComplete({ questionsSeen, questionsCorrect, durationSec })
   */
  window.assessmentTracker = {
    _lessonId: null,

    _ensureLessonId() {
      if (!this._lessonId) this._lessonId = _getLessonId();
      return this._lessonId;
    },

    async recordAnswer(q) {
      if (!window.AceSupabase) return;
      await window.AceSupabase.trackQuestionEvent({
        lessonId: this._ensureLessonId(),
        questionId: q.questionId || 'unknown',
        format: 'final',
        loId: q.loId || null,
        category: q.category || null,
        selectedIndex: typeof q.selectedIndex === 'number' ? q.selectedIndex : -1,
        correctIndex: typeof q.correctIndex === 'number' ? q.correctIndex : -1,
        isCorrect: Boolean(q.isCorrect),
        points: 0
      });
    },

    async recordComplete(stats) {
      if (!window.AceSupabase) return;
      await window.AceSupabase.trackSessionSummary({
        lessonId: this._ensureLessonId(),
        format: 'final',
        questionsSeen: stats.questionsSeen || 0,
        questionsCorrect: stats.questionsCorrect || 0,
        durationSec: stats.durationSec || null
      });
    }
  };

  // ── Flashcard Tracker (lightweight) ──────────────────────────────────────
  /**
   * window.flashcardTracker
   *
   * Flashcards are self-rated (know / don't know). Track the self-rating event.
   *
   * Call:
   *   window.flashcardTracker.recordRating({ questionId, loId, category, knew })
   */
  window.flashcardTracker = {
    _lessonId: null,

    _ensureLessonId() {
      if (!this._lessonId) this._lessonId = _getLessonId();
      return this._lessonId;
    },

    async recordRating(card) {
      if (!window.AceSupabase) return;
      await window.AceSupabase.trackQuestionEvent({
        lessonId: this._ensureLessonId(),
        questionId: card.questionId || 'unknown',
        format: 'flashcard',
        loId: card.loId || null,
        category: card.category || null,
        selectedIndex: -1,             // flashcards have no choice index
        correctIndex: -1,
        isCorrect: Boolean(card.knew),
        points: 0
      });
    },

    async recordSessionEnd(stats) {
      if (!window.AceSupabase) return;
      await window.AceSupabase.trackSessionSummary({
        lessonId: this._ensureLessonId(),
        format: 'flashcard',
        questionsSeen: stats.questionsSeen || 0,
        questionsCorrect: stats.questionsCorrect || 0, // usually 0 for flashcards unless we track 'knew'
        durationSec: stats.durationSec || null
      });
    }
  };

  console.log('[ACE] Assessment trackers initialized (jeopardyTracker, assessmentTracker, flashcardTracker)');

})();
