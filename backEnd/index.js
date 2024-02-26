const express = require('express');
const mysql = require('mysql2/promise');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 5000;

// MySQL database configuration
const db_config = {
  host: 'localhost',
  user: 'jassy',
  password: '2024_password',
  database: 'scorehub'
};

// Function to create a MySQL connection pool
async function createPool() {
  try {
    const pool = await mysql.createPool(db_config);
    console.log('Connected to MySQL database');
    return pool;
  } catch (error) {
    console.error('Error creating database connection:', error);
    throw error;
  }
}

// Route for home page
app.get('/', (req, res) => {
  // Redirect to the standings for La Liga (league_id=2) by default
  res.redirect('/scorehub/standings/2');
});

// Route for fetching standings for a specific league
app.get('/scorehub/standings/:league_id', async (req, res) => {
  try {
    const connection = await createPool();
    const [rows] = await connection.execute('SELECT * FROM standings WHERE league_id = ?', [req.params.league_id]);
    connection.end();
    res.json(rows);
  } catch (error) {
    console.error('Error fetching standings data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route for fetching teams for a specific league
app.get('/scorehub/teams/:league_id', async (req, res) => {
  try {
    const connection = await createPool();
    const [rows] = await connection.execute('SELECT * FROM teams WHERE league_id = ?', [req.params.league_id]);
    connection.end();
    res.json(rows);
  } catch (error) {
    console.error('Error fetching teams data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route for fetching fixtures for a specific league
app.get('/scorehub/fixtures/:league_id', async (req, res) => {
  try {
    const connection = await createPool();
    const [rows] = await connection.execute('SELECT * FROM fixtures WHERE league_id = ?', [req.params.league_id]);
    connection.end();
    res.json(rows);
  } catch (error) {
    console.error('Error fetching fixtures data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route for fetching matches for a specific league
app.get('/scorehub/matches/:league_id', async (req, res) => {
  try {
    const connection = await createPool();
    const [rows] = await connection.execute('SELECT * FROM matches WHERE league_id = ?', [req.params.league_id]);
    connection.end();
    res.json(rows);
  } catch (error) {
    console.error('Error fetching matches data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route for fetching news
app.get('/scorehub/news', async (req, res) => {
  try {
    const response = await axios.get('https://newsapi.org/v2/everything?q=football&apiKey=c759ee1ddcb0459fbc174c6274bb5ac0');
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching news data:', error.response.data);
    res.status(error.response.status).json({ error: 'Failed to fetch news data' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
