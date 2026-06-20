# 🚀 FAANG Crackers

> A community database of people who cracked **FAANG & MAANG** companies — inspired by [crackedresume.com](https://crackedresume.com)

## What is this?

**FAANG Crackers** is a platform where people who got offers from **Meta, Apple, Amazon, Netflix, Google, Microsoft** and similar top-tier companies can share their journey, resume tips, and data — helping the next generation crack the same interviews.

## Features

- 🗃️ **Database** of FAANG/MAANG offer holders
- 📄 Resume roaster (similar to crackedresume.com layout)
- 🏢 Filter by company, role, and year
- 📊 Stats dashboard
- 🔥 No login required to browse

## Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | HTML, CSS (custom), Vanilla JS |
| Backend | Node.js + Express |
| Database | SQLite (dev) / PostgreSQL (prod) |

## Project Structure

```
faang-crackers/
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── app.js
├── backend/
│   ├── server.js
│   ├── package.json
│   └── db/
│       └── schema.sql
├── data/
│   └── seed.json
└── README.md
```

## Getting Started

```bash
git clone https://github.com/Vineetjassal/faang-crackers
cd faang-crackers/backend
npm install
node server.js
# Open frontend/index.html in your browser
```

## Contributing

If you cracked a FAANG/MAANG company, open a PR adding yourself to `data/seed.json`!

---
Made with ❤️ by [Vineet Jassal](https://github.com/Vineetjassal)
