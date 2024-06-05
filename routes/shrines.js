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

// validation for city parameter case insensitive
const checkQueryParam = (paramName) => (req, res, next) => {
  const paramValue = req.params[paramName];

  if (
    !paramValue ||
    typeof paramValue !== "string" ||
    paramValue.trim().length === 0
  ) {
    return res.status(400).json({ error: "Invalid ${paramName} parameter" });
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
router.get("/byCity/:city", checkQueryParam("city"), (req, res) => {
  const city = req.params.city;
  const shrinesInCity = findShrinesByProperty("city", city);

  if (shrinesInCity.length === 0) {
    return res.status(404).json({
      error:
        "No shrines found at the moment, please come back later as more shrines and cultural landmarks are being added!",
    });
  }
  res.json(shrinesInCity);
});

// Get endpoint by prefecture
router.get(
  "/byPrefecture/:prefecture",
  checkQueryParam("prefecture"),
  (req, res) => {
    const prefecture = req.params.prefecture;
    const shrinesInPrefecture = findShrinesByProperty("prefecture", prefecture);

    if (shrinesInPrefecture.length === 0) {
      return res.status(404).json({
        error:
          "No shrines found at the moment, please come back later as more shrines and cultural landmarks are being added!",
      });
    }
    res.json(shrinesInPrefecture);
  }
);

// GET endopint to retrieve random shrine
// router.get("/random", (_req, res) => {
//     const shrines = readShrines();
//     // console.log("Shrines read from file:", shrines);
  
//     if (shrines.length === 0) {
//     //   console.log("No shrines found");
//       res.status(404).json({
//         error: "Not found. We're building more shrines for you.",
//       });
//       return;
//     }
  
//     const randomIndex = Math.floor(Math.random() * shrines.length);
//     const randomShrine = shrines[randomIndex];
//     console.log("Random shrine selected:", randomShrine);
  
//     res.json(randomShrine);
//   });

module.exports = router;
