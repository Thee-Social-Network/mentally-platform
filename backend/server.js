import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import { User } from './models/user_model.js';
import path from 'path';
import { fileURLToPath } from 'url';

// Setup
dotenv.config();
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json()); // parse JSON request body
app.use(express.urlencoded({ extended: true })); // parse form submissions

// Serve static files (css, js, images)
app.use("/css", express.static(path.join(__dirname, "../frontend/css")));
app.use("/js", express.static(path.join(__dirname, "../frontend/js")));

// ---------------- ROUTES ---------------- //

// Landing page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/html/landing.html"));
});

// Signup page
app.get("/signup", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/html/signup.html"));
});

// Login page
app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/html/login.html"));
});

// Dashboard (example)
app.get("/dashboard", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/html/dashboard.html"));
});



// ----------- API ENDPOINTS ----------- //

// Signup API
app.post("/api/signup", async (req, res) => {
  const { first_name, last_name, email, password, role } = req.body;

  if (!first_name || !last_name || !email || !password || !role) {
    return res
      .status(400)
      .json({ success: false, message: "Please provide all fields" });
  }

  try {
    const newUser = new User({ first_name, last_name, email, password, role });
    await newUser.save();
    res.status(201).json({ success: true, data: newUser });
  } catch (error) {
    console.error("Error creating user: ", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

// Login API (⚠️ replace with bcrypt in production)
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user)
      return res
        .status(400)
        .json({ success: false, message: "User not found" });

    if (user.password !== password) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid password" });
    }

    res.json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

// --------------- START SERVER --------------- //
const PORT = process.env.PORT || 5000;
connectDB();
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
