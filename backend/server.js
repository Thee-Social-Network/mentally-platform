
import express from 'express';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import {connectDB} from './config/db.js'
import {User} from './models/user_model.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Mood } from './models/mood_model.js';
import { Assessment } from './models/assessment_model.js';

//API entry point

dotenv.config();

const app = express();

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

app.get("/api/assessments/:type", async (req, res) => {
    try {
        const { type } = req.params;
        const validTypes = ['PHQ-9', 'GAD-7', 'PHQ-15', 'WHO-5'];
        
        if (!validTypes.includes(type)) {
            return res.status(400).json({ success: false, message: "Invalid assessment type" });
        }
        
        const assessment = getAssessmentQuestions(type);
        res.json({ success: true, data: assessment });
        
    } catch (error) {
        console.error("Error fetching assessment:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

app.post("/api/assessments", async (req, res) => {
    try {
        const { userId, type, answers } = req.body;
        
        if (!userId || !type || !answers) {
            return res.status(400).json({ success: false, message: "Missing required fields" });
        }
        
        // Calculate score based on assessment type
        const score = calculateAssessmentScore(type, answers);
        const severity = determineSeverity(type, score);
        
        // Save assessment
        const assessment = new Assessment({
            userId,
            type,
            answers,
            score,
            severity,
            date: new Date()
        });
        
        await assessment.save();
        
        res.json({ 
            success: true, 
            message: "Assessment completed successfully",
            data: {
                score,
                severity,
                interpretation: getInterpretation(type, score, severity),
                recommendations: getRecommendations(type, score, severity)
            }
        });
        
    } catch (error) {
        console.error("Error saving assessment:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

app.get("/api/assessments/history/:userId", async (req, res) => {
    try {
        const { userId } = req.params;
        const { type, limit = 10 } = req.query;
        
        const query = { userId };
        if (type) query.type = type;
        
        const assessments = await Assessment.find(query)
            .sort({ date: -1 })
            .limit(parseInt(limit));
        
        res.json({ success: true, data: assessments });
        
    } catch (error) {
        console.error("Error fetching assessment history:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

// Helper functions for assessments
function getAssessmentQuestions(type) {
    const assessments = {
        'PHQ-9': {
            title: "PHQ-9 Depression Questionnaire",
            description: "Over the last 2 weeks, how often have you been bothered by any of the following problems?",
            instructions: "Select the option that best describes how often you've experienced each symptom",
            questions: [
                { id: 1, text: "Little interest or pleasure in doing things", },
                { id: 2, text: "Feeling down, depressed, or hopeless", },
                { id: 3, text: "Trouble falling or staying asleep, or sleeping too much", },
                { id: 4, text: "Feeling tired or having little energy", },
                { id: 5, text: "Poor appetite or overeating", },
                { id: 6, text: "Feeling bad about yourself - or that you are a failure or have let yourself or your family down", },
                { id: 7, text: "Trouble concentrating on things, such as reading the newspaper or watching television", },
                { id: 8, text: "Moving or speaking so slowly that other people could have noticed? Or the opposite - being so fidgety or restless that you have been moving around a lot more than usual", },
                { id: 9, text: "Thoughts that you would be better off dead or of hurting yourself in some way", }
            ],
            options: [
                { value: 0, label: "Not at all" },
                { value: 1, label: "Several days" },
                { value: 2, label: "More than half the days" },
                { value: 3, label: "Nearly every day" }
            ]
        },
        'GAD-7': {
            title: "GAD-7 Anxiety Questionnaire",
            description: "Over the last 2 weeks, how often have you been bothered by the following problems?",
            instructions: "Select the option that best describes how often you've experienced each symptom",
            questions: [
                { id: 1, text: "Feeling nervous, anxious, or on edge", },
                { id: 2, text: "Not being able to stop or control worrying", },
                { id: 3, text: "Worrying too much about different things", },
                { id: 4, text: "Trouble relaxing", },
                { id: 5, text: "Being so restless that it is hard to sit still", },
                { id: 6, text: "Becoming easily annoyed or irritable", },
                { id: 7, text: "Feeling afraid as if something awful might happen", }
            ],
            options: [
                { value: 0, label: "Not at all" },
                { value: 1, label: "Several days" },
                { value: 2, label: "More than half the days" },
                { value: 3, label: "Nearly every day" }
            ]
        }
    };
    
    return assessments[type] || null;
}

function calculateAssessmentScore(type, answers) {
    return answers.reduce((total, answer) => total + answer.value, 0);
}

function determineSeverity(type, score) {
    if (type === 'PHQ-9') {
        if (score >= 20) return 'Severe';
        if (score >= 15) return 'Moderately Severe';
        if (score >= 10) return 'Moderate';
        if (score >= 5) return 'Mild';
        return 'None';
    }
    
    if (type === 'GAD-7') {
        if (score >= 15) return 'Severe';
        if (score >= 10) return 'Moderate';
        if (score >= 5) return 'Mild';
        return 'None';
    }
    
    return 'None';
}

function getInterpretation(type, score, severity) {
    if (type === 'PHQ-9') {
        return {
            title: `Depression Severity: ${severity}`,
            description: `Your PHQ-9 score is ${score}, which suggests ${severity.toLowerCase()} depression.`,
            details: getPHQ9InterpretationDetails(score, severity)
        };
    }
    
    if (type === 'GAD-7') {
        return {
            title: `Anxiety Severity: ${severity}`,
            description: `Your GAD-7 score is ${score}, which suggests ${severity.toLowerCase()} anxiety.`,
            details: getGAD7InterpretationDetails(score, severity)
        };
    }
    
    return { title: "Assessment Complete", description: `Your score is ${score}` };
}

function getRecommendations(type, score, severity) {
    const recommendations = [];
    
    if (type === 'PHQ-9') {
        if (score >= 15) {
            recommendations.push("Consider consulting with a mental health professional");
            recommendations.push("Regular follow-up is recommended for monitoring");
        }
        if (score >= 10) {
            recommendations.push("Consider therapy options such as CBT");
            recommendations.push("Practice regular self-care activities");
        }
        if (score >= 5) {
            recommendations.push("Increase physical activity and social connection");
            recommendations.push("Practice mindfulness and relaxation techniques");
        }
        
        recommendations.push("Consider retaking this assessment in 2 weeks");
    }
    
    if (type === 'GAD-7') {
        if (score >= 10) {
            recommendations.push("Consider consulting with a mental health professional");
            recommendations.push("Practice anxiety management techniques regularly");
        }
        if (score >= 5) {
            recommendations.push("Try relaxation exercises like deep breathing");
            recommendations.push("Limit caffeine and ensure adequate sleep");
        }
        
        recommendations.push("Consider retaking this assessment in 2 weeks");
    }
    
    // Add crisis resources for high scores
    if (score >= 15) {
        recommendations.push("If you're in crisis, please contact emergency services or a crisis hotline immediately");
    }
    
    return recommendations;
}

function getPHQ9InterpretationDetails(score, severity) {
    const details = {
        'None': "Your responses suggest minimal depressive symptoms. Continue practicing good mental health habits.",
        'Mild': "You may be experiencing mild depressive symptoms. Monitoring your mood and practicing self-care may be helpful.",
        'Moderate': "Your responses suggest moderate depressive symptoms. Consider seeking support from a mental health professional.",
        'Moderately Severe': "You may be experiencing moderately severe depressive symptoms. Professional support is recommended.",
        'Severe': "Your responses suggest severe depressive symptoms. We strongly recommend consulting with a mental health professional as soon as possible."
    };
    
    return details[severity] || details['None'];
}

function getGAD7InterpretationDetails(score, severity) {
    const details = {
        'None': "Your responses suggest minimal anxiety symptoms. Continue practicing good mental health habits.",
        'Mild': "You may be experiencing mild anxiety symptoms. Stress management techniques may be helpful.",
        'Moderate': "Your responses suggest moderate anxiety symptoms. Consider learning anxiety management strategies.",
        'Severe': "Your responses suggest severe anxiety symptoms. We recommend consulting with a mental health professional for support."
    };
    
    return details[severity] || details['None'];
}

// Helper function for mock data
function generateMockMoodData(days = 30) {
    const data = [];
    const tags = ['work', 'family', 'friends', 'health', 'sleep', 'exercise', 'weather', 'news'];
    
    for (let i = 0; i < days; i++) {
        const date = new Date();
        date.setDate(date.getDate() - (days - i - 1));
        
        data.push({
            date: date.toISOString().split('T')[0],
            mood: Math.floor(Math.random() * 5) + 1,
            tags: [tags[Math.floor(Math.random() * tags.length)]],
            notes: i % 5 === 0 ? 'Had a pretty good day today' : ''
        });
    }
    
    return data;
}

// Enhanced Mood Analytics API Endpoints

// Get advanced mood analytics
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
        
        if (moodData.length < 5) {
            return res.json({ 
                success: true, 
                data: {} // Not enough data for analytics
            });
        }
        
        // Perform advanced analytics
        const patterns = detectMoodPatterns(moodData);
        const correlations = findMoodCorrelations(moodData);
        const predictions = generateMoodPredictions(moodData);
        
        res.json({ 
            success: true, 
            data: { patterns, correlations, predictions }
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
- If they write in Venda, respond COMPLETELY in Venda using natural Venda expressions
- If they write in English, respond in English
- If they write in Zulu, respond in Zulu
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
app.get('/assessments', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/html/assessments.html'));
});
app.listen(PORT, () =>{
    connectDB();
    console.log(`Server started on http://localhost:${PORT}`);
    console.log(`AI Configuration: ${process.env.GEMINI_API_KEY ? 'Configured ✅' : 'Missing GEMINI_API_KEY ❌'}`);
});