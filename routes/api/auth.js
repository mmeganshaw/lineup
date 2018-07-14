// Setting up express and express roter
const express = require("express");
const router = express.Router();

// creating a test route
router.get("/test", (req, res) => res.json({ msg: "users works" }));

module.exports = router;
