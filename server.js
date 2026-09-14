const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

const DATA_DIR = path.join(__dirname, "data");
const DATA_FILE = path.join(DATA_DIR, "notes.json");

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

function ensureDataFile() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, "[]", "utf8");
}

function readNotes() {
  ensureDataFile();
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
  } catch {
    return [];
  }
}

function writeNotes(notes) {
  ensureDataFile();
  fs.writeFileSync(DATA_FILE, JSON.stringify(notes, null, 2), "utf8");
}

function createId() {
  return Date.now().toString() + "-" + Math.random().toString(36).slice(2, 8);
}

// GET /api/notes - return all notes
app.get("/api/notes", (req, res) => {
  const notes = readNotes().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  res.json(notes);
});

// POST /api/notes - create a note
app.post("/api/notes", (req, res) => {
  const title = String(req.body.title || "").trim();
  const content = String(req.body.content || "").trim();

  if (!title || !content) {
    return res.status(400).json({ message: "Title and content are required." });
  }

  const notes = readNotes();
  const note = {
    id: createId(),
    title,
    content,
    createdAt: new Date().toISOString()
  };

  notes.push(note);
  writeNotes(notes);
  res.status(201).json(note);
});

// DELETE /api/notes/:id - delete a note
app.delete("/api/notes/:id", (req, res) => {
  const notes = readNotes();
  const index = notes.findIndex(note => note.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ message: "Note not found." });
  }

  const [deleted] = notes.splice(index, 1);
  writeNotes(notes);
  res.json(deleted);
});

// Health check for Render and similar services
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// Send the frontend for any non-API route
app.get("/{*splat}", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

ensureDataFile();

app.listen(PORT, () => {
  console.log(`Quick Note Application running on http://localhost:${PORT}`);
});
