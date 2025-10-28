import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import checkWordRouter from "./routes/checkWord.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// ✅ Mount the API route
app.use("/", checkWordRouter);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(5000, () => {
  console.log("✅ Server running on http://localhost:5000");
});
