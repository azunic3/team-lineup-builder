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


  //debounce nakon 300ms greska za nevalidno ime
  useEffect(() => {
    if (playerName.trim() === "") {
      setIsValid(true);
      return;
    }

    if (typingTimeout) clearTimeout(typingTimeout);
    setTypingTimeout(
      setTimeout(() => {
        const regex = /^[A-Za-z]+ [A-Za-z]+$/;
        const valid = regex.test(playerName.trim());
        setIsValid(valid);
        setErrorMsg(valid ? "" : "Please enter a valid full name (first and last).");
      }, 300)
    );
  }, [playerName]);

  // load sports (baseball, basketball i football u bazi imam)
  useEffect(() => {
    fetch("http://localhost:3000/api/sports")
      .then((res) => res.json())
      .then((data) => setSports(data))
      .catch((err) => console.error("Error loading sports:", err));
  }, []);

  // load players iz baze po sportu
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

  // dodavanje novog igraca
  const handleAddPlayer = async () => {
    if (!playerName.trim() || !isValid || !selectedSport) return;

    const exists =
      lineup.some((p) => p.full_name.toLowerCase() === playerName.toLowerCase()) ||
      availablePlayers.some((p) => p.full_name.toLowerCase() === playerName.toLowerCase());
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
          [...prev, newPlayer].sort((a, b) => a.full_name.localeCompare(b.full_name))
        );
        setAvailablePlayers((prev) =>
          [...prev, newPlayer].sort((a, b) => a.full_name.localeCompare(b.full_name))
        );
      }
      setPlayerName("");
    } catch (err) {
      console.error("Error adding player:", err);
    }
  };

  // submit button
  const handleSubmit = async () => {
    if (lineup.length < 3) return;

    try {
      await fetch("http://localhost:3000/api/lineup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sport: selectedSport,
          players: lineup.map((p) => p.full_name),
        }),
      });
      alert("✅ Lineup submitted successfully!");
      setLineup([]);
    } catch (err) {
      console.error("Error submitting lineup:", err);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card shadow p-4" style={{ width: "420px" }}>
        <h3 className="text-center mb-3 fw-bold">Team Lineup Builder</h3>
        <p className="text-center text-muted">
          Create and submit your custom sports lineup.
        </p>

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
          {!isValid && (
            <small className="text-danger">{errorMsg}</small>
          )}
        </div>

        <div className="mb-3">
          <label className="form-label fw-semibold">Available Players</label>
          <select className="form-select">
            {availablePlayers.map((p) => (
              <option key={p.id}>{p.full_name}</option>
            ))}
          </select>
        </div>

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

        <button
          className="btn btn-secondary w-100"
          disabled={lineup.length < 3}
          onClick={handleSubmit}
        >
          SUBMIT LINEUP
        </button>
        <small className="text-center mt-2 text-muted d-block">
          You need at least 3 players to submit a lineup.
        </small>
      </div>
    </div>
  );
}
