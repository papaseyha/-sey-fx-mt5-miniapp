const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

let mt5Status = {
  connected: false,
  bot: false,
  balance: 0,
  equity: 0,
  profit: 0,
  positions: 0
};

let command = {
  action: "none"
};

app.get("/", (req, res) => {
  res.json({
    ok: true,
    service: "SEY FX MT5 Bridge"
  });
});

app.get("/api/status", (req, res) => {
  res.json(mt5Status);
});

app.post("/api/status", (req, res) => {
  mt5Status = {
    ...mt5Status,
    ...req.body,
    connected: true
  };

  res.json({ ok: true });
});

app.post("/api/command", (req, res) => {
  command = req.body;
  res.json({ ok: true, command });
});

app.get("/api/command", (req, res) => {
  const current = command;
  command = { action: "none" };
  res.json(current);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`SEY FX MT5 Bridge running on port ${PORT}`);
});
