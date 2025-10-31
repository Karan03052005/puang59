import express from "express";
import nspell from "nspell";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const router = express.Router();

// Path utilities to locate dictionary files
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load aff and dic files manually from dictionary-en
const aff = fs.readFileSync("./node_modules/dictionary-en/index.aff", "utf-8");
const dic = fs.readFileSync("./node_modules/dictionary-en/index.dic", "utf-8");

// Create spell checker
const spell = nspell(aff, dic);

console.log("✅ English dictionary loaded!");

// ✅ POST /api/check-word
router.post("/check-word", (req, res) => {
  const { word } = req.body;

  if (!word || typeof word !== "string") {
    return res.status(400).json({ message: "Invalid input word" });
  }

  const isCorrect = spell.correct(word);
  const suggestions = spell.suggest(word);

  res.json({ correct: isCorrect, suggestions });
});

export default router;

// ✅ Meaning + Example route using Free Dictionary API
import axios from "axios";

router.post("/meaning", async (req, res) => {
  const { word } = req.body;

  if (!word || typeof word !== "string") {
    return res.status(400).json({ message: "Invalid input word" });
  }

  try {
    const response = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
    const data = response.data[0];

    const meaning =
      data.meanings[0]?.definitions[0]?.definition || "Meaning not found.";
    const example =
      data.meanings[0]?.definitions[0]?.example || "Example not available.";

    res.json({ word, meaning, example });
  } catch (error) {
    console.error("Error fetching meaning:", error.message);
    res.status(404).json({ message: "Word not found in dictionary API" });
  }
});
