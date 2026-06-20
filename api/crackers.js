// Vercel serverless API — /api/crackers
// Uses in-memory seed data (swap for a real DB like PlanetScale/Supabase in prod)

const CRACKERS = [
  { id:1, name:'Priya Sharma',  college:'IIT Delhi',      company:'Google',    role:'SWE', yoe:0, year:2023, tip:'Focus on system design + LeetCode mediums. Mock interviews were key.',           linkedin:'https://linkedin.com' },
  { id:2, name:'Rahul Gupta',   college:'BITS Pilani',    company:'Meta',      role:'ML',  yoe:2, year:2024, tip:'ML design rounds at Meta are underrated. Study ML system design deeply.',        linkedin:'https://linkedin.com' },
  { id:3, name:'Ananya Iyer',   college:'NIT Trichy',     company:'Amazon',    role:'SWE', yoe:1, year:2024, tip:'STAR format for behavioral rounds. Leadership principles are key at Amazon.',    linkedin:'' },
  { id:4, name:'Karan Mehta',   college:'IIT Bombay',     company:'Microsoft', role:'SWE', yoe:3, year:2023, tip:'Microsoft cares more about communication. Think out loud.',                       linkedin:'https://linkedin.com' },
  { id:5, name:'Sneha Nair',    college:'IIIT Hyderabad', company:'Apple',     role:'SWE', yoe:2, year:2024, tip:"Apple's hardware-software integration questions are unique. Study their products.", linkedin:'' },
  { id:6, name:'Arjun Singh',   college:'DTU Delhi',      company:'OpenAI',    role:'ML',  yoe:4, year:2025, tip:'Deep understanding of transformers and RLHF got me through. Read papers.',       linkedin:'https://linkedin.com' }
];

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'GET') {
    const { company, role, search } = req.query;
    let data = [...CRACKERS];
    if (company) data = data.filter(p => p.company === company);
    if (role)    data = data.filter(p => p.role === role);
    if (search)  {
      const s = search.toLowerCase();
      data = data.filter(p => p.name.toLowerCase().includes(s) || p.college.toLowerCase().includes(s));
    }
    return res.status(200).json({ success: true, data, total: data.length });
  }

  if (req.method === 'POST') {
    const { name, college, company, role, yoe, year, tip, linkedin } = req.body || {};
    if (!name || !college || !company) {
      return res.status(400).json({ success: false, error: 'name, college, company are required' });
    }
    // In production, save to a DB here
    return res.status(200).json({ success: true, message: 'Submitted! Pending review.' });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
