require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
const lineupRoutes = require("./routes/lineupRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// 🔹 PostgreSQL pool
const pool = new Pool({
  host: process.env.PGHOST || "localhost",
  port: process.env.PGPORT || 5433,
  user: process.env.PGUSER || "postgres",
  password: process.env.PGPASSWORD || "Grdonj24",
  database: process.env.PGDATABASE || "lineups_db",
});

// provjera konekcije
pool.connect()
  .then(() => console.log("✅ Connected to PostgreSQL"))
  .catch(err => console.error("❌ DB connection error:", err.message));

// dodaj pool globalno (da lineupRoutes može da ga koristi)
app.locals.pool = pool;

// 🔹 Rute
app.use("/api", (req, res, next) => {
  req.pool = pool;
  next();
}, lineupRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ API running on http://localhost:${PORT}`));
