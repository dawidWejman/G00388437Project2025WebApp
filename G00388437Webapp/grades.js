const express = require('express');
const router = express.Router();
const mysql = require('mysql2');

// Database connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',      // your password
  database: 'your_db_name'
});

// Get Grades Page
router.get('/', (req, res) => {
  const query = `
    SELECT s.sid, s.name AS student_name, m.name AS module_name, g.grade
    FROM student s
    LEFT JOIN grades g ON s.sid = g.sid
    LEFT JOIN module m ON g.mid = m.mid
    ORDER BY s.name ASC, g.grade ASC
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error(err);
      return res.send('Database error');
    }

    // Transform data into nested structure
    const students = [];
    const map = new Map();

    results.forEach(row => {
      if (!map.has(row.sid)) {
        map.set(row.sid, { name: row.student_name, modules: [] });
        students.push(map.get(row.sid));
      }
      if (row.module_name) {
        map.get(row.sid).modules.push({ name: row.module_name, grade: row.grade });
      }
    });

    res.render('grades', { students });
  });
});

module.exports = router;
