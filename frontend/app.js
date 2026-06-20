const PROFILES = [
  { id:1, name:'Priya Sharma',  college:'IIT Delhi',      company:'Google',    role:'SWE', yoe:0, year:2023, tip:'Focus on system design + LeetCode mediums. Mock interviews were key.',          linkedin:'https://linkedin.com' },
  { id:2, name:'Rahul Gupta',   college:'BITS Pilani',    company:'Meta',      role:'ML',  yoe:2, year:2024, tip:'ML design rounds at Meta are underrated. Study ML system design deeply.',       linkedin:'https://linkedin.com' },
  { id:3, name:'Ananya Iyer',   college:'NIT Trichy',     company:'Amazon',    role:'SWE', yoe:1, year:2024, tip:'STAR format for behavioral rounds. Leadership principles are key at Amazon.',   linkedin:'' },
  { id:4, name:'Karan Mehta',   college:'IIT Bombay',     company:'Microsoft', role:'SWE', yoe:3, year:2023, tip:'Microsoft cares more about communication. Think out loud.',                      linkedin:'https://linkedin.com' },
  { id:5, name:'Sneha Nair',    college:'IIIT Hyderabad', company:'Apple',     role:'SWE', yoe:2, year:2024, tip:"Apple's hardware-software integration questions are unique. Study their products.", linkedin:'' },
  { id:6, name:'Arjun Singh',   college:'DTU Delhi',      company:'OpenAI',   role:'ML',  yoe:4, year:2025, tip:'Deep understanding of transformers and RLHF got me through. Read papers.',      linkedin:'https://linkedin.com' }
];

const COMPANY_COLORS = { Google:'#ea4335', Meta:'#0081fb', Amazon:'#ff9900', Apple:'#555', Netflix:'#e50914', Microsoft:'#00a4ef', OpenAI:'#10a37f' };
const ROLE_LABELS = { SWE:'Software Engineer', ML:'ML Engineer', PM:'Product Manager', DS:'Data Scientist' };

function renderProfiles(profiles) {
  const grid = document.getElementById('profiles-grid');
  if (!profiles.length) { grid.innerHTML = '<p style="text-align:center;color:#aaa;padding:40px;grid-column:1/-1;">No profiles found.</p>'; return; }
  grid.innerHTML = profiles.map(p => `
    <div class="profile-card">
      <div class="company-badge" style="background:${COMPANY_COLORS[p.company]}20;color:${COMPANY_COLORS[p.company]}">${p.company}</div>
      <h3>${p.name}</h3>
      <div class="college">🎓 ${p.college}</div>
      <span class="role-badge">${ROLE_LABELS[p.role] || p.role}</span>
      ${p.tip ? `<div class="tip">"${p.tip}"</div>` : ''}
      <div class="meta">${p.yoe > 0 ? `${p.yoe} yr${p.yoe>1?'s':''} exp • ` : 'Fresh grad • '}Offer: ${p.year}</div>
      ${p.linkedin ? `<a class="linkedin-link" href="${p.linkedin}" target="_blank">View LinkedIn →</a>` : ''}
    </div>
  `).join('');
}

function applyFilters() {
  const company = document.getElementById('filter-company').value;
  const role    = document.getElementById('filter-role').value;
  const search  = document.getElementById('filter-search').value.toLowerCase();
  renderProfiles(PROFILES.filter(p =>
    (!company || p.company === company) &&
    (!role    || p.role    === role)    &&
    (!search  || p.name.toLowerCase().includes(search) || p.college.toLowerCase().includes(search))
  ));
}

document.getElementById('filter-company').addEventListener('change', applyFilters);
document.getElementById('filter-role').addEventListener('change', applyFilters);
document.getElementById('filter-search').addEventListener('input', applyFilters);

document.getElementById('submitForm').addEventListener('submit', function(e) {
  e.preventDefault();
  e.target.reset();
  document.getElementById('form-success').style.display = 'block';
  setTimeout(() => { document.getElementById('form-success').style.display = 'none'; }, 4000);
});

document.getElementById('stat-total').textContent = PROFILES.length;
document.getElementById('stat-avg-yoe').textContent = (PROFILES.reduce((s,p)=>s+p.yoe,0)/PROFILES.length).toFixed(1);
renderProfiles(PROFILES);
