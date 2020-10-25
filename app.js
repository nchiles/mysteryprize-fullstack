const { Pool } = require('pg');
const express = require('express');
const app = express();
const path = require('path');
const bodyParser= require('body-parser')
const PORT = process.env.PORT || 5000;

app.use(express.static(path.join(__dirname, '/')))
app.use(bodyParser.urlencoded({ extended: true }))
app.set('views', path.join(__dirname, '/'))
app.set('view engine', 'ejs')


app.get('/', (req, res) => res.render('index'))

app.listen(PORT, () => console.log(`Listening on ${ PORT }`))