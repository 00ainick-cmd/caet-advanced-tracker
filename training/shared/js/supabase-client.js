/**
 * supabase-client.js
 * ACE Avionics Training — Supabase Analytics Client
 *
 * Provides a single shared Supabase client instance used by all tracker modules.
 *
 * ─── SETUP ───────────────────────────────────────────────────────────────────
 * 1. Create a project at https://supabase.com
 * 2. Replace SUPABASE_URL and SUPABASE_ANON_KEY below with your project values.
 *    (Found in: Project Settings → API → Project URL / anon public key)
 * 3. Run the SQL schema below in the Supabase SQL editor to create the tables.
 *
 * ─── SUPABASE SQL SCHEMA ─────────────────────────────────────────────────────
 *
 * -- Question response events (one row per answer attempt)
 * CREATE TABLE ace_question_events (
 *   id               BIGSERIAL PRIMARY KEY,
 *   created_at       TIMESTAMPTZ DEFAULT NOW(),
 *   session_id       TEXT NOT NULL,          -- anonymous session UUID
 *   lesson_id        TEXT NOT NULL,          -- e.g. 'cat-4-flight-instruments'
 *   question_id      TEXT NOT NULL,          -- e.g. 'cat4-q001'
 *   format           TEXT NOT NULL,          -- 'drill' | 'jeopardy' | 'final' | 'flashcard'
 *   lo_id            TEXT,                   -- learning objective text (trimmed to 120 chars)
 *   category         TEXT,                   -- question category/topic
 *   selected_index   SMALLINT,               -- 0-3 (A-D), -1 = timeout/skip
 *   correct_index    SMALLINT,               -- 0-3 (A-D)
 *   is_correct       BOOLEAN NOT NULL,
 *   points           INT DEFAULT 0           -- used by jeopardy; 0 for drill/final
 * );
 *
 * -- Indexes for fast analytics queries
 * CREATE INDEX idx_ace_events_lesson   ON ace_question_events (lesson_id);
 * CREATE INDEX idx_ace_events_question ON ace_question_events (question_id);
 * CREATE INDEX idx_ace_events_session  ON ace_question_events (session_id);
 * CREATE INDEX idx_ace_events_date     ON ace_question_events (created_at);
 *
 * -- Session summary (one row per completed activity session)
 * CREATE TABLE ace_session_summaries (
 *   id               BIGSERIAL PRIMARY KEY,
 *   created_at       TIMESTAMPTZ DEFAULT NOW(),
 *   session_id       TEXT NOT NULL,
 *   lesson_id        TEXT NOT NULL,
 *   format           TEXT NOT NULL,          -- 'drill' | 'jeopardy' | 'final'
 *   questions_seen   SMALLINT DEFAULT 0,
 *   questions_correct SMALLINT DEFAULT 0,
 *   score_pct        NUMERIC(5,2),           -- 0.00 - 100.00
 *   duration_sec     INT                     -- seconds spent in session
 * );
 *
 * -- Row Level Security: allow anonymous inserts (read restricted to service role)
 * ALTER TABLE ace_question_events     ENABLE ROW LEVEL SECURITY;
 * ALTER TABLE ace_session_summaries   ENABLE ROW LEVEL SECURITY;
 *
 * CREATE POLICY "anon insert events"
 *   ON ace_question_events FOR INSERT TO anon WITH CHECK (true);
 *
 * CREATE POLICY "anon insert summaries"
 *   ON ace_session_summaries FOR INSERT TO anon WITH CHECK (true);
 *
 * ─────────────────────────────────────────────────────────────────────────────
 */

// ──────────────────────────────────────────────────────────────────────────────
//  CONFIGURATION — Replace these values with your Supabase project credentials
// ──────────────────────────────────────────────────────────────────────────────
const SUPABASE_URL = 'https://gwxgnlasxzpbipcdavcd.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd3eGdubGFzeHpwYmlwY2RhdmNkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE4ODAyNDIsImV4cCI6MjA4NzQ1NjI0Mn0.cjTXz8OLtX4Yt6CX2Sx3n0GXwbrHqS_uH-mK5PivKTk';

// ──────────────────────────────────────────────────────────────────────────────
//  Client initialization
// ──────────────────────────────────────────────────────────────────────────────

/**
 * Returns true if Supabase is properly configured (URL and key have been set).
 */
function _supabaseConfigured() {
  return (
    typeof SUPABASE_URL === 'string' &&
    SUPABASE_URL.startsWith('https://') &&
    !SUPABASE_URL.includes('YOUR_PROJECT_ID') &&
    typeof SUPABASE_ANON_KEY === 'string' &&
    !SUPABASE_ANON_KEY.includes('YOUR_ANON')
  );
}

/**
 * Lazily-created Supabase client. Returns null if not configured.
 * @type {import('@supabase/supabase-js').SupabaseClient | null}
 */
let _supabaseClient = null;

function getSupabaseClient() {
  if (_supabaseClient) return _supabaseClient;
  if (!_supabaseConfigured()) {
    console.warn('[ACE] Supabase not configured — analytics disabled. Set SUPABASE_URL and SUPABASE_ANON_KEY in supabase-client.js');
    return null;
  }
  if (typeof window.supabase === 'undefined' || typeof window.supabase.createClient !== 'function') {
    console.warn('[ACE] Supabase JS library not loaded — ensure CDN script is included before supabase-client.js');
    return null;
  }
  _supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  console.log('[ACE] Supabase client initialized');
  return _supabaseClient;
}

// ──────────────────────────────────────────────────────────────────────────────
//  Session identity — anonymous, stable per browser session
// ──────────────────────────────────────────────────────────────────────────────

const SESSION_KEY = 'ace_session_id';

function getSessionId() {
  // 1. Prioritize authenticated user ID so stats track across devices/sessions
  try {
    const rawAuth = localStorage.getItem('ace_enrollment');
    if (rawAuth) {
      const auth = JSON.parse(rawAuth);
      if (auth && auth.id) return String(auth.id);
    }
  } catch (e) { }

  // 2. Fallback to anonymous local session
  let sid = localStorage.getItem(SESSION_KEY);
  if (!sid) {
    sid = 'sess_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 9);
    localStorage.setItem(SESSION_KEY, sid);
  }
  return sid;
}

// ──────────────────────────────────────────────────────────────────────────────
//  Core tracking functions
// ──────────────────────────────────────────────────────────────────────────────

/**
 * Record a single question answer event.
 *
 * @param {Object} event
 * @param {string} event.lessonId       - e.g. 'cat-4-flight-instruments'
 * @param {string} event.questionId     - e.g. 'cat4-q001'
 * @param {string} event.format         - 'drill' | 'jeopardy' | 'final' | 'flashcard'
 * @param {string} [event.loId]         - Learning objective text
 * @param {string} [event.category]     - Question category/topic
 * @param {number} event.selectedIndex  - 0-3 (A-D), or -1 for timeout/skip
 * @param {number} event.correctIndex   - 0-3 (A-D)
 * @param {boolean} event.isCorrect
 * @param {number} [event.points]       - Points (jeopardy); 0 for other formats
 */
async function trackQuestionEvent(event) {
  const client = getSupabaseClient();
  if (!client) return;

  const payload = {
    session_id: getSessionId(),
    lesson_id: event.lessonId || 'unknown',
    question_id: event.questionId || 'unknown',
    format: event.format || 'unknown',
    lo_id: event.loId ? String(event.loId).slice(0, 120) : null,
    category: event.category || null,
    selected_index: typeof event.selectedIndex === 'number' ? event.selectedIndex : -1,
    correct_index: typeof event.correctIndex === 'number' ? event.correctIndex : -1,
    is_correct: Boolean(event.isCorrect),
    points: event.points || 0
  };

  const { error } = await client.from('ace_question_events').insert(payload);
  if (error) {
    console.warn('[ACE] Failed to record question event:', error.message);
  }
}

/**
 * Record a session summary when an activity completes.
 *
 * @param {Object} summary
 * @param {string} summary.lessonId
 * @param {string} summary.format         - 'drill' | 'jeopardy' | 'final'
 * @param {number} summary.questionsSeen
 * @param {number} summary.questionsCorrect
 * @param {number} [summary.durationSec]  - Optional elapsed seconds
 */
async function trackSessionSummary(summary) {
  const client = getSupabaseClient();
  if (!client) return;

  const seen = summary.questionsSeen || 0;
  const correct = summary.questionsCorrect || 0;
  const pct = seen > 0 ? parseFloat(((correct / seen) * 100).toFixed(2)) : 0;

  const payload = {
    session_id: getSessionId(),
    lesson_id: summary.lessonId || 'unknown',
    format: summary.format || 'unknown',
    questions_seen: seen,
    questions_correct: correct,
    score_pct: pct,
    duration_sec: summary.durationSec || null
  };

  const { error } = await client.from('ace_session_summaries').insert(payload);
  if (error) {
    console.warn('[ACE] Failed to record session summary:', error.message);
  }
}

// Expose globally
window.AceSupabase = {
  getClient: getSupabaseClient,
  getSessionId: getSessionId,
  trackQuestionEvent: trackQuestionEvent,
  trackSessionSummary: trackSessionSummary
};
