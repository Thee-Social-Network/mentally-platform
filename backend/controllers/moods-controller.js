import { Mood } from "../models/mood_model.js";

export const getMood = async (req, res) => {
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
};