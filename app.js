
const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser')
const PORT = process.env.PORT || 5000;

const { Pool } = require('pg');
const pool = new Pool({
	connectionString: process.env.DATABASE_URL,
	ssl: {
		rejectUnauthorized: false
	}
});

app.use(express.static(path.join(__dirname, '/')))
app.use(bodyParser.urlencoded({ extended: true }))
app.set('views', path.join(__dirname, '/'))
app.set('view engine', 'ejs')


app.get('/', async (req, res) => {
	try {
		const client = await pool.connect();
		const result = await client.query('SELECT * FROM winners_table');
		const results = { 'results': (result) ? result.rows : null};
		res.render('index', results );
		client.release();
	} catch (err) {
		console.error(err);
		res.send("Error " + err);
	}
})

app.listen(PORT, () => console.log(`Listening on ${PORT}`))