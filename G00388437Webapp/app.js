const express = require('express');
const path = require('path');

const app = express();
const port = 3004;


app.use(express.static('public'));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Home page
app.get('/', (req, res) => {
  res.render('index');
});


app.use('/students', require('./student'));
//app.use('/grades', require('./grades'));
//app.use('/lecturers', require('./lecturers'));
app.get('/test', (req, res) => {
    res.render('students', { students: [], editStudent: null });
});

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
