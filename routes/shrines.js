const express = require("express");
const router = express.Router();
const fs = require("fs");

// function to read data file
function readShrines() {
  const shrineData = fs.readFileSync("./data/shrines.json");
  const parsedData = JSON.parse(shrineData);
  return parsedData;
}
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

// GET endpoint that returns ONLY a list of Prefectures
router.get("/prefectures", (_req, res) => {
  const shrineData = readShrines();
  const prefectureList = [
    ...new Set(shrineData.map((shrine) => shrine.prefecture)),
  ];
  res.json(prefectureList);
});

// GET endpoint for Shrine By Prefecture
router.get("/shrines/:prefecture", (req, res) => {
  const shrineData = readShrines();
  const { prefecture } = req.params;
  const shrineByPrefecture = shrineData
    .filter((shrine) => shrine.prefecture === prefecture)
    .map((shrine) => ({
      id: shrine.id,
      name: shrine.name,
      image: shrine.image,
      city: shrine.city,
    }));
  res.json(shrineByPrefecture);
});

// GET endpoint for individual shrine by id
router.get("/shrine/:id", (req, res) => {
  const shrines = readShrines();
  const singleShrine = shrines.find((shrine) => shrine.id === req.params.id);

  if (!singleShrine) {
    res.status(404).send({ error: "Shrine not found" });
  } else {
    res.json(singleShrine);
  }
});

// GET endopint for reviews only
router.get("/reviews/:id", (req, res) => {
  const shrines = readShrines();
  const reviews = shrines.find((shrine) => shrine.id === req.params.id).reviews;

  if (!reviews) {
    res.status(404).send({ error: "Shrine not found" });
  } else {
    res.json(reviews);
  }
});

module.exports = router;
