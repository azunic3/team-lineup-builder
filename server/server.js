const express = require('express');
const app = express();
const cors = require("cors");

const corsOptions = {
    origin: ["https://localhost:5173"],
};

app.use(cors(corsOptions));

app.get("/api", (req, res) => {
    res.json({test : ["1", "2", "3"]});
});

app.listen(3000, () => {
    console.log("Server starting on port 3000");
});