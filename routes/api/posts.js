// Setting up express and express roter
const express = require("express");
const router = express.Router();

// creating a test route
router.get("/test", (req, res) => res.json({ msg: "posts works" }));

module.exports = router;
