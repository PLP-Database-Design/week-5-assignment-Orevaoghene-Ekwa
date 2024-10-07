//
const express = require('express');
const app = express()
const mysql = require('mysql2')
const dotenv = require('dotenv');
const cors = require('cors');

app.use(express.json());
app.use(cors())
dotenv.config();

// Connect to database
const db = mysql.createConnection( {
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// Access database
db.connect((err) => {
    if (err) return console.log('Error connecting to Mysql db');
    console.log('Connected successfully to Mysql as id: ', db.threadId);

    app.set('view engine', 'ejs');
    app.set('views', __dirname + '/views');
    // Question 1 goes here
    app.get('/patient-data', (req,res) => {
        db.query('SELECT patient_id, first_name, last_name, date_of_birth FROM patients', (err, results) => {
                if (err){
                    console.error(err);
                    res.status(500).send('Error receiving data');
                } else {
                    res.render('patient-data', {results: results});
                }
            }
        )
    });
    // Question 2 goes here
    app.get('/provider-data', (req,res) => {
        db.query('SELECT first_name, last_name, provider_specialty FROM providers', (err, results) => {
                if (err){
                    console.error(err);
                    res.status(500).send('Error receiving data');
                } else {
                    res.render('provider-data', {results: results});
                }
            }
        )
    });
    // Question 3 goes here
    app.get('/patients-first-name', (req,res) => {
        db.query('SELECT patient_id, first_name, last_name, date_of_birth FROM patients  ORDER BY first_name', 
            (err, results) => {
                if (err){
                    console.error(err);
                    res.status(500).send('Error receiving data');
                } else {
                    res.render('patients-first-name', {results: results});
                }
            }
        )
    });
    // Question 4 goes here
    app.get('/provider-first-name', (req,res) => {
        db.query('SELECT first_name, last_name, provider_specialty FROM providers ORDER BY first_name', (err, results) => {
                if (err){
                    console.error(err);
                    res.status(500).send('Error receiving data');
                } else {
                    res.render('provider-first-name', {results: results});
                }
            }
        )
    });

    app.get("/", (req,res) => {
        res.send('Server started successfully');
    })
})


//listen to server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
    console.log('Sending message to browser...')
});