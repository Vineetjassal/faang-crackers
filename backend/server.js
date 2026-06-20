const express = require('express');
const cors    = require('cors');
const Database = require('better-sqlite3');
const path    = require('path');

const app  = express();
const PORT = process.env.PORT || 3000;

const db = new Database(path.join(__dirname, 'db', 'faang_crackers.db'));

db.exec(`
  CREATE TABLE IF NOT EXISTS crackers (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    name       TEXT    NOT NULL,
    college    TEXT    NOT NULL,
    company    TEXT    NOT NULL,
    role       TEXT,
    yoe        INTEGER DEFAULT 0,
    year       INTEGER,
    tip        TEXT,
    linkedin   TEXT,
    verified   INTEGER DEFAULT 0,
    created_at TEXT    DEFAULT (datetime('now'))
  );
`);

const count = db.prepare('SELECT COUNT(*) as c FROM crackers').get();
if (count.c === 0) {
  const ins = db.prepare('INSERT INTO crackers (name,college,company,role,yoe,year,tip,linkedin,verified) VALUES (?,?,?,?,?,?,?,?,1)');
  [
    ['Priya Sharma','IIT Delhi','Google','SWE',0,2023,'Focus on system design + LeetCode mediums.','https://linkedin.com'],
    ['Rahul Gupta','BITS Pilani','Meta','ML',2,2024,'ML design rounds at Meta are underrated.','https://linkedin.com'],
    ['Ananya Iyer','NIT Trichy','Amazon','SWE',1,2024,'STAR format for behavioral rounds.',''],
    ['Karan Mehta','IIT Bombay','Microsoft','SWE',3,2023,'Microsoft cares about communication.','https://linkedin.com'],
    ['Sneha Nair','IIIT Hyderabad','Apple','SWE',2,2024,'Study Apple products deeply.',''],
    ['Arjun Singh','DTU Delhi','OpenAI','ML',4,2025,'Deep understanding of transformers is key.','https://linkedin.com'],
  ].forEach(r => ins.run(...r));
  console.log('✅ DB seeded');
}

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

app.get('/api/crackers', (req, res) => {
  const { company, role, search } = req.query;
  let q = 'SELECT * FROM crackers WHERE verified=1';
  const p = [];
  if (company) { q += ' AND company=?'; p.push(company); }
  if (role)    { q += ' AND role=?';    p.push(role); }
  if (search)  { q += ' AND (name LIKE ? OR college LIKE ?)'; p.push(`%${search}%`,`%${search}%`); }
  q += ' ORDER BY created_at DESC';
  res.json({ success:true, data: db.prepare(q).all(...p) });
});

app.post('/api/crackers', (req, res) => {
  const { name, college, company, role, yoe, year, tip, linkedin } = req.body;
  if (!name || !college || !company) return res.status(400).json({ success:false, error:'name, college, company are required' });
  const r = db.prepare('INSERT INTO crackers (name,college,company,role,yoe,year,tip,linkedin) VALUES (?,?,?,?,?,?,?,?)').run(name,college,company,role||null,yoe||0,year||null,tip||null,linkedin||null);
  res.json({ success:true, id:r.lastInsertRowid, message:'Submitted! Pending review.' });
});

app.get('/api/stats', (req, res) => {
  const total    = db.prepare('SELECT COUNT(*) as c FROM crackers WHERE verified=1').get().c;
  const companies = db.prepare('SELECT COUNT(DISTINCT company) as c FROM crackers WHERE verified=1').get().c;
  const avgYoe   = db.prepare('SELECT AVG(yoe) as a FROM crackers WHERE verified=1').get().a || 0;
  res.json({ total, companies, avgYoe: avgYoe.toFixed(1) });
});

app.listen(PORT, () => console.log(`🚀 FAANG Crackers running on http://localhost:${PORT}`));
