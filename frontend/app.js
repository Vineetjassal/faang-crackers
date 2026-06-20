// ===== FAANG CRACKERS — Resume Upload + AI Analysis =====

// PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js';

const uploadBtn  = document.getElementById('uploadBtn');
const resumeFile = document.getElementById('resumeFile');
const uploadZone = document.getElementById('uploadZone');

// Open file picker
uploadBtn.addEventListener('click', () => resumeFile.click());

// Drag & drop
uploadZone.addEventListener('dragover', e => { e.preventDefault(); uploadZone.classList.add('dragover'); });
uploadZone.addEventListener('dragleave', () => uploadZone.classList.remove('dragover'));
uploadZone.addEventListener('drop', e => {
  e.preventDefault();
  uploadZone.classList.remove('dragover');
  const file = e.dataTransfer.files[0];
  if (file && file.type === 'application/pdf') processResume(file);
  else alert('Please upload a PDF file.');
});

resumeFile.addEventListener('change', e => {
  const file = e.target.files[0];
  if (file) processResume(file);
});

// ===== MAIN FLOW =====
async function processResume(file) {
  // Show analysis section
  const analysisSection = document.getElementById('analysisSection');
  analysisSection.style.display = 'block';
  analysisSection.scrollIntoView({ behavior: 'smooth' });

  document.getElementById('loadingSpinner').style.display = 'flex';
  document.getElementById('annotatedResume').innerHTML = '<div class="loading-spinner" id="loadingSpinner"><div class="spinner"></div><p>Analysing your resume with AI…</p></div>';
  document.getElementById('feedbackList').innerHTML = '';
  document.getElementById('scoreCard').style.display = 'none';
  document.getElementById('scoreTag').textContent = 'Analysing...';
  document.getElementById('scoreTag').className = 'tag-score';

  // 1. Extract text from PDF
  let resumeText = '';
  try {
    resumeText = await extractTextFromPDF(file);
  } catch(err) {
    document.getElementById('annotatedResume').innerHTML = '<p style="color:red;padding:20px">Could not read PDF. Make sure it is a text-based PDF (not scanned image).</p>';
    return;
  }

  if (!resumeText.trim()) {
    document.getElementById('annotatedResume').innerHTML = '<p style="color:#888;padding:20px">No text found. Your PDF might be image-based. Please use a text-based PDF.</p>';
    return;
  }

  // 2. Analyse
  const analysis = analyseResume(resumeText);

  // 3. Render annotated resume
  renderAnnotatedResume(resumeText, analysis);

  // 4. Render feedback
  renderFeedback(analysis.feedback);

  // 5. Render score
  renderScore(analysis.score, analysis.breakdown);

  // 6. Update score tag
  const tag = document.getElementById('scoreTag');
  tag.textContent = `Score: ${analysis.score}/100`;
  tag.className = 'tag-score ' + (analysis.score >= 75 ? 'good' : analysis.score >= 50 ? 'ok' : 'bad');
}

// ===== EXTRACT TEXT FROM PDF =====
async function extractTextFromPDF(file) {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  let text = '';
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    text += content.items.map(item => item.str).join(' ') + '\n';
  }
  return text;
}

// ===== AI ANALYSIS ENGINE =====
function analyseResume(text) {
  const feedback = [];
  const breakdown = { Impact: 0, Formatting: 0, Keywords: 0, Clarity: 0, Structure: 0 };
  const t = text.toLowerCase();

  // --- STRUCTURE ---
  const hasEducation  = /education/i.test(text);
  const hasExperience = /experience|work history/i.test(text);
  const hasSkills     = /skills|technologies|tech stack/i.test(text);
  const hasProjects   = /project/i.test(text);

  breakdown.Structure = Math.min(100, (hasEducation?25:0) + (hasExperience?35:0) + (hasSkills?20:0) + (hasProjects?20:0));

  if (!hasEducation)  feedback.push({ type:'error',   category:'Structure', title:'Missing Education Section', detail:'FAANG recruiters always look for Education. Add a dedicated section.', fix:'Add: "Education\n[University Name] — [Degree] [Year]"' });
  if (!hasExperience) feedback.push({ type:'error',   category:'Structure', title:'Missing Experience Section', detail:'No work experience section found. This is critical for FAANG applications.', fix:'Add: "Experience\n[Company] — [Role] [Dates]"' });
  if (!hasSkills)     feedback.push({ type:'warning', category:'Structure', title:'No Skills Section', detail:'A skills/tech section helps ATS parsers at FAANG companies.', fix:'Add: "Skills\nLanguages: Python, Java | Frameworks: React, Node.js"' });

  // --- IMPACT METRICS ---
  const hasMetrics = /\d+[%x]|\$[\d,]+|[\d,]+(\s)?(k|m|b|million|billion|users|customers|requests|ms|seconds|hours|days|%)/i.test(text);
  const bulletCount = (text.match(/[•\-–—◦\*]\s/g) || []).length;

  breakdown.Impact = hasMetrics ? (bulletCount >= 5 ? 90 : 70) : (bulletCount >= 3 ? 45 : 25);

  if (!hasMetrics) feedback.push({ type:'error', category:'Impact', title:'No Quantified Achievements', detail:'FAANG recruiters look for numbers. "Improved performance" is weak. "Reduced latency by 40%" is strong.', fix:'Add metrics: reduced X by Y%, improved Z from A to B, served N users' });
  else feedback.push({ type:'good', category:'Impact', title:'Quantified Achievements Found ✅', detail:'Great — you have measurable results. This is exactly what FAANG recruiters want.' });

  if (bulletCount < 3) feedback.push({ type:'warning', category:'Impact', title:'Too Few Bullet Points', detail:`Only ~${bulletCount} bullet points found. Aim for 3–5 per role, each starting with a strong action verb.`, fix:'Start bullets with: Built, Designed, Led, Optimised, Reduced, Increased, Shipped, Deployed' });

  // --- ACTION VERBS ---
  const actionVerbs = ['built','designed','led','developed','implemented','created','optimised','reduced','increased','managed','architected','deployed','shipped','launched','improved','delivered','automated','scaled','integrated','migrated'];
  const foundVerbs = actionVerbs.filter(v => t.includes(v));
  breakdown.Clarity = Math.min(100, foundVerbs.length * 12);

  if (foundVerbs.length < 4) feedback.push({ type:'warning', category:'Clarity', title:'Weak Action Verbs', detail:`Only ${foundVerbs.length} strong action verbs found. Each bullet should start with a powerful verb.`, fix:'Use: Built, Designed, Architected, Led, Scaled, Deployed, Optimised' });
  else feedback.push({ type:'good', category:'Clarity', title:'Strong Action Verbs ✅', detail:`Found ${foundVerbs.length} action verbs: ${foundVerbs.slice(0,5).join(', ')}` });

  // --- KEYWORDS ---
  const faangKeywords = ['system design','api','rest','microservice','cloud','aws','gcp','azure','docker','kubernetes','ci/cd','machine learning','sql','nosql','distributed','algorithm','data structure','git','agile','scrum'];
  const foundKeywords = faangKeywords.filter(k => t.includes(k));
  breakdown.Keywords = Math.min(100, foundKeywords.length * 8);

  if (foundKeywords.length < 4) feedback.push({ type:'warning', category:'Keywords', title:'Low FAANG Keyword Density', detail:'ATS systems at FAANG scan for tech keywords. Your resume has few.', fix:'Add relevant keywords: AWS, Docker, Kubernetes, REST API, System Design, CI/CD' });
  else feedback.push({ type:'good', category:'Keywords', title:`${foundKeywords.length} FAANG Keywords Found ✅`, detail:`Detected: ${foundKeywords.slice(0,6).join(', ')}` });

  // --- LENGTH ---
  const wordCount = text.split(/\s+/).filter(Boolean).length;
  breakdown.Formatting = 70;
  if (wordCount < 150)  { feedback.push({ type:'error',   category:'Formatting', title:'Resume Too Short', detail:`Only ~${wordCount} words. FAANG resumes should be 400–700 words (1 page dense).`, fix:'Add more experience, projects, or skills detail.' }); breakdown.Formatting = 30; }
  else if (wordCount > 900) { feedback.push({ type:'warning', category:'Formatting', title:'Resume May Be Too Long', detail:`~${wordCount} words. FAANG strongly prefers 1-page resumes for <5 years experience.`, fix:'Trim older/less relevant experience. Keep the most impactful bullets.' }); breakdown.Formatting = 55; }
  else feedback.push({ type:'good', category:'Formatting', title:'Good Resume Length ✅', detail:`~${wordCount} words — within the ideal 1-page range.` });

  // --- CONTACT INFO ---
  const hasEmail    = /[\w.]+@[\w.]+/.test(text);
  const hasLinkedIn = /linkedin/i.test(text);
  const hasGitHub   = /github/i.test(text);
  if (!hasEmail)    feedback.push({ type:'error',   category:'Formatting', title:'No Email Found', detail:'Email is mandatory. FAANG recruiters need a way to reach you.', fix:'Add your email at the top of the resume.' });
  if (!hasLinkedIn) feedback.push({ type:'warning', category:'Keywords',   title:'No LinkedIn Profile', detail:'LinkedIn URL is expected on FAANG resumes.', fix:'Add: linkedin.com/in/yourname' });
  if (!hasGitHub)   feedback.push({ type:'warning', category:'Keywords',   title:'No GitHub Profile', detail:'GitHub is important for SWE roles at FAANG.', fix:'Add: github.com/yourusername' });

  // --- OBJECTIVE / SUMMARY (negative) ---
  if (/objective|summary|i am a|i\'m a|seeking a position/i.test(text)) {
    feedback.push({ type:'warning', category:'Formatting', title:'Remove Objective/Summary', detail:'Objective statements are outdated. FAANG recruiters skip them. Use that space for more bullets.', fix:'Delete the objective section entirely.' });
    breakdown.Formatting = Math.max(0, breakdown.Formatting - 15);
  }

  // --- SCORE ---
  const score = Math.round((breakdown.Impact + breakdown.Formatting + breakdown.Keywords + breakdown.Clarity + breakdown.Structure) / 5);

  return { feedback, score, breakdown };
}

// ===== RENDER ANNOTATED RESUME =====
function renderAnnotatedResume(text, analysis) {
  const container = document.getElementById('annotatedResume');
  const lines = text.split('\n').filter(l => l.trim());

  // Build simple line-by-line HTML with highlights
  let html = '';
  let inSection = '';

  lines.forEach(line => {
    const l = line.trim();
    if (!l) return;

    // Detect section headers
    if (/^(education|experience|work history|skills|projects|certifications|awards|publications)/i.test(l)) {
      html += `<div class="section-title">${escHtml(l)}</div>`;
      inSection = l.toLowerCase();
      return;
    }

    // Highlight metrics
    let processed = escHtml(l);
    processed = processed.replace(
      /(\d+[%x]|\$[\d,]+|[\d,.]+\s?(k|m|b|million|billion|users|ms|%|requests))/gi,
      '<span class="anno-good">$1</span>'
    );

    // Highlight weak phrases
    const weakPhrases = ['responsible for', 'helped with', 'worked on', 'assisted in', 'was involved'];
    weakPhrases.forEach(phrase => {
      const re = new RegExp(phrase, 'gi');
      processed = processed.replace(re, `<span class="anno-error">$&<span class="anno-tip">⚠️ Weak phrasing — use a strong action verb instead</span></span>`);
    });

    // Highlight missing metrics warning on bullet lines
    if (/^[•\-–—\*]/.test(l) && !/\d/.test(l)) {
      processed = `<span class="anno-warning" title="Add a metric to this bullet">${processed}<span class="anno-tip">📅 Add a number: improved by X%, served N users, reduced by Yms</span></span>`;
    }

    // Name line (first non-section line, usually short and capitalised)
    if (lines.indexOf(line) === 0 || (lines.indexOf(line) < 3 && l.split(' ').length <= 4 && l === l.replace(/[^a-zA-Z ]/g,''))) {
      html += `<div class="resume-name">${processed}</div>`;
    } else if (lines.indexOf(line) < 3) {
      html += `<div class="resume-contact">${processed}</div>`;
    } else {
      html += `<div style="margin:3px 0;font-size:12px;">${processed}</div>`;
    }
  });

  container.innerHTML = html || '<p style="color:#aaa;padding:20px">Resume content displayed above.</p>';
}

// ===== RENDER FEEDBACK =====
function renderFeedback(items) {
  const icons = { error:'❌', warning:'⚠️', good:'✅' };
  const list = document.getElementById('feedbackList');
  list.innerHTML = items.map(item => `
    <div class="feedback-item">
      <span class="feedback-icon">${icons[item.type]}</span>
      <div class="feedback-text">
        <strong>${item.title}</strong>
        <p>${item.detail}</p>
        ${item.fix ? `<div class="feedback-fix">💡 Fix: ${item.fix}</div>` : ''}
      </div>
    </div>
  `).join('');
}

// ===== RENDER SCORE =====
function renderScore(score, breakdown) {
  const card = document.getElementById('scoreCard');
  card.style.display = 'block';
  document.getElementById('scoreNumber').textContent = score;

  // Animate ring
  const circumference = 264;
  const offset = circumference - (score / 100) * circumference;
  setTimeout(() => {
    document.getElementById('scoreCircle').style.strokeDashoffset = offset;
    const color = score >= 75 ? '#22c55e' : score >= 50 ? '#f59e0b' : '#ef4444';
    document.getElementById('scoreCircle').style.stroke = color;
  }, 100);

  // Breakdown bars
  document.getElementById('scoreBreakdown').innerHTML = Object.entries(breakdown).map(([k,v]) => `
    <div class="score-row">
      <span>${k}</span>
      <div class="score-bar-wrap"><div class="score-bar-fill" style="width:${v}%"></div></div>
      <span>${v}%</span>
    </div>
  `).join('');
}

function escHtml(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
