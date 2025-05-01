const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Ensure the database path is correct
const dbPath = path.resolve('database/questions.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Failed to connect to the database:', err.message);
  } else {
    console.log('Connected to the database at:', dbPath);
  }
});

export default async function handler(req, res) {
  const { method } = req;

  if (method === 'GET') {
    const { strand, grade_level, semester } = req.query;

    console.log('Received Query Parameters:', { strand, grade_level, semester });

    if (!strand || !grade_level || !semester) {
      console.error('Missing required query parameters');
      return res.status(400).json({ error: 'Missing required query parameters' });
    }

    const gradeLevel = parseInt(grade_level, 10);
    const semesterInt = parseInt(semester, 10);

    if (isNaN(gradeLevel) || isNaN(semesterInt)) {
      console.error('Invalid grade_level or semester');
      return res.status(400).json({ error: 'Invalid grade_level or semester' });
    }

    const query = `
      SELECT subject 
      FROM scholastic_records 
      WHERE strand = ? AND grade_level = ? AND semester = ?
    `;

    console.log('Executing Query:', { query, params: [strand, gradeLevel, semesterInt] });

    db.all(query, [strand, gradeLevel, semesterInt], (err, rows) => {
      if (err) {
        console.error('Database Error:', err.message);
        return res.status(500).json({ error: 'Failed to fetch subjects' });
      }

      console.log('Rows Retrieved:', rows);

      if (rows.length === 0) {
        console.warn('No subjects found for the given parameters:', { strand, gradeLevel, semesterInt });
        return res.status(404).json({ error: 'No subjects found for the given parameters' });
      }

      const subjects = rows.map((row) => row.subject);
      console.log('Subjects Retrieved:', subjects);
      res.status(200).json(subjects);
    });
  } else if (method === 'POST') {
    const { strand, grade_level, semester, subject } = req.body;
    console.log('Received Body Parameters for POST:', { strand, grade_level, semester, subject });
    db.run(
      `INSERT INTO scholastic_records (strand, grade_level, semester, subject) VALUES (?, ?, ?, ?)`,
      [strand, grade_level, semester, subject],
      function (err) {
        if (err) {
          console.error('Failed to add subject:', err.message);
          return res.status(500).json({ error: 'Failed to add subject' });
        }
        console.log('Subject Added Successfully:', { id: this.lastID });
        res.status(201).json({ id: this.lastID });
      }
    );
  } else if (method === 'DELETE') {
    const { strand, grade_level, semester, subject } = req.body;
    console.log('Received Body Parameters for DELETE:', { strand, grade_level, semester, subject });
    db.run(
      `DELETE FROM scholastic_records WHERE strand = ? AND grade_level = ? AND semester = ? AND subject = ?`,
      [strand, grade_level, semester, subject],
      function (err) {
        if (err) {
          console.error('Failed to delete subject:', err.message);
          return res.status(500).json({ error: 'Failed to delete subject' });
        }
        console.log('Subject Deleted Successfully');
        res.status(204).end();
      }
    );
  } else if (method === 'PUT') {
    const { strand, grade_level, semester, oldSubject, newSubject } = req.body;
    console.log('Received Body Parameters for PUT:', { strand, grade_level, semester, oldSubject, newSubject });
    db.run(
      `UPDATE scholastic_records SET subject = ? WHERE strand = ? AND grade_level = ? AND semester = ? AND subject = ?`,
      [newSubject, strand, grade_level, semester, oldSubject],
      function (err) {
        if (err) {
          console.error('Failed to edit subject:', err.message);
          return res.status(500).json({ error: 'Failed to edit subject' });
        }
        console.log('Subject Updated Successfully');
        res.status(200).json({ message: 'Subject updated successfully' });
      }
    );
  } else {
    res.setHeader('Allow', ['GET', 'POST', 'DELETE', 'PUT']);
    console.error(`Method ${method} Not Allowed`);
    res.status(405).end(`Method ${method} Not Allowed`);
  }
}
