const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

let mt5Status = {
  connected: false,
  bot: false,
  symbol: "",
  balance: 0,
  equity: 0,
  floating: 0,
  profit: 0,
  positions: 0,
  lastUpdate: null
};

let command = {
  action: "none"
};

// Home
app.get("/", (req, res) => {
  res.json({
    ok: true,
    service: "SEY FX MT5 Bridge"
  });
});

// =========================
// MT5 STATUS
// =========================

function updateStatus(req) {
  mt5Status = {
    ...mt5Status,
    ...req.query,
    ...req.body,
    connected: true,
    lastUpdate: new Date().toISOString()
  };

  if (req.query.balance)
    mt5Status.balance = Number(req.query.balance);

  if (req.query.equity)
    mt5Status.equity = Number(req.query.equity);

  if (req.query.floating)
    mt5Status.floating = Number(req.query.floating);

  if (req.query.positions)
    mt5Status.positions = Number(req.query.positions);
}

// Mini App
app.get("/api/status", (req, res) => {
  res.json(mt5Status);
});

app.post("/api/status", (req, res) => {
  updateStatus(req);
  res.json({ ok: true });
});

// MT5 Bridge
app.get("/mt5/status", (req, res) => {
  updateStatus(req);
  res.json({
    ok: true,
    status: mt5Status
  });
});

app.post("/mt5/status", (req, res) => {
  updateStatus(req);
  res.json({ ok: true });
});

// =========================
// COMMANDS
// =========================

app.post("/api/command", (req, res) => {
  command = req.body || { action: "none" };

  res.json({
    ok: true,
    command
  });
});

function getCommand(req, res) {
  const current = command;

  command = {
    action: "none"
  };

  res.json(current);
}

app.get("/api/command", getCommand);
app.get("/mt5/command", getCommand);

// =========================
// SERVER
// =========================

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`SEY FX MT5 Bridge running on port ${PORT}`);
});
