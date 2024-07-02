const express = require("express");
const session = require("express-session");
const path = require("path");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const { auth, requiresAuth } = require("express-openid-connect");
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3333;

// Database connection
mongoose.connect("mongodb://localhost:27017/football", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log("Database Connected...");
  })
  .catch((err) => {
    console.error("Error connecting to database:", err);
  });

// Auth0 configuration
const config = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.AUTH0_CLIENT_SECRET,
  baseURL: process.env.AUTH0_BASE_URL,
  clientID: process.env.AUTH0_CLIENT_ID,
  issuerBaseURL: `https://${process.env.AUTH0_DOMAIN}`,
};

// Middleware
app.use(auth(config));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // Use bodyParser for parsing form data
app.use(express.static(path.join(__dirname, "public")));

// Session management
app.use(session({
  secret: "your_secret_key", // Change this to a secret key for session management
  resave: false,
  saveUninitialized: true,
}));

const matchRoutes = require("./routes/matchRoutes");
const Football = require("./routes/Match");
app.use("/dashboard", requiresAuth(), Football);

// Routes
app.get("/", (req, res) => {
  res.send("Welcome to the football app. <a href='/login'>Log in</a> | <a href='/logout'>Log out</a>");
});

app.get("/dashboard", requiresAuth(), (req, res) => {
  res.sendFile(path.join(__dirname, "./public/dashboard/dashboard.html"));
});

app.get("/main", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/main/main.html"));
});

app.get("/profile", requiresAuth(), (req, res) => {
  res.send(JSON.stringify(req.oidc.user));
});

// Logout route
app.get('/logout', (req, res) => {
  res.oidc.logout({ returnTo: process.env.AUTH0_BASE_URL });
});

app.listen(port, () => {
  console.log(`Listening to port ${port}`);
});
