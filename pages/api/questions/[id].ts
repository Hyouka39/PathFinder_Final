import { NextApiRequest, NextApiResponse } from 'next';
import sqlite3 from 'sqlite3';

const retryQuery = (db: sqlite3.Database, query: string, params: any[], retries: number, callback: (err: Error | null, result?: any) => void) => {
  let attemptCount = 0;

  const attempt = function () {
    db.run(query, params, function (err) {
      if (err && err.message.includes('SQLITE_BUSY') && attemptCount < retries) {
        const delay = Math.pow(2, attemptCount) * 100; // Exponential backoff
        console.warn(`Database is busy, retrying in ${delay}ms... (Attempt ${attemptCount + 1}/${retries})`);
        attemptCount++;
        setTimeout(() => attempt(), delay);
      } else {
        callback(err, this); // Use `this` from the SQLite context
      }
    });
  };

  attempt();
};

const retryGetQuery = (db: sqlite3.Database, query: string, params: any[], retries: number, callback: (err: Error | null, result?: any) => void) => {
  let attemptCount = 0;

  const attempt = function () {
    db.get(query, params, function (err, row) {
      if (err && err.message.includes('SQLITE_BUSY') && attemptCount < retries) {
        const delay = Math.pow(2, attemptCount) * 100; // Exponential backoff
        console.warn(`Database is busy, retrying in ${delay}ms... (Attempt ${attemptCount + 1}/${retries})`);
        attemptCount++;
        setTimeout(() => attempt(), delay);
      } else {
        callback(err, row);
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

      const { id } = req.query;

      if (req.method === 'PUT') {
        const { text } = req.body;
        if (!text || typeof text !== 'string') {
          res.status(400).json({ error: 'Invalid question text.' });
          db.close((closeErr) => {
            if (closeErr) console.error('Error closing database (PUT):', closeErr.message);
          });
          return;
        }

        retryGetQuery(db, 'SELECT * FROM questions WHERE id = ?', [id], 10, (err, row) => {
          if (err) {
            console.error('Database error (GET before PUT):', err.message);
            res.status(500).json({ error: 'Failed to retrieve question.', details: err.message });
            db.close((closeErr) => {
              if (closeErr) console.error('Error closing database (GET before PUT):', closeErr.message);
            });
            return;
          }

          if (!row) {
            res.status(404).json({ error: 'Question not found.' });
            db.close((closeErr) => {
              if (closeErr) console.error('Error closing database (PUT):', closeErr.message);
            });
            return;
          }

          retryQuery(db, 'UPDATE questions SET text = ? WHERE id = ?', [text, id], 10, (err) => {
            if (err) {
              console.error('Database error (PUT):', err.message);
              res.status(500).json({ error: 'Failed to update question.', details: err.message });
            } else {
              res.status(200).json({ id, text });
            }
            db.close((closeErr) => {
              if (closeErr) console.error('Error closing database (PUT):', closeErr.message);
            });
          });
        });
      } else if (req.method === 'DELETE') {
        const questionId = parseInt(id as string, 10); // Ensure `id` is parsed as an integer
        if (isNaN(questionId)) {
          res.status(400).json({ error: 'Invalid question ID.' });
          db.close((closeErr) => {
            if (closeErr) console.error('Error closing database (DELETE):', closeErr.message);
          });
          return;
        }

        retryQuery(db, 'DELETE FROM questions WHERE id = ?', [questionId], 10, (err) => {
          if (err) {
            console.error('Database error (DELETE):', err.message);
            if (err.message.includes('SQLITE_BUSY')) {
              res.status(503).json({ error: 'Database is busy. Please try again later.' });
            } else {
              res.status(500).json({ error: 'Failed to delete question.', details: err.message });
            }
          } else {
            res.status(204).end(); // Respond with 204 No Content
          }
          db.close((closeErr) => {
            if (closeErr) console.error('Error closing database (DELETE):', closeErr.message);
          });
        });
      } else {
        res.setHeader('Allow', ['PUT', 'DELETE']);
        res.status(405).json({ error: `Method ${req.method} Not Allowed` });
        db.close((closeErr) => {
          if (closeErr) console.error('Error closing database (METHOD NOT ALLOWED):', closeErr.message);
        });
      }
    });
  });
}
