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

    // app.set('view engine', 'ejs');
    // app.set('views', __dirname + '/views');
    // Question 1 goes here
    app.get('/patients', (req,res) => {
        db.query('SELECT patient_id, first_name, last_name, date_of_birth FROM patients', (err, results) => {
                if (err){
                    console.error(err);
                    res.status(500).send('Error receiving data');
                } else {
                    res.status(200).send(results);
                }
            }
        )
    });
    // // Question 2 goes here
    app.get('/providers', (req,res) => {
        db.query('SELECT first_name, last_name, provider_specialty FROM providers', (err, results) => {
                if (err){
                    console.error(err);
                    res.status(500).send('Error receiving data');
                } else {
                    res.status(200).send(results);
                }
            }
        )
    });
    // Question 3 goes here
    app.get('/patients/first-name/:firstName' ,(req, res) => {
        const firstName = req.params.firstName;
        const query = 'SELECT patient_id, first_name, last_name, date_of_birth FROM patients WHERE first_name = ?'; 
    
        db.query(query, [firstName], (err,results) => {
            if (err) {
                console.error('Error retrieving patient by first_name:', err)
                return res.status(500).send('error fetching first_name')
            }
            if (results.length === 0){
                return res.status(404).send('No patients found with that name');
            }
            // res.json(results);
            res.status(200).send(results);
        })
    })
    // Question 4 goes here
    app.get('/providers/specialty/:providerSpecialty', (req,res) => {
        const providerSpecialty = req.params.providerSpecialty;
        const query = 'SELECT first_name, last_name, provider_specialty FROM providers WHERE provider_specialty = ?'
        
        db.query(query, [providerSpecialty], (err,results) => {
                if (err){
                    console.error('Error retrieving providers by first name:', err);
                    return res.status(500).send('Error fetching provider data');
                } 
                if (results.length === 0) {
                    return res.status(404).send('No provider found with that specialty');
                }
                res.status(200).send(results);
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