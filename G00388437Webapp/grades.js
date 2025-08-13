const express = require('express');
const router = express.Router();
const mysql = require('mysql2');

// Database connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',      
  password: 'root',      
  database: 'proj2024mysql' 
});

// Connect to database
db.connect(err => {
  if (err) {
    console.error('Database connection failed:', err);
  } else {
    console.log('Connected to database');
  }
});

// Grades page
router.get('/', (req, res) => {
  const query = `
    SELECT s.sid, s.name AS student_name, m.name AS module_name, g.grade
    FROM student s
    LEFT JOIN grade g ON s.sid = g.sid
    LEFT JOIN module m ON g.mid = m.mid
    ORDER BY s.name ASC, g.grade ASC
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      return res.send('Database query error. Check server logs.');
    }

   
    const students = {};
    results.forEach(row => {
      if (!students[row.sid]) {
        students[row.sid] = {
          name: row.student_name,
          grades: []
        };
      }
      if (row.module_name) {
        students[row.sid].grades.push({
          module: row.module_name,
          grade: row.grade
        });
      }
    });

    res.render('grades', { students: Object.values(students) });
  });
});

module.exports = router;
