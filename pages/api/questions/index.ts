import { NextApiRequest, NextApiResponse } from 'next';
import sqlite3 from 'sqlite3';

const retryQuery = (db: sqlite3.Database, query: string, params: any[], retries: number, callback: (err: Error | null, result?: any) => void) => {
  let attemptCount = 0;

  const attempt = function () {
    db.run(query, params, function (err) {
      if (err && err.message.includes('SQLITE_BUSY') && attemptCount < retries) {
        const delay = Math.pow(2, attemptCount) * 200; // Increase delay to 200ms, 400ms, etc.
        console.warn(`Database is busy, retrying in ${delay}ms... (Attempt ${attemptCount + 1}/${retries})`);
        attemptCount++;
        setTimeout(() => attempt(), delay);
      } else {
        callback(err, { lastID: this?.lastID }); // Pass `lastID` explicitly
      }
    });
  };

  attempt();
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const db = new sqlite3.Database('database/questions.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
      console.error('Failed to connect to the database:', err.message);
      res.status(500).json({ error: 'Failed to connect to the database.' });
      return;
    }

    db.run('PRAGMA busy_timeout = 5000', (timeoutErr) => {
      if (timeoutErr) {
        console.error('Failed to set busy timeout:', timeoutErr.message);
        res.status(500).json({ error: 'Failed to set busy timeout.' });
        db.close();
        return;
      }

      if (req.method === 'GET') {
        db.all('SELECT id, text FROM questions', (err, rows) => {
          if (err) {
            console.error('Database error (GET):', err.message);
            res.status(500).json({ error: 'Failed to fetch questions.', details: err.message });
          } else {
            res.status(200).json(rows || []); // Ensure rows is always an array
          }
          db.close((closeErr) => {
            if (closeErr) console.error('Error closing database (GET):', closeErr.message);
          });
        });
      } else if (req.method === 'POST') {
        const { text } = req.body;
        if (!text || typeof text !== 'string') {
          res.status(400).json({ error: 'Invalid question text.' });
          db.close((closeErr) => {
            if (closeErr) console.error('Error closing database (POST):', closeErr.message);
          });
          return;
        }

        retryQuery(db, 'INSERT INTO questions (text) VALUES (?)', [text], 10, (err, result) => {
          if (err) {
            console.error('Database error (POST):', err.message);
            res.status(500).json({ error: 'Failed to add question.', details: err.message });
          } else {
            res.status(201).json({ id: result.lastID, text }); // Use `result.lastID`
          }
          db.close((closeErr) => {
            if (closeErr) console.error('Error closing database (POST):', closeErr.message);
          });
        });
      } else {
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).json({ error: `Method ${req.method} Not Allowed` });
        db.close((closeErr) => {
          if (closeErr) console.error('Error closing database (METHOD NOT ALLOWED):', closeErr.message);
        });
      }
    });
  });

  // Ensure a fallback response in case of unexpected errors
  setTimeout(() => {
    if (!res.headersSent) {
      console.error('API did not send a response in time.');
      res.status(500).json({ error: 'API did not send a response in time.' });
    }
  }, 10000); // 10-second timeout
}
