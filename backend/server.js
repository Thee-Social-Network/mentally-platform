import express from 'express';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt'; // ✅ add this
import { connectDB } from './config/db.js';
import { User } from './models/user_model.js';
import path from 'path';
import { fileURLToPath } from 'url';

// Setup
dotenv.config();
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use("/css", express.static(path.join(__dirname, "../frontend/css")));
app.use("/js", express.static(path.join(__dirname, "../frontend/js")));

// ---------------- ROUTES ---------------- //
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/html/landing.html"));
});
app.get("/signup", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/html/signup.html"));
});
app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/html/login.html"));
});
app.get("/dashboard", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/html/dashboard.html"));
});

// ----------- API ENDPOINTS ----------- //

// Signup API
app.post("/api/signup", async (req, res) => {
  const { first_name, last_name, email, password, role } = req.body;

  if (!first_name || !last_name || !email || !password || !role) {
    return res.status(400).json({ success: false, message: "Please provide all fields" });
  }

  try {
    // ✅ check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "Email already registered" });
    }

    // ✅ hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      first_name,
      last_name,
      email,
      password: hashedPassword,
      role
    });

    await newUser.save();
    res.status(201).json({ success: true, message: "User created successfully" });

  } catch (error) {
    console.error("Error creating user: ", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

// Login API
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    // check user
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ success: false, message: "User not found" });

    // ✅ compare hashed passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ success: false, message: "Invalid password" });

    res.json({ success: true, message: "Login successful", user: { id: user._id, email: user.email, role: user.role } });

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
