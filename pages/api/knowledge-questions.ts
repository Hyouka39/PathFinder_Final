import { NextApiRequest, NextApiResponse } from 'next';
import sqlite3 from 'sqlite3';

const db = new sqlite3.Database('database/questions.db', sqlite3.OPEN_READWRITE, (err) => {
  if (err) {
    console.error('Failed to connect to the database:', err.message);
  }
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method === 'GET') {
    db.all('SELECT * FROM knowledge_questions', (err, rows) => {
      if (err) {
        console.error('Failed to fetch questions:', err.message);
        return res.status(500).json({ error: 'Failed to fetch questions' });
      }
      res.status(200).json(rows);
    });
  } else if (req.method === 'POST') {
    const { category, text, options, correctAnswer } = req.body;
    if (!category || !text || !options || !correctAnswer) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const query = `
      INSERT INTO knowledge_questions (category, text, options, correctAnswer)
      VALUES (?, ?, ?, ?)
    `;
    db.run(query, [category, text, JSON.stringify(options), correctAnswer], function (err) {
      if (err) {
        console.error('Failed to create question:', err.message);
        return res.status(500).json({ error: 'Failed to create question' });
      }
      res.status(201).json({ id: this.lastID, category, text, options, correctAnswer });
    });
  } else if (req.method === 'PUT') {
    const { category, text, options, correctAnswer } = req.body;
    if (!id || !category || !text || !options || !correctAnswer) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const query = `
      UPDATE knowledge_questions
      SET category = ?, text = ?, options = ?, correctAnswer = ?
      WHERE id = ?
    `;
    db.run(query, [category, text, JSON.stringify(options), correctAnswer, id], function (err) {
      if (err) {
        console.error('Failed to update question:', err.message);
        return res.status(500).json({ error: 'Failed to update question' });
      }
      res.status(200).json({ id, category, text, options, correctAnswer });
    });
  } else if (req.method === 'DELETE') {
    if (!id) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const query = 'DELETE FROM knowledge_questions WHERE id = ?';
    db.run(query, [id], function (err) {
      if (err) {
        console.error('Failed to delete question:', err.message);
        return res.status(500).json({ error: 'Failed to delete question' });
      }
      res.status(204).end();
    });
  } else {
    res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
