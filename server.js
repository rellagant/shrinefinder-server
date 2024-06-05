const express = require("express");
const fs = require("fs");
const cors = require("cors");

require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(cors());

app.use(express.static("public"));

const shrineRoute = require("./routes/shrines");
app.use("/", shrineRoute);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
