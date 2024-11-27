import Database from 'better-sqlite3';
import { join } from 'path';

const db = new Database(join(process.cwd(), 'documents.db'));

// Create tables if they don't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS documents (
    id TEXT PRIMARY KEY,
    fileName TEXT NOT NULL,
    fileType TEXT NOT NULL,
    fileSize INTEGER NOT NULL,
    originalUrl TEXT NOT NULL,
    jsonOutput TEXT NOT NULL,
    invoiceAmount REAL,
    processedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    status TEXT DEFAULT 'pending',
    error TEXT
  )
`);

export { db };