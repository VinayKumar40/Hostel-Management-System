const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('Connected');
        app.post('/test-login', (req, res) => {
            res.json({ message: 'Success', body: req.body });
        });
        app.listen(5001, () => console.log('Test server on 5001'));
    })
    .catch(err => console.error(err));
