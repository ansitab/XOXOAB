console.log("ACTIVE BACKEND FILE");

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const jwt = require("jsonwebtoken");

const Mission = require("./Model/Mission");

const app = express();

// ---------- MIDDLEWARE ----------
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// ---------- USERS ----------
const users = [
  { username: "admin", password: "admin123", role: "admin" },
  { username: "officer", password: "officer123", role: "officer" },
  { username: "analyst", password: "analyst123", role: "analyst" },
];

const JWT_SECRET = "mission_secret_key";

// ---------- AUTH ----------
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "No token" });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token" });
    }

    req.user = user;
    next();
  });
};

// ---------- MULTER ----------
if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// ---------- TEST ----------
app.get("/", (req, res) => {
  res.send("Mission Briefing Backend is running 🚀");
});

// ---------- LOGIN ----------
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  const user = users.find(
    (u) => u.username === username && u.password === password
  );

  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign(
    { username: user.username, role: user.role },
    JWT_SECRET,
    { expiresIn: "2h" }
  );

  res.json({
    token,
    role: user.role,
  });
});

// ---------- UPLOAD ----------
app.post("/upload", authenticateToken, upload.single("file"), async (req, res) => {
  if (req.user.role !== "officer") {
    return res.status(403).json({ message: "Only officers can upload" });
  }

  const mission = {
    filename: req.file.filename,
    originalName: req.file.originalname,
    uploadedBy: req.user.username,
    classification: req.body.classification || "Confidential",
    time: new Date(),
  };

  await Mission.create(mission);

  res.json({
    message: "Mission uploaded successfully",
    mission,
  });
});

// ---------- GET MISSIONS ----------
app.get("/missions", authenticateToken, async (req, res) => {
  if (req.user.role === "officer") {
    return res.status(403).json({ message: "Officers cannot view all missions" });
  }

  const allMissions = await Mission.find();
  res.json(allMissions);
});

// ---------- DOWNLOAD ----------
const logs = [];

app.get("/download/:filename", authenticateToken, (req, res) => {
  const { filename } = req.params;

  logs.push({
    file: filename,
    accessedBy: req.user.username,
    role: req.user.role,
    time: new Date(),
  });

  const filePath = path.join(__dirname, "uploads", filename);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ message: "File not found" });
  }

  res.download(filePath);
});

// ---------- LOGS ----------
app.get("/logs", authenticateToken, (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admins only" });
  }

  res.json(logs);
});

// ---------- DATABASE ----------
mongoose
  .connect("mongodb://127.0.0.1:27017/missionDB")
  .then(() => console.log("MongoDB Connected ✅"))
  .catch((err) => console.log(err));

// ---------- SERVER ----------
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});