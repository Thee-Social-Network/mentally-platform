import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import { createUser, logUser } from './controllers/user-controller.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { Mood } from './models/mood_model.js';
import { getMood } from './controllers/moods-controller.js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import africastalking from 'africastalking';
import bodyParser from 'body-parser';
import { Wellness } from './models/wellness_model.js';

dotenv.config();

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Debug API key loading
console.log('🔑 GEMINI_API_KEY loaded:', process.env.GEMINI_API_KEY ? 'Yes ✅' : 'No ❌');
console.log('🔑 API Key length:', process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.length : 0);

// Initialize Gemini AI
let genAI;
try {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not set in environment variables');
  }
  genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  console.log('🤖 Gemini AI initialized successfully');
} catch (error) {
  console.error('❌ Failed to initialize Gemini AI:', error.message);
}

// Serve static files
app.use(express.static(path.join(__dirname, '../frontend/html')));
app.use(express.json());

const PORT = process.env.PORT || 5000;

// ================== ROUTES ==================

// Create user
app.post('/api/signup', createUser);

// Login API
app.post('/api/login', logUser);

// Mood APIs
app.post('/api/mood', async (req, res) => {
  try {
    const { mood, tags, notes, userId } = req.body;

    if (!mood || !userId) {
      return res.status(400).json({ success: false, message: 'Mood and user ID are required' });
    }

    const moodEntry = new Mood({
      userId,
      mood: parseInt(mood),
      tags: tags || [],
      notes: notes || '',
      date: new Date(),
    });

    await moodEntry.save();

    res.json({
      success: true,
      message: 'Mood entry saved successfully',
      data: moodEntry,
    });
  } catch (error) {
    console.error('Error saving mood entry:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.get('/api/mood/:userId', getMood);
app.get('/api/mood/factors/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { days = 7 } = req.query;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    const moodData = await Mood.find({
      userId,
      date: { $gte: startDate },
    }).sort({ date: 1 });

    const tagCounts = {
      work: 0,
      family: 0,
      friends: 0,
      health: 0,
      sleep: 0,
      exercise: 0,
      weather: 0,
      news: 0,
    };

    moodData.forEach((entry) => {
      if (entry.tags && Array.isArray(entry.tags)) {
        entry.tags.forEach((tag) => {
          if (tagCounts.hasOwnProperty(tag)) {
            tagCounts[tag]++;
          }
        });
      }
    });

    res.json({
      success: true,
      data: tagCounts,
    });
  } catch (error) {
    console.error('Error fetching mood factors:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// (Mood analytics, AI chat, wellness, routes… unchanged)
// ================== END ROUTES ==================

// ------------------ STARTUP ------------------ //
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
      console.log(
        `AI Configuration: ${
          process.env.GEMINI_API_KEY ? 'Configured ✅' : 'Missing GEMINI_API_KEY ❌'
        }`
      );
    });
  })
  .catch((err) => {
    console.error('❌ Database connection failed:', err.message);
    process.exit(1);
  });
