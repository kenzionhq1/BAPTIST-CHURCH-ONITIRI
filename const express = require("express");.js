const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(express.static(__dirname));
app.use(express.urlencoded({ extended: true }));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  }
});
const upload = multer({ storage });

app.post("/upload", upload.single("file"), (req, res) => {
  const { title, category, date } = req.body;
  const filePath = "uploads/" + req.file.filename;

  const newEntry = { title, category, date, file: filePath };

  const dbPath = path.join(__dirname, "data.json");
  let db = [];

  if (fs.existsSync(dbPath)) {
    const raw = fs.readFileSync(dbPath);
    db = JSON.parse(raw);
  }

  db.push(newEntry);
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));

  res.send(`<h2>✅ Upload Successful!</h2><a href="/admin.html">← Go Back</a>`);
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
