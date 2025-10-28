import express from "express";
import nspell from "nspell";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Load dictionary files manually (no "dictionary()" call)
const aff = fs.readFileSync(path.join(__dirname, "../dictionaries/en_US.aff"), "utf-8");
const dic = fs.readFileSync(path.join(__dirname, "../dictionaries/en_US.dic"), "utf-8");

const spell = nspell(aff, dic);
console.log("✅ English dictionary loaded manually");

router.post("/checkWord", (req, res) => {
  const { word } = req.body;
  if (!word) return res.status(400).json({ error: "Word is required" });

  const correct = spell.correct(word);
  const suggestions = correct ? [] : spell.suggest(word);

  res.json({ correct, suggestions });
});

export default router;
