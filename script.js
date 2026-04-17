/* ================================================
   AI JobFit Chatbot — script.js
   Mock AI logic: skill extraction, MCQ generation,
   interview questions, scoring, history management
   ================================================ */

'use strict';

/* ---------- State ---------- */
const state = {
  history: JSON.parse(localStorage.getItem('jobfit_history') || '[]'),
  mcqs: [],
  userAnswers: {},
  submitted: false,
  resumeFile: null,
};

/* ---------- DOM Refs ---------- */
const $ = id => document.getElementById(id);
const jobDescEl     = $('jobDesc');
const generateBtn   = $('generateBtn');
const resultsSection = $('resultsSection');
const skillTags     = $('skillTags');
const skillMatchInfo = $('skillMatchInfo');
const mcqList       = $('mcqList');
const mcqMeta       = $('mcqMeta');
const submitBtn     = $('submitBtn');
const scoreCard     = $('scoreCard');
const scoreNumber   = $('scoreNumber');
const scoreBarFill  = $('scoreBarFill');
const scoreBarLabel = $('scoreBarLabel');
const scoreDesc     = $('scoreDesc');
const scoreBreakdown = $('scoreBreakdown');
const ringFill      = $('ringFill');
const interviewList = $('interviewList');
const historyList   = $('historyList');
const clearHistoryBtn = $('clearHistoryBtn');
const difficultyEl  = $('difficulty');
const skillCountEl  = $('skillCount');
const skillCountVal = $('skillCountVal');
const priorityResumeEl = $('priorityResume');
const uploadZone    = $('uploadZone');
const resumeFileInput = $('resumeFile');
const fileChosen    = $('fileChosen');
const sidebarEl     = $('sidebar');
const sidebarToggle = $('sidebarToggle');

/* ---------- Mock Data ---------- */
const SKILL_BANK = {
  python: ['Python','NumPy','Pandas','Flask','Django','FastAPI','Jupyter','Scikit-learn'],
  javascript: ['JavaScript','TypeScript','React','Vue.js','Node.js','Express','Next.js','GraphQL'],
  data: ['Machine Learning','Deep Learning','Data Science','TensorFlow','PyTorch','Keras','Tableau','Power BI','ETL','Spark'],
  cloud: ['AWS','Azure','Google Cloud','Docker','Kubernetes','Terraform','CI/CD','Jenkins'],
  db: ['SQL','PostgreSQL','MongoDB','Redis','MySQL','DynamoDB','Firebase','Cassandra'],
  soft: ['Leadership','Communication','Team Management','Problem Solving','Agile','Scrum','Critical Thinking'],
  ml: ['NLP','Computer Vision','Reinforcement Learning','Feature Engineering','Model Deployment','A/B Testing'],
  design: ['Figma','UI/UX Design','Adobe Creative Suite','Prototyping','User Research','Wireframing'],
  devops: ['Linux','Git','GitHub Actions','Ansible','Prometheus','Grafana','Nginx'],
  marketing: ['SEO','Google Analytics','HubSpot','CRM','Content Marketing','Email Marketing','Salesforce'],
  finance: ['Financial Modeling','Risk Management','Excel','SAP','Budgeting','Valuation','Bloomberg'],
  hr: ['Talent Acquisition','HRIS','Onboarding','Performance Management','Employee Engagement','Labor Law'],
  security: ['Cybersecurity','Penetration Testing','SIEM','IAM','Compliance','Zero Trust','OAuth'],
  psychology: ['CBT','Psychological Assessment','DSM-5','Motivational Interviewing','Patient Care','Counseling'],
};

const ALL_SKILLS = [...new Set(Object.values(SKILL_BANK).flat())];

const INTERVIEW_TEMPLATES = [
  skill => `Can you walk me through a project where you applied ${skill} to solve a complex problem?`,
  skill => `How do you stay updated with the latest developments in ${skill}?`,
  skill => `What are the key best practices you follow when working with ${skill}?`,
  skill => `Describe a challenging situation involving ${skill} and how you overcame it.`,
  skill => `How does your experience with ${skill} contribute to cross-functional collaboration?`,
  skill => `What metrics do you use to evaluate success when applying ${skill}?`,
  skill => `If you were mentoring a junior colleague on ${skill}, what would you prioritize?`,
  skill => `Compare ${skill} to an alternative approach — when would you choose each?`,
];

const MCQ_QUESTIONS = [
  'Which of the following is most commonly used in this technical area?',
  'Which concept best fits the described role?',
  'Identify the most appropriate tool or methodology for this scenario.',
  'Which of the following best describes the correct approach in this domain?',
  'Select the core competency most relevant to professionals in this role.',
  'Which technique is considered an industry standard for this discipline?',
  'What is an important foundational concept when working in this area?',
  'Choose the key skill typically applied by experts in this field.',
];

const SCORE_LABELS = [
  { min: 0,  max: 30,  label: 'Needs Work',      color: '#f87171', desc: 'Your responses suggest significant gaps in the required skill set. Focus on building foundational knowledge in the key areas listed above.' },
  { min: 30, max: 55,  label: 'Developing',       color: '#fbbf24', desc: 'You have some relevant knowledge but there is room for growth. Targeting the unmatched skills will strengthen your candidacy considerably.' },
  { min: 55, max: 75,  label: 'Good Fit',          color: '#60a5fa', desc: 'Your skill set aligns well with the job requirements. A few targeted improvements could make you a strong contender for this role.' },
  { min: 75, max: 90,  label: 'Strong Fit',        color: '#a78bfa', desc: 'You demonstrate solid alignment with the required skills. Your profile is competitive — focus on highlighting your key achievements.' },
  { min: 90, max: 101, label: 'Excellent Fit',     color: '#34d399', desc: 'Outstanding match! Your skills align closely with what this role demands. You are a top candidate — emphasize leadership and impact.' },
];

/* ---------- Skill Extraction (keyword matching) ---------- */
function extractSkills(text, maxSkills) {
  const lower = text.toLowerCase();
  const found = [];
  for (const skill of ALL_SKILLS) {
    // Simple word boundary match
    const regex = new RegExp(`\\b${escapeRegExp(skill.toLowerCase())}\\b`);
    if (regex.test(lower)) found.push(skill);
    if (found.length >= maxSkills * 3) break;
  }
  // If under target, add semantically related based on category keywords
  if (found.length < 4) {
    const cats = detectCategories(lower);
    for (const cat of cats) {
      const pool = SKILL_BANK[cat] || [];
      for (const s of pool) {
        if (!found.includes(s)) found.push(s);
        if (found.length >= maxSkills) break;
      }
      if (found.length >= maxSkills) break;
    }
  }
  // Shuffle deterministically to vary results
  return shuffle(found).slice(0, maxSkills);
}

function detectCategories(text) {
  const cats = [];
  if (/python|django|flask|pandas|numpy/.test(text))   cats.push('python','data','ml');
  if (/javascript|react|node|angular|vue/.test(text))  cats.push('javascript');
  if (/machine learning|deep learning|ai|neural/.test(text)) cats.push('ml','data');
  if (/aws|azure|gcp|cloud|docker|kubernetes/.test(text))   cats.push('cloud','devops');
  if (/sql|database|mongodb|postgres/.test(text))      cats.push('db');
  if (/design|figma|ui|ux/.test(text))                 cats.push('design');
  if (/marketing|seo|crm|hubspot/.test(text))          cats.push('marketing');
  if (/finance|budget|risk|valuation/.test(text))      cats.push('finance');
  if (/hr|talent|recruit|onboard/.test(text))          cats.push('hr');
  if (/security|cyber|pen test|oauth/.test(text))      cats.push('security');
  if (/psychology|therapy|counseling|dsm/.test(text))  cats.push('psychology');
  if (cats.length === 0) cats.push('soft','python','data');
  return cats;
}

function escapeRegExp(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* ---------- Distractor Generation ---------- */
function getDistractors(correct, difficulty, allSkills) {
  const others = allSkills.filter(s => s !== correct);
  const shuffled = shuffle(others);
  const count = difficulty === 'easy' ? 2 : difficulty === 'medium' ? 3 : 4;
  return shuffled.slice(0, count);
}

/* ---------- MCQ Generation ---------- */
function generateMCQs(skills, difficulty) {
  return skills.map((skill, i) => {
    const question = MCQ_QUESTIONS[i % MCQ_QUESTIONS.length];
    const distractors = getDistractors(skill, difficulty, ALL_SKILLS);
    const options = shuffle([skill, ...distractors]);
    return { id: i, skill, question, options, answer: skill };
  });
}

/* ---------- Interview Question Generation ---------- */
function generateInterviewQuestions(skills) {
  const count = Math.min(skills.length, 6);
  return skills.slice(0, count).map((skill, i) => {
    const fn = INTERVIEW_TEMPLATES[i % INTERVIEW_TEMPLATES.length];
    return fn(skill);
  });
}

/* ---------- Score Calculation ---------- */
function calculateScore(mcqs, answers) {
  let correct = 0;
  mcqs.forEach(mcq => {
    const ans = answers[mcq.id];
    if (ans && ans.toLowerCase() === mcq.answer.toLowerCase()) correct++;
  });
  return mcqs.length ? Math.round((correct / mcqs.length) * 100) : 0;
}

function getScoreInfo(score) {
  return SCORE_LABELS.find(l => score >= l.min && score < l.max) || SCORE_LABELS[SCORE_LABELS.length - 1];
}

/* ---------- Render Functions ---------- */
function renderSkills(skills) {
  skillTags.innerHTML = '';
  skills.forEach((skill, i) => {
    const tag = document.createElement('span');
    tag.className = 'skill-tag';
    tag.style.animationDelay = `${i * 0.06}s`;
    tag.innerHTML = `<span class="skill-dot"></span>${skill}`;
    skillTags.appendChild(tag);
  });
}

function renderMCQs(mcqs) {
  mcqList.innerHTML = '';
  state.userAnswers = {};
  const letters = ['A','B','C','D','E'];
  mcqs.forEach((mcq, qi) => {
    const item = document.createElement('div');
    item.className = 'mcq-item';
    item.style.animationDelay = `${qi * 0.07}s`;

    const qHeader = document.createElement('p');
    qHeader.className = 'mcq-question';
    qHeader.innerHTML = `<span class="mcq-num">${qi + 1}</span>${mcq.question}`;
    item.appendChild(qHeader);

    const optWrap = document.createElement('div');
    optWrap.className = 'mcq-options';

    mcq.options.forEach((opt, oi) => {
      const label = document.createElement('label');
      label.className = 'mcq-option-label';
      label.dataset.qid = qi;
      label.dataset.opt = opt;

      const radio = document.createElement('input');
      radio.type = 'radio';
      radio.name = `mcq_${qi}`;
      radio.value = opt;
      radio.className = 'mcq-option-radio';
      radio.addEventListener('change', () => onOptionSelect(qi, opt, label, optWrap, mcq.answer));

      const letter = document.createElement('span');
      letter.className = 'option-letter';
      letter.textContent = letters[oi];

      const text = document.createElement('span');
      text.className = 'option-text';
      text.textContent = opt;

      label.appendChild(radio);
      label.appendChild(letter);
      label.appendChild(text);
      optWrap.appendChild(label);
    });

    item.appendChild(optWrap);
    mcqList.appendChild(item);
  });

  mcqMeta.textContent = `${mcqs.length} question${mcqs.length !== 1 ? 's' : ''} · ${difficultyEl.value} difficulty`;
}

function onOptionSelect(qid, opt, clickedLabel, container, correctAnswer) {
  if (state.submitted) return;
  state.userAnswers[qid] = opt;

  // Reset all labels in this question
  container.querySelectorAll('.mcq-option-label').forEach(l => {
    l.classList.remove('selected');
    const r = l.querySelector('input[type="radio"]');
    if (r) r.checked = false;
  });

  clickedLabel.classList.add('selected');
  clickedLabel.querySelector('input[type="radio"]').checked = true;

  // Live feedback count
  const answered = Object.keys(state.userAnswers).length;
  submitBtn.querySelector('.btn-icon').textContent = `${answered}/${state.mcqs.length}`;
}

function renderInterviewQuestions(questions) {
  interviewList.innerHTML = '';
  questions.forEach((q, i) => {
    const li = document.createElement('li');
    li.className = 'interview-item';
    li.style.animationDelay = `${i * 0.08}s`;
    li.innerHTML = `<strong>Q${i + 1}</strong>${q}`;
    interviewList.appendChild(li);
  });
}

function revealScore(score) {
  scoreCard.classList.remove('hidden');
  scoreCard.style.setProperty('--i', 3);

  // Animated number
  animateNumber(scoreNumber, 0, score, 1200, v => `${v}%`);

  // Bar
  setTimeout(() => {
    scoreBarFill.style.width = `${score}%`;
  }, 100);

  // Ring
  const circumference = 2 * Math.PI * 50; // r=50
  const offset = circumference - (score / 100) * circumference;
  // inject gradient def
  const svgEl = ringFill.closest('svg');
  if (!svgEl.querySelector('#scoreGrad')) {
    const defs = document.createElementNS('http://www.w3.org/2000/svg','defs');
    defs.innerHTML = `<linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#667eea"/>
      <stop offset="100%" stop-color="#a78bfa"/>
    </linearGradient>`;
    svgEl.prepend(defs);
  }
  setTimeout(() => { ringFill.style.strokeDashoffset = offset; }, 150);

  const info = getScoreInfo(score);
  scoreBarLabel.textContent = `${info.label} · ${score}% match`;
  scoreDesc.textContent = info.desc;

  // Breakdown pills
  const answered = Object.keys(state.userAnswers).length;
  const correct  = state.mcqs.filter(m => state.userAnswers[m.id] === m.answer).length;
  const skipped  = state.mcqs.length - answered;
  scoreBreakdown.innerHTML = `
    <span class="breakdown-pill">Correct <span>${correct}</span></span>
    <span class="breakdown-pill">Incorrect <span>${answered - correct}</span></span>
    <span class="breakdown-pill">Skipped <span>${skipped}</span></span>
    <span class="breakdown-pill">Total <span>${state.mcqs.length}</span></span>
  `;
}

function revealAnswers() {
  const letters = ['A','B','C','D','E'];
  state.mcqs.forEach((mcq, qi) => {
    const container = mcqList.querySelectorAll('.mcq-options')[qi];
    if (!container) return;
    const selected = state.userAnswers[qi];
    container.querySelectorAll('.mcq-option-label').forEach(label => {
      const opt = label.dataset.opt;
      label.classList.add('disabled');
      label.classList.remove('selected');
      if (opt === mcq.answer) label.classList.add('correct');
      else if (opt === selected && opt !== mcq.answer) label.classList.add('incorrect');
    });
  });
}

function animateNumber(el, from, to, duration, format = v => v) {
  const start = performance.now();
  function step(ts) {
    const progress = Math.min((ts - start) / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    el.textContent = format(Math.round(from + (to - from) * ease));
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

/* ---------- History ---------- */
function renderHistory() {
  historyList.innerHTML = '';
  if (state.history.length === 0) {
    historyList.innerHTML = '<p class="empty-history">No history yet.<br>Generate questions to start.</p>';
    return;
  }
  state.history.forEach((item, i) => {
    const div = document.createElement('div');
    div.className = 'history-item';
    div.innerHTML = `
      <div class="history-date">${item.date}</div>
      <div class="history-preview">${item.preview}</div>
    `;
    div.addEventListener('click', () => {
      jobDescEl.value = item.full;
      jobDescEl.focus();
      if (window.innerWidth < 900) closeSidebar();
    });
    historyList.appendChild(div);
  });
}

function addToHistory(text) {
  const item = {
    date: new Date().toLocaleString('en-US', { month:'short', day:'numeric', hour:'2-digit', minute:'2-digit' }),
    preview: text.trim().slice(0, 100) + (text.length > 100 ? '…' : ''),
    full: text,
  };
  state.history.unshift(item);
  if (state.history.length > 10) state.history = state.history.slice(0, 10);
  localStorage.setItem('jobfit_history', JSON.stringify(state.history));
  renderHistory();
}

/* ---------- Simulate async "AI" processing ---------- */
function fakeDelay(ms) { return new Promise(r => setTimeout(r, ms)); }

async function runAnalysis() {
  const text = jobDescEl.value.trim();
  if (!text) {
    pulse(jobDescEl);
    return;
  }

  const difficulty = difficultyEl.value;
  const maxSkills  = parseInt(skillCountEl.value, 10);

  // Button loading state
  generateBtn.disabled = true;
  generateBtn.innerHTML = `<span class="spinner"></span> Analyzing…`;

  await fakeDelay(1200);

  // Extract skills
  const skills = extractSkills(text, maxSkills);

  // Generate MCQs & interview questions
  const mcqs = generateMCQs(skills, difficulty);
  const interviews = generateInterviewQuestions(skills);

  state.mcqs = mcqs;
  state.userAnswers = {};
  state.submitted = false;

  // Render
  renderSkills(skills);
  renderMCQs(mcqs);
  renderInterviewQuestions(interviews);

  // Resume match simulation
  if (state.resumeFile && priorityResumeEl.checked) {
    const matched = Math.floor(skills.length * (0.4 + Math.random() * 0.4));
    skillMatchInfo.textContent = `Resume match: ${matched} of ${skills.length} skills found in your resume.`;
    skillMatchInfo.classList.remove('hidden');
  } else {
    skillMatchInfo.classList.add('hidden');
  }

  // Show results
  resultsSection.classList.remove('hidden');
  scoreCard.classList.add('hidden');

  // Reset submit button
  submitBtn.innerHTML = `<span class="btn-icon">→</span> Submit &amp; Score`;

  // Stagger card animations
  resultsSection.querySelectorAll('.card').forEach((card, i) => {
    card.style.setProperty('--i', i);
    card.style.animationDelay = `${i * 0.1}s`;
  });

  // Add to history
  addToHistory(text);

  // Scroll to results
  await fakeDelay(100);
  resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });

  // Restore button
  generateBtn.disabled = false;
  generateBtn.innerHTML = `<span class="btn-icon">◈</span> Analyze &amp; Generate`;
}

function handleSubmit() {
  if (state.submitted) return;
  state.submitted = true;

  const score = calculateScore(state.mcqs, state.userAnswers);
  revealAnswers();
  revealScore(score);

  submitBtn.disabled = true;
  submitBtn.innerHTML = `<span class="btn-icon">✓</span> Submitted`;

  scoreCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

/* ---------- Upload Zone ---------- */
function setupUpload() {
  uploadZone.addEventListener('click', () => resumeFileInput.click());
  uploadZone.addEventListener('dragover', e => { e.preventDefault(); uploadZone.classList.add('drag-over'); });
  uploadZone.addEventListener('dragleave', () => uploadZone.classList.remove('drag-over'));
  uploadZone.addEventListener('drop', e => {
    e.preventDefault(); uploadZone.classList.remove('drag-over');
    const file = e.dataTransfer.files[0];
    if (file && file.type === 'application/pdf') handleFile(file);
  });
  resumeFileInput.addEventListener('change', () => {
    if (resumeFileInput.files[0]) handleFile(resumeFileInput.files[0]);
  });
}

function handleFile(file) {
  state.resumeFile = file;
  fileChosen.classList.remove('hidden');
  fileChosen.innerHTML = `✓ &nbsp;<strong>${file.name}</strong> &nbsp;<span style="opacity:.6;font-size:12px">(${(file.size/1024).toFixed(1)} KB)</span>`;
}

/* ---------- Sidebar ---------- */
function openSidebar()  { sidebarEl.classList.add('open'); }
function closeSidebar() { sidebarEl.classList.remove('open'); }

sidebarToggle.addEventListener('click', () => {
  sidebarEl.classList.contains('open') ? closeSidebar() : openSidebar();
});

// Close sidebar on outside click (mobile)
document.addEventListener('click', e => {
  if (window.innerWidth < 900 && sidebarEl.classList.contains('open')) {
    if (!sidebarEl.contains(e.target) && !sidebarToggle.contains(e.target)) closeSidebar();
  }
});

/* ---------- Misc helpers ---------- */
function pulse(el) {
  el.style.borderColor = '#f87171';
  el.style.boxShadow   = '0 0 0 3px rgba(248,113,113,0.2)';
  setTimeout(() => { el.style.borderColor = ''; el.style.boxShadow = ''; }, 1200);
}

/* ---------- Event wiring ---------- */
generateBtn.addEventListener('click', runAnalysis);
submitBtn.addEventListener('click', handleSubmit);

skillCountEl.addEventListener('input', () => {
  skillCountVal.textContent = skillCountEl.value;
});

clearHistoryBtn.addEventListener('click', () => {
  state.history = [];
  localStorage.removeItem('jobfit_history');
  renderHistory();
});

// Allow Ctrl+Enter to generate
jobDescEl.addEventListener('keydown', e => {
  if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') runAnalysis();
});

/* ---------- Init ---------- */
setupUpload();
renderHistory();
