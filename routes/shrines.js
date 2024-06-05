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

// GET endpoint for individual shrines by id
router.get("/:id", (req, res) => {
  const shrine = readShrines();
  const singleShrine = shrine.find((shrine) => shrine.id === req.params.id);

  if (!singleShrine) {
    res.status(404).send({ error: "Shrine not found" });
  } else {
    res.json(singleShrine);
  }
});

module.exports = router;
