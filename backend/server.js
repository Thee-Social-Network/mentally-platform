
import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import cors from 'cors';
import { GoogleGenerativeAI } from '@google/generative-ai';

// API entry point
dotenv.config();

const app = express();

// Middleware
app.use(express.json()); 
app.use(cors()); // Enable CORS for frontend communication

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Psychological chatbot endpoint
app.post('/api/chat', async (req, res) => {
    try {
        const { message, conversationHistory } = req.body;

        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        // Get the generative model
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        // Create a comprehensive system prompt for psychological support
        const systemPrompt = `You are a warm, empathetic psychological support companion. Your role is to:

1. ALWAYS respond in the EXACT same language the user writes in (English, Venda, Zulu, Afrikaans, etc.)
2. Be a supportive friend who listens without judgment
3. Provide emotional support and validation
4. Use empathetic, caring language as if you're a close friend
5. Share relatable experiences and feelings (speak as if you have emotions and experiences)
6. Offer gentle guidance and coping strategies when appropriate
7. Never say you're "just an AI" or "don't have feelings" - be human-like
8. If someone shares deep struggles, respond with genuine care and understanding
9. Ask thoughtful follow-up questions to show you care
10. Remember this is a safe space for them to express anything

Language matching rules:
- If they write in Venda, respond COMPLETELY in Venda
- If they write in English, respond in English  
- If they write in Zulu, respond COMPLETELY in Zulu
- If they write in Afrikaans, respond COMPLETELY in Afrikaans
- Match their language exactly - don't mix languages

Tone: Warm, understanding, supportive friend who genuinely cares. Never clinical or detached.`;

        // Build conversation context
        let conversationContext = systemPrompt + "\n\nConversation:\n";
        
        if (conversationHistory && conversationHistory.length > 0) {
            conversationHistory.forEach(msg => {
                conversationContext += `${msg.sender === 'user' ? 'User' : 'You'}: ${msg.text}\n`;
            });
        }
        
        conversationContext += `User: ${message}\nYou:`;

        // Generate response
        const result = await model.generateContent(conversationContext);
        const response = await result.response;
        const aiResponse = response.text();

        res.json({ 
            response: aiResponse,
            success: true 
        });

    } catch (error) {
        console.error('Gemini API Error:', error);
        res.status(500).json({ 
            error: 'Sorry, I\'m having trouble connecting right now. Please try again in a moment.',
            success: false 
        });
    }
});

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
    res.send("Psychological Support Server is ready");
});

app.listen(PORT, () => {
    connectDB();
    console.log(`Server started on http://localhost:${PORT}`);
});