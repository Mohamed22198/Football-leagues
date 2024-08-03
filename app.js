const express = require("express");
const session = require("express-session");
const app = express();
const path = require("path");
require("dotenv").config();
const port = process.env.PORT || 3333;
const bodyParser = require("body-parser");
const mongoose = require("mongoose");


mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Database Connected...");
  })
  .catch((err) => {
    console.error("Error connecting to database:", err);
  });
app.use(
  session({
    secret: "your_secret_key", // Change this to a secret key for session management
    resave: false,
    saveUninitialized: true,
  })
);
const matchRoutes = require("./routes/matchRoutes");
const Football = require("./routes/Match");
const loginRoutes = require("./routes/authentication");
app.use(bodyParser.json());
// 3rd party middleware
app.use(bodyParser.urlencoded({ extended: true })); // Use bodyParser for parsing form data
app.use(express.static(path.join(__dirname, "public")));
app.use("/dashboard", Football);
app.use("/login", loginRoutes);

function isAuthenticated(req, res, next) {
  if (req.session.isLoggedIn) {
    // If authenticated, proceed to the next route handler
    return next();
  }
  // If not authenticated, redirect to the login page
  res.redirect("/login");
}

app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/login/login.html"));
});

// Request main
app.get("/dashboard", isAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, "./public/dashboard/dashboard.html"));
});
app.get("/main", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/main/main.html"));
});

app.listen(port, () => {
  console.log(`Listening to port ${port}`);
});
