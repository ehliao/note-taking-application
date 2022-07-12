const express = require('express');
const fs = require('fs');
const path = require('path');
const { listenerCount } = require('process');
const db = require('./db/db.json');

// Setting PORT
const PORT = 3001;
// Experss app
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// GET routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'))
});

app.get('/api/notes', (req,res) => {
    res.sendFile(path.join.apply(__dirname, '/db/db.json'))
});

app.get('/notes', (req,res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'))
});

// Wildcard route to homepage
app.get('*', (req,res) => {
    res.sendFile(path.join(__dirname, '/public/pages/index.html'))
});

// creates new note
app.post('/api/notes', (req, res) => {
    let noteList = JSON.parse(fs.readFileSync('/db/db.json', "utf-8"));
    let newNote = req.body;
    newNote.id = (noteList.length).toString();
    noteList.push(newNote);

    fs.writeFileSync('./db/db.json', JSON.stringify(noteList));
    console.log("Note Saved into db.json. NOTE: ", newNote);
    res.json(noteList);
});

// deletes the note
app.delete('/api/notes/:id', (req,res) => {
    let noteList = JSON.parse(fs.readFileSync('./db/db.json', "utf-8"));
    let noteID = (req.params.id);
    let newID = 0;
    console.log(`Deleting note ID ${noteID}`);
    noteList = noteList.filter(currentNote => {
        return currentNote.id != noteID;
    })
    for (currNote of noteList) {
        currNote.id = newID.toString();
        newID++;
    }
    fs.writeFileSync('./db/db.json', JSON.stringify(noteList));
    res.json(noteList);
});

// Listener
app.listen(PORT, () => {
    console.log(`Server listening on port: http://localhost:${PORT}`);
});






