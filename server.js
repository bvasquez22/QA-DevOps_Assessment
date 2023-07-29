const express = require("express");
const cors = require('cors');
const bots = require("./src/botsData");
const shuffle = require("./src/shuffle");

// include and initialize the rollbar library with your access token
var Rollbar = require('rollbar')
var rollbar = new Rollbar({
  accessToken: '0319ace383204e0891a31704efdfbe4d',
  captureUncaught: true,
  captureUnhandledRejections: true,
})

// record a generic message and send it to Rollbar
rollbar.log('Hello world!')

const playerRecord = {
  wins: 0,
  losses: 0,
};
const app = express();

app.use(express.json());
app.use(cors());

// Add up the total health of all the robots
const calculateTotalHealth = (robots) =>
  robots.reduce((total, { health }) => total + health, 0);

// Add up the total damage of all the attacks of all the robots
const calculateTotalAttack = (robots) =>
  robots
    .map(({ attacks }) =>
      attacks.reduce((total, { damage }) => total + damage, 0)
    )
    .reduce((total, damage) => total + damage, 0);

// Calculate both players' health points after the attacks
const calculateHealthAfterAttack = ({ playerDuo, compDuo }) => {
  const compAttack = calculateTotalAttack(compDuo);
  const playerHealth = calculateTotalHealth(playerDuo);
  const playerAttack = calculateTotalAttack(playerDuo);
  const compHealth = calculateTotalHealth(compDuo);

  return {
    compHealth: compHealth - playerAttack,
    playerHealth: playerHealth - compAttack,
  };
};

app.get("/api/robots", (req, res) => {
  rollbar.log("User requested list of Bots")
  try {
    rollbar.log("Bot list sent to user")
    res.status(200).send(botsArr);
  } catch (error) {
    rollbar.error("Bot list failed")
    console.error("ERROR GETTING BOTS", error);
    res.sendStatus(400);
  }
});

app.get("/api/robots/shuffled", (req, res) => {
  try {
    let shuffled = shuffle(bots);
    rollbar.log("Bot array shuffled and sent")
    res.status(200).send(shuffled);
  } catch (error) {
    console.error("ERROR GETTING SHUFFLED BOTS", error);
    rollbar.error("Shuffle failed")
    res.sendStatus(400);
  }
});

app.post("/api/duel", (req, res) => {
  rollbar.log("User initiated a duel")
  try {
    const { compDuo, playerDuo } = req.body;

    const { compHealth, playerHealth } = calculateHealthAfterAttack({
      compDuo,
      playerDuo,
    });

    // comparing the total health to determine a winner
    if (compHealth > playerHealth) {
      playerRecord.losses += 1;
      rollbar.log("Duel completed, loss reported")
      res.status(200).send("You lost!");
    } else {
      playerRecord.losses += 1;
      rollbar.log("Duel completed, win reported")
      res.status(200).send("You won!");
    }
  } catch (error) {
    console.log("ERROR DUELING", error);
    rollbar.error("Duel failed")
    res.sendStatus(400);
  }
});

app.get("/api/player", (req, res) => {
  try {
    rollbar.log("Player stats sent to user")
    res.status(200).send(playerRecord);
  } catch (error) {
    console.log("ERROR GETTING PLAYER STATS", error);
    rollbar.error("Player stats failed")
    res.sendStatus(400);
  }
});

app.listen(8000, () => {
  console.log(`Listening on 8000`);
});
