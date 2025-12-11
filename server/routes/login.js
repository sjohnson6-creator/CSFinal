const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");

// Load users from users.json
const usersFile = path.join(__dirname, "../users.json");
const users = JSON.parse(fs.readFileSync(usersFile, "utf-8"));

// POST /login
router.post("/", (req, res) => {
  const { email, password } = req.body;

  const user = users.find((u) => u.email === email && u.password === password);

  if (!user) {
    return res.status(401).json({ ok: false, error: "Invalid credentials" });
  }

  res.json({ ok: true, role: user.role });
});

module.exports = router;
