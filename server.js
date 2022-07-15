const express = require('express');
const fs = require('fs');
const path = require('path');
const { listenerCount } = require('process');

// Setting PORT
const PORT = process.env.PORT || 3001;
// Express app
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// GET routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'));
});

app.get('/notes', (req,res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'));
});

app.get('/api/notes', (req,res) => {
    res.sendFile(path.join(__dirname, './db/db.json'));
});

app.get('api/notes/:id', (req,res) => {
    let noteText = JSON.parse(fs.readFileSync('./db/db.json', "utf-8"));
    let noteID = (req.params.id);
    res.json(noteText[Number(noteID)]);
})

// Wildcard route to homepage
app.get('*', (req,res) => {
    res.sendFile(path.join(__dirname, '/public/pages/index.html'));
});

// creates and saves new note
app.post('/api/notes', (req, res) => {
    let noteText = JSON.parse(fs.readFileSync('./db/db.json', "utf-8"));
    req.body.id = (noteText.length).toString();
    noteText.push(req.body);
    fs.writeFileSync('./db/db.json', JSON.stringify(noteText));
    console.log("Note has been saved!");
    res.json(noteText);
});

// BONUS: Delete method which deletes the note
app.delete('/api/notes/:id', (req,res) => {
    let noteText = JSON.parse(fs.readFileSync('./db/db.json', "utf-8"));
    let noteID = (req.params.id);
    let newID = 0;
    console.log("Note has been deleted!");
    noteText = noteText.filter(currentNote => {
        return currentNote.id != noteID;
    })
    for (currNote of noteText) {
        currNote.id = newID.toString();
        newID++;
    }
    fs.writeFileSync('./db/db.json', JSON.stringify(noteText));
    res.json(noteText);
});

app.listen(PORT, () => {
    console.log(`Server listening on port: http://localhost:${PORT}`);
});





