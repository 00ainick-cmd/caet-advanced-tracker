// shared/js/ace-sync.js
// ACE Avionics — Progress Sync (Supabase ↔ localStorage cache)
// Replaces all localStorage progress reads/writes with Supabase operations.

window.AceSync = (function () {
  const db = () => AceAuth.getDB()
  const eid = () => AceAuth.getEnrollmentId()

  // ── CACHE helpers ──────────────────────────────────────────────────────
  function cacheGet(key, def = null) {
    try { const v = localStorage.getItem(key); return v !== null ? JSON.parse(v) : def } catch { return def }
  }
  function cacheSet(key, val) {
    try { localStorage.setItem(key, JSON.stringify(val)) } catch {}
  }

  // ══════════════════════════════════════════════════════════════════════
  // CATEGORY PROGRESS
  // ══════════════════════════════════════════════════════════════════════

  async function getCatProgress(catId) {
    const cacheKey = `ace_cat_${catId}_progress_cloud`
    const cached = cacheGet(cacheKey)
    if (cached) return cached

    const enrollId = await eid()
    if (!enrollId) return null

    const { data } = await db()
      .from('ace_progress')
      .select('*')
      .eq('enrollment_id', enrollId)
      .eq('cat_id', catId)
      .single()

    if (data) cacheSet(cacheKey, data)
    return data || null
  }

  async function upsertCatProgress(catId, updates) {
    const enrollId = await eid()
    if (!enrollId) return

    const payload = { enrollment_id: enrollId, cat_id: catId, updated_at: new Date().toISOString(), ...updates }

    await db().from('ace_progress').upsert(payload, { onConflict: 'enrollment_id,cat_id' })

    // Invalidate cache
    localStorage.removeItem(`ace_cat_${catId}_progress_cloud`)

    // Mirror to legacy localStorage keys so existing display code still works
    if (updates.mastery_pct !== undefined)    cacheSet(`ace_cat_${catId}_mastery`,               updates.mastery_pct)
    if (updates.time_minutes !== undefined)   cacheSet(`ace_cat_${catId}_time_minutes`,           updates.time_minutes)
    if (updates.practice_score !== undefined) cacheSet(`ace_cat_${catId}_practice-test_score`,    updates.practice_score)
    if (updates.final_score !== undefined)    cacheSet(`ace_cat_${catId}_final_score`,            updates.final_score)
    if (updates.final_passed !== undefined)   cacheSet(`ace_cat_${catId}_final_passed`,           updates.final_passed)
  }

  // ══════════════════════════════════════════════════════════════════════
  // COMPLETIONS
  // ══════════════════════════════════════════════════════════════════════

  async function markComplete(catId, itemKey) {
    const enrollId = await eid()
    if (!enrollId) return

    await db().from('ace_completions').upsert(
      { enrollment_id: enrollId, cat_id: catId, item_key: itemKey, completed_at: new Date().toISOString() },
      { onConflict: 'enrollment_id,cat_id,item_key' }
    )

    // Mirror to legacy localStorage key
    cacheSet(`ace_cat_${catId}_${itemKey}_complete`, 'true')
  }

  async function getCompletions(catId) {
    const enrollId = await eid()
    if (!enrollId) return []

    const { data } = await db()
      .from('ace_completions')
      .select('item_key, completed_at')
      .eq('enrollment_id', enrollId)
      .eq('cat_id', catId)

    return data || []
  }

  async function isComplete(catId, itemKey) {
    // Fast path: check localStorage cache first
    const legacyKey = `ace_cat_${catId}_${itemKey}_complete`
    if (localStorage.getItem(legacyKey) === '"true"') return true

    const completions = await getCompletions(catId)
    const found = completions.some(c => c.item_key === itemKey)
    if (found) cacheSet(legacyKey, 'true')
    return found
  }

  // ══════════════════════════════════════════════════════════════════════
  // LO MASTERY (per-question history)
  // ══════════════════════════════════════════════════════════════════════

  async function recordAnswer(lessonId, questionId, isCorrect) {
    const enrollId = await eid()
    if (!enrollId) return

    // Read current counts first (upsert with increment)
    const { data: existing } = await db()
      .from('ace_lo_mastery')
      .select('correct_count, total_count')
      .eq('enrollment_id', enrollId)
      .eq('lesson_id', lessonId)
      .eq('question_id', questionId)
      .single()

    const correct = (existing?.correct_count || 0) + (isCorrect ? 1 : 0)
    const total   = (existing?.total_count   || 0) + 1

    await db().from('ace_lo_mastery').upsert({
      enrollment_id: enrollId,
      lesson_id:     lessonId,
      question_id:   questionId,
      correct_count: correct,
      total_count:   total,
      last_correct:  isCorrect,
      updated_at:    new Date().toISOString()
    }, { onConflict: 'enrollment_id,lesson_id,question_id' })
  }

  async function getLOMastery(lessonId) {
    const enrollId = await eid()
    if (!enrollId) return {}

    const { data } = await db()
      .from('ace_lo_mastery')
      .select('question_id, correct_count, total_count, last_correct')
      .eq('enrollment_id', enrollId)
      .eq('lesson_id', lessonId)

    if (!data) return {}
    return Object.fromEntries(data.map(r => [r.question_id, r]))
  }

  // ══════════════════════════════════════════════════════════════════════
  // PREFERENCES (theme, dashboard mode)
  // ══════════════════════════════════════════════════════════════════════

  async function savePreferences(prefs) {
    const enrollId = await eid()
    if (!enrollId) return

    const updates = {}
    if (prefs.theme)          updates.theme          = prefs.theme
    if (prefs.dashboardMode)  updates.dashboard_mode = prefs.dashboardMode

    await db().from('ace_enrollments').update(updates).eq('id', enrollId)

    // Mirror to localStorage for fast reads
    if (prefs.theme)         cacheSet('ace_theme',          prefs.theme)
    if (prefs.dashboardMode) cacheSet('ace_dashboard_mode', prefs.dashboardMode)
  }

  // ══════════════════════════════════════════════════════════════════════
  // BOOT: pull cloud progress into localStorage on first page load
  // ══════════════════════════════════════════════════════════════════════

  async function syncDown(catId) {
    const data = await getCatProgress(catId)
    if (!data) return

    // Write cloud data into localStorage so existing display code sees it
    if (data.mastery_pct    != null) cacheSet(`ace_cat_${catId}_mastery`,               data.mastery_pct)
    if (data.time_minutes   != null) cacheSet(`ace_cat_${catId}_time_minutes`,           data.time_minutes)
    if (data.practice_score != null) cacheSet(`ace_cat_${catId}_practice-test_score`,    data.practice_score)
    if (data.final_score    != null) cacheSet(`ace_cat_${catId}_final_score`,            data.final_score)
    if (data.final_passed   != null) cacheSet(`ace_cat_${catId}_final_passed`,           data.final_passed)

    const completions = await getCompletions(catId)
    completions.forEach(c => cacheSet(`ace_cat_${catId}_${c.item_key}_complete`, 'true'))
  }

  async function syncAllDown() {
    for (const n of [1, 2, 3, 4, 5, 6, 7, 8]) {
      await syncDown(`cat-${n}`)
    }

    // Pull preferences
    const enrollId = await eid()
    if (!enrollId) return
    const { data } = await db()
      .from('ace_enrollments')
      .select('theme, dashboard_mode, student_name')
      .eq('id', enrollId)
      .single()

    if (data?.theme)          cacheSet('ace_theme',          data.theme)
    if (data?.dashboard_mode) cacheSet('ace_dashboard_mode', data.dashboard_mode)
  }

  return {
    getCatProgress,
    upsertCatProgress,
    markComplete,
    getCompletions,
    isComplete,
    recordAnswer,
    getLOMastery,
    savePreferences,
    syncDown,
    syncAllDown,
  }
})()
