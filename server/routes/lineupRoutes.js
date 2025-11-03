const express = require("express");
const router = express.Router();

//get sports 
router.get("/sports", async (req, res) => {
  const pool = req.pool;
  try {
    const result = await pool.query("SELECT DISTINCT sport FROM players ORDER BY sport;");
    res.json(result.rows.map(r => r.sport));
  } catch (err) {
    console.error("Error fetching sports:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

//get players po sportu 
router.get("/players/:sport", async (req, res) => {
  const pool = req.pool;
  const { sport } = req.params;
  try {
    const result = await pool.query(
      "SELECT id, full_name FROM players WHERE sport = $1 ORDER BY full_name;",
      [sport]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching players:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

//add player
router.post("/players", async (req, res) => {
  const pool = req.pool;
  const { full_name, sport } = req.body;
  try {
    const insert = await pool.query(
      `INSERT INTO players (full_name, sport)
       VALUES ($1, $2)
       ON CONFLICT (full_name) DO NOTHING
       RETURNING *;`,
      [full_name, sport]
    );
    res.json(insert.rows[0]);
  } catch (err) {
    console.error("Error adding player:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

//submit 
router.post("/lineup", async (req, res) => {
  const pool = req.pool;
  const { sport, players } = req.body;
  try {
    const lineupRes = await pool.query(
      "INSERT INTO lineups (sport) VALUES ($1) RETURNING id;",
      [sport]
    );
    const lineupId = lineupRes.rows[0].id;

    for (const name of players) {
      const playerRes = await pool.query(
        "SELECT id FROM players WHERE full_name = $1 AND sport = $2;",
        [name, sport]
      );
      if (playerRes.rows.length > 0) {
        const playerId = playerRes.rows[0].id;
        await pool.query(
          "INSERT INTO lineup_players (lineup_id, player_id) VALUES ($1, $2);",
          [lineupId, playerId]
        );
        await pool.query(
          "UPDATE player_stats SET count = count + 1 WHERE player_id = $1;",
          [playerId]
        );
      }
    }
    res.json({ success: true });
  } catch (err) {
    console.error("Error saving lineup:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
