-- FAANG CRACKERS Database Schema

CREATE TABLE IF NOT EXISTS crackers (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    name       TEXT    NOT NULL,
    college    TEXT    NOT NULL,
    company    TEXT    NOT NULL CHECK(company IN ('Google','Meta','Amazon','Apple','Netflix','Microsoft','OpenAI')),
    role       TEXT    CHECK(role IN ('SWE','ML','PM','DS')),
    yoe        INTEGER DEFAULT 0,
    year       INTEGER,
    tip        TEXT,
    linkedin   TEXT,
    verified   INTEGER DEFAULT 0,
    created_at TEXT    DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_company  ON crackers(company);
CREATE INDEX IF NOT EXISTS idx_role     ON crackers(role);
CREATE INDEX IF NOT EXISTS idx_verified ON crackers(verified);

CREATE VIEW IF NOT EXISTS verified_crackers AS
  SELECT * FROM crackers WHERE verified = 1;
