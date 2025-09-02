import mongoose from 'mongoose';

const assessmentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        required: true,
        enum: ['PHQ-9', 'GAD-7', 'PHQ-15', 'WHO-5']
    },
    answers: [{
        questionId: Number,
        value: Number,
        text: String
    }],
    score: {
        type: Number,
        required: true
    },
    severity: {
        type: String,
        enum: ['None', 'Mild', 'Moderate', 'Moderately Severe', 'Severe']
    },
    date: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Create index for faster queries
assessmentSchema.index({ userId: 1, type: 1, date: 1 });

export const Assessment = mongoose.model('Assessment', assessmentSchema);