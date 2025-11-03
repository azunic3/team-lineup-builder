require("dotenv").config();
const express = require("express");
const cors = require("cors");
const pool = require('./db');


const app = express();


async function ensureSchema() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS players (
        id SERIAL PRIMARY KEY,
        full_name TEXT UNIQUE NOT NULL
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS lineups (
        id SERIAL PRIMARY KEY,
        sport TEXT NOT NULL
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS lineup_players (
        lineup_id INT REFERENCES lineups(id) ON DELETE CASCADE,
        player_id INT REFERENCES players(id) ON DELETE CASCADE,
        PRIMARY KEY(lineup_id, player_id)
      );
    `);

    console.log("Database tables checked/created successfully.");
  } catch (err) {
    console.error(" Error creating tables:", err.message);
  }
}

const corsOptions = {
  origin: ["http://localhost:5173"], 
};
app.use(cors(corsOptions));
app.use(express.json());

app.get("/api", (req, res) => {
  res.json({ test: ["1", "2", "3"] });
});

(async () => {
  await ensureSchema();
  const port = Number(process.env.PORT || 3000);
  app.listen(port, () => console.log(`API listening on http://localhost:${port}`));
})();
