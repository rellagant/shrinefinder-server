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

// GET endpoint for individual shrine by id
router.get("/:id", (req, res) => {
  const shrine = readShrines();
  const singleShrine = shrine.find((shrine) => shrine.id === req.params.id);

  if (!singleShrine) {
    res.status(404).send({ error: "Shrine not found" });
  } else {
    res.json(singleShrine);
  }
});

// GET endpoint for shrines by city

// validation for city parameter case insensitive
const checkCityParam = (req, res, next) => {
  const city = req.params.city;

  if (!city || typeof city !== "string" || city.trim().length === 0) {
    return res.status(400).json({ error: "Invalid city parameter" });
  }
  next();
};

// Function to filter shrines by property
const findShrinesByProperty = (property, value) => {
  const shrines = readShrines();
  return shrines.filter(
    (shrine) => shrine[property].toLowerCase() === value.toLowerCase()
  );
};

// Get endpoint by city
router.get("/byCity/:city", checkCityParam, (req, res) => {
  const city = req.params.city;
  const shrinesInCity = findShrinesByProperty("city", city);

  if (shrinesInCity.length === 0) {
    return res.status(404).json({
      error:
        "No shrines found at the moment, please come back later as more shrines will be added!",
    });
  }
  res.json(shrinesInCity);
});

module.exports = router;
