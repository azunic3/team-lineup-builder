/*tables players and lineups, relationship is many to many so we need a helping table too*/
CREATE TABLE IF NOT EXISTS players (
  id SERIAL PRIMARY KEY,
  full_name TEXT UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS lineups (
  id SERIAL PRIMARY KEY,
  sport TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS lineup_players (
  lineup_id INT REFERENCES lineups(id) ON DELETE CASCADE,
  player_id INT REFERENCES players(id) ON DELETE CASCADE,
  PRIMARY KEY(lineup_id, player_id)
);
