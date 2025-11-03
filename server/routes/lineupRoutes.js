const express = require("express");
const router = express.Router();
const bannedLastNames = require("../blacklist");

//get sports
router.get("/sports", async (req, res) => {
  const pool = req.pool;
  try {
    const result = await pool.query(
      "SELECT DISTINCT sport FROM players ORDER BY sport;"
    );
    res.json(result.rows.map((r) => r.sport));
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

//add new player
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

    // ako je nov, dodaj ga i u stats tabelu
    if (insert.rows.length > 0) {
      const playerId = insert.rows[0].id;
      await pool.query(
        "INSERT INTO player_stats (player_id, count) VALUES ($1, 0) ON CONFLICT DO NOTHING;",
        [playerId]
      );
    }

    res.json(insert.rows[0]);
  } catch (err) {
    console.error("Error adding player:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// submit
router.post("/lineup", async (req, res) => {
  const pool = req.pool;
  const { sport, players } = req.body;

  try {
    // provjera blacklist prezimena (case-insensitive, uzimamo zadnju riječ kao prezime)
    const bannedSet = new Set(bannedLastNames.map((x) => x.toLowerCase()));
    const hasBanned = (players || []).some((name) => {
      const last = String(name).trim().split(/\s+/).pop().toLowerCase();
      return bannedSet.has(last);
    });

    if (hasBanned) {
      return res.status(400).json({
        error:
          "Some players have banned last names and cannot be added to the lineup.",
      });
    }

    // napravi lineup
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

        // povećaj broj uključivanja
        // osiguraj da red postoji u player_stats
        await pool.query(
          `INSERT INTO player_stats (player_id, count)
     VALUES ($1, 0)
     ON CONFLICT (player_id) DO NOTHING;`,
          [playerId]
        );

        // povećaj broj uključivanja
        await pool.query(
          "UPDATE player_stats SET count = count + 1 WHERE player_id = $1;",
          [playerId]
        );
      }
    }

    res.json({ success: true });
  } catch (err) {
    console.error("Error submitting lineup:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// get top players
router.get("/top-players", async (req, res) => {
  const pool = req.pool;
  try {
    const result = await pool.query(`
        SELECT p.full_name, ps.count
        FROM player_stats ps
        JOIN players p ON ps.player_id = p.id
        ORDER BY ps.count DESC, p.full_name ASC
        LIMIT 10;
      `);
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching top players:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
