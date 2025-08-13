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

// Connect to my database
db.connect(err => {
    if (err) {
        console.error('MySQL connection error:', err);
    } else {
        console.log('Connected to MySQL database');
    }
});


router.use(express.urlencoded({ extended: true }));

// Show all students
router.get('/', (req, res) => {
    db.query('SELECT * FROM student ORDER BY sid ASC', (err, results) => {
        if (err) return res.status(500).send('Database error: ' + err.message);
        res.render('students', { students: results, editStudent: null });
    });
});

// Show edit form under the page of all students 
router.get('/edit/:sid', (req, res) => {
    const sid = req.params.sid;
    db.query('SELECT * FROM student WHERE sid = ?', [sid], (err, studentResult) => {
        if (err) return res.status(500).send('Database error: ' + err.message);
        if (!studentResult.length) return res.status(404).send('Student not found');

        db.query('SELECT * FROM student ORDER BY sid ASC', (err2, allStudents) => {
            if (err2) return res.status(500).send('Database error: ' + err2.message);
            res.render('students', { students: allStudents, editStudent: studentResult[0] });
        });
    });
});

// Add new students
router.post('/add', (req, res) => {
    const { sid, name, age } = req.body;
    if (!sid || !name || !age) return res.status(400).send('SID, name, and age are required');

    db.query('INSERT INTO student (sid, name, age) VALUES (?, ?, ?)', [sid, name, age], (err) => {
        if (err) return res.status(500).send('Database error');
        res.redirect('/students');
    });
});

// Update students
router.post('/update/:sid', (req, res) => {
    const sid = req.params.sid;
    const { name, age } = req.body;

    if (!name || !age) {
        return res.status(400).send('Name and age are required');
    }

    db.query('UPDATE student SET name = ?, age = ? WHERE sid = ?', [name, age, sid], (err) => {
        if (err) return res.status(500).send('Database error: ' + err.message);
        res.redirect('/students');
    });
});

// Delete student
router.get('/delete/:sid', (req, res) => {
    const sid = req.params.sid;
    db.query('DELETE FROM student WHERE sid = ?', [sid], (err) => {
        if (err) return res.status(500).send('Database error: ' + err.message);
        res.redirect('/students');
    });
});

module.exports = router;
