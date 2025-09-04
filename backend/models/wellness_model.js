import mongoose from 'mongoose';

const wellnessSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    points: {
        type: Number,
        default: 100
    },
    unlockedTools: [{
        type: String,
        enum: ['breathing', 'journal', 'meditation', 'music', 'exercise', 'sleep', 'puzzle', 'coloring', 'gratitude']
    }],
    purchasedItems: [{
        type: String
    }],
    lastCheckIn: {
        type: Date,
        default: Date.now
    },
    streak: {
        type: Number,
        default: 0
    },
    achievements: [{
        achievementId: String,
        earnedAt: {
            type: Date,
            default: Date.now
        }
    }]
}, {
    timestamps: true
});

// Add index for faster queries
wellnessSchema.index({ userId: 1 });

export const Wellness = mongoose.model('Wellness', wellnessSchema);