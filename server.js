const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(express.json());

const dbPath = path.join(__dirname, "data.json");

const defaultSettings = {
  rating1: 1,
  rating2: 2,
  rating3: 3,
  rating4: 4,
  rating5: 5,
  rating6: 7,
  rating7: 10,
  rating8: 14,
  rating9: 21,
  rating10: 30,
};

function readDb() {
  if (!fs.existsSync(dbPath)) {
    return { entries: [], settings: defaultSettings };
  }
  const db = JSON.parse(fs.readFileSync(dbPath, "utf-8"));
  db.settings = { ...defaultSettings, ...(db.settings || {}) };
  return db;
}

function writeDb(data) {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}
