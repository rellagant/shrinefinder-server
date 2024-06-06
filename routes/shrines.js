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

// GET endpoint to retrieve random shrine
router.get("/random", (_req, res) => {
  const shrines = readShrines();

  if (shrines.length === 0) {
    res.status(404).json({
      error: "Not found. We're building more shrines for you.",
    });
    return;
  }

  const randomIndex = Math.floor(Math.random() * shrines.length);
  const randomShrine = shrines[randomIndex];

  res.json(randomShrine);
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

// POST endpoint for reviews
router.post("/:id/reviews", (req, res) => {
  const shrines = readShrines();
  const shrine = shrines.find((shrine) => shrine.id === req.params.id);

  if (!shrine) {
    return res.status(404).json({ error: "Review item not found" });
  }

  const { rating, comment, reviewer } = req.body;

  if (!rating || !comment || !reviewer) {
    return res
      .status(400)
      .json({ error: "Rating, comment, and review are required" });
  }

  const newReview = {
    rating: parseFloat(rating),
    comment,
    reviewer,
  };

  shrine.reviews.unshift(newReview);
  fs.writeFileSync("./data/shrines.json", JSON.stringify(shrines, null, 2));

  res.status(201).json(newReview);
});

// validation for parameter case insensitive
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

module.exports = router;
