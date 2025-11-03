import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

export default function App() {
  const [sports, setSports] = useState([]);
  const [selectedSport, setSelectedSport] = useState("");
  const [availablePlayers, setAvailablePlayers] = useState([]);
  const [playerName, setPlayerName] = useState("");
  const [isValid, setIsValid] = useState(true);
  const [lineup, setLineup] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [typingTimeout, setTypingTimeout] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [topPlayers, setTopPlayers] = useState([]);
  const [toastMsg, setToastMsg] = useState("");

  const bannedLastNames = ["Smith", "Johnson", "Brown"];

  //load Top Players at initial mount
  useEffect(() => {
    fetchTopPlayers();
  }, []);

  //debounced validation
  useEffect(() => {
    if (playerName.trim() === "") {
      setIsValid(true);
      setErrorMsg("");
      return;
    }

    if (typingTimeout) clearTimeout(typingTimeout);
    setTypingTimeout(
      setTimeout(() => {
        const regex = /^[A-Za-z]+ [A-Za-z]+$/;
        const valid = regex.test(playerName.trim());
        setIsValid(valid);
        setErrorMsg(
          valid ? "" : "Please enter a valid full name (first and last)."
        );
      }, 300)
    );
  }, [playerName]);

  //load sports from DB
  useEffect(() => {
    fetch("http://localhost:3000/api/sports")
      .then((res) => res.json())
      .then((data) => setSports(data))
      .catch((err) => console.error("Error loading sports:", err));
  }, []);

  //load players by sport
  useEffect(() => {
    if (selectedSport) {
      fetch(`http://localhost:3000/api/players/${selectedSport}`)
        .then((res) => res.json())
        .then((data) => setAvailablePlayers(data))
        .catch((err) => console.error("Error loading players:", err));
    } else {
      setAvailablePlayers([]);
    }
  }, [selectedSport]);

  //fetch Top Players
  const fetchTopPlayers = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/top-players");
      const data = await res.json();
      setTopPlayers(data);
    } catch (err) {
      console.error("Error loading top players:", err);
    }
  };

  // add new player (validation + banned check)
  const handleAddPlayer = async () => {
    if (!playerName.trim() || !isValid || !selectedSport) return;

    const lastName = playerName.trim().split(" ").slice(-1)[0];
    if (bannedLastNames.includes(lastName)) {
      setErrorMsg(
        "This player has a banned last name and cannot be added to the lineup."
      );
      setTimeout(() => setErrorMsg(""), 4000);
      return;
    }

    const exists =
      lineup.some(
        (p) => p.full_name.toLowerCase() === playerName.toLowerCase()
      ) ||
      availablePlayers.some(
        (p) => p.full_name.toLowerCase() === playerName.toLowerCase()
      );
    if (exists) return;

    try {
      const res = await fetch("http://localhost:3000/api/players", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ full_name: playerName, sport: selectedSport }),
      });
      const newPlayer = await res.json();

      if (newPlayer) {
        setLineup((prev) =>
          [...prev, newPlayer].sort((a, b) =>
            a.full_name.localeCompare(b.full_name)
          )
        );
        setAvailablePlayers((prev) =>
          [...prev, newPlayer].sort((a, b) =>
            a.full_name.localeCompare(b.full_name)
          )
        );
      }
      setPlayerName("");
      setErrorMsg("");
    } catch (err) {
      console.error("Error adding player:", err);
    }
  };

  // submit lineup
  const handleSubmit = async () => {
    if (lineup.length < 3) return;

    try {
      setIsSubmitting(true);
      const res = await fetch("http://localhost:3000/api/lineup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sport: selectedSport,
          players: lineup.map((p) => p.full_name),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setToastMsg(data.error || "Error submitting lineup.");
        setIsSubmitting(false);
        setTimeout(() => setToastMsg(""), 4000);
        return;
      }

      setLineup([]);
      await fetchTopPlayers();
    } catch (err) {
      console.error("Error submitting lineup:", err);
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setToastMsg(""), 4000);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card shadow p-4" style={{ width: "420px" }}>
        <h3 className="text-center mb-3 fw-bold">Team Lineup Builder</h3>
        <p className="text-center text-muted">
          Create and submit your custom sports lineup.
        </p>

        {toastMsg && (
          <div className="alert alert-info py-2 text-center" role="alert">
            {toastMsg}
          </div>
        )}

        {/* Sport Select */}
        <div className="mb-3">
          <label className="form-label fw-semibold">Select Sport</label>
          <select
            className="form-select"
            value={selectedSport}
            onChange={(e) => setSelectedSport(e.target.value)}
          >
            <option value="">Choose sport</option>
            {sports.map((s, i) => (
              <option key={i} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        {/* Add Player */}
        <div className="mb-3">
          <label className="form-label fw-semibold">Add Player</label>
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="Enter player full name..."
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
            />
            <button
              className="btn btn-primary"
              onClick={handleAddPlayer}
              disabled={!isValid || !selectedSport}
            >
              +
            </button>
          </div>
          {errorMsg && <small className="text-danger">{errorMsg}</small>}
        </div>

        {/* Available Players */}
        <div className="mb-3">
          <label className="form-label fw-semibold">Available Players</label>
          <select className="form-select">
            {availablePlayers.map((p) => (
              <option key={p.id}>{p.full_name}</option>
            ))}
          </select>
        </div>

        {/* Lineup */}
        <div className="mb-3">
          <label className="form-label fw-semibold">Your Lineup</label>
          <div className="d-flex flex-wrap gap-2">
            {lineup.map((p, idx) => (
              <span key={idx} className="badge bg-secondary">
                {p.full_name}
              </span>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <div className="position-relative">
          <button
            className="btn btn-secondary w-100 d-flex justify-content-center align-items-center"
            disabled={lineup.length < 3 || isSubmitting}
            onClick={handleSubmit}
            title={
              lineup.length < 3
                ? "You need at least 3 players to submit a lineup."
                : ""
            }
          >
            {isSubmitting ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                ></span>
                Submitting...
              </>
            ) : (
              "SUBMIT LINEUP"
            )}
          </button>
        </div>

        {/* Top Players */}
        <div className="mt-4">
          <h5 className="fw-semibold text-primary mb-2">
            <i className="bi bi-bar-chart-fill me-2"></i> Top Players
          </h5>

          {topPlayers.length === 0 ? (
            <p className="text-muted text-center mb-0">
              No top players yet. Submit a lineup first!
            </p>
          ) : (
            <table className="table table-sm table-striped text-center align-middle">
              <thead className="table-light">
                <tr>
                  <th>Rank</th>
                  <th>Player</th>
                  <th>Count</th>
                </tr>
              </thead>
              <tbody>
                {topPlayers.map((p, idx) => {
                  const nameLength = p.full_name.replace(/\s+/g, "").length;
                  const isPrime = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29].includes(
                    nameLength
                  );
                  return (
                    <tr key={idx}>
                      <td>{idx + 1}</td>
                      <td className={isPrime ? "fw-bold text-primary" : ""}>
                        {p.full_name}
                      </td>
                      <td>{p.count}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
