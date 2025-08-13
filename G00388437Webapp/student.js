const express = require('express');
const router = express.Router();
const mysql = require('mysql2');

// MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',      
    password: 'root',       
    database: 'proj2024mysql'  
});

// Connect to database
db.connect(err => {
    if (err) {
        console.error('MySQL connection error:', err);
    } else {
        console.log('Connected to MySQL database');
    }
});

// Show all students
router.get('/', (req, res) => {
    db.query('SELECT * FROM student ORDER BY sid ASC', (err, results) => {
        if (err) throw err;
        res.render('students', { students: results, editStudent: null });
    });
});

// Show edit form
router.get('/edit/:sid', (req, res) => {
    const sid = req.params.sid;
    db.query('SELECT * FROM student WHERE sid = ?', [sid], (err, results) => {
        if (err) throw err;
        db.query('SELECT * FROM student ORDER BY sid ASC', (err2, allStudents) => {
            if (err2) throw err2;
            res.render('students', { students: allStudents, editStudent: results[0] });
        });
    });
});

// Add new student
router.post('/add', (req, res) => {
    const { name, age } = req.body;
    db.query('INSERT INTO student (name, age) VALUES (?, ?)', [name, age], (err) => {
        if (err) throw err;
        res.redirect('/students');
    });
});

// Update student
router.post('/update/:sid', (req, res) => {
    const sid = req.params.sid;
    const { name, age } = req.body;
    db.query('UPDATE student SET name = ?, age = ? WHERE sid = ?', [name, age, sid], (err) => {
        if (err) throw err;
        res.redirect('/students');
    });
});

// Delete student
router.get('/delete/:sid', (req, res) => {
    const sid = req.params.sid;
    db.query('DELETE FROM student WHERE sid = ?', [sid], (err) => {
        if (err) throw err;
        res.redirect('/students');
    });
});

module.exports = router;
