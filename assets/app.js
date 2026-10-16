(() => {
  'use strict';
  const STORAGE_KEY = 'estateflow-prototype-v1';
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const icon = (name, extra = '') => `<svg class="icon ${extra}" aria-hidden="true"><use href="#i-${name}"></use></svg>`;
  const esc = (value = '') => String(value).replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
  const initials = (name = '') => name.split(/\s+/).filter(Boolean).slice(0, 2).map(s => s[0]).join('').toUpperCase();
  const clone = value => JSON.parse(JSON.stringify(value));

  const baseDrafts = [
    {
      id: 'draft-101', title: 'A calmer way to compare resale listings', channel: 'Facebook', channelCode: 'fb', kind: 'Educational guide', version: 1,
      status: 'Awaiting review', updated: 'Today · 09:18', owner: 'Content Agent · demo run',
      text: 'Before you compare resale listings, write down what matters most: location, layout, condition and your own timeline. A clear checklist makes it easier to ask focused questions and compare like with like.\n\nSave this for your next home search, or send me a message if you would like to talk through the questions to ask.',
      caption: 'A practical checklist for a more thoughtful home search.', hashtags: '#SingaporeHomes #PropertyEducation #HomeSearch', cta: 'Send a message to discuss your search.',
      propertySpecific: false, sourceVerified: true, unsupportedClaims: false, listingConfirmed: false, approval: null, scheduled: false
    },
    {
      id: 'draft-102', title: 'Planning your next property conversation', channel: 'TikTok', channelCode: 'tt', kind: 'Short video script', version: 1,
      status: 'Source check needed', updated: 'Today · 08:42', owner: 'Content Agent · demo run',
      text: 'Hook: Three questions to prepare before your next property conversation.\n\n1. What locations are genuinely workable for your routine?\n2. What budget range have you discussed with the right professional?\n3. What timing would feel realistic for you?\n\nKeep the answers personal to your circumstances. A salesperson can help with the property process, while legal and financing questions should go to the appropriate professional.',
      caption: 'Three useful prompts before your next property conversation.', hashtags: '#PropertyTips #SingaporeProperty #HomePlanning', cta: 'Save these prompts for later.',
      propertySpecific: false, sourceVerified: false, unsupportedClaims: false, listingConfirmed: false, approval: null, scheduled: false
    },
    {
      id: 'draft-103', title: 'Example listing post · synthetic only', channel: 'Facebook', channelCode: 'fb', kind: 'Property advertisement', version: 1,
      status: 'Blocked · evidence missing', updated: 'Today · 08:30', owner: 'Content Agent · demo run',
      text: '[SYNTHETIC EXAMPLE — DO NOT PUBLISH]\n\nThis sample property post is intentionally incomplete. No real unit, price, availability, seller authority, listing source or verified salesperson particulars are attached. Use only after a salesperson independently verifies every property fact and confirms authority to advertise.',
      caption: 'Synthetic training example. Not an actual property advertisement.', hashtags: '#DEMOONLY', cta: 'No live CTA in this sample.',
      propertySpecific: true, sourceVerified: false, unsupportedClaims: true, listingConfirmed: false, approval: null, scheduled: false
    }
  ];

  const baseLeads = [
    { id: 'lead-201', name: 'Jamie Ong', type: 'Buyer', channel: 'Facebook Messenger', initials: 'JO', budget: 'SGD 780k', location: 'Bishan · Toa Payoh', timeline: '8 months', property: 'Resale HDB', score: 'Warm', scoreReason: 'Clear areas; longer stated timeline', stage: 'Qualified', last: '8 min ago', snippet: 'Could I arrange a viewing this weekend?', trigger: 'Property viewing requested', taskId: 'task-301', consent: 'Inbound enquiry', notes: [], activity: ['Inbound enquiry received · 8 min ago', 'Qualification captured · 6 min ago'] },
    { id: 'lead-202', name: 'Wei Lin', type: 'Buyer', channel: 'WhatsApp Business', initials: 'WL', budget: 'SGD 920k', location: 'Queenstown', timeline: '9 months', property: 'Condo', score: 'Warm', scoreReason: 'Budget and area shared', stage: 'Contacted', last: '16 min ago', snippet: 'What is the asking price for the unit?', trigger: 'Transaction-specific pricing requested', taskId: 'task-302', consent: 'Inbound enquiry', notes: [], activity: ['Inbound enquiry received · 16 min ago'] },
    { id: 'lead-203', name: 'Ari Lim', type: 'Buyer', channel: 'Facebook Messenger', initials: 'AL', budget: 'SGD 850k', location: 'Punggol · Sengkang', timeline: '10 months', property: 'Resale HDB', score: 'Warm', scoreReason: 'Initial preferences captured', stage: 'New', last: '24 min ago', snippet: 'Which unit would you recommend for me?', trigger: 'Unit recommendation requested', taskId: 'task-303', consent: 'Inbound enquiry', notes: [], activity: ['Inbound enquiry received · 24 min ago'] },
    { id: 'lead-204', name: 'Mei Tan', type: 'Seller', channel: 'WhatsApp Business', initials: 'MT', budget: 'Not provided', location: 'Tampines', timeline: 'Exploring', property: 'Condominium', score: 'Warm', scoreReason: 'Seller intent; valuation request needs a human', stage: 'New', last: '31 min ago', snippet: 'Can you value my home?', trigger: 'Seller valuation requested', taskId: 'task-304', consent: 'Inbound enquiry', notes: [], activity: ['Inbound enquiry received · 31 min ago'] },
    { id: 'lead-205', name: 'Adam Wong', type: 'Buyer', channel: 'Facebook Messenger', initials: 'AW', budget: 'SGD 900k', location: 'Central · East', timeline: '9 months', property: 'Condominium', score: 'Hot', scoreReason: 'High intent and complete preferences', stage: 'Qualified', last: '42 min ago', snippet: 'I am ready to speak with someone today.', trigger: 'Lead score = Hot', taskId: 'task-305', consent: 'Inbound enquiry', notes: [], activity: ['Inbound enquiry received · 42 min ago', 'Scored Hot by demo rules · 40 min ago'] },
    { id: 'lead-206', name: 'Riley Koh', type: 'Buyer', channel: 'WhatsApp Business', initials: 'RK', budget: 'SGD 1.25m', location: 'Bukit Timah', timeline: '12 months', property: 'Condominium', score: 'Warm', scoreReason: 'Budget exceeds human-review threshold', stage: 'Contacted', last: '54 min ago', snippet: 'Our budget is around SGD 1.25 million.', trigger: 'Budget > SGD 1 million', taskId: 'task-306', consent: 'Inbound enquiry', notes: [], activity: ['Inbound enquiry received · 54 min ago'] },
    { id: 'lead-207', name: 'Casey Ng', type: 'Buyer', channel: 'Facebook Messenger', initials: 'CN', budget: 'SGD 680k', location: 'Woodlands', timeline: '3 months', property: 'Resale HDB', score: 'Warm', scoreReason: 'Timeline under six months', stage: 'Qualified', last: '1 hr ago', snippet: 'We hope to move within three months.', trigger: 'Timeline < 6 months', taskId: 'task-307', consent: 'Inbound enquiry', notes: [], activity: ['Inbound enquiry received · 1 hr ago'] },
    { id: 'lead-208', name: 'Morgan Lee', type: 'Seller', channel: 'WhatsApp Business', initials: 'ML', budget: 'Not provided', location: 'Serangoon', timeline: 'Exploring', property: 'Resale HDB', score: 'Cold', scoreReason: 'Early research; limited details shared', stage: 'New', last: '1 hr ago', snippet: 'Can you advise on the legal implications?', trigger: 'Regulatory, legal or financial advice', taskId: 'task-308', consent: 'Inbound enquiry', notes: [], activity: ['Inbound enquiry received · 1 hr ago'] }
  ];

  const baseTasks = [
    { id: 'task-301', leadId: 'lead-201', title: 'Viewing request needs your reply', reason: 'A property viewing was requested. Do not confirm availability or arrange a viewing automatically.', age: '8 min', priority: 'Urgent', resolved: false },
    { id: 'task-302', leadId: 'lead-202', title: 'Pricing question needs a human response', reason: 'The prospect asked for transaction-specific pricing. Agent must not quote or negotiate.', age: '16 min', priority: 'Urgent', resolved: false },
    { id: 'task-303', leadId: 'lead-203', title: 'Unit recommendation requested', reason: 'A personalised unit recommendation is outside the automated response boundary.', age: '24 min', priority: 'Urgent', resolved: false },
    { id: 'task-304', leadId: 'lead-204', title: 'Seller valuation request', reason: 'A seller requested a valuation. Assign to the salesperson; do not generate a valuation.', age: '31 min', priority: 'Urgent', resolved: false },
    { id: 'task-305', leadId: 'lead-205', title: 'Hot lead · call back', reason: 'Lead score = Hot. Immediate human follow-up required.', age: '42 min', priority: 'Urgent', resolved: false },
    { id: 'task-306', leadId: 'lead-206', title: 'High budget · human review', reason: 'Stated budget is SGD 1.25m, above the SGD 1m escalation threshold.', age: '54 min', priority: 'Urgent', resolved: false },
    { id: 'task-307', leadId: 'lead-207', title: 'Near-term timeline · human review', reason: 'Stated timeline is 3 months, below the 6-month escalation threshold.', age: '1 hr', priority: 'Urgent', resolved: false },
    { id: 'task-308', leadId: 'lead-208', title: 'Regulatory / legal advice requested', reason: 'The prospect asked for legal advice. A qualified human or relevant professional must respond.', age: '1 hr', priority: 'Urgent', resolved: false }
  ];

  const baseCalendar = [
    { day: 'MON', date: '12', time: '09:00', title: 'A checklist for comparing resale listings', channel: 'Facebook', status: 'Demo draft', kind: 'pending' },
    { day: 'TUE', date: '13', time: '12:30', title: 'Three questions to prepare', channel: 'TikTok', status: 'Source check', kind: 'blocked' },
    { day: 'WED', date: '14', time: '16:00', title: 'Property conversation checklist', channel: 'Facebook', status: 'Awaiting approval', kind: 'pending' },
    { day: 'THU', date: '15', time: '10:00', title: 'Buyer education: draft slot', channel: 'TikTok', status: 'Placeholder', kind: 'pending' }
  ];

  const baseAgents = [
    { name: 'Research Agent', icon: 'search', desc: 'Sources and topic discovery', task: '3 sample opportunities prepared', state: 'Demo run', tone: 'green' },
    { name: 'Content Agent', icon: 'file', desc: 'Facebook + TikTok drafts', task: '3 synthetic drafts in queue', state: 'Needs review', tone: 'amber' },
    { name: 'Compliance Agent', icon: 'shield', desc: 'CEA preflight and evidence flags', task: 'Profile setup is incomplete', state: 'Blocked', tone: 'red' },
    { name: 'Human Approval Agent', icon: 'check', desc: 'Exact-copy + channel sign-off', task: 'Human decision required', state: 'Waiting', tone: 'amber' },
    { name: 'Publishing Agent', icon: 'send', desc: 'Calendar and performance', task: 'Facebook / TikTok not connected', state: 'Demo only', tone: 'blue' },
    { name: 'Lead Engagement Agent', icon: 'inbox', desc: 'Messenger + WhatsApp inbox', task: 'Inbox connectors not connected', state: 'Demo only', tone: 'blue' },
    { name: 'CRM Agent', icon: 'users', desc: 'Google Sheets lead record', task: 'No live Sheets access', state: 'Demo only', tone: 'blue' }
  ];

  function loadState() {
    let saved = {};
    try { saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') || {}; } catch (_) { saved = {}; }
    const mergeById = (base, updates) => {
      const savedItems = updates || {};
      const baseById = new Map(base.map(item => [item.id, item]));
      const restored = Object.entries(savedItems).map(([id, item]) => baseById.has(id) ? { ...baseById.get(id), ...item } : item);
      const savedIds = new Set(Object.keys(savedItems));
      return [...restored, ...base.filter(item => !savedIds.has(item.id))];
    };
    return {
      drafts: mergeById(baseDrafts, saved.drafts),
      leads: mergeById(baseLeads, saved.leads),
      tasks: mergeById(baseTasks, saved.tasks),
      profile: { name: '', registrationNumber: '', phone: '', agencyName: '', licenceNumber: '', attested: false, ...(saved.profile || {}) },
      calendar: saved.calendar || clone(baseCalendar),
      notes: saved.notes || {},
      page: 'overview'
    };
  }
  let state = loadState();
  let selectedDraftId = state.drafts[0].id;
  let leadFilter = 'All';
  let taskFilter = 'Open';
  let toastTimer;
  const root = $('#app-view');
  const drawer = $('#detail-drawer');
  const drawerScrim = $('#drawer-scrim');
  const sidebar = $('#sidebar');
  const sidebarScrim = $('#sidebar-scrim');
  const crumb = $('#crumb-current');
  const pageNames = { overview: 'Overview', research: 'Research & topics', content: 'Content & approvals', calendar: 'Calendar', leads: 'Lead CRM', tasks: 'Human tasks', performance: 'Performance', compliance: 'Compliance', settings: 'Settings' };

  function persist() {
    try {
      const payload = {
        drafts: Object.fromEntries(state.drafts.map(x => [x.id, x])),
        leads: Object.fromEntries(state.leads.map(x => [x.id, x])),
        tasks: Object.fromEntries(state.tasks.map(x => [x.id, x])),
        profile: state.profile, calendar: state.calendar, notes: state.notes
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch (_) { toast('Local demo storage is unavailable in this browser.', 'warn'); }
  }
  function toast(message, kind = '') {
    const region = $('#toast-region');
    const node = document.createElement('div');
    node.className = `toast ${kind}`;
    node.textContent = message;
    region.append(node);
    window.setTimeout(() => node.remove(), 3300);
  }
  function profileComplete() {
    const p = state.profile;
    return Boolean(p.name.trim() && p.registrationNumber.trim() && p.phone.trim() && p.agencyName.trim() && p.licenceNumber.trim() && p.attested);
  }
  function contentRiskFlags(draft) {
    const copy = [draft.title, draft.text, draft.caption, draft.cta, draft.hashtags].join(' ');
    const flags = [];
    if (/\b(?:SGD|S\$)\s*\d[\d,]*(?:\.\d+)?/i.test(copy)) flags.push('specific currency amount');
    if (/\b(?:guarantee(?:d)?|risk[- ]free|no risk|assured (?:profit|return)|certain profit|double your money)\b/i.test(copy)) flags.push('guarantee / low-risk / profit promise');
    if (/\b(?:investment return|return on investment|rental yield|yield|capital appreciation|ROI|return\s+\d+(?:\.\d+)?\s*%?)\b/i.test(copy)) flags.push('investment / return claim');
    if (/\b(?:best|lowest|highest|number one|no\.?\s*1|top[- ]performing)\b/i.test(copy)) flags.push('absolute or comparative superlative');
    if (draft.unsupportedClaims && !flags.includes('unsupported claim marked by reviewer')) flags.push('unsupported claim marked by reviewer');
    return flags;
  }
  function isApprovalCurrent(draft) {
    return Boolean(draft.approval && draft.approval.version === draft.version && draft.approval.channel === draft.channel);
  }
  function complianceChecks(draft) {
    const identity = profileComplete();
    const source = Boolean(draft.sourceVerified && draft.sourceUrl && !draft.unsupportedClaims);
    const riskFlags = contentRiskFlags(draft);
    const claimsClear = riskFlags.length === 0;
    const listing = !draft.propertySpecific || Boolean(draft.listingConfirmed && draft.ownerConsentVerified && draft.listingCurrent !== false);
    const visual = !draft.usesVisuals || draft.visualsVerified === true;
    const commercial = !draft.hasCommercialClaims || draft.commercialClaimsVerified === true;
    const transaction = !draft.transactionSpecific || draft.transactionConsentVerified === true;
    const approval = isApprovalCurrent(draft);
    return [
      { label: 'Advertiser identity and required particulars', ok: identity, required: true, detail: identity ? 'Entered and salesperson-confirmed locally; not independently verified. Channel and EA/RES details still need human confirmation.' : 'Enter and confirm the CEA salesperson name, registration number and phone, plus estate agency name and licence number.' },
      { label: 'Source-backed factual claims', ok: source, required: true, detail: source ? 'The dated sample source is attached and no unsupported claim is flagged by this demo check.' : 'Source check is incomplete or an unsupported/inconsistent claim is flagged.' },
      { label: 'Automated misleading-claim risk signals', ok: claimsClear, required: true, detail: claimsClear ? 'No obvious currency, guarantee, return or absolute-superlative pattern detected by this limited demo scan.' : `Potential risk flags: ${riskFlags.join(', ')}. Remove the claim or document its support in the agency process, then obtain human/EA review.` },
      { label: 'Listing authority, owner consent and instructed terms', ok: listing, required: Boolean(draft.propertySpecific), detail: draft.propertySpecific ? (listing ? 'Demo listing authority, owner consent, terms and current status are recorded.' : 'Owner/authority evidence, consent, client instructions or current listing status is missing.') : 'Not a property-specific listing; still required before any unit-specific content.' },
      { label: 'Image provenance and illustration qualifier', ok: visual, required: Boolean(draft.usesVisuals), detail: draft.usesVisuals ? (visual ? 'Visual source/unit/viewpoint and applicable qualifier are recorded in the demo.' : 'Image provenance or an appropriate illustration qualifier needs human review.') : 'Text-only demo draft; no property image or visual claim.' },
      { label: 'Price, promotion, guarantee and return claims', ok: commercial, required: Boolean(draft.hasCommercialClaims), detail: draft.hasCommercialClaims ? (commercial ? 'Applicable price/terms and claim support are recorded in the demo.' : 'Verify client-instructed price/terms and support/disclosures for commercial claims.') : 'No price, promotion, guarantee, valuation, yield or return claim in this draft.' },
      { label: 'Transaction-information consent and restrictions', ok: transaction, required: Boolean(draft.transactionSpecific), detail: draft.transactionSpecific ? (transaction ? 'All-party consent and applicable transaction-data restrictions were recorded.' : 'Transaction-specific information needs consent and restriction review.') : 'No transaction-specific information in this draft.' },
      { label: 'Human approval for this exact version', ok: approval, required: false, detail: approval ? `Approved locally for version ${draft.version}; this is not a live publishing authorization.` : 'Pending final human review. Any edit or channel change resets this decision.' },
      { label: 'EA / KEO pre-publication process', ok: true, advisory: true, required: false, detail: 'Production agency vetting is not configured. This prototype review is not a KEO approval or CEA compliance guarantee.' }
    ];
  }
  function canApproveDraft(draft) {
    return complianceChecks(draft).filter(check => check.required).every(check => check.ok);
  }
  function publishBlockedReason(draft) {
    if (!canApproveDraft(draft)) return 'One or more applicable CEA preflight checks are incomplete.';
    if (!isApprovalCurrent(draft)) return 'Human approval for this exact version and channel is required.';
    return 'Live platform accounts are not connected. This prototype cannot publish.';
  }
  function openDrawer(html) {
    drawer.innerHTML = html;
    drawer.hidden = false;
    drawerScrim.classList.add('open');
    document.body.style.overflow = 'hidden';
    $('.drawer-close', drawer)?.focus();
  }
  function closeDrawer() {
    drawer.hidden = true;
    drawerScrim.classList.remove('open');
    document.body.style.overflow = '';
  }
  function goTo(page) {
    if (!pageNames[page]) return;
    state.page = page;
    closeDrawer();
    crumb.textContent = pageNames[page];
    $$('.nav-item').forEach(btn => btn.classList.toggle('active', btn.dataset.view === page));
    sidebar.classList.remove('open');
    sidebarScrim.classList.remove('open');
    render();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  function draftChip(draft) {
    const approvalCurrent = isApprovalCurrent(draft);
    if (approvalCurrent) return '<span class="status-chip approved"><span class="status-dot green"></span>Approved · demo only</span>';
    if (draft.status.includes('Blocked')) return '<span class="status-chip blocked"><span class="status-dot red"></span>Evidence blocked</span>';
    if (draft.status.includes('Source')) return '<span class="status-chip review"><span class="status-dot amber"></span>Source check</span>';
    if (draft.status.includes('Rejected')) return '<span class="status-chip blocked"><span class="status-dot red"></span>Rejected</span>';
    return '<span class="status-chip review"><span class="status-dot amber"></span>Awaiting approval</span>';
  }
  function openLead(leadId) {
    const lead = state.leads.find(l => l.id === leadId);
    if (!lead) return;
    const task = state.tasks.find(t => t.id === lead.taskId);
    const noteText = state.notes[lead.id] || '';
    openDrawer(`
      <div class="drawer-head"><div><div class="eyebrow">Synthetic lead · ${esc(lead.channel)}</div><h2 id="drawer-title">${esc(lead.name)}</h2></div><button class="icon-button drawer-close" data-action="close-drawer" aria-label="Close"><svg class="icon"><use href="#i-close"/></svg></button></div>
      <div class="drawer-content">
        <div class="task-tags"><span class="score-pill ${lead.score.toLowerCase()}">${esc(lead.score)} lead</span>${task && !task.resolved ? '<span class="escalation-tag"><svg class="icon"><use href="#i-alert"/></svg>Human action required</span>' : ''}</div>
        ${task ? `<div class="drawer-section"><h3>Escalation reason</h3><div class="drawer-value"><strong>${esc(task.title)}</strong><br>${esc(task.reason)}</div></div>` : ''}
        <div class="drawer-section"><h3>Qualification</h3><div class="drawer-kv">
          <div><div class="drawer-label">Buyer / Seller</div><div class="drawer-value">${esc(lead.type)}</div></div>
          <div><div class="drawer-label">Budget</div><div class="drawer-value">${esc(lead.budget)}</div></div>
          <div><div class="drawer-label">Preferred location</div><div class="drawer-value">${esc(lead.location)}</div></div>
          <div><div class="drawer-label">Timeline</div><div class="drawer-value">${esc(lead.timeline)}</div></div>
          <div><div class="drawer-label">Property type</div><div class="drawer-value">${esc(lead.property)}</div></div>
          <div><div class="drawer-label">Lead score</div><div class="drawer-value">${esc(lead.score)} · ${esc(lead.scoreReason)}</div></div>
        </div></div>
        <div class="drawer-section"><h3>Conversation · sample transcript</h3><div class="conversation"><div class="bubble inbound">${esc(lead.snippet)}<span class="bubble-meta">Inbound · ${esc(lead.last)}</span></div><div class="bubble outbound">Thanks for sharing. I have noted this and will pass your request to the salesperson, who can follow up with you directly.<span class="bubble-meta">Suggested safe hand-off · not sent</span></div></div></div>
        <div class="drawer-section"><h3>Pipeline stage</h3><div class="form-field"><select class="select-control lead-stage-select" data-lead-id="${esc(lead.id)}" aria-label="Lead pipeline stage">${['New','Contacted','Qualified','Appointment','Viewing','Offer / Negotiation','Closed-Won','Closed-Lost'].map(stage => `<option ${lead.stage === stage ? 'selected' : ''}>${esc(stage)}</option>`).join('')}</select></div></div>
        <div class="drawer-section"><h3>Follow-up note</h3><textarea class="drawer-note" id="lead-note" placeholder="Add a demo-only follow-up note">${esc(noteText)}</textarea><div style="display:flex;justify-content:flex-end;margin-top:7px"><button class="button small soft" data-action="save-lead-note" data-lead-id="${esc(lead.id)}">Save note locally</button></div><div class="field-help" style="margin-top:6px">Saved only in this browser's demo storage. No message is sent.</div></div>
        <div class="drawer-section"><h3>Activity history</h3><div class="source-list">${(lead.activity || []).slice().reverse().map(item => `<div class="source-row"><svg class="icon"><use href="#i-clock"/></svg><div><strong>${esc(item)}</strong><small>Demo record · no external CRM sync</small></div></div>`).join('')}${task && task.resolved ? `<div class="source-row"><svg class="icon"><use href="#i-check"/></svg><div><strong>Human task resolved</strong><small>${esc(task.resolution || 'Outcome recorded in prototype')}</small></div></div>` : ''}</div></div>
      </div>
      ${task && !task.resolved ? `<div class="drawer-footer"><button class="button" data-action="assign-task" data-task-id="${esc(task.id)}">Assign to me</button><button class="button primary" data-action="resolve-task" data-task-id="${esc(task.id)}">Mark handled</button></div>` : ''}
    `);
  }
  function taskCard(task) {
    const lead = state.leads.find(l => l.id === task.leadId);
    return `<article class="task-card ${task.resolved ? 'resolved' : ''}">
      <span class="task-symbol"><svg class="icon"><use href="#i-alert"/></svg></span>
      <div><h3>${esc(task.title)}</h3><p>${esc(task.reason)}</p><div class="task-tags"><span class="queue-badge">${esc(task.priority)}</span><span class="channel-pill">${lead ? esc(lead.channel) : 'Lead'}</span>${lead ? `<span class="channel-pill">${esc(lead.score)} · ${esc(lead.name)}</span>` : ''}</div><div class="task-meta"><span>Received ${esc(task.age)} ago</span><span>Owner: ${esc(task.assignee || 'Unassigned')}</span><span>${task.resolved ? 'Outcome recorded' : 'Automated replies paused'}</span></div></div>
      <div class="task-actions">${task.resolved ? '<span class="task-state done">Handled</span>' : `<button class="button small" data-action="open-lead" data-lead-id="${esc(task.leadId)}">Open lead</button>`}</div>
    </article>`;
  }
  function agentTask(agent) {
    return agent.name === 'Content Agent' ? `${state.drafts.length} demo drafts in review queue` : agent.task;
  }
  function agentRow(agent) {
    const nextTask = agentTask(agent);
    return `<div class="agent-row"><span class="agent-icon"><svg class="icon"><use href="#i-${agent.icon}"/></svg></span><div class="agent-name"><strong>${esc(agent.name)}</strong><small>${esc(agent.desc)}</small></div><div class="agent-task">${esc(nextTask)}</div><span class="state-label"><span class="status-dot ${agent.tone}"></span>${esc(agent.state)}</span></div>`;
  }
  function renderOverview() {
    const awaiting = state.drafts.filter(d => !isApprovalCurrent(d)).length;
    const openTasks = state.tasks.filter(t => !t.resolved).length;
    const urgent = state.leads.filter(l => l.score === 'Hot').length;
    const tasks = state.tasks.filter(t => !t.resolved).slice(0, 4);
    const dueFollowUps = state.leads.filter(l => !state.tasks.find(t => t.leadId === l.id && !t.resolved)).length;
    return `<section class="view-page active">
      <div class="page-heading"><div><div class="eyebrow">Friday · 16 October 2026</div><h1>Good morning. Here's the work that matters.</h1><p>Keep your marketing moving. Step in where human judgment is needed.</p></div><div class="heading-actions"><button class="button" data-view="calendar"><svg class="icon"><use href="#i-calendar"/></svg>Open calendar</button><button class="button primary" data-view="content"><svg class="icon"><use href="#i-file"/></svg>Review content</button></div></div>
      <div class="demo-banner"><svg class="icon"><use href="#i-alert"/></svg><span><strong>Prototype workspace.</strong> Sample leads, drafts and metrics only. Nothing is being published, messaged or synced to Google Sheets.</span><span class="banner-right">All external channels disconnected</span></div>
      <section class="overview-hero"><div class="hero-copy"><div class="hero-overline"><span class="status-dot green"></span>Human-governed workflow · approval gate enabled</div><h2>Marketing coverage, with a human at every decision.</h2><p>Agents prepare the research, drafts and lead context. You own approvals, advice and the next conversation.</p></div><div class="hero-actions"><button class="button" data-view="tasks">Open human task queue <svg class="icon"><use href="#i-arrow"/></svg></button><a class="hero-link" href="#compliance" data-view="compliance">Check compliance setup ${icon('chevron')}</a></div></section>
      <div class="stat-row">
        <article class="stat-card"><div class="stat-top"><span>Demo enquiries</span><span class="stat-icon"><svg class="icon"><use href="#i-inbox"/></svg></span></div><div class="stat-value"><strong>18</strong><span class="stat-delta">sample</span></div><div class="stat-foot">Illustrative volume · not live inbox data</div></article>
        <article class="stat-card"><div class="stat-top"><span>Drafts awaiting review</span><span class="stat-icon"><svg class="icon"><use href="#i-file"/></svg></span></div><div class="stat-value"><strong>${awaiting}</strong><span class="stat-delta">needs a decision</span></div><div class="stat-foot">Approval binds to exact copy, channel and version</div></article>
        <article class="stat-card"><div class="stat-top"><span>Hot leads</span><span class="stat-icon alert"><svg class="icon"><use href="#i-alert"/></svg></span></div><div class="stat-value"><strong>${urgent}</strong><span class="stat-delta" style="color:var(--red)">human follow-up</span></div><div class="stat-foot">Hot score always escalates immediately</div></article>
        <article class="stat-card"><div class="stat-top"><span>Open human tasks</span><span class="stat-icon alert"><svg class="icon"><use href="#i-inbox"/></svg></span></div><div class="stat-value"><strong>${openTasks}</strong><span class="stat-delta" style="color:var(--red)">urgent</span></div><div class="stat-foot">Includes every configured hard trigger</div></article>
      </div>
      <div class="overview-columns">
        <div class="stack">
          <section class="panel"><div class="panel-header"><div><div class="panel-title">Agent operations</div><div class="panel-subtitle">Prototype status · agents are not running against live accounts</div></div><button class="link-button" data-view="compliance">View setup</button></div><div class="panel-body"><div class="agent-list">${baseAgents.map(agentRow).join('')}</div></div></section>
          <section class="panel"><div class="panel-header"><div><div class="panel-title">Research opportunities</div><div class="panel-subtitle">Official source-backed topic seeds · checked 15 Oct 2026</div></div><button class="link-button" data-view="research">See all 5 choices ${icon('arrow')}</button></div><div class="panel-body"><div class="source-list"><div class="source-row"><svg class="icon"><use href="#i-search"/></svg><div><strong>HDB resale index: explain the measure, not one home's value</strong><small>HDB reports the 2Q 2026 RPI at 202.8, down 0.3% quarter-on-quarter; 1Q 2026 was down 0.1%. A useful educational explainer can distinguish a market index from individual flat prices.</small><small><a href="https://www.hdb.gov.sg/managing-my-home/selling-a-flat/process-for-selling-a-flat/resale-flat-planning/resale-statistics" target="_blank" rel="noopener noreferrer">Open HDB resale statistics ${icon('external','tiny')}</a></small></div></div><div class="source-row"><svg class="icon"><use href="#i-search"/></svg><div><strong>URA 3Q flash estimate: label it preliminary</strong><small>URA's 1 Oct 2026 flash estimate says the private residential index rose 1.4% quarter-on-quarter. It is based on data up to mid-September and may differ from the full statistics.</small><small><a href="https://www.ura.gov.sg/news/media/pr26-69/" target="_blank" rel="noopener noreferrer">Open URA flash-estimate release ${icon('external','tiny')}</a></small></div></div><div class="source-row"><svg class="icon"><use href="#i-alert"/></svg><div><strong>Property-news and trend signals</strong><small>Not connected in this prototype. The research agent must record the source, date and human fact-check before a trend becomes a content claim.</small></div></div></div></div></section><section class="panel"><div class="panel-header"><div><div class="panel-title">Content in the approval lane</div><div class="panel-subtitle">A review is not permission to bypass a failed compliance check</div></div><button class="link-button" data-view="content">All drafts ${icon('arrow')}</button></div><div class="panel-body">${state.drafts.map(d => `<div class="post-row"><span class="post-thumb"><svg class="icon"><use href="#i-${d.channelCode === 'tt' ? 'chart' : 'file'}"/></svg></span><div class="post-copy"><strong>${esc(d.title)}</strong><small>${esc(d.channel)} · v${d.version} · ${esc(d.updated)}</small></div>${draftChip(d)}</div>`).join('')}</div></section>
          <section class="panel"><div class="panel-header"><div><div class="panel-title">This week's demo calendar</div><div class="panel-subtitle">Preview schedule only · no platform account connected</div></div><button class="link-button" data-view="calendar">Full calendar ${icon('arrow')}</button></div><div class="panel-body mini-calendar">${state.calendar.slice(0, 3).map(ev => `<div class="calendar-line"><span class="cal-time">${esc(ev.time)}</span><span class="cal-rail"></span><div><div class="cal-title">${esc(ev.title)}</div><div class="cal-sub">${esc(ev.day)} ${esc(ev.date)} OCT · ${esc(ev.status)}</div></div><span class="channel-pill ${ev.channel === 'TikTok' ? 'tt' : 'fb'}">${esc(ev.channel)}</span></div>`).join('')}</div></section>
        </div>
        <div class="stack">
          <section class="panel"><div class="panel-header"><div><div class="panel-title">Needs your attention</div><div class="panel-subtitle">Automated replies pause until you resolve the hand-off</div></div><span class="queue-badge">${openTasks} OPEN</span></div><div class="panel-body"><div class="attention-list">${tasks.map((t, i) => { const lead = state.leads.find(l => l.id === t.leadId); return `<div class="attention-item"><span class="attention-icon ${i > 1 ? 'warn' : ''}"><svg class="icon"><use href="#i-alert"/></svg></span><div class="attention-copy"><strong>${esc(t.title)}</strong><p>${lead ? `${esc(lead.name)} · ` : ''}${esc(t.reason)}</p><div class="attention-meta">${esc(t.age)} ago · ${lead ? esc(lead.channel) : 'Inbound'}</div></div><button class="link-button" data-action="open-lead" data-lead-id="${esc(t.leadId)}" aria-label="Open lead">${icon('chevron')}</button></div>`; }).join('')}</div><button class="button small" style="width:100%;margin-top:11px" data-view="tasks">Review all ${openTasks} human tasks</button></div></section>
          <section class="panel"><div class="panel-header"><div><div class="panel-title">Lead pipeline</div><div class="panel-subtitle">Eight synthetic conversations · sample stages</div></div><button class="link-button" data-view="leads">Open CRM ${icon('arrow')}</button></div><div class="panel-body"><div class="pipeline-mini"><div class="pipeline-segment"><span style="width:40%"></span></div><div class="pipeline-segment"><span style="width:68%"></span></div><div class="pipeline-segment"><span style="width:30%"></span></div><div class="pipeline-segment"><span style="width:12%"></span></div></div><div class="pipeline-legend"><span>New <strong>${state.leads.filter(l => l.stage === 'New').length}</strong></span><span>Qualified <strong>${state.leads.filter(l => l.stage === 'Qualified').length}</strong></span><span>Appointment <strong>${state.leads.filter(l => l.stage === 'Appointment').length}</strong></span></div><div class="followup-line"><svg class="icon"><use href="#i-clock"/></svg><span>${dueFollowUps} sample leads without an open escalation · follow-up plan not measured</span></div></div></section>
          <div class="metric-card-wide"><div><strong>80% less manual marketing work</strong><p>Business target only · baseline and achieved savings not yet measured</p></div><button class="button small" data-view="performance">See metrics</button></div>
        </div>
      </div>
    </section>`;
  }
  function renderDraftCard(draft) {
    const clear = canApproveDraft(draft);
    return `<article class="draft-card ${draft.id === selectedDraftId ? 'selected' : ''}" data-action="select-draft" data-draft-id="${esc(draft.id)}" tabindex="0" role="button" aria-pressed="${draft.id === selectedDraftId}"><div class="draft-card-top"><div class="draft-title">${esc(draft.title)}</div>${draftChip(draft)}</div><div class="draft-meta"><span class="channel-pill ${draft.channelCode}">${esc(draft.channel)}</span><span>${esc(draft.kind)}</span><span>v${draft.version}</span></div><p class="draft-copy">${esc(draft.text)}</p><div class="draft-card-footer"><span>${esc(draft.updated)} · ${esc(draft.owner)}</span><span class="compliance-score ${clear ? 'good' : ''}">${icon(clear ? 'check' : 'alert')} ${clear ? 'Preflight clear' : 'Check needed'}</span></div></article>`;
  }
  function renderReview(draft) {
    if (!draft) return '<div class="panel"><div class="empty-state">Select a draft to review.</div></div>';
    const checks = complianceChecks(draft);
    const canApprove = canApproveDraft(draft);
    const approved = isApprovalCurrent(draft);
    const blockReason = publishBlockedReason(draft);
    const checkRow = c => `<div class="check-row"><span class="check-mark ${c.advisory ? 'warn' : c.ok ? 'pass' : 'fail'}">${icon(c.advisory ? 'alert' : c.ok ? 'check' : 'close')}</span><span><strong>${esc(c.label)}</strong><br>${esc(c.detail)}</span></div>`;
    const sources = [
      ...(draft.sourceTitle && draft.sourceUrl ? [{ title: draft.sourceTitle, url: draft.sourceUrl }] : []),
      ...(Array.isArray(draft.relatedSources) ? draft.relatedSources : [])
    ];
    const sourceTrail = `<div class="draft-source-trail"><div><strong>${draft.topicTitle ? esc(draft.topicTitle) : 'Source review'}</strong><small>${draft.sourceChecked ? esc(draft.sourceChecked) : 'No dated source note attached'}</small></div>${sources.length ? `<div class="draft-source-links">${sources.map(source => `<a href="${esc(source.url)}" target="_blank" rel="noopener noreferrer">${esc(source.title)} ${icon('external','tiny')}</a>`).join('')}</div>` : '<span class="source-missing">No source link attached · factual evidence review required</span>'}</div>`;
    return `<section class="panel review-panel"><div class="panel-header"><div><div class="panel-title">Review exact version <span class="text-muted">v${draft.version}</span></div><div class="panel-subtitle">${esc(draft.channel)} · ${esc(draft.kind)} · ${draft.approval ? `Reviewed ${esc(draft.approval.when)}` : 'Not approved'}</div></div><button class="icon-button" data-action="open-editor" data-draft-id="${esc(draft.id)}" aria-label="Edit draft"><svg class="icon"><use href="#i-edit"/></svg></button></div>
      <div class="panel-body"><div class="preview-label"><span>CHANNEL PREVIEW · SYNTHETIC DRAFT</span><span class="channel-pill ${draft.channelCode}">${esc(draft.channel)}</span></div>
        <div class="social-preview"><div class="social-header"><span class="social-avatar">EF</span><div><strong>Salesperson profile · demo</strong><small>Singapore · sample post · not published</small></div><span class="more">···</span></div><div class="preview-image"><span>${draft.propertySpecific ? 'FICTIONAL LISTING EXAMPLE' : 'PROPERTY EDUCATION'}</span></div><div class="preview-text">${esc(draft.text)}</div><div class="preview-tags">${esc(draft.hashtags)}</div><div class="preview-cta">${esc(draft.cta)}</div></div>
        ${sourceTrail}
        <div class="checklist"><h4>CEA preflight · decision support</h4>${checks.map(checkRow).join('')}</div>
        <div class="review-status-note"><strong>${approved ? 'Human approval recorded for this version.' : canApprove ? 'Ready for your human review.' : 'Approval is gated until required checks are complete.'}</strong> ${esc(blockReason)} No external publishing action is possible in this prototype.</div>
        <div class="review-actions"><button class="button danger small" data-action="reject-draft" data-draft-id="${esc(draft.id)}">Reject</button><button class="button small" data-action="open-editor" data-draft-id="${esc(draft.id)}"><svg class="icon"><use href="#i-edit"/></svg>Edit</button><button class="button primary small" data-action="approve-draft" data-draft-id="${esc(draft.id)}" ${(!canApprove || approved) ? 'disabled' : ''}><svg class="icon"><use href="#i-check"/></svg>${approved ? 'Approved' : 'Approve'}</button></div>
        <button class="button soft small" style="width:100%;margin-top:8px" data-action="schedule-demo" data-draft-id="${esc(draft.id)}" ${(!approved || draft.scheduled) ? 'disabled' : ''}><svg class="icon"><use href="#i-calendar"/></svg>${draft.scheduled ? 'In demo calendar' : 'Add approved version to demo calendar'}</button>
      </div></section>`;
  }
  function renderContent() {
    const draft = state.drafts.find(d => d.id === selectedDraftId) || state.drafts[0];
    return `<section class="view-page active"><div class="page-heading"><div><div class="eyebrow">Content studio · agent drafts</div><h1>Review before anything goes live.</h1><p>Approve, reject or edit the exact version. An edit resets approval and reruns the checks.</p></div><div class="heading-actions"><button class="button" data-view="compliance"><svg class="icon"><use href="#i-shield"/></svg>Compliance setup</button><button class="button primary" data-view="research"><svg class="icon"><use href="#i-plus"/></svg>Choose a topic</button></div></div>
      <div class="demo-banner"><svg class="icon"><use href="#i-alert"/></svg><span><strong>No auto-publishing.</strong> Existing cards are seeded examples. New workflow drafts are created only after you choose one of the five researched topics; topic selection is not publication approval.</span></div>
      <div class="content-layout"><div class="draft-list">${state.drafts.map(renderDraftCard).join('')}</div>${renderReview(draft)}</div>
      <section class="panel section-gap"><div class="panel-header"><div><div class="panel-title">What approval means</div><div class="panel-subtitle">Human review is necessary, but does not itself verify source facts or enable publishing.</div></div></div><div class="panel-body"><div class="source-list"><div class="source-row"><svg class="icon"><use href="#i-check"/></svg><div><strong>Exact copy + channel + version</strong><small>Any copy edit or channel change invalidates the prior approval.</small></div></div><div class="source-row"><svg class="icon"><use href="#i-shield"/></svg><div><strong>Preflight must be clear</strong><small>Missing identity particulars or unverified listing facts remain blockers even after a human reads the draft.</small></div></div><div class="source-row"><svg class="icon"><use href="#i-send"/></svg><div><strong>No external side effects in this prototype</strong><small>Demo scheduling only; no Facebook, TikTok or CRM API is called.</small></div></div></div></div></section>
    </section>`;
  }
  function renderLeads() {
    const q = ($('#lead-search')?.value || '').toLowerCase();
    let leads = state.leads.filter(l => leadFilter === 'All' || l.score === leadFilter);
    if (q) leads = leads.filter(l => [l.name,l.type,l.location,l.channel,l.property,l.trigger].join(' ').toLowerCase().includes(q));
    return `<section class="view-page active"><div class="page-heading"><div><div class="eyebrow">Lead CRM · demo records</div><h1>Every conversation has a next step.</h1><p>Capture the five qualifying fields, keep follow-up visible and route hard triggers to a human.</p></div><div class="heading-actions"><button class="button" data-action="reset-demo"><svg class="icon"><use href="#i-refresh"/></svg>Reset demo data</button><button class="button primary" data-action="add-demo-lead"><svg class="icon"><use href="#i-plus"/></svg>Add sample lead</button></div></div>
      <div class="demo-banner"><svg class="icon"><use href="#i-alert"/></svg><span><strong>Synthetic sample records.</strong> No inbound inbox is connected; no customer data is present. Google Sheets is the selected CRM default, but live sync is not configured.</span></div>
      <div class="page-toolbar"><label class="search-field"><svg class="icon"><use href="#i-search"/></svg><input id="lead-search" type="search" placeholder="Search leads, location, channel…" aria-label="Search leads" value="${esc($('#lead-search')?.value || '')}"></label><div class="toolbar-spacer"></div><div class="segmented" role="group" aria-label="Filter by lead score">${['All','Hot','Warm','Cold'].map(filter => `<button class="${leadFilter === filter ? 'active' : ''}" data-action="filter-leads" data-filter="${filter}">${filter}${filter === 'All' ? ` (${state.leads.length})` : ` (${state.leads.filter(l => l.score === filter).length})`}</button>`).join('')}</div></div>
      <div class="data-table-wrap"><table class="data-table"><thead><tr><th>Lead</th><th>Type / channel</th><th>Budget</th><th>Location</th><th>Timeline</th><th>Score</th><th>Pipeline</th><th>Human task</th><th>Last activity</th></tr></thead><tbody>${leads.length ? leads.map(l => `<tr data-action="open-lead" data-lead-id="${esc(l.id)}"><td><div class="lead-cell"><span class="lead-avatar">${esc(l.initials)}</span><span><strong>${esc(l.name)}</strong><small>DEMO · ${esc(l.property)}</small></span></div></td><td>${esc(l.type)}<br><small>${esc(l.channel)}</small></td><td>${esc(l.budget)}</td><td>${esc(l.location)}</td><td>${esc(l.timeline)}</td><td><span class="score-pill ${l.score.toLowerCase()}">${esc(l.score)}</span></td><td><span class="stage-pill">${esc(l.stage)}</span></td><td>${state.tasks.find(t => t.id === l.taskId && !t.resolved) ? `<span class="escalation-tag"><svg class="icon"><use href="#i-alert"/></svg>Escalated</span>` : '<span class="text-muted">—</span>'}</td><td><span class="lead-activity"><svg class="icon"><use href="#i-clock"/></svg>${esc(l.last)}</span></td></tr>`).join('') : '<tr><td colspan="9"><div class="empty-state">No sample leads match that search.</div></td></tr>'}</tbody></table></div>
      <section class="panel section-gap"><div class="panel-header"><div><div class="panel-title">Qualification coverage</div><div class="panel-subtitle">Captured fields are visible per lead; missing information should be asked, never assumed.</div></div></div><div class="panel-body"><div class="metric-grid"><div class="metric-tile"><small>Buyer / Seller</small><strong>8 / 8</strong><em>Synthetic sample fields</em></div><div class="metric-tile"><small>Budget</small><strong>6 / 8</strong><em>Unknown is not treated as zero</em></div><div class="metric-tile"><small>Location + timeline</small><strong>8 / 8</strong><em>Values shown in sample records</em></div></div><p class="field-help" style="margin-top:10px">Lead score is an illustrative suggestion with a visible rationale. The hard escalation rules apply independently of score.</p></div></section>
    </section>`;
  }
  function renderTasks() {
    const q = taskFilter === 'Open' ? state.tasks.filter(t => !t.resolved) : taskFilter === 'Handled' ? state.tasks.filter(t => t.resolved) : state.tasks;
    const activeCount = state.tasks.filter(t => !t.resolved).length;
    const ageInMinutes = value => { const amount = Number.parseFloat(value); return /hr/.test(value) ? amount * 60 : amount; };
    q.sort((a, b) => ageInMinutes(b.age) - ageInMinutes(a.age));
    return `<section class="view-page active"><div class="page-heading"><div><div class="eyebrow">Human task queue · hand-off</div><h1>These conversations need you.</h1><p>Each configured trigger pauses automated advice and creates a human-owned next step.</p></div><div class="heading-actions"><button class="button" data-action="filter-tasks" data-filter="All">Show all</button><button class="button primary" data-view="leads"><svg class="icon"><use href="#i-users"/></svg>Open lead CRM</button></div></div>
      <div class="demo-banner"><svg class="icon"><use href="#i-alert"/></svg><span><strong>${activeCount} unresolved sample escalations.</strong> Resolve only after a salesperson handles the conversation and records an outcome. No response is sent by these controls.</span></div>
      <div class="page-toolbar"><div class="segmented" role="group" aria-label="Filter tasks">${['Open','Handled','All'].map(f => `<button class="${taskFilter === f ? 'active' : ''}" data-action="filter-tasks" data-filter="${f}">${f}${f === 'Open' ? ` (${activeCount})` : f === 'Handled' ? ` (${state.tasks.filter(t=>t.resolved).length})` : ''}</button>`).join('')}</div><div class="toolbar-spacer"></div><span class="text-muted" style="font-size:9px">Sorted by oldest escalation first</span></div>
      <div class="task-list">${q.length ? q.map(taskCard).join('') : '<div class="panel"><div class="empty-state">No tasks in this view.</div></div>'}</div>
      <section class="panel section-gap"><div class="panel-header"><div><div class="panel-title">Hard-trigger policy</div><div class="panel-subtitle">Any one of these conditions creates an immediate human task, regardless of score.</div></div></div><div class="panel-body"><div class="task-tags">${['Viewing requested','Pricing requested','Unit recommendation','Seller valuation','Hot score','Budget > SGD 1m','Timeline < 6 months','Regulatory / legal / financial advice'].map(x => `<span class="queue-badge amber">${esc(x)}</span>`).join('')}</div></div></section>
    </section>`;
  }
  function renderCalendar() {
    const days = [
      {day:'MON',date:'12'}, {day:'TUE',date:'13'}, {day:'WED',date:'14'}, {day:'THU',date:'15'}, {day:'FRI',date:'16'}, {day:'SAT',date:'17'}, {day:'SUN',date:'18'}
    ];
    const events = state.calendar;
    return `<section class="view-page active"><div class="page-heading"><div><div class="eyebrow">Editorial calendar · week of 12 October</div><h1>Plan the rhythm. Keep the gate.</h1><p>Every slot is a prototype placeholder until content is approved and a channel is connected.</p></div><div class="heading-actions"><button class="button" data-view="content"><svg class="icon"><use href="#i-file"/></svg>Open drafts</button><button class="button primary" data-action="add-calendar-slot"><svg class="icon"><use href="#i-plus"/></svg>Add demo slot</button></div></div>
      <div class="demo-banner"><svg class="icon"><use href="#i-alert"/></svg><span><strong>Calendar preview only.</strong> A scheduled slot does not publish. Any content edit invalidates its approval and requires a fresh review.</span></div>
      <div class="calendar-toolbar" style="margin-bottom:12px"><button class="button small" disabled aria-label="Previous week">‹</button><h2>12 — 18 October 2026</h2><button class="button small" disabled aria-label="Next week">›</button><span class="toolbar-spacer"></span><span class="status-chip review">No live posts scheduled</span></div>
      <div class="calendar-outer"><div class="calendar-grid">${days.map(day => { const matches=events.filter(ev=>ev.day===day.day&&ev.date===day.date); return `<div class="calendar-day ${day.day==='WED'?'today':''}"><div class="day-head"><span>${day.day}</span><strong>${day.date}</strong></div>${matches.length ? matches.map(ev => `<article class="calendar-event ${ev.kind}" data-action="calendar-event" data-event-id="${esc(ev.id||'')}"><div class="event-time">${esc(ev.time)} · ${esc(ev.channel)}</div><strong>${esc(ev.title)}</strong><small>${esc(ev.status)} · demo only</small></article>`).join('') : '<div class="calendar-empty">No draft slots</div>'}</div>`; }).join('')}</div></div>
      <section class="panel section-gap"><div class="panel-header"><div><div class="panel-title">Upcoming content slots</div><div class="panel-subtitle">Synthetic calendar entries</div></div></div><div class="panel-body">${events.map(ev=>`<div class="calendar-line"><span class="cal-time">${esc(ev.time)}</span><span class="cal-rail"></span><div><div class="cal-title">${esc(ev.title)}</div><div class="cal-sub">${esc(ev.day)} ${esc(ev.date)} OCT · ${esc(ev.status)}</div></div><span class="channel-pill ${ev.channel==='TikTok'?'tt':'fb'}">${esc(ev.channel)}</span></div>`).join('')}</div></section>
    </section>`;
  }
  function renderPerformance() {
    return `<section class="view-page active"><div class="page-heading"><div><div class="eyebrow">Reach · response · conversion</div><h1>Measure what the workflow earns.</h1><p>Illustrative sample values show the future reporting view. No social account is connected.</p></div><div class="heading-actions"><button class="button" data-action="refresh-metrics"><svg class="icon"><use href="#i-refresh"/></svg>Refresh demo metrics</button></div></div>
      <div class="demo-banner"><svg class="icon"><use href="#i-alert"/></svg><span><strong>All numbers below are illustrative.</strong> They are not platform analytics and do not represent achieved lead uplift or time saved.</span></div>
      <div class="metric-grid" style="margin-bottom:14px"><div class="metric-tile"><small>Sample reach · 7 days</small><strong>12,480</strong><em>Illustrative only · no account data</em></div><div class="metric-tile"><small>Sample engagement rate</small><strong>4.8%</strong><em>Illustrative only · no account data</em></div><div class="metric-tile"><small>Sample inbound enquiries</small><strong>18</strong><em>Not connected to Messenger / WhatsApp</em></div></div>
      <div class="performance-grid"><section class="panel"><div class="chart-wrap"><div class="chart-head"><div><strong>Illustrative reach and enquiries</strong><small>7-day demo series · replace with authorized analytics</small></div><div class="chart-legend"><span><i class="legend-dot"></i>Reach</span><span><i class="legend-dot alt"></i>Enquiries</span></div></div><svg class="chart-svg" viewBox="0 0 620 230" role="img" aria-label="Illustrative chart of reach and enquiry trends"><line class="gridline" x1="35" y1="30" x2="605" y2="30"/><line class="gridline" x1="35" y1="75" x2="605" y2="75"/><line class="gridline" x1="35" y1="120" x2="605" y2="120"/><line class="gridline" x1="35" y1="165" x2="605" y2="165"/><polyline class="line-one" points="38,142 128,119 218,127 308,86 398,96 488,55 580,67"/><polyline class="line-two" points="38,183 128,171 218,177 308,149 398,161 488,133 580,126"/><text x="35" y="204">08 OCT</text><text x="126" y="204">09 OCT</text><text x="216" y="204">10 OCT</text><text x="306" y="204">11 OCT</text><text x="396" y="204">12 OCT</text><text x="486" y="204">13 OCT</text><text x="570" y="204">14 OCT</text></svg></div></section><div><article class="channel-stat"><div class="channel-stat-head"><strong>Facebook</strong><span class="channel-pill fb">NOT CONNECTED</span></div><div class="channel-stat-value">8,360</div><div class="channel-stat-foot">Illustrative reach · sample only</div><div class="channel-stat-foot">Publishing and inbox permissions unavailable</div></article><article class="channel-stat"><div class="channel-stat-head"><strong>TikTok</strong><span class="channel-pill tt">NOT CONNECTED</span></div><div class="channel-stat-value">4,120</div><div class="channel-stat-foot">Illustrative reach · sample only</div><div class="channel-stat-foot">Organic publishing connection not configured</div></article></div></div>
      <section class="panel section-gap"><div class="panel-header"><div><div class="panel-title">Workload reduction · how to measure it</div><div class="panel-subtitle">The requested 80% reduction is a target, not a result</div></div></div><div class="panel-body"><div class="target-card"><div><strong>80% manual-work reduction target</strong><p>Establish a baseline of minutes per week for ideas, writing, editing, posting and follow-up. Compare with actual human time after a connected pilot.</p></div><span class="target-mark">—</span></div><div class="metric-grid mt-12"><div class="metric-tile"><small>Baseline manual time</small><strong>Not measured</strong><em>Requires salesperson time log</em></div><div class="metric-tile"><small>Current assisted time</small><strong>Not measured</strong><em>Requires pilot data</em></div><div class="metric-tile"><small>Reduction achieved</small><strong>Not established</strong><em>No result claimed</em></div></div></div></section>
    </section>`;
  }
  const complianceRules = [
    {title:'Advertiser identity and required particulars',desc:'Confirm the salesperson name, CEA registration number and contact details, plus estate-agency name and licence details. Use the conservative full-identity profile for social/online; route any claimed channel exception to the agency/KEO. User-entered values are not independently verified.',state:()=>profileComplete()?'Human confirmation entered · not independently verified':'Not configured'},
    {title:'Accuracy, authority and current listing status',desc:'For property-specific advertising, check current facts, client instructions and authority/consent. Correct or remove stale or inaccurate advertising through the agency process.',state:()=>state.drafts.some(d=>d.propertySpecific&&(!d.listingConfirmed||!d.ownerConsentVerified||d.listingCurrent===false))?'Blocked · evidence or authority missing':state.drafts.some(d=>d.propertySpecific)?'Human evidence review required':'Not applicable to educational drafts'},
    {title:'Source-backed facts and misleading-claim flags',desc:'The limited deterministic scan flags currency amounts, guarantees, return/yield language and absolute superlatives. Human review must validate evidence, context and caveats; an AI flag is not a legal conclusion.',state:()=>state.drafts.some(d=>!d.sourceVerified||contentRiskFlags(d).length)?'Review required · source or claim risk present':'No obvious risk pattern in current demo drafts'},
    {title:'Price, promotion, guarantee and return statements',desc:'Verify client-instructed terms, source evidence and applicable disclosure/qualifier before any specific commercial claim. Avoid unsupported outcomes and promises.',state:()=>state.drafts.some(d=>d.hasCommercialClaims&&!d.commercialClaimsVerified)?'Human evidence review required':'No commercial claim enabled in generated sample'},
    {title:'Images, illustrations and property representation',desc:'Check image provenance, the unit/viewpoint represented and a suitable illustration qualifier where applicable. The sample workflow generates text only.',state:()=>state.drafts.some(d=>d.usesVisuals&&!d.visualsVerified)?'Review required · visual not checked':'No generated property visual in sample'},
    {title:'Transaction information and consent',desc:'Do not reuse transaction information without checking applicable restrictions, confidentiality and required consent from all relevant parties.',state:()=>state.drafts.some(d=>d.transactionSpecific&&!d.transactionConsentVerified)?'Review required · consent missing':'No transaction-specific data in generated sample'},
    {title:'Human approval, exact version and EA/KEO process',desc:'The salesperson approves the exact content/channel version. An edit invalidates the approval. Production EA/KEO review procedures are not configured in this prototype.',state:()=> 'Human approval required · EA/KEO process not configured'},
    {title:'Lead privacy, consent, DNC and opt-out',desc:'Keep personal data purpose-limited and access-controlled. Verify consent, applicable DNC requirements and a working opt-out before outbound marketing follow-up.',state:()=> 'Required before any live messaging'}
  ];
  function complianceRuleRow(rule) {
    const status = rule.state();
    const lower = status.toLowerCase();
    const blocked = /blocked|not configured|missing/.test(lower);
    const warning = !blocked && /required|review|human confirmation/.test(lower);
    const severity = blocked ? 'fail' : warning ? 'warn' : 'pass';
    return `<div class="compliance-item"><span class="check-mark ${severity}">${icon(blocked ? 'close' : warning ? 'alert' : 'check')}</span><div><h4>${esc(rule.title)}</h4><p>${esc(rule.desc)}</p></div><span class="compliance-label">${esc(status)}</span></div>`;
  }
  function renderCompliance() {
    const p = state.profile;
    const integrations=[['GW','Google Sheets','Selected CRM default · spreadsheet destination not configured'],['f','Facebook Page + Messenger','Publishing and inbox permissions not connected'],['TT','TikTok','Organic publishing / inbox path not connected'],['WA','WhatsApp Business','No authorized inbox route configured']];
    return `<section class="view-page active"><div class="page-heading"><div><div class="eyebrow">Compliance · operating controls</div><h1>Set the guardrails before go-live.</h1><p>Automated checks surface risk. The salesperson remains responsible for verification and approval.</p></div><div class="heading-actions"><span class="status-chip blocked"><span class="status-dot red"></span>Not production-ready</span></div></div>
      <div class="demo-banner"><svg class="icon"><use href="#i-shield"/></svg><span><strong>CEA decision support, not legal advice or a compliance guarantee.</strong> Confirm the applicable, current CEA guidance and agency procedures before using any content.</span></div>
      <div class="compliance-grid"><div class="stack"><section class="panel"><div class="panel-header"><div><div class="panel-title">CEA preflight rules</div><div class="panel-subtitle">Visible checks · human must resolve warnings</div></div></div><div class="panel-body"><div class="compliance-list">${complianceRules.map(complianceRuleRow).join('')}</div></div></section>
        <section class="panel"><div class="panel-header"><div><div class="panel-title">Connected services</div><div class="panel-subtitle">Current project state · no active external integrations</div></div></div><div class="panel-body">${integrations.map(row=>`<div class="integration-row"><div class="integration-left"><span class="integration-logo">${esc(row[0])}</span><span><strong>${esc(row[1])}</strong><small>${esc(row[2])}</small></span></div><span class="integration-state"><span class="status-dot amber"></span>Not connected</span></div>`).join('')}<p class="field-help" style="margin-top:10px">Meta Ads Manager and TikTok for Business connectors are not treated here as organic post publishing or Messenger / WhatsApp inbox APIs.</p></div></section>
      </div><div class="stack"><section class="panel"><div class="panel-header"><div><div class="panel-title">Salesperson & agency particulars</div><div class="panel-subtitle">Enter locally to explore prototype checks; nothing is transmitted</div></div><span class="status-chip ${profileComplete()?'approved':'blocked'}">${profileComplete()?'Fields complete':'Missing fields'}</span></div><div class="panel-body"><div class="compliance-callout"><strong>Local demo storage only</strong>These profile fields stay in this browser's local storage. Completing them does not verify registration against CEA, confirm the agency licence, or enable posting.</div><form id="profile-form" class="mt-12"><div class="form-grid"><div class="form-field"><label for="profile-name">Salesperson name</label><input id="profile-name" name="name" value="${esc(p.name)}" autocomplete="name" placeholder="As registered with CEA" required></div><div class="form-field"><label for="profile-reg">CEA registration number</label><input id="profile-reg" name="registrationNumber" value="${esc(p.registrationNumber)}" placeholder="e.g. R…" required></div><div class="form-field"><label for="profile-phone">CEA-registered phone number</label><input id="profile-phone" name="phone" value="${esc(p.phone)}" autocomplete="tel" placeholder="Phone number" required></div><div class="form-field"><label for="profile-agency">Estate agency name</label><input id="profile-agency" name="agencyName" value="${esc(p.agencyName)}" placeholder="Agency name" required></div><div class="form-field full"><label for="profile-licence">Estate agency licence number</label><input id="profile-licence" name="licenceNumber" value="${esc(p.licenceNumber)}" placeholder="Agency licence number" required></div><div class="form-field full"><label class="checkbox-row"><input type="checkbox" name="attested" ${p.attested?'checked':''}><span>I have personally checked these details against current CEA and agency records. This confirmation is saved locally in this prototype only.</span></label></div></div><div style="display:flex;gap:8px;margin-top:13px"><button class="button primary" type="submit">Save demo profile</button><button class="button" type="button" data-action="clear-profile">Clear local fields</button></div></form></div></section>
        <section class="panel"><div class="panel-header"><div><div class="panel-title">Research source policy</div><div class="panel-subtitle">Source + timestamp required for opportunities</div></div></div><div class="panel-body"><div class="source-list"><div class="source-row"><svg class="icon"><use href="#i-external"/></svg><div><strong>HDB & URA official updates</strong><small>Research candidates only; capture source URL and publication date.</small></div></div><div class="source-row"><svg class="icon"><use href="#i-external"/></svg><div><strong>Property news and topic signals</strong><small>Cross-check claims against authoritative primary sources before drafting.</small></div></div><div class="source-row"><svg class="icon"><use href="#i-shield"/></svg><div><strong>Listing evidence is separate</strong><small>News coverage does not verify a unit's price, features, availability or advertising authority.</small></div></div></div></div></section><section class="panel"><div class="panel-header"><div><div class="panel-title">Official references for human review</div><div class="panel-subtitle">Primary sources · checked 15 Oct 2026 · recheck before use</div></div></div><div class="panel-body"><div class="source-list"><div class="source-row"><svg class="icon"><use href="#i-shield"/></svg><div><strong>CEA Practice Guidelines and Circulars</strong><small><a href="https://www.cea.gov.sg/regulatory-matters/practice-guidelines-and-circulars/" target="_blank" rel="noopener noreferrer">Open current CEA guideline index</a></small></div></div><div class="source-row"><svg class="icon"><use href="#i-file"/></svg><div><strong>CEA Ethical Advertising guideline · PG 2/2011 v2.0</strong><small><a href="https://isomer-user-content.by.gov.sg/71/ce9b4894-fcd6-4061-a5b9-c1b3254b00ae/PG%2002-11%20Practice%20Guidelines%20on%20Ethical%20Advertising.pdf" target="_blank" rel="noopener noreferrer">Open official guideline PDF</a></small></div></div><div class="source-row"><svg class="icon"><use href="#i-file"/></svg><div><strong>Estate Agents Regulations · CEPCC and COPEA</strong><small><a href="https://sso.agc.gov.sg/SL/EAA2010-S644-2010?DocDate=20250930&ValidDate=20260101&ProvIds=Sc1-" target="_blank" rel="noopener noreferrer">Open advertising particulars and duties</a> · <a href="https://sso.agc.gov.sg/SL/EAA2010-S644-2010?DocDate=20250930&ValidDate=20260101&ProvIds=Sc2-" target="_blank" rel="noopener noreferrer">Open EA/KEO supervision schedule</a></small></div></div><div class="source-row"><svg class="icon"><use href="#i-alert"/></svg><div><strong>PDPC Do Not Call guidance</strong><small><a href="https://www.pdpc.gov.sg/about/do-not-call-registry/do-not-call-registry-for-organisations/organisations-guide-to-singapores-do-not-call-dnc-provisions" target="_blank" rel="noopener noreferrer">Open organisation guide</a> · external overlay for outbound marketing</small></div></div></div></div></section>
      </div></div>
    </section>`;
  }
  function renderAgentPage() {
    return `<section class="view-page active"><div class="page-heading"><div><div class="eyebrow">Agent health · prototype state</div><h1>Know what each agent is doing.</h1><p>Statuses describe the illustrative workflow, not live jobs running on accounts or data sources.</p></div><div class="heading-actions"><button class="button" data-action="refresh-agents"><svg class="icon"><use href="#i-refresh"/></svg>Refresh demo status</button></div></div><div class="demo-banner"><svg class="icon"><use href="#i-alert"/></svg><span><strong>Agents are simulated in this prototype.</strong> Research sources are not being polled, messages are not being processed and CRM rows are not being synced.</span></div><section class="panel"><div class="panel-header"><div><div class="panel-title">Agent roster</div><div class="panel-subtitle">Owner and next action visible for every role</div></div><span class="status-chip review">7 roles · prototype</span></div><div class="agent-status-list">${baseAgents.map(a=>`<div class="agent-detail-row"><span class="agent-icon"><svg class="icon"><use href="#i-${a.icon}"/></svg></span><div class="agent-detail-copy"><strong>${esc(a.name)}</strong><small>${esc(a.desc)}</small></div><div class="agent-detail-next">Next action: ${esc(agentTask(a))}</div><div class="agent-detail-status"><span class="status-dot ${a.tone}"></span>${esc(a.state)}</div></div>`).join('')}</div></section><div class="metric-grid section-gap"><div class="metric-tile"><small>Research run</small><strong>Demo only</strong><em>Not connected to live HDB / URA sources</em></div><div class="metric-tile"><small>Publishing jobs</small><strong>0 live</strong><em>Human approval required</em></div><div class="metric-tile"><small>Inbound listeners</small><strong>0 live</strong><em>Messenger / WhatsApp not connected</em></div></div></section>`;
  }
  function render() {
    $('#nav-approval-count').textContent = state.drafts.filter(d => !isApprovalCurrent(d)).length;
    $('#nav-task-count').textContent = state.tasks.filter(t => !t.resolved).length;
    if (state.page === 'overview') root.innerHTML = renderOverview();
    else if (state.page === 'research' && window.EstateFlowExtras) root.innerHTML = window.EstateFlowExtras.renderResearch();
    else if (state.page === 'content') root.innerHTML = renderContent();
    else if (state.page === 'calendar') root.innerHTML = renderCalendar();
    else if (state.page === 'leads') root.innerHTML = renderLeads();
    else if (state.page === 'tasks') root.innerHTML = renderTasks();
    else if (state.page === 'performance') root.innerHTML = renderPerformance();
    else if (state.page === 'compliance') root.innerHTML = renderCompliance();
    else if (state.page === 'settings' && window.EstateFlowExtras) root.innerHTML = window.EstateFlowExtras.renderSettings();
    else root.innerHTML = renderAgentPage();
    crumb.textContent = pageNames[state.page] || 'Overview';
  }
  function approveDraft(id) {
    const draft = state.drafts.find(d => d.id === id);
    if (!draft) return;
    const canApprove = canApproveDraft(draft);
    if (!canApprove) { toast('Approval is blocked until required preflight checks are clear.', 'warn'); return; }
    draft.approval = { version: draft.version, channel: draft.channel, when: 'just now', by: 'Salesperson · local demo' };
    draft.status = 'Approved · demo only';
    draft.updated = 'Just now';
    persist(); render(); toast(`Version ${draft.version} approved locally. Publishing is still disconnected.`);
  }
  function rejectDraft(id) {
    const draft = state.drafts.find(d => d.id === id);
    if (!draft) return;
    const note = window.prompt('Add a short rejection reason (saved only in this browser):', 'Needs edits before another review.');
    if (note === null) return;
    draft.status = 'Rejected · edit requested';
    draft.approval = null;
    draft.rejectionNote = note.trim();
    draft.updated = 'Just now';
    persist(); render(); toast('Draft rejected in the local demo.');
  }
  function openDraftEditor(id) {
    const draft = state.drafts.find(d => d.id === id);
    if (!draft) return;
    openDrawer(`<div class="drawer-head"><div><div class="eyebrow">Edit draft · local demo</div><h2 id="drawer-title">${esc(draft.title)}</h2></div><button class="icon-button drawer-close" data-action="close-drawer" aria-label="Close"><svg class="icon"><use href="#i-close"/></svg></button></div><div class="drawer-content"><div class="demo-banner"><svg class="icon"><use href="#i-alert"/></svg><span>Saving an edit creates a new version and clears the previous approval.</span></div><div class="form-field"><label for="edit-draft-text">Post / script copy · version ${draft.version}</label><textarea id="edit-draft-text">${esc(draft.text)}</textarea></div><div class="form-field mt-12"><label for="edit-draft-caption">Caption</label><textarea id="edit-draft-caption">${esc(draft.caption)}</textarea></div><div class="form-field mt-12"><label for="edit-draft-cta">Call to action</label><input id="edit-draft-cta" value="${esc(draft.cta)}"></div><div class="form-field mt-12"><label for="edit-draft-hashtags">Hashtags</label><input id="edit-draft-hashtags" value="${esc(draft.hashtags)}"></div></div><div class="drawer-footer"><button class="button" data-action="close-drawer">Cancel</button><button class="button primary" data-action="save-draft-edit" data-draft-id="${esc(id)}">Save as new version</button></div>`);
  }
  function handleTaskAssign(taskId) {
    const task = state.tasks.find(t => t.id === taskId);
    if (!task) return;
    task.assignee = 'You';
    persist();
    const lead = state.leads.find(l => l.id === task.leadId);
    openLead(lead.id); render();
    toast('Human task assigned to you. No message was sent.');
  }
  function resolveTask(taskId) {
    const task = state.tasks.find(t => t.id === taskId);
    if (!task) return;
    const outcome = window.prompt('Record the human follow-up outcome (required; local demo only):', 'Salesperson followed up directly.');
    if (outcome === null) return;
    if (!outcome.trim()) { toast('Enter an outcome before resolving the task.', 'warn'); return; }
    task.resolved = true; task.resolution = outcome.trim(); task.resolvedAt = 'just now'; task.assignee = task.assignee || 'You';
    const lead = state.leads.find(l => l.id === task.leadId);
    if (lead) lead.activity.push(`Human hand-off recorded · ${outcome.trim()}`);
    persist(); closeDrawer(); render(); toast('Human task marked handled in the local demo.');
  }
  function resetDemo() {
    if (!window.confirm('Reset this browser-only prototype to its original synthetic sample records?')) return;
    localStorage.removeItem(STORAGE_KEY); state = loadState(); selectedDraftId = state.drafts[0].id; leadFilter='All'; taskFilter='Open'; closeDrawer(); render(); toast('Synthetic demo data reset.');
  }
  function handleAction(action, el) {
    const id = el.dataset.draftId || '';
    if (action === 'open-lead') { openLead(el.dataset.leadId); return; }
    if (action === 'select-draft') { selectedDraftId = id; render(); return; }
    if (action === 'approve-draft') { approveDraft(id); return; }
    if (action === 'reject-draft') { rejectDraft(id); return; }
    if (action === 'open-editor') { openDraftEditor(id); return; }
    if (action === 'close-drawer') { closeDrawer(); return; }
    if (action === 'save-draft-edit') {
      const draft = state.drafts.find(d => d.id === id);
      if (!draft) return;
      draft.text = $('#edit-draft-text', drawer).value.trim(); draft.caption = $('#edit-draft-caption', drawer).value.trim(); draft.cta = $('#edit-draft-cta', drawer).value.trim(); draft.hashtags = $('#edit-draft-hashtags', drawer).value.trim();
      draft.version += 1; draft.approval = null; draft.status = 'Needs compliance recheck'; draft.updated = 'Just now'; draft.scheduled = false;
      state.calendar = state.calendar.filter(ev => ev.draftId !== id);
      persist(); closeDrawer(); render(); toast(`Saved as v${draft.version}. Prior approval cleared; checks need to run again.`); return;
    }
    if (action === 'schedule-demo') {
      const draft = state.drafts.find(d => d.id === id);
      if (!draft || !isApprovalCurrent(draft)) { toast('Approve the exact version and channel before adding a demo calendar slot.', 'warn'); return; }
      draft.scheduled = true;
      state.calendar.push({ id:`cal-${Date.now()}`, draftId:id, day:'FRI', date:'16', time:'15:30', title:draft.title, channel:draft.channel, status:'Approved · demo slot only', kind:'pending' });
      persist(); render(); toast('Added to the local demo calendar. Nothing was published.'); return;
    }
    if (action === 'assign-task') { handleTaskAssign(el.dataset.taskId); return; }
    if (action === 'resolve-task') { resolveTask(el.dataset.taskId); return; }
    if (action === 'save-lead-note') {
      const leadId = el.dataset.leadId; state.notes[leadId] = $('#lead-note', drawer).value.trim();
      const lead = state.leads.find(l => l.id === leadId); if (lead) lead.activity.push('Follow-up note saved locally · just now');
      persist(); openLead(leadId); toast('Follow-up note saved in this browser only.'); return;
    }
    if (action === 'filter-leads') { leadFilter=el.dataset.filter; render(); return; }
    if (action === 'filter-tasks') { taskFilter=el.dataset.filter; render(); return; }
    if (action === 'reset-demo') { resetDemo(); return; }
    if (action === 'new-draft') { goTo('research'); toast('Choose one of the five topics before generating content.'); return; }
    if (action === 'add-demo-lead') { toast('Sample lead intake is represented by the eight synthetic records. No live inbox is connected.', 'warn'); return; }
    if (action === 'add-calendar-slot') { state.calendar.push({id:`cal-${Date.now()}`,day:'FRI',date:'16',time:'16:30',title:'New demo content slot',channel:'Facebook',status:'Placeholder · no approval',kind:'pending'}); persist(); render(); toast('Added a placeholder to the local demo calendar.'); return; }
    if (action === 'refresh-metrics' || action === 'refresh-agents') { toast('Demo data refreshed. Live services are not connected.'); return; }
    if (action === 'clear-profile') { state.profile={name:'',registrationNumber:'',phone:'',agencyName:'',licenceNumber:'',attested:false}; persist(); render(); toast('Local profile fields cleared.'); return; }
  }

  document.addEventListener('click', event => {
    const viewButton = event.target.closest('[data-view]');
    if (viewButton && viewButton.dataset.view) { event.preventDefault(); goTo(viewButton.dataset.view); return; }
    const complianceButton = event.target.closest('[data-open-compliance]');
    if (complianceButton) { goTo('compliance'); return; }
    const actionElement = event.target.closest('[data-action]');
    if (actionElement) handleAction(actionElement.dataset.action, actionElement);
  });
  document.addEventListener('keydown', event => {
    if ((event.key === 'Enter' || event.key === ' ') && event.target.matches('.draft-card[role="button"]')) { event.preventDefault(); handleAction('select-draft', event.target); }
    if (event.key === 'Escape') { closeDrawer(); sidebar.classList.remove('open'); sidebarScrim.classList.remove('open'); }
  });
  document.addEventListener('input', event => {
    if (event.target.id === 'lead-search') {
      const cursor=event.target.selectionStart; render(); const next=$('#lead-search'); if (next) { next.focus(); next.setSelectionRange(cursor,cursor); }
    }
  });
  document.addEventListener('change', event => {
    if (event.target.matches('.lead-stage-select')) {
      const lead=state.leads.find(l=>l.id===event.target.dataset.leadId); if(lead){lead.stage=event.target.value;lead.activity.push(`Pipeline moved to ${lead.stage} · just now`);persist();toast('Lead stage updated in the local demo.');}
    }
  });
  document.addEventListener('submit', event => {
    if (event.target.id !== 'profile-form') return;
    event.preventDefault();
    const form = new FormData(event.target);
    const nextProfile = { name:String(form.get('name')||'').trim(), registrationNumber:String(form.get('registrationNumber')||'').trim(), phone:String(form.get('phone')||'').trim(), agencyName:String(form.get('agencyName')||'').trim(), licenceNumber:String(form.get('licenceNumber')||'').trim(), attested:form.get('attested')==='on' };
    const profileChanged = JSON.stringify(nextProfile) !== JSON.stringify(state.profile);
    state.profile = nextProfile;
    if (profileChanged) state.drafts.forEach(draft => { draft.approval = null; draft.scheduled = false; });
    persist(); render(); toast(profileComplete() ? 'Profile fields saved locally. They are not independently verified.' : 'Profile fields saved. Complete every field and confirmation before demo approval.');
  });
  $('#mobile-menu').addEventListener('click', () => { sidebar.classList.add('open'); sidebarScrim.classList.add('open'); });
  sidebarScrim.addEventListener('click', () => { sidebar.classList.remove('open'); sidebarScrim.classList.remove('open'); });
  drawerScrim.addEventListener('click', closeDrawer);
  window.EstateFlowApp = {
    refresh() { render(); },
    createTopicDrafts(topic, outputs) {
      const selectedTopicId = window.EstateFlowExtras?.getSelectedTopicId?.();
      if (!topic || !selectedTopicId || topic.id !== selectedTopicId || !Array.isArray(outputs) || outputs.length !== 2) return false;
      const stamp = new Date().toLocaleString('en-SG', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit', hour12: false });
      const created = outputs.map((output, index) => ({
        id: `topic-${Date.now()}-${index}`, topicId: topic.id, topicTitle: topic.title,
        sourceTitle: topic.sourceTitle, sourceUrl: topic.sourceUrl, relatedSources: topic.relatedSources || [], sourceChecked: topic.date,
        title: output.title, channel: output.channel, channelCode: output.channelCode, kind: output.kind,
        version: 1, status: 'Awaiting compliance review', updated: stamp,
        owner: 'Content Agent · simulated generation', text: output.text, caption: output.caption,
        hashtags: output.hashtags, cta: output.cta, sourceVerified: true, unsupportedClaims: false,
        propertySpecific: false, listingConfirmed: false, usesVisuals: false,
        hasCommercialClaims: false, transactionSpecific: false, approval: null, scheduled: false
      }));
      state.drafts.unshift(...created);
      selectedDraftId = created[0].id;
      persist();
      goTo('content');
      toast('Created Facebook and TikTok demo drafts from the selected topic. Review sources and CEA checks before approval.');
      return true;
    }
  };
  render();
})();
