import express from 'express';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import {connectDB} from './config/db.js'
import {User} from './models/user_model.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { Mood } from './models/mood_model.js';
import { Wellness } from './models/wellness_model.js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import africastalking from 'africastalking';
import bodyParser from 'body-parser';

//API entry point

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


// Replace your current /api/mood endpoint with this:
app.post("/api/mood", async (req, res) => {
    try {
        const { mood, tags, notes, userId } = req.body;
        
        if (!mood || !userId) {
            return res.status(400).json({ success: false, message: "Mood and user ID are required" });
        }
        
        // Create new mood entry
        const moodEntry = new Mood({
            userId,
            mood: parseInt(mood),
            tags: tags || [],
            notes: notes || "",
            date: new Date()
        });
        
        // Save to database
        await moodEntry.save();
        
        res.json({ 
            success: true, 
            message: "Mood entry saved successfully",
            data: moodEntry
        });
        
    } catch (error) {
        console.error("Error saving mood entry:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

// Replace your current /api/mood/:userId endpoint with this:
app.get("/api/mood/:userId", async (req, res) => {
    try {
        const { userId } = req.params;
        const { days = 30 } = req.query;
        
        // Calculate date range
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - parseInt(days));
        
        // Fetch mood data from database
        const moodData = await Mood.find({
            userId: userId,
            date: { $gte: startDate }
        }).sort({ date: 1 });
        
        res.json({ 
            success: true, 
            data: moodData
        });
        
    } catch (error) {
        console.error("Error fetching mood history:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

// Add API endpoint for mood factors analytics
app.get("/api/mood/factors/:userId", async (req, res) => {
    try {
        const { userId } = req.params;
        const { days = 7 } = req.query;
        
        // Calculate date range
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - parseInt(days));
        
        // Fetch mood data from database
        const moodData = await Mood.find({
            userId: userId,
            date: { $gte: startDate }
        }).sort({ date: 1 });
        
        // Count tag occurrences
        const tagCounts = {
            work: 0,
            family: 0,
            friends: 0,
            health: 0,
            sleep: 0,
            exercise: 0,
            weather: 0,
            news: 0
        };
        
        moodData.forEach(entry => {
            if (entry.tags && Array.isArray(entry.tags)) {
                entry.tags.forEach(tag => {
                    if (tagCounts.hasOwnProperty(tag)) {
                        tagCounts[tag]++;
                    }
                });
            }
        });
        
        res.json({ 
            success: true, 
            data: tagCounts
        });
        
    } catch (error) {
        console.error("Error fetching mood factors:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

// Update the mood analytics endpoint
app.get("/api/mood/analytics/:userId", async (req, res) => {
    try {
        const { userId } = req.params;
        const { days = 30 } = req.query;
        
        // Calculate date range
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - parseInt(days));
        
        // Fetch mood data from database
        const moodData = await Mood.find({
            userId: userId,
            date: { $gte: startDate }
        }).sort({ date: 1 });
        
        if (moodData.length < 3) {
            return res.json({ 
                success: true, 
                data: {
                    patterns: [],
                    correlations: [],
                    predictions: [],
                    trend: "Not enough data to determine trend",
                    bestDay: "Not enough data",
                    topFactor: "Not enough data",
                    insight: "Track more moods to get personalized insights"
                }
            });
        }
        
        // Perform advanced analytics
        const patterns = detectMoodPatterns(moodData);
        const correlations = findMoodCorrelations(moodData);
        const predictions = generateMoodPredictions(moodData);
        
        // Calculate additional analytics
        const avgMood = moodData.reduce((sum, entry) => sum + entry.mood, 0) / moodData.length;
        
        // Find best day
        const dayAverages = Array(7).fill(0).map(() => ({ sum: 0, count: 0 }));
        moodData.forEach(entry => {
            const day = new Date(entry.date).getDay();
            dayAverages[day].sum += entry.mood;
            dayAverages[day].count++;
        });
        
        const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        let bestDay = "Not enough data";
        let highestAvg = 0;
        
        dayAverages.forEach((data, index) => {
            if (data.count > 0) {
                const average = data.sum / data.count;
                if (average > highestAvg) {
                    highestAvg = average;
                    bestDay = daysOfWeek[index];
                }
            }
        });
        
        // Find top factor
        const tagCounts = {
            work: 0,
            family: 0,
            friends: 0,
            health: 0,
            sleep: 0,
            exercise: 0,
            weather: 0,
            news: 0
        };
        
        moodData.forEach(entry => {
            if (entry.tags && Array.isArray(entry.tags)) {
                entry.tags.forEach(tag => {
                    if (tagCounts.hasOwnProperty(tag)) {
                        tagCounts[tag]++;
                    }
                });
            }
        });
        
        let topFactor = "None";
        let maxCount = 0;
        
        Object.entries(tagCounts).forEach(([tag, count]) => {
            if (count > maxCount) {
                maxCount = count;
                topFactor = tag.charAt(0).toUpperCase() + tag.slice(1);
            }
        });
        
        // Generate insight based on average mood
        let insight = "";
        if (avgMood <= 3) {
            insight = "Your mood has been lower recently. Consider trying some of our wellness tools or speaking with a professional.";
        } else if (avgMood <= 6) {
            insight = "Your mood has been moderate. Keep tracking to identify patterns and improve your wellbeing.";
        } else {
            insight = "Your mood has been positive! Keep doing what works for you and consider sharing what helps you with our community.";
        }
        
        // Determine trend
        const recentMood = moodData.slice(-7).map(entry => entry.mood);
        const trend = calculateTrend(recentMood);
        
        let trendText = "Stable";
        if (trend > 0.2) trendText = "Improving";
        else if (trend < -0.2) trendText = "Declining";
        
        res.json({ 
            success: true, 
            data: { 
                patterns, 
                correlations, 
                predictions,
                trend: trendText,
                bestDay,
                topFactor,
                insight
            }
        });
        
    } catch (error) {
        console.error("Error fetching mood analytics:", error);
        res.status(500).json({ success: false, message: "Analytics error" });
    }
});

// Advanced pattern detection
function detectMoodPatterns(moodData) {
    const patterns = [];
    
    // Group by time of day
    const timeSlots = {
        morning: { sum: 0, count: 0 }, // 6am-12pm
        afternoon: { sum: 0, count: 0 }, // 12pm-6pm
        evening: { sum: 0, count: 0 }, // 6pm-12am
        night: { sum: 0, count: 0 } // 12am-6am
    };
    
    // Group by day of week
    const dayAverages = Array(7).fill(0).map(() => ({ sum: 0, count: 0 }));
    
    moodData.forEach(entry => {
        const date = new Date(entry.date);
        const hours = date.getHours();
        const day = date.getDay();
        
        // Time slot analysis
        if (hours >= 6 && hours < 12) {
            timeSlots.morning.sum += entry.mood;
            timeSlots.morning.count++;
        } else if (hours >= 12 && hours < 18) {
            timeSlots.afternoon.sum += entry.mood;
            timeSlots.afternoon.count++;
        } else if (hours >= 18 && hours < 24) {
            timeSlots.evening.sum += entry.mood;
            timeSlots.evening.count++;
        } else {
            timeSlots.night.sum += entry.mood;
            timeSlots.night.count++;
        }
        
        // Day of week analysis
        dayAverages[day].sum += entry.mood;
        dayAverages[day].count++;
    });
    
    // Find best/worst time of day
    const timeResults = [];
    Object.entries(timeSlots).forEach(([time, data]) => {
        if (data.count > 0) {
            timeResults.push({
                time,
                average: data.sum / data.count,
                count: data.count
            });
        }
    });
    
    timeResults.sort((a, b) => b.average - a.average);
    
    if (timeResults.length > 1) {
        patterns.push({
            type: "daily_pattern",
            message: `Your mood is best during ${timeResults[0].time} (avg: ${timeResults[0].average.toFixed(1)}) and lowest during ${timeResults[timeResults.length-1].time} (avg: ${timeResults[timeResults.length-1].average.toFixed(1)})`
        });
    }
    
    // Find best/worst day of week
    const dayResults = dayAverages
        .map((data, index) => ({
            day: index,
            average: data.count > 0 ? data.sum / data.count : 0,
            count: data.count
        }))
        .filter(data => data.count > 0);
    
    dayResults.sort((a, b) => b.average - a.average);
    
    if (dayResults.length > 1) {
        const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        patterns.push({
            type: "weekly_pattern",
            message: `Your best mood days are ${days[dayResults[0].day]}s (avg: ${dayResults[0].average.toFixed(1)}) and most challenging are ${days[dayResults[dayResults.length-1].day]}s (avg: ${dayResults[dayResults.length-1].average.toFixed(1)})`
        });
    }
    
    // Tag-based patterns
    const tagAnalysis = {};
    moodData.forEach(entry => {
        entry.tags.forEach(tag => {
            if (!tagAnalysis[tag]) tagAnalysis[tag] = { sum: 0, count: 0 };
            tagAnalysis[tag].sum += entry.mood;
            tagAnalysis[tag].count++;
        });
    });
    
    const tagResults = Object.entries(tagAnalysis)
        .map(([tag, data]) => ({
            tag,
            average: data.sum / data.count,
            count: data.count
        }))
        .filter(data => data.count >= 3); // Only include tags with sufficient data
    
    if (tagResults.length > 0) {
        tagResults.sort((a, b) => b.average - a.average);
        
        patterns.push({
            type: "tag_based",
            message: `Your mood is highest when tagging "${tagResults[0].tag}" (avg: ${tagResults[0].average.toFixed(1)}) and lowest with "${tagResults[tagResults.length-1].tag}" (avg: ${tagResults[tagResults.length-1].average.toFixed(1)})`
        });
    }
    
    return patterns;
}

// Find mood correlations
function findMoodCorrelations(moodData) {
    const correlations = [];
    
    // This would typically involve more complex statistical analysis
    // For now, we'll provide some basic insights
    
    if (moodData.length > 10) {
        // Simple trend analysis
        const recentMood = moodData.slice(-7).map(entry => entry.mood);
        const averageRecent = recentMood.reduce((a, b) => a + b, 0) / recentMood.length;
        const overallAverage = moodData.reduce((sum, entry) => sum + entry.mood, 0) / moodData.length;
        
        if (averageRecent > overallAverage + 0.5) {
            correlations.push({
                factor: "Recent improvement",
                strength: 75,
                message: "Your mood has been improving recently"
            });
        } else if (averageRecent < overallAverage - 0.5) {
            correlations.push({
                factor: "Recent decline",
                strength: 75,
                message: "Your mood has been declining recently"
            });
        }
    }
    
    return correlations;
}

// Generate mood predictions
function generateMoodPredictions(moodData) {
    const predictions = [];
    
    if (moodData.length > 14) {
        // Simple prediction based on recent trend
        const recentMood = moodData.slice(-7).map(entry => entry.mood);
        const trend = calculateTrend(recentMood);
        
        if (trend > 0.1) {
            predictions.push({
                trend: "improving",
                message: "Based on your recent upward trend, your mood is likely to continue improving"
            });
        } else if (trend < -0.1) {
            predictions.push({
                trend: "declining",
                message: "Your recent pattern suggests your mood may continue to be challenging"
            });
        }
    }
    
    return predictions;
}

// Helper function for trend calculation
function calculateTrend(data) {
    if (data.length < 2) return 0;
    
    const n = data.length;
    let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0;
    
    data.forEach((y, i) => {
        const x = i;
        sumX += x;
        sumY += y;
        sumXY += x * y;
        sumXX += x * x;
    });
    
    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    return slope;
}

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

// Wellness Tools API endpoints

// Get user wellness progress
app.get("/api/wellness/:userId", async (req, res) => {
    try {
        const { userId } = req.params;
        
        const wellnessData = await Wellness.findOne({ userId });
        
        if (!wellnessData) {
            // Create initial wellness profile
            const newWellness = new Wellness({
                userId,
                points: 100, // Starting points
                unlockedTools: ['breathing', 'journal'],
                purchasedItems: [],
                lastCheckIn: new Date(),
                streak: 0
            });
            await newWellness.save();
            
            return res.json({ success: true, data: newWellness });
        }
        
        res.json({ success: true, data: wellnessData });
        
    } catch (error) {
        console.error("Error fetching wellness data:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

// Update wellness progress
app.post("/api/wellness/:userId", async (req, res) => {
    try {
        const { userId } = req.params;
        const { pointsEarned, toolUsed, purchase } = req.body;
        
        let wellnessData = await Wellness.findOne({ userId });
        
        if (!wellnessData) {
            wellnessData = new Wellness({ userId });
        }
        
        // Update points if earned
        if (pointsEarned) {
            wellnessData.points += pointsEarned;
        }
        
        // Record tool usage
        if (toolUsed && !wellnessData.unlockedTools.includes(toolUsed)) {
            wellnessData.unlockedTools.push(toolUsed);
        }
        
        // Process purchase
        if (purchase) {
            const shopItem = SHOP_ITEMS.find(item => item.id === purchase);
            if (shopItem && wellnessData.points >= shopItem.price) {
                wellnessData.points -= shopItem.price;
                wellnessData.purchasedItems.push(purchase);
            } else {
                return res.status(400).json({ 
                    success: false, 
                    message: "Not enough points or invalid item" 
                });
            }
        }
        
        // Update streak if they've used a tool today
        const lastCheckIn = new Date(wellnessData.lastCheckIn);
        const today = new Date();
        
        if (lastCheckIn.toDateString() !== today.toDateString()) {
            // Check if yesterday was consecutive
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            
            if (lastCheckIn.toDateString() === yesterday.toDateString()) {
                wellnessData.streak += 1;
            } else {
                wellnessData.streak = 1; // Reset streak
            }
            
            wellnessData.lastCheckIn = today;
        }
        
        await wellnessData.save();
        
        res.json({ success: true, data: wellnessData });
        
    } catch (error) {
        console.error("Error updating wellness data:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

// Get shop items
app.get("/api/wellness/shop/items", async (req, res) => {
    res.json({ success: true, data: SHOP_ITEMS });
});

// Define shop items (could move to a separate file)
const SHOP_ITEMS = [
    {
        id: "premium_themes",
        name: "Premium Themes",
        description: "Unlock beautiful color themes for your wellness tools",
        price: 200,
        type: "cosmetic"
    },
    {
        id: "guided_meditations",
        name: "Premium Meditations",
        description: "Access exclusive guided meditation sessions",
        price: 300,
        type: "content"
    },
    {
        id: "relaxation_music",
        name: "Relaxation Music Pack",
        description: "Get full access to therapeutic music library",
        price: 250,
        type: "content"
    },
    {
        id: "streak_freeze",
        name: "Streak Freeze",
        description: "Protect your streak if you miss a day",
        price: 150,
        type: "utility"
    },
    {
        id: "double_points",
        name: "Double Points (7 days)",
        description: "Earn double points on all activities for 7 days",
        price: 350,
        type: "boost"
    }
];

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

app.get('/wellness-tools', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/html/wellness-tools.html'));
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


const availableDays = {
  "1": "Monday",
  "2": "Tuesday",
  "3": "Wednesday",
  "4": "Thursday",
  "5": "Friday",
};

const availableTimes = {
  "1":"now",
  "2": "10:00",
  "3": "14:00",
  "4": "16:00",
};

const psychologists = {
  "1": "Dr. Smith",
  "2": "Dr. Johnson",
  "3": "Dr. Lee",
};

// --- USSD HANDLER ---
app.post(["/ussd", "/384"], (req, res) => {
  const { sessionId, phoneNumber, text } = req.body;

  if (!sessions[sessionId]) {
    sessions[sessionId] = { step: 0, booking: {} };
  }

  const session = sessions[sessionId];

  // FIX: always use the last input after "*"
  const parts = text.trim().split("*");
  const userResponse = parts[parts.length - 1];

  console.log(
    "Session:",
    sessionId,
    "Step:",
    session.step,
    "Input:",
    userResponse,
    "Raw text:",
    text
  );

  let response = "";

  switch (session.step) {
    case 0:
      response = `CON Welcome to Mentaly!\n1. Book Appointment\n2. Info`;
      session.step = 1;
      break;

    case 1:
      if (userResponse === "1") {
        response = "CON Select a day:\n1 Mon\n2 Tue\n3 Wed\n4 Thu\n5 Fri";
        session.step = 2;
      } else if (userResponse === "2") {
        response =
          "END Mentaly offers mental health support via phone and app. Thank you!";
        delete sessions[sessionId];
      } else {
        response = "CON Invalid option. Please enter 1 or 2.";
      }
      break;

    case 2:
      if (availableDays[userResponse]) {
        session.booking.day = availableDays[userResponse];
        response = "CON Choose a time:\n1 now\n2 10:00\n3 14:00\n4 16:00";
        session.step = 3;
      } else {
        response = "CON Invalid day. Please select 1-5.";
      }
      break;

    case 3:
      if (availableTimes[userResponse]) {
        session.booking.time = availableTimes[userResponse];
        response = "CON Choose a psychologist:\n1 Dr. Smith\n2 Dr. Johnson\n3 Dr. Lee";
        session.step = 4;
      } else {
        response = "CON Invalid time. Please select 1-3.";
      }
      break;

    case 4:
      if (psychologists[userResponse]) {
        session.booking.psychologist = psychologists[userResponse];
        response = `CON Confirm booking for ${session.booking.day} at ${session.booking.time} with ${session.booking.psychologist}?\n1 Yes\n2 No`;
        session.step = 5;
      } else {
        response = "CON Invalid choice. Please select 1-3.";
      }
      break;

    case 5:
      if (userResponse === "1") {
        const message = `Your appointment is booked for ${session.booking.day} at ${session.booking.time} with ${session.booking.psychologist}. Thank you for choosing Psych Connect!`;

        sms
          .send({ to: [phoneNumber], message })
          .then(() => console.log(`SMS sent to ${phoneNumber}`))
          .catch(console.error);

        response = `END Booking confirmed for ${session.booking.day} at ${session.booking.time} with ${session.booking.psychologist}. You will receive an SMS confirmation.`;
        delete sessions[sessionId];
      } else if (userResponse === "2") {
        response = "END Booking cancelled. To start again dial *384#";
        delete sessions[sessionId];
      } else {
        response = "CON Invalid input. Please enter 1 or 2.";
      }
      break;

    default:
      response = "END An error occurred. Please try again.";
      delete sessions[sessionId];
  }

  res.set("Content-Type", "text/plain");
  res.send(response);
});
