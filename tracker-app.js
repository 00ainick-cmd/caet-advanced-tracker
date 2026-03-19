/* ============================================================
   CAET Part 145 LMS — App Logic (Part 1: Core + Apprentice)
   SPA router, state, helpers, apprentice dashboard
   ============================================================ */

// ---- State & Assets ----
let STATE = null, currentUser = null, currentView = 'login', currentTab = '', currentProgram = 'advanced';
const STORAGE_KEY = 'caet_lms_v2';

const AEA_LOGO_SVG = `<img src="aea-logo-white.png" alt="AEA" style="width:100%;height:100%;object-fit:contain">`;

function loadState() { const r = localStorage.getItem(STORAGE_KEY); if (r) { try { STATE = JSON.parse(r); return } catch (e) { } } STATE = null }
function saveState() { localStorage.setItem(STORAGE_KEY, JSON.stringify(STATE)) }
function resetAll() { if (!confirm('This will erase ALL data for this shop (all people, sign-offs, training, portfolio). This cannot be undone. Are you sure?')) return; STATE = createFreshState(); saveState(); currentUser = null; navigate('login'); toast('All data cleared', 'info') }
function loadDemoData() { STATE = createDemoState(); saveState(); currentUser = null; navigate('login'); toast('Demo data loaded — sign in as any user to explore', 'success') }

// ---- Helpers ----
function getApprentices() { return STATE.people.filter(p => p.role === 'apprentice') }
function getSupervisors() { return STATE.people.filter(p => p.role === 'supervisor') }
function taskStats(pid) {
  const td = STATE.taskData[pid] || {}; let signed = 0, requested = 0, needsWork = 0, notStarted = 0;
  PQS.forEach(s => s.tasks.forEach(t => {
    const st = (td[t.id] || {}).status || 'not_started';
    if (st === 'signed_off') signed++; else if (st === 'requested') requested++; else if (st === 'needs_work') needsWork++; else notStarted++
  }));
  return { signed, requested, needsWork, notStarted, total: TOTAL_TASKS, pct: Math.round(signed / TOTAL_TASKS * 100) }
}
function secStats(pid, secNum) {
  const td = STATE.taskData[pid] || {}; const sec = PQS.find(s => s.num === secNum); if (!sec) return { done: 0, total: 0 };
  let done = 0; sec.tasks.forEach(t => { if ((td[t.id] || {}).status === 'signed_off') done++ });
  return { done, total: sec.tasks.length, pct: Math.round(done / sec.tasks.length * 100) }
}
function statusBadge(s) {
  const m = { signed_off: '<span class="badge badge-signed">✓ Signed Off</span>', requested: '<span class="badge badge-requested">⏳ Requested</span>', needs_work: '<span class="badge badge-needswork">⚠ Needs Rework</span>', not_started: '<span class="badge badge-notstarted">Not Started</span>' };
  return m[s] || m.not_started
}
function addNotif(pid, msg, type = 'info') {
  if (!STATE.notifications[pid]) STATE.notifications[pid] = [];
  STATE.notifications[pid].unshift({ id: 'n' + Date.now() + Math.random(), msg, time: new Date().toISOString().slice(0, 10), read: false, type }); saveState()
}
function unreadCount(pid) { return (STATE.notifications[pid] || []).filter(n => !n.read).length }
function toast(msg, type = 'success') {
  const c = document.getElementById('toast-container'), t = document.createElement('div');
  t.className = 'toast toast-' + type; t.textContent = msg; c.appendChild(t);
  requestAnimationFrame(() => t.classList.add('show'));
  setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 300) }, 3000)
}
function progressRingSVG(pct, size = 130, customDone, customTotal) {
  const r = size / 2 - 9, circ = 2 * Math.PI * r, offset = circ - (pct / 100) * circ;
  const doneLabel = customDone !== undefined ? customDone : Math.round(pct * TOTAL_TASKS / 100);
  const totalLabel = customTotal !== undefined ? customTotal : TOTAL_TASKS;
  return `<div class="progress-ring" style="width:${size}px;height:${size}px"><svg width="${size}" height="${size}"><circle class="bg-ring" cx="${size / 2}" cy="${size / 2}" r="${r}"/><circle class="fg-ring" cx="${size / 2}" cy="${size / 2}" r="${r}" style="stroke-dasharray:${circ};stroke-dashoffset:${offset}"/></svg><div class="pct">${pct}%<small>${doneLabel} / ${totalLabel}</small></div></div>`
}

// ---- Router ----
function navigate(view) { currentView = view; window.location.hash = view; window.scrollTo(0, 0); render() }
function handleHash() { const h = window.location.hash.replace('#', '') || 'login'; if (h !== 'login' && h !== 'setup' && !currentUser) { navigate('login'); return } currentView = h; render() }

// ---- Main Render ----
function render() {
  const app = document.getElementById('app');
  switch (currentView) {
    case 'login': app.innerHTML = renderLogin(); break;
    case 'setup': app.innerHTML = renderSetupWizard(); break;
    case 'apprentice': app.innerHTML = renderHeader() + renderMainTabs('apprentice') + renderApprenticeDash() + renderFooter(); break;
    case 'supervisor': app.innerHTML = renderHeader() + renderMainTabs('supervisor') + renderSupervisorDash() + renderFooter(); break;
    case 'committee': app.innerHTML = renderHeader() + renderMainTabs('committee') + renderCommitteeDash() + renderFooter(); break;
    case 'admin': app.innerHTML = renderHeader() + renderMainTabs('admin') + renderAdminDash() + renderFooter(); break;
    default: navigate('login')
  }
}

// ---- Header ----
function renderHeader() {
  const u = currentUser, rl = { apprentice: 'Apprentice', supervisor: 'Evaluator', committee: 'Committee', admin: 'Admin' }[u.role] || '', uc = unreadCount(u.id);
  let supInfo = '';
  if (u.role === 'apprentice') {
    const sup = STATE.people.find(p => p.id === u.supervisorId);
    supInfo = sup ? ` · Evaluator: ${sup.name}` : ' · <span style="color:var(--orange)">⚠ No evaluator assigned</span>';
  }
  return `<header class="header"><div class="header-inner">
    <div class="header-brand" onclick="navigate('${u.role}')"><div class="header-logo-wrap">${AEA_LOGO_SVG}</div>
    <div class="header-text"><div class="h-title">CAET Advanced Tracker</div><div class="h-sub">${STATE.shopName} — ${rl}${supInfo}</div></div></div>
    <div class="header-actions">
      <div style="position:relative"><button class="notif-btn" onclick="toggleNotifPanel()" title="Notifications">🔔${uc ? '<span class="notif-badge">' + uc + '</span>' : ''}</button>
      <div class="notif-panel" id="notifPanel">${renderNotifPanel()}</div></div>
      <span class="header-user">${u.name}</span>
      <button class="btn-back" onclick="currentUser=null;navigate('login')">Sign Out</button>
    </div></div></header>`
}
function renderNotifPanel() {
  const notifs = STATE.notifications[currentUser.id] || [];
  if (!notifs.length) return '<div class="notif-empty">No notifications yet</div>';
  return `<div class="notif-panel-header"><h4>Notifications</h4><button class="btn btn-sm btn-outline" onclick="markAllRead()">Mark All Read</button></div>` +
    notifs.slice(0, 15).map(n => {
      const actionBtn = n.action ? `<button class="btn btn-sm btn-gold" style="margin-top:0.4rem" onclick="event.stopPropagation();handleNotificationAction('${n.id}')">Review →</button>` : '';
      return `<div class="notif-item ${n.read ? '' : 'unread'}" onclick="markRead('${n.id}')"><div class="notif-msg">${n.msg}</div>${actionBtn}<div class="notif-time">${n.time}</div></div>`;
    }).join('')
}
function toggleNotifPanel() { document.getElementById('notifPanel').classList.toggle('open') }
function markAllRead() { (STATE.notifications[currentUser.id] || []).forEach(n => n.read = true); saveState(); render() }
function markRead(nid) { const n = (STATE.notifications[currentUser.id] || []).find(x => x.id === nid); if (n) n.read = true; saveState(); render() }

// ---- Main Tabs ----
function renderMainTabs(role) {
  const tabs = {
    apprentice: [{ k: 'signoffs', l: '📋 Sign-offs', b: 0 }, { k: 'training', l: '📚 Training', b: 0 }, { k: 'portfolio', l: '📁 Portfolio', b: 0 }],
    supervisor: [{ k: 'apprentices', l: '👥 Apprentices', b: 0 }, { k: 'pending', l: '⏳ Pending', b: pendingCount() }, { k: 'sup_training', l: '📚 My Training', b: 0 }],
    committee: [{ k: 'queue', l: '📋 Board Queue', b: boardQueueCount() }, { k: 'scoring', l: '⚖️ Oral Board', b: 0 }, { k: 'practical', l: '🔧 Practical Eval', b: 0 }, { k: 'history', l: '📊 History', b: 0 }],
    admin: [{ k: 'overview', l: '📊 Overview', b: 0 }, { k: 'people', l: '👥 People', b: 0 }, { k: 'admin_training', l: '📚 Training', b: 0 }]
  };
  if (!currentTab || !tabs[role].find(t => t.k === currentTab)) currentTab = tabs[role][0].k;
  return `<div class="main-tabs">${tabs[role].map(t => `<button class="main-tab ${currentTab === t.k ? 'active' : ''}" onclick="currentTab='${t.k}';render()">${t.l}${t.b ? '<span class="tab-badge">' + t.b + '</span>' : ''}</button>`).join('')}</div>`
}
function pendingCount() {
  let c = 0; getApprentices().forEach(a => { const td = STATE.taskData[a.id] || {}; PQS.forEach(s => s.tasks.forEach(t => { if ((td[t.id] || {}).status === 'requested') c++ })) }); return c
}

function renderFooter() { return `<footer class="footer"><div class="f-brand">Aircraft Electronics Association</div><p>CAET Advanced Tracker — Data saved locally in your browser</p></footer>` }

// ---- LOGIN ----
function renderLogin() {
  // First-run: no state yet → show setup wizard
  if (!STATE || !STATE.people || STATE.people.length === 0) {
    navigate('setup'); return ''
  }
  const opts = STATE.people.map(p => {
    const rl = { apprentice: 'Apprentice', supervisor: 'Evaluator', committee: 'Committee', admin: 'Admin' }[p.role] || p.role;
    return `<option value="${p.id}">${p.name} (${rl})</option>`
  }).join('');
  return `<div class="app-bg"></div><div class="login-wrap"><div class="login-box">
    <div class="login-logo-wrap">${AEA_LOGO_SVG}</div>
    <h1>CAET <span class="gold">Advanced</span> Tracker</h1>
    <p class="login-sub">${STATE.shopName} — PQS Tracking & Certification</p>
    <div class="login-field"><label>Sign In As</label><select class="login-input" id="personSelect">${opts}</select></div>
    <button class="btn-enter" onclick="doLogin()">Sign In →</button>
    <p class="demo-note">All data saved locally in your browser</p>
    <div style="margin-top:1rem;text-align:center"><button class="btn btn-sm btn-outline" onclick="navigate('setup')">⚙ Shop Setup</button></div>
  </div></div>`
}
function doLogin() {
  const pid = document.getElementById('personSelect').value;
  currentUser = STATE.people.find(p => p.id === pid); if (!currentUser) return;
  currentTab = ''; navigate(currentUser.role)
}

// ---- SETUP WIZARD ----
function renderSetupWizard() {
  const hasState = STATE && STATE.people && STATE.people.length > 0;
  const sups = hasState ? STATE.people.filter(p => p.role === 'supervisor') : [];
  const supOpts = sups.length ? sups.map(s => `<option value="${s.id}">${s.name}</option>`).join('') : '';
  return `<div class="app-bg"></div><div class="login-wrap"><div class="login-box" style="max-width:480px">
    <div class="login-logo-wrap">${AEA_LOGO_SVG}</div>
    <h1>CAET <span class="gold">Advanced</span> Tracker</h1>
    <p class="login-sub">${hasState ? 'Add a new team member' : 'Set up your shop to get started'}</p>
    ${!hasState ? `<div class="login-field"><label>Shop Name</label><input class="login-input" type="text" id="setupShop" placeholder="e.g. Thompson Avionics"></div>` : ''}
    <div class="login-field"><label>Person Name</label><input class="login-input" type="text" id="setupName" placeholder="e.g. John Smith"></div>
    <div class="login-field"><label>Role</label><select class="login-input" id="setupRole">
      <option value="apprentice">Apprentice / Technician</option>
      <option value="supervisor">Evaluator / Supervisor</option>
      <option value="committee">Committee Member</option>
      <option value="admin">Admin / Manager</option>
    </select></div>
    ${supOpts ? `<div class="login-field" id="setupSupField"><label>Assigned Evaluator</label><select class="login-input" id="setupSupervisor"><option value="">— None —</option>${supOpts}</select></div>` : ''}
    <button class="btn-enter" onclick="finishSetup()">${hasState ? 'Add Person →' : 'Create Shop →'}</button>
    ${hasState ? `<div style="margin-top:1rem;text-align:center"><button class="btn btn-sm btn-outline" onclick="navigate('login')">← Back to Sign In</button></div>` : `<div style="margin-top:1.2rem;text-align:center;border-top:1px solid var(--border);padding-top:1rem"><button class="btn btn-sm btn-outline" onclick="loadDemoData()">Load Demo Data Instead</button></div>`}
  </div></div>`
}
function finishSetup() {
  const name = document.getElementById('setupName')?.value?.trim();
  const role = document.getElementById('setupRole')?.value;
  if (!name) { toast('Please enter a name', 'warning'); return }
  const shopEl = document.getElementById('setupShop');
  if (shopEl) {
    const shopName = shopEl.value.trim();
    if (!shopName) { toast('Please enter a shop name', 'warning'); return }
    STATE = createFreshState(shopName);
  }
  const supEl = document.getElementById('setupSupervisor');
  const supId = supEl ? supEl.value : null;
  const person = addPersonToState(name, role, supId);
  toast(`${name} added as ${role}`, 'success');
  // Auto-login as the new person
  currentUser = person;
  currentTab = '';
  navigate(currentUser.role);
}

// ============================================================
// APPRENTICE DASHBOARD
// ============================================================
function renderApprenticeDash() {
  const u = currentUser;
  if (currentTab === 'signoffs') return renderAppSignoffs(u);
  if (currentTab === 'training') return renderAppTraining(u);
  if (currentTab === 'portfolio') return renderAppPortfolio(u);
  return ''
}

// ---- APP SIGN-OFFS TAB ----
let appFilter = 'all';
function getActiveSections() {
  const customSections = (STATE.customSections || []).filter(s => s.program === currentProgram);
  const base = currentProgram === 'advanced' ? PQS : OJT;
  const merged = base.map(sec => {
    const extra = (STATE.customTasks || {})[sec.num] || [];
    return extra.length ? { ...sec, tasks: [...sec.tasks, ...extra] } : sec;
  });
  return [...merged, ...customSections];
}
function getAllTasksForProgram(program) {
  const customSections = (STATE.customSections || []).filter(s => s.program === program);
  const base = program === 'advanced' ? PQS : OJT;
  let total = base.reduce((s, sec) => s + sec.tasks.length + ((STATE.customTasks || {})[sec.num] || []).length, 0);
  total += customSections.reduce((s, sec) => s + sec.tasks.length, 0);
  return total;
}
function taskStatsForProgram(uid, program) {
  const td = STATE.taskData[uid] || {};
  const customSections = (STATE.customSections || []).filter(s => s.program === program);
  const base = program === 'advanced' ? PQS : OJT;
  const allSections = [...base, ...customSections];
  let signed = 0, requested = 0, needsWork = 0, notStarted = 0;
  allSections.forEach(sec => sec.tasks.forEach(t => {
    const st = (td[t.id] || {}).status || 'not_started';
    if (st === 'signed_off') signed++; else if (st === 'requested') requested++; else if (st === 'needs_work') needsWork++; else notStarted++;
  }));
  const total = signed + requested + needsWork + notStarted;
  return { signed, requested, needsWork, notStarted, total, pct: total ? Math.round(signed / total * 100) : 0 }
}
function renderAppSignoffs(u) {
  const stats = taskStatsForProgram(u.id, currentProgram);
  const totalTasks = getAllTasksForProgram(currentProgram);
  const circ = 2 * Math.PI * 56, offset = circ - (stats.pct / 100) * circ;
  // Program toggle
  const advStats = taskStatsForProgram(u.id, 'advanced');
  const ojtStats = taskStatsForProgram(u.id, 'ojt');
  const programToggle = `<div class="program-toggle" style="display:flex;gap:0.5rem;margin-bottom:1rem;padding:0.25rem;background:var(--card-bg);border-radius:8px;border:1px solid var(--border)">
    <button class="btn btn-sm ${currentProgram === 'advanced' ? 'btn-gold' : 'btn-outline'}" onclick="currentProgram='advanced';appFilter='all';render()" style="flex:1">CAET Advanced (${advStats.pct}%)</button>
    <button class="btn btn-sm ${currentProgram === 'ojt' ? 'btn-gold' : 'btn-outline'}" onclick="currentProgram='ojt';appFilter='all';render()" style="flex:1">Apprenticeship OJT (${ojtStats.pct}%)</button>
  </div>`;
  // Filters
  const filters = [{ k: 'all', l: 'All (' + totalTasks + ')' }, { k: 'not_started', l: 'Upcoming' }, { k: 'requested', l: 'Requested (' + stats.requested + ')' }, { k: 'needs_work', l: 'Needs Rework (' + stats.needsWork + ')' }, { k: 'signed_off', l: 'Completed (' + stats.signed + ')' }];
  let filterHTML = filters.map(f => `<button class="filter-btn ${appFilter === f.k ? 'active' : ''}" onclick="appFilter='${f.k}';render()">${f.l}</button>`).join('');

  let sectionsHTML = '';
  const activeSections = getActiveSections();
  activeSections.forEach(sec => {
    const ss = secStats(u.id, sec.num); const isComplete = ss.done === ss.total;
    const td = STATE.taskData[u.id] || {};
    const rtiHours = getRtiHours(u.id, sec.num);
    // Filter tasks
    const filteredTasks = sec.tasks.filter(t => {
      const st = (td[t.id] || {}).status || 'not_started';
      return appFilter === 'all' || st === appFilter
    });
    if (appFilter !== 'all' && filteredTasks.length === 0) return;

    let tasksRows = filteredTasks.map(t => {
      const ts = td[t.id] || { status: 'not_started' };
      const canReq = ts.status === 'not_started' || ts.status === 'needs_work';
      const actionBtn = canReq ? `<button class="btn btn-sm btn-gold" onclick="openRequestModal('${t.id}','${sec.num}')">Request Sign-off</button>` : '';
      const feedbackHTML = ts.feedback ? `<div class="feedback-card ${ts.status === 'signed_off' ? 'approved' : ''}"><div class="fb-from">${ts.evaluator || 'Supervisor'} · ${ts.date || ''}</div><div class="fb-msg">${ts.feedback}</div></div>` : '';
      return `<tr><td class="td-task">${t.id}</td><td class="td-desc">${t.d}${feedbackHTML}</td><td>${statusBadge(ts.status)}</td><td style="white-space:nowrap;font-size:0.78rem">${ts.date || '—'}</td><td>${actionBtn}</td></tr>`
    }).join('');
    if (!tasksRows) return;

    sectionsHTML += `<div class="section-card ${isComplete ? 'sec-complete' : ''}" id="sec-${sec.num}">
      <div class="sec-header" onclick="this.parentElement.classList.toggle('open')">
        <h4>${isComplete ? '✓ ' : ''}Section ${sec.num}: ${sec.title}</h4>
        <div class="sec-meta"><span class="count">${ss.done}/${ss.total}</span>
        <div class="progress-bar"><div class="fill ${isComplete ? 'fill-green' : 'fill-gold'}" style="width:${ss.pct}%"></div></div>
        <span class="chevron">▼</span></div>
      </div>
      <div class="sec-body">
        <div class="rti-strip"><span class="rti-icon">📚</span> RTI Hours: <strong>${rtiHours.toFixed(1)}h</strong> logged for this section</div>
        <div class="overflow-x"><table class="data-table"><thead><tr><th>Task</th><th>Description</th><th>Status</th><th>Date</th><th></th></tr></thead><tbody>${tasksRows}</tbody></table></div>
      </div></div>`
  });

  const rtiTotal = getTotalRtiHours(u.id);
  const programLabel = currentProgram === 'advanced' ? 'CAET Advanced' : 'Apprenticeship OJT';
  return `<div class="app-bg"></div><div class="dashboard fade-in">
    <div class="dash-header"><h2>📋 ${programLabel}</h2><div class="dash-sub">${u.name} — ${stats.signed} of ${totalTasks} tasks signed off · ${rtiTotal.toFixed(1)}h RTI logged</div></div>
    ${programToggle}
    <div style="display:flex;flex-wrap:wrap;gap:1.2rem;align-items:flex-start;margin-bottom:1rem">
      <div class="progress-ring-wrap">${progressRingSVG(stats.pct, 130, stats.signed, totalTasks)}</div>
      <div style="flex:1;min-width:240px">
        <div class="mini-stats">
          <div class="mini-stat"><div class="num" style="color:var(--green)">${stats.signed}</div><div class="label">Signed Off</div></div>
          <div class="mini-stat"><div class="num" style="color:var(--blue)">${stats.requested}</div><div class="label">Requested</div></div>
          <div class="mini-stat"><div class="num" style="color:var(--red)">${stats.needsWork}</div><div class="label">Needs Rework</div></div>
          <div class="mini-stat"><div class="num" style="color:var(--text-dim)">${stats.notStarted}</div><div class="label">Not Started</div></div>
        </div>
      </div>
    </div>
    <div class="filter-bar">${filterHTML}</div>
    ${sectionsHTML}
  </div>`
}

function openRequestModal(taskId, secNum) {
  const sec = PQS.find(s => s.num == secNum); const task = sec.tasks.find(t => t.id === taskId);
  const overlay = document.getElementById('modal-overlay');
  overlay.innerHTML = `<div class="modal">
    <h3>Request Sign-off</h3>
    <p class="modal-sub">Task ${taskId}: ${task.d}</p>
    <div class="modal-detail"><strong>Performance Standard</strong><p style="margin-top:0.3rem;color:var(--text)">${task.s}</p></div>
    <label>Your Comments</label>
    <textarea id="reqComments" placeholder="Describe the work you performed, what aircraft/equipment was used, and why you believe you are ready for evaluation…"></textarea>
    <div class="modal-actions">
      <button class="btn btn-outline" onclick="hideModal()">Cancel</button>
      <button class="btn btn-gold" onclick="submitRequest('${taskId}')">📤 Submit Request</button>
    </div></div>`;
  overlay.classList.add('show')
}
function submitRequest(taskId) {
  const comments = document.getElementById('reqComments').value;
  if (!comments.trim()) { toast('Please describe the work you performed', 'warning'); return }
  if (!STATE.taskData[currentUser.id]) STATE.taskData[currentUser.id] = {};
  STATE.taskData[currentUser.id][taskId] = { status: 'requested', date: new Date().toISOString().slice(0, 10), comments };
  // Notify supervisor
  const sup = STATE.people.find(p => p.id === currentUser.supervisorId);
  if (sup) addNotif(sup.id, `${currentUser.name} requested sign-off on Task ${taskId}.`, 'info');
  saveState(); hideModal(); render(); toast('Sign-off request submitted')
}

// ---- APP TRAINING TAB ----
let activeQuiz = null, quizAnswers = {}, quizSubmitted = false, courseStep = 'study', resultsSaved = false;
function renderAppTraining(u) {
  const results = STATE.quizResults[u.id] || {};
  if (activeQuiz !== null) return renderQuizUI(activeQuiz, activeQuiz.type || 'apprentice', u.id);

  const customCourses = (STATE.customCourses || []).filter(c => c.targetRole === 'apprentice' || c.targetRole === 'both');
  const userCustomResults = STATE.customCourseResults?.[u.id] || {};
  const assignedList = STATE.assignedTraining[u.id] || [];

  // Group custom courses
  let assignedCoursesHtml = '';
  if (customCourses.length) {
    const assigned = customCourses.filter(c => assignedList.includes(c.id) && !userCustomResults[c.id]?.passed);
    const completed = customCourses.filter(c => userCustomResults[c.id]?.passed);
    const optional = customCourses.filter(c => !assignedList.includes(c.id) && !userCustomResults[c.id]?.passed);

    const renderCourseCard = (c, r) => {
      const passed = r?.passed;
      return `<div class="training-path-card ${passed ? 'passed' : ''}">
        <div class="tpc-header">
          <div class="tpc-icon" style="background:var(--card-bg);color:var(--gold)">📌</div>
          <h4>${c.title}</h4>
        </div>
        <p class="tpc-desc">${c.desc}</p>
        <div class="tpc-footer">
          <span class="tpc-status ${passed ? 'text-green' : assignedList.includes(c.id) ? 'text-orange' : 'text-dim'}">
            ${passed ? `✓ Passed (${r.score}%)` : assignedList.includes(c.id) ? 'Action Required' : 'Optional Module'}
          </span>
          <button class="btn btn-sm ${passed ? 'btn-outline' : 'btn-gold'}" onclick="startQuiz('${c.id}','custom')">${passed ? 'Retake' : 'Start Course'}</button>
        </div>
      </div>`;
    };

    if (assigned.length || optional.length || completed.length) {
      assignedCoursesHtml = `<div class="path-section">
        <h3>Shop Training Curriculum</h3>
        <p class="section-sub">Standard operating procedures and shop-specific training assigned to you.</p>
        <div class="training-grid">
          ${assigned.map(c => renderCourseCard(c, userCustomResults[c.id])).join('')}
          ${optional.map(c => renderCourseCard(c, userCustomResults[c.id])).join('')}
          ${completed.map(c => renderCourseCard(c, userCustomResults[c.id])).join('')}
        </div>
      </div>`;
    }
  }

  // Core PQS Modules Path
  let pqsCardsHtml = PQS.map(sec => {
    const passed = results[sec.num]?.passed;
    const score = results[sec.num]?.score;
    const sStats = secStats(u.id, sec.num);
    const pqsProgress = sStats.total > 0 ? Math.round((sStats.done / sStats.total) * 100) : 0;

    const riseInfo = RISE_MODULES[sec.num];
    return `<div class="training-path-card ${passed ? 'passed' : ''}">
      <div class="tpc-header">
        <div class="tpc-num ${passed ? 'bg-green' : 'bg-blue'}">${passed ? '✓' : sec.num}</div>
        <h4>${sec.title}</h4>
      </div>
      <p class="tpc-desc">${sec.fundamentals.length} fundamentals · ${sec.risks.length} risks${riseInfo ? ` · <span style="color:var(--blue)">📺 ${riseInfo.title}</span>` : ''}</p>
      ${riseInfo ? `<p style="font-size:0.72rem;color:var(--text-muted);margin:-0.3rem 0 0.4rem">${riseInfo.desc}</p>` : ''}
      
      <div class="tpc-metrics">
        <div class="metric-row">
          <span class="m-label">Sign-offs</span>
          <span class="m-val">${sStats.done}/${sStats.total}</span>
        </div>
        <div class="progress-bar"><div class="fill fill-gold" style="width:${pqsProgress}%"></div></div>
      </div>

      <div class="tpc-footer">
        <span class="tpc-status ${passed ? 'text-green' : 'text-dim'}">${passed ? `✓ Passed ${score}%` : 'Not Taken'}</span>
        <div style="display:flex;gap:0.3rem">
          ${riseInfo ? `<button class="btn btn-sm btn-outline" onclick="window.open('https://00ainick-cmd.github.io/ace-avionics-training/training/caet/${riseInfo.mod}/index.html','_blank')" title="Open interactive online lesson">📺</button>` : ''}
          <button class="btn btn-sm ${passed ? 'btn-outline' : 'btn-gold'}" onclick="startQuiz(${sec.num},'apprentice')">${passed ? 'Retake' : 'Study & Quiz'}</button>
        </div>
      </div>
    </div>`;
  }).join('');

  const completedCount = PQS.filter(s => results[s.num]?.passed).length;
  const overallPct = Math.round((completedCount / PQS.length) * 100);

  // Build CAET Training Course cards
  const trainingProgress = JSON.parse(localStorage.getItem('caet_training_progress') || '{}');
  let courseCardsHtml = TRAINING_MODULES.map((mod, i) => {
    const prog = trainingProgress[mod.id] || {};
    const mastery = prog.mastery || 0;
    const xp = prog.xp || 0;
    const completedActivities = (prog.completedActivities || []).length;
    const totalActivities = mod.activities.length;
    const isComplete = completedActivities >= totalActivities && mastery >= 80;
    const status = isComplete ? 'Complete' : completedActivities > 0 ? 'In Progress' : 'New';
    const statusClass = isComplete ? 'text-green' : completedActivities > 0 ? 'text-orange' : 'text-dim';

    const rtiCredit = mod.rtiHoursTarget > 0
      ? `<div class="tpc-rti-credit" style="font-size:0.72rem;color:var(--blue);margin-top:0.2rem">⏱️ ${mod.rtiHoursTarget}h RTI credit · Sections ${mod.pqsSections.join(', ')}</div>`
      : mod.pqsSections.length > 0
        ? `<div class="tpc-rti-credit" style="font-size:0.72rem;color:var(--text-muted);margin-top:0.2rem">📚 Supplements Sections ${mod.pqsSections.join(', ')}</div>`
        : `<div class="tpc-rti-credit" style="font-size:0.72rem;color:var(--text-muted);margin-top:0.2rem">📚 Cross-cutting knowledge</div>`;

    return `<div class="training-path-card ${isComplete ? 'passed' : ''}">
      <div class="tpc-header">
        <div class="tpc-num" style="background:${mod.color};color:#fff">${mod.num}</div>
        <h4>${mod.title}</h4>
      </div>
      <p class="tpc-desc">${mod.desc}</p>
      ${rtiCredit}
      <div class="tpc-metrics">
        <div class="metric-row">
          <span class="m-label">Mastery</span>
          <span class="m-val">${mastery}%</span>
        </div>
        <div class="progress-bar"><div class="fill" style="width:${mastery}%;background:${mod.color}"></div></div>
        <div style="display:flex;justify-content:space-between;font-size:0.72rem;color:var(--text-muted);margin-top:0.3rem">
          <span>${completedActivities}/${totalActivities} activities</span>
          <span>${xp} XP</span>
        </div>
      </div>
      <div class="tpc-footer">
        <span class="tpc-status ${statusClass}">${isComplete ? '✓ ' : ''}${status}</span>
        <button class="btn btn-sm ${isComplete ? 'btn-outline' : 'btn-gold'}" onclick="window.open('training/${mod.id}/index.html','_blank')">${isComplete ? 'Review' : completedActivities > 0 ? 'Continue' : 'Start Module'}</button>
      </div>
    </div>`;
  }).join('');

  const courseCompletedCount = TRAINING_MODULES.filter(m => {
    const p = trainingProgress[m.id] || {};
    return (p.completedActivities || []).length >= m.activities.length && (p.mastery || 0) >= 80;
  }).length;
  const coursePct = Math.round((courseCompletedCount / TRAINING_MODULES.length) * 100);

  return `<div class="app-bg"></div><div class="dashboard fade-in">
    <div class="dash-hero">
      <div class="hero-content">
        <h2>Apprentice Learning Path</h2>
        <p>Complete your required training modules to unlock sign-off capabilities. Study the fundamentals, risk management, and shop practices before performing tasks on the floor.</p>
      </div>
      <div class="hero-stats">
        ${progressRingSVG(overallPct, 120, completedCount, PQS.length)}
      </div>
    </div>

    ${assignedCoursesHtml}

    <div class="path-section">
      <h3>📚 CAET Training Course</h3>
      <p class="section-sub">Complete all 8 modules for CAET certification. Each module includes classroom lessons, flashcards, drill, jeopardy, and a final test. <strong style="color:var(--blue)">Training time counts toward your RTI hours.</strong></p>
      <div style="display:flex;align-items:center;gap:1rem;margin-bottom:1rem;padding:0.75rem 1rem;background:var(--card-bg);border-radius:8px;border:1px solid var(--border)">
        <div style="font-size:0.85rem;color:var(--text-dim)">Course Progress</div>
        <div class="progress-bar" style="flex:1"><div class="fill fill-gold" style="width:${coursePct}%"></div></div>
        <div style="font-size:0.85rem;font-weight:600;color:var(--gold)">${courseCompletedCount}/${TRAINING_MODULES.length} modules</div>
      </div>
      <div class="training-grid">
        ${courseCardsHtml}
      </div>
    </div>

    <div class="path-section">
      <h3>Core PQS Modules</h3>
      <p class="section-sub">Regulatory knowledge and practical theory required for certification.</p>
      <div class="training-grid">
        ${pqsCardsHtml}
      </div>
    </div>
  </div>`;
}

function startQuiz(secOrId, type) {
  activeQuiz = { secOrId, type }; quizAnswers = {}; quizSubmitted = false; resultsSaved = false; courseStep = 'study'; render()
}
function setCourseStep(step) { courseStep = step; render(); window.scrollTo({ top: 0, behavior: 'smooth' }) }

function renderQuizUI(quizInfo, type, userId) {
  let questions, title, subtitle = '', contentBlocks = [];

  if (type === 'apprentice') {
    const sec = PQS.find(s => s.num === quizInfo.secOrId);
    questions = QUIZZES[sec.num] || [];
    title = `Section ${sec.num}: ${sec.title}`;
    subtitle = sec.objective;
    // Build lesson blocks from fundamentals and risks
    if (sec.fundamentals.length) {
      contentBlocks.push({ type: 'text', title: 'Fundamentals', body: sec.fundamentals.map(f => `<strong style="color:var(--gold)">${f.n}</strong> — ${f.t}`).join('<br><br>') });
    }
    if (sec.risks.length) {
      contentBlocks.push({ type: 'warning', body: '<strong>Risk Management</strong><br>' + sec.risks.map(r => '⚠ ' + r).join('<br>') });
    }
    // Add the tasks as a key takeaway
    contentBlocks.push({ type: 'key', body: `<strong>Tasks to Master</strong><br>${sec.tasks.map(t => `${t.id} — ${t.d}`).join('<br>')}` });
  } else if (type === 'custom') {
    const course = (STATE.customCourses || []).find(c => c.id === quizInfo.secOrId);
    if (!course) { activeQuiz = null; render(); return ''; }
    questions = course.quiz || []; title = course.title;
    subtitle = course.desc;
    // Map custom content blocks
    (course.content || []).forEach((c, i) => {
      if (typeof c === 'object' && c.type) {
        contentBlocks.push(c);
      } else {
        contentBlocks.push({ type: 'text', body: c });
      }
    });
  } else {
    const mod = SUP_TRAINING.find(m => m.id === quizInfo.secOrId);
    questions = mod.quiz || []; title = mod.title;
    subtitle = mod.desc;
    // Map supervisor content to alternating blocks
    (mod.content || []).forEach((c, i) => {
      if (i === 0) contentBlocks.push({ type: 'text', title: 'Overview', body: c });
      else if (i === mod.content.length - 1) contentBlocks.push({ type: 'key', body: c });
      else if (i % 3 === 1) contentBlocks.push({ type: 'callout', body: c });
      else contentBlocks.push({ type: 'text', body: c });
    });
  }

  // Step progress
  const stepsDef = [
    { k: 'study', l: 'Lesson', icon: '📖' },
    { k: 'quiz', l: 'Quiz', icon: '✏️' },
    { k: 'results', l: 'Results', icon: '📊' }
  ];
  const currentIdx = stepsDef.findIndex(s => s.k === courseStep);
  const stepsHTML = stepsDef.map((s, i) => {
    let cls = '';
    if (s.k === courseStep) cls = 'active';
    else if (i < currentIdx || courseStep === 'results') cls = 'done';
    return `<div class="course-step ${cls}" onclick="${s.k === 'results' && courseStep !== 'results' ? '' : `setCourseStep('${s.k}')`}">
      <span class="step-num">${i < currentIdx || courseStep === 'results' ? '✓' : i + 1}</span>${s.icon} ${s.l}</div>`
  }).join('');

  // ---- STUDY PAGE ----
  if (courseStep === 'study') {
    let lessonHTML = contentBlocks.map((b, i) => {
      const numLabel = `Lesson ${i + 1}`;
      if (b.type === 'callout') {
        return `<div class="lesson-callout"><span class="callout-icon">💡</span>${b.body}</div>`;
      }
      if (b.type === 'key') {
        return `<div class="lesson-key"><div class="key-label">✅ Key Takeaway</div>${b.body}</div>`;
      }
      if (b.type === 'warning') {
        return `<div class="lesson-warning">${b.body}</div>`;
      }
      // Default text block
      return `<div class="lesson-block"><div class="lesson-block-num">${numLabel}</div>
        ${b.title ? `<h4>${b.title}</h4>` : ''}
        <p>${b.body}</p></div>`;
    }).join('');

    return `<div class="app-bg"></div><div class="dashboard fade-in"><div class="course-shell">
      <div class="course-hero"><h2>${title}</h2><p class="course-meta">${subtitle}</p></div>
      <div class="course-steps">${stepsHTML}</div>
      <div class="lesson-section">${lessonHTML}</div>
      <div class="course-nav">
        <button class="btn-course-nav btn-course-back" onclick="activeQuiz=null;render()">← Exit Course</button>
        <button class="btn-course-nav btn-course-next" onclick="setCourseStep('quiz')">Continue to Quiz →</button>
      </div>
    </div></div>`
  }

  // ---- QUIZ PAGE ----
  if (courseStep === 'quiz') {
    let qHTML = questions.map((q, i) => `<div class="quiz-question"><h4><span class="q-num">Q${i + 1}.</span> ${q.q}</h4>
      ${q.opts.map((o, oi) => `<div class="quiz-option ${quizAnswers[i] === oi ? 'selected' : ''}" onclick="quizAnswers[${i}]=${oi};render()">${o}</div>`).join('')}</div>`).join('');
    const allAnswered = questions.every((_, i) => quizAnswers[i] !== undefined);

    return `<div class="app-bg"></div><div class="dashboard fade-in"><div class="course-shell">
      <div class="course-hero"><h2>${title}</h2><p class="course-meta">${QUIZ_PASS_SCORE}% required to pass · ${questions.length} questions</p></div>
      <div class="course-steps">${stepsHTML}</div>
      ${qHTML}
      <div class="course-nav">
        <button class="btn-course-nav btn-course-back" onclick="setCourseStep('study')">← Back to Lesson</button>
        <button class="btn-course-nav btn-course-next" ${allAnswered ? '' : 'disabled style="opacity:0.4;cursor:not-allowed"'} onclick="quizSubmitted=true;courseStep='results';render();window.scrollTo({top:0,behavior:'smooth'})">Submit Quiz →</button>
      </div>
    </div></div>`
  }

  // ---- RESULTS PAGE ----
  let correct = 0;
  questions.forEach((q, i) => { if (quizAnswers[i] === q.a) correct++ });
  const score = Math.round(correct / questions.length * 100);
  const passed = score >= QUIZ_PASS_SCORE;
  // Save result (only once per submission)
  if (!resultsSaved) {
    resultsSaved = true;
    if (type === 'apprentice') {
      if (!STATE.quizResults[userId]) STATE.quizResults[userId] = {};
      STATE.quizResults[userId][quizInfo.secOrId] = { score, passed, date: new Date().toISOString().slice(0, 10) };
      if (passed) addNotif('admin1', `${currentUser.name} passed Section ${quizInfo.secOrId} training (${score}%).`, 'success');
    } else if (type === 'custom') {
      if (!STATE.customCourseResults) STATE.customCourseResults = {};
      if (!STATE.customCourseResults[userId]) STATE.customCourseResults[userId] = {};
      STATE.customCourseResults[userId][quizInfo.secOrId] = { score, passed, date: new Date().toISOString().slice(0, 10) };
      const course = (STATE.customCourses || []).find(c => c.id === quizInfo.secOrId);
      if (passed && course) addNotif('admin1', `${currentUser.name} completed "${course.title}" (${score}%).`, 'success');
    } else {
      if (!STATE.supTrainingResults[userId]) STATE.supTrainingResults[userId] = {};
      STATE.supTrainingResults[userId][quizInfo.secOrId] = { score, passed, date: new Date().toISOString().slice(0, 10) };
      if (passed) addNotif('admin1', `${currentUser.name} completed "${title}" training (${score}%).`, 'success');
    }
    saveState();
  }

  let reviewHTML = questions.map((q, i) => {
    const userAns = quizAnswers[i]; const isCorrect = userAns === q.a;
    return `<div class="quiz-question"><h4><span class="q-num">Q${i + 1}.</span> ${q.q}</h4>
      ${q.opts.map((o, oi) => `<div class="quiz-option ${oi === q.a ? 'correct' : oi === userAns && !isCorrect ? 'wrong' : ''}">${o}</div>`).join('')}</div>`
  }).join('');

  return `<div class="app-bg"></div><div class="dashboard fade-in"><div class="course-shell">
    <div class="course-hero"><h2>${title}</h2><p class="course-meta">Course Complete</p></div>
    <div class="course-steps">${stepsHTML}</div>
    <div class="quiz-result"><div class="score ${passed ? 'pass' : 'fail'}">${score}%</div>
    <p style="font-size:1rem;margin:0.5rem 0;color:var(--text)">${passed ? '✓ Passed! Training complete.' : '✗ Did not pass. ' + QUIZ_PASS_SCORE + '% required.'}</p>
    <p style="font-size:0.82rem;color:var(--text-muted)">${correct} of ${questions.length} correct</p></div>
    <h3 style="color:var(--gold);margin:0 0 0.8rem;font-size:0.95rem">Answer Review</h3>${reviewHTML}
    <div class="course-nav">
      <button class="btn-course-nav btn-course-back" onclick="activeQuiz=null;render()">← Back to Training</button>
      ${!passed ? '<button class="btn-course-nav btn-course-next" onclick="quizSubmitted=false;quizAnswers={};courseStep=\'study\';render();window.scrollTo({top:0,behavior:\'smooth\'})">Retake Course →</button>' : ''}
    </div>
  </div></div>`
}

// ---- APP PORTFOLIO TAB ----
function renderAppPortfolio(u) {
  const pf = STATE.portfolio[u.id] || {}; const items = pf.items || {};
  const done = PORTFOLIO_ITEMS.filter(i => portfolioHasFile(items[i.key])).length;
  const cd = (STATE.certDates || {})[u.id] || {};
  const rs = recertStatus(cd.cert_date);
  const stats = taskStats(u.id);
  const rtiTotal = getTotalRtiHours(u.id);
  const rtiPending = getPendingRtiCount(u.id);

  // Board readiness calculation
  const pqsComplete = stats.pct === 100;
  const portfolioComplete = done === PORTFOLIO_ITEMS.length;
  const writtenPassed = cd.written_passed;
  const oralPassed = cd.oral_passed;
  const milestones = [
    { label: 'PQS Tasks', done: pqsComplete, detail: `${stats.signed}/${stats.total}` },
    { label: 'Portfolio', done: portfolioComplete, detail: `${done}/${PORTFOLIO_ITEMS.length}` },
    { label: 'Written Exam', done: writtenPassed, detail: cd.written_date || 'Not scheduled' },
    { label: 'Oral Board', done: oralPassed, detail: cd.oral_date || 'Not scheduled' }
  ];
  const milestoneDone = milestones.filter(m => m.done).length;
  const readinessPct = Math.round(milestoneDone / milestones.length * 100);

  // Milestone tracker
  let milestoneHTML = milestones.map(m => `
    <div class="milestone-item ${m.done ? 'done' : ''}">
      <div class="milestone-check">${m.done ? '✓' : '○'}</div>
      <div class="milestone-info">
        <div class="milestone-label">${m.label}</div>
        <div class="milestone-detail">${m.detail}</div>
      </div>
    </div>`).join('');

  // Hero section
  const heroMsg = readinessPct === 100
    ? '🎉 All milestones complete — ready for certification!'
    : `${milestoneDone} of ${milestones.length} certification milestones reached`;

  let heroHTML = `<div class="portfolio-hero">
    <div class="hero-content">
      <h2>Certification Readiness</h2>
      <p>${heroMsg}</p>
      <div class="milestone-track">${milestoneHTML}</div>
    </div>
    <div class="hero-stats">${progressRingSVG(readinessPct, 120)}</div>
  </div>`;

  // Apprenticeship Progress Card
  const ap = u.apprenticeship || {};
  const phaseInfo = getApprenticePhase(u.id);
  const advHours = getTotalRtiByProgram(u.id, 'advanced');
  const ojtHoursTotal = getTotalRtiByProgram(u.id, 'ojt');
  const daysSinceEnroll = ap.enrollDate ? Math.floor((Date.now() - new Date(ap.enrollDate)) / 86400000) : 0;
  const mentor = ap.mentorId ? STATE.people.find(p => p.id === ap.mentorId) : null;

  let phaseDotsHTML = APPRENTICESHIP_PHASES.map(p => {
    const done = p.phase < phaseInfo.phase || (p.phase === phaseInfo.phase && phaseInfo.status === 'complete');
    const active = p.phase === phaseInfo.phase && phaseInfo.status !== 'complete';
    return `<div style="text-align:center;flex:1">
      <div style="width:28px;height:28px;border-radius:50%;margin:0 auto 4px;display:flex;align-items:center;justify-content:center;font-size:0.7rem;font-weight:700;
        ${done ? 'background:var(--green);color:#fff' : active ? 'background:var(--gold);color:var(--navy)' : 'background:var(--navy-mid);color:var(--text-dim);border:1px solid var(--border)'}">
        ${done ? '✓' : p.phase}
      </div>
      <div style="font-size:0.65rem;color:${active ? 'var(--gold)' : 'var(--text-dim)'}">${p.label}</div>
    </div>`;
  }).join('');

  let apprenticeshipCardHTML = `<div class="card" style="margin-bottom:1rem;border:1px solid var(--gold);border-opacity:0.3">
    <div class="flex-between" style="margin-bottom:0.5rem">
      <h3>🎓 Apprenticeship Progress</h3>
      <div style="text-align:right">
        <div style="font-size:1.3rem;font-weight:800;color:var(--gold)">${phaseInfo.totalHours.toFixed(1)}h</div>
        <div style="font-size:0.72rem;color:var(--text-muted)">of ${PHASE_TOTAL_HOURS}h total</div>
      </div>
    </div>
    <div style="margin-bottom:0.75rem">
      <div style="font-size:0.85rem;margin-bottom:0.25rem">Phase ${phaseInfo.phase}: <strong>${phaseInfo.label}</strong> — ${phaseInfo.desc}</div>
      <div class="progress-bar" style="height:10px"><div class="fill fill-gold" style="width:${phaseInfo.pctTotal}%"></div></div>
      <div style="font-size:0.72rem;color:var(--text-muted);margin-top:2px">${phaseInfo.hoursInPhase.toFixed(1)}h / ${phaseInfo.targetHours}h in current phase (${phaseInfo.pctPhase}%)</div>
    </div>
    <div style="display:flex;gap:0.25rem;margin-bottom:0.75rem">${phaseDotsHTML}</div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.4rem;font-size:0.78rem">
      <div><span style="color:var(--text-dim)">CAET RTI:</span> <strong>${advHours.toFixed(1)}h</strong></div>
      <div><span style="color:var(--text-dim)">OJT Hours:</span> <strong>${ojtHoursTotal.toFixed(1)}h</strong></div>
      ${ap.enrollDate ? `<div><span style="color:var(--text-dim)">Enrolled:</span> ${ap.enrollDate} (${daysSinceEnroll}d)</div>` : ''}
      ${ap.rapNumber ? `<div><span style="color:var(--text-dim)">RAP#:</span> ${ap.rapNumber}</div>` : ''}
      ${mentor ? `<div><span style="color:var(--text-dim)">Mentor:</span> ${mentor.name}</div>` : ''}
      ${ap.sponsor ? `<div><span style="color:var(--text-dim)">Sponsor:</span> ${ap.sponsor}</div>` : ''}
    </div>
  </div>`;

  // RTI summary card
  const rtiBySection = {};
  PQS.forEach(s => { rtiBySection[s.num] = { title: s.title, hours: getRtiHours(u.id, s.num) } });
  const coveredSections = Object.values(rtiBySection).filter(s => s.hours > 0).length;

  let rtiHTML = `<div class="card rti-summary-card">
    <div class="flex-between" style="margin-bottom:0.75rem">
      <h3>📚 RTI Hours Summary</h3>
      <div style="text-align:right">
        <div style="font-size:1.3rem;font-weight:800;color:var(--gold)">${rtiTotal.toFixed(1)}h</div>
        <div style="font-size:0.75rem;color:var(--text-muted)">${coveredSections} of ${PQS.length} sections</div>
      </div>
    </div>
    <div class="rti-section-grid">
      ${PQS.map(s => {
    const h = getRtiHours(u.id, s.num);
    const hasPending = ((STATE.rtiLog || {})[u.id] || []).some(e => e.secNum === s.num && !e.approved);
    return `<div class="rti-sec-item">
          <div class="rti-sec-label">Sec ${s.num}</div>
          <div class="rti-sec-bar"><div class="rti-sec-fill" style="width:${Math.min(h / 5 * 100, 100)}%"></div></div>
          <div class="rti-sec-hours">${h.toFixed(1)}h${hasPending ? ' ⏳' : ''}</div>
        </div>`;
  }).join('')}
    </div>
    ${rtiPending > 0 ? `<div style="font-size:0.78rem;color:var(--text-muted);margin-top:0.5rem">⏳ ${rtiPending} entr${rtiPending === 1 ? 'y' : 'ies'} pending supervisor approval</div>` : ''}
  </div>`;

  // Cert status card — cleaner layout
  let certHTML = `<div class="card" style="margin-bottom:1rem">
    <h3 style="margin-bottom:0.3rem">🎓 CAET Certification Status</h3>
    <p style="font-size:0.82rem;color:var(--text-muted);margin-bottom:1rem">CAET holders must recertify every ${RECERT_YEARS} years through re-examination.</p>
    <div class="cert-grid">
      <div class="cert-item">
        <div class="cert-icon ${cd.written_passed ? 'cert-pass' : ''}">${cd.written_passed ? '✓' : '📝'}</div>
        <div class="cert-label">Written Exam</div>
        <div class="cert-value">${cd.written_date ? (cd.written_passed ? '<span style="color:var(--green)">Passed</span> · ' + cd.written_date : '<span style="color:var(--red)">Not Passed</span> · ' + cd.written_date) : '<span style="color:var(--text-dim)">Not Scheduled</span>'}</div>
      </div>
      <div class="cert-item">
        <div class="cert-icon ${cd.oral_passed ? 'cert-pass' : ''}">${cd.oral_passed ? '✓' : '🎤'}</div>
        <div class="cert-label">Oral Board</div>
        <div class="cert-value">${cd.oral_date ? (cd.oral_passed ? '<span style="color:var(--green)">Passed</span> · ' + cd.oral_date : '<span style="color:var(--red)">Not Passed</span> · ' + cd.oral_date) : '<span style="color:var(--text-dim)">Not Scheduled</span>'}</div>
      </div>
      <div class="cert-item">
        <div class="cert-icon ${cd.cert_date ? 'cert-pass' : ''}">${cd.cert_date ? '🏆' : '📋'}</div>
        <div class="cert-label">Certification</div>
        <div class="cert-value">${cd.cert_date ? cd.cert_date : '<span style="color:var(--text-dim)">Not Yet Certified</span>'}</div>
        ${cd.written_passed && cd.oral_passed && !cd.cert_date ? '<button class="btn btn-sm btn-gold" style="margin-top:0.4rem" onclick="openCertDateModal(\'' + u.id + '\',\'cert\')">Set Cert Date</button>' : ''}
      </div>
      <div class="cert-item">
        <div class="cert-icon">${rs.status === 'current' ? '✅' : rs.status === 'expired' ? '🔴' : '⏳'}</div>
        <div class="cert-label">Recertification</div>
        <div class="cert-value"><span class="badge ${rs.cls}">${rs.label}</span></div>
        ${rs.recertDate ? '<div style="font-size:0.72rem;color:var(--text-muted);margin-top:0.2rem">Due ' + rs.recertDate + '</div>' : ''}
      </div>
    </div>
  </div>`;

  // Evidence items grouped by category with category progress
  const cats = {
    certification: { label: '📜 Certification Documents', icon: '📜', desc: 'Official records from AEA and your evaluator' },
    evidence: { label: '📋 Work Evidence', icon: '📋', desc: 'Documentation of hands-on avionics work performed' },
    training_record: { label: '📒 Training Records', icon: '📒', desc: 'On-the-job training activity logs' }
  };
  let evidenceHTML = '';
  for (const [cat, catInfo] of Object.entries(cats)) {
    const catItems = PORTFOLIO_ITEMS.filter(i => i.category === cat);
    if (!catItems.length) continue;
    const catDone = catItems.filter(i => portfolioHasFile(items[i.key])).length;
    const catPct = Math.round(catDone / catItems.length * 100);
    const catComplete = catDone === catItems.length;

    evidenceHTML += `<div class="card portfolio-cat-card ${catComplete ? 'cat-complete' : ''}" style="margin-bottom:1rem">
      <div class="flex-between" style="margin-bottom:0.6rem">
        <div>
          <h3 style="margin-bottom:0.15rem">${catInfo.label}</h3>
          <p style="font-size:0.78rem;color:var(--text-muted)">${catInfo.desc}</p>
        </div>
        <div style="text-align:right;white-space:nowrap">
          <span style="font-weight:700;color:${catComplete ? 'var(--green)' : 'var(--gold)'}">${catDone}/${catItems.length}</span>
          ${catComplete ? '<span class="badge badge-signed" style="margin-left:0.5rem;font-size:0.72rem">Complete</span>' : ''}
        </div>
      </div>
      <div class="progress-bar" style="height:4px;margin-bottom:0.75rem"><div class="fill ${catComplete ? 'fill-green' : 'fill-gold'}" style="width:${catPct}%"></div></div>
      <div class="portfolio-upload-list">`;
    catItems.forEach(i => {
      const fileData = items[i.key];
      const hasFile = portfolioHasFile(fileData);
      const iconMap = { qual_record: '📄', written_cert: '📄', logbook_transponder: '📓', logbook_pitot: '📓', form_337: '📝', transponder_form: '📊', deviation_card: '🧭', work_samples: '📸', ojt_log: '⏱️' };
      const acceptMap = { work_samples: 'image/*', qual_record: '.pdf,image/*', written_cert: '.pdf,image/*', logbook_transponder: '.pdf,image/*,.doc,.docx', logbook_pitot: '.pdf,image/*,.doc,.docx', form_337: '.pdf,image/*', transponder_form: '.pdf,image/*', deviation_card: '.pdf,image/*', ojt_log: '.pdf,image/*,.csv,.xlsx' };

      let fileInfoHTML = '';
      if (hasFile && typeof fileData === 'object') {
        const isImage = (fileData.fileType || '').startsWith('image/');
        const thumb = isImage && fileData.data ? `<div class="pf-thumb" onclick="previewPortfolioFile('${u.id}','${i.key}')"><img src="${fileData.data}" alt="${i.label}"></div>` : '';
        fileInfoHTML = `<div class="pf-file-info">
          ${thumb}
          <div class="pf-file-meta">
            <span class="pf-filename">${fileData.fileName || 'Uploaded'}</span>
            <span class="pf-filedate">${fileData.uploadDate || ''}</span>
          </div>
          <div class="pf-file-actions">
            ${fileData.data ? `<button class="btn btn-sm btn-outline" onclick="previewPortfolioFile('${u.id}','${i.key}')">👁 View</button>` : ''}
            <button class="btn btn-sm btn-danger" onclick="removePortfolioFile('${u.id}','${i.key}')">✕</button>
          </div>
        </div>`;
      } else if (hasFile) {
        // Legacy boolean true — show as complete but encourage re-upload
        fileInfoHTML = `<div class="pf-file-info">
          <div class="pf-file-meta"><span class="pf-filename" style="color:var(--green)">✓ Marked complete</span></div>
          <div class="pf-file-actions">
            <button class="btn btn-sm btn-outline" onclick="triggerPortfolioUpload('${u.id}','${i.key}','${acceptMap[i.key] || '*'}')">📤 Upload file</button>
            <button class="btn btn-sm btn-danger" onclick="removePortfolioFile('${u.id}','${i.key}')">✕</button>
          </div>
        </div>`;
      }

      evidenceHTML += `<div class="pf-upload-item ${hasFile ? 'has-file' : ''}">
        <div class="pf-upload-header">
          <span class="pf-icon">${iconMap[i.key] || '📄'}</span>
          <div class="pf-content"><strong>${i.label}</strong><div class="pf-desc">${i.desc}</div></div>
          ${!hasFile ? `<button class="btn btn-sm btn-gold" onclick="triggerPortfolioUpload('${u.id}','${i.key}','${acceptMap[i.key] || '*'}')">📤 Upload</button>` : ''}
        </div>
        ${fileInfoHTML}
      </div>`;
    });
    evidenceHTML += '</div></div>';
  }
  // Board request section
  const existingRequest = (STATE.boardRequests || []).find(r => r.candidateId === u.id && ['pending_supervisor', 'endorsed'].includes(r.status));
  const rejectedRequest = (STATE.boardRequests || []).find(r => r.candidateId === u.id && r.status === 'rejected');
  const allFilesUploaded = PORTFOLIO_ITEMS.every(i => portfolioHasFile(items[i.key]) && typeof items[i.key] === 'object');
  const rtiMet = rtiTotal >= RTI_TOTAL_REQUIRED;

  const prereqs = [
    { label: 'PQS Tasks Complete', met: pqsComplete, detail: `${stats.signed}/${stats.total} tasks signed off` },
    { label: 'All Evidence Uploaded', met: allFilesUploaded, detail: `${done}/${PORTFOLIO_ITEMS.length} items with files attached` },
    { label: 'Written Exam Passed', met: !!writtenPassed, detail: cd.written_date || 'Not scheduled' },
    { label: `RTI Hours (${RTI_TOTAL_REQUIRED}h required)`, met: rtiMet, detail: `${rtiTotal.toFixed(1)}h of ${RTI_TOTAL_REQUIRED}h logged` }
  ];
  const allPrereqsMet = prereqs.every(p => p.met);

  let requestHTML = `<div class="card board-request-card">
    <h3 style="margin-bottom:0.3rem">🎯 Oral Board Application</h3>
    <p style="font-size:0.82rem;color:var(--text-muted);margin-bottom:1rem">When all prerequisites are met, submit your portfolio for supervisor endorsement and committee review.</p>`;

  // Show existing request status
  if (existingRequest) {
    const statusMap = {
      pending_supervisor: { icon: '⏳', label: 'Pending Supervisor Endorsement', cls: 'status-pending', desc: `Submitted ${existingRequest.submittedDate}. Awaiting endorsement from your supervisor.` },
      endorsed: { icon: '✅', label: 'Endorsed — Awaiting Committee', cls: 'status-endorsed', desc: `Endorsed ${existingRequest.supervisorEndorsement?.date || ''}. The committee has been notified and will schedule your oral board.` }
    };
    const st = statusMap[existingRequest.status];
    requestHTML += `<div class="request-status ${st.cls}">
      <div class="request-status-icon">${st.icon}</div>
      <div><strong>${st.label}</strong><div style="font-size:0.78rem;color:var(--text-muted);margin-top:0.2rem">${st.desc}</div></div>
    </div>
    <div class="flex-between" style="margin-top:1rem">
      <button class="btn btn-outline" onclick="generatePortfolioSummary('${u.id}')">📋 View Portfolio Summary</button>
      <button class="btn btn-outline" onclick="downloadEvidenceZip('${u.id}')">📦 Download Evidence ZIP</button>
    </div>`;
  } else if (rejectedRequest) {
    requestHTML += `<div class="request-status status-rejected">
      <div class="request-status-icon">❌</div>
      <div><strong>Endorsement Not Approved</strong>
        <div style="font-size:0.78rem;color:var(--text-muted);margin-top:0.2rem">${rejectedRequest.rejectionNotes || 'No feedback provided.'}</div>
      </div>
    </div>`;
  }

  // Prerequisites checklist (always shown)
  requestHTML += `<div class="prereq-list" style="margin-top:${existingRequest ? '1rem' : '0'}">
    ${prereqs.map(p => `<div class="prereq-item ${p.met ? 'met' : 'unmet'}">
      <span class="prereq-check">${p.met ? '✓' : '○'}</span>
      <div class="prereq-info">
        <span class="prereq-label">${p.label}</span>
        <span class="prereq-detail">${p.detail}</span>
      </div>
    </div>`).join('')}
  </div>`;

  // Action buttons
  if (!existingRequest) {
    if (allPrereqsMet) {
      requestHTML += `<button class="btn btn-gold btn-block board-request-btn" onclick="requestOralBoard('${u.id}')">
        🎓 Request Oral Board Review
      </button>
      <div class="flex-between" style="margin-top:0.5rem">
        <button class="btn btn-outline btn-sm" onclick="generatePortfolioSummary('${u.id}')">📋 Preview Summary</button>
        <button class="btn btn-outline btn-sm" onclick="downloadEvidenceZip('${u.id}')">📦 Download Evidence ZIP</button>
      </div>`;
    } else {
      requestHTML += `<div class="board-request-blocked">
        <div style="font-size:0.85rem;color:var(--text-muted)">Complete all prerequisites above to request your oral board.</div>
      </div>`;
    }
  }
  requestHTML += '</div>';

  // Work Gallery section
  const gallery = pf.gallery || [];
  let galleryHTML = `<div class="card" style="margin-bottom:1rem">
    <div class="flex-between" style="margin-bottom:0.6rem">
      <h3>📸 Work Portfolio</h3>
      <span style="font-size:0.78rem;color:var(--text-muted)">${gallery.length} items</span>
    </div>
    <p style="font-size:0.82rem;color:var(--text-muted);margin-bottom:1rem">Upload work samples with descriptions to build your digital resume.</p>`;

  GALLERY_CATEGORIES.forEach(cat => {
    const catItems = gallery.filter(g => g.category === cat.key);
    const canAdd = catItems.length < cat.maxFiles;
    galleryHTML += `<div style="margin-bottom:1rem;padding:0.75rem;background:var(--navy-mid);border-radius:8px">
      <div class="flex-between" style="margin-bottom:0.5rem">
        <div>
          <span style="font-weight:600;font-size:0.85rem">${cat.icon} ${cat.label}</span>
          <span style="font-size:0.72rem;color:var(--text-dim);margin-left:0.5rem">${catItems.length}/${cat.maxFiles}</span>
        </div>
        ${canAdd ? `<button class="btn btn-sm btn-outline" onclick="openGalleryUpload('${u.id}','${cat.key}')">+ Add</button>` : ''}
      </div>`;
    if (catItems.length) {
      catItems.forEach(g => {
        galleryHTML += `<div style="display:flex;justify-content:space-between;align-items:flex-start;padding:0.5rem;margin-bottom:0.4rem;background:var(--card-bg);border-radius:6px;border:1px solid var(--border)">
          <div style="flex:1;min-width:0">
            <div style="font-weight:600;font-size:0.82rem;color:var(--text)">${g.title}</div>
            <div style="font-size:0.75rem;color:var(--text-muted);margin-top:2px">${g.description}</div>
            <div style="font-size:0.68rem;color:var(--text-dim);margin-top:2px">${g.fileName} · ${g.uploadDate}</div>
          </div>
          <button class="btn btn-sm btn-danger" style="margin-left:0.5rem;flex-shrink:0" onclick="removeGalleryItem('${u.id}','${g.id}')">✕</button>
        </div>`;
      });
    } else {
      galleryHTML += `<div style="font-size:0.78rem;color:var(--text-dim);padding:0.3rem 0">No items yet — add your first ${cat.label.toLowerCase()}</div>`;
    }
    galleryHTML += `</div>`;
  });
  galleryHTML += `</div>`;

  // Endorsement section
  const endorsement = pf.endorsement;
  let endorseHTML = `<div class="card" style="margin-bottom:1rem">
    <h3 style="margin-bottom:0.5rem">✉️ Supervisor Endorsement</h3>`;
  if (endorsement) {
    endorseHTML += `<div style="background:var(--navy-mid);border-radius:8px;padding:1rem;border-left:3px solid var(--gold)">
      <div style="font-style:italic;font-size:0.88rem;color:var(--text);line-height:1.6;margin-bottom:0.5rem">"${endorsement.text}"</div>
      <div style="font-size:0.78rem;color:var(--gold);font-weight:600">— ${endorsement.author} · ${endorsement.date}</div>
    </div>`;
  } else {
    endorseHTML += `<p style="font-size:0.82rem;color:var(--text-muted)">No endorsement yet. Your evaluator can write one from their dashboard.</p>`;
  }
  endorseHTML += `</div>`;

  // Export button
  let exportHTML = `<div class="card" style="margin-bottom:1rem;text-align:center;border:1px dashed var(--gold)">
    <h3 style="margin-bottom:0.3rem">⬇ Download Portfolio</h3>
    <p style="font-size:0.82rem;color:var(--text-muted);margin-bottom:0.75rem">Generate a printable resume with your competencies, work samples, and endorsement.</p>
    <button class="btn btn-gold" onclick="exportPortfolio('${u.id}')" style="padding:0.6rem 2rem;font-size:0.9rem">📄 Generate Portfolio</button>
  </div>`;

  return `<div class="app-bg"></div><div class="dashboard fade-in">
    ${heroHTML}${apprenticeshipCardHTML}${rtiHTML}${certHTML}${galleryHTML}${endorseHTML}${exportHTML}${evidenceHTML}${requestHTML}</div>`
}
// ---- PORTFOLIO FILE UPLOAD ----
function portfolioHasFile(val) {
  if (!val) return false;
  if (val === true) return true; // legacy boolean
  return typeof val === 'object' && val.uploaded;
}

let _pfUploadTarget = null;

function triggerPortfolioUpload(pid, key, accept) {
  _pfUploadTarget = { pid, key };
  let input = document.getElementById('pf-file-input');
  if (!input) {
    input = document.createElement('input');
    input.type = 'file';
    input.id = 'pf-file-input';
    input.style.display = 'none';
    input.addEventListener('change', handlePortfolioUpload);
    document.body.appendChild(input);
  }
  input.accept = accept || '*';
  input.value = '';
  input.click();
}

function handlePortfolioUpload(e) {
  const file = e.target.files[0];
  if (!file || !_pfUploadTarget) return;
  const { pid, key } = _pfUploadTarget;

  // Size check: warn over 2MB for localStorage limits
  if (file.size > 2 * 1024 * 1024) {
    toast('File too large (max 2MB for demo). Try a smaller file or compressed image.', 'warning');
    return;
  }

  const reader = new FileReader();
  reader.onload = function (ev) {
    if (!STATE.portfolio[pid]) STATE.portfolio[pid] = {};
    if (!STATE.portfolio[pid].items) STATE.portfolio[pid].items = {};
    STATE.portfolio[pid].items[key] = {
      uploaded: true,
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size,
      data: ev.target.result,
      uploadDate: new Date().toISOString().slice(0, 10)
    };
    saveState(); render();
    toast(`✓ ${file.name} saved to portfolio`, 'success');
  };
  reader.readAsDataURL(file);
}

function previewPortfolioFile(pid, key) {
  const pf = STATE.portfolio[pid] || {};
  const fileData = (pf.items || {})[key];
  if (!fileData || typeof fileData !== 'object' || !fileData.data) return;

  const overlay = document.getElementById('modal-overlay');
  const isImage = (fileData.fileType || '').startsWith('image/');
  const isPDF = (fileData.fileType || '') === 'application/pdf';
  const item = PORTFOLIO_ITEMS.find(i => i.key === key);

  let previewContent = '';
  if (isImage) {
    previewContent = `<img src="${fileData.data}" alt="${item?.label || key}" style="max-width:100%;max-height:60vh;border-radius:8px;margin:1rem 0">`;
  } else if (isPDF) {
    previewContent = `<iframe src="${fileData.data}" style="width:100%;height:60vh;border:none;border-radius:8px;margin:1rem 0"></iframe>`;
  } else {
    previewContent = `<div style="padding:2rem;text-align:center;color:var(--text-muted)">
      <div style="font-size:3rem;margin-bottom:1rem">📄</div>
      <p>Preview not available for this file type.</p>
      <a href="${fileData.data}" download="${fileData.fileName}" class="btn btn-gold" style="margin-top:1rem">⬇ Download ${fileData.fileName}</a>
    </div>`;
  }

  overlay.innerHTML = `<div class="modal" style="max-width:720px">
    <div class="flex-between" style="margin-bottom:0.5rem">
      <div><h3 style="margin-bottom:0.2rem">${item?.label || key}</h3>
        <p style="font-size:0.78rem;color:var(--text-muted)">${fileData.fileName} · ${(fileData.fileSize / 1024).toFixed(0)} KB · ${fileData.uploadDate}</p></div>
      <button class="btn btn-outline" onclick="hideModal()">✕ Close</button>
    </div>
    ${previewContent}
  </div>`;
  overlay.classList.add('show');
}

function removePortfolioFile(pid, key) {
  if (!STATE.portfolio[pid]?.items) return;
  const fileData = STATE.portfolio[pid].items[key];
  const item = PORTFOLIO_ITEMS.find(i => i.key === key);
  const fileName = (typeof fileData === 'object') ? (fileData.fileName || 'File') : 'Document';
  const uploadDate = (typeof fileData === 'object') ? (fileData.uploadDate || '') : '';
  const hasData = typeof fileData === 'object' && fileData.data;

  const overlay = document.getElementById('modal-overlay');
  overlay.innerHTML = `<div class="modal" style="max-width:440px">
    <h3 style="color:var(--red)">⚠ Remove Evidence?</h3>
    <p style="margin:0.5rem 0;font-size:0.9rem;color:var(--text)"><strong>${item?.label || key}</strong></p>
    <p style="font-size:0.82rem;color:var(--text-muted);margin-bottom:1rem">${fileName}${uploadDate ? ' · uploaded ' + uploadDate : ''}</p>
    <p style="font-size:0.82rem;color:var(--text-muted);margin-bottom:1rem">This file will be moved to trash and can be restored by an admin within 30 days.</p>
    <div style="display:flex;flex-direction:column;gap:0.5rem">
      ${hasData ? `<button class="btn btn-outline" onclick="downloadPortfolioFile('${pid}','${key}');hideModal()">⬇ Download First</button>` : ''}
      <button class="btn btn-outline" style="border-color:var(--red);color:var(--red)" onclick="confirmRemovePortfolioFile('${pid}','${key}')">🗑 Remove File</button>
      <button class="btn btn-outline" onclick="hideModal()">Cancel — Keep File</button>
    </div>
  </div>`;
  overlay.classList.add('show');
}

function downloadPortfolioFile(pid, key) {
  const fileData = STATE.portfolio[pid]?.items?.[key];
  if (!fileData || typeof fileData !== 'object' || !fileData.data) return;
  const a = document.createElement('a');
  a.href = fileData.data; a.download = fileData.fileName || 'download';
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  toast('📄 Downloaded ' + (fileData.fileName || 'file'));
}

function confirmRemovePortfolioFile(pid, key) {
  if (!STATE.portfolio[pid]?.items) return;
  const fileData = STATE.portfolio[pid].items[key];
  // Move to trash
  if (!STATE.portfolioTrash) STATE.portfolioTrash = [];
  STATE.portfolioTrash.push({
    pid, key, fileData,
    deletedDate: new Date().toISOString().slice(0, 10),
    deletedBy: currentUser?.name || 'Unknown',
    expiresDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
  });
  // Purge items older than 30 days
  const now = new Date().toISOString().slice(0, 10);
  STATE.portfolioTrash = STATE.portfolioTrash.filter(t => t.expiresDate >= now);
  delete STATE.portfolio[pid].items[key];
  saveState(); hideModal(); render();
  toast('Evidence moved to trash (30-day recovery)', 'info');
}

function restorePortfolioTrash(index) {
  const item = STATE.portfolioTrash[index];
  if (!item) return;
  if (!STATE.portfolio[item.pid]) STATE.portfolio[item.pid] = {};
  if (!STATE.portfolio[item.pid].items) STATE.portfolio[item.pid].items = {};
  STATE.portfolio[item.pid].items[item.key] = item.fileData;
  STATE.portfolioTrash.splice(index, 1);
  saveState(); render();
  toast('Evidence restored', 'success');
}

// ============================================================
// WORK GALLERY (Portfolio)
// ============================================================
function openGalleryUpload(pid, category) {
  const cat = GALLERY_CATEGORIES.find(c => c.key === category);
  const pf = STATE.portfolio[pid] || {};
  const gallery = pf.gallery || [];
  const catCount = gallery.filter(g => g.category === category).length;
  if (catCount >= cat.maxFiles) { toast(`Maximum ${cat.maxFiles} files for ${cat.label}`, 'warning'); return; }

  const overlay = document.getElementById('modal-overlay');
  overlay.innerHTML = `<div class="modal" style="max-width:480px">
    <h3>${cat.icon} Add to ${cat.label}</h3>
    <p class="modal-sub">${cat.desc}</p>
    <label>Title <span style="color:var(--red)">*</span></label>
    <input type="text" id="galTitle" placeholder="e.g. GTN 750Xi Wire Harness" maxlength="80">
    <label>Description <span style="color:var(--red)">*</span></label>
    <textarea id="galDesc" placeholder="Describe the work: what was done, aircraft, key details…" maxlength="300" rows="3"></textarea>
    <label>File</label>
    <input type="file" id="galFile" accept="${cat.accept}" style="margin-bottom:0.5rem">
    <div style="font-size:0.72rem;color:var(--text-dim)">Max 2MB per file · ${catCount}/${cat.maxFiles} slots used</div>
    <div class="modal-actions">
      <button class="btn btn-outline" onclick="hideModal()">Cancel</button>
      <button class="btn btn-gold" onclick="submitGalleryUpload('${pid}','${category}')">📤 Upload</button>
    </div></div>`;
  overlay.classList.add('show');
}

function submitGalleryUpload(pid, category) {
  const title = document.getElementById('galTitle').value.trim();
  const desc = document.getElementById('galDesc').value.trim();
  const fileInput = document.getElementById('galFile');
  if (!title) { toast('Please add a title', 'warning'); return; }
  if (!desc) { toast('Please add a description', 'warning'); return; }
  const file = fileInput.files[0];
  if (!file) { toast('Please select a file', 'warning'); return; }
  if (file.size > 2 * 1024 * 1024) { toast('File too large (max 2MB)', 'warning'); return; }

  const reader = new FileReader();
  reader.onload = function(ev) {
    if (!STATE.portfolio[pid]) STATE.portfolio[pid] = { items: {}, gallery: [], endorsement: null };
    if (!STATE.portfolio[pid].gallery) STATE.portfolio[pid].gallery = [];
    STATE.portfolio[pid].gallery.push({
      id: 'gal_' + Date.now(),
      category,
      title,
      description: desc,
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size,
      data: ev.target.result,
      uploadDate: new Date().toISOString().slice(0, 10)
    });
    saveState(); hideModal(); render();
    toast(`✓ "${title}" added to portfolio`, 'success');
  };
  reader.readAsDataURL(file);
}

function removeGalleryItem(pid, itemId) {
  if (!confirm('Remove this item from your portfolio?')) return;
  const pf = STATE.portfolio[pid];
  if (pf && pf.gallery) {
    pf.gallery = pf.gallery.filter(g => g.id !== itemId);
    saveState(); render();
    toast('Item removed', 'info');
  }
}

// ============================================================
// SUPERVISOR ENDORSEMENT
// ============================================================
function openEndorsementModal(pid) {
  const person = STATE.people.find(p => p.id === pid);
  const pf = STATE.portfolio[pid] || {};
  const existing = pf.endorsement;
  const overlay = document.getElementById('modal-overlay');
  overlay.innerHTML = `<div class="modal" style="max-width:520px">
    <h3>✉️ Write Endorsement</h3>
    <p class="modal-sub">Write a professional endorsement for <strong>${person?.name || 'this apprentice'}</strong>. This will appear on their downloadable portfolio.</p>
    <label>Endorsement Text</label>
    <textarea id="endorseText" rows="5" placeholder="Describe their strengths, growth, work ethic, and readiness for certification…" style="min-height:120px">${existing?.text || ''}</textarea>
    <div class="modal-actions">
      <button class="btn btn-outline" onclick="hideModal()">Cancel</button>
      <button class="btn btn-gold" onclick="submitEndorsement('${pid}')">✓ Save Endorsement</button>
    </div></div>`;
  overlay.classList.add('show');
}

function submitEndorsement(pid) {
  const text = document.getElementById('endorseText').value.trim();
  if (!text) { toast('Please write an endorsement', 'warning'); return; }
  if (!STATE.portfolio[pid]) STATE.portfolio[pid] = { items: {}, gallery: [], endorsement: null };
  STATE.portfolio[pid].endorsement = {
    text,
    author: currentUser.name,
    authorId: currentUser.id,
    date: new Date().toISOString().slice(0, 10)
  };
  addNotif(pid, `${currentUser.name} wrote a portfolio endorsement for you.`, 'success');
  saveState(); hideModal(); render();
  toast('Endorsement saved ✓', 'success');
}

// ============================================================
// EXPORT PORTFOLIO (Printable HTML Resume)
// ============================================================
function exportPortfolio(pid) {
  const person = STATE.people.find(p => p.id === pid);
  if (!person) return;
  const ap = person.apprenticeship || {};
  const pf = STATE.portfolio[pid] || {};
  const cd = (STATE.certDates || {})[pid] || {};
  const stats = taskStats(pid);
  const phaseInfo = getApprenticePhase(pid);
  const advHours = getTotalRtiByProgram(pid, 'advanced');
  const ojtHours = getTotalRtiByProgram(pid, 'ojt');
  const sup = person.supervisorId ? STATE.people.find(p => p.id === person.supervisorId) : null;
  const gallery = pf.gallery || [];
  const endorsement = pf.endorsement;

  // Section-by-section competency
  const sectionRows = PQS.map(s => {
    const ss = secStats(pid, s.num);
    const h = getRtiHours(pid, s.num);
    return `<tr><td style="padding:6px 12px;border-bottom:1px solid #e5e7eb">Section ${s.num}: ${s.title}</td>
      <td style="padding:6px 12px;border-bottom:1px solid #e5e7eb;text-align:center">${ss.done}/${ss.total}</td>
      <td style="padding:6px 12px;border-bottom:1px solid #e5e7eb;text-align:center">${h.toFixed(1)}h</td>
      <td style="padding:6px 12px;border-bottom:1px solid #e5e7eb;text-align:center">${ss.done === ss.total ? '✅' : '⬜'}</td></tr>`;
  }).join('');

  // OJT section rows
  const ojtRows = OJT.map(s => {
    const h = getOjtHours(pid, s.num);
    const target = OJT_REQUIRED_HOURS[s.num] || 0;
    return `<tr><td style="padding:6px 12px;border-bottom:1px solid #e5e7eb">${s.num}: ${s.title}</td>
      <td style="padding:6px 12px;border-bottom:1px solid #e5e7eb;text-align:center">${h.toFixed(1)}h / ${target}h</td>
      <td style="padding:6px 12px;border-bottom:1px solid #e5e7eb;text-align:center">${h >= target ? '✅' : '⬜'}</td></tr>`;
  }).join('');

  // Gallery items grouped
  const galleryHTML = GALLERY_CATEGORIES.map(cat => {
    const catItems = gallery.filter(g => g.category === cat.key);
    if (!catItems.length) return '';
    return `<div style="margin-bottom:20px">
      <h3 style="font-size:14px;color:#1f2937;margin:0 0 8px;border-bottom:1px solid #e5e7eb;padding-bottom:4px">${cat.icon} ${cat.label}</h3>
      ${catItems.map(g => `<div style="margin-bottom:12px;padding:8px 12px;background:#f9fafb;border-radius:6px;border:1px solid #e5e7eb">
        <div style="font-weight:600;font-size:13px;color:#111827">${g.title}</div>
        <div style="font-size:12px;color:#6b7280;margin-top:2px">${g.description}</div>
        <div style="font-size:11px;color:#9ca3af;margin-top:2px">${g.fileName} · ${g.uploadDate}</div>
      </div>`).join('')}
    </div>`;
  }).join('');

  // Phase progress dots
  const phaseDots = APPRENTICESHIP_PHASES.map(p => {
    const done = p.phase < phaseInfo.phase || (p.phase === phaseInfo.phase && phaseInfo.status === 'complete');
    const active = p.phase === phaseInfo.phase && phaseInfo.status !== 'complete';
    const bg = done ? '#22c55e' : active ? '#f59e0b' : '#e5e7eb';
    const color = done ? '#fff' : active ? '#1f2937' : '#9ca3af';
    return `<div style="text-align:center;flex:1">
      <div style="width:32px;height:32px;border-radius:50%;margin:0 auto 4px;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;background:${bg};color:${color}">${done ? '✓' : p.phase}</div>
      <div style="font-size:11px;color:${active ? '#f59e0b' : '#6b7280'}">${p.label}</div>
    </div>`;
  }).join('');

  const html = `<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Portfolio — ${person.name}</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Inter', sans-serif; color: #1f2937; background: #fff; line-height: 1.5; }
  @media print { body { font-size: 11px; } .no-print { display: none !important; } .page-break { page-break-before: always; } }
  .container { max-width: 800px; margin: 0 auto; padding: 40px 32px; }
  .header { background: linear-gradient(135deg, #0a1628 0%, #1a2d4a 100%); color: #fff; padding: 40px 32px; border-radius: 12px; margin-bottom: 32px; }
  .header h1 { font-size: 28px; font-weight: 800; margin-bottom: 4px; }
  .header .subtitle { font-size: 14px; color: #f59e0b; font-weight: 600; }
  .header .meta { margin-top: 16px; display: grid; grid-template-columns: 1fr 1fr; gap: 6px; font-size: 13px; color: rgba(255,255,255,0.8); }
  .header .meta strong { color: #fff; }
  .section { margin-bottom: 28px; }
  .section h2 { font-size: 16px; font-weight: 700; color: #0a1628; margin-bottom: 12px; padding-bottom: 6px; border-bottom: 2px solid #f59e0b; }
  table { width: 100%; border-collapse: collapse; font-size: 13px; }
  th { background: #f3f4f6; padding: 8px 12px; text-align: left; font-weight: 600; font-size: 12px; color: #374151; border-bottom: 2px solid #e5e7eb; }
  .endorsement { background: #fffbeb; border: 1px solid #fde68a; border-radius: 8px; padding: 20px; margin-bottom: 4px; }
  .endorsement .quote { font-style: italic; font-size: 14px; color: #1f2937; line-height: 1.6; margin-bottom: 12px; }
  .endorsement .author { font-size: 13px; color: #92400e; font-weight: 600; }
  .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 20px; }
  .stat-card { background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px; text-align: center; }
  .stat-card .num { font-size: 24px; font-weight: 800; color: #0a1628; }
  .stat-card .label { font-size: 11px; color: #6b7280; margin-top: 2px; }
  .footer { text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 11px; color: #9ca3af; }
  .print-btn { position: fixed; bottom: 24px; right: 24px; background: #f59e0b; color: #0a1628; border: none; padding: 12px 24px; border-radius: 8px; font-weight: 700; cursor: pointer; font-size: 14px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); }
  .print-btn:hover { background: #d97706; }
</style>
</head><body>
<button class="print-btn no-print" onclick="window.print()">🖨 Print / Save PDF</button>
<div class="container">
  <div class="header">
    <div style="display:flex;justify-content:space-between;align-items:flex-start">
      <div>
        <h1>${person.name}</h1>
        <div class="subtitle">Avionics Technician — CAET Portfolio</div>
      </div>
      <div style="text-align:right;font-size:12px;color:rgba(255,255,255,0.6)">
        AEA — Aircraft Electronics Association<br>
        Generated ${new Date().toLocaleDateString('en-US', {year: 'numeric', month: 'long', day: 'numeric'})}
      </div>
    </div>
    <div class="meta">
      <div><strong>Sponsor:</strong> ${ap.sponsor || STATE.shopName || '—'}</div>
      <div><strong>Evaluator:</strong> ${sup?.name || '—'}</div>
      <div><strong>Enrolled:</strong> ${ap.enrollDate || '—'}</div>
      <div><strong>RAP#:</strong> ${ap.rapNumber || '—'}</div>
    </div>
  </div>

  <div class="section">
    <h2>Summary</h2>
    <div class="stats-grid">
      <div class="stat-card"><div class="num">${stats.signed}/${stats.total}</div><div class="label">PQS Tasks</div></div>
      <div class="stat-card"><div class="num">${phaseInfo.totalHours.toFixed(0)}h</div><div class="label">Total RTI</div></div>
      <div class="stat-card"><div class="num">Phase ${phaseInfo.phase}</div><div class="label">${phaseInfo.label}</div></div>
      <div class="stat-card"><div class="num">${stats.pct}%</div><div class="label">Complete</div></div>
    </div>
    <div style="display:flex;gap:4px;margin-bottom:16px">${phaseDots}</div>
    <div style="font-size:13px;color:#6b7280;display:grid;grid-template-columns:1fr 1fr;gap:4px">
      <div>CAET RTI: <strong>${advHours.toFixed(1)}h</strong></div>
      <div>OJT Hours: <strong>${ojtHours.toFixed(1)}h</strong></div>
      <div>Written Exam: <strong>${cd.written_passed ? '✅ Passed' : '⬜ Not yet'}</strong></div>
      <div>Oral Board: <strong>${cd.oral_passed ? '✅ Passed' : '⬜ Not yet'}</strong></div>
    </div>
  </div>

  <div class="section">
    <h2>CAET Advanced Competencies (PQS)</h2>
    <table><thead><tr><th>Section</th><th style="text-align:center">Tasks</th><th style="text-align:center">RTI Hours</th><th style="text-align:center">Status</th></tr></thead>
    <tbody>${sectionRows}</tbody></table>
  </div>

  <div class="section">
    <h2>Apprenticeship OJT Competencies</h2>
    <table><thead><tr><th>Section</th><th style="text-align:center">Hours</th><th style="text-align:center">Status</th></tr></thead>
    <tbody>${ojtRows}</tbody></table>
  </div>

  ${galleryHTML ? `<div class="section page-break"><h2>Work Portfolio</h2>${galleryHTML}</div>` : ''}

  ${endorsement ? `<div class="section">
    <h2>Supervisor Endorsement</h2>
    <div class="endorsement">
      <div class="quote">"${endorsement.text}"</div>
      <div class="author">— ${endorsement.author} · ${endorsement.date}</div>
    </div>
  </div>` : ''}

  <div class="section">
    <h2>CAET Credentials</h2>
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;font-size:13px">
      <div style="padding:12px;border:1px solid #e5e7eb;border-radius:8px;text-align:center">
        <div style="font-size:20px;margin-bottom:4px">📋</div>
        <div style="font-weight:600">CAET Base</div>
        <div style="color:#6b7280;font-size:11px">Prerequisite</div>
      </div>
      <div style="padding:12px;border:2px solid ${cd.oral_passed ? '#22c55e' : '#e5e7eb'};border-radius:8px;text-align:center;background:${cd.oral_passed ? '#f0fdf4' : '#fff'}">
        <div style="font-size:20px;margin-bottom:4px">${cd.oral_passed ? '✅' : '⬜'}</div>
        <div style="font-weight:600">CAET Advanced</div>
        <div style="color:#6b7280;font-size:11px">${cd.oral_passed ? 'Achieved' : 'In Progress'}</div>
      </div>
      <div style="padding:12px;border:1px solid #e5e7eb;border-radius:8px;text-align:center">
        <div style="font-size:20px;margin-bottom:4px">⬜</div>
        <div style="font-weight:600">CAET Pro</div>
        <div style="color:#6b7280;font-size:11px">Future</div>
      </div>
    </div>
  </div>

  <div class="footer">
    <p>This portfolio was generated from the CAET Advanced Tracker — a product of AEA (Aircraft Electronics Association).</p>
    <p>Verify credentials at aea.net · Document generated ${new Date().toISOString().slice(0, 10)}</p>
  </div>
</div></body></html>`;

  const w = window.open('', '_blank');
  w.document.write(html);
  w.document.close();
}

// ============================================================
// ORAL BOARD REQUEST WORKFLOW
// ============================================================
function requestOralBoard(pid) {
  if (!STATE.boardRequests) STATE.boardRequests = [];
  // Check for existing active request
  const existing = STATE.boardRequests.find(r => r.candidateId === pid && ['pending_supervisor', 'endorsed'].includes(r.status));
  if (existing) { toast('You already have an active board request.'); return; }

  const user = STATE.people.find(p => p.id === pid);
  const supervisor = STATE.people.find(p => p.role === 'supervisor');
  const stats = taskStats(pid);
  const rtiTotal = getTotalRtiHours(pid);

  const request = {
    id: 'br_' + Date.now(),
    candidateId: pid,
    candidateName: user?.name || pid,
    status: 'pending_supervisor',
    submittedDate: new Date().toISOString().slice(0, 10),
    supervisorId: supervisor?.id || 's1',
    supervisorEndorsement: null,
    rejectionNotes: null,
    summarySnapshot: {
      pqs: { signed: stats.signed, total: stats.total, pct: stats.pct },
      rtiHours: rtiTotal,
      portfolioItems: PORTFOLIO_ITEMS.map(i => {
        const f = ((STATE.portfolio[pid] || {}).items || {})[i.key];
        return { key: i.key, label: i.label, fileName: f?.fileName || null, uploadDate: f?.uploadDate || null, fileType: f?.fileType || null };
      }),
      writtenExam: (STATE.certDates || {})[pid]?.written_date || null,
      shopName: STATE.shopName
    }
  };
  STATE.boardRequests.push(request);

  // Notify supervisor
  if (!STATE.notifications[supervisor?.id]) STATE.notifications[supervisor.id] = [];
  STATE.notifications[supervisor.id].unshift({
    id: 'n_br_' + Date.now(),
    msg: `🎯 ${user.name} has requested oral board endorsement. Review their portfolio and approve or return for revisions.`,
    time: request.submittedDate,
    read: false,
    type: 'action',
    action: 'endorse_board',
    requestId: request.id
  });

  saveState(); render();
  toast('✅ Oral board request submitted! Your supervisor has been notified.');
}

function endorseBoardRequest(requestId) {
  const overlay = document.getElementById('modal-overlay');
  const req = (STATE.boardRequests || []).find(r => r.id === requestId);
  if (!req) return;

  overlay.innerHTML = `<div class="modal" style="max-width:600px">
    <h3 style="margin-bottom:0.5rem">🎯 Endorse Board Request</h3>
    <p style="color:var(--text-muted);font-size:0.85rem;margin-bottom:1rem">Review ${req.candidateName}'s portfolio and decide whether to endorse their oral board application.</p>

    <div class="card" style="margin-bottom:1rem;padding:0.75rem">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.5rem;font-size:0.85rem">
        <div><strong>PQS:</strong> ${req.summarySnapshot.pqs.signed}/${req.summarySnapshot.pqs.total} (${req.summarySnapshot.pqs.pct}%)</div>
        <div><strong>RTI:</strong> ${req.summarySnapshot.rtiHours.toFixed(1)}h / ${RTI_TOTAL_REQUIRED}h</div>
        <div><strong>Written Exam:</strong> ${req.summarySnapshot.writtenExam || 'N/A'}</div>
        <div><strong>Evidence:</strong> ${req.summarySnapshot.portfolioItems.filter(i => i.fileName).length}/${PORTFOLIO_ITEMS.length} files</div>
      </div>
    </div>

    <div style="margin-bottom:1rem">
      <label style="font-size:0.82rem;font-weight:600;display:block;margin-bottom:0.3rem">Endorsement Notes (optional)</label>
      <textarea id="endorse-notes" rows="3" style="width:100%;background:var(--bg);color:var(--text);border:1px solid rgba(255,255,255,0.1);border-radius:6px;padding:0.5rem;font-size:0.85rem" placeholder="Any notes for the committee..."></textarea>
    </div>

    <div style="display:flex;gap:0.5rem;justify-content:flex-end">
      <button class="btn btn-outline" onclick="hideModal()">Cancel</button>
      <button class="btn btn-danger" onclick="rejectBoardRequest('${requestId}')">Return for Revisions</button>
      <button class="btn btn-gold" onclick="approveBoardRequest('${requestId}')">✅ Endorse</button>
    </div>
  </div>`;
  overlay.classList.add('show');
}

function approveBoardRequest(requestId) {
  const req = (STATE.boardRequests || []).find(r => r.id === requestId);
  if (!req) return;
  const notes = document.getElementById('endorse-notes')?.value || '';
  const today = new Date().toISOString().slice(0, 10);

  req.status = 'endorsed';
  req.supervisorEndorsement = { approved: true, date: today, notes };

  // Notify admin and committee
  const admins = STATE.people.filter(p => p.role === 'admin');
  const committee = STATE.people.filter(p => p.role === 'committee');
  const allNotify = [...admins, ...committee];
  allNotify.forEach(person => {
    if (!STATE.notifications[person.id]) STATE.notifications[person.id] = [];
    STATE.notifications[person.id].unshift({
      id: 'n_endorsed_' + Date.now() + '_' + person.id,
      msg: `🎓 ${req.candidateName} has been endorsed for oral board by their supervisor. Portfolio is ready for committee review.`,
      time: today, read: false, type: 'success'
    });
  });

  // Notify candidate
  if (!STATE.notifications[req.candidateId]) STATE.notifications[req.candidateId] = [];
  STATE.notifications[req.candidateId].unshift({
    id: 'n_endorsed_app_' + Date.now(),
    msg: `✅ Your supervisor has endorsed your oral board application! The committee has been notified and will schedule your board.`,
    time: today, read: false, type: 'success'
  });

  hideModal(); saveState(); render();
  toast('✅ Board request endorsed — committee notified.');
}

function rejectBoardRequest(requestId) {
  const req = (STATE.boardRequests || []).find(r => r.id === requestId);
  if (!req) return;
  const notes = document.getElementById('endorse-notes')?.value;
  if (!notes || notes.trim().length < 10) {
    toast('Please provide feedback (at least 10 characters) explaining what needs to be addressed.', 'warning');
    return;
  }
  const today = new Date().toISOString().slice(0, 10);

  req.status = 'rejected';
  req.rejectionNotes = notes;
  req.supervisorEndorsement = { approved: false, date: today, notes };

  // Notify candidate
  if (!STATE.notifications[req.candidateId]) STATE.notifications[req.candidateId] = [];
  STATE.notifications[req.candidateId].unshift({
    id: 'n_rejected_' + Date.now(),
    msg: `⚠️ Your oral board request was returned for revisions. See your supervisor's feedback in your Portfolio tab.`,
    time: today, read: false, type: 'warning'
  });

  hideModal(); saveState(); render();
  toast('Board request returned with feedback.');
}

// ---- PORTFOLIO SUMMARY ----
function generatePortfolioSummary(pid) {
  const user = STATE.people.find(p => p.id === pid);
  const stats = taskStats(pid);
  const rtiTotal = getTotalRtiHours(pid);
  const cd = (STATE.certDates || {})[pid] || {};
  const pf = STATE.portfolio[pid] || {};
  const items = pf.items || {};
  const supervisor = STATE.people.find(p => p.role === 'supervisor');
  const existingReq = (STATE.boardRequests || []).find(r => r.candidateId === pid && ['pending_supervisor', 'endorsed'].includes(r.status));

  const sectionRows = PQS.map(s => {
    const tasks = s.tasks || [];
    const done = tasks.filter(t => {
      const td = (STATE.taskData[pid] || {})[t.id]; return td && td.status === 'signed_off';
    }).length;
    const rtiH = getRtiHours(pid, s.num);
    const rtiReq = RTI_REQUIRED_HOURS[s.num] || 0;
    return `<tr>
      <td>Section ${s.num}</td><td>${s.title}</td>
      <td style="text-align:center">${done}/${tasks.length}</td>
      <td style="text-align:center">${rtiH.toFixed(1)}h / ${rtiReq}h</td>
    </tr>`;
  }).join('');

  const evidenceRows = PORTFOLIO_ITEMS.map(i => {
    const f = items[i.key];
    const hasFile = portfolioHasFile(f) && typeof f === 'object';
    return `<tr>
      <td>${i.label}</td><td>${i.desc}</td>
      <td style="text-align:center">${hasFile ? '✅' : '❌'}</td>
      <td>${hasFile ? f.fileName : '—'}</td>
      <td>${hasFile ? f.uploadDate : '—'}</td>
    </tr>`;
  }).join('');

  const html = `<!DOCTYPE html><html><head>
    <meta charset="UTF-8"><title>Portfolio Summary — ${user?.name || pid}</title>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap');
      * { margin:0; padding:0; box-sizing:border-box }
      body { font-family:'Inter',sans-serif; padding:2rem; color:#1a1a2e; max-width:900px; margin:0 auto; font-size:14px }
      h1 { font-size:1.6rem; margin-bottom:0.2rem; color:#0a0a23 }
      h2 { font-size:1.1rem; margin:1.5rem 0 0.5rem; padding-bottom:0.3rem; border-bottom:2px solid #e8b400; color:#0a0a23 }
      .subtitle { color:#666; font-size:0.85rem; margin-bottom:1rem }
      .header-grid { display:grid; grid-template-columns:1fr 1fr; gap:1rem; margin:1rem 0; padding:1rem; background:#f8f9fa; border-radius:8px }
      .header-grid div { font-size:0.85rem }
      .header-grid strong { color:#0a0a23 }
      table { width:100%; border-collapse:collapse; margin:0.5rem 0 }
      th { background:#0a0a23; color:#fff; padding:0.5rem; text-align:left; font-size:0.78rem; text-transform:uppercase }
      td { padding:0.4rem 0.5rem; border-bottom:1px solid #eee; font-size:0.82rem }
      tr:nth-child(even) { background:#f8f9fa }
      .badge { display:inline-block; padding:0.15rem 0.5rem; border-radius:4px; font-size:0.75rem; font-weight:600 }
      .badge-pass { background:#d4edda; color:#155724 }
      .badge-fail { background:#f8d7da; color:#721c24 }
      .stat-box { display:inline-block; padding:0.5rem 1rem; background:#f0f0f0; border-radius:6px; margin-right:0.5rem; font-size:0.85rem }
      .stat-box strong { font-size:1.2rem; color:#0a0a23 }
      .endorsement { padding:1rem; background:#d4edda; border-radius:8px; margin:1rem 0 }
      .footer { margin-top:2rem; padding-top:1rem; border-top:1px solid #ddd; font-size:0.75rem; color:#888; text-align:center }
      @media print { body { padding:0.5rem } .no-print { display:none } }
    </style>
  </head><body>
    <div style="display:flex;justify-content:space-between;align-items:flex-start">
      <div><h1>CAET Advanced — Portfolio Summary</h1>
        <div class="subtitle">Oral Board Application Packet</div></div>
      <div class="no-print"><button onclick="window.print()" style="padding:0.5rem 1rem;background:#e8b400;border:none;border-radius:6px;font-weight:600;cursor:pointer">🖨 Print / Save PDF</button></div>
    </div>

    <div class="header-grid">
      <div><strong>Candidate:</strong> ${user?.name || pid}</div>
      <div><strong>Shop:</strong> ${STATE.shopName || 'N/A'}</div>
      <div><strong>Supervisor:</strong> ${supervisor?.name || 'N/A'}</div>
      <div><strong>Date:</strong> ${new Date().toISOString().slice(0, 10)}</div>
      <div><strong>Written Exam:</strong> ${cd.written_passed ? '<span class="badge badge-pass">Passed</span> ' + cd.written_date : '<span class="badge badge-fail">Not Passed</span>'}</div>
      <div><strong>PQS Completion:</strong> ${stats.signed}/${stats.total} (${stats.pct}%)</div>
    </div>

    <div style="margin:1rem 0">
      <div class="stat-box"><strong>${stats.signed}</strong> / ${stats.total}<br>PQS Tasks</div>
      <div class="stat-box"><strong>${rtiTotal.toFixed(1)}h</strong> / ${RTI_TOTAL_REQUIRED}h<br>RTI Hours</div>
      <div class="stat-box"><strong>${PORTFOLIO_ITEMS.filter(i => portfolioHasFile(items[i.key]) && typeof items[i.key] === 'object').length}</strong> / ${PORTFOLIO_ITEMS.length}<br>Evidence Files</div>
    </div>

    ${existingReq?.supervisorEndorsement?.approved ? `<div class="endorsement">
      <strong>✅ Supervisor Endorsement</strong><br>
      Endorsed by ${supervisor?.name || 'Supervisor'} on ${existingReq.supervisorEndorsement.date}
      ${existingReq.supervisorEndorsement.notes ? '<br><em>Notes: ' + existingReq.supervisorEndorsement.notes + '</em>' : ''}
    </div>` : ''}

    <h2>PQS Section Breakdown</h2>
    <table><thead><tr><th>Section</th><th>Title</th><th>Tasks</th><th>RTI Hours</th></tr></thead>
    <tbody>${sectionRows}</tbody></table>

    <h2>Evidence Manifest</h2>
    <table><thead><tr><th>Item</th><th>Description</th><th>Status</th><th>Filename</th><th>Upload Date</th></tr></thead>
    <tbody>${evidenceRows}</tbody></table>

    <div class="footer">
      CAET Advanced Apprenticeship Program — AEA<br>
      Generated ${new Date().toLocaleString()} · This document can be printed or saved as PDF for submission.
    </div>
  </body></html>`;

  const w = window.open('', '_blank');
  w.document.write(html);
  w.document.close();
}

// ---- EVIDENCE ZIP DOWNLOAD ----
async function downloadEvidenceZip(pid) {
  const user = STATE.people.find(p => p.id === pid);
  const pf = STATE.portfolio[pid] || {};
  const items = pf.items || {};

  if (typeof JSZip === 'undefined') {
    toast('JSZip library not loaded. Cannot create ZIP file.', 'warning');
    return;
  }

  const zip = new JSZip();
  const cats = { certification: 'Certification_Documents', evidence: 'Work_Evidence', training_record: 'Training_Records' };
  let fileCount = 0;

  for (const item of PORTFOLIO_ITEMS) {
    const fileData = items[item.key];
    if (!portfolioHasFile(fileData) || typeof fileData !== 'object') continue;

    const folder = cats[item.category] || 'Other';
    const fileName = fileData.fileName || `${item.key}.dat`;

    if (fileData.data) {
      // Has base64 data — extract the binary
      const base64 = fileData.data.split(',')[1];
      if (base64) {
        zip.folder(folder).file(fileName, base64, { base64: true });
        fileCount++;
      }
    } else {
      // File object without data (demo mode) — add a placeholder text file
      zip.folder(folder).file(fileName + '.txt',
        `File: ${fileName}\nType: ${fileData.fileType || 'unknown'}\nSize: ${fileData.fileSize ? (fileData.fileSize / 1024).toFixed(0) + ' KB' : 'unknown'}\nUploaded: ${fileData.uploadDate || 'unknown'}\n\nThis is a placeholder. In production, the actual file would be stored on the server.`
      );
      fileCount++;
    }
  }

  if (fileCount === 0) {
    toast('No evidence files to download.', 'warning');
    return;
  }

  // Add the portfolio summary as an HTML file
  zip.file('Portfolio_Summary.html', generatePortfolioSummaryHTML(pid));

  toast(`📦 Building ZIP with ${fileCount} files...`);
  try {
    const blob = await zip.generateAsync({ type: 'blob' });
    const name = user?.name?.replace(/\s+/g, '_') || pid;
    const date = new Date().toISOString().slice(0, 10);
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `CAET_Portfolio_${name}_${date}.zip`;
    a.click();
    URL.revokeObjectURL(a.href);
    toast(`✅ Downloaded CAET_Portfolio_${name}_${date}.zip`);
  } catch (err) {
    toast('Error creating ZIP: ' + err.message, 'warning');
  }
}

// Helper: returns the summary HTML string (for embedding in ZIP)
function generatePortfolioSummaryHTML(pid) {
  const user = STATE.people.find(p => p.id === pid);
  const stats = taskStats(pid);
  const rtiTotal = getTotalRtiHours(pid);
  const cd = (STATE.certDates || {})[pid] || {};
  const pf = STATE.portfolio[pid] || {};
  const items = pf.items || {};
  const supervisor = STATE.people.find(p => p.role === 'supervisor');

  let rows = PQS.map(s => {
    const tasks = s.tasks || [];
    const done = tasks.filter(t => { const td = (STATE.taskData[pid] || {})[t.id]; return td && td.status === 'signed_off'; }).length;
    return `<tr><td>Sec ${s.num}: ${s.title}</td><td>${done}/${tasks.length}</td><td>${getRtiHours(pid, s.num).toFixed(1)}h / ${RTI_REQUIRED_HOURS[s.num] || 0}h</td></tr>`;
  }).join('');

  let eRows = PORTFOLIO_ITEMS.map(i => {
    const f = items[i.key];
    const has = portfolioHasFile(f) && typeof f === 'object';
    return `<tr><td>${i.label}</td><td>${has ? '✅ ' + f.fileName : '❌ Missing'}</td><td>${has ? f.uploadDate : '—'}</td></tr>`;
  }).join('');

  return `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Portfolio Summary — ${user?.name}</title>
    <style>body{font-family:sans-serif;padding:2rem;max-width:800px;margin:auto}h1{color:#0a0a23;margin-bottom:0.3rem}
    h2{border-bottom:2px solid #e8b400;padding-bottom:0.3rem;margin-top:1.5rem}
    table{width:100%;border-collapse:collapse;margin:0.5rem 0}th{background:#0a0a23;color:#fff;padding:0.4rem;text-align:left;font-size:0.8rem}
    td{padding:0.3rem 0.4rem;border-bottom:1px solid #eee;font-size:0.85rem}tr:nth-child(even){background:#f8f9fa}</style>
  </head><body>
    <h1>CAET Advanced — Portfolio Summary</h1>
    <p>Candidate: <strong>${user?.name}</strong> · Shop: ${STATE.shopName} · Supervisor: ${supervisor?.name} · Date: ${new Date().toISOString().slice(0, 10)}</p>
    <p>PQS: ${stats.signed}/${stats.total} · RTI: ${rtiTotal.toFixed(1)}h / ${RTI_TOTAL_REQUIRED}h · Written: ${cd.written_passed ? 'Passed ' + cd.written_date : 'Not Passed'}</p>
    <h2>PQS Sections</h2><table><tr><th>Section</th><th>Tasks</th><th>RTI Hours</th></tr>${rows}</table>
    <h2>Evidence Files</h2><table><tr><th>Item</th><th>Status</th><th>Upload Date</th></tr>${eRows}</table>
    <p style="margin-top:2rem;font-size:0.8rem;color:#888">Generated ${new Date().toLocaleString()}</p>
  </body></html>`;
}

// ---- SUPERVISOR BOARD REQUEST HANDLER (from notifications) ----
function handleNotificationAction(notifId) {
  const user = currentUser;
  const notifs = STATE.notifications[user.id] || [];
  const notif = notifs.find(n => n.id === notifId);
  if (!notif || !notif.action) return;

  if (notif.action === 'endorse_board') {
    endorseBoardRequest(notif.requestId);
    notif.read = true;
    saveState();
  }
}
function openCertDateModal(pid, type) {
  const labels = { written: 'Written Exam', oral: 'Oral / Practical Exam', cert: 'CAET Certification Date' };
  const overlay = document.getElementById('modal-overlay');
  const cd = (STATE.certDates || {})[pid] || {};
  const curDate = cd[type + '_date'] || '';
  const showPassed = type !== 'cert';
  const curPassed = cd[type + '_passed'] || false;
  overlay.innerHTML = `<div class="modal">
    <h3>${labels[type]}</h3>
    <label>Date</label><input type="date" id="certDateInput" value="${curDate}">
    ${showPassed ? '<label style="margin-top:0.5rem"><input type="checkbox" id="certPassedInput" ' + (curPassed ? 'checked' : '') + ' style="margin-right:0.5rem">Passed</label>' : ''}
    <div class="modal-actions"><button class="btn btn-outline" onclick="hideModal()">Cancel</button>
    <button class="btn btn-gold" onclick="saveCertDate('${pid}','${type}')">Save</button></div></div>`;
  overlay.classList.add('show')
}
function saveCertDate(pid, type) {
  if (!STATE.certDates) STATE.certDates = {};
  if (!STATE.certDates[pid]) STATE.certDates[pid] = { written_date: null, written_passed: false, oral_date: null, oral_passed: false, cert_date: null };
  const dateVal = document.getElementById('certDateInput').value;
  STATE.certDates[pid][type + '_date'] = dateVal || null;
  if (type !== 'cert') { const passed = document.getElementById('certPassedInput').checked; STATE.certDates[pid][type + '_passed'] = passed }
  saveState(); hideModal(); render(); toast('Certification date updated')
}

// ============================================================
// SUPERVISOR DASHBOARD
// ============================================================
function renderSupervisorDash() {
  const u = currentUser;
  if (currentTab === 'apprentices') return renderSupApprentices(u);
  if (currentTab === 'pending') return renderSupPending(u);
  if (currentTab === 'sup_training') return renderSupTraining(u);
  return ''
}

// ---- SUP APPRENTICES TAB ----
let supDetailId = null;
function renderSupApprentices(u) {
  if (supDetailId) return renderSupApprenticeDetail(supDetailId);
  const apprentices = getApprentices();
  let rows = apprentices.map(a => {
    const s = taskStats(a.id); const pending = s.requested;
    return `<tr style="cursor:pointer" onclick="supDetailId='${a.id}';render()">
      <td><strong style="color:var(--text)">${a.name}</strong></td>
      <td><div class="progress-bar" style="width:90px;display:inline-block;vertical-align:middle"><div class="fill fill-gold" style="width:${s.pct}%"></div></div> ${s.signed}/${s.total}</td>
      <td style="color:var(--blue);font-weight:600">${pending}</td>
      <td style="color:var(--red);font-weight:600">${s.needsWork}</td>
      <td style="color:var(--green)">${s.pct}%</td>
    </tr>`
  }).join('');

  return `<div class="app-bg"></div><div class="dashboard fade-in">
    <div class="dash-header"><h2>👥 My Apprentices</h2><div class="dash-sub">Click an apprentice to view their tasks and sign off</div></div>
    <div class="card overflow-x"><table class="data-table"><thead><tr><th>Apprentice</th><th>Progress</th><th>Pending</th><th>Rework</th><th>%</th></tr></thead><tbody>${rows}</tbody></table></div></div>`
}

function renderSupApprenticeDetail(appId) {
  const app = STATE.people.find(p => p.id === appId); if (!app) return '';
  const stats = taskStats(appId); const td = STATE.taskData[appId] || {};
  const rtiTotal = getTotalRtiHours(appId);
  const pendingRti = ((STATE.rtiLog || {})[appId] || []).filter(e => !e.approved);

  // Pending RTI section
  let rtiPendingHTML = '';
  if (pendingRti.length) {
    rtiPendingHTML = `<div class="card" style="margin-bottom:1rem;border-left:3px solid var(--gold)">
      <h3 style="margin-bottom:0.5rem">📚 Pending RTI Entries (${pendingRti.length})</h3>
      ${pendingRti.map(e => {
      const sec = PQS.find(s => s.num === e.secNum);
      return `<div class="rti-review-item">
          <div><strong>${e.hours}h</strong> · Section ${e.secNum}: ${sec ? sec.title : ''} · ${e.date}</div>
          <div style="font-size:0.82rem;color:var(--text-muted);margin:0.2rem 0">${e.desc}</div>
          <button class="btn btn-sm btn-success" onclick="approveRti('${appId}','${e.id}')">✓ Approve</button>
        </div>`;
    }).join('')}
    </div>`;
  }

  let sectionsHTML = '';
  PQS.forEach(sec => {
    const ss = secStats(appId, sec.num); const isComplete = ss.done === ss.total;
    const rtiHours = getRtiHours(appId, sec.num);
    let tasksRows = sec.tasks.map(t => {
      const ts = td[t.id] || { status: 'not_started' };
      let actionHTML = '';
      if (ts.status === 'requested') {
        actionHTML = `<button class="btn btn-sm btn-success" onclick="openSignoffModal('${appId}','${t.id}','${app.name}')">✓ Sign Off</button>
        <button class="btn btn-sm btn-danger" onclick="openRejectModal('${appId}','${t.id}','${app.name}')">✗ Reject</button>`;
      }
      const commentsHTML = ts.comments ? `<div class="feedback-card"><div class="fb-from">${app.name} · ${ts.date || ''}</div><div class="fb-msg">${ts.comments}</div></div>` : '';
      const feedbackHTML = ts.feedback && ts.status !== 'requested' ? `<div class="feedback-card ${ts.status === 'signed_off' ? 'approved' : ''}"><div class="fb-from">${ts.evaluator || 'You'} · ${ts.date || ''}</div><div class="fb-msg">${ts.feedback}</div></div>` : '';
      return `<tr><td class="td-task">${t.id}</td><td class="td-desc">${t.d}${commentsHTML}${feedbackHTML}</td><td>${statusBadge(ts.status)}</td><td>${actionHTML}</td></tr>`
    }).join('');

    const hasRequested = sec.tasks.some(t => (td[t.id] || {}).status === 'requested');
    sectionsHTML += `<div class="section-card ${isComplete ? 'sec-complete' : ''} ${hasRequested ? 'open' : ''}" id="sec-${sec.num}">
      <div class="sec-header" onclick="this.parentElement.classList.toggle('open')">
        <h4>${isComplete ? '✓ ' : ''}Section ${sec.num}: ${sec.title}</h4>
        <div class="sec-meta">${hasRequested ? '<span class="badge badge-requested">Pending</span>' : ''}<span class="count">${ss.done}/${ss.total}</span> <span class="count" style="font-size:0.72rem;color:var(--text-muted)">RTI: ${rtiHours.toFixed(1)}h</span>
        <div class="progress-bar"><div class="fill ${isComplete ? 'fill-green' : 'fill-gold'}" style="width:${ss.pct}%"></div></div>
        <span class="chevron">▼</span></div>
      </div>
      <div class="sec-body"><div class="overflow-x"><table class="data-table"><thead><tr><th>Task</th><th>Description</th><th>Status</th><th>Action</th></tr></thead><tbody>${tasksRows}</tbody></table></div></div></div>`
  });

  return `<div class="app-bg"></div><div class="dashboard fade-in">
    <div class="flex-between" style="margin-bottom:1rem"><div>
      <h2 style="font-size:1.3rem">${app.name}</h2>
      <p style="color:var(--text-muted);font-size:0.82rem">${stats.signed}/${stats.total} signed off · ${stats.requested} pending · ${stats.needsWork} rework · ${rtiTotal.toFixed(1)}h RTI</p></div>
      <button class="btn btn-outline" onclick="supDetailId=null;render()">← Back to Roster</button></div>
    ${rtiPendingHTML}${sectionsHTML}</div>`
}

// ---- SUP PENDING TAB ----
function renderSupPending(u) {
  const apprentices = getApprentices(); const pending = [];
  apprentices.forEach(a => {
    const td = STATE.taskData[a.id] || {};
    PQS.forEach(sec => sec.tasks.forEach(t => { if ((td[t.id] || {}).status === 'requested') pending.push({ app: a, task: t, sec, data: td[t.id] }) }))
  });

  let rows = pending.map(p => `<tr>
    <td><strong style="color:var(--text)">${p.app.name}</strong></td>
    <td class="td-task">${p.task.id}</td><td class="td-desc">${p.task.d}</td>
    <td style="font-size:0.78rem">${p.data.date || '—'}</td>
    <td><button class="btn btn-sm btn-success" onclick="openSignoffModal('${p.app.id}','${p.task.id}','${p.app.name}')">✓ Sign Off</button>
    <button class="btn btn-sm btn-danger" onclick="openRejectModal('${p.app.id}','${p.task.id}','${p.app.name}')">✗ Reject</button></td>
  </tr>`).join('');

  return `<div class="app-bg"></div><div class="dashboard fade-in">
    <div class="dash-header"><h2>⏳ Pending Sign-off Requests</h2><div class="dash-sub">${pending.length} task${pending.length !== 1 ? 's' : ''} awaiting your review</div></div>
    ${pending.length ? `<div class="card overflow-x"><table class="data-table"><thead><tr><th>Apprentice</th><th>Task</th><th>Description</th><th>Submitted</th><th>Action</th></tr></thead><tbody>${rows}</tbody></table></div>`
      : '<div class="card"><p style="text-align:center;color:var(--text-muted);padding:2rem">All caught up! No pending sign-off requests. 🎉</p></div>'}</div>`
}

function openSignoffModal(appId, taskId, appName) {
  const td = STATE.taskData[appId] || {}; const ts = td[taskId] || {};
  const overlay = document.getElementById('modal-overlay');
  overlay.innerHTML = `<div class="modal">
    <h3>Sign Off Task</h3><p class="modal-sub">${appName} — Task ${taskId}</p>
    ${ts.comments ? `<div class="modal-detail"><strong>Apprentice Comments</strong><p style="margin-top:0.3rem;color:var(--text)">${ts.comments}</p></div>` : ''}
    <label>Your Feedback / Observations</label>
    <textarea id="signoffFeedback" placeholder="Describe how the apprentice demonstrated this competency…"></textarea>
    <div class="modal-actions"><button class="btn btn-outline" onclick="hideModal()">Cancel</button>
    <button class="btn btn-success" onclick="doSignoff('${appId}','${taskId}')">✓ Approve & Sign Off</button></div></div>`;
  overlay.classList.add('show')
}
function doSignoff(appId, taskId) {
  const feedback = document.getElementById('signoffFeedback').value || 'Competency demonstrated satisfactorily.';
  STATE.taskData[appId][taskId] = { status: 'signed_off', date: new Date().toISOString().slice(0, 10), evaluator: currentUser.name, feedback };
  addNotif(appId, `${currentUser.name} signed off Task ${taskId} — great work! ✓`, 'success');
  saveState(); hideModal(); render(); toast('Task ' + taskId + ' signed off ✓')
}

function openRejectModal(appId, taskId, appName) {
  const overlay = document.getElementById('modal-overlay');
  overlay.innerHTML = `<div class="modal">
    <h3>Reject & Send for Rework</h3><p class="modal-sub">${appName} — Task ${taskId}</p>
    <label>Feedback (Required)</label>
    <textarea id="rejectFeedback" placeholder="Be specific: what needs to be corrected, what to practice, and what you expect to see next time…"></textarea>
    <div class="modal-actions"><button class="btn btn-outline" onclick="hideModal()">Cancel</button>
    <button class="btn btn-danger" onclick="doReject('${appId}','${taskId}')">Send for Rework</button></div></div>`;
  overlay.classList.add('show')
}
function doReject(appId, taskId) {
  const feedback = document.getElementById('rejectFeedback').value;
  if (!feedback.trim()) { toast('Please provide specific feedback', 'warning'); return }
  STATE.taskData[appId][taskId] = { status: 'needs_work', date: new Date().toISOString().slice(0, 10), evaluator: currentUser.name, feedback };
  addNotif(appId, `Task ${taskId} requires rework. See supervisor feedback.`, 'warning');
  saveState(); hideModal(); render(); toast('Task sent for rework', 'warning')
}

// ---- SUP TRAINING TAB ----
function renderSupTraining(u) {
  const results = STATE.supTrainingResults[u.id] || {};
  if (activeQuiz !== null) return renderQuizUI(activeQuiz, activeQuiz.type || 'supervisor', u.id);

  const customCourses = (STATE.customCourses || []).filter(c => c.targetRole === 'supervisor' || c.targetRole === 'both');
  const userCustomResults = STATE.customCourseResults?.[u.id] || {};
  const assignedList = STATE.assignedTraining[u.id] || [];

  // Group custom courses
  let assignedCoursesHtml = '';
  if (customCourses.length) {
    const assigned = customCourses.filter(c => assignedList.includes(c.id) && !userCustomResults[c.id]?.passed);
    const completed = customCourses.filter(c => userCustomResults[c.id]?.passed);
    const optional = customCourses.filter(c => !assignedList.includes(c.id) && !userCustomResults[c.id]?.passed);

    const renderCourseCard = (c, r) => {
      const passed = r?.passed;
      return `<div class="training-path-card ${passed ? 'passed' : ''}">
        <div class="tpc-header">
          <div class="tpc-icon" style="background:var(--card-bg);color:var(--gold)">📌</div>
          <h4>${c.title}</h4>
        </div>
        <p class="tpc-desc">${c.desc}</p>
        <div class="tpc-footer">
          <span class="tpc-status ${passed ? 'text-green' : assignedList.includes(c.id) ? 'text-orange' : 'text-dim'}">
            ${passed ? `✓ Passed (${r.score}%)` : assignedList.includes(c.id) ? 'Action Required' : 'Optional Module'}
          </span>
          <button class="btn btn-sm ${passed ? 'btn-outline' : 'btn-gold'}" onclick="startQuiz('${c.id}','custom')">${passed ? 'Retake' : 'Start Course'}</button>
        </div>
      </div>`;
    };

    if (assigned.length || optional.length || completed.length) {
      assignedCoursesHtml = `<div class="path-section">
        <h3>Shop Procedures & Compliance</h3>
        <p class="section-sub">Required procedural and safety training for your repair station.</p>
        <div class="training-grid">
          ${assigned.map(c => renderCourseCard(c, userCustomResults[c.id])).join('')}
          ${optional.map(c => renderCourseCard(c, userCustomResults[c.id])).join('')}
          ${completed.map(c => renderCourseCard(c, userCustomResults[c.id])).join('')}
        </div>
      </div>`;
    }
  }

  // Core Evaluator Modules Path
  let supCardsHtml = SUP_TRAINING.map((mod, index) => {
    const r = results[mod.id];
    const passed = r?.passed;

    return `<div class="training-path-card ${passed ? 'passed' : ''}">
      <div class="tpc-header">
        <div class="tpc-num ${passed ? 'bg-green' : 'bg-blue'}">${passed ? '✓' : index + 1}</div>
        <h4>${mod.title}</h4>
      </div>
      <p class="tpc-desc" style="flex:1">${mod.desc}</p>
      
      <div class="tpc-footer">
        <span class="tpc-status ${passed ? 'text-green' : 'text-dim'}">${passed ? `✓ Passed ${r.score}%` : 'Not Taken'}</span>
        <button class="btn btn-sm ${passed ? 'btn-outline' : 'btn-gold'}" onclick="startQuiz('${mod.id}','supervisor')">${passed ? 'Retake' : 'Study & Quiz'}</button>
      </div>
    </div>`;
  }).join('');

  const completedCount = SUP_TRAINING.filter(m => results[m.id]?.passed).length;
  const overallPct = Math.round((completedCount / SUP_TRAINING.length) * 100);

  return `<div class="app-bg"></div><div class="dashboard fade-in">
    <div class="dash-hero" style="border-left-color:var(--blue)">
      <div class="hero-content">
        <h2>Evaluator Training Path</h2>
        <p>Complete your required Part 145 evaluator training modules to maintain qualification. Review the legal and ethical responsibilities of certifying apprentice competency.</p>
      </div>
      <div class="hero-stats">
        ${progressRingSVG(overallPct, 120, completedCount, SUP_TRAINING.length)}
      </div>
    </div>

    ${assignedCoursesHtml}

    <div class="path-section">
      <h3>Core Evaluator Modules</h3>
      <p class="section-sub">Mandatory training for CAET PQS sign-off authority.</p>
      <div class="training-grid">
        ${supCardsHtml}
      </div>
    </div>
  </div>`;
}

// ============================================================
// ADMIN DASHBOARD
// ============================================================
function renderAdminDash() {
  if (currentTab === 'overview') return renderAdminOverview();
  if (currentTab === 'people') return renderAdminPeople();
  if (currentTab === 'admin_training') return renderAdminTraining();
  return ''
}

function renderAdminOverview() {
  const apprentices = getApprentices(); const sups = getSupervisors();
  const pipeline = { pqs: 0, portfolio: 0, oral_board: 0, certified: 0 };
  apprentices.forEach(a => {
    const cd = (STATE.certDates || {})[a.id] || {};
    if (cd.cert_date) { pipeline.certified++; return }
    const s = taskStats(a.id);
    if (s.pct < 100) { pipeline.pqs++; return }
    const pf = STATE.portfolio[a.id] || {}; const items = pf.items || {};
    if (PORTFOLIO_ITEMS.every(i => portfolioHasFile(items[i.key]))) pipeline.oral_board++; else pipeline.portfolio++
  });
  const maxP = Math.max(...Object.values(pipeline), 1);
  const avgPct = apprentices.length ? Math.round(apprentices.reduce((s, a) => s + taskStats(a.id).pct, 0) / apprentices.length) : 0;
  const funnelData = [{ l: 'PQS Tasks', c: pipeline.pqs, cl: 'var(--blue)' }, { l: 'Portfolio', c: pipeline.portfolio, cl: 'var(--gold)' }, { l: 'Oral Board', c: pipeline.oral_board, cl: 'var(--orange)' }, { l: 'Certified', c: pipeline.certified, cl: 'var(--green)' }];

  return `<div class="app-bg"></div><div class="dashboard fade-in">
    <div class="dash-header"><h2>📊 Program Overview</h2><div class="dash-sub">${STATE.shopName} — ${apprentices.length} apprentices, ${sups.length} supervisors</div></div>
    <div class="mini-stats">
      <div class="mini-stat"><div class="num" style="color:var(--gold)">${apprentices.length}</div><div class="label">Apprentices</div></div>
      <div class="mini-stat"><div class="num" style="color:var(--blue)">${sups.length}</div><div class="label">Supervisors</div></div>
      <div class="mini-stat"><div class="num" style="color:var(--green)">${pipeline.certified}</div><div class="label">Certified</div></div>
      <div class="mini-stat"><div class="num" style="color:var(--orange)">${avgPct}%</div><div class="label">Avg Progress</div></div>
    </div>
    <div class="card"><h3>Certification Pipeline</h3><div class="funnel">${funnelData.map(f => { const w = maxP > 0 ? Math.max(15, f.c / maxP * 100) : 15; return `<div class="funnel-row"><div class="funnel-label">${f.l}</div><div class="funnel-bar" style="width:${w}%;background:${f.cl}">${f.c}</div></div>` }).join('')}</div></div>
    <div class="card"><h3>All Apprentices</h3><div class="overflow-x"><table class="data-table"><thead><tr><th>Name</th><th>Progress</th><th>Pending</th><th>Supervisor</th></tr></thead><tbody>
    ${apprentices.map(a => {
    const s = taskStats(a.id); const sup = STATE.people.find(p => p.id === a.supervisorId);
    return `<tr><td><strong style="color:var(--text)">${a.name}</strong></td><td><div class="progress-bar" style="width:80px;display:inline-block;vertical-align:middle"><div class="fill fill-gold" style="width:${s.pct}%"></div></div> ${s.signed}/${s.total}</td><td style="color:var(--blue)">${s.requested}</td><td>${sup ? sup.name : '—'}</td></tr>`
  }).join('')}
    </tbody></table></div></div>
    <div style="margin-top:1rem;text-align:center">
      <button class="btn btn-outline" onclick="exportData()">💾 Download Backup</button>
      <label class="btn btn-outline" style="margin-left:0.5rem;cursor:pointer">📂 Import Backup<input type="file" accept=".json" onchange="importData(event)" style="display:none"></label>
      <button class="btn btn-outline" style="margin-left:0.5rem;border-color:var(--red);color:var(--red)" onclick="resetAll()">⚠ Reset All Data</button>
    </div></div>`
}

function renderAdminPeople() {
  const all = STATE.people;
  let rows = all.map(p => {
    const rl = { apprentice: 'Apprentice', supervisor: 'Evaluator', committee: 'Committee', admin: 'Admin' }[p.role] || p.role;
    let extra = '';
    if (p.role === 'apprentice') { const s = taskStats(p.id); extra = `${s.pct}% · ${s.signed}/${s.total} tasks` }
    else if (p.role === 'supervisor') { const r = STATE.supTrainingResults[p.id] || {}; const done = SUP_TRAINING.filter(m => r[m.id] && r[m.id].passed).length; extra = `${done}/${SUP_TRAINING.length} training modules` }
    const isCurrent = currentUser && currentUser.id === p.id;
    const deleteBtn = isCurrent ? '<span style="color:var(--text-muted);font-size:0.75rem">(you)</span>' : `<button class="btn btn-sm btn-outline" style="border-color:var(--red);color:var(--red)" onclick="removePerson('${p.id}','${p.name}')">✕ Remove</button>`;
    return `<tr><td><strong style="color:var(--text)">${p.name}</strong></td><td><span class="badge badge-${p.role === 'admin' ? 'signed' : p.role === 'supervisor' ? 'submitted' : 'progress'}">${rl}</span></td><td style="color:var(--text-muted)">${extra}</td><td>${deleteBtn}</td></tr>`
  }).join('');

  return `<div class="app-bg"></div><div class="dashboard fade-in">
    <div class="flex-between" style="margin-bottom:1rem"><h2 style="font-size:1.3rem">👥 People Management</h2>
    <button class="btn btn-gold" onclick="openAddPersonModal()">+ Add Person</button></div>
    <div class="card overflow-x"><table class="data-table"><thead><tr><th>Name</th><th>Role</th><th>Status</th><th></th></tr></thead><tbody>${rows}</tbody></table></div></div>`
}

let adminTrainingView = 'catalog';
function renderAdminTraining() {
  const apprentices = getApprentices(); const sups = getSupervisors();
  const customCourses = STATE.customCourses || [];

  // Sub-navigation
  const subTabs = [{ k: 'catalog', l: '📋 Course Catalog' }, { k: 'completion', l: '📊 Completion Matrix' }, { k: 'create', l: '✏️ Create Course' }, { k: 'manage_pqs', l: '🔧 Manage Tasks' }];
  const subTabsHTML = subTabs.map(t => `<button class="filter-btn ${adminTrainingView === t.k ? 'active' : ''}" onclick="adminTrainingView='${t.k}';render()">${t.l}</button>`).join('');

  let contentHTML = '';
  if (adminTrainingView === 'catalog') contentHTML = renderAdminCatalog(apprentices, sups, customCourses);
  else if (adminTrainingView === 'completion') contentHTML = renderAdminCompletion(apprentices, sups, customCourses);
  else if (adminTrainingView === 'create') contentHTML = renderAdminCreateCourse();
  else if (adminTrainingView === 'manage_pqs') contentHTML = renderAdminManagePQS();

  return `<div class="app-bg"></div><div class="dashboard fade-in">
    <div class="dash-header"><h2>📚 Training Management</h2><div class="dash-sub">View all courses, track completion, create and push training</div></div>
    <div class="filter-bar">${subTabsHTML}</div>
    ${contentHTML}</div>`
}

let managePQSProgram = 'advanced';
function renderAdminManagePQS() {
  if (!STATE.customSections) STATE.customSections = [];
  const programToggle = `<div style="display:flex;gap:0.5rem;margin-bottom:1rem;padding:0.25rem;background:var(--card-bg);border-radius:8px;border:1px solid var(--border)">
    <button class="btn btn-sm ${managePQSProgram === 'advanced' ? 'btn-gold' : 'btn-outline'}" onclick="managePQSProgram='advanced';render()" style="flex:1">CAET Advanced</button>
    <button class="btn btn-sm ${managePQSProgram === 'ojt' ? 'btn-gold' : 'btn-outline'}" onclick="managePQSProgram='ojt';render()" style="flex:1">Apprenticeship OJT</button>
  </div>`;

  const baseSections = managePQSProgram === 'advanced' ? PQS : OJT;
  const customSections = STATE.customSections.filter(s => s.program === managePQSProgram);

  let baseHTML = '<div class="card"><h3>Standard Sections (' + baseSections.length + ')</h3><p style="font-size:0.78rem;color:var(--text-muted);margin-bottom:0.8rem">These are the built-in sections. You can add tasks to them below.</p>';
  baseHTML += baseSections.map(sec => {
    const customTasks = (STATE.customTasks || {})[sec.num] || [];
    return `<div class="training-card" style="margin-bottom:0.5rem">
      <div class="tc-info"><h4>Section ${sec.num}: ${sec.title}</h4><p>${sec.tasks.length} standard tasks${customTasks.length ? ' + ' + customTasks.length + ' custom' : ''}</p></div>
      <div class="tc-status"><button class="btn btn-sm btn-outline" onclick="openAddTaskModal('${sec.num}','base')">+ Add Task</button></div></div>`
  }).join('') + '</div>';

  let customHTML = '<div class="card"><div class="flex-between" style="margin-bottom:0.5rem"><h3>Custom Categories (' + customSections.length + ')</h3><button class="btn btn-sm btn-gold" onclick="openAddCategoryModal()">+ Add Category</button></div>';
  if (customSections.length === 0) {
    customHTML += '<p style="color:var(--text-muted);font-size:0.85rem;">No custom categories added yet. Click "Add Category" to create one.</p>';
  } else {
    customHTML += customSections.map(sec => {
      return `<div class="training-card" style="margin-bottom:0.5rem">
        <div class="tc-info"><h4>Section ${sec.num}: ${sec.title}</h4><p>${sec.tasks.length} tasks · ${sec.objective}</p></div>
        <div class="tc-status" style="display:flex;gap:0.3rem">
          <button class="btn btn-sm btn-outline" onclick="openAddTaskModal('${sec.num}','custom')">+ Add Task</button>
          <button class="btn btn-sm btn-outline" style="border-color:var(--red);color:var(--red)" onclick="deleteCustomCategory('${sec.num}')">✕</button>
        </div></div>`
    }).join('');
  }
  customHTML += '</div>';

  return programToggle + baseHTML + customHTML;
}

function openAddCategoryModal() {
  const overlay = document.getElementById('modal-overlay');
  overlay.innerHTML = `<div class="modal">
    <h3>Add Custom Category</h3>
    <p style="font-size:0.82rem;color:var(--text-muted);margin-bottom:1rem">Adding to: ${managePQSProgram === 'advanced' ? 'CAET Advanced' : 'Apprenticeship OJT'}</p>
    <div class="login-field"><label>Category Title</label><input class="login-input" type="text" id="catTitle" placeholder="e.g. Shop-Specific Avionics"></div>
    <div class="login-field"><label>Objective</label><textarea class="login-input" id="catObjective" rows="2" placeholder="What this category covers..."></textarea></div>
    <div style="display:flex;gap:0.5rem;margin-top:1rem"><button class="btn btn-gold" onclick="saveCustomCategory()">Create Category</button><button class="btn btn-outline" onclick="hideModal()">Cancel</button></div>
  </div>`;
  overlay.classList.add('open');
}

function saveCustomCategory() {
  const title = document.getElementById('catTitle')?.value?.trim();
  const objective = document.getElementById('catObjective')?.value?.trim() || '';
  if (!title) { toast('Enter a category title', 'warning'); return }
  if (!STATE.customSections) STATE.customSections = [];
  const prefix = managePQSProgram === 'advanced' ? 'C' : 'CA';
  const num = prefix + (STATE.customSections.filter(s => s.program === managePQSProgram).length + 1);
  STATE.customSections.push({ num, title, objective, program: managePQSProgram, fundamentals: [], risks: [], tasks: [] });
  saveState(); hideModal(); toast('Category "' + title + '" created', 'success'); render();
}

function deleteCustomCategory(num) {
  const sec = (STATE.customSections || []).find(s => s.num === num);
  if (!sec) return;
  if (!confirm('Delete category "' + sec.title + '" and all its tasks? This cannot be undone.')) return;
  STATE.customSections = STATE.customSections.filter(s => s.num !== num);
  saveState(); toast('Category deleted', 'info'); render();
}

function openAddTaskModal(sectionNum, type) {
  const overlay = document.getElementById('modal-overlay');
  const sectionLabel = type === 'base'
    ? (managePQSProgram === 'advanced' ? PQS : OJT).find(s => String(s.num) === String(sectionNum))?.title || sectionNum
    : (STATE.customSections || []).find(s => s.num === sectionNum)?.title || sectionNum;
  overlay.innerHTML = `<div class="modal">
    <h3>Add Task to: ${sectionLabel}</h3>
    <div class="login-field"><label>Task Description</label><textarea class="login-input" id="taskDesc" rows="2" placeholder="What the technician needs to demonstrate..."></textarea></div>
    <div class="login-field"><label>Success Criteria</label><textarea class="login-input" id="taskCriteria" rows="2" placeholder="How to know they passed..."></textarea></div>
    <div style="display:flex;gap:0.5rem;margin-top:1rem"><button class="btn btn-gold" onclick="saveCustomTask('${sectionNum}','${type}')">Add Task</button><button class="btn btn-outline" onclick="hideModal()">Cancel</button></div>
  </div>`;
  overlay.classList.add('open');
}

function saveCustomTask(sectionNum, type) {
  const desc = document.getElementById('taskDesc')?.value?.trim();
  const criteria = document.getElementById('taskCriteria')?.value?.trim() || '';
  if (!desc) { toast('Enter a task description', 'warning'); return }
  if (type === 'custom') {
    const sec = (STATE.customSections || []).find(s => s.num === sectionNum);
    if (!sec) return;
    const id = sectionNum + '.' + (sec.tasks.length + 1);
    sec.tasks.push({ id, d: desc, s: criteria });
  } else {
    if (!STATE.customTasks) STATE.customTasks = {};
    if (!STATE.customTasks[sectionNum]) STATE.customTasks[sectionNum] = [];
    const existing = (managePQSProgram === 'advanced' ? PQS : OJT).find(s => String(s.num) === String(sectionNum));
    const totalTasks = (existing?.tasks?.length || 0) + STATE.customTasks[sectionNum].length;
    const id = sectionNum + '.x' + (STATE.customTasks[sectionNum].length + 1);
    STATE.customTasks[sectionNum].push({ id, d: desc, s: criteria });
  }
  saveState(); hideModal(); toast('Task added', 'success'); render();
}

function renderAdminCatalog(apprentices, sups, customCourses) {
  // PQS Sections (apprentice courses)
  let pqsHTML = '<div class="card"><h3>Apprentice PQS Training (13 Sections)</h3><p style="font-size:0.78rem;color:var(--text-muted);margin-bottom:0.8rem">Study material + 5-question quiz per section · Same training apprentices see in their Training tab</p>';
  pqsHTML += PQS.map(sec => {
    const qCount = (QUIZZES[sec.num] || []).length;
    return `<div class="training-card" style="margin-bottom:0.3rem">
      <div class="tc-info"><h4>Section ${sec.num}: ${sec.title}</h4><p>${sec.tasks.length} tasks · ${sec.fundamentals.length} fundamentals · ${sec.risks.length} risks · ${qCount} quiz questions</p></div>
      <div class="tc-status"><button class="btn btn-sm btn-outline" onclick="openPushCourseModal('sec_${sec.num}','Section ${sec.num}: ${sec.title.replace(/'/g, "\\'")}','apprentice')">Push →</button></div></div>`
  }).join('') + '</div>';

  // Supervisor modules
  let supHTML = '<div class="card"><h3>Evaluator Training Modules (4 Modules)</h3><p style="font-size:0.78rem;color:var(--text-muted);margin-bottom:0.8rem">In-depth evaluator training · Same content supervisors see in their My Training tab</p>';
  supHTML += SUP_TRAINING.map(mod => {
    return `<div class="training-card" style="margin-bottom:0.3rem">
      <div class="tc-info"><h4>${mod.title}</h4><p>${mod.desc}</p></div>
      <div class="tc-status"><button class="btn btn-sm btn-outline" onclick="openPushCourseModal('${mod.id}','${mod.title.replace(/'/g, "\\'")}','supervisor')">Push →</button></div></div>`
  }).join('') + '</div>';

  // Custom courses
  let customHTML = '<div class="card"><h3>Custom Shop Courses</h3><p style="font-size:0.78rem;color:var(--text-muted);margin-bottom:0.5rem">Courses created by admin for this shop</p>';
  if (customCourses.length) {
    customHTML += customCourses.map(c => {
      const roleLabel = { apprentice: 'Apprentices', supervisor: 'Supervisors', both: 'Everyone' }[c.targetRole] || c.targetRole;
      return `<div class="training-card" style="margin-bottom:0.3rem">
        <div class="tc-info"><h4>${c.title}</h4><p>${c.desc}</p>
        <div style="font-size:0.7rem;color:var(--text-dim);margin-top:0.2rem">For: ${roleLabel} · ${c.quiz.length} questions · Created ${c.createdDate}</div></div>
        <div class="tc-status"><button class="btn btn-sm btn-outline" onclick="openPushCourseModal('${c.id}','${c.title.replace(/'/g, "\\'")}','custom')">Push →</button>
        <br><button class="btn btn-sm btn-outline" style="margin-top:0.3rem;color:var(--red)" onclick="deleteCustomCourse('${c.id}')">Delete</button></div></div>`
    }).join('');
  } else {
    customHTML += '<p style="text-align:center;color:var(--text-dim);padding:1rem">No custom courses yet. Click "Create Course" to build one.</p>';
  }
  customHTML += '</div>';

  return pqsHTML + supHTML + customHTML;
}

function renderAdminCompletion(apprentices, sups, customCourses) {
  // Apprentice completion matrix
  let appHTML = '<div class="card"><h3>Apprentice Training Completion</h3><div class="overflow-x"><table class="data-table"><thead><tr><th>Apprentice</th>';
  PQS.forEach(s => { appHTML += `<th title="Section ${s.num}: ${s.title}" style="text-align:center;font-size:0.6rem;max-width:40px">${s.num}</th>` });
  const appCustom = customCourses.filter(c => c.targetRole === 'apprentice' || c.targetRole === 'both');
  appCustom.forEach(c => { appHTML += `<th title="${c.title}" style="text-align:center;font-size:0.6rem;max-width:50px;color:var(--purple)">${c.title.substring(0, 8)}…</th>` });
  appHTML += '</tr></thead><tbody>';
  apprentices.forEach(a => {
    const r = STATE.quizResults[a.id] || {};
    const cr = (STATE.customCourseResults || {})[a.id] || {};
    appHTML += `<tr><td><strong style="color:var(--text)">${a.name}</strong></td>`;
    PQS.forEach(s => {
      const res = r[s.num];
      if (res && res.passed) appHTML += `<td style="text-align:center" title="Passed ${res.score}% on ${res.date}"><span style="color:var(--green)">✓${res.score}</span></td>`;
      else if (res) appHTML += `<td style="text-align:center" title="Failed ${res.score}% on ${res.date}"><span style="color:var(--red)">✗${res.score}</span></td>`;
      else appHTML += '<td style="text-align:center;color:var(--text-dim)">—</td>';
    });
    appCustom.forEach(c => {
      const res = cr[c.id];
      if (res && res.passed) appHTML += `<td style="text-align:center"><span style="color:var(--green)">✓${res.score}</span></td>`;
      else appHTML += '<td style="text-align:center;color:var(--text-dim)">—</td>';
    });
    appHTML += '</tr>';
  });
  appHTML += '</tbody></table></div></div>';

  // Supervisor completion matrix
  let supHTML = '<div class="card"><h3>Supervisor Training Completion</h3><div class="overflow-x"><table class="data-table"><thead><tr><th>Supervisor</th>';
  SUP_TRAINING.forEach(m => { supHTML += `<th title="${m.title}" style="text-align:center;font-size:0.6rem;max-width:60px">${m.title.substring(0, 12)}…</th>` });
  const supCustom = customCourses.filter(c => c.targetRole === 'supervisor' || c.targetRole === 'both');
  supCustom.forEach(c => { supHTML += `<th title="${c.title}" style="text-align:center;font-size:0.6rem;max-width:50px;color:var(--purple)">${c.title.substring(0, 8)}…</th>` });
  supHTML += '</tr></thead><tbody>';
  sups.forEach(s => {
    const r = STATE.supTrainingResults[s.id] || {};
    const cr = (STATE.customCourseResults || {})[s.id] || {};
    supHTML += `<tr><td><strong style="color:var(--text)">${s.name}</strong></td>`;
    SUP_TRAINING.forEach(m => {
      const res = r[m.id];
      if (res && res.passed) supHTML += `<td style="text-align:center" title="Passed ${res.score}% on ${res.date}"><span style="color:var(--green)">✓${res.score}</span></td>`;
      else if (res) supHTML += `<td style="text-align:center"><span style="color:var(--red)">✗${res.score}</span></td>`;
      else supHTML += '<td style="text-align:center;color:var(--text-dim)">—</td>';
    });
    supCustom.forEach(c => {
      const res = cr[c.id];
      if (res && res.passed) supHTML += `<td style="text-align:center"><span style="color:var(--green)">✓${res.score}</span></td>`;
      else supHTML += '<td style="text-align:center;color:var(--text-dim)">—</td>';
    });
    supHTML += '</tr>';
  });
  supHTML += '</tbody></table></div></div>';

  return appHTML + supHTML;
}

let newCourseQuestions = [];
let newCourseBlocks = [];
function renderAdminCreateCourse() {
  // Content blocks preview
  const blockTypeLabels = { text: '📝 Text', callout: '💡 Callout', key: '✅ Key Takeaway', warning: '⚠️ Warning' };
  let blocksHTML = '';
  if (newCourseBlocks.length) {
    blocksHTML = newCourseBlocks.map((b, i) => {
      const typeLabel = blockTypeLabels[b.type] || b.type;
      let previewClass = 'block-body';
      if (b.type === 'callout') previewClass = 'lesson-callout';
      else if (b.type === 'key') previewClass = 'lesson-key';
      else if (b.type === 'warning') previewClass = 'lesson-warning';
      const bodyPreview = b.type === 'key'
        ? `<div class="key-label">✅ Key Takeaway</div>${b.body}`
        : b.type === 'callout'
          ? `<span class="callout-icon">💡</span>${b.body}`
          : b.body;
      return `<div class="content-block-preview">
        <div class="block-header"><span>${typeLabel} · Block ${i + 1}</span>
          <div class="block-actions">
            ${i > 0 ? `<button title="Move up" onclick="moveBlock(${i},-1)">↑</button>` : ''}
            ${i < newCourseBlocks.length - 1 ? `<button title="Move down" onclick="moveBlock(${i},1)">↓</button>` : ''}
            <button title="Delete" style="color:var(--red)" onclick="newCourseBlocks.splice(${i},1);render()">✕</button>
          </div>
        </div>
        <div class="${previewClass}" style="font-size:0.82rem">${bodyPreview}</div>
      </div>`
    }).join('');
  } else {
    blocksHTML = '<p style="text-align:center;color:var(--text-dim);padding:1rem;font-size:0.82rem">No content blocks yet. Add blocks below to build your lesson.</p>';
  }

  // Quiz questions preview
  let qHTML = newCourseQuestions.map((q, i) => `<div class="content-block-preview">
    <div class="block-header"><span>Question ${i + 1}</span>
      <div class="block-actions"><button style="color:var(--red)" onclick="newCourseQuestions.splice(${i},1);render()">✕</button></div>
    </div>
    <div class="block-body">
      <strong style="color:var(--text)">${q.q}</strong><br>
      <span style="font-size:0.75rem">${q.opts.map((o, oi) => (oi === q.a ? '<span style="color:var(--green)">✓ ' + o + '</span>' : o)).join(' · ')}</span>
    </div>
  </div>`).join('');

  return `
    <div class="author-section">
      <h3>📋 Course Details</h3>
      <p class="author-desc">Set the title, description, and who should take this course.</p>
      <label class="author-label">Course Title</label>
      <input type="text" class="author-input" id="ccTitle" placeholder="e.g. ESD Protection Best Practices">
      <label class="author-label">Short Description</label>
      <input type="text" class="author-input" id="ccDesc" placeholder="One-line description for the course catalog">
      <label class="author-label">Target Audience</label>
      <select class="author-select" id="ccRole">
        <option value="apprentice">Apprentices Only</option>
        <option value="supervisor">Supervisors Only</option>
        <option value="both" selected>Both Apprentices & Supervisors</option>
      </select>
    </div>

    <div class="author-section">
      <h3>📖 Lesson Content (${newCourseBlocks.length} blocks)</h3>
      <p class="author-desc">Build your lesson with content blocks. Each block renders as a styled section in the course — just like Articulate Rise.</p>
      ${blocksHTML}
      <div style="margin-top:0.8rem">
        <p class="author-label">Add a Block</p>
        <div class="block-type-btns">
          <button class="block-type-btn" onclick="openBlockModal('text')">📝 Text</button>
          <button class="block-type-btn" onclick="openBlockModal('callout')">💡 Callout</button>
          <button class="block-type-btn" onclick="openBlockModal('key')">✅ Key Takeaway</button>
          <button class="block-type-btn" onclick="openBlockModal('warning')">⚠️ Warning</button>
        </div>
      </div>
    </div>

    <div class="author-section">
      <h3>✏️ Quiz Questions (${newCourseQuestions.length})</h3>
      <p class="author-desc">Add quiz questions to test learner understanding. Option A is always the correct answer — options get auto-shuffled.</p>
      ${qHTML}
      <div style="background:var(--navy);border:1px solid var(--navy-border);border-radius:var(--radius);padding:1rem;margin-top:0.5rem">
        <label class="author-label">Question</label>
        <input type="text" class="author-input" id="newQ" placeholder="Ask a question about the study material">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.5rem">
          <div><label class="author-label" style="color:var(--green)">✓ Correct Answer</label>
          <input type="text" class="author-input" id="newQA" placeholder="The correct answer"></div>
          <div><label class="author-label">Wrong Answer B</label>
          <input type="text" class="author-input" id="newQB" placeholder="Plausible wrong answer"></div>
          <div><label class="author-label">Wrong Answer C</label>
          <input type="text" class="author-input" id="newQC" placeholder="Another wrong answer"></div>
          <div><label class="author-label">Wrong Answer D (optional)</label>
          <input type="text" class="author-input" id="newQD" placeholder="Optional 4th answer"></div>
        </div>
        <button class="btn btn-outline" style="margin-top:0.6rem" onclick="addCourseQuestion()">+ Add Question</button>
      </div>
    </div>

    <div style="text-align:center;padding:1rem 0">
      <button class="btn-course-nav btn-course-next" style="font-size:0.95rem;padding:0.7rem 2rem;display:inline-flex" onclick="saveCustomCourse()">💾 Save & Publish Course</button>
      <p style="font-size:0.72rem;color:var(--text-dim);margin-top:0.5rem">Requires at least 1 content block and 1 quiz question</p>
    </div>`
}

function openBlockModal(blockType) {
  const labels = { text: 'Text Block', callout: '💡 Callout Block', key: '✅ Key Takeaway Block', warning: '⚠️ Warning Block' };
  const placeholders = {
    text: 'Write the lesson content for this section...',
    callout: 'Write a tip, insight, or important note...',
    key: 'Summarize the key takeaway the learner should remember...',
    warning: 'Describe a safety concern, common mistake, or critical warning...'
  };
  const overlay = document.getElementById('modal-overlay');
  overlay.innerHTML = `<div class="modal">
    <h3>${labels[blockType]}</h3>
    <p class="modal-sub">This block will appear as a styled section in the lesson.</p>
    ${blockType === 'text' ? '<label>Block Title (optional)</label><input type="text" id="blockTitle" placeholder="e.g. Introduction, Background, etc.">' : ''}
    <label>Content</label>
    <textarea id="blockBody" rows="5" placeholder="${placeholders[blockType]}"></textarea>
    <div class="modal-actions">
      <button class="btn btn-outline" onclick="hideModal()">Cancel</button>
      <button class="btn btn-gold" onclick="addContentBlock('${blockType}')">Add Block</button>
    </div>
  </div>`;
  overlay.classList.add('show')
}

function addContentBlock(type) {
  const body = document.getElementById('blockBody').value.trim();
  if (!body) { toast('Enter block content', 'warning'); return }
  const block = { type, body };
  if (type === 'text') { const t = document.getElementById('blockTitle'); if (t && t.value.trim()) block.title = t.value.trim() }
  newCourseBlocks.push(block);
  hideModal(); render(); toast('Block added')
}

function moveBlock(i, dir) {
  const j = i + dir;
  if (j < 0 || j >= newCourseBlocks.length) return;
  [newCourseBlocks[i], newCourseBlocks[j]] = [newCourseBlocks[j], newCourseBlocks[i]];
  render()
}

function addCourseQuestion() {
  const q = document.getElementById('newQ').value.trim();
  const a = document.getElementById('newQA').value.trim();
  const b = document.getElementById('newQB').value.trim();
  const c = document.getElementById('newQC').value.trim();
  const d = document.getElementById('newQD').value.trim();
  if (!q || !a || !b || !c) { toast('Fill in question and at least 3 options', 'warning'); return }
  const opts = [a, b, c]; if (d) opts.push(d);
  const shuffled = opts.map((o, i) => ({ o, isCorrect: i === 0 })).sort(() => Math.random() - 0.5);
  newCourseQuestions.push({ q, opts: shuffled.map(s => s.o), a: shuffled.findIndex(s => s.isCorrect) });
  render();
  setTimeout(() => {
    ['newQ', 'newQA', 'newQB', 'newQC', 'newQD'].forEach(f => { const el = document.getElementById(f); if (el) el.value = '' });
  }, 50);
  toast('Question added')
}

function saveCustomCourse() {
  const title = document.getElementById('ccTitle').value.trim();
  const desc = document.getElementById('ccDesc').value.trim();
  const role = document.getElementById('ccRole').value;
  if (!title) { toast('Enter a course title', 'warning'); return }
  if (!desc) { toast('Enter a description', 'warning'); return }
  if (!newCourseBlocks.length) { toast('Add at least 1 content block', 'warning'); return }
  if (newCourseQuestions.length < 1) { toast('Add at least 1 quiz question', 'warning'); return }
  const id = 'custom_' + Date.now();
  if (!STATE.customCourses) STATE.customCourses = [];
  STATE.customCourses.push({
    id, title, desc, targetRole: role,
    content: [...newCourseBlocks],
    quiz: [...newCourseQuestions],
    createdDate: new Date().toISOString().slice(0, 10),
    createdBy: currentUser.name
  });
  newCourseQuestions = []; newCourseBlocks = [];
  saveState(); adminTrainingView = 'catalog'; render();
  toast('Course "' + title + '" created!', 'success')
}

function deleteCustomCourse(courseId) {
  if (!confirm('Delete this course? This cannot be undone.')) return;
  STATE.customCourses = (STATE.customCourses || []).filter(c => c.id !== courseId);
  saveState(); render(); toast('Course deleted', 'warning')
}

function openPushCourseModal(courseKey, courseTitle, courseType) {
  const overlay = document.getElementById('modal-overlay');
  // Determine who can receive this course
  let targets = [];
  if (courseType === 'apprentice') targets = getApprentices();
  else if (courseType === 'supervisor') targets = getSupervisors();
  else {
    // Custom course - check targetRole
    const course = (STATE.customCourses || []).find(c => c.id === courseKey);
    if (course) {
      if (course.targetRole === 'apprentice') targets = getApprentices();
      else if (course.targetRole === 'supervisor') targets = getSupervisors();
      else targets = [...getApprentices(), ...getSupervisors()];
    }
  }

  const checkboxes = targets.map(p => {
    const already = (STATE.assignedTraining[p.id] || []).includes(courseKey);
    return `<label style="display:flex;align-items:center;gap:0.75rem;padding:0.5rem 0;font-size:0.85rem;color:var(--text);cursor:pointer">
      <input type="checkbox" class="push-check" value="${p.id}" ${already ? 'checked disabled' : ''} style="flex-shrink:0;width:16px;height:16px">
      <span style="white-space:nowrap">${p.name}</span>
      <span style="color:var(--text-dim);font-size:0.72rem;white-space:nowrap">(${p.role})${already ? ' — already assigned' : ''}</span>
    </label>`
  }).join('');

  overlay.innerHTML = `<div class="modal">
    <h3>Push Training</h3>
    <p class="modal-sub">Assign "${courseTitle}" to specific people</p>
    <div style="max-height:250px;overflow-y:auto;margin:0.8rem 0;padding:0.75rem;background:var(--navy-mid);border-radius:8px">
      <label style="display:flex;align-items:center;gap:0.75rem;padding:0.5rem 0;font-size:0.82rem;color:var(--gold);font-weight:600;cursor:pointer;border-bottom:1px solid var(--navy-border);margin-bottom:0.25rem;padding-bottom:0.6rem">
        <input type="checkbox" id="pushSelectAll" onchange="document.querySelectorAll('.push-check:not(:disabled)').forEach(c=>c.checked=this.checked)" style="flex-shrink:0;width:16px;height:16px"> Select All
      </label>
      ${checkboxes}
    </div>
    <div class="modal-actions">
      <button class="btn btn-outline" onclick="hideModal()">Cancel</button>
      <button class="btn btn-gold" onclick="doPushCourse('${courseKey}')">📤 Assign Training</button>
    </div>
  </div>`;
  overlay.classList.add('show')
}

function doPushCourse(courseKey) {
  const checks = document.querySelectorAll('.push-check:checked:not(:disabled)');
  if (!checks.length) { toast('Select at least one person', 'warning'); return }
  let count = 0;
  checks.forEach(cb => {
    const pid = cb.value;
    if (!STATE.assignedTraining[pid]) STATE.assignedTraining[pid] = [];
    if (!STATE.assignedTraining[pid].includes(courseKey)) {
      STATE.assignedTraining[pid].push(courseKey);
      // Find course title for notification
      let title = courseKey;
      if (courseKey.startsWith('sec_')) { const n = parseInt(courseKey.replace('sec_', '')); const s = PQS.find(x => x.num === n); if (s) title = 'Section ' + n + ': ' + s.title }
      else if (courseKey.startsWith('sup')) { const m = SUP_TRAINING.find(x => x.id === courseKey); if (m) title = m.title }
      else { const c = (STATE.customCourses || []).find(x => x.id === courseKey); if (c) title = c.title }
      addNotif(pid, 'Training assigned: "' + title + '". Complete it in your Training tab.', 'info');
      count++;
    }
  });
  saveState(); hideModal(); render();
  toast(count + ' assignment' + (count !== 1 ? 's' : '') + ' created', 'success')
}

function openAddPersonModal() {
  const supOpts = getSupervisors().map(s => `<option value="${s.id}">${s.name}</option>`).join('');
  const overlay = document.getElementById('modal-overlay');
  overlay.innerHTML = `<div class="modal"><h3>Add Person</h3>
    <label>Full Name</label><input type="text" id="newName" placeholder="e.g. John Smith">
    <label>Role</label><select id="newRole"><option value="apprentice">Apprentice</option><option value="supervisor">Supervisor</option></select>
    <label>Assign Supervisor (for apprentices)</label><select id="newSup">${supOpts}</select>
    <div class="modal-actions"><button class="btn btn-outline" onclick="hideModal()">Cancel</button>
    <button class="btn btn-gold" onclick="doAddPerson()">Add</button></div></div>`;
  overlay.classList.add('show')
}
function doAddPerson() {
  const name = document.getElementById('newName').value.trim(); const role = document.getElementById('newRole').value;
  const supId = document.getElementById('newSup').value;
  if (!name) { toast('Enter a name', 'warning'); return }
  const id = (role === 'apprentice' ? 'a' : 's') + Date.now();
  const person = { id, name, role }; if (role === 'apprentice') { person.supervisorId = supId; STATE.taskData[id] = {}; STATE.portfolio[id] = { items: {} }; STATE.quizResults[id] = {}; if (!STATE.certDates) STATE.certDates = {}; STATE.certDates[id] = { written_date: null, written_passed: false, oral_date: null, oral_passed: false, cert_date: null } }
  else { STATE.supTrainingResults[id] = {} }
  STATE.people.push(person); STATE.notifications[id] = [];
  saveState(); hideModal(); render(); toast(name + ' added')
}

function exportData() {
  const blob = new Blob([JSON.stringify(STATE, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob); const a = document.createElement('a');
  a.href = url; a.download = 'caet-lms-export.json'; a.click(); URL.revokeObjectURL(url); toast('Data exported')
}

// ============================================================
// RTI HELPERS
// ============================================================
function getRtiHours(pid, secNum) {
  const log = (STATE.rtiLog || {})[pid] || [];
  return log.filter(e => e.secNum === secNum && e.approved).reduce((s, e) => s + e.hours, 0);
}
function getTotalRtiHours(pid) {
  const log = (STATE.rtiLog || {})[pid] || [];
  return log.filter(e => e.approved).reduce((s, e) => s + e.hours, 0);
}
function getTotalRtiByProgram(pid, program) {
  const log = (STATE.rtiLog || {})[pid] || [];
  if (program === 'ojt') return log.filter(e => typeof e.secNum === 'string' && e.approved).reduce((s, e) => s + e.hours, 0);
  if (program === 'advanced') return log.filter(e => typeof e.secNum === 'number' && e.approved).reduce((s, e) => s + e.hours, 0);
  return log.filter(e => e.approved).reduce((s, e) => s + e.hours, 0);
}
function getOjtHours(pid, secNum) {
  const log = (STATE.rtiLog || {})[pid] || [];
  return log.filter(e => e.secNum === secNum && e.approved).reduce((s, e) => s + e.hours, 0);
}
function getPendingRtiCount(pid) {
  const log = (STATE.rtiLog || {})[pid] || [];
  return log.filter(e => !e.approved).length;
}
function getApprenticePhase(pid) {
  const totalHours = getTotalRtiHours(pid);
  let cumulative = 0;
  for (const p of APPRENTICESHIP_PHASES) {
    cumulative += p.targetHours;
    if (totalHours < cumulative) {
      const hoursInPhase = totalHours - (cumulative - p.targetHours);
      return { phase: p.phase, label: p.label, desc: p.desc, status: 'active', hoursInPhase, targetHours: p.targetHours, totalHours, pctPhase: Math.round(hoursInPhase / p.targetHours * 100), pctTotal: Math.round(totalHours / PHASE_TOTAL_HOURS * 100) };
    }
  }
  return { phase: 4, label: 'Complete', desc: 'All phases completed', status: 'complete', hoursInPhase: APPRENTICESHIP_PHASES[3].targetHours, targetHours: APPRENTICESHIP_PHASES[3].targetHours, totalHours, pctPhase: 100, pctTotal: 100 };
}

function openRtiModal(secNum) {
  const isOjt = typeof secNum === 'string';
  const sec = isOjt ? OJT.find(s => s.num === secNum) : PQS.find(s => s.num == secNum);
  const programLabel = isOjt ? 'OJT' : 'CAET Advanced';
  const secLabel = isOjt ? secNum : `Section ${sec.num}`;
  
  // Build section selector for switching between PQS and OJT
  const pqsOptions = PQS.map(s => `<option value="${s.num}" ${s.num == secNum ? 'selected' : ''}>Sec ${s.num}: ${s.title}</option>`).join('');
  const ojtOptions = OJT.map(s => `<option value="${s.num}" ${s.num === secNum ? 'selected' : ''}>${s.num}: ${s.title}</option>`).join('');
  
  const overlay = document.getElementById('modal-overlay');
  overlay.innerHTML = `<div class="modal">
    <h3>📚 Log RTI Hours</h3>
    <label>Program</label>
    <select id="rtiProgram" onchange="document.getElementById('rtiSection').innerHTML = this.value==='ojt' ? \`${ojtOptions.replace(/`/g, '\`')}\` : \`${pqsOptions.replace(/`/g, '\`')}\`" style="margin-bottom:0.5rem">
      <option value="advanced" ${!isOjt ? 'selected' : ''}>CAET Advanced (PQS)</option>
      <option value="ojt" ${isOjt ? 'selected' : ''}>Apprenticeship OJT</option>
    </select>
    <label>Section</label>
    <select id="rtiSection">${isOjt ? ojtOptions : pqsOptions}</select>
    <label>Date</label><input type="date" id="rtiDate" value="${new Date().toISOString().slice(0, 10)}">
    <label>Hours</label><input type="number" id="rtiHours" min="0.5" max="24" step="0.5" placeholder="e.g. 2.5">
    <label>Description</label>
    <textarea id="rtiDesc" placeholder="What was studied or practiced? Include topics covered, materials used, instructor if applicable…"></textarea>
    <div class="modal-actions">
      <button class="btn btn-outline" onclick="hideModal()">Cancel</button>
      <button class="btn btn-gold" onclick="submitRtiFromModal()">📤 Submit RTI Entry</button>
    </div></div>`;
  overlay.classList.add('show');
}
function submitRtiFromModal() {
  const program = document.getElementById('rtiProgram').value;
  const secVal = document.getElementById('rtiSection').value;
  const secNum = program === 'ojt' ? secVal : parseInt(secVal);
  submitRti(secNum, program);
}
function submitRti(secNum, program) {
  const date = document.getElementById('rtiDate').value;
  const hours = parseFloat(document.getElementById('rtiHours').value);
  const desc = document.getElementById('rtiDesc').value;
  if (!hours || hours <= 0) { toast('Please enter hours', 'warning'); return; }
  if (!desc.trim()) { toast('Please describe what was studied', 'warning'); return; }
  if (!STATE.rtiLog) STATE.rtiLog = {};
  if (!STATE.rtiLog[currentUser.id]) STATE.rtiLog[currentUser.id] = [];
  const entry = { id: 'rti_' + Date.now(), secNum, hours, date, desc, approved: false };
  if (program === 'ojt') entry.program = 'ojt';
  STATE.rtiLog[currentUser.id].push(entry);
  const isOjt = typeof secNum === 'string';
  const secLabel = isOjt ? secNum : `Section ${secNum}`;
  const sup = STATE.people.find(p => p.id === currentUser.supervisorId);
  if (sup) addNotif(sup.id, `${currentUser.name} logged ${hours}h ${isOjt ? 'OJT' : 'RTI'} for ${secLabel}. Needs approval.`, 'info');
  saveState(); hideModal(); render(); toast('RTI entry submitted for approval');
}
function approveRti(pid, rtiId) {
  const log = (STATE.rtiLog || {})[pid] || [];
  const entry = log.find(e => e.id === rtiId);
  if (entry) { entry.approved = true; entry.approvedBy = currentUser.id; }
  addNotif(pid, `RTI entry approved by ${currentUser.name}.`, 'success');
  saveState(); render(); toast('RTI entry approved ✓');
}

// ============================================================
// COMMITTEE DASHBOARD
// ============================================================
function boardQueueCount() {
  // Count apprentices who are board-ready: 75/75 tasks + portfolio complete
  return getApprentices().filter(a => {
    const s = taskStats(a.id);
    if (s.pct < 100) return false;
    const pf = STATE.portfolio[a.id] || {}; const items = pf.items || {};
    if (!PORTFOLIO_ITEMS.every(i => portfolioHasFile(items[i.key]))) return false;
    // Not already boarded successfully
    const boards = (STATE.oralBoards || []).filter(b => b.candidateId === a.id && b.result === 'qualified');
    return boards.length === 0;
  }).length;
}

function renderCommitteeDash() {
  if (currentTab === 'queue') return renderCommitteeQueue();
  if (currentTab === 'scoring') return renderCommitteeScoring();
  if (currentTab === 'practical') return renderPracticalEval();
  if (currentTab === 'history') return renderCommitteeHistory();
  return '';
}

let activeBoardCandidate = null;

function renderCommitteeQueue() {
  const apprentices = getApprentices();
  const boardReady = [];
  const inProgress = [];

  apprentices.forEach(a => {
    const s = taskStats(a.id);
    const cd = (STATE.certDates || {})[a.id] || {};
    const pf = STATE.portfolio[a.id] || {}; const items = pf.items || {};
    const portfolioComplete = PORTFOLIO_ITEMS.every(i => portfolioHasFile(items[i.key]));
    const pastBoards = (STATE.oralBoards || []).filter(b => b.candidateId === a.id);
    const qualified = pastBoards.some(b => b.result === 'qualified');

    if (qualified) return; // Already certified

    if (s.pct === 100 && portfolioComplete && cd.written_passed) {
      boardReady.push({ person: a, stats: s, certDates: cd, endorser: STATE.people.find(p => p.id === a.supervisorId) });
    } else {
      inProgress.push({ person: a, stats: s, certDates: cd, portfolioComplete });
    }
  });

  let readyHTML = boardReady.length ? boardReady.map(r => `
    <div class="card oral-candidate-card">
      <div class="flex-between">
        <div>
          <h3 style="margin-bottom:0.2rem">${r.person.name}</h3>
          <p style="font-size:0.82rem;color:var(--text-muted)">${TOTAL_TASKS}/${TOTAL_TASKS} tasks · Portfolio complete · Written exam passed ${r.certDates.written_date || ''}</p>
          <p style="font-size:0.78rem;color:var(--text-muted);margin-top:0.2rem">Evaluator: ${r.endorser ? r.endorser.name : '—'} · RTI: ${getTotalRtiHours(r.person.id).toFixed(1)}h</p>
        </div>
        <div style="text-align:right">
          <span class="badge badge-signed" style="font-size:0.82rem">✓ Board Ready</span>
          <div style="margin-top:0.5rem"><button class="btn btn-gold" onclick="activeBoardCandidate='${r.person.id}';currentTab='scoring';render()">⚖️ Begin Oral Board</button></div>
        </div>
      </div>
    </div>`).join('') : '<div class="card"><p style="text-align:center;color:var(--text-muted);padding:2rem">No candidates currently ready for the oral board.</p></div>';

  let pipelineHTML = inProgress.length ? `<div class="card" style="margin-top:1.5rem"><h3>Candidates In Progress</h3>
    <div class="overflow-x"><table class="data-table"><thead><tr><th>Candidate</th><th>PQS Progress</th><th>Portfolio</th><th>Written Exam</th></tr></thead><tbody>
    ${inProgress.map(p => `<tr>
      <td><strong style="color:var(--text)">${p.person.name}</strong></td>
      <td><div class="progress-bar" style="width:80px;display:inline-block;vertical-align:middle"><div class="fill fill-gold" style="width:${p.stats.pct}%"></div></div> ${p.stats.signed}/${p.stats.total}</td>
      <td>${p.portfolioComplete ? '<span class="badge badge-signed">Complete</span>' : '<span class="badge badge-notstarted">Incomplete</span>'}</td>
      <td>${p.certDates.written_passed ? '<span class="badge badge-signed">Passed</span>' : '<span class="badge badge-notstarted">Not Passed</span>'}</td>
    </tr>`).join('')}
    </tbody></table></div></div>` : '';

  return `<div class="app-bg"></div><div class="dashboard fade-in">
    <div class="dash-header"><h2>📋 Oral Board Queue</h2><div class="dash-sub">${boardReady.length} candidate${boardReady.length !== 1 ? 's' : ''} ready for the oral board</div></div>
    ${readyHTML}${pipelineHTML}</div>`;
}

function renderCommitteeScoring() {
  if (!activeBoardCandidate) {
    return `<div class="app-bg"></div><div class="dashboard fade-in">
      <div class="dash-header"><h2>⚖️ Oral Board Scoring</h2><div class="dash-sub">Select a candidate from the Board Queue tab to begin scoring.</div></div>
      <div class="card"><p style="text-align:center;color:var(--text-muted);padding:2rem">No active oral board session. Go to Board Queue to begin.</p></div></div>`;
  }

  const candidate = STATE.people.find(p => p.id === activeBoardCandidate);
  if (!candidate) return '';
  const stats = taskStats(candidate.id);
  const rtiTotal = getTotalRtiHours(candidate.id);

  const phases = Object.entries(ORAL_RUBRIC).map(([key, r]) => ({ key, title: r.title, desc: r.desc, scores: r.scores, questions: r.questions }));

  let rubricHTML = phases.map(phase => {
    const currentScore = boardScores[phase.key] || 0;
    const scoreDesc = currentScore ? phase.scores[currentScore] : null;
    const questionsHTML = phase.questions.map(q => `<li style="margin-bottom:0.3rem">${q}</li>`).join('');
    const descriptorRows = [5,4,3,2,1].map(n => {
      const s = phase.scores[n];
      const isActive = currentScore === n;
      return `<div style="display:flex;gap:0.5rem;padding:0.4rem 0.5rem;border-radius:6px;font-size:0.75rem;${isActive ? 'background:var(--navy-mid);border:1px solid var(--gold)' : 'opacity:0.6'}">
        <div style="font-weight:700;color:var(--gold);min-width:1.2rem">${n}</div>
        <div><strong>${s.label}</strong> — ${s.desc}</div>
      </div>`;
    }).join('');

    return `<div class="rubric-card">
      <h4>${phase.title}</h4>
      <p style="font-size:0.78rem;color:var(--text-muted);margin-bottom:0.75rem">${phase.desc}</p>
      <div class="score-dots" data-phase="${phase.key}">
        ${[1, 2, 3, 4, 5].map(n => `<div class="dot ${currentScore >= n ? 'filled' : ''}" onclick="setBoardScore('${phase.key}',${n})">${n}</div>`).join('')}
      </div>
      <div class="rubric-max">${scoreDesc ? `<strong>${currentScore}/5</strong> — ${scoreDesc.label}` : 'Not scored'}</div>
      <div style="margin:0.5rem 0;max-height:180px;overflow-y:auto">${descriptorRows}</div>
      <details style="margin:0.5rem 0"><summary style="font-size:0.78rem;color:var(--gold);cursor:pointer;font-weight:600">📋 Sample Questions (${phase.questions.length})</summary>
        <ol style="font-size:0.78rem;color:var(--text-muted);margin:0.5rem 0 0 1rem;line-height:1.5">${questionsHTML}</ol>
      </details>
      <textarea class="rubric-comments" id="comment_${phase.key}" placeholder="Required: Describe the candidate's performance in this area…">${boardComments[phase.key] || ''}</textarea>
    </div>`
  }).join('');

  const allScored = phases.every(p => boardScores[p.key] >= 1);
  const composite = allScored ? (phases.reduce((s, p) => s + boardScores[p.key], 0) / 3).toFixed(2) : '—';
  const anyBelow2 = phases.some(p => boardScores[p.key] === 1);
  const passPreview = allScored ? (parseFloat(composite) >= 3.0 && !anyBelow2 ? '<span class="badge badge-signed">PASS</span>' : '<span class="badge badge-needswork">DOES NOT PASS</span>') : '';

  return `<div class="app-bg"></div><div class="dashboard fade-in">
    <div class="flex-between" style="margin-bottom:1rem">
      <div>
        <h2 style="font-size:1.3rem">⚖️ Oral Board — ${candidate.name}</h2>
        <p style="color:var(--text-muted);font-size:0.82rem">${stats.signed}/${stats.total} tasks signed off · ${rtiTotal.toFixed(1)}h RTI · Scoring by ${currentUser.name}</p>
      </div>
      <button class="btn btn-outline" onclick="activeBoardCandidate=null;currentTab='queue';render()">← Back to Queue</button>
    </div>
    <div class="rubric-grid">${rubricHTML}</div>
    <div class="card" style="text-align:center;margin-top:1rem">
      <p style="font-size:1.1rem"><strong>Composite Score:</strong> <span style="color:var(--gold);font-weight:800;font-size:1.3rem">${composite} / 5.00</span> ${passPreview}</p>
      <p style="font-size:0.78rem;color:var(--text-muted)">Minimum passing: 3.00 composite, no phase below 2</p>
    </div>
    <div class="decision-area">
      <h3>Board Decision</h3>
      <div class="radio-group">
        <div class="radio-opt ${boardDecision === 'qualified' ? 'selected' : ''}" onclick="boardDecision='qualified';render()">✅ Qualified</div>
        <div class="radio-opt ${boardDecision === 'qualified_with_reservations' ? 'selected' : ''}" onclick="boardDecision='qualified_with_reservations';render()">⚠️ Qualified w/ Reservations</div>
        <div class="radio-opt ${boardDecision === 'not_qualified' ? 'selected' : ''}" onclick="boardDecision='not_qualified';render()">❌ Not Qualified</div>
      </div>
      <label>Board Notes</label>
      <textarea id="boardNotes" placeholder="Overall assessment, remediation requirements if applicable…">${boardNotes || ''}</textarea>
      <div style="margin-top:1rem;text-align:right">
        <button class="btn btn-outline" onclick="activeBoardCandidate=null;boardScores={};boardComments={};boardDecision='';boardNotes='';currentTab='queue';render()">Cancel</button>
        <button class="btn btn-gold" style="margin-left:0.5rem" ${allScored && boardDecision ? '' : 'disabled style="margin-left:0.5rem;opacity:0.4;cursor:not-allowed"'} onclick="submitBoardDecision()">Submit Board Decision</button>
      </div>
    </div>
  </div>`;
}

let boardScores = {}, boardComments = {}, boardDecision = '', boardNotes = '';

function setBoardScore(phase, score) {
  boardScores[phase] = score;
  // Save comments before re-render
  const phases = ['technical', 'practical', 'professional'];
  phases.forEach(p => { const el = document.getElementById('comment_' + p); if (el) boardComments[p] = el.value; });
  const notesEl = document.getElementById('boardNotes'); if (notesEl) boardNotes = notesEl.value;
  render();
}

function submitBoardDecision() {
  // Save final comment values
  const phases = ['technical', 'practical', 'professional'];
  phases.forEach(p => { const el = document.getElementById('comment_' + p); if (el) boardComments[p] = el.value; });
  const notesEl = document.getElementById('boardNotes'); if (notesEl) boardNotes = notesEl.value;

  // Validate comments
  const missing = phases.filter(p => !(boardComments[p] || '').trim());
  if (missing.length) { toast('Please add comments for all phases', 'warning'); return; }
  if (!boardDecision) { toast('Please select a board decision', 'warning'); return; }

  if (!STATE.oralBoards) STATE.oralBoards = [];
  const board = {
    id: 'ob_' + Date.now(),
    candidateId: activeBoardCandidate,
    candidateName: STATE.people.find(p => p.id === activeBoardCandidate)?.name || '',
    status: 'completed',
    scheduledDate: new Date().toISOString().slice(0, 10),
    evaluators: [{
      id: currentUser.id, name: currentUser.name,
      scores: { ...boardScores },
      comments: { ...boardComments }
    }],
    result: boardDecision,
    completedDate: new Date().toISOString().slice(0, 10),
    notes: boardNotes
  };
  STATE.oralBoards.push(board);

  // Notify
  addNotif(activeBoardCandidate, `Oral board completed by ${currentUser.name}. Result: ${boardDecision.replace(/_/g, ' ')}.`, boardDecision === 'qualified' ? 'success' : 'warning');
  addNotif('admin1', `Oral board for ${board.candidateName}: ${boardDecision.replace(/_/g, ' ')}.`, 'info');

  // Reset
  activeBoardCandidate = null; boardScores = {}; boardComments = {}; boardDecision = ''; boardNotes = '';
  saveState(); currentTab = 'history'; render();
  toast('Oral board decision recorded ' + (board.result === 'qualified' ? '✓' : ''), board.result === 'qualified' ? 'success' : 'warning');
}

// ---- PRACTICAL EVALUATION ----
let practicalCandidate = null, practicalScores = {}, practicalComments = {}, practicalChecks = {}, practicalCritical = false;

function renderPracticalEval() {
  if (!practicalCandidate) {
    // Candidate selection page
    const apprentices = getApprentices();
    let listHTML = '';
    apprentices.forEach(a => {
      const s = taskStats(a.id);
      const rtiH = getTotalRtiHours(a.id);
      listHTML += `<div class="card" style="margin-bottom:0.5rem;cursor:pointer" onclick="practicalCandidate='${a.id}';render()">
        <div class="flex-between">
          <div>
            <strong>${a.name}</strong>
            <span style="font-size:0.78rem;color:var(--text-muted);margin-left:0.5rem">${s.signed}/${s.total} tasks · ${rtiH.toFixed(1)}h RTI</span>
          </div>
          <span style="color:var(--gold)">▶ Start Eval</span>
        </div>
      </div>`;
    });
    return `<div class="app-bg"></div><div class="dashboard fade-in">
      <div class="dash-header"><h2>🔧 Practical Evaluation</h2><div class="dash-sub">Standardized 5-station rubric for hands-on skill assessment</div></div>
      <div class="card" style="margin-bottom:1rem">
        <h3>About the Practical Evaluation</h3>
        <p style="font-size:0.82rem;color:var(--text-muted);line-height:1.6">This rubric is standardized across all AEA member shops to ensure consistent, fair grading. Each station is scored 0-2 points (10 total). <strong>Pass requires 7/10 with no critical defects.</strong></p>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:0.5rem;margin-top:0.75rem">
          ${PRACTICAL_RUBRIC.stations.map(st => `<div style="background:var(--navy-mid);border-radius:6px;padding:0.5rem;text-align:center">
            <div style="font-weight:600;font-size:0.82rem">${st.title.split(': ')[1]}</div>
            <div style="font-size:0.72rem;color:var(--text-dim)">${st.timeAllowed} · ${st.points} pts</div>
          </div>`).join('')}
        </div>
      </div>
      <h3 style="margin-bottom:0.5rem">Select Candidate</h3>
      ${listHTML || '<div class="card"><p style="text-align:center;color:var(--text-muted)">No apprentices available</p></div>'}
    </div>`;
  }

  const candidate = STATE.people.find(p => p.id === practicalCandidate);
  if (!candidate) return '';
  const stations = PRACTICAL_RUBRIC.stations;

  let stationsHTML = stations.map(st => {
    const score = practicalScores[st.key];
    const scored = score !== undefined;
    const checks = practicalChecks[st.key] || {};
    const allChecked = st.criteria.every((c, i) => checks[i]);

    // Criteria checklist
    const checklistHTML = st.criteria.map((c, i) => {
      const checked = checks[i] ? 'checked' : '';
      return `<label style="display:flex;align-items:flex-start;gap:0.5rem;margin-bottom:0.3rem;font-size:0.78rem;cursor:pointer">
        <input type="checkbox" ${checked} onchange="togglePracticalCheck('${st.key}',${i})" style="margin-top:2px">
        <span style="color:${checks[i] ? 'var(--text)' : 'var(--text-muted)'}">${c.item}</span>
      </label>`;
    }).join('');

    // Score descriptors
    const scoreDescHTML = [2,1,0].map(n => {
      const isActive = score === n;
      return `<div style="display:flex;gap:0.5rem;padding:0.35rem 0.5rem;border-radius:6px;font-size:0.75rem;margin-bottom:0.25rem;cursor:pointer;${isActive ? 'background:var(--navy-mid);border:1px solid var(--gold)' : 'opacity:0.6'}" onclick="setPracticalScore('${st.key}',${n})">
        <div style="font-weight:700;color:var(--gold);min-width:1.2rem">${n}</div>
        <div>${st.scoring[n]}</div>
      </div>`;
    }).join('');

    return `<div class="rubric-card" style="margin-bottom:1rem">
      <div class="flex-between" style="margin-bottom:0.5rem">
        <h4>${st.title}</h4>
        <span style="font-size:0.78rem;color:var(--text-dim)">${st.timeAllowed} · ${st.points} pts</span>
      </div>
      <p style="font-size:0.78rem;color:var(--text-muted);margin-bottom:0.75rem">${st.desc}</p>

      <div style="background:var(--navy-mid);border-radius:8px;padding:0.75rem;margin-bottom:0.75rem">
        <div style="font-weight:600;font-size:0.78rem;margin-bottom:0.5rem">✅ Accept/Reject Checklist</div>
        ${checklistHTML}
      </div>

      <details style="margin-bottom:0.75rem"><summary style="font-size:0.78rem;color:var(--gold);cursor:pointer;font-weight:600">💡 Evaluator Tips</summary>
        <p style="font-size:0.75rem;color:var(--text-muted);margin:0.5rem 0;line-height:1.5">${st.tips}</p>
      </details>
      <details style="margin-bottom:0.75rem"><summary style="font-size:0.78rem;color:var(--warning);cursor:pointer;font-weight:600">⚠️ Common Errors</summary>
        <p style="font-size:0.75rem;color:var(--text-muted);margin:0.5rem 0;line-height:1.5">${st.errors}</p>
      </details>
      <details style="margin-bottom:0.75rem"><summary style="font-size:0.78rem;color:var(--danger);cursor:pointer;font-weight:600">🛑 Critical Defects (Auto-Fail)</summary>
        <p style="font-size:0.75rem;color:var(--danger);margin:0.5rem 0;line-height:1.5">${st.critical}</p>
      </details>

      <div style="font-weight:600;font-size:0.82rem;margin-bottom:0.5rem">Score (0-${st.points})</div>
      ${scoreDescHTML}

      <textarea class="rubric-comments" id="pcomment_${st.key}" placeholder="Evaluator notes for ${st.title.split(': ')[1]}…">${practicalComments[st.key] || ''}</textarea>
    </div>`;
  }).join('');

  const totalScore = stations.reduce((s, st) => s + (practicalScores[st.key] || 0), 0);
  const allStationsScored = stations.every(st => practicalScores[st.key] !== undefined);
  const passes = totalScore >= PRACTICAL_RUBRIC.passScore && !practicalCritical;
  const passPreview = allStationsScored ? (passes ? '<span class="badge badge-signed">PASS</span>' : '<span class="badge badge-needswork">DOES NOT PASS</span>') : '';

  return `<div class="app-bg"></div><div class="dashboard fade-in">
    <div class="flex-between" style="margin-bottom:1rem">
      <div>
        <h2 style="font-size:1.3rem">🔧 Practical Eval — ${candidate.name}</h2>
        <p style="color:var(--text-muted);font-size:0.82rem">5 stations · ${PRACTICAL_RUBRIC.totalPoints} points total · Pass: ${PRACTICAL_RUBRIC.passScore}+ · Scored by ${currentUser.name}</p>
      </div>
      <button class="btn btn-outline" onclick="practicalCandidate=null;practicalScores={};practicalComments={};practicalChecks={};practicalCritical=false;render()">← Back</button>
    </div>

    <div style="margin-bottom:1rem">
      <label style="display:flex;align-items:center;gap:0.5rem;font-size:0.85rem;cursor:pointer;color:var(--danger)">
        <input type="checkbox" ${practicalCritical ? 'checked' : ''} onchange="practicalCritical=this.checked;render()">
        <strong>🛑 Critical Defect Found</strong> — Automatic fail regardless of score
      </label>
    </div>

    ${stationsHTML}

    <div class="card" style="text-align:center;margin-top:1rem">
      <p style="font-size:1.1rem"><strong>Total Score:</strong> <span style="color:var(--gold);font-weight:800;font-size:1.3rem">${totalScore} / ${PRACTICAL_RUBRIC.totalPoints}</span> ${passPreview}</p>
      <p style="font-size:0.78rem;color:var(--text-muted)">Minimum passing: ${PRACTICAL_RUBRIC.passScore}/${PRACTICAL_RUBRIC.totalPoints}, no critical defects</p>
      ${practicalCritical ? '<p style="color:var(--danger);font-weight:600;margin-top:0.5rem">🛑 CRITICAL DEFECT FLAGGED — candidate cannot pass</p>' : ''}
    </div>

    <div class="decision-area">
      <div style="margin-top:1rem;text-align:right">
        <button class="btn btn-outline" onclick="practicalCandidate=null;practicalScores={};practicalComments={};practicalChecks={};practicalCritical=false;render()">Cancel</button>
        <button class="btn btn-gold" style="margin-left:0.5rem" ${allStationsScored ? '' : 'disabled style="margin-left:0.5rem;opacity:0.4;cursor:not-allowed"'} onclick="submitPracticalEval()">Submit Practical Evaluation</button>
      </div>
    </div>
  </div>`;
}

function togglePracticalCheck(stationKey, idx) {
  if (!practicalChecks[stationKey]) practicalChecks[stationKey] = {};
  practicalChecks[stationKey][idx] = !practicalChecks[stationKey][idx];
  render();
}

function setPracticalScore(stationKey, score) {
  practicalScores[stationKey] = score;
  // Save comments before re-render
  PRACTICAL_RUBRIC.stations.forEach(st => {
    const el = document.getElementById('pcomment_' + st.key);
    if (el) practicalComments[st.key] = el.value;
  });
  render();
}

function submitPracticalEval() {
  // Save final comments
  PRACTICAL_RUBRIC.stations.forEach(st => {
    const el = document.getElementById('pcomment_' + st.key);
    if (el) practicalComments[st.key] = el.value;
  });

  const totalScore = PRACTICAL_RUBRIC.stations.reduce((s, st) => s + (practicalScores[st.key] || 0), 0);
  const passed = totalScore >= PRACTICAL_RUBRIC.passScore && !practicalCritical;

  if (!STATE.practicalEvals) STATE.practicalEvals = [];
  const evalRecord = {
    id: 'pe_' + Date.now(),
    candidateId: practicalCandidate,
    candidateName: STATE.people.find(p => p.id === practicalCandidate)?.name || '',
    evaluatorId: currentUser.id,
    evaluatorName: currentUser.name,
    date: new Date().toISOString().slice(0, 10),
    scores: { ...practicalScores },
    comments: { ...practicalComments },
    checks: JSON.parse(JSON.stringify(practicalChecks)),
    criticalDefect: practicalCritical,
    totalScore,
    maxScore: PRACTICAL_RUBRIC.totalPoints,
    result: passed ? 'pass' : 'fail'
  };
  STATE.practicalEvals.push(evalRecord);

  addNotif(practicalCandidate, `Practical evaluation completed by ${currentUser.name}. Result: ${passed ? 'PASS' : 'FAIL'} (${totalScore}/${PRACTICAL_RUBRIC.totalPoints}).`, passed ? 'success' : 'warning');
  addNotif('admin1', `Practical eval for ${evalRecord.candidateName}: ${passed ? 'PASS' : 'FAIL'} (${totalScore}/${PRACTICAL_RUBRIC.totalPoints}).`, 'info');

  practicalCandidate = null; practicalScores = {}; practicalComments = {}; practicalChecks = {}; practicalCritical = false;
  saveState(); currentTab = 'history'; render();
  toast('Practical evaluation recorded ' + (passed ? '✓' : '⚠'), passed ? 'success' : 'warning');
}

function renderCommitteeHistory() {
  const boards = STATE.oralBoards || [];
  if (!boards.length) {
    return `<div class="app-bg"></div><div class="dashboard fade-in">
      <div class="dash-header"><h2>📊 Oral Board History</h2><div class="dash-sub">No oral boards have been conducted yet.</div></div>
      <div class="card"><p style="text-align:center;color:var(--text-muted);padding:2rem">Completed oral boards will appear here.</p></div></div>`;
  }

  let boardsHTML = boards.map(b => {
    const resultBadge = {
      qualified: '<span class="badge badge-signed">Qualified</span>',
      qualified_with_reservations: '<span class="badge badge-requested">Qualified w/ Reservations</span>',
      not_qualified: '<span class="badge badge-needswork">Not Qualified</span>'
    }[b.result] || '';

    const allScores = b.evaluators.flatMap(e => Object.values(e.scores));
    const composite = allScores.length ? (allScores.reduce((s, v) => s + v, 0) / allScores.length).toFixed(2) : '—';

    let evalDetails = b.evaluators.map(e => `
      <div class="eval-detail">
        <h4 style="font-size:0.85rem;color:var(--text-muted);margin-bottom:0.4rem">${e.name}</h4>
        <div class="eval-scores">
          <span>Technical: <strong>${e.scores.technical}/5</strong></span>
          <span>Practical: <strong>${e.scores.practical}/5</strong></span>
          <span>Professional: <strong>${e.scores.professional}/5</strong></span>
        </div>
      </div>`).join('');

    return `<div class="card" style="margin-bottom:1rem">
      <div class="flex-between" style="margin-bottom:0.75rem">
        <div>
          <h3 style="margin-bottom:0.15rem">${b.candidateName}</h3>
          <p style="font-size:0.82rem;color:var(--text-muted)">${b.completedDate || b.scheduledDate} · Composite: <strong style="color:var(--gold)">${composite}</strong></p>
        </div>
        ${resultBadge}
      </div>
      ${evalDetails}
      ${b.notes ? `<div style="margin-top:0.75rem;padding:0.75rem;background:var(--card-bg);border-radius:8px;font-size:0.85rem;color:var(--text-muted);border-left:3px solid var(--gold)"><strong>Board Notes:</strong> ${b.notes}</div>` : ''}
    </div>`;
  }).join('');

  return `<div class="app-bg"></div><div class="dashboard fade-in">
    <div class="dash-header"><h2>📊 Oral Board History</h2><div class="dash-sub">${boards.length} board${boards.length !== 1 ? 's' : ''} recorded</div></div>
    ${boardsHTML}</div>`;
}

function hideModal() { document.getElementById('modal-overlay').classList.remove('show') }


// ---- INIT ----
document.addEventListener('DOMContentLoaded', () => { loadState(); window.addEventListener('hashchange', handleHash); handleHash() });
// Close notification panel on click outside
document.addEventListener('click', e => { const p = document.getElementById('notifPanel'); if (p && !e.target.closest('.notif-btn') && !e.target.closest('.notif-panel')) p.classList.remove('open') });

// ---- PEOPLE MANAGEMENT ----
function openAddPersonModal() {
  navigate('setup');
}
function removePerson(personId, personName) {
  if (!confirm(`Remove ${personName}? This will permanently delete all their sign-off data, training progress, and portfolio. This cannot be undone.`)) return;
  removePersonFromState(personId);
  toast(`${personName} removed`, 'info');
  render();
}

// ---- DATA EXPORT / IMPORT ----
function exportData() {
  const blob = new Blob([JSON.stringify(STATE, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  const date = new Date().toISOString().slice(0, 10);
  a.download = `caet-tracker-backup-${STATE.shopName.replace(/[^a-zA-Z0-9]/g, '_')}-${date}.json`;
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  URL.revokeObjectURL(url);
  toast('Backup downloaded', 'success');
}
function importData(event) {
  const file = event.target.files[0];
  if (!file) return;
  if (!confirm('This will replace ALL current data with the backup file. Are you sure?')) { event.target.value = ''; return; }
  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const imported = JSON.parse(e.target.result);
      if (!imported.people || !imported.shopName) { toast('Invalid backup file', 'warning'); return; }
      STATE = imported;
      saveState();
      currentUser = null;
      navigate('login');
      toast('Data restored from backup', 'success');
    } catch (err) {
      toast('Failed to read backup file', 'warning');
    }
  };
  reader.readAsText(file);
  event.target.value = '';
}

/* ============================================================
   DEMO TOUR SYSTEM (kept for optional use)
   ============================================================ */
let tourStep = 0;
let activeTour = [];

const TOUR_STEPS = {
  apprentice: [
    { target: '.header-logo-wrap', title: 'Welcome to CAET', text: 'This is the new AEA CAET Apprenticeship LMS. Here you will track all your Part 145 on-the-job training.', pos: 'bottom' },
    { target: '.dash-hero', title: 'Your Learning Path', text: 'Your dash shows your overall progress. Complete these to unlock practical sign-off authority.', pos: 'bottom' },
    { target: '.training-grid', title: 'Core PQS Modules', text: 'These modules match the real CAET standards. Each card shows your live sign-off progress on the shop floor.', pos: 'top' },
    { target: '.main-tab:first-child', title: 'Requesting Sign-offs', text: 'When you are ready, go to the Sign-offs tab to ask your supervisor to evaluate your real-world work.', pos: 'bottom' }
  ],
  supervisor: [
    { target: '.dash-hero', title: 'Evaluator Dashboard', text: 'As a CAET Evaluator, your training focuses on compliance, ethics, and teaching techniques.', pos: 'bottom' },
    { target: '.main-tab:nth-child(2)', title: 'Pending Requests', text: 'The badge here shows how many apprentices are waiting for you to evaluate their shop work.', pos: 'bottom' },
    { target: '.main-tab:first-child', title: 'Managing Apprentices', text: 'Click here to monitor the overall progress of all apprentices assigned to you.', pos: 'bottom' }
  ],
  admin: [
    { target: '.mini-stats', title: 'Program Dashboard', text: 'See real-time stats across all apprentices and supervisors — certification pipeline, average progress, and headcount.', pos: 'bottom' },
    { target: '.main-tab:nth-child(2)', title: 'People Management', text: 'Add new apprentices and supervisors, and view their training completion status at a glance.', pos: 'bottom' },
    { target: '.main-tab:nth-child(3)', title: 'Training Control', text: 'View all courses, create new custom training, track completion matrices, and push training assignments.', pos: 'bottom' }
  ]
};

function startTour() {
  if (!currentUser) return;
  activeTour = TOUR_STEPS[currentUser.role];
  if (!activeTour) return;
  tourStep = 0;
  currentTab = currentUser.role === 'apprentice' ? 'training' : currentUser.role === 'supervisor' ? 'sup_training' : 'overview';
  render();
  document.body.insertAdjacentHTML('beforeend', '<div class="tour-backdrop" id="tourBackdrop"></div>');
  setTimeout(showTourStep, 100);
}

function showTourStep() {
  clearTourState();
  if (tourStep >= activeTour.length) { endTour(); return; }

  const step = activeTour[tourStep];
  const el = document.querySelector(step.target);
  if (!el) { tourStep++; showTourStep(); return; }

  el.classList.add('tour-highlight');
  el.scrollIntoView({ behavior: 'smooth', block: 'center' });

  setTimeout(() => {
    const rect = el.getBoundingClientRect();
    let top = rect.bottom + 15, left = rect.left + (rect.width / 2) - 160;
    if (step.pos === 'top') { top = rect.top - 180; }
    if (left < 10) left = 10;
    if (left + 320 > window.innerWidth) left = window.innerWidth - 330;
    if (top < 10) top = 10;

    const html = `
      <div class="tour-tooltip" id="tourTooltip" style="top:${top}px; left:${left}px">
        <h3>${step.title}</h3>
        <p>${step.text}</p>
        <div class="tour-footer">
          <button class="btn-tour-skip" onclick="endTour()">End Tour</button>
          <span>${tourStep + 1} / ${activeTour.length}</span>
          <button class="btn-tour-next" onclick="nextTourStep()">${tourStep === activeTour.length - 1 ? 'Finish' : 'Next →'}</button>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', html);
  }, 300);
}

function nextTourStep() { tourStep++; showTourStep(); }
function clearTourState() {
  const tt = document.getElementById('tourTooltip'); if (tt) tt.remove();
  document.querySelectorAll('.tour-highlight').forEach(el => el.classList.remove('tour-highlight'));
}
function endTour() {
  clearTourState();
  const bg = document.getElementById('tourBackdrop'); if (bg) bg.remove();
}
