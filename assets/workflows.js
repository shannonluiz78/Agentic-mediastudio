(() => {
  'use strict';

  const EXT_KEY = 'estateflow-workflow-settings-v1';
  const checked = '15 Oct 2026 · prototype sample check';
  const topics = [
    {
      id: 'market-pulse', theme: 'Singapore market pulse', kind: 'Current official update',
      title: 'HDB resale and URA private-market numbers: two different series',
      audience: 'HDB and private-residential buyers and sellers',
      evidence: 'HDB’s 2Q 2026 Resale Price Index was 202.8, down 0.3% quarter-on-quarter. URA’s 1 Oct 2026 3Q flash estimate reported a 1.4% quarter-on-quarter increase in its private residential property price index; it used data up to mid-September.',
      caveat: 'These cover different property markets and periods. URA labels its estimate as a flash estimate that may differ from the full statistics. Neither index estimates an individual home’s value or guarantees future prices.',
      sourceTitle: 'HDB Resale Statistics', sourceUrl: 'https://www.hdb.gov.sg/managing-my-home/selling-a-flat/process-for-selling-a-flat/resale-flat-planning/resale-statistics',
      relatedSources: [{title: 'URA 3Q 2026 flash estimate', url: 'https://www.ura.gov.sg/news/media/pr26-69/'}],
      date: 'HDB 2Q / URA 3Q 2026 data · sources checked 15 Oct 2026',
      fb: 'Two official property indexes, two different markets: HDB’s 2Q 2026 Resale Price Index was 202.8, down 0.3% quarter-on-quarter. URA’s 1 Oct 2026 3Q flash estimate reported a 1.4% rise in the private residential index. The measures cover different markets and periods; URA’s figure is preliminary. Neither number is a valuation for an individual home.',
      tt: 'Market-data check: HDB’s resale index was down 0.3% in 2Q 2026; URA’s 1 Oct flash estimate showed the private residential index up 1.4% in 3Q. Different markets, different periods—and URA calls its figure a flash estimate. Neither index predicts a specific home’s price.'
    },
    {
      id: 'buyer-prep', theme: 'Buyer journey and preparation', kind: 'Evergreen · official consumer guidance',
      title: 'Before you engage an agent: check registration and understand the service',
      audience: 'First-time and returning buyers',
      evidence: 'A buyer-preparation checklist can remind consumers to verify an agent’s registration and clarify the service and representation arrangements before proceeding.',
      caveat: 'This is a general preparation checklist, not legal or financial advice. Check current official guidance and ask the salesperson to explain the actual agreement.',
      sourceTitle: 'Singapore Government: Four things to note when engaging a property agent', sourceUrl: 'https://www.gov.sg/explainers/four-things-to-note-when-engaging-a-property-agent/',
      date: 'Evergreen consumer guidance · Source checked 15 Oct 2026',
      fb: 'Meeting a property agent? Add three checks to your preparation list: verify the agent’s registration, clarify who the agent represents, and understand the services and written terms before you proceed. Use current official guidance and ask questions when anything is unclear.',
      tt: 'Before a property-agent conversation, verify registration, clarify representation, and understand the written service terms. It is a preparation checklist—not a substitute for reading your actual agreement.'
    },
    {
      id: 'seller-readiness', theme: 'Seller readiness and listing basics', kind: 'Evergreen checklist · current CEA version check',
      title: 'What should be checked before a property listing is advertised?',
      audience: 'Owners considering a sale or rental listing',
      evidence: 'CEA advertising guidance emphasizes accurate, supportable property descriptions and obtaining the relevant client’s prior agreement/consent before advertising.',
      caveat: 'The precise requirements depend on the circumstances and current rules. Confirm ownership/authority, written instructions, particulars and current availability with the agency before a real listing.',
      sourceTitle: 'CEA Ethical Advertising practice guideline (PG 2/2011, Version 2.0)', sourceUrl: 'https://isomer-user-content.by.gov.sg/71/ce9b4894-fcd6-4061-a5b9-c1b3254b00ae/PG%2002-11%20Practice%20Guidelines%20on%20Ethical%20Advertising.pdf',
      date: 'Guidance version shown at source · Source checked 15 Oct 2026',
      fb: 'A listing checklist starts before the post: confirm who can give instructions, record the owner’s agreement, verify material details, and recheck availability before advertising. A news article or old listing is not proof that a particular unit is available.',
      tt: 'Before a property ad goes live: confirm authority and instructions, check the details against evidence, and verify the listing is still current. This is a general checklist; the agency must review the actual case.'
    },
    {
      id: 'property-process', theme: 'Property processes and ownership', kind: 'Current regulatory text · checked 15 Oct 2026',
      title: 'When instructions or availability change, the advertisement must follow',
      audience: 'Property owners and prospective landlords',
      evidence: 'CEA’s estate-agent rules and practice guidance address advertising on a client’s behalf, accurate details and removing or correcting advertisements when circumstances change.',
      caveat: 'Do not present this summary as a complete legal checklist or invent a universal removal deadline. Route uncertain authority, ownership or tenancy situations to the salesperson/agency.',
      sourceTitle: 'Estate Agents (Estate Agency Work) Regulations — CEPCC, First Schedule', sourceUrl: 'https://sso.agc.gov.sg/SL/EAA2010-S644-2010?DocDate=20250930&ValidDate=20260101&ProvIds=Sc1-',
      date: 'Regulatory source checked 15 Oct 2026 · recheck current version',
      fb: 'Property information can change after a listing is prepared. Owners and agents should keep instructions and material details current, and review an advertisement when availability or terms change. Ask the agency how its update and removal process works.',
      tt: 'Listing details are not “set and forget.” If instructions, terms or availability change, alert the agency and check that public information is reviewed promptly. The correct steps depend on the case.'
    },
    {
      id: 'neighbourhood', theme: 'Neighbourhood and home-lifestyle insights', kind: 'Evergreen · official planning source',
      title: 'Use the URA Master Plan as planning context—not a promise about a home',
      audience: 'People comparing areas and daily routines',
      evidence: 'URA describes the Master Plan as a statutory land-use plan guiding Singapore’s medium-term development over 10–15 years; it is reviewed every five years and shows permissible land use and density.',
      caveat: 'A plan is not proof of a project timeline, a specific amenity, a property’s value or a guaranteed future outcome. Check the map and relevant approvals; distinguish plans from completed facilities.',
      sourceTitle: 'URA Master Plan and URA SPACE', sourceUrl: 'https://www.ura.gov.sg/land-planning/master-plan/',
      date: 'Evergreen planning context · Source checked 15 Oct 2026',
      fb: 'Comparing neighbourhoods? Start with your day-to-day checklist, then use official planning information as context. URA’s Master Plan guides medium-term land use; it is not a promise that a specific facility will be built by a certain date or proof of one home’s value.',
      tt: 'Neighbourhood research tip: separate what exists today from what appears in a planning document. URA’s Master Plan is useful land-use context, not a guarantee about a project, timeline, convenience or property value.'
    }
  ];

  const defaultState = { theme: 'professional', selectedTopicId: '', vaultName: 'EstateFlow Marketing', importedNotes: [] };
  let saved = {};
  try { saved = JSON.parse(localStorage.getItem(EXT_KEY) || '{}') || {}; } catch (_) { saved = {}; }
  const state = { ...defaultState, ...saved };
  if (!['light', 'dark', 'professional'].includes(state.theme)) state.theme = 'professional';
  if (!Array.isArray(state.importedNotes)) state.importedNotes = [];

  const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
  const $ = (selector, parent = document) => parent.querySelector(selector);
  const safeName = value => String(value || 'EstateFlow Marketing').trim().replace(/[^a-zA-Z0-9_-]+/g, '-').replace(/^-+|-+$/g, '') || 'EstateFlow-Marketing';
  function persist() {
    try { localStorage.setItem(EXT_KEY, JSON.stringify(state)); }
    catch (_) { notify('Browser storage is unavailable; this prototype setting was not saved.', 'warn'); }
  }
  function notify(message, kind = '') {
    const region = $('#toast-region');
    if (!region) return;
    const node = document.createElement('div');
    node.className = `toast ${kind}`;
    node.textContent = message;
    region.append(node);
    window.setTimeout(() => node.remove(), 3600);
  }
  function applyTheme(theme, announce = false) {
    if (!['light', 'dark', 'professional'].includes(theme)) return;
    state.theme = theme;
    document.documentElement.dataset.theme = theme;
    const themeMeta = $('meta[name="theme-color"]');
    if (themeMeta) themeMeta.content = theme === 'dark' ? '#111916' : theme === 'light' ? '#f7f9fa' : '#f3f2ed';
    persist();
    const app = window.EstateFlowApp;
    if (app && app.refresh) app.refresh();
    if (announce) notify(`${theme[0].toUpperCase()}${theme.slice(1)} appearance saved in this browser.`);
  }
  applyTheme(state.theme);

  function renderResearch() {
    const selected = topics.find(topic => topic.id === state.selectedTopicId);
    return `<section class="view-page active research-page">
      <div class="page-heading"><div><div class="eyebrow">Research agent · five topic choices</div><h1>Choose one idea before drafting.</h1><p>Each choice carries a source, a checked date and a limitation. This offline sample is not a live news or regulation feed.</p></div><div class="heading-actions"><button class="button" data-action="research-refresh-demo"><svg class="icon"><use href="#i-refresh"/></svg>Simulate daily run</button></div></div>
      <div class="demo-banner"><svg class="icon"><use href="#i-alert"/></svg><span><strong>Offline research sample · checked 15 Oct 2026.</strong> Open source links and recheck the current information before using it. Selecting a topic authorizes drafting only; it does not approve a post.</span></div>
      <section class="research-lane" aria-label="Content workflow stages"><div class="lane-step current"><span>01</span><strong>Research</strong><small>5 choices</small></div><i></i><div class="lane-step ${selected ? 'done' : ''}"><span>02</span><strong>Select</strong><small>${selected ? '1 selected' : 'Awaiting you'}</small></div><i></i><div class="lane-step"><span>03</span><strong>Draft</strong><small>After selection</small></div><i></i><div class="lane-step"><span>04</span><strong>CEA preflight</strong><small>Before approval</small></div><i></i><div class="lane-step"><span>05</span><strong>Human approval</strong><small>Never bypassed</small></div></section>
      <div class="topic-selection-bar"><div><strong>${selected ? `Selected: ${esc(selected.theme)}` : 'Select one topic to continue'}</strong><small>${selected ? esc(selected.title) : 'Exactly five choices · one for each agreed content theme'}</small></div><button class="button primary" data-action="generate-topic" ${selected ? '' : 'disabled'}>Generate Facebook + TikTok drafts</button></div>
      <div class="topic-grid">${topics.map((topic, index) => `<article class="topic-card ${state.selectedTopicId === topic.id ? 'selected' : ''}" data-action="select-topic" data-topic-id="${esc(topic.id)}" tabindex="0" role="button" aria-pressed="${state.selectedTopicId === topic.id}"><div class="topic-topline"><span class="topic-number">0${index + 1}</span><span class="topic-kind ${topic.kind.startsWith('Current') ? 'fresh' : ''}">${esc(topic.kind)}</span></div><div class="topic-theme">${esc(topic.theme)}</div><h2>${esc(topic.title)}</h2><p class="topic-audience">For: ${esc(topic.audience)}</p><div class="topic-evidence"><strong>Evidence</strong><span>${esc(topic.evidence)}</span></div><div class="topic-caveat"><strong>Limit</strong><span>${esc(topic.caveat)}</span></div><div class="topic-source"><span>${esc(topic.date)}</span><a href="${esc(topic.sourceUrl)}" target="_blank" rel="noopener noreferrer" data-stop-topic="true">${esc(topic.sourceTitle)} <svg class="icon tiny"><use href="#i-external"/></svg></a>${(topic.relatedSources || []).map(source => `<a href="${esc(source.url)}" target="_blank" rel="noopener noreferrer" data-stop-topic="true">${esc(source.title)} <svg class="icon tiny"><use href="#i-external"/></svg></a>`).join('')}</div><div class="topic-selected-mark">${state.selectedTopicId === topic.id ? 'Selected' : 'Select topic'}</div></article>`).join('')}</div>
      <section class="panel section-gap"><div class="panel-header"><div><div class="panel-title">After you choose</div><div class="panel-subtitle">The next button creates demo drafts; it does not post them.</div></div><button class="link-button" data-view="compliance">Review compliance controls</button></div><div class="panel-body"><div class="source-list"><div class="source-row"><svg class="icon"><use href="#i-file"/></svg><div><strong>Content Agent drafts both channels</strong><small>Facebook post and TikTok script, each with a caption, hashtags and CTA; source caveats remain attached.</small></div></div><div class="source-row"><svg class="icon"><use href="#i-shield"/></svg><div><strong>Compliance runs before approval</strong><small>Applicable failed or unresolved preflight checks block the Approve action. A clear check is not legal advice or a guarantee.</small></div></div><div class="source-row"><svg class="icon"><use href="#i-check"/></svg><div><strong>You decide</strong><small>Approve, reject or edit the exact version. Edits invalidate approval; no content auto-publishes.</small></div></div></div></div></section>
    </section>`;
  }

  const connections = [
    ['Facebook Page publishing', 'Organic Page publishing permission and page selection', 'Not connected'],
    ['Facebook Messenger inbox', 'Separate inbound messaging permission, webhook and human hand-off', 'Not connected'],
    ['TikTok organic publishing', 'Organic content posting authorization; ads/reporting access is not a substitute', 'Not connected'],
    ['WhatsApp Business', 'Business Platform or authorized BSP inbox; consent and opt-out policies required', 'Not connected'],
    ['Google Sheets CRM', 'Selected CRM default · destination spreadsheet and least-privilege access not set', 'Not connected'],
    ['AI model provider', 'Model/API configuration is a mock · no live model calls', 'Not configured'],
    ['Obsidian marketing vault', 'Separate vault · manual Markdown exchange only; no live sync', 'Manual Markdown']
  ];

  const roleNeeds = [
    ['Research Agent', 'Optional LLM for summarizing/classifying; live source retrieval is still required.', 'Optional AI summary'],
    ['Content Agent', 'LLM needed for production draft generation; must preserve sourced facts and caveats.', 'Shared LLM required'],
    ['Compliance Agent', 'Deterministic rules first; optional model for risk flags, never the final compliance decision.', 'Optional AI risk assist'],
    ['Human Approval Agent', 'No model required; the human makes the decision.', 'No model needed'],
    ['Publishing Agent', 'No model required; an authorized platform adapter and exact approval are required.', 'No model needed'],
    ['Lead Engagement Agent', 'LLM may help phrase questions; approved templates and hard escalation rules control responses.', 'Optional shared LLM'],
    ['CRM Agent', 'No model required; structured rules and a CRM adapter are sufficient.', 'No model needed']
  ];

  function renderSettings() {
    return `<section class="view-page active settings-page">
      <div class="page-heading"><div><div class="eyebrow">Workspace preferences · prototype</div><h1>Set the workspace up safely.</h1><p>Appearance, connection inventory, AI configuration guidance and the separate marketing vault live here.</p></div><span class="status-chip review">Local demo settings</span></div>
      <div class="demo-banner"><svg class="icon"><use href="#i-alert"/></svg><span><strong>No credentials or external accounts are connected.</strong> This static prototype does not accept API keys, perform OAuth, call models, sync a vault or write to Google Sheets.</span></div>
      <section class="panel settings-section" id="appearance-settings"><div class="panel-header"><div><div class="panel-title">Appearance</div><div class="panel-subtitle">Choose how this dashboard looks on this browser.</div></div><span class="status-chip">${esc(state.theme[0].toUpperCase() + state.theme.slice(1))}</span></div><div class="panel-body"><div class="theme-options" role="group" aria-label="Dashboard appearance">${[['light','Light','Bright surfaces and cool neutral canvas'],['dark','Dark','Low-glare charcoal workspace'],['professional','Professional','Warm paper, graphite and evergreen']].map(([id,label,desc]) => `<button class="theme-option ${state.theme === id ? 'selected' : ''}" data-action="set-theme" data-theme="${id}" aria-pressed="${state.theme === id}"><span class="theme-swatch ${id}"><i></i><i></i><i></i></span><strong>${label}</strong><small>${desc}</small>${state.theme === id ? '<em>Selected</em>' : ''}</button>`).join('')}</div></div></section>
      <section class="panel settings-section" id="connection-settings"><div class="panel-header"><div><div class="panel-title">Social, CRM and knowledge connections</div><div class="panel-subtitle">Connection setup is a production step; the current preview remains disconnected.</div></div><button class="button small" data-view="compliance">Open CEA profile</button></div><div class="panel-body"><div class="connection-grid">${connections.map(([name,desc,status]) => `<article class="connection-card"><div class="connection-card-top"><strong>${esc(name)}</strong><span class="connection-state-chip ${status === 'Manual Markdown' ? 'manual' : ''}">${esc(status)}</span></div><p>${esc(desc)}</p><button class="link-button" data-action="connection-info" data-service="${esc(name)}">View setup requirements ${status !== 'Manual Markdown' ? '→' : '→'}</button></article>`).join('')}</div><p class="field-help">Treat publishing and inbox access as separate permissions. Before live activation, authorize the official account/API path and define owner, scopes, retention, consent, opt-out and escalation handling.</p></div></section>
      <section class="panel settings-section" id="ai-settings"><div class="panel-header"><div><div class="panel-title">AI model configuration & agent memory</div><div class="panel-subtitle">Models are tools assigned by role; they are not seven separate integrations.</div></div><span class="status-chip blocked">Not configured</span></div><div class="panel-body"><div class="ai-setup-callout"><strong>API fields shown for planning only</strong><p>In production, provider, model ID and optional endpoint would be configured on a secure server. Secret keys must be entered into server-side secret storage and never placed in browser code or local storage.</p></div><div class="mock-api-grid"><label class="form-field">Provider<select disabled><option>Choose provider in secure backend</option></select></label><label class="form-field">Default model<input disabled value="Not configured" autocomplete="off"></label><label class="form-field">Optional API endpoint<input disabled value="Not configured" autocomplete="off"></label><label class="form-field">API key / secret<input disabled type="password" value="" placeholder="Not accepted in this prototype" autocomplete="new-password"></label></div><div class="role-needs"><h3>Which roles need a model?</h3><p class="field-help">The shared provider is the default. These disabled assignment fields are planning placeholders, not active per-agent credentials or model calls.</p>${roleNeeds.map(([name,need,assignment]) => `<div class="role-need"><strong>${esc(name)}</strong><span>${esc(need)}</span><label class="role-override"><small>Model assignment</small><select disabled aria-label="${esc(name)} model assignment"><option>${esc(assignment)}</option></select></label></div>`).join('')}</div><div class="memory-boundary"><div><strong>Memory is not the CRM.</strong><p>Keep approved brand voice, templates and public source notes in the marketing knowledge area. Keep buyer/seller contact details and private conversations in the CRM with appropriate access and retention controls.</p></div><button class="button small" data-action="jump-vault">Open memory & vault</button></div></div></section>
      <section class="panel settings-section" id="vault-settings"><div class="panel-header"><div><div class="panel-title">Separate Obsidian marketing vault</div><div class="panel-subtitle">Manual Markdown import/export · never linked to your personal vault in this prototype.</div></div><span class="status-chip review">Not synced</span></div><div class="panel-body"><div class="vault-header"><label class="form-field">Marketing vault name<input id="vault-name" maxlength="60" value="${esc(state.vaultName)}" aria-label="Marketing vault name"></label><button class="button small" data-action="save-vault-name">Save name locally</button></div><div class="vault-guidance"><strong>Safe memory scope</strong><p>Starter memory covers brand voice, approval preferences, repeatable public education topics and linked official references. Do not import customer contact lists or private message transcripts into this vault.</p></div><div class="vault-actions"><button class="button primary" data-action="export-vault">Export Markdown memory pack</button><label class="button" for="vault-import-file">Import Markdown note</label><input id="vault-import-file" type="file" accept=".md,text/markdown,text/plain" hidden></div><p class="field-help">Export creates one portable <code>.md</code> file you can save inside a separate Obsidian vault. Import stores the selected text note in this browser only. No folder or live Obsidian connection is created.</p><div class="imported-notes"><h3>Imported notes · ${state.importedNotes.length}</h3>${state.importedNotes.length ? state.importedNotes.map(note => `<details class="imported-note"><summary>${esc(note.name)} <span>${esc(note.when)}</span></summary><pre>${esc(note.text.slice(0, 5000))}${note.text.length > 5000 ? '\n[Preview clipped; full note remains in local demo storage.]' : ''}</pre></details>`).join('') : '<div class="empty-state">No Markdown notes imported into this prototype.</div>'}</div></div></section>
    </section>`;
  }

  function generateOutputs(topic) {
    return [
      { channel: 'Facebook', channelCode: 'fb', kind: 'Educational post', title: `${topic.theme} · Facebook`, text: topic.fb, caption: `${topic.title}\n\n${topic.caveat}`, hashtags: '#SingaporeProperty #PropertyEducation #EstateFlowDemo', cta: 'Have a general question? Send an enquiry to speak with a salesperson. This demo does not provide advice.' },
      { channel: 'TikTok', channelCode: 'tt', kind: 'Short-form video script', title: `${topic.theme} · TikTok`, text: topic.tt, caption: `${topic.title}\n\n${topic.caveat}`, hashtags: '#SGProperty #PropertyTips #LearnWithCare', cta: 'Save this general checklist. For property-specific questions, speak directly with a salesperson.' }
    ];
  }

  function exportVault() {
    const name = String(state.vaultName || defaultState.vaultName).trim();
    const notes = [
      `# ${name} — EstateFlow Marketing Memory`,
      '',
      '> Prototype export. Public guidance and policy must be rechecked before use. Do not store client personal data in this vault.',
      '',
      '## Brand voice',
      '- Clear, specific and calm.',
      '- Use evidence adjacent to market claims; distinguish market context from individual property facts.',
      '- Use a helpful educational CTA; do not promise an outcome.',
      '',
      '## Workflow preferences',
      '- Offer five dated, source-backed topics (one per agreed theme) and wait for the user to choose one before drafting.',
      '- Run the applicable CEA preflight before the human approves the exact version.',
      '- Never auto-publish; edits invalidate approval.',
      '- Escalate viewing, pricing, unit recommendation, seller valuation, Hot score, budget > SGD 1m, timeline < 6 months, and requests for legal, financial or regulatory advice.',
      '',
      '## Official public references',
      `- CEA practice guidelines: https://www.cea.gov.sg/regulatory-matters/practice-guidelines-and-circulars/`,
      `- CEA ethical advertising guideline: https://isomer-user-content.by.gov.sg/71/ce9b4894-fcd6-4061-a5b9-c1b3254b00ae/PG%2002-11%20Practice%20Guidelines%20on%20Ethical%20Advertising.pdf`,
      `- URA Master Plan: https://www.ura.gov.sg/land-planning/master-plan/`,
      `- HDB resale statistics: https://www.hdb.gov.sg/managing-my-home/selling-a-flat/process-for-selling-a-flat/resale-flat-planning/resale-statistics`,
      '',
      '## Imported Markdown notes',
      ...state.importedNotes.flatMap(note => [`### ${note.name}`, '', note.text, '']),
      `---\nExported ${new Date().toLocaleString('en-SG')}. This is a manual prototype export; no live Obsidian sync exists.`
    ];
    const blob = new Blob([notes.join('\n')], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `${safeName(name)}-memory.md`;
    document.body.append(anchor);
    anchor.click();
    anchor.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    notify('Markdown memory pack exported. Save it inside your separate Obsidian vault.');
  }

  function handleAction(action, element) {
    if (action === 'select-topic') {
      state.selectedTopicId = state.selectedTopicId === element.dataset.topicId ? '' : element.dataset.topicId;
      persist();
      const app = window.EstateFlowApp;
      if (app && app.refresh) app.refresh();
      return;
    }
    if (action === 'generate-topic') {
      const topic = topics.find(item => item.id === state.selectedTopicId);
      if (!topic) { notify('Select one of the five topics before generating content.', 'warn'); return; }
      const app = window.EstateFlowApp;
      if (!app || !app.createTopicDrafts(topic, generateOutputs(topic))) notify('Draft generation is blocked. Select a research topic first.', 'warn');
      return;
    }
    if (action === 'research-refresh-demo') { notify('This is an offline sample. No live HDB, URA, CEA or news sources were checked.'); return; }
    if (action === 'set-theme') { applyTheme(element.dataset.theme, true); return; }
    if (action === 'connection-info') { notify(`${element.dataset.service}: connection is not active. No OAuth or external action was started.`); return; }
    if (action === 'save-vault-name') {
      const field = $('#vault-name');
      state.vaultName = (field && field.value.trim()) || defaultState.vaultName;
      persist();
      const app = window.EstateFlowApp;
      if (app && app.refresh) app.refresh();
      notify('Separate marketing vault name saved locally.');
      return;
    }
    if (action === 'export-vault') { exportVault(); return; }
    if (action === 'jump-vault') { document.querySelector('#vault-settings')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); return; }
  }

  document.addEventListener('click', event => {
    if (event.target.closest('[data-stop-topic]')) return;
    const action = event.target.closest('[data-action]');
    if (action) handleAction(action.dataset.action, action);
  });
  document.addEventListener('keydown', event => {
    if ((event.key === 'Enter' || event.key === ' ') && event.target.matches('.topic-card[role="button"]')) {
      event.preventDefault();
      handleAction('select-topic', event.target);
    }
  });
  document.addEventListener('change', event => {
    if (event.target.id !== 'vault-import-file') return;
    const file = event.target.files && event.target.files[0];
    event.target.value = '';
    if (!file) return;
    if (!file.name.toLowerCase().endsWith('.md') || file.size > 200_000) {
      notify('Choose a Markdown (.md) note no larger than 200 KB. Do not import customer personal data.', 'warn');
      return;
    }
    file.text().then(text => {
      const note = { name: file.name, when: 'just now · local demo', text: text.slice(0, 200_000) };
      state.importedNotes.unshift(note);
      state.importedNotes = state.importedNotes.slice(0, 20);
      persist();
      const app = window.EstateFlowApp;
      if (app && app.refresh) app.refresh();
      notify('Markdown note imported into this browser only; nothing was synced to Obsidian.');
    }).catch(() => notify('Could not read that Markdown note.', 'warn'));
  });

  window.EstateFlowExtras = { renderResearch, renderSettings, getSelectedTopicId: () => state.selectedTopicId, refresh: () => window.EstateFlowApp?.refresh() };
  const app = window.EstateFlowApp;
  if (app && app.refresh) app.refresh();
})();
