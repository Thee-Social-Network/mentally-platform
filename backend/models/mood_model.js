import mongoose from 'mongoose';

const moodSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    mood: {
        type: Number,
        required: true,
        min: 1,
        max: 10
    },
    tags: [{
        type: String,
        enum: ["work", "family", "friends", "health", "sleep", "exercise", "weather", "news"]
    }],
    notes: {
        type: String,
        default: ""
    },
    date: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Create index for faster queries
moodSchema.index({ userId: 1, date: 1 });

export const Mood = mongoose.model('Mood', moodSchema);