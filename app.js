
const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser')
const PORT = process.env.PORT || 5000;

const { Pool } = require('pg');
const pool = new Pool({
	connectionString: process.env.DATABASE_URL || 'postgres://nlxytngzeyugpv:23e5c896d5a9c5e4e676838233619a7525872e9ca7986b6729b464d4f74ec0ca@ec2-3-218-75-21.compute-1.amazonaws.com:5432/d7o4qh0cnoqlk7',
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
		console.log(results);
		res.render('index', results );
		client.release();
	} catch (err) {
		console.error(err);
		res.send("Error " + err);
	}
})

app.post('/', (req, res) => {
	const text = 'INSERT INTO winners_table(name, prize) VALUES($1, $2)'
	const values = [req.body.name, req.body.prize];

	pool.query(text, values, (error, results) => {
		if (error) {
			throw error
		}
		res.redirect('back');
	})
})

app.listen(PORT, () => console.log(`Listening on ${PORT}`))