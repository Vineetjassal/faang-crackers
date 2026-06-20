// Vercel serverless API — /api/stats

const CRACKERS = [
  { company:'Google',    role:'SWE', yoe:0 },
  { company:'Meta',      role:'ML',  yoe:2 },
  { company:'Amazon',    role:'SWE', yoe:1 },
  { company:'Microsoft', role:'SWE', yoe:3 },
  { company:'Apple',     role:'SWE', yoe:2 },
  { company:'OpenAI',    role:'ML',  yoe:4 }
];

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const total     = CRACKERS.length;
  const companies = new Set(CRACKERS.map(p => p.company)).size;
  const avgYoe    = (CRACKERS.reduce((s, p) => s + p.yoe, 0) / total).toFixed(1);

  return res.status(200).json({ success: true, total, companies, avgYoe });
}
