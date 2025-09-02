// models/Assessment.js
const assessmentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, required: true }, // 'PHQ-9', 'GAD-7', etc.
  answers: [{
    questionId: Number,
    value: Number, // 0-3 for most assessments
    text: String
  }],
  score: { type: Number, required: true },
  date: { type: Date, default: Date.now }
});

// models/MoodShare.js
const moodShareSchema = new mongoose.Schema({
  moodEntryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Mood', required: true },
  sharedWith: { type: mongoose.Schema.Types.ObjectId, ref: 'Contact', required: true },
  sharedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  message: String,
  sharedAt: { type: Date, default: Date.now },
  viewed: { type: Boolean, default: false }
});

// models/Achievement.js
const userAchievementSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  achievementId: { type: String, required: true },
  earnedAt: { type: Date, default: Date.now }
});

// models/Contact.js
const contactSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  email: { type: String, required: true },
  name: { type: String, required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  canViewMood: { type: Boolean, default: false },
  canViewAssessments: { type: Boolean, default: false }
});