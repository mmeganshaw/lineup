// Setting up express and express roter
const express = require("express");
const router = express.Router();

// @route GET api/profile/test
// @desc Tests profile route
// @access Public
router.get("/test", (req, res) => res.json({ msg: "posts works" }));

module.exports = router;
