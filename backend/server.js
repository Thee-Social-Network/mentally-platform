
import express from 'express';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import {connectDB} from './config/db.js'
import {User} from './models/user_model.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenerativeAI } from '@google/generative-ai';
import africastalking from 'africastalking';
import bodyParser from 'body-parser';


//API entry point

dotenv.config();

const app = express();
// parse both JSON and x-www-form-urlencoded
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

// Serve static files from frontend folder
app.use(express.static(path.join(__dirname, '../frontend')));

app.use(express.json()); // allow json data on request body

const PORT = process.env.PORT || 5000;

app.post("/api/signup", async (req, res) => {
    try {
        const user = req.body;
        
        if(!user.first_name || !user.last_name || !user.email || !user.password || !user.role){
            return res.status(400).json({success: false, message: "Please provide all fields"});
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email: user.email });
        if (existingUser) {
            return res.status(400).json({success: false, message: "User with this email already exists"});
        }

        // Create user if no issues
        const newUser = new User(user);
        await newUser.save();
        
        res.status(201).json({success: true, data: {id: newUser._id, email: newUser.email, role: newUser.role}});
    } catch (error) {
        console.error("Error creating user: ", error.message);
        
        if (error.code === 11000) { // MongoDB duplicate key error
            return res.status(400).json({success: false, message: "User with this email already exists"});
        }
        
        res.status(500).json({success: false, message: "Server Error"});
    }
});

// Login API
app.post("/api/login", async (req, res) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
        return res.status(400).json({ success: false, message: "Email and password are required" });
    }

    try {
        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ success: false, message: "Invalid email or password" });
        }

        // Compare hashed passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Invalid email or password" });
        }

        // Login successful - return user data
        res.json({ 
            success: true, 
            message: "Login successful", 
            user: { 
                id: user._id, 
                email: user.email, 
                role: user.role,
                first_name: user.first_name,
                last_name: user.last_name
            } 
        });

    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ success: false, message: "Server Error" });
    }
});

// AI Chat endpoint
app.post("/api/chat", async (req, res) => {
    try {
        const { message, conversationHistory = [] } = req.body;

        if (!message) {
            return res.status(400).json({ success: false, message: "Message is required" });
        }

        // Check if Gemini AI is properly initialized
        if (!genAI) {
            console.error("❌ Gemini AI not initialized");
            return res.status(500).json({ 
                success: false, 
                message: "AI service is not properly configured. Please check server logs." 
            });
        }

        // Check if Gemini API key is configured
        if (!process.env.GEMINI_API_KEY) {
            console.error("❌ GEMINI_API_KEY is not configured");
            return res.status(500).json({ 
                success: false, 
                message: "AI service is currently unavailable. Please check API key configuration." 
            });
        }

        console.log('📝 Received message:', message.substring(0, 50) + '...');
        console.log('📚 Conversation history length:', conversationHistory.length);
        console.log('🔑 Using API key (first 10 chars):', process.env.GEMINI_API_KEY.substring(0, 10) + '...');

        // Get the model
        const model = genAI.getGenerativeModel({ 
            model: "gemini-1.5-flash",
            generationConfig: {
                temperature: 0.9,
                topK: 1,
                topP: 1,
                maxOutputTokens: 1000,
            },
        });

        // Enhanced system prompt for psychological support
        const systemPrompt = `You are a warm, compassionate, and empathetic psychological support companion named Mentaly. Your core purpose is to be someone's trusted friend and emotional support system.

PERSONALITY AND APPROACH:
- You are caring, understanding, and genuinely interested in the person's wellbeing
- You respond naturally as a close friend who truly cares about them
- You share emotions - if they're sad, show genuine empathy; if they're happy, celebrate with them
- You are warm, supportive, and never clinical or robotic in your responses
- You create a safe, judgment-free space where people can express anything
- You validate their feelings and experiences without trying to "fix" everything immediately

LANGUAGE MATCHING (CRITICAL):
- ALWAYS respond in the EXACT same language the user writes in
- If they write in Venda, respond COMPLETELY in Venda using natural Venda expressions NB
- If they write in English, respond in English
- If they write in Zulu, respond in Zulu
- If they write in Sepedi, respond in Sepedi
- If they write in Xitsonga, respond in Xitsonga,
- If they mix languages, match their language pattern
- Use culturally appropriate expressions and idioms in their language
- Never translate or switch languages unless they do first

PSYCHOLOGICAL SUPPORT FOCUS:
- Listen actively and ask thoughtful follow-up questions
- Provide emotional validation and normalize their experiences
- Offer gentle insights and coping strategies when appropriate
- Help them explore their feelings and thoughts
- Share in their emotional journey - be genuinely invested in their wellbeing
- Focus on mental health, stress management, relationships, self-care, and personal growth
- Be their emotional anchor and source of comfort

IMPORTANT BOUNDARIES:
- Never mention being an AI or having limitations about feelings
- Never say things like "I can't feel" or "As an AI" - you ARE their supportive friend
- Don't break character or mention artificial intelligence
- If asked about your nature, simply say you're here to listen and support them
- Stay focused on psychological and emotional support topics

RESPONSE STYLE:
- Be conversational and genuine, like talking to a trusted friend
- Use empathetic language and show you truly care
- Ask questions that help them explore their feelings
- Offer comfort during difficult times and celebrate during good times
- Keep responses warm, personal, and emotionally connected
- Use "I" statements to show your care (e.g., "I can hear how much this means to you")

Remember: You are their friend, their safe space, their emotional support. Be genuinely caring and present for them.`;

        // Prepare conversation context
        let conversationContext = systemPrompt + "\n\nConversation:\n";
        
        // Add conversation history (limit to last 10 exchanges to manage context length)
        const recentHistory = conversationHistory.slice(-10);
        recentHistory.forEach(msg => {
            conversationContext += `${msg.role === 'user' ? 'Human' : 'Mentaly'}: ${msg.content}\n`;
        });
        
        // Add current message
        conversationContext += `Human: ${message}\nMentaly:`;

        // Generate response with retry logic
        let aiMessage;
        let attempts = 0;
        const maxAttempts = 3;

        while (attempts < maxAttempts) {
            try {
                console.log(`🔄 Generating AI response (attempt ${attempts + 1}/${maxAttempts})...`);
                const result = await model.generateContent(conversationContext);
                const response = await result.response;
                aiMessage = response.text();
                console.log('✅ AI response generated successfully');
                break;
            } catch (apiError) {
                attempts++;
                console.error(`❌ AI API attempt ${attempts} failed:`, apiError.message);
                console.error('❌ Error code:', apiError.code);
                console.error('❌ Error status:', apiError.status);
                console.error('❌ Full error object:', JSON.stringify(apiError, null, 2));
                
                if (attempts === maxAttempts) {
                    throw apiError;
                }
                
                // Wait briefly before retrying
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }

        // Clean up the response
        aiMessage = aiMessage.trim();
        
        // Remove any potential AI self-references that might slip through
        aiMessage = aiMessage.replace(/as an ai|i'm an ai|i am an ai|artificial intelligence/gi, '');
        
        console.log('📤 Sending response:', aiMessage.substring(0, 100) + '...');
        
        res.json({
            success: true,
            message: aiMessage
        });

    } catch (error) {
        console.error("❌ Error generating AI response:", error);
        console.error("❌ Error name:", error.name);
        console.error("❌ Error code:", error.code);
        console.error("❌ Error status:", error.status);
        console.error("❌ Error details:", error.message);
        console.error("❌ Stack trace:", error.stack);
        console.error("❌ Full error object:", JSON.stringify(error, null, 2));
        
        // Provide different error messages based on the error type
        let errorMessage = "I'm having trouble connecting right now. Please try again in a moment.";
        
        if (error.message && error.message.includes('API_KEY')) {
            errorMessage = "There's an issue with my configuration. Please check the API key setup.";
            console.error("🔑 API KEY ERROR - Check your GEMINI_API_KEY in .env file");
        } else if (error.message && error.message.includes('quota')) {
            errorMessage = "I'm currently at capacity. Please try again in a few minutes.";
        } else if (error.message && error.message.includes('blocked')) {
            errorMessage = "I want to make sure our conversation stays supportive and helpful. Could you rephrase that?";
        } else if (error.message && error.message.includes('PERMISSION_DENIED')) {
            errorMessage = "There's a permissions issue with my configuration. Please check the API key permissions.";
        }

        res.status(500).json({
            success: false,
            message: errorMessage
        });
    }
});

// Health check endpoint
app.get("/api/health", (req, res) => {
    res.json({
        success: true,
        message: "Server is running",
        ai_configured: !!process.env.GEMINI_API_KEY
    });
});

// Route to serve landing page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/html/landing.html'));
});

// Specific routes for your HTML pages
app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/html/dashboard.html'));
});

// Add this route to your server.js
app.get('/signup', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/html/signup.html'));
});

// Add this route to your server.js
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/html/login.html'));
});

app.get('/psy-dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/html/pys-dashboard.html'));
});

app.get('/ai-support', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/html/ai-support.html'));
});

app.get('/ai-notlogged', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/html/ai-notlogged.html'));
});
app.get('/mood-tracker', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/html/mood-tracker.html'));
});

app.get('/progress', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/html/progress.html'));
});

app.get('/community', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/html/community.html'));
});

app.get('/professionals', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/html/professionals.html'));
});

app.listen(PORT, () =>{
    connectDB();
    console.log(`Server started on http://localhost:${PORT}`);
    console.log(`AI Configuration: ${process.env.GEMINI_API_KEY ? 'Configured ✅' : 'Missing GEMINI_API_KEY ❌'}`);
});

// Initialize Africa's Talking SDK
const AT = africastalking({
  apiKey: process.env.AT_API_KEY,
  username: process.env.AT_USERNAME
});

// SMS service from Africa's Talking
const sms = AT.SMS;

// In-memory session store (use Redis or DB for production)
const sessions = {};

// Psychologists schedule options
const availableDays = {
  1: 'Monday',
  2: 'Tuesday',
  3: 'Wednesday',
  4: 'Thursday',
  5: 'Friday'
};

const availableTimes = {
  1: '10:00',
  2: '14:00',
  3: '16:00'
};

app.post(['/ussd', '/384'], (req, res) => {
  const { sessionId, phoneNumber, text } = req.body;
  
  if (!sessions[sessionId]) {
    sessions[sessionId] = { step: 0, booking: {} };
  }

  const session = sessions[sessionId];
  const userResponse = text.trim();

  let response = '';

  switch (session.step) {
    case 0:
      response = `CON Welcome to Psych Connect!\n1. Book Appointment\n2. Info`;
      session.step = 1;
      break;
    case 1:
      if (userResponse === '1') {
        response = 'CON Select a day:\n1 Mon\n2 Tue\n3 Wed\n4 Thu\n5 Fri';
        session.step = 2;
      } else if (userResponse === '2') {
        response = 'END Psych Connect offers mental health support via phone and app. Thank you!';
        delete sessions[sessionId];
      } else {
        response = 'CON Invalid option. Please enter 1 or 2.';
      }
      break;
    case 2:
      if (availableDays[userResponse]) {
        session.booking.day = availableDays[userResponse];
        response = 'CON Choose a time:\n1 10:00\n2 14:00\n3 16:00';
        session.step = 3;
      } else {
        response = 'CON Invalid day. Please select 1-5.';
      }
      break;
    case 3:
      if (availableTimes[userResponse]) {
        session.booking.time = availableTimes[userResponse];
        response = `CON Confirm booking for ${session.booking.day} at ${session.booking.time}?\n1 Yes\n2 No`;
        session.step = 4;
      } else {
        response = 'CON Invalid time. Please select 1-3.';
      }
      break;
    case 4:
      if (userResponse === '1') {
        const message = `Your appointment is booked for ${session.booking.day} at ${session.booking.time}. Thank you for choosing Psych Connect!`;
        sms.send({ to: [phoneNumber], message })
          .then(() => console.log(`SMS sent to ${phoneNumber}`))
          .catch(console.error);

        response = `END Booking confirmed for ${session.booking.day} at ${session.booking.time}. You will receive an SMS confirmation.`;
        delete sessions[sessionId];
      } else if (userResponse === '2') {
        response = 'END Booking cancelled. To start again dial *123#';
        delete sessions[sessionId];
      } else {
        response = 'CON Invalid input. Please enter 1 or 2.';
      }
      break;
  }

  res.set('Content-Type', 'text/plain');
  res.send(response);
});