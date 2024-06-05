const express = require("express");
const router = express.Router();
const fs = require("fs");

// function to read data file
function readShrines() {
  const shrineData = fs.readFileSync("./data/shrines.json");
  const parsedData = JSON.parse(shrineData);
  return parsedData;
}

// GET endpoint for ALL shrines
router.get("/", (_req, res) => {
  const shrines = readShrines();
  console.log(shrines);
  res.json(shrines);
});

module.exports = router;