const express = require('express');
const { MongoClient } = require('mongodb');
const router = express.Router();

const uri = "mongodb+srv://dawidwejmangti:admin@lectures.ilpykr7.mongodb.net/?retryWrites=true&w=majority&appName=lectures";
const client = new MongoClient(uri);

// GET all lecturers, there is a spelling error in it. sorry
router.get('/', async (req, res) => {
    try {
        await client.connect();
        console.log("Connected to MongoDB");

        const db = client.db('lectures'); // 
        const collection = db.collection('lectures');

        const lecturers = await collection.find({})
            .sort({ _id: 1 })
            .toArray();

        console.log("Found lecturers:", lecturers); // DEBUG

        res.render('lecturers', { lecturers });
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).send("Database error");
    }
});

// DELETE lecturer
router.get('/delete/:id', async (req, res) => {
    try {
        await client.connect();

        const db = client.db('lectures'); // 
        const collection = db.collection('lectures');

        await collection.deleteOne({ _id: req.params.id });
        res.redirect('/lecturers');
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).send("Database error");
    }
});

module.exports = router;
