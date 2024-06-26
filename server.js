const express = require('express');
const fs = require('fs');
const path = require('path');
const moment = require('moment');

const app = express();
const port = 3000;

// Endpoint to create a text file with the current timestamp
app.post('/create-file', (req, res) => {
    const directory = req.query.directory;

    if (!directory) {
        return res.status(400).send('Directory name is required');
    }

    const folderPath = path.join(__dirname, directory);

    // Ensure the directory exists
    if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
    }

    const timestamp = moment().format('YYYY-MM-DD HH:mm:ss');
    const filename = moment().format('YYYY-MM-DD_HH-mm-ss') + '.txt';
    const filePath = path.join(folderPath, filename);

    fs.writeFile(filePath, timestamp, (err) => {
        if (err) {
            return res.status(500).send('Error creating file');
        }
        res.status(201).send(`File created: ${filename}`);
    });
});

// Endpoint to retrieve all text files in the folder
app.get('/list-files', (req, res) => {
    const directory = req.query.directory;

    if (!directory) {
        return res.status(400).send('Directory name is required');
    }

    const folderPath = path.join(__dirname, directory);

    if (!fs.existsSync(folderPath)) {
        return res.status(400).send('Directory does not exist');
    }

    fs.readdir(folderPath, (err, files) => {
        if (err) {
            return res.status(500).send('Error reading directory');
        }
        const textFiles = files.filter(file => path.extname(file) === '.txt');
        res.status(200).json(textFiles);
    });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
