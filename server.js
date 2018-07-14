// requiring and intiializing express
const express = require("express");
// requiring and initializing mongoose
const mongoose = require("mongoose");

// bringing in routes
const auth = require("./routes/api/auth.js");
const profile = require("./routes/api/profile.js");
const posts = require("./routes/api/posts.js");

// setting up the express server
const app = express();

// DB Config
const db = require("./config/keys").mongoURI;

// Connect to MongoDB
mongoose
  .connect(db)
  // if successful, console log that we are connected
  .then(() => console.log("Connected to MongoDB"))
  // if there is an error, catch it and then log it to the console
  .catch(err => console.log(err));

// creating an express route for our homepage
app.get("/", (req, res) => res.send("Hello World"));

// Use Routes
app.use("/api/auth", auth);
app.use("/api/profile", profile);
app.use("/api/posts", posts);

// setting up our port for heroku hosting or local hosting on port 5000
const port = process.env.PORT || 5000;

// getting our server to listen on the correct port, and console logging once it's running
app.listen(port, () => console.log("Server running on port"));
