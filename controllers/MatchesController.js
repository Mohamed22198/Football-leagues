const Match = require("../models/MatchModel");
const fs = require("fs");
const path = require("path");
const footballPath = path.join(__dirname, "../data/football.json"); // Update the path

let getAllMatchs = (req, res) => {
  const LEAGUE = req.params.league;
  res.set("Access-Control-Allow-Origin", "*");
  Match.fetchAllMatchs(LEAGUE, (err, result) => {
    if (err) {
      // Handle the error, e.g., send an error response
      console.error("Error fetching match data:", err);
      res.status(500).send("Internal Server Error");
    } else {
      // Send the result (array of match objects) as JSON response
      res.json(result);
    }
  });
};
let insertNewMatch = (req, res) => {
  const LEAGUE = req.params.league;
  let mtch = new Match(req.body.team1, req.body.team2);
  mtch.saveMatch(LEAGUE);
  res.json(req.body);
};
let deleteMatch = (req, res) => {
  const league = req.params.league;
  const team1 = req.body.team1;
  fs.readFile(footballPath, (err, data) => {
    if (err) {
      console.error("Error reading matchs.json:", err);
      res.status(500).send("Internal Server Error");
      return;
    }
    const football = JSON.parse(data);
    ;
    const Matchs = football[league].matchs;

    // Find the index of the match with the specified team1
    let idx = Matchs.findIndex((match) => match.team1 === team1);

    if (idx !== -1) {
      // Remove the match from the array
      Matchs.splice(idx, 1);

      // Write the updated data back to the file
      fs.writeFile(footballPath, JSON.stringify(football), (writeErr) => {
        if (writeErr) {
          console.error("Error writing matchs.json:", writeErr);
          res.status(500).send("Internal Server Error");
        } else {
          res.send("Match deleted successfully");
        }
      });
    } else {
      res.status(404).send("Match not found");
    }
  });
};

module.exports = {
  getAllMatchs,
  insertNewMatch,
  deleteMatch,
};
